import pytest
from unittest.mock import patch, AsyncMock
from app.services.chat_flow import processar_mensagem
from app.schemas.chat import SessaoViagem


@pytest.fixture
def sessao():
    return SessaoViagem(sessao_id="test-123")


# --- Etapa: destino ---

async def test_destino_salva_e_avanca(sessao):
    resposta = await processar_mensagem(sessao, "Paris")
    assert sessao.destino == "Paris"
    assert sessao.etapa == "origem"
    assert resposta.etapa_atual == "origem"

async def test_destino_menciona_cidade_na_resposta(sessao):
    resposta = await processar_mensagem(sessao, "Tokyo")
    assert "Tokyo" in resposta.mensagem_bot


# --- Etapa: origem ---

async def test_origem_salva_e_avanca(sessao):
    sessao.etapa = "origem"
    await processar_mensagem(sessao, "São Paulo")
    assert sessao.origem == "São Paulo"
    assert sessao.etapa == "pessoas"

async def test_origem_oferece_opcoes_de_quantidade(sessao):
    sessao.etapa = "origem"
    resposta = await processar_mensagem(sessao, "Recife")
    assert resposta.opcoes is not None
    assert "1" in resposta.opcoes


# --- Etapa: pessoas ---

async def test_pessoas_salva_numero(sessao):
    sessao.etapa = "pessoas"
    await processar_mensagem(sessao, "3")
    assert sessao.num_pessoas == 3
    assert sessao.etapa == "orcamento"

async def test_pessoas_opcao_com_mais(sessao):
    sessao.etapa = "pessoas"
    await processar_mensagem(sessao, "5+")
    assert sessao.num_pessoas == 5

async def test_pessoas_texto_invalido_usa_padrao_1(sessao):
    sessao.etapa = "pessoas"
    await processar_mensagem(sessao, "não sei")
    assert sessao.num_pessoas == 1


# --- Etapa: orcamento ---

async def test_orcamento_salva_valor_formatado(sessao):
    sessao.etapa = "orcamento"
    await processar_mensagem(sessao, "R$ 5.000")
    assert sessao.orcamento == 5000.0
    assert sessao.etapa == "datas"

async def test_orcamento_avanca_para_datas(sessao):
    sessao.etapa = "orcamento"
    resposta = await processar_mensagem(sessao, "3000")
    assert resposta.etapa_atual == "datas"


# --- Etapa: datas ---

async def test_datas_primeira_mensagem_salva_data_ida(sessao):
    sessao.etapa = "datas"
    await processar_mensagem(sessao, "15/07/2025")
    assert sessao.data_ida == "2025-07-15"
    assert sessao.etapa == "datas"  # ainda aguarda data de volta

async def test_datas_data_invalida_pede_novamente(sessao):
    sessao.etapa = "datas"
    resposta = await processar_mensagem(sessao, "amanhã")
    assert sessao.data_ida is None
    assert resposta.etapa_atual == "datas"

async def test_datas_so_ida_nao_define_data_volta(sessao):
    sessao.etapa = "datas"
    sessao.data_ida = "2025-07-15"
    sessao.origem = "São Paulo"
    sessao.destino = "Paris"

    with patch("app.services.chat_flow.buscar_voos", new_callable=AsyncMock) as mock_voos, \
         patch("app.services.chat_flow.buscar_hoteis", new_callable=AsyncMock) as mock_hoteis:
        mock_voos.return_value = []
        mock_hoteis.return_value = []
        await processar_mensagem(sessao, "só ida")

    assert sessao.data_volta is None

async def test_datas_com_volta_chama_buscar_voos(sessao):
    sessao.etapa = "datas"
    sessao.data_ida = "2025-07-15"
    sessao.origem = "São Paulo"
    sessao.destino = "Paris"

    with patch("app.services.chat_flow.buscar_voos", new_callable=AsyncMock) as mock_voos, \
         patch("app.services.chat_flow.buscar_hoteis", new_callable=AsyncMock) as mock_hoteis:
        mock_voos.return_value = []
        mock_hoteis.return_value = []
        await processar_mensagem(sessao, "20/07/2025")

    mock_voos.assert_called_once()

async def test_datas_voos_encontrados_retorna_opcoes(sessao):
    sessao.etapa = "datas"
    sessao.data_ida = "2025-07-15"
    sessao.origem = "São Paulo"
    sessao.destino = "Paris"

    voos_mock = [
        {"companhia": "LATAM", "preco": 3500, "duracao_minutos": 720,
         "partida": "08:00", "chegada": "20:00", "escalas": 0,
         "aeroporto_partida": "GRU", "aeroporto_chegada": "CDG"},
    ]

    with patch("app.services.chat_flow.buscar_voos", new_callable=AsyncMock) as mock_voos:
        mock_voos.return_value = voos_mock
        resposta = await processar_mensagem(sessao, "20/07/2025")

    assert resposta.opcoes is not None
    assert any("LATAM" in op for op in resposta.opcoes)


