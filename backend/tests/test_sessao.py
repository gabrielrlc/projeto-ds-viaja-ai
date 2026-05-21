import pytest
from app.services import sessao as sessao_service
from app.schemas.chat import SessaoViagem


# Limpa o dicionário interno antes de cada teste para evitar interferência entre eles
@pytest.fixture(autouse=True)
def limpar_sessoes():
    sessao_service._sessoes.clear()
    yield
    sessao_service._sessoes.clear()


# --- criar_sessao ---

def test_criar_sessao_retorna_sessao_viagem():
    sessao = sessao_service.criar_sessao()
    assert isinstance(sessao, SessaoViagem)

def test_criar_sessao_gera_id_unico():
    s1 = sessao_service.criar_sessao()
    s2 = sessao_service.criar_sessao()
    assert s1.sessao_id != s2.sessao_id

def test_criar_sessao_etapa_inicial_e_destino():
    sessao = sessao_service.criar_sessao()
    assert sessao.etapa == "destino"

def test_criar_sessao_persiste_em_memoria():
    sessao = sessao_service.criar_sessao()
    assert sessao.sessao_id in sessao_service._sessoes


# --- obter_sessao ---

def test_obter_sessao_retorna_sessao_existente():
    criada = sessao_service.criar_sessao()
    obtida = sessao_service.obter_sessao(criada.sessao_id)
    assert obtida == criada

def test_obter_sessao_retorna_none_para_id_inexistente():
    resultado = sessao_service.obter_sessao("id-que-nao-existe")
    assert resultado is None


# --- salvar_sessao ---

def test_salvar_sessao_atualiza_estado():
    sessao = sessao_service.criar_sessao()
    sessao.destino = "Paris"
    sessao.etapa = "origem"
    sessao_service.salvar_sessao(sessao)

    salva = sessao_service.obter_sessao(sessao.sessao_id)
    assert salva.destino == "Paris"
    assert salva.etapa == "origem"

def test_salvar_sessao_sem_criar_antes_funciona():
    nova = SessaoViagem(sessao_id="manual-123")
    sessao_service.salvar_sessao(nova)
    assert sessao_service.obter_sessao("manual-123") == nova


# --- deletar_sessao ---

def test_deletar_sessao_remove_da_memoria():
    sessao = sessao_service.criar_sessao()
    sessao_service.deletar_sessao(sessao.sessao_id)
    assert sessao_service.obter_sessao(sessao.sessao_id) is None

def test_deletar_sessao_inexistente_nao_lanca_erro():
    # Não deve lançar nenhuma exceção
    sessao_service.deletar_sessao("id-fantasma")
