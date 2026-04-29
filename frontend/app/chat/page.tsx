import { CardVoo } from "@/components/c_roteiro/card_voo";
import { CardHotel } from "@/components/c_roteiro/card_hotel";
import { HeaderRoteiro } from "@/components/c_roteiro/header";
import { 
  Sparkles, Image as ImageIcon, MapPin, Send, Calendar, DollarSign, Users,
  Share2, Download, Link as LinkIcon, Plane, Hotel, Star, Waves, Coffee,
  Dumbbell, Utensils, CheckCircle2, ChevronDown,
  Wifi} from "lucide-react";

export default function ChatPage() {
  return (
    <div className="flex h-full gap-4 overflow-hidden">
      
      {/* coluna esquerda - chat */}
      <div className="flex-1 flex flex-col h-full bg-white rounded-3xl shadow-sm border overflow-hidden">
      
      {/* cabeçalho do chat */}
      <header className="p-6 border-b flex items-center gap-4">
         <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-[#0F2942]">
            <Sparkles size={24} strokeWidth={1.5} />
         </div>
         <div className="flex flex-col">
            <h2 className="font-bold text-[#0F2942] text-xl">Novo Chat</h2>
            <p className="text-sm text-gray-400">Itinerário em progresso</p>
         </div>
      </header>

      {/* espaço de mensagens */}
      <div className="flex-1 p-6 bg-white overflow-y-auto flex flex-col gap-4">
        
        {/* balão de mensagem do bot */}
        <div className="max-w-[85%]">
          <div className="p-4 rounded-2xl border border-[#EACFC4] text-[#0F2942] text-[15px] leading-relaxed">
            Olá! Sou o ViajaAI, seu planejador de viagens inteligente. Para onde você gostaria de ir?
          </div>
        </div>

        {/* botões de sugestão */}
        <div className="flex flex-wrap gap-3 mt-1">
          {["Rio de Janeiro", "Paris", "Tóquio", "Nova York"].map((city) => (
            <button 
              key={city}
              className="px-5 py-2 rounded-full border border-[#F2D6D6] bg-[#FCF3F3] text-[#A63C3C] text-sm font-medium hover:bg-[#F8E8E8] transition-colors cursor-pointer"
            >
              {city}
            </button>
          ))}
        </div>

        {/* horário da mensagem */}
        <span className="text-xs text-gray-400 mt-1">09:00</span>

      </div>

      {/* Footer / Input */}
      <footer className="p-6 pt-2 bg-white flex flex-col gap-3">
         
         <div className="flex items-center gap-3 p-2 rounded-2xl border bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#D68585]/30 transition-all">
            
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <ImageIcon size={22} strokeWidth={1.5} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors -ml-2">
              <MapPin size={22} strokeWidth={1.5} />
            </button>

            {/* campo de texto */}
            <input 
              type="text" 
              placeholder="Digite sua resposta ou peça sugestões..." 
              className="flex-1 bg-transparent border-none outline-none text-gray-600 placeholder:text-gray-400"
            />

            <button className="w-12 h-12 bg-[#D68585] rounded-xl flex items-center justify-center text-white hover:bg-[#C57474] transition-colors">
              <Send size={20} strokeWidth={1.5} className="-ml-1" />
            </button>
         </div>

         <p className="text-center text-xs text-gray-400 mt-2 font-medium">
            O ViajaAI pode cometer erros. Considere verificar as informações.
         </p>
      </footer>
      </div>

      {/* coluna direita - roteiro */}
      <div className="flex-1">
        <Roteiro />
      </div>
      
    </div>
  );
}

export function Roteiro() {
  return (
    <div className="flex flex-col h-full bg-white/70 backdrop-blur-md rounded-3xl shadow-sm border border-white/50 overflow-hidden">
      
      {/* header do roteiro */}
      <HeaderRoteiro 
        titulo="12 a 16 Ago no Rio de Janeiro"
        dataResumo="12–16 Ago"
        orcamento="R$ 10k - 25k"
        viajantes="1 pessoa"
        rota="Recife - Rio de Janeiro"
      />

      {/* conteúdo scroll */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
          
          {/* voo de ida */}
          <CardVoo 
            tipo="Ida"
            data="ter., 12 de ago."
            preco="R$ 650"
            co2="181"
            partida={{ hora: "08:00", aeroporto: "Aeroporto Internacional do Recife (REC)" }}
            duracao="3h 15min"
            detalhes="GOL Econômica • Boeing 737 • G3 1554"
            chegada={{ hora: "11:15", aeroporto: "Aeroporto Internacional do Rio de Janeiro (GIG)" }}
          />

          {/* voo de volta*/}
          <CardVoo 
            tipo="Volta"
            data="sáb., 16 de ago."
            preco="R$ 600"
            co2="181"
            partida={{ hora: "15:00", aeroporto: "Aeroporto Internacional do Rio de Janeiro (GIG)" }}
            duracao="3h 15min"
            detalhes="GOL Econômica • Boeing 737 • G3 1555"
            chegada={{ hora: "18:15", aeroporto: "Aeroporto Internacional do Recife (REC)" }}
          />

        <CardHotel 
          nome="Copacabana Palace"
          estrelas={5}
          categoria="Hotel de Luxo"
          noites={4}
          precoTotal="R$ 8.400"
          localizacao="Copacabana"
          precoNoite="R$ 2.100"
          checkIn="ter., 12 de ago. às 14:00"
          checkOut="sáb., 16 de ago. às 12:00"
          comodidades={["Wi-Fi Grátis", "Piscina", "Café da Manhã", "Academia", "Spa", "Restaurante"]}
        />

        {/* div dia 1 */}
        <div className="mt-4">
          <div className="flex justify-between items-center cursor-pointer group">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-[#A63C3C]" size={28} strokeWidth={2} />
              <h3 className="text-[#A63C3C] text-xl font-bold group-hover:underline">Dia 1 — Chegada e Boas-vindas</h3>
            </div>
            <ChevronDown className="text-gray-400 transition-transform" />
          </div>
          <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-2 ml-10">12 Agosto 2025</p>
          
          {/* Linha vermelha lateral que indica o corpo do dia */}
          <div className="ml-3.5 border-l-2 border-[#FCF3F3] h-20 mt-4"></div>
        </div>

      </div>
    </div>
  );
}