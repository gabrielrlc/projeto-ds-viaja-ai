import React from "react";
import { CardVoo } from "@/components/c_roteiro/card_voo";
import { CardHotel } from "@/components/c_roteiro/card_hotel";

export interface RoteiroHistorico {
    id: string;
    resumo: { destino: string; data: string; status: string; };
    header: { titulo: string; dataResumo: string; orcamento: string; viajantes: string; rota: string; };
    voos: { ida: React.ComponentProps<typeof CardVoo>; volta: React.ComponentProps<typeof CardVoo>; };
    hotel: React.ComponentProps<typeof CardHotel>;
    dia1Titulo: string; dia1Data: string; ultimoDiaTitulo: string; UltimoDiaData: string;
}

export const ROTEIRO_HISTORICO: RoteiroHistorico[] = [
    {
        id: "rio-2025",
        resumo: { destino: "Rio de Janeiro, Brasil", data: "12 a 16 Ago 2025", status: "Planejada" },
        header: { titulo: "12 a 16 Ago no Rio de Janeiro", dataResumo: "12–16 Ago", orcamento: "R$ 10k - 25k", viajantes: "1 pessoa", rota: "Recife - Rio de Janeiro" },
        voos: {
            ida: { tipo: "Ida", data: "ter., 12 de ago.", preco: "R$ 650", co2: "181", partida: { hora: "08:00", aeroporto: "Aeroporto Internacional do Recife (REC)", cidade: "Recife" }, duracao: "3h 15min", detalhes: "GOL Econômica • Boeing 737", chegada: { hora: "11:15", aeroporto: "Aeroporto Internacional do Rio de Janeiro (GIG)", cidade: "Rio de Janeiro" } },
            volta: { tipo: "Volta", data: "sáb., 16 de ago.", preco: "R$ 600", co2: "181", partida: { hora: "15:00", aeroporto: "Aeroporto Internacional do Rio de Janeiro (GIG)", cidade: "Rio de Janeiro" }, duracao: "3h 15min", detalhes: "GOL Econômica • Boeing 737", chegada: { hora: "18:15", aeroporto: "Aeroporto Internacional do Recife (REC)", cidade: "Recife" } }
        },
        hotel: { nome: "Copacabana Palace", estrelas: 5, categoria: "Hotel de Luxo", noites: 4, precoTotal: "R$ 8.400", localizacao: "Copacabana", precoNoite: "R$ 2.100", checkIn: "ter., 12 ago. às 14:00", checkOut: "sáb., 16 ago. às 12:00", comodidades: ["Wi-Fi Grátis", "Piscina", "Café da Manhã", "Academia", "Spa", "Restaurante"] },
        dia1Titulo: "Chegada e Boas-vindas", dia1Data: "12 Agosto 2025", ultimoDiaTitulo: "Despedida e Volta", UltimoDiaData: "16 Agosto 2025"
    },
    {
        id: "ny-2025",
        resumo: { destino: "Nova York, EUA", data: "20 a 27 Dez 2025", status: "Planejada" },
        header: { titulo: "20 a 27 Dez em Nova York", dataResumo: "20–27 Dez", orcamento: "$ 3k - 6k", viajantes: "2 pessoas", rota: "Recife - Nova York" },
        voos: {
            ida: { tipo: "Ida", data: "sáb., 20 de dez.", preco: "R$ 3.800", co2: "520", partida: { hora: "23:55", aeroporto: "Aeroporto Internacional do Recife (REC)", cidade: "Recife" }, duracao: "10h 30min", detalhes: "Azul Econômica • A330 (Voo Direto)", chegada: { hora: "07:25", aeroporto: "Aeroporto Internacional John F. Kennedy (JFK)", cidade: "Nova York" } },
            volta: { tipo: "Volta", data: "sáb., 27 de dez.", preco: "R$ 3.800", co2: "520", partida: { hora: "21:00", aeroporto: "Aeroporto Internacional John F. Kennedy (JFK)", cidade: "Nova York" }, duracao: "9h 45min", detalhes: "Azul Econômica • A330 (Voo Direto)", chegada: { hora: "08:45", aeroporto: "Aeroporto Internacional do Recife (REC)", cidade: "Recife" } }
        },
        hotel: { nome: "The Plaza Hotel", estrelas: 5, categoria: "Hotel de Luxo", noites: 7, precoTotal: "$ 6.300", localizacao: "Manhattan", precoNoite: "$ 900", checkIn: "sáb., 20 dez. às 15:00", checkOut: "sáb., 27 dez. às 12:00", comodidades: ["Wi-Fi Grátis", "Vista Central Park", "Spa", "Academia", "Restaurante Fino"] },
        dia1Titulo: "Chegada e Boas-vindas", dia1Data: "20 Dezembro 2025", ultimoDiaTitulo: "Despedida e Volta", UltimoDiaData: "27 Dezembro 2025"
    },
    {
        id: "paris-2024",
        resumo: { destino: "Paris, França", data: "05 a 12 Mai 2024", status: "Concluída" },
        header: { titulo: "05 a 12 Mai em Paris", dataResumo: "05–12 Mai", orcamento: "€ 3k - 5k", viajantes: "2 pessoas", rota: "Recife - Paris" },
        voos: {
            ida: { tipo: "Ida", data: "dom., 05 de mai.", preco: "R$ 4.200", co2: "850", partida: { hora: "18:30", aeroporto: "Aeroporto Internacional do Recife (REC)", cidade: "Recife" }, duracao: "11h 20min", detalhes: "Air France Econômica • Airbus A330", chegada: { hora: "09:50", aeroporto: "Aeroporto de Paris-Charles de Gaulle (CDG)", cidade: "Paris" } },
            volta: { tipo: "Volta", data: "dom., 12 de mai.", preco: "R$ 4.100", co2: "850", partida: { hora: "23:15", aeroporto: "Aeroporto de Paris-Charles de Gaulle (CDG)", cidade: "Paris" }, duracao: "11h 45min", detalhes: "Air France Econômica • Airbus A330", chegada: { hora: "06:00", aeroporto: "Aeroporto Internacional do Recife (REC)", cidade: "Recife" } }
        },
        hotel: { nome: "Pullman Paris Tour Eiffel", estrelas: 4, categoria: "Hotel Premium", noites: 7, precoTotal: "€ 2.800", localizacao: "7º Arrondissement", precoNoite: "€ 400", checkIn: "dom., 05 mai. às 15:00", checkOut: "dom., 12 mai. às 12:00", comodidades: ["Wi-Fi Grátis", "Vista da Torre", "Café da Manhã", "Restaurante"] },
        dia1Titulo: "Chegada e Boas-vindas", dia1Data: "05 Maio 2024", ultimoDiaTitulo: "Despedida e Volta", UltimoDiaData: "12 Maio 2024"
    },
    {
        id: "tokyo-2023",
        resumo: { destino: "Tóquio, Japão", data: "10 a 24 Nov 2023", status: "Concluída" },
        header: { titulo: "10 a 24 Nov em Tóquio", dataResumo: "10–24 Nov", orcamento: "$ 4k - 7k", viajantes: "1 pessoa", rota: "Recife - Tóquio" },
        voos: {
            ida: { tipo: "Ida", data: "sex., 10 de nov.", preco: "R$ 7.500", co2: "1200", partida: { hora: "06:00", aeroporto: "Aeroporto Internacional do Recife (REC)", cidade: "Recife" }, duracao: "28h 40min", detalhes: "Emirates Econômica • B777", chegada: { hora: "22:40", aeroporto: "Aeroporto Internacional de Narita (NRT)", cidade: "Tóquio" } },
            volta: { tipo: "Volta", data: "sex., 24 de nov.", preco: "R$ 7.200", co2: "1200", partida: { hora: "22:30", aeroporto: "Aeroporto Internacional de Narita (NRT)", cidade: "Tóquio" }, duracao: "30h 15min", detalhes: "Emirates Econômica • B777", chegada: { hora: "16:45", aeroporto: "Aeroporto Internacional do Recife (REC)", cidade: "Recife" } }
        },
        hotel: { nome: "Shinjuku Washington Hotel", estrelas: 4, categoria: "Hotel Executivo", noites: 14, precoTotal: "¥ 140.000", localizacao: "Shinjuku", precoNoite: "¥ 10.000", checkIn: "sáb., 11 nov. às 14:00", checkOut: "sex., 24 nov. às 11:00", comodidades: ["Wi-Fi Grátis", "Lojas de Conveniência", "Restaurante Temático"] },
        dia1Titulo: "Chegada e Boas-vindas", dia1Data: "11 Novembro 2023", ultimoDiaTitulo: "Despedida e Volta", UltimoDiaData: "24 Novembro 2023"
    }
];