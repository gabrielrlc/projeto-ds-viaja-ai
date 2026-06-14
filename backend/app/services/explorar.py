import logging
from app.services.tripAdvisor import buscar_atracoes as _buscar_atracoes_tripadvisor
from app.schemas.explorar import Attraction, DestinoPopular

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Dados curados — destinos populares e categorias disponíveis
# Servem como base estática e fallback quando o TripAdvisor não retorna dados.
# ---------------------------------------------------------------------------

CITIES: list[str] = ["Rio de Janeiro", "Paris", "Tóquio", "Nova York"]

CATEGORIES: list[str] = [
    "Todas",
    "Cultura e História",
    "Natureza e Aventura",
    "Gastronomia",
    "Esportes",
]

DESTINOS_POPULARES: list[DestinoPopular] = [
    DestinoPopular(
        city="Rio de Janeiro",
        country="Brasil",
        description="A Cidade Maravilhosa encanta com praias icônicas, o Cristo Redentor e um carnaval incomparável.",
        imageUrl="https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&auto=format&fit=crop",
        categories=["Cultura e História", "Natureza e Aventura", "Gastronomia"],
    ),
    DestinoPopular(
        city="Paris",
        country="França",
        description="A Cidade Luz seduz com arte, gastronomia refinada e monumentos que definem a história do Ocidente.",
        imageUrl="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop",
        categories=["Cultura e História", "Gastronomia"],
    ),
    DestinoPopular(
        city="Tóquio",
        country="Japão",
        description="Metrópole futurista que preserva templos milenares, culinária única e uma cultura vibrante.",
        imageUrl="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop",
        categories=["Cultura e História", "Gastronomia"],
    ),
    DestinoPopular(
        city="Nova York",
        country="EUA",
        description="A cidade que nunca dorme oferece Broadway, museus de classe mundial e uma energia inigualável.",
        imageUrl="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop",
        categories=["Cultura e História", "Natureza e Aventura", "Esportes"],
    ),
]

# ---------------------------------------------------------------------------
# Atrações curadas por cidade — usadas como fallback quando o TripAdvisor
# não está configurado ou não retorna resultados suficientes.
# Mapeiam 1:1 com o mockAtracoes.ts do frontend para garantir consistência.
# ---------------------------------------------------------------------------

