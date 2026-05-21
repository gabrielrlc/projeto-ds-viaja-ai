import pytest
from unittest.mock import patch, AsyncMock, MagicMock
from app.services.openWeather import _gerar_resumo, buscar_clima


# --- _gerar_resumo ---

def test_gerar_resumo_sem_temperatura():
    assert _gerar_resumo(None, False, []) == "Clima não disponível para o período."

def test_gerar_resumo_temperatura_zero_indica_indisponivel():
    assert _gerar_resumo(0, False, []) == "Clima não disponível para o período."

def test_gerar_resumo_muito_quente():
    resumo = _gerar_resumo(30, False, [])
    assert "bem quente" in resumo
    assert "protetor solar" in resumo

def test_gerar_resumo_agradavel():
    resumo = _gerar_resumo(25, False, [])
    assert "agradável" in resumo

def test_gerar_resumo_ameno():
    resumo = _gerar_resumo(15, False, [])
    assert "ameno" in resumo
    assert "casaco" in resumo

def test_gerar_resumo_frio():
    resumo = _gerar_resumo(5, False, [])
    assert "frio" in resumo
    assert "agasalho" in resumo

def test_gerar_resumo_com_chuva_inclui_aviso():
    resumo = _gerar_resumo(25, True, [])
    assert "guarda-chuva" in resumo

def test_gerar_resumo_sem_chuva_nao_menciona_guarda_chuva():
    resumo = _gerar_resumo(25, False, [])
    assert "guarda-chuva" not in resumo

def test_gerar_resumo_limite_28_e_quente():
    assert "bem quente" in _gerar_resumo(28, False, [])

def test_gerar_resumo_limite_20_e_agradavel():
    assert "agradável" in _gerar_resumo(20, False, [])

def test_gerar_resumo_limite_12_e_ameno():
    assert "ameno" in _gerar_resumo(12, False, [])


# --- buscar_clima ---

async def test_buscar_clima_sem_api_key_retorna_mock():
    with patch("app.services.openWeather.OPENWEATHER_KEY", ""):
        resultado = await buscar_clima("Paris", "2025-07-15")
    assert resultado["cidade"] == "Paris"
    assert resultado["temp_media"] == 25
    assert resultado["previsao_por_dia"] == []

async def test_buscar_clima_com_api_key_retorna_estrutura_correta():
    geo_response = MagicMock()
    geo_response.json.return_value = [
        {"lat": 48.85, "lon": 2.35, "name": "Paris", "local_names": {"pt": "Paris"}}
    ]
    forecast_response = MagicMock()
    forecast_response.json.return_value = {
        "list": [
            {
                "dt_txt": "2025-07-15 12:00:00",
                "main": {"temp_min": 18, "temp_max": 28},
                "weather": [{"description": "Céu limpo", "icon": "01d"}],
            }
        ]
    }

    mock_client = AsyncMock()
    mock_client.get.side_effect = [geo_response, forecast_response]

    with patch("app.services.openWeather.OPENWEATHER_KEY", "fake-key"), \
         patch("app.services.openWeather.httpx.AsyncClient") as MockClient:
        MockClient.return_value.__aenter__ = AsyncMock(return_value=mock_client)
        MockClient.return_value.__aexit__ = AsyncMock(return_value=False)
        resultado = await buscar_clima("Paris", "2025-07-15")

    assert resultado["cidade"] == "Paris"
    assert resultado["temp_media"] == 28
    assert len(resultado["previsao_por_dia"]) == 1
    assert "resumo" in resultado

async def test_buscar_clima_cidade_nao_encontrada_retorna_mock():
    geo_response = MagicMock()
    geo_response.json.return_value = []  # geocode sem resultados

    mock_client = AsyncMock()
    mock_client.get.return_value = geo_response

    with patch("app.services.openWeather.OPENWEATHER_KEY", "fake-key"), \
         patch("app.services.openWeather.httpx.AsyncClient") as MockClient:
        MockClient.return_value.__aenter__ = AsyncMock(return_value=mock_client)
        MockClient.return_value.__aexit__ = AsyncMock(return_value=False)
        resultado = await buscar_clima("CidadeInexistente", "2025-07-15")

    assert resultado["temp_media"] == 25  # valor do mock padrão
