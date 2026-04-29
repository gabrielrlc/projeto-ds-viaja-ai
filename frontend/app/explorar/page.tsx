"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MapPin,
  Clock,
  DollarSign,
  ArrowRight,
  Compass,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/ui/sidebar";
import {
  ATRACOES,
  CITIES,
  CATEGORIES,
  type City,
  type Category,
  type Attraction,
} from "@/lib/data/mockAtracoes";

// ── Componente principal ───────────────────────────────────────────────────

export default function ExplorarPage() {
  const [selectedCity, setSelectedCity] = useState<City>("Rio de Janeiro");
  const [selectedCategory, setSelectedCategory] = useState<Category>("Todas");

  const filteredAttractions = ATRACOES.filter((a) => {
    const matchCity = a.city === selectedCity;
    const matchCategory =
      selectedCategory === "Todas" || a.category === selectedCategory;
    return matchCity && matchCategory;
  });

  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-y-auto z-10">
        {/* cabeçalho */}
        <header className="w-full bg-white/50 backdrop-blur-md border-b border-white/40 px-8 py-6 sticky top-0 z-20">
          <div className="max-w-8xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-bold text-[#0F2942] text-2xl">
                Descobrir Destinos
              </h1>
              <p className="text-sm text-gray-700 font-medium">
                Inspirações para a sua próxima viagem
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
                placeholder="Procurar destinos, pontos turísticos..."
                className="w-full md:w-80 pl-11 pr-4 py-3 rounded-full bg-white/80 border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#D68585]/50 text-sm shadow-sm placeholder:text-gray-500 text-[#0F2942]"
                readOnly
              />
            </div>
          </div>
        </header>

        {/* conteúdo principal */}
        <main className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 flex flex-col gap-8 pb-20">
          {/* filtros */}
          <section className="flex flex-col gap-6">
            {/* filtro por cidade */}
            <div>
              <h3 className="text-xs font-bold text-[#0F2942] mb-3 uppercase tracking-wider bg-white/50 inline-block px-3 py-1 rounded-md">
                Destinos mais procurados
              </h3>
              <div className="flex flex-wrap gap-3">
                {CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all shadow-sm ${
                      selectedCity === city
                        ? "bg-[#0F2942] text-white"
                        : "bg-white/70 backdrop-blur-sm border border-white/40 text-gray-700 hover:bg-white"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* filtro por categoria */}
            <div>
              <h3 className="text-xs font-bold text-[#0F2942] mb-3 uppercase tracking-wider bg-white/50 inline-block px-3 py-1 rounded-md">
                Quais são seus interesses?
              </h3>
              <div className="flex flex-wrap gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm ${
                      selectedCategory === cat
                        ? "bg-[#FCF3F3] text-[#A63C3C] border-2 border-[#F2D6D6]"
                        : "bg-white/70 backdrop-blur-sm border border-white/40 text-gray-600 hover:bg-white/90"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* resultados */}
          <section>
            {filteredAttractions.length === 0 ? (
              <EmptyState city={selectedCity} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAttractions.map((attraction) => (
                  <AttractionCard key={attraction.id} attraction={attraction} />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

// ── Subcomponentes ─────────────────────────────────────────────────────────

function EmptyState({ city }: { city: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-white/90 backdrop-blur-sm rounded-3xl border border-white/40">
      <Compass className="text-gray-400 mb-4" size={48} strokeWidth={1} />
      <h3 className="text-xl font-semibold text-[#0F2942]">
        Nenhum local encontrado
      </h3>
      <p className="text-gray-600 mt-2">
        Ainda estamos mapeando locais nesta categoria para {city}.
      </p>
    </div>
  );
}

function AttractionCard({ attraction }: { attraction: Attraction }) {
  return (
    <div className="group bg-white/90 backdrop-blur-md rounded-3xl border border-white/50 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* imagem */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={attraction.imageUrl}
          alt={attraction.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-[#A63C3C] shadow-sm">
          {attraction.category}
        </div>
        <h3 className="absolute bottom-4 left-4 right-4 text-white font-bold text-xl leading-tight">
          {attraction.name}
        </h3>
      </div>

      {/* conteúdo */}
      <div className="p-5 flex flex-col flex-1 gap-4">
        <p className="text-sm text-gray-600 line-clamp-2">
          {attraction.description}
        </p>

        <div className="space-y-2 mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} className="text-[#D68585] shrink-0" />
            <span className="truncate">{attraction.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={16} className="text-[#D68585] shrink-0" />
            <span>{attraction.hours}</span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2 text-sm font-semibold bg-green-50 px-2 py-1 rounded-md">
              <DollarSign size={16} className="text-green-600" />
              <span className="text-green-700">{attraction.price}</span>
            </div>

            {/* TODO: implementar navegação para o chat com destino pré-preenchido */}
            <Button
              variant="ghost"
              size="sm"
              disabled
              className="text-[#A63C3C] hover:text-[#A63C3C] hover:bg-[#FCF3F3] rounded-full group/btn disabled:opacity-40"
            >
              Adicionar{" "}
              <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