_ATRACOES_CURADAS: dict[str, list[Attraction]] = {
    "Rio de Janeiro": [
        Attraction(id="rj-1", city="Rio de Janeiro", category="Cultura e História", name="Cristo Redentor",
            description="Uma das Sete Maravilhas do Mundo Moderno, oferecendo vista panorâmica da cidade.",
            imageUrl="https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&auto=format&fit=crop",
            location="Parque Nacional da Tijuca", hours="08:00 - 19:00", price="R$ 97,50"),
        Attraction(id="rj-2", city="Rio de Janeiro", category="Natureza e Aventura", name="Pão de Açúcar",
            description="Famoso teleférico com vistas incríveis do pôr do sol e da Baía de Guanabara.",
            imageUrl="https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=800&auto=format&fit=crop",
            location="Urca, Rio de Janeiro", hours="08:30 - 20:00", price="R$ 185,00"),
        Attraction(id="rj-3", city="Rio de Janeiro", category="Natureza e Aventura", name="Trilha da Pedra da Gávea",
            description="Trilha desafiadora que recompensa com uma das melhores vistas do litoral carioca.",
            imageUrl="https://images.unsplash.com/photo-1564659907532-6b5f98c8e70f?w=800&auto=format&fit=crop",
            location="Floresta da Tijuca", hours="08:00 - 17:00", price="Gratuito"),
        Attraction(id="rj-4", city="Rio de Janeiro", category="Gastronomia", name="Santa Teresa",
            description="Bairro boêmio com restaurantes autorais, bares charmosos e arte de rua.",
            imageUrl="https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&auto=format&fit=crop",
            location="Santa Teresa, Rio de Janeiro", hours="Varia por local", price="$$"),
        Attraction(id="rj-5", city="Rio de Janeiro", category="Esportes", name="Praia de Ipanema",
            description="A praia mais famosa do Rio, palco de esportes de praia e do pôr do sol mais bonito da cidade.",
            imageUrl="https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=800&auto=format&fit=crop",
            location="Ipanema, Rio de Janeiro", hours="24 horas", price="Gratuito"),
    ],
    "Paris": [
        Attraction(id="pa-1", city="Paris", category="Cultura e História", name="Torre Eiffel",
            description="O ícone global da França, com vistas espetaculares do rio Sena.",
            imageUrl="https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&auto=format&fit=crop",
            location="Champ de Mars, Paris", hours="09:30 - 22:45", price="€ 29,40"),
        Attraction(id="pa-2", city="Paris", category="Cultura e História", name="Museu do Louvre",
            description="O maior museu de arte do mundo, lar da Mona Lisa e da Vênus de Milo.",
            imageUrl="https://images.unsplash.com/photo-1565799555432-4e32b56df7e3?w=800&auto=format&fit=crop",
            location="Rue de Rivoli, Paris", hours="09:00 - 18:00", price="€ 22,00"),
        Attraction(id="pa-3", city="Paris", category="Gastronomia", name="Le Marais",
            description="Bairro histórico repleto de cafés charmosos, bistrôs tradicionais e patisseries.",
            imageUrl="https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=800&auto=format&fit=crop",
            location="3rd/4th Arrondissement", hours="Varia por local", price="$$"),
        Attraction(id="pa-4", city="Paris", category="Natureza e Aventura", name="Jardim de Luxemburgo",
            description="O parque mais amado pelos parisienses, perfeito para piqueniques e caminhadas.",
            imageUrl="https://images.unsplash.com/photo-1431274172761-fca41d930114?w=800&auto=format&fit=crop",
            location="6th Arrondissement", hours="07:30 - 21:30", price="Gratuito"),
        Attraction(id="pa-5", city="Paris", category="Esportes", name="Stade de France",
            description="O maior estádio da França, palco de eventos esportivos e shows internacionais.",
            imageUrl="https://images.unsplash.com/photo-1540747913346-19212a729f45?w=800&auto=format&fit=crop",
            location="Saint-Denis, Paris", hours="Varia por evento", price="A partir de € 30"),
    ],
    "Tóquio": [
        Attraction(id="tk-1", city="Tóquio", category="Cultura e História", name="Templo Senso-ji",
            description="O templo budista mais antigo e significativo de Tóquio, localizado em Asakusa.",
            imageUrl="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&auto=format&fit=crop",
            location="Asakusa, Tóquio", hours="24 horas (Salão: 06h-17h)", price="Gratuito"),
        Attraction(id="tk-2", city="Tóquio", category="Gastronomia", name="Mercado de Tsukiji",
            description="Famoso mercado de rua perfeito para provar sushi fresco e street food japonês.",
            imageUrl="https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&auto=format&fit=crop",
            location="Chuo City, Tóquio", hours="05:00 - 14:00", price="$$"),
        Attraction(id="tk-3", city="Tóquio", category="Natureza e Aventura", name="Monte Fuji",
            description="O vulcão mais alto do Japão e símbolo nacional, com trilhas e vistas deslumbrantes.",
            imageUrl="https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&auto=format&fit=crop",
            location="Região de Fuji-Hakone", hours="Temporada: Jul-Set", price="¥ 2.000"),
        Attraction(id="tk-4", city="Tóquio", category="Cultura e História", name="Palácio Imperial",
            description="Residência oficial do Imperador do Japão, cercada por jardins históricos e fossos.",
            imageUrl="https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&auto=format&fit=crop",
            location="Chiyoda, Tóquio", hours="09:00 - 17:00", price="Gratuito"),
        Attraction(id="tk-5", city="Tóquio", category="Esportes", name="Tokyo Dome",
            description="O maior estádio coberto do Japão, lar do time de beisebol Yomiuri Giants.",
            imageUrl="https://images.unsplash.com/photo-1540747913346-19212a729f45?w=800&auto=format&fit=crop",
            location="Bunkyo, Tóquio", hours="Varia por evento", price="A partir de ¥ 1.800"),
    ],
    "Nova York": [
        Attraction(id="ny-1", city="Nova York", category="Natureza e Aventura", name="Central Park",
            description="Um imenso oásis verde no meio da selva de pedra de Manhattan.",
            imageUrl="https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=800&auto=format&fit=crop",
            location="Manhattan, NY", hours="06:00 - 01:00", price="Gratuito"),
        Attraction(id="ny-2", city="Nova York", category="Cultura e História", name="Broadway",
            description="O coração da indústria teatral americana com musicais inesquecíveis.",
            imageUrl="https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&auto=format&fit=crop",
            location="Times Square Area", hours="Noturno", price="A partir de US$ 80"),
        Attraction(id="ny-3", city="Nova York", category="Cultura e História", name="Museu Metropolitano de Arte",
            description="Um dos maiores e mais importantes museus do mundo, com mais de 5.000 anos de história da arte.",
            imageUrl="https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800&auto=format&fit=crop",
            location="5th Avenue, Manhattan", hours="10:00 - 17:00", price="US$ 30"),
        Attraction(id="ny-4", city="Nova York", category="Gastronomia", name="Chelsea Market",
            description="Mercado gourmet icônico dentro de uma antiga fábrica, com culinária de todo o mundo.",
            imageUrl="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop",
            location="Chelsea, Manhattan", hours="07:00 - 21:00", price="$$"),
        Attraction(id="ny-5", city="Nova York", category="Esportes", name="Madison Square Garden",
            description="A arena mais famosa do mundo, palco de jogos do New York Knicks e New York Rangers.",
            imageUrl="https://images.unsplash.com/photo-1540747913346-19212a729f45?w=800&auto=format&fit=crop",
            location="Midtown Manhattan", hours="Varia por evento", price="A partir de US$ 50"),
    ],
}

