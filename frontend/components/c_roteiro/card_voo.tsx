import { Plane, Wifi, BatteryCharging, Tv } from "lucide-react";

export interface CardVooProps {
  tipo: "Ida" | "Volta";
  data: string;
  preco: string;
  co2: string;
  partida: {
    hora: string;
    aeroporto: string;
  };
  duracao: string;
  detalhes: string;
  chegada: {
    hora: string;
    aeroporto: string;
  };
}

export function CardVoo({ 
  tipo, 
  data, 
  preco, 
  co2, 
  partida, 
  duracao, 
  detalhes, 
  chegada 
}: CardVooProps) {
  return (
    <div className="bg-white/90 rounded-2xl border border-white/60 shadow-sm p-6 shrink-0 w-full">
      
      {/* header do card com preço e data) */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-[#FCF3F3] text-[#A63C3C] flex items-center justify-center shrink-0">
            <Plane size={24} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-bold text-[#0F2942] text-lg">Voo de {tipo}</h3>
            <p className="text-sm text-gray-400">{data}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">{co2} kg de CO2e <br/><span className="text-[10px]">estimativa média ⓘ</span></p>
          <p className="font-bold text-[#A63C3C] text-xl mt-1">{preco}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8">
        {/* timeline do voo*/}
        <div className="relative pl-6 border-l-2 border-dotted border-gray-300 ml-3 space-y-8">
          <div className="absolute w-3 h-3 border-2 border-gray-400 rounded-full bg-white -left-[7px] top-1"></div>
          <div>
            <p className="font-bold text-[#0F2942] text-sm">{partida.hora} • {partida.aeroporto}</p>
            <p className="text-xs text-gray-400 mt-2">Tempo de viagem: {duracao}</p>
            <p className="text-xs text-gray-400 mt-1">{detalhes}</p>
          </div>
          <div className="absolute w-3 h-3 border-2 border-gray-400 rounded-full bg-white -left-[7px] bottom-1"></div>
          <div>
            <p className="font-bold text-[#0F2942] text-sm">{chegada.hora} • {chegada.aeroporto}</p>
          </div>
        </div>
        
        {/* comodidades */}
        <div className="flex flex-col gap-3 text-xs text-gray-500 font-medium justify-center">
          <div className="flex items-center gap-2"><Wifi size={16} /> Wi-Fi cobrado à parte</div>
          <div className="flex items-center gap-2"><BatteryCharging size={16} /> Saída USB</div>
          <div className="flex items-center gap-2"><Tv size={16} /> Streaming no dispositivo</div>
        </div>
      </div>
      
    </div>
  );
}