# --- Etapa: hoteis ---

async def test_hoteis_escolhe_por_indice(sessao):
    sessao.etapa = "hoteis"
    sessao.hoteis_disponiveis = [
        {"nome": "Hotel A", "preco_noite": "R$ 200", "avaliacao": 4.0, "descricao": ""},
        {"nome": "Hotel B", "preco_noite": "R$ 300", "avaliacao": 4.5, "descricao": ""},
    ]
    await processar_mensagem(sessao, "2")
    assert sessao.hotel_escolhido["nome"] == "Hotel B"
    assert sessao.etapa == "estilo"

async def test_hoteis_indice_invalido_usa_primeiro(sessao):
    sessao.etapa = "hoteis"
    sessao.hoteis_disponiveis = [
        {"nome": "Hotel A", "preco_noite": "R$ 200", "avaliacao": 4.0, "descricao": ""}
    ]
    await processar_mensagem(sessao, "texto inválido")
    assert sessao.hotel_escolhido["nome"] == "Hotel A"

async def test_hoteis_avanca_para_estilo(sessao):
    sessao.etapa = "hoteis"
    sessao.hoteis_disponiveis = [
        {"nome": "Hotel A", "preco_noite": "R$ 200", "avaliacao": 4.0, "descricao": ""}
    ]
    resposta = await processar_mensagem(sessao, "1")
    assert resposta.etapa_atual == "estilo"
    assert resposta.opcoes is not None


# --- Etapa: estilo ---

async def test_estilo_remove_emoji_e_salva(sessao):
    sessao.etapa = "estilo"
    await processar_mensagem(sessao, "🏖️ Praia e relaxamento")
    assert sessao.estilo == "Praia e relaxamento"
    assert sessao.etapa == "interesses"

async def test_estilo_avanca_para_interesses(sessao):
    sessao.etapa = "estilo"
    resposta = await processar_mensagem(sessao, "🏛️ Cultural e histórico")
    assert resposta.etapa_atual == "interesses"


# --- Etapa: interesses → gera roteiro ---

async def test_interesses_gera_roteiro_e_conclui(sessao):
    sessao.etapa = "interesses"
    sessao.destino = "Paris"
    sessao.data_ida = "2025-07-15"
    sessao.data_volta = "2025-07-20"

    roteiro_mock = {"destino": "Paris", "dias": []}

    with patch("app.services.chat_flow.buscar_atracoes", new_callable=AsyncMock) as m_atracoes, \
         patch("app.services.chat_flow.buscar_clima", new_callable=AsyncMock) as m_clima, \
         patch("app.services.chat_flow.gerar_roteiro", new_callable=AsyncMock) as m_roteiro:
        m_atracoes.return_value = []
        m_clima.return_value = {}
        m_roteiro.return_value = roteiro_mock
        resposta = await processar_mensagem(sessao, "gosto de museus")

    assert resposta.roteiro == roteiro_mock
    assert sessao.etapa == "concluido"
    assert resposta.etapa_atual == "concluido"

async def test_interesses_calcula_num_dias_correto(sessao):
    sessao.etapa = "interesses"
    sessao.destino = "Paris"
    sessao.data_ida = "2025-07-15"
    sessao.data_volta = "2025-07-20"

    dados_capturados = {}

    async def capturar_dados(dados):
        dados_capturados.update(dados)
        return {"destino": "Paris", "dias": []}

    with patch("app.services.chat_flow.buscar_atracoes", new_callable=AsyncMock) as m1, \
         patch("app.services.chat_flow.buscar_clima", new_callable=AsyncMock) as m2, \
         patch("app.services.chat_flow.gerar_roteiro", side_effect=capturar_dados):
        m1.return_value = []
        m2.return_value = {}
        await processar_mensagem(sessao, "qualquer coisa")

    assert dados_capturados["num_dias"] == 5

async def test_interesses_chama_buscar_atracoes_e_clima(sessao):
    sessao.etapa = "interesses"
    sessao.destino = "Paris"
    sessao.data_ida = "2025-07-15"

    with patch("app.services.chat_flow.buscar_atracoes", new_callable=AsyncMock) as m_atracoes, \
         patch("app.services.chat_flow.buscar_clima", new_callable=AsyncMock) as m_clima, \
         patch("app.services.chat_flow.gerar_roteiro", new_callable=AsyncMock) as m_roteiro:
        m_atracoes.return_value = []
        m_clima.return_value = {}
        m_roteiro.return_value = {}
        await processar_mensagem(sessao, "qualquer coisa")

    m_atracoes.assert_called_once_with("Paris")
    m_clima.assert_called_once()


# --- Etapa: concluido ---

async def test_concluido_oferece_nova_viagem(sessao):
    sessao.etapa = "concluido"
    resposta = await processar_mensagem(sessao, "qualquer coisa")
    assert "Nova viagem" in (resposta.opcoes or [])
