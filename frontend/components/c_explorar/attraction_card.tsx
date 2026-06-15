"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Clock, DollarSign, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Attraction } from "@/lib/types/explorar";
import { AttractionModal } from "./attraction_modal";

export function AttractionCard({ attraction }: { attraction: Attraction }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        className="group bg-white/90 backdrop-blur-md rounded-3xl border border-white/50 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
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

            <div className="flex items-center justify-between mt-4 p-2 bg-gray-50/50 backdrop-blur-sm border border-gray-100/80 shadow-[0_4px_12px_rgba(0,0,0,0.02)] rounded-2xl">
              <div className="flex items-center gap-2 bg-white shadow-sm px-3 py-2 rounded-xl border border-gray-100/50">
                <div className="bg-green-50 p-1 rounded-full shrink-0">
                  <DollarSign size={14} className="text-green-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-wider text-gray-500 leading-none mb-0.5 font-bold">A partir de / Aprox.</span>
                  <span className="text-sm font-bold text-[#0F2942] leading-none">{attraction.price}</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-[#A63C3C] bg-white hover:bg-white hover:text-[#A63C3C] hover:shadow-md shadow-sm border border-gray-100/50 rounded-xl group/btn transition-all duration-300 px-4"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
              >
                Detalhes{" "}
                <ArrowRight className="ml-1.5 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AttractionModal 
        attraction={attraction}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
