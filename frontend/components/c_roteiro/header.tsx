import { Share2, Download, Link as LinkIcon, Calendar, DollarSign, Users, MapPin } from "lucide-react";

export interface HeaderRoteiroProps {
  titulo: string;
  dataResumo: string;
  orcamento: string;
  viajantes: string;
  rota: string;
}

export function HeaderRoteiro({
  titulo,
  dataResumo,
  orcamento,
  viajantes,
  rota
}: HeaderRoteiroProps) {
  return (
    <header className="p-6 border-b border-white/40 bg-white/40 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-[#0F2942] text-2xl">{titulo}</h2>
        
        {/* botões de ação */}
        <div className="flex gap-2 text-[#0F2942]">
          <button className="p-2 hover:bg-white/60 rounded-full transition-colors">
            <Share2 size={20} strokeWidth={1.5} />
          </button>
          <button className="p-2 hover:bg-white/60 rounded-full transition-colors">
            <Download size={20} strokeWidth={1.5} />
          </button>
          <button className="p-2 hover:bg-white/60 rounded-full transition-colors">
            <LinkIcon size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>
      
      {/* resumo da viagem */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 font-medium">
        <div className="flex items-center gap-1.5"><Calendar size={16} /> {dataResumo}</div>
        <div className="flex items-center gap-1.5"><DollarSign size={16} /> {orcamento}</div>
        <div className="flex items-center gap-1.5"><Users size={16} /> {viajantes}</div>
        <div className="flex items-center gap-1.5"><MapPin size={16} /> {rota}</div>
      </div>
    </header>
  );
}