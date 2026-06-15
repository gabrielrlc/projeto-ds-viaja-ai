// Espelha exatamente o schema Pydantic do backend (schemas/explorar.py)
// e a interface Attraction do mockAtracoes.ts para garantir compatibilidade.

export type City = "Rio de Janeiro" | "Paris" | "Tóquio" | "Nova York";
export type Category =
  | "Todas"
  | "Cultura e História"
  | "Natureza e Aventura"
  | "Gastronomia"
  | "Esportes";

export interface Attraction {
  id: string;
  city: string;
  category: Category;
  name: string;
  description: string;
  imageUrl: string;
  location: string;
  hours: string;
  price: string;
  longDescription?: string;
  tripAdvisorUrl?: string;
  reviews?: {
    author: string;
    text: string;
    rating: number;
  }[];
}

export interface DestinoPopular {
  city: string;
  country: string;
  description: string;
  imageUrl: string;
  categories: string[];
}

export interface RespostaDestinos {
  cities: string[];
  categories: string[];
  destinos: DestinoPopular[];
}

export interface RespostaAtracoes {
  city: string;
  atracoes: Attraction[];
}