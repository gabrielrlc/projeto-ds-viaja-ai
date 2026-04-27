import uuid
from app.schemas.chat import SessaoViagem

_sessoes: dict[str, SessaoViagem] = {}

def criar_sessao() -> SessaoViagem:
    sessao_id = str(uuid.uuid4())
    sessao = SessaoViagem(sessao_id=sessao_id)
    _sessoes[sessao_id] = sessao
    return sessao

def obter_sessao(sessao_id: str) -> SessaoViagem | None:
    return _sessoes.get(sessao_id)

def salvar_sessao(sessao: SessaoViagem) -> None:
    _sessoes[sessao.sessao_id] = sessao

def deletar_sessao(sessao_id: str) -> None:
    _sessoes.pop(sessao_id, None)