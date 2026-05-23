import pytest
from unittest.mock import patch, AsyncMock, MagicMock
from app.services.serpAPI import buscar_voos, buscar_hoteis


# --- buscar_voos sem API key (fallback mock) ---

async def test_buscar_voos_sem_api_key_retorna_cinco_opcoes():
    with patch("app.services.serpAPI.SERPAPI_KEY", ""):
        voos = await buscar_voos("São Paulo", "Paris", "2025-07-15")
    assert len(voos) == 5

async def test_buscar_voos_sem_api_key_estrutura_completa():
    with patch("app.services.serpAPI.SERPAPI_KEY", ""):
        voos = await buscar_voos("São Paulo", "Paris", "2025-07-15")
    for campo in ["companhia", "preco", "duracao_minutos", "partida", "chegada", "escalas", "link_passagem"]:
        assert campo in voos[0], f"campo '{campo}' ausente"

async def test_buscar_voos_sem_api_key_tem_voo_direto():
    with patch("app.services.serpAPI.SERPAPI_KEY", ""):
        voos = await buscar_voos("São Paulo", "Paris", "2025-07-15")
    assert any(v["escalas"] == 0 for v in voos)

async def test_buscar_voos_sem_api_key_data_ida_no_horario():
    with patch("app.services.serpAPI.SERPAPI_KEY", ""):
        voos = await buscar_voos("São Paulo", "Paris", "2025-07-15")
    assert all("2025-07-15" in v["partida"] for v in voos)


# --- buscar_hoteis sem API key (fallback mock) ---

async def test_buscar_hoteis_sem_api_key_retorna_tres_opcoes():
    with patch("app.services.serpAPI.SERPAPI_KEY", ""):
        hoteis = await buscar_hoteis("Paris", "2025-07-15", "2025-07-20")
    assert len(hoteis) == 3

async def test_buscar_hoteis_sem_api_key_estrutura_completa():
    with patch("app.services.serpAPI.SERPAPI_KEY", ""):
        hoteis = await buscar_hoteis("Paris", "2025-07-15", "2025-07-20")
    for campo in ["nome", "preco_noite", "avaliacao", "descricao"]:
        assert campo in hoteis[0], f"campo '{campo}' ausente"

async def test_buscar_hoteis_sem_api_key_nome_contem_destino():
    with patch("app.services.serpAPI.SERPAPI_KEY", ""):
        hoteis = await buscar_hoteis("Paris", "2025-07-15", "2025-07-20")
    nomes = [h["nome"] for h in hoteis]
    assert any("Paris" in nome for nome in nomes)


# --- buscar_voos com API key (httpx mockado) ---

async def test_buscar_voos_com_api_key_parseia_resultado():
    autocomplete = MagicMock()
    autocomplete.json.return_value = {
        "suggestions": [{"airports": [{"id": "GRU"}]}]
    }
    flights = MagicMock()
    flights.json.return_value = {
        "best_flights": [
            {
                "flights": [
                    {
                        "airline": "LATAM",
                        "departure_airport": {"time": "08:00", "name": "Guarulhos"},
                        "arrival_airport": {"time": "20:00", "name": "CDG"},
                    }
                ],
                "price": 3500,
                "total_duration": 720,
            }
        ]
    }

    mock_client = AsyncMock()
    mock_client.get.side_effect = [autocomplete, autocomplete, flights]

    with patch("app.services.serpAPI.SERPAPI_KEY", "fake-key"), \
         patch("app.services.serpAPI.httpx.AsyncClient") as MockClient:
        MockClient.return_value.__aenter__ = AsyncMock(return_value=mock_client)
        MockClient.return_value.__aexit__ = AsyncMock(return_value=False)
        voos = await buscar_voos("São Paulo", "Paris", "2025-07-15")

    assert len(voos) == 1
    assert voos[0]["companhia"] == "LATAM"
    assert voos[0]["preco"] == 3500
    assert voos[0]["duracao_minutos"] == 720
    assert voos[0]["link_passagem"]

async def test_buscar_voos_sem_resultados_da_api_retorna_mock():
    autocomplete = MagicMock()
    autocomplete.json.return_value = {"suggestions": []}
    flights = MagicMock()
    flights.json.return_value = {"best_flights": [], "other_flights": []}

    mock_client = AsyncMock()
    mock_client.get.side_effect = [autocomplete, autocomplete, flights]

    with patch("app.services.serpAPI.SERPAPI_KEY", "fake-key"), \
         patch("app.services.serpAPI.httpx.AsyncClient") as MockClient:
        MockClient.return_value.__aenter__ = AsyncMock(return_value=mock_client)
        MockClient.return_value.__aexit__ = AsyncMock(return_value=False)
        voos = await buscar_voos("São Paulo", "Paris", "2025-07-15")

    assert len(voos) == 5  # cai no mock padrão


# --- buscar_hoteis com API key (httpx mockado) ---

async def test_buscar_hoteis_com_api_key_parseia_resultado():
    response = MagicMock()
    response.json.return_value = {
        "properties": [
            {
                "name": "Hotel Lumière",
                "rate_per_night": {"lowest": "R$ 450"},
                "overall_rating": 4.8,
                "description": "Hotel boutique no centro.",
            }
        ]
    }

    mock_client = AsyncMock()
    mock_client.get.return_value = response

    with patch("app.services.serpAPI.SERPAPI_KEY", "fake-key"), \
         patch("app.services.serpAPI.httpx.AsyncClient") as MockClient:
        MockClient.return_value.__aenter__ = AsyncMock(return_value=mock_client)
        MockClient.return_value.__aexit__ = AsyncMock(return_value=False)
        hoteis = await buscar_hoteis("Paris", "2025-07-15", "2025-07-20")

    assert len(hoteis) == 1
    assert hoteis[0]["nome"] == "Hotel Lumière"
    assert hoteis[0]["avaliacao"] == 4.8
