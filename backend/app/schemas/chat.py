from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# --- Chat ---
class MensagemChat(BaseModel):
    sessao_id: str
    mensagem: str

class RespostaChat(BaseModel):
    sessao_id: str
    etapa_atual: str
    mensagem_bot: str
    roteiro: Optional[str] = None
    
# --- Estado da sessão em memória ---
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
    voo_escolhido: Optional[dict] = None
    hoteis_disponiveis: Optional[list] = None
    hotel_escolhido: Optional[dict] = None

# --- Itineraries ---
class ItineraryOut(BaseModel):
    id: int
    destination: str
    content: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True  # permite converter model do banco direto pro schema