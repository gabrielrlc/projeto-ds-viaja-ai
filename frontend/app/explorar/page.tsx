"use client";

import { useEffect, useState } from "react";
import { AttractionCard } from "@/components/c_explorar/attraction_card";
import { EmptyState } from "@/components/c_explorar/empty_state";
import { ExplorarHeader } from "@/components/c_explorar/explorar_header";
import { Sidebar } from "@/components/ui/sidebar";
import { buscarDestinos, buscarAtracoes } from "@/lib/api/explorar";
import type { Attraction, City, Category } from "@/lib/types/explorar";

// Fallback: dados locais usados se o backend estiver indisponível
import {
  ATRACOES as ATRACOES_MOCK,
  CITIES as CITIES_MOCK,
  CATEGORIES as CATEGORIES_MOCK,
} from "@/lib/data/mockAtracoes";

export default function ExplorarPage() {
  const [cities, setCities] = useState<string[]>(CITIES_MOCK);
  const [categories, setCategories] = useState<string[]>(CATEGORIES_MOCK);
  const [atracoes, setAtracoes] = useState<Attraction[]>(
    ATRACOES_MOCK as Attraction[],
  );
  const [selectedCity, setSelectedCity] = useState<City>("Rio de Janeiro");
  const [selectedCategory, setSelectedCategory] = useState<Category>("Todas");
  const [carregandoAtracoes, setCarregandoAtracoes] = useState(false);
  const [usandoMock, setUsandoMock] = useState(false);

  // Carrega cidades e categorias disponíveis ao montar a página
  useEffect(() => {
    buscarDestinos()
      .then((data) => {
        setCities(data.cities as City[]);
        setCategories(data.categories as Category[]);
      })
      .catch(() => {
        // Silencioso: mantém o mock já definido no estado inicial
        setUsandoMock(true);
      });
  }, []);

  // Recarrega atrações sempre que a cidade selecionada muda
  useEffect(() => {
    setCarregandoAtracoes(true);

    buscarAtracoes(selectedCity)
      .then((data) => {
        setAtracoes(data.atracoes);
        setUsandoMock(false);
      })
      .catch(() => {
        // Fallback: filtra os dados do mock local para a cidade selecionada
        setAtracoes(
          (ATRACOES_MOCK as Attraction[]).filter((a) => a.city === selectedCity),
        );
        setUsandoMock(true);
      })
      .finally(() => setCarregandoAtracoes(false));
  }, [selectedCity]);

  const filteredAttractions = atracoes.filter((a) => {
    return selectedCategory === "Todas" || a.category === selectedCategory;
  });

  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-y-auto z-10">
        <ExplorarHeader />

        <main className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 flex flex-col gap-8 pb-20">

          {usandoMock && (
            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
              Exibindo dados locais — backend indisponível.
            </div>
          )}

          <section className="flex flex-col gap-6">
            <div>
              <h3 className="text-xs font-bold text-[#0F2942] mb-3 uppercase tracking-wider bg-white/50 inline-block px-3 py-1 rounded-md">
                Destinos mais procurados
              </h3>
              <div className="flex flex-wrap gap-3">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city as City)}
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

            <div>
              <h3 className="text-xs font-bold text-[#0F2942] mb-3 uppercase tracking-wider bg-white/50 inline-block px-3 py-1 rounded-md">
                Quais são seus interesses?
              </h3>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat as Category)}
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

          <section>
            {carregandoAtracoes ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-80 rounded-3xl bg-white/60 animate-pulse"
                  />
                ))}
              </div>
            ) : filteredAttractions.length === 0 ? (
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