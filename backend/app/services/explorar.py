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
            description="No topo do Morro do Corcovado, a 710 metros de altitude, o Cristo Redentor recebe você de braços abertos, sendo um ícone do Rio de Janeiro e uma das Sete Maravilhas do Mundo Moderno.",
            imageUrl="https://transcode-v2.app.engoo.com/image/fetch/f_auto,c_lfill,w_300,dpr_3/https://assets.app.engoo.com/organizations/5d2656f1-9162-461d-88c7-b2505623d8cb/images/6XY2BQvQLh8Rtjop9TTPcQ.jpeg",
            location="Parque Nacional da Tijuca", hours="08:00 - 19:00", price="R$ 97,50", 
            tripAdvisorUrl="https://www.tripadvisor.com.br/Search?q=Cristo+Redentor+Rio+de+Janeiro"),
        Attraction(id="rj-2", city="Rio de Janeiro", category="Natureza e Aventura", name="Bondinho Pão de Açúcar",
            description="Famoso teleférico com vistas incríveis do pôr do sol e da Baía de Guanabara.",
            imageUrl="https://tourb.com.br/img/lugares/rio-de-janeiro/pao-de-acucar.jpg",
            location="Urca, Rio de Janeiro", hours="08:30 - 21:00", price="R$ 205,00", tripAdvisorUrl="https://www.tripadvisor.com.br/Search?q=Bondinho+Pao+de+Acucar+Rio+de+Janeiro"),
        Attraction(id="rj-3", city="Rio de Janeiro", category="Natureza e Aventura", name="Trilha da Pedra da Gávea",
            description="Trilha desafiadora que recompensa com uma das melhores vistas do litoral carioca.",
            imageUrl="https://trilhandomontanhas.com/arquivos/2016-12/pedra-da-gavea-parque-nacional-da-tijuca-pnt-rj-media.jpg",
            location="Floresta da Tijuca", hours="08:00 - 17:00", price="Gratuito", tripAdvisorUrl="https://www.tripadvisor.com.br/Search?q=Trilha+da+Pedra+da+Gavea+Rio+de+Janeiro"),
        Attraction(id="rj-4", city="Rio de Janeiro", category="Gastronomia", name="Santa Teresa",
            description="Bairro boêmio com restaurantes autorais, bares charmosos e arte de rua.",
            imageUrl="https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/0b/d8/20/82.jpg",
            location="Santa Teresa, Rio de Janeiro", hours="Varia por local", price="Gratuito", tripAdvisorUrl="https://www.tripadvisor.com.br/Search?q=Santa+Teresa+Rio+de+Janeiro"),
        Attraction(id="rj-5", city="Rio de Janeiro", category="Esportes", name="Praia de Ipanema",
            description="A praia mais famosa do Rio, palco de esportes de praia e do pôr do sol mais bonito da cidade.",
            imageUrl="https://cdn.sanity.io/images/nxpteyfv/goguides/c5ffa2a13c54cfaa98548bc24b9bf952d65a8540-1600x1066.jpg",
            location="Ipanema, Rio de Janeiro", hours="24 horas", price="Gratuito", tripAdvisorUrl="https://www.tripadvisor.com.br/Search?q=Praia+de+Ipanema+Rio+de+Janeiro"),
    ],
    "Paris": [
        Attraction(id="pa-1", city="Paris", category="Cultura e História", name="Torre Eiffel",
            description="O ícone global da França, com vistas espetaculares do rio Sena.",
            imageUrl="https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/07/38/c5/1d.jpg",
            location="Champ de Mars, Paris", hours="09:30 - 22:45", price="€ 29,40", tripAdvisorUrl="https://www.tripadvisor.com.br/Search?q=Torre+Eiffel+Paris"),
        Attraction(id="pa-2", city="Paris", category="Cultura e História", name="Museu do Louvre",
            description="O maior museu de arte do mundo, lar da Mona Lisa e da Vênus de Milo.",
            imageUrl="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/df/da/34/the-glass-pyramid-is.jpg?w=900&h=500&s=1",
            location="Rue de Rivoli, Paris", hours="09:00 - 18:00", price="€ 22,00", tripAdvisorUrl="https://www.tripadvisor.com.br/Search?q=Museu+do+Louvre+Paris"),
        Attraction(id="pa-3", city="Paris", category="Gastronomia", name="Le Marais",
            description="Bairro histórico repleto de cafés charmosos, bistrôs tradicionais e patisseries.",
            imageUrl="https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=800&auto=format&fit=crop",
            location="3rd/4th Arrondissement", hours="Varia por local", price="Gratuito", tripAdvisorUrl="https://www.tripadvisor.com.br/Search?q=Le+Marais+Paris"),
        Attraction(id="pa-4", city="Paris", category="Natureza e Aventura", name="Jardim de Luxemburgo",
            description="O parque mais amado pelos parisienses, perfeito para piqueniques e caminhadas.",
            imageUrl="https://media.cntraveler.com/photos/5952f9ca9034d21207799151/16:9/w_2560,c_limit/jardin-du-luxembourg-GettyImages-151514883.jpg",
            location="6th Arrondissement", hours="07:30 - 21:30", price="Gratuito", tripAdvisorUrl="https://www.tripadvisor.com.br/Search?q=Jardim+de+Luxemburgo+Paris"),
        Attraction(id="pa-5", city="Paris", category="Esportes", name="Stade de France",
            description="O maior estádio da França, palco de eventos esportivos e shows internacionais.",
            imageUrl="https://media-cdn.tripadvisor.com/media/photo-s/08/1c/8e/a1/stade-de-france.jpg",
            location="Saint-Denis, Paris", hours="Varia por evento", price="€ 30", tripAdvisorUrl="https://www.tripadvisor.com.br/Search?q=Stade+de+France+Paris"),
    ],
    "Tóquio": [
        Attraction(id="tk-1", city="Tóquio", category="Cultura e História", name="Templo Senso-ji",
            description="O templo budista mais antigo e significativo de Tóquio, localizado em Asakusa.",
            imageUrl="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&auto=format&fit=crop",
            location="Asakusa, Tóquio", hours="24 horas (Salão: 06h-17h)", price="Gratuito", tripAdvisorUrl="https://www.tripadvisor.com.br/Search?q=Templo+Senso-ji+Toquio"),
        Attraction(id="tk-2", city="Tóquio", category="Gastronomia", name="Mercado de Tsukiji",
            description="Famoso mercado de rua perfeito para provar sushi fresco e street food japonês.",
            imageUrl="https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&auto=format&fit=crop",
            location="Chuo City, Tóquio", hours="05:00 - 14:00", price="Gratuito", tripAdvisorUrl="https://www.tripadvisor.com.br/Search?q=Mercado+de+Tsukiji+Toquio"),
        Attraction(id="tk-3", city="Tóquio", category="Natureza e Aventura", name="Monte Fuji",
            description="O vulcão mais alto do Japão e símbolo nacional, com trilhas e vistas deslumbrantes.",
            imageUrl="https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&auto=format&fit=crop",
            location="Região de Fuji-Hakone", hours="Temporada: Jul-Set", price="Gratuito", tripAdvisorUrl="https://www.tripadvisor.com.br/Search?q=Monte+Fuji+Japao"),
        Attraction(id="tk-4", city="Tóquio", category="Cultura e História", name="Palácio Imperial",
            description="Residência oficial do Imperador do Japão, cercada por jardins históricos e fossos.",
            imageUrl="https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&auto=format&fit=crop",
            location="Chiyoda, Tóquio", hours="09:00 - 17:00", price="Gratuito", tripAdvisorUrl="https://www.tripadvisor.com.br/Search?q=Palacio+Imperial+Toquio"),
        Attraction(id="tk-5", city="Tóquio", category="Esportes", name="Tokyo Dome",
            description="O maior estádio coberto do Japão, lar do time de beisebol Yomiuri Giants.",
            imageUrl="https://blackpink-fansite.com/_next/image?url=%2Fblog%2Fblackpink_tokyo_dome_2026.webp&w=3840&q=75&dpl=dpl_4tmQazN4SAXSTSBy6E32NoB8TPnP",
            location="Bunkyo, Tóquio", hours="Varia por evento", price="1.800", tripAdvisorUrl="https://www.tripadvisor.com.br/Search?q=Tokyo+Dome"),
    ],
    "Nova York": [
        Attraction(id="ny-1", city="Nova York", category="Natureza e Aventura", name="Central Park",
            description="Um imenso oásis verde no meio da selva de pedra de Manhattan.",
            imageUrl="https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=800&auto=format&fit=crop",
            location="Manhattan, NY", hours="06:00 - 01:00", price="Gratuito", tripAdvisorUrl="https://www.tripadvisor.com.br/Search?q=Central+Park+Nova+York"),
        Attraction(id="ny-2", city="Nova York", category="Cultura e História", name="Broadway",
            description="O coração da indústria teatral americana com musicais inesquecíveis.",
            imageUrl="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/8a/c7/ff/broadway.jpg?w=1200&h=-1&s=1",
            location="Times Square Area", hours="Noturno", price="US$ 80", tripAdvisorUrl="https://www.tripadvisor.com.br/Search?q=Broadway+Nova+York"),
        Attraction(id="ny-3", city="Nova York", category="Cultura e História", name="Museu Metropolitano de Arte",
            description="Um dos maiores e mais importantes museus do mundo, com mais de 5.000 anos de história da arte.",
            imageUrl="https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800&auto=format&fit=crop",
            location="5th Avenue, Manhattan", hours="10:00 - 17:00", price="US$ 30", tripAdvisorUrl="https://www.tripadvisor.com.br/Search?q=Museu+Metropolitano+de+Arte+Nova+York"),
        Attraction(id="ny-4", city="Nova York", category="Gastronomia", name="Chelsea Market",
            description="Mercado gourmet icônico dentro de uma antiga fábrica, com culinária de todo o mundo.",
            imageUrl="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop",
            location="Chelsea, Manhattan", hours="07:00 - 21:00", price="Variável", tripAdvisorUrl="https://www.tripadvisor.com.br/Search?q=Chelsea+Market+Nova+York"),
        Attraction(id="ny-5", city="Nova York", category="Esportes", name="Madison Square Garden",
            description="A arena mais famosa do mundo, palco de jogos do New York Knicks e New York Rangers.",
            imageUrl="https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/16/b9/9d/45.jpg",
            location="Midtown Manhattan", hours="Varia por evento", price="US$ 50", tripAdvisorUrl="https://www.tripadvisor.com.br/Search?q=Madison+Square+Garden+Nova+York"),
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
    # Prioridade: lista curada (normaliza a busca para case-insensitive)
    cidade_normalizada = next(
        (c for c in _ATRACOES_CURADAS if c.lower() == cidade.lower()),
        None,
    )
    if cidade_normalizada:
        logger.info("Explorar: usando lista curada para '%s'", cidade)
        return _ATRACOES_CURADAS[cidade_normalizada]

    # Fallback: tenta o TripAdvisor
    atracoes_tripadvisor = await _tentar_tripadvisor(cidade)
    if atracoes_tripadvisor:
        return atracoes_tripadvisor

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