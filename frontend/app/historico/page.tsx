"use client";

import { useState } from "react";
import Image from "next/image";
import { Compass, Search, Home, MessageSquare, User, History, Settings, ChevronDown, ChevronUp, MapPin, Calendar, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { CardVoo } from "@/components/c_roteiro/card_voo";
import { CardHotel } from "@/components/c_roteiro/card_hotel";
import { HeaderRoteiro } from "@/components/c_roteiro/header";

// Tipos de dados
interface RoteiroHistorico {
    id: string;
    resumo: {
        destino: string;
        data: string;
        status: string;
    };
    header: {
        titulo: string;
        dataResumo: string;
        orcamento: string;
        viajantes: string;
        rota: string;
    };
    voos: {
        ida: React.ComponentProps<typeof CardVoo>;
        volta: React.ComponentProps<typeof CardVoo>;
    };
    hotel: React.ComponentProps<typeof CardHotel>;
    dia1Titulo: string;
    dia1Data: string;
    ultimoDiaTitulo: string;
    UltimoDiaData: string;
}

// Alguns dados apenas para visualização inicial
const ROTEIRO_HISTORICO: RoteiroHistorico[] = [
    {
        id: "rio-2025",
        resumo: { destino: "Rio de Janeiro, Brasil", data: "12 a 16 Ago 2025", status: "Planejada" },
        header: { titulo: "12 a 16 Ago no Rio de Janeiro", dataResumo: "12–16 Ago", orcamento: "R$ 10k - 25k", viajantes: "1 pessoa", rota: "Recife - Rio de Janeiro" },
        voos: {
            ida: { tipo: "Ida", data: "ter., 12 de ago.", preco: "R$ 650", co2: "181", partida: { hora: "08:00", aeroporto: "Aeroporto Internacional do Recife (REC)" }, duracao: "3h 15min", detalhes: "GOL Econômica • Boeing 737", chegada: { hora: "11:15", aeroporto: "Aeroporto Internacional do Rio de Janeiro (GIG)" } },
            volta: { tipo: "Volta", data: "sáb., 16 de ago.", preco: "R$ 600", co2: "181", partida: { hora: "15:00", aeroporto: "Aeroporto Internacional do Rio de Janeiro (GIG)" }, duracao: "3h 15min", detalhes: "GOL Econômica • Boeing 737", chegada: { hora: "18:15", aeroporto: "Aeroporto Internacional do Recife (REC)" } }
        },
        hotel: { nome: "Copacabana Palace", estrelas: 5, categoria: "Hotel de Luxo", noites: 4, precoTotal: "R$ 8.400", localizacao: "Copacabana", precoNoite: "R$ 2.100", checkIn: "ter., 12 ago. às 14:00", checkOut: "sáb., 16 ago. às 12:00", comodidades: ["Wi-Fi Grátis", "Piscina", "Café da Manhã", "Academia", "Spa", "Restaurante"] },
        dia1Titulo: "Chegada e Boas-vindas", dia1Data: "12 Agosto 2025", ultimoDiaTitulo: "Despedida e Volta", UltimoDiaData: "16 Agosto 2025"
    },
    {
        id: "ny-2025",
        resumo: { destino: "Nova York, EUA", data: "20 a 27 Dez 2025", status: "Planejada" },
        header: { titulo: "20 a 27 Dez em Nova York", dataResumo: "20–27 Dez", orcamento: "$ 3k - 6k", viajantes: "2 pessoas", rota: "Recife - Nova York" },
        voos: {
            ida: { tipo: "Ida", data: "sáb., 20 de dez.", preco: "R$ 3.800", co2: "520", partida: { hora: "23:55", aeroporto: "Aeroporto Internacional do Recife (REC)" }, duracao: "10h 30min", detalhes: "Azul Econômica • A330 (Voo Direto)", chegada: { hora: "07:25", aeroporto: "Aeroporto Internacional John F. Kennedy (JFK)" } },
            volta: { tipo: "Volta", data: "sáb., 27 de dez.", preco: "R$ 3.800", co2: "520", partida: { hora: "21:00", aeroporto: "Aeroporto Internacional John F. Kennedy (JFK)" }, duracao: "9h 45min", detalhes: "Azul Econômica • A330 (Voo Direto)", chegada: { hora: "08:45", aeroporto: "Aeroporto Internacional do Recife (REC)" } }
        },
        hotel: { nome: "The Plaza Hotel", estrelas: 5, categoria: "Hotel de Luxo", noites: 7, precoTotal: "$ 6.300", localizacao: "Manhattan", precoNoite: "$ 900", checkIn: "sáb., 20 dez. às 15:00", checkOut: "sáb., 27 dez. às 12:00", comodidades: ["Wi-Fi Grátis", "Vista Central Park", "Spa", "Academia", "Restaurante Fino"] },
        dia1Titulo: "Chegada e Boas-vindas", dia1Data: "20 Dezembro 2025", ultimoDiaTitulo: "Despedida e Volta", UltimoDiaData: "27 Dezembro 2025"
    },
    {
        id: "paris-2024",
        resumo: { destino: "Paris, França", data: "05 a 12 Mai 2024", status: "Concluída" },
        header: { titulo: "05 a 12 Mai em Paris", dataResumo: "05–12 Mai", orcamento: "€ 3k - 5k", viajantes: "2 pessoas", rota: "Recife - Paris" },
        voos: {
            ida: { tipo: "Ida", data: "dom., 05 de mai.", preco: "R$ 4.200", co2: "850", partida: { hora: "18:30", aeroporto: "Aeroporto Internacional do Recife (REC)" }, duracao: "11h 20min", detalhes: "Air France Econômica • Airbus A330", chegada: { hora: "09:50", aeroporto: "Aeroporto de Paris-Charles de Gaulle (CDG)" } },
            volta: { tipo: "Volta", data: "dom., 12 de mai.", preco: "R$ 4.100", co2: "850", partida: { hora: "23:15", aeroporto: "Aeroporto de Paris-Charles de Gaulle (CDG)" }, duracao: "11h 45min", detalhes: "Air France Econômica • Airbus A330", chegada: { hora: "06:00", aeroporto: "Aeroporto Internacional do Recife (REC)" } }
        },
        hotel: { nome: "Pullman Paris Tour Eiffel", estrelas: 4, categoria: "Hotel Premium", noites: 7, precoTotal: "€ 2.800", localizacao: "7º Arrondissement", precoNoite: "€ 400", checkIn: "dom., 05 mai. às 15:00", checkOut: "dom., 12 mai. às 12:00", comodidades: ["Wi-Fi Grátis", "Vista da Torre", "Café da Manhã", "Restaurante"] },
        dia1Titulo: "Chegada e Boas-vindas", dia1Data: "05 Maio 2024", ultimoDiaTitulo: "Despedida e Volta", UltimoDiaData: "12 Maio 2024"
    },
    {
        id: "tokyo-2023",
        resumo: { destino: "Tóquio, Japão", data: "10 a 24 Nov 2023", status: "Concluída" },
        header: { titulo: "10 a 24 Nov em Tóquio", dataResumo: "10–24 Nov", orcamento: "$ 4k - 7k", viajantes: "1 pessoa", rota: "Recife - Tóquio" },
        voos: {
            ida: { tipo: "Ida", data: "sex., 10 de nov.", preco: "R$ 7.500", co2: "1200", partida: { hora: "06:00", aeroporto: "Aeroporto Internacional do Recife (REC)" }, duracao: "28h 40min", detalhes: "Emirates Econômica • B777", chegada: { hora: "22:40", aeroporto: "Aeroporto Internacional de Narita (NRT)" } },
            volta: { tipo: "Volta", data: "sex., 24 de nov.", preco: "R$ 7.200", co2: "1200", partida: { hora: "22:30", aeroporto: "Aeroporto Internacional de Narita (NRT)" }, duracao: "30h 15min", detalhes: "Emirates Econômica • B777", chegada: { hora: "16:45", aeroporto: "Aeroporto Internacional do Recife (REC)" } }
        },
        hotel: { nome: "Shinjuku Washington Hotel", estrelas: 4, categoria: "Hotel Executivo", noites: 14, precoTotal: "¥ 140.000", localizacao: "Shinjuku", precoNoite: "¥ 10.000", checkIn: "sáb., 11 nov. às 14:00", checkOut: "sex., 24 nov. às 11:00", comodidades: ["Wi-Fi Grátis", "Lojas de Conveniência", "Restaurante Temático"] },
        dia1Titulo: "Chegada e Boas-vindas", dia1Data: "11 Novembro 2023", ultimoDiaTitulo: "Despedida e Volta", UltimoDiaData: "24 Novembro 2023"
    }
];

export default function HistoricoPage() {
    // Estado para controlar qual roteiro está expandido
    const [expandedRoteiro, setExpandedRoteiro] = useState<string | null>(null);

    const toggleRoteiro = (id: string) => {
        setExpandedRoteiro(prev => prev === id ? null : id);
    };

    return (
        <div className="relative flex h-screen w-full overflow-hidden">

            {/* Imagem de fundo */}
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/fundo-login.jpg"
                    alt="Fundo da página"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>
            </div>

            {/* Sidebar */}
            <aside className="w-20 lg:w-64 flex-shrink-0 flex flex-col justify-between h-full py-8 border-r border-white/40 bg-white/40 backdrop-blur-md shadow-[4px_0_24px_rgba(0,0,0,0.05)] transition-all z-20">
                <div className="flex flex-col gap-10 px-4">

                    {/* Logo direcionando para Landing Page */}
                    <Link href="/" className="flex items-center justify-center lg:justify-start lg:px-4 hover:opacity-80 transition-opacity">
                        <div className="hidden lg:block">
                            <Image src="/logo.png" width={120} height={50} alt="Logo ViajaAí" className="object-contain" />
                        </div>
                        <div className="flex lg:hidden w-12 h-12 bg-[#0F2942] rounded-xl items-center justify-center shadow-lg transition-transform active:scale-95">
                            <Compass className="text-white" size={26} strokeWidth={2} />
                        </div>
                    </Link>

                    {/* Links de navegação */}
                    <nav className="flex flex-col gap-2">
                        <Link href="/" className="flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-2xl text-[#0F2942] hover:bg-white/60 transition-colors">
                            <Home size={22} strokeWidth={1.5} />
                            <span className="hidden lg:block font-medium">Início</span>
                        </Link>

                        <Link href="/explorar" className="flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-2xl text-[#0F2942] hover:bg-white/60 transition-colors">
                            <Compass size={22} strokeWidth={1.5} />
                            <span className="hidden lg:block font-medium">Explorar</span>
                        </Link>

                        <Link href="/chat" className="flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-2xl text-[#0F2942] hover:bg-white/60 transition-colors">
                            <MessageSquare size={22} strokeWidth={1.5} />
                            <span className="hidden lg:block font-medium">Novo Roteiro</span>
                        </Link>

                        <Link href="/historico" className="flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-2xl bg-white/70 text-[#A63C3C] shadow-sm font-semibold transition-colors border border-white/50">
                            <History size={22} strokeWidth={2} />
                            <span className="hidden lg:block">Histórico</span>
                        </Link>
                    </nav>
                </div>

                {/* Rodapé da Sidebar */}
                <div className="flex flex-col gap-2 px-4">
                    <Link href="/configuracoes" className="flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-2xl text-[#0F2942] hover:bg-white/60 transition-colors opacity-70 hover:opacity-100">
                        <Settings size={22} strokeWidth={1.5} />
                        <span className="hidden lg:block font-medium">Configurações</span>
                    </Link>

                    <Link href="/login" className="flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-2xl text-[#0F2942] hover:bg-white/60 transition-colors">
                        <User size={22} strokeWidth={1.5} />
                        <span className="hidden lg:block font-medium">Meu Perfil</span>
                    </Link>
                </div>
            </aside>

            {/* Área Principal de Conteúdo */}
            <div className="flex-1 flex flex-col h-full overflow-y-auto z-10">

                {/* Cabeçalho */}
                <header className="w-full bg-white/50 backdrop-blur-md border-b border-white/40 px-8 py-6 sticky top-0 z-20">
                    <div className="max-w-8xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="font-bold text-[#0F2942] text-2xl">Meus Roteiros</h1>
                                <p className="text-sm text-gray-700 font-medium">Veja o histórico das suas viagens concluídas e planejadas</p>
                            </div>
                        </div>

                        {/* Barra de busca */}
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Procurar no histórico..."
                                className="w-full md:w-80 pl-11 pr-4 py-3 rounded-full bg-white/80 border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#D68585]/50 text-sm shadow-sm placeholder:text-gray-500 text-[#0F2942]"
                            />
                        </div>
                    </div>
                </header>

                {/* Lista do Histórico */}
                <main className="max-w-4xl mx-auto w-full px-4 sm:px-8 py-8 flex flex-col gap-4 pb-20">
                    {ROTEIRO_HISTORICO.map((roteiro) => {
                        const isExpanded = expandedRoteiro === roteiro.id;

                        let statusColor = "bg-gray-100 text-gray-600 border-gray-200";
                        if (roteiro.resumo.status === "Planejada") statusColor = "bg-blue-50 text-blue-600 border-blue-200";
                        if (roteiro.resumo.status === "Concluída") statusColor = "bg-green-50 text-green-600 border-green-200";

                        return (
                            <div key={roteiro.id} className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm overflow-hidden transition-all duration-300">

                                {/* Resumo do Roteiro (barra encolhida) */}
                                <button
                                    onClick={() => toggleRoteiro(roteiro.id)}
                                    className="w-full p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/50 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-[#FCF3F3] rounded-2xl flex items-center justify-center text-[#A63C3C] shrink-0">
                                            <MapPin size={28} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-[#0F2942]">{roteiro.resumo.destino}</h2>
                                            <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                                                <span className="flex items-center gap-1"><Calendar size={14} /> {roteiro.resumo.data}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${statusColor}`}>
                                                    {roteiro.resumo.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-400">
                                        <span className="text-sm font-medium hidden sm:block">
                                            {isExpanded ? "Ocultar detalhes" : "Ver roteiro completo"}
                                        </span>
                                        <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm text-[#0F2942]">
                                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                    </div>
                                </button>

                                {/* Detalhes do Roteiro (barra expandida)*/}
                                {isExpanded && (
                                    <div className="border-t border-gray-100 bg-white/15">

                                        {/* Reutilizando os componentes de Roteiro */}
                                        <HeaderRoteiro {...roteiro.header} />

                                        <div className="p-6 flex flex-col gap-6">

                                            {/* Voos */}
                                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                                <CardVoo {...roteiro.voos.ida} />
                                                <CardVoo {...roteiro.voos.volta} />
                                            </div>

                                            {/* Hotel */}
                                            <CardHotel {...roteiro.hotel} />

                                            {/* Exemplo do primeiro dia */}
                                            <div className="mt-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                                <div className="flex justify-between items-center cursor-pointer group">
                                                    <div className="flex items-center gap-3">
                                                        <CheckCircle2 className="text-[#A63C3C]" size={28} strokeWidth={2} />
                                                        <h3 className="text-[#A63C3C] text-xl font-bold group-hover:underline">{roteiro.dia1Titulo}</h3>
                                                    </div>
                                                    <ChevronDown className="text-gray-400 transition-transform" />
                                                </div>
                                                <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-2 ml-10">{roteiro.dia1Data}</p>
                                                <div className="ml-3.5 border-l-2 border-[#FCF3F3] h-20 mt-4"></div>
                                            </div>

                                            {/* Exemplo de Último dia */}
                                            <div className="mt-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                                <div className="flex justify-between items-center cursor-pointer group">
                                                    <div className="flex items-center gap-3">
                                                        <CheckCircle2 className="text-[#A63C3C]" size={28} strokeWidth={2} />
                                                        <h3 className="text-[#A63C3C] text-xl font-bold group-hover:underline">{roteiro.ultimoDiaTitulo}</h3>
                                                    </div>
                                                    <ChevronDown className="text-gray-400 transition-transform" />
                                                </div>
                                                <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-2 ml-10">{roteiro.UltimoDiaData}</p>
                                                <div className="ml-3.5 border-l-2 border-[#FCF3F3] h-20 mt-4"></div>
                                            </div>

                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </main>
            </div>
        </div>
    );
}