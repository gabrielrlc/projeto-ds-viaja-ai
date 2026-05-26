from pydantic import BaseModel, field_validator, model_validator
from typing import Optional
from datetime import datetime


# ---------------------------------------------------------------------------
# Chat
# ---------------------------------------------------------------------------

class MensagemChat(BaseModel):
    sessao_id: str
    mensagem: str

    @field_validator("sessao_id")
    @classmethod
    def sessao_id_nao_vazio(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("sessao_id não pode ser vazio.")
        return v

    @field_validator("mensagem")
    @classmethod
    def mensagem_valida(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("A mensagem não pode ser vazia.")
        if len(v) > 2000:
            raise ValueError("A mensagem não pode ultrapassar 2000 caracteres.")
        return v


class RespostaChat(BaseModel):
    sessao_id: str
    etapa_atual: str
    mensagem_bot: str
    opcoes: Optional[list[str]] = None
    dados_extra: Optional[dict] = None
    roteiro: Optional[dict] = None
    itinerary_id: Optional[int] = None


# ---------------------------------------------------------------------------
# Estado da sessão em memória
# ---------------------------------------------------------------------------

class SessaoViagem(BaseModel):
    sessao_id: str
    etapa: str = "destino"
    destino: Optional[str] = None
    origem: str = "Brasil"
    num_pessoas: Optional[int] = None
    orcamento: Optional[float] = None
    data_ida: Optional[str] = None
    data_volta: Optional[str] = None
    estilo: Optional[str] = None
    interesses: Optional[str] = None
    voos_disponiveis: Optional[list] = None
    voo_ida_escolhido: Optional[str] = None
    voo_volta_escolhido: Optional[str] = None
    hoteis_disponiveis: Optional[list] = None
    hotel_escolhido: Optional[dict] = None


# ---------------------------------------------------------------------------
# Itinerários
# ---------------------------------------------------------------------------

class ItineraryOut(BaseModel):
    id: int
    destination: str
    content: Optional[dict]
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Modificação de roteiro
# ---------------------------------------------------------------------------

class ModificarRoteiro(BaseModel):
    instrucao: str

    @field_validator("instrucao")
    @classmethod
    def instrucao_valida(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("A instrução de modificação não pode ser vazia.")
        if len(v) < 5:
            raise ValueError("A instrução é muito curta. Descreva o que deseja modificar no roteiro.")
        if len(v) > 1000:
            raise ValueError("A instrução não pode ultrapassar 1000 caracteres.")
        return v


class RespostaModificacao(BaseModel):
    id: int
    destination: str
    roteiro: dict
    mensagem: str