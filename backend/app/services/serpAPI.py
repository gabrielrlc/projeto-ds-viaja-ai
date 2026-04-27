import httpx
import os

SERPAPI_KEY = os.getenv("SERPAPI_API_KEY", "")
BASE_URL = "https://serpapi.com/search"


async def buscar_voos(origem: str, destino: str, data_ida: str, data_volta: str = None) -> dict:
    """Busca voos via SerpAPI (Google Flights)."""
    if not SERPAPI_KEY:
        return _mock_voos(origem, destino, data_ida, data_volta)

    params = {
        "engine": "google_flights",
        "departure_id": origem,
        "arrival_id": destino,
        "outbound_date": data_ida,
        "currency": "BRL",
        "hl": "pt",
        "api_key": SERPAPI_KEY,
    }
    if data_volta:
        params["return_date"] = data_volta
        params["type"] = "1"  # round trip
    else:
        params["type"] = "2"  # one way

    async with httpx.AsyncClient() as client:
        r = await client.get(BASE_URL, params=params, timeout=15)
        data = r.json()

    best_flights = data.get("best_flights", [])
    if not best_flights:
        return _mock_voos(origem, destino, data_ida, data_volta)

    primeiro = best_flights[0]
    flights = primeiro.get("flights", [{}])
    return {
        "companhia": flights[0].get("airline", "N/A"),
        "preco": primeiro.get("price", 0),
        "duracao_minutos": primeiro.get("total_duration", 0),
        "partida": flights[0].get("departure_airport", {}).get("time", ""),
        "chegada": flights[-1].get("arrival_airport", {}).get("time", ""),
        "escalas": len(flights) - 1,
    }


async def buscar_hoteis(destino: str, checkin: str, checkout: str, adultos: int = 2) -> list[dict]:
    """Busca hotéis via SerpAPI (Google Hotels)."""
    if not SERPAPI_KEY:
        return _mock_hoteis(destino)

    async with httpx.AsyncClient() as client:
        r = await client.get(
            BASE_URL,
            params={
                "engine": "google_hotels",
                "q": f"hotéis em {destino}",
                "check_in_date": checkin,
                "check_out_date": checkout,
                "adults": adultos,
                "currency": "BRL",
                "hl": "pt",
                "api_key": SERPAPI_KEY,
            },
            timeout=15,
        )
        data = r.json()

    propriedades = data.get("properties", [])[:3]
    if not propriedades:
        return _mock_hoteis(destino)

    return [
        {
            "nome": h.get("name", "Hotel"),
            "preco_noite": h.get("rate_per_night", {}).get("lowest", "N/A"),
            "avaliacao": h.get("overall_rating", "N/A"),
            "descricao": h.get("description", ""),
        }
        for h in propriedades
    ]


def _mock_voos(origem, destino, data_ida, data_volta):
    return {
        "companhia": "LATAM Airlines",
        "preco": 850,
        "duracao_minutos": 180,
        "partida": f"{data_ida} 08:00",
        "chegada": f"{data_ida} 11:00",
        "escalas": 0,
    }


def _mock_hoteis(destino):
    return [
        {"nome": f"Hotel Central {destino}", "preco_noite": "R$ 280", "avaliacao": 4.2, "descricao": "Hotel bem localizado no centro."},
        {"nome": f"Pousada Boa Viagem", "preco_noite": "R$ 150", "avaliacao": 4.5, "descricao": "Charmosa pousada familiar."},
        {"nome": f"Apart Hotel {destino}", "preco_noite": "R$ 320", "avaliacao": 4.0, "descricao": "Apartamentos completos com cozinha."},
    ]