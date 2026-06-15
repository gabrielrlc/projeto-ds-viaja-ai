import type { RespostaAtracoes, RespostaDestinos } from "@/lib/types/explorar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Busca cidades disponíveis, categorias e metadados dos destinos populares.
 * Usado para montar os filtros e cards de destino da tela /explorar.
 */
export async function buscarDestinos(): Promise<RespostaDestinos> {
  const res = await fetch(`${API_URL}/api/explorar/destinos`);
  if (!res.ok) throw new Error(`Erro ao buscar destinos: ${res.status}`);
  return res.json();
}

/**
 * Busca atrações de uma cidade específica.
 * O backend tenta o TripAdvisor e cai para a lista curada se necessário.
 */
export async function buscarAtracoes(cidade: string): Promise<RespostaAtracoes> {
  const res = await fetch(
    `${API_URL}/api/explorar/atracoes/${encodeURIComponent(cidade)}`,
  );
  if (!res.ok) throw new Error(`Erro ao buscar atrações: ${res.status}`);
  return res.json();
}