"use client";

import { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import {
  ROTEIRO_HISTORICO,
  type RoteiroHistorico,
} from "@/lib/data/mockHistorico";
import { Sidebar } from "@/components/ui/sidebar";
import { CardVoo } from "@/components/c_roteiro/card_voo";
import { CardHotel } from "@/components/c_roteiro/card_hotel";
import { HeaderRoteiro } from "@/components/c_roteiro/header";

// ── Helpers ────────────────────────────────────────────────────────────────

function getStatusStyle(status: string): string {
  switch (status) {
    case "Planejada":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "Concluída":
      return "bg-green-50 text-green-600 border-green-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
}

// ── Subcomponentes ─────────────────────────────────────────────────────────

function DiaCard({ titulo, data }: { titulo: string; data: string }) {
  return (
    <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <CheckCircle2
            className="text-[#A63C3C] shrink-0"
            size={28}
            strokeWidth={2}
          />
          <h3 className="text-[#A63C3C] text-xl font-bold">{titulo}</h3>
        </div>
        <ChevronDown className="text-gray-400" />
      </div>
      <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-2 ml-10">
        {data}
      </p>
      <div className="ml-3.5 border-l-2 border-[#FCF3F3] h-20 mt-4" />
    </div>
  );
}

function RoteiroCard({ roteiro }: { roteiro: RoteiroHistorico }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusStyle = getStatusStyle(roteiro.resumo.status);

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm overflow-hidden transition-all duration-300">
      {/* cabeçalho clicável */}
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/50 transition-colors text-left"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#FCF3F3] rounded-2xl flex items-center justify-center text-[#A63C3C] shrink-0">
            <MapPin size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0F2942]">
              {roteiro.resumo.destino}
            </h2>
            <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {roteiro.resumo.data}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${statusStyle}`}
              >
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

      {/* conteúdo expandido */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-white/15">
          <HeaderRoteiro {...roteiro.header} />

          <div className="p-6 flex flex-col gap-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <CardVoo {...roteiro.voos.ida} />
              <CardVoo {...roteiro.voos.volta} />
            </div>

            <CardHotel {...roteiro.hotel} />

            <DiaCard titulo={roteiro.dia1Titulo} data={roteiro.dia1Data} />
            <DiaCard
              titulo={roteiro.ultimoDiaTitulo}
              data={roteiro.UltimoDiaData}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────

export default function HistoricoPage() {
  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-y-auto z-10">
        {/* cabeçalho */}
        <header className="w-full bg-white/50 backdrop-blur-md border-b border-white/40 px-8 py-6 sticky top-0 z-20">
          <div className="max-w-8xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-bold text-[#0F2942] text-2xl">
                Meus Roteiros
              </h1>
              <p className="text-sm text-gray-700 font-medium">
                Veja o histórico das suas viagens concluídas e planejadas
              </p>
            </div>

            {/* barra de busca — visual por enquanto */}
            <div className="relative w-full md:w-auto">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Procurar no histórico..."
                readOnly
                className="w-full md:w-80 pl-11 pr-4 py-3 rounded-full bg-white/80 border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#D68585]/50 text-sm shadow-sm placeholder:text-gray-500 text-[#0F2942]"
              />
            </div>
          </div>
        </header>

        {/* lista de roteiros */}
        <main className="max-w-4xl mx-auto w-full px-4 sm:px-8 py-8 flex flex-col gap-4 pb-20">
          {ROTEIRO_HISTORICO.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white/90 rounded-3xl border border-white/40">
              <MapPin
                className="text-gray-300 mb-4"
                size={48}
                strokeWidth={1}
              />
              <h3 className="text-xl font-semibold text-[#0F2942]">
                Nenhum roteiro ainda
              </h3>
              <p className="text-gray-500 mt-2 text-sm">
                Seus roteiros gerados pelo ViajaAI aparecerão aqui.
              </p>
            </div>
          ) : (
            ROTEIRO_HISTORICO.map((roteiro) => (
              <RoteiroCard key={roteiro.id} roteiro={roteiro} />
            ))
          )}
        </main>
      </div>
    </div>
  );
}
