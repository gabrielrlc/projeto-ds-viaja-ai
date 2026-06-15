from pydantic import BaseModel
from typing import Optional


class Attraction(BaseModel):
    id: str
    city: str
    category: str
    name: str
    description: str
    imageUrl: str
    location: str
    hours: str
    price: str
    longDescription: Optional[str] = None
    tripAdvisorUrl: Optional[str] = None
    reviews: Optional[list[dict]] = None


class DestinoPopular(BaseModel):
    city: str
    country: str
    description: str
    imageUrl: str
    categories: list[str]


class RespostaDestinos(BaseModel):
    cities: list[str]
    categories: list[str]
    destinos: list[DestinoPopular]


class RespostaAtracoes(BaseModel):
    city: str
    atracoes: list[Attraction]