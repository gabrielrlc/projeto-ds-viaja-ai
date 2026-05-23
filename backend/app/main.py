import logging
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError

from app.db.database import get_db
from app.db.models import Itinerary, ChatSession, ChatMessage
from app.schemas.chat import MensagemChat, RespostaChat, ItineraryOut, ModificarRoteiro, RespostaModificacao
from app.services.sessao import criar_sessao, obter_sessao, salvar_sessao, deletar_sessao
from app.services.chat_flow import processar_mensagem
from app.ia.llm_client import modificar_roteiro, gerar_roteiro

logger = logging.getLogger(__name__)

app = FastAPI(title="ViajaAI API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Handlers globais de erro
# ---------------------------------------------------------------------------

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Transforma os erros de validação do Pydantic em respostas legíveis."""
    erros = []
    for error in exc.errors():
        campo = " → ".join(str(p) for p in error["loc"] if p != "body")
        erros.append(f"{campo}: {error['msg']}" if campo else error["msg"])
    return JSONResponse(
        status_code=422,
        content={"detail": "Dados inválidos na requisição.", "erros": erros},
    )


@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    """Captura erros de banco de dados não tratados localmente."""
    logger.exception("Erro de banco de dados não tratado: %s", exc)
    return JSONResponse(
        status_code=503,
        content={"detail": "Serviço de banco de dados indisponível. Tente novamente em instantes."},
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """Fallback para qualquer exceção não prevista."""
    logger.exception("Erro interno não tratado: %s", exc)
    return JSONResponse(
        status_code=500,
        content={"detail": "Erro interno do servidor. Nossa equipe foi notificada."},
    )


# ---------------------------------------------------------------------------
# Status
# ---------------------------------------------------------------------------

@app.get("/api/status")
def check_status():
    return {"status": "online", "mensagem": "Servidor do ViajaAI rodando com sucesso!", "versao": "2.0.0"}


# ---------------------------------------------------------------------------
# Chat
# ---------------------------------------------------------------------------

@app.post("/api/chat/iniciar", response_model=RespostaChat)
async def iniciar_chat(db: AsyncSession = Depends(get_db)):
    try:
        sessao = criar_sessao()

        chat_session = ChatSession(sessao_id=sessao.sessao_id, etapa_atual="destino")
        db.add(chat_session)
        await db.commit()

        salvar_sessao(sessao)
    except SQLAlchemyError as exc:
        logger.error("Erro ao iniciar chat no banco: %s", exc)
        await db.rollback()
        raise HTTPException(status_code=503, detail="Não foi possível iniciar o chat. Tente novamente.")

    return RespostaChat(
        sessao_id=sessao.sessao_id,
        etapa_atual="destino",
        mensagem_bot=(
            "Olá! Bem-vindo ao ViajaAI ✈️\n\n"
            "Vamos planejar sua viagem dos sonhos!\n\n"
            "Primeiro: qual é o seu destino?"
        ),
    )


@app.post("/api/chat/mensagem", response_model=RespostaChat)
async def enviar_mensagem(body: MensagemChat, db: AsyncSession = Depends(get_db)):
    # Validação de sessão
    sessao = obter_sessao(body.sessao_id)
    if not sessao:
        raise HTTPException(status_code=404, detail="Sessão não encontrada. Inicie um novo chat.")

    try:
        result = await db.execute(
            select(ChatSession).where(ChatSession.sessao_id == body.sessao_id)
        )
        chat_session = result.scalar_one_or_none()
    except SQLAlchemyError as exc:
        logger.error("Erro ao buscar sessão no banco: %s", exc)
        raise HTTPException(status_code=503, detail="Erro ao acessar o banco de dados. Tente novamente.")

    # Processamento da mensagem pela LLM
    try:
        resposta = await processar_mensagem(sessao, body.mensagem)
    except RuntimeError as exc:
        # Erros já tratados e com mensagem amigável vindos do llm_client
        raise HTTPException(status_code=502, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    salvar_sessao(sessao)

    # Persistência no banco
    try:
        if chat_session:
            db.add(ChatMessage(role="user", content=body.mensagem, session_id=chat_session.id))
            db.add(ChatMessage(role="assistant", content=resposta.mensagem_bot, session_id=chat_session.id))

            if resposta.roteiro:
                itinerary = Itinerary(destination=sessao.destino, content=resposta.roteiro)
                db.add(itinerary)
                await db.flush()
                chat_session.itinerary_id = itinerary.id
                chat_session.etapa_atual = resposta.etapa_atual
                resposta.itinerary_id = itinerary.id

            await db.commit()
    except SQLAlchemyError as exc:
        logger.error("Erro ao salvar mensagem no banco: %s", exc)
        await db.rollback()
        # A resposta já foi gerada; avisamos sem interromper o chat
        resposta.dados_extra = resposta.dados_extra or {}
        resposta.dados_extra["aviso"] = "Mensagem processada, mas não foi possível salvar o histórico."

    return resposta


@app.delete("/api/chat/{sessao_id}")
async def encerrar_chat(sessao_id: str, db: AsyncSession = Depends(get_db)):
    deletar_sessao(sessao_id)

    try:
        result = await db.execute(select(ChatSession).where(ChatSession.sessao_id == sessao_id))
        chat_session = result.scalar_one_or_none()
        if chat_session:
            chat_session.etapa_atual = "encerrada"
            await db.commit()
    except SQLAlchemyError as exc:
        logger.error("Erro ao encerrar sessão no banco: %s", exc)
        await db.rollback()
        # Sessão já foi removida da memória; informamos sem lançar erro crítico

    return {"mensagem": "Sessão encerrada."}


# ---------------------------------------------------------------------------
# Viagens
# ---------------------------------------------------------------------------

@app.get("/api/viagens", response_model=list[ItineraryOut])
async def listar_viagens(db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(Itinerary))
        return result.scalars().all()
    except SQLAlchemyError as exc:
        logger.error("Erro ao listar viagens: %s", exc)
        raise HTTPException(status_code=503, detail="Não foi possível carregar as viagens. Tente novamente.")


@app.get("/api/viagens/{viagem_id}", response_model=ItineraryOut)
async def obter_viagem(viagem_id: int, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(Itinerary).where(Itinerary.id == viagem_id))
        viagem = result.scalar_one_or_none()
    except SQLAlchemyError as exc:
        logger.error("Erro ao buscar viagem %s: %s", viagem_id, exc)
        raise HTTPException(status_code=503, detail="Erro ao acessar o banco de dados. Tente novamente.")

    if not viagem:
        raise HTTPException(status_code=404, detail="Viagem não encontrada.")

    return viagem


@app.post("/api/viagens/{viagem_id}/modificar", response_model=RespostaModificacao)
async def modificar_viagem(viagem_id: int, body: ModificarRoteiro, db: AsyncSession = Depends(get_db)):
    # Busca no banco
    try:
        result = await db.execute(select(Itinerary).where(Itinerary.id == viagem_id))
        viagem = result.scalar_one_or_none()
    except SQLAlchemyError as exc:
        logger.error("Erro ao buscar viagem %s para modificação: %s", viagem_id, exc)
        raise HTTPException(status_code=503, detail="Erro ao acessar o banco de dados. Tente novamente.")

    if not viagem:
        raise HTTPException(status_code=404, detail="Viagem não encontrada.")
    if not viagem.content:
        raise HTTPException(status_code=400, detail="Esta viagem não possui roteiro gerado.")

    # Chamada à LLM
    try:
        roteiro_modificado = await modificar_roteiro(viagem.content, body.instrucao)
    except RuntimeError as exc:
        # Timeout, serviço indisponível, erro de API — mensagem já amigável
        raise HTTPException(status_code=502, detail=str(exc))
    except ValueError as exc:
        # JSON malformado, resposta vazia, estrutura inválida
        raise HTTPException(status_code=422, detail=str(exc))

    # Persistência do roteiro modificado
    try:
        viagem.content = roteiro_modificado
        await db.commit()
        await db.refresh(viagem)
    except SQLAlchemyError as exc:
        logger.error("Erro ao salvar roteiro modificado da viagem %s: %s", viagem_id, exc)
        await db.rollback()
        raise HTTPException(
            status_code=503,
            detail="O roteiro foi gerado pela IA, mas não foi possível salvá-lo. Tente novamente.",
        )

    return RespostaModificacao(
        id=viagem.id,
        destination=viagem.destination,
        roteiro=roteiro_modificado,
        mensagem=f"Roteiro de {viagem.destination} atualizado com sucesso! ✏️",
    )


@app.delete("/api/viagens/{viagem_id}")
async def deletar_viagem(viagem_id: int, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(Itinerary).where(Itinerary.id == viagem_id))
        viagem = result.scalar_one_or_none()
    except SQLAlchemyError as exc:
        logger.error("Erro ao buscar viagem %s para deletar: %s", viagem_id, exc)
        raise HTTPException(status_code=503, detail="Erro ao acessar o banco de dados. Tente novamente.")

    if not viagem:
        raise HTTPException(status_code=404, detail="Viagem não encontrada.")

    try:
        await db.delete(viagem)
        await db.commit()
    except SQLAlchemyError as exc:
        logger.error("Erro ao deletar viagem %s: %s", viagem_id, exc)
        await db.rollback()
        raise HTTPException(status_code=503, detail="Não foi possível remover a viagem. Tente novamente.")

    return {"mensagem": "Viagem removida do histórico."}