import type { CardHotelProps } from "@/components/c_roteiro/card_hotel";
import type { CardVooProps } from "@/components/c_roteiro/card_voo";

export type Remetente = "bot" | "user";

export interface Mensagem {
  remetente: Remetente;
  texto: string;
}

export interface VooOpcao {
  preco?: string | number;
  escalas?: number;
  partida?: string;
  chegada?: string;
  aeroporto_partida?: string;
  aeroporto_chegada?: string;
  duracao_minutos?: number;
  companhia?: string;
  tipo_passagem?: string;
  aeronave?: string;
  numero_voo?: string;
  logo_companhia?: string;
  link_passagem?: string;
  link?: string;
  serpapi_google_flights_link?: string;
}

export interface HotelOpcao {
  nome?: string;
  avaliacao?: number;
  preco_noite?: string;
  imagem_url?: string;
  thumbnail?: string;
  foto_url?: string;
  image?: string;
  link_hotel?: string;
  link?: string;
  serpapi_property_details_link?: string;
  serpapi_google_hotels_link?: string;
}

export interface DadosColetados {
  destino: string;
  origem: string;
  pessoas: string;
  orcamento: string;
  datas: string;
  estilo: string;
  voo_ida_escolhido: VooOpcao | null;
  voo_volta_escolhido: VooOpcao | null;
  hotel_escolhido: HotelOpcao | null;
}

export interface OpcoesObjetos {
  voos?: VooOpcao[];
  hoteis?: HotelOpcao[];
}

export interface AtividadeRoteiro {
  horario?: string;
  nome?: string;
  descricao?: string;
}

export interface DiaRoteiro {
  dia?: string | number;
  titulo?: string;
  data?: string;
  clima_dia?: string;
  atividades?: AtividadeRoteiro[];
}

export interface RoteiroIa {
  resumo?: string;
  dias?: DiaRoteiro[];
}

export interface RespostaChatApi {
  sessao_id: string;
  etapa_atual: string;
  mensagem_bot: string;
  opcoes?: string[] | null;
  dados_extra?: OpcoesObjetos | null;
  roteiro?: RoteiroIa | null;
  itinerary_id?: number | null;
}

export interface RespostaModificacaoApi {
  id: number;
  destination: string;
  roteiro: RoteiroIa;
  mensagem: string;
}

export type PropsVooMontadas = CardVooProps;
export type PropsHotelMontadas = CardHotelProps;