# ---------------------------------------------------------------------------
# Mapeamento TripAdvisor category → categoria do frontend
# O TripAdvisor retorna categorias em inglês; normalizamos para o padrão da UI.
# ---------------------------------------------------------------------------

_CATEGORIA_MAP: dict[str, str] = {
    "attractions":  "Cultura e História",
    "restaurants":  "Gastronomia",
    "hotels":       "Cultura e História",
    "nature":       "Natureza e Aventura",
    "sports":       "Esportes",
}


def _normalizar_categoria(raw: str) -> str:
    return _CATEGORIA_MAP.get(raw.lower(), "Cultura e História")


# ---------------------------------------------------------------------------
# Funções públicas do serviço
# ---------------------------------------------------------------------------

async def listar_destinos() -> tuple[list[str], list[str], list[DestinoPopular]]:
    """Retorna cidades disponíveis, categorias e metadados dos destinos populares."""
    return CITIES, CATEGORIES, DESTINOS_POPULARES


async def buscar_atracoes_por_cidade(cidade: str) -> list[Attraction]:
    """
    Busca atrações para uma cidade.
    Tenta o TripAdvisor primeiro; se não retornar dados suficientes,
    usa a lista curada como fallback.
    """
    atracoes_tripadvisor = await _tentar_tripadvisor(cidade)

    if atracoes_tripadvisor:
        return atracoes_tripadvisor

    # Fallback: lista curada (normaliza a busca para case-insensitive)
    cidade_normalizada = next(
        (c for c in _ATRACOES_CURADAS if c.lower() == cidade.lower()),
        None,
    )
    if cidade_normalizada:
        logger.info("Explorar: usando lista curada para '%s'", cidade)
        return _ATRACOES_CURADAS[cidade_normalizada]

    logger.warning("Explorar: cidade '%s' não encontrada em nenhuma fonte", cidade)
    return []


async def _tentar_tripadvisor(cidade: str) -> list[Attraction]:
    """
    Chama o TripAdvisor e converte o resultado para o schema Attraction.
    Retorna lista vazia se a chave não estiver configurada ou ocorrer qualquer erro.
    """
    try:
        resultados = await _buscar_atracoes_tripadvisor(cidade)
    except Exception:
        logger.exception("Explorar: erro ao chamar TripAdvisor para '%s'", cidade)
        return []

    # TripAdvisor retornou mock (chave não configurada) — ignora e usa curado
    if resultados and resultados[0].get("location_id", "").startswith("mock_"):
        return []

    atracoes = []
    for i, item in enumerate(resultados):
        atracoes.append(Attraction(
            id=f"ta-{item.get('location_id', i)}",
            city=cidade,
            category=_normalizar_categoria(item.get("category", "attractions")),
            name=item.get("nome", "Sem nome"),
            description=item.get("descricao", f"Ponto turístico em {cidade}."),
            imageUrl=item.get("imageUrl", "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800"),
            location=item.get("endereco", cidade),
            hours=item.get("horario", "Consulte o local"),
            price=item.get("preco", "Consulte o local"),
        ))

    return atracoes