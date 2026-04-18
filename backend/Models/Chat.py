from pydantic import BaseModel
from typing import Optional, Literal
from datetime import date


# Etapas do fluxo conversacional
EtapaChat = Literal[
    "destino",
    "pessoas",
    "orcamento",
    "datas",
    "passagens",
    "hoteis",
    "estilo",
    "interesses",
    "gerando",
    "concluido",
]


class MensagemChat(BaseModel):
    sessao_id: str
    mensagem: str  # texto livre do usuário


class RespostaChat(BaseModel):
    sessao_id: str
    etapa_atual: EtapaChat
    mensagem_bot: str
    opcoes: Optional[list[str]] = None      # botões de opção para o frontend
    dados_extra: Optional[dict] = None      # voos/hotéis para o usuário escolher
    roteiro: Optional[dict] = None          # preenchido só na etapa final


class SessaoViagem(BaseModel):
    """Estado completo da sessão de planejamento."""
    sessao_id: str
    etapa: EtapaChat = "destino"

    # Dados coletados ao longo do fluxo
    destino: Optional[str] = None
    origem: Optional[str] = "Brasil"
    num_pessoas: Optional[int] = None
    orcamento: Optional[float] = None
    data_ida: Optional[str] = None
    data_volta: Optional[str] = None
    estilo: Optional[str] = None
    interesses: Optional[str] = None

    # Escolhas do usuário
    voo_escolhido: Optional[dict] = None
    hotel_escolhido: Optional[dict] = None

    # Opções apresentadas (para o usuário escolher)
    voos_disponiveis: Optional[list[dict]] = None
    hoteis_disponiveis: Optional[list[dict]] = None