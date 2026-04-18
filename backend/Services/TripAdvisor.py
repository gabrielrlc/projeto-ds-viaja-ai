import httpx
import os

TRIPADVISOR_KEY = os.getenv("TRIPADVISOR_API_KEY", "")
BASE_URL = "https://api.content.tripadvisor.com/api/v1"


async def buscar_atracoes(destino: str, categoria: str = "attractions") -> list[dict]:
    """Busca atrações, restaurantes ou hotéis no TripAdvisor pelo nome do destino."""
    if not TRIPADVISOR_KEY:
        return _mock_atracoes(destino)

    async with httpx.AsyncClient() as client:
        # Primeiro busca o location_id da cidade
        r = await client.get(
            f"{BASE_URL}/location/search",
            params={
                "searchQuery": destino,
                "category": categoria,
                "language": "pt",
                "key": TRIPADVISOR_KEY,
            },
            timeout=10,
        )
        data = r.json()
        locations = data.get("data", [])
        if not locations:
            return _mock_atracoes(destino)

        # Pega detalhes das primeiras 5 atrações
        resultados = []
        for loc in locations[:5]:
            location_id = loc.get("location_id")
            nome = loc.get("name", "")
            endereco = loc.get("address_obj", {}).get("address_string", "")
            resultados.append({
                "nome": nome,
                "endereco": endereco,
                "location_id": location_id,
            })
        return resultados


def _mock_atracoes(destino: str) -> list[dict]:
    """Retorna dados mock quando a chave não está configurada."""
    return [
        {"nome": f"Atração principal de {destino}", "endereco": f"Centro, {destino}", "location_id": "mock_1"},
        {"nome": f"Museu histórico de {destino}", "endereco": f"Centro histórico, {destino}", "location_id": "mock_2"},
        {"nome": f"Restaurante local em {destino}", "endereco": f"Bairro turístico, {destino}", "location_id": "mock_3"},
        {"nome": f"Parque natural de {destino}", "endereco": f"Zona natural, {destino}", "location_id": "mock_4"},
        {"nome": f"Mirante de {destino}", "endereco": f"Alto da cidade, {destino}", "location_id": "mock_5"},
    ]