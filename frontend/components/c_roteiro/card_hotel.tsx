import Image from "next/image";
import {
  Coffee,
  Dumbbell,
  ExternalLink,
  Hotel,
  MapPin,
  Sparkles,
  Star,
  Utensils,
  Waves,
  Wifi,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  "Wi-Fi Gratis": Wifi,
  "Wi-Fi Grátis": Wifi,
  Piscina: Waves,
  "Cafe da Manha": Coffee,
  "Café da Manhã": Coffee,
  Academia: Dumbbell,
  Spa: Sparkles,
  Restaurante: Utensils,
};

export interface CardHotelProps {
  nome: string;
  estrelas: number;
  categoria: string;
  noites: number;
  precoTotal: string;
  localizacao: string;
  precoNoite: string;
  checkIn: string;
  checkOut: string;
  comodidades: string[];
  imagemUrl?: string;
  linkHotel?: string;
}

export function CardHotel({
  nome,
  estrelas,
  categoria,
  noites,
  precoTotal,
  localizacao,
  precoNoite,
  checkIn,
  checkOut,
  comodidades,
  imagemUrl,
  linkHotel,
}: CardHotelProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#EACFC4] shadow-md p-6 shrink-0 w-full hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start gap-4 mb-6">
        <div className="flex gap-4 min-w-0">
          <div className="w-12 h-12 rounded-full bg-[#FCF3F3] text-[#A63C3C] flex items-center justify-center shrink-0">
            <Hotel size={24} strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 overflow-hidden">
              <h3 className="font-bold text-[#0F2942] text-lg truncate max-w-45" title={nome}>
                {nome}
              </h3>
              <div className="flex text-[#A63C3C] shrink-0">
                {Array.from({ length: estrelas }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-400">{categoria}</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <MapPin size={14} className="text-[#A63C3C] shrink-0" />
              <span className="truncate">{localizacao}</span>
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-gray-400">{noites} noites</p>
          <p className="font-bold text-[#A63C3C] text-xl mt-1">{precoTotal}</p>
          <p className="text-xs text-gray-400 mt-0.5">{precoNoite}/noite</p>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_150px] md:grid-cols-[minmax(0,1fr)_280px] gap-4 md:gap-5 items-start">
        <div className="min-w-0">
          <div className="relative pl-6 border-l-2 border-dotted border-gray-300 ml-3 space-y-8">
            <div className="absolute w-3 h-3 border-2 border-gray-400 rounded-full bg-white -left-[7px] top-[5px]"></div>
            <div className="pt-[1px]">
              <p className="text-sm text-gray-500">Check-in: {checkIn}</p>
            </div>
            <div className="relative pb-[1px]">
              <div className="absolute w-3 h-3 border-2 border-gray-400 rounded-full bg-white -left-[31px] top-[5px]"></div>
              <p className="text-sm text-gray-500">Check-out: {checkOut}</p>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-4">
            <p className="mb-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Comodidades Incluídas</p>
            <div className="flex flex-wrap gap-2">
              {comodidades.map((item) => {
                const Icon = ICON_MAP[item] || Sparkles;
                return (
                  <div
                    key={item}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-md text-xs font-medium text-gray-600"
                  >
                    <Icon size={14} /> {item}
                  </div>
                );
              })}
            </div>
            {linkHotel && (
              <a
                href={linkHotel}
                target="_blank"
                rel="noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#A63C3C] hover:underline"
              >
                Mais informações
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>

        {imagemUrl && (
          <div className="relative h-36 md:h-48 w-full overflow-hidden rounded-xl bg-[#FCF3F3]">
            <Image
              src={imagemUrl}
              alt={`Foto de ${nome}`}
              fill
              sizes="(max-width: 768px) 150px, 280px"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
