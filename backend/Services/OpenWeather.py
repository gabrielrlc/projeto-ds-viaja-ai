import httpx
import os

OPENWEATHER_KEY = os.getenv("OPENWEATHERMAP_API_KEY", "")
BASE_URL = "https://api.openweathermap.org/data/2.5"
GEO_URL = "http://api.openweathermap.org/geo/1.0/direct"


async def buscar_clima(destino: str, data_ida: str, data_volta: str = None) -> dict:
    """
    Busca previsão do tempo para o destino.
    OpenWeatherMap free tier suporta previsão de até 5 dias.
    """
    if not OPENWEATHER_KEY:
        return _mock_clima(destino)

    async with httpx.AsyncClient() as client:
        # 1. Geocodificar o nome da cidade para lat/lon
        geo = await client.get(
            GEO_URL,
            params={"q": destino, "limit": 1, "appid": OPENWEATHER_KEY},
            timeout=10,
        )
        geo_data = geo.json()
        if not geo_data:
            return _mock_clima(destino)

        lat = geo_data[0]["lat"]
        lon = geo_data[0]["lon"]
        nome_cidade = geo_data[0].get("local_names", {}).get("pt", geo_data[0]["name"])

        # 2. Buscar previsão de 5 dias (de 3 em 3 horas)
        prev = await client.get(
            f"{BASE_URL}/forecast",
            params={
                "lat": lat,
                "lon": lon,
                "appid": OPENWEATHER_KEY,
                "units": "metric",
                "lang": "pt_br",
                "cnt": 40,  # máximo: 5 dias
            },
            timeout=10,
        )
        prev_data = prev.json()

    # 3. Agrupa previsão por dia (pega leitura do meio-dia de cada dia)
    dias_clima = {}
    for item in prev_data.get("list", []):
        data = item["dt_txt"][:10]  # YYYY-MM-DD
        hora = item["dt_txt"][11:13]
        if hora == "12":  # pega só o meio-dia
            dias_clima[data] = {
                "data": data,
                "temp_min": round(item["main"]["temp_min"]),
                "temp_max": round(item["main"]["temp_max"]),
                "descricao": item["weather"][0]["description"].capitalize(),
                "chuva": item.get("rain", {}).get("3h", 0) > 0,
                "icone": item["weather"][0]["icon"],
            }

    previsao_lista = list(dias_clima.values())

    # Resume o clima geral para o prompt
    tem_chuva = any(d["chuva"] for d in previsao_lista)
    temp_media = (
        round(sum(d["temp_max"] for d in previsao_lista) / len(previsao_lista))
        if previsao_lista else None
    )

    resumo = _gerar_resumo(temp_media, tem_chuva, previsao_lista)

    return {
        "cidade": nome_cidade,
        "temp_media": temp_media,
        "tem_chuva": tem_chuva,
        "resumo": resumo,
        "previsao_por_dia": previsao_lista,
    }


def _gerar_resumo(temp_media: int | None, tem_chuva: bool, previsao: list) -> str:
    if not temp_media:
        return "Clima não disponível para o período."

    if temp_media >= 28:
        temp_desc = "bem quente"
        roupa = "roupas leves, protetor solar e chapéu"
    elif temp_media >= 20:
        temp_desc = "agradável"
        roupa = "roupas leves com uma camada extra para a noite"
    elif temp_media >= 12:
        temp_desc = "ameno"
        roupa = "casaco e roupas em camadas"
    else:
        temp_desc = "frio"
        roupa = "agasalho, cachecol e roupas térmicas"

    chuva_aviso = " Leve um guarda-chuva ou capa de chuva." if tem_chuva else ""

    return f"Clima {temp_desc} com média de {temp_media}°C. Recomenda-se {roupa}.{chuva_aviso}"


def _mock_clima(destino: str) -> dict:
    return {
        "cidade": destino,
        "temp_media": 25,
        "tem_chuva": False,
        "resumo": "Clima agradável com média de 25°C. Recomenda-se roupas leves.",
        "previsao_por_dia": [],
    }