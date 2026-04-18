from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from models.chat import MensagemChat, RespostaChat
from services.sessao import criar_sessao, obter_sessao, salvar_sessao, deletar_sessao
from services.chat_flow import processar_mensagem

app = FastAPI(title="ViajaAI API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

_viagens_salvas: list[dict] = []


@app.get("/api/status")
def check_status():
    return {"status": "online", "mensagem": "Servidor do ViajaAI rodando com sucesso!", "versao": "2.0.0"}


@app.post("/api/chat/iniciar", response_model=RespostaChat)
def iniciar_chat():
    sessao = criar_sessao()
    salvar_sessao(sessao)
    return RespostaChat(
        sessao_id=sessao.sessao_id,
        etapa_atual="destino",
        mensagem_bot="Olá! Bem-vindo ao ViajaAI ✈️\n\nVamos planejar sua viagem dos sonhos!\n\nPrimeiro: qual é o seu destino?",
    )


@app.post("/api/chat/mensagem", response_model=RespostaChat)
async def enviar_mensagem(body: MensagemChat):
    sessao = obter_sessao(body.sessao_id)
    if not sessao:
        raise HTTPException(status_code=404, detail="Sessão não encontrada. Inicie um novo chat.")

    resposta = await processar_mensagem(sessao, body.mensagem)
    salvar_sessao(sessao)

    if resposta.roteiro:
        _viagens_salvas.append({
            "id": len(_viagens_salvas) + 1,
            "destino": sessao.destino,
            "data_ida": sessao.data_ida,
            "data_volta": sessao.data_volta,
            "num_pessoas": sessao.num_pessoas,
            "estilo": sessao.estilo,
            "roteiro": resposta.roteiro,
            "criado_em": datetime.now().isoformat(),
        })

    return resposta


@app.delete("/api/chat/{sessao_id}")
def encerrar_chat(sessao_id: str):
    deletar_sessao(sessao_id)
    return {"mensagem": "Sessão encerrada."}


@app.get("/api/viagens")
def listar_viagens():
    resumo = [
        {"id": v["id"], "destino": v["destino"], "data_ida": v["data_ida"],
         "data_volta": v["data_volta"], "num_pessoas": v["num_pessoas"],
         "estilo": v["estilo"], "criado_em": v["criado_em"]}
        for v in _viagens_salvas
    ]
    return {"viagens": resumo, "total": len(resumo)}


@app.get("/api/viagens/{viagem_id}")
def obter_viagem(viagem_id: int):
    viagem = next((v for v in _viagens_salvas if v["id"] == viagem_id), None)
    if not viagem:
        raise HTTPException(status_code=404, detail="Viagem não encontrada.")
    return viagem


@app.post("/api/viagens/{viagem_id}/repetir", response_model=RespostaChat)
def repetir_viagem(viagem_id: int):
    viagem = next((v for v in _viagens_salvas if v["id"] == viagem_id), None)
    if not viagem:
        raise HTTPException(status_code=404, detail="Viagem não encontrada.")
    sessao = criar_sessao()
    sessao.destino = viagem["destino"]
    sessao.num_pessoas = viagem["num_pessoas"]
    sessao.estilo = viagem["estilo"]
    sessao.etapa = "datas"
    salvar_sessao(sessao)
    return RespostaChat(
        sessao_id=sessao.sessao_id,
        etapa_atual="datas",
        mensagem_bot=(
            f"Vamos repetir a viagem para {sessao.destino}! 🔁\n\n"
            f"Já pré-preenchi o destino e o número de pessoas ({sessao.num_pessoas}).\n\n"
            "Qual é a nova data de ida? (DD/MM/AAAA)"
        ),
    )


@app.delete("/api/viagens/{viagem_id}")
def deletar_viagem(viagem_id: int):
    global _viagens_salvas
    antes = len(_viagens_salvas)
    _viagens_salvas = [v for v in _viagens_salvas if v["id"] != viagem_id]
    if len(_viagens_salvas) == antes:
        raise HTTPException(status_code=404, detail="Viagem não encontrada.")
    return {"mensagem": "Viagem removida do histórico."}