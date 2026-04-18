import { Sparkles, Image as ImageIcon, MapPin, Send,Calendar, DollarSign, Users } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="flex h-full gap-4 overflow-hidden">
      
      {/* Coluna Esquerda - Chat */}
      <div className="flex-1 flex flex-col h-full bg-white rounded-3xl shadow-sm border overflow-hidden">
      
      {/* Cabeçalho do Chat */}
      <header className="p-6 border-b flex items-center gap-4">
         <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-[#0F2942]">
            <Sparkles size={24} strokeWidth={1.5} />
         </div>
         <div className="flex flex-col">
            <h2 className="font-bold text-[#0F2942] text-xl">Novo Chat</h2>
            <p className="text-sm text-gray-400">Itinerário em progresso</p>
         </div>
      </header>

      {/* Espaço das mensagens (Estático para integração futura) */}
      <div className="flex-1 p-6 bg-white overflow-y-auto flex flex-col gap-4">
        
        {/* Balão de Mensagem do Bot */}
        <div className="max-w-[85%]">
          <div className="p-4 rounded-2xl border border-[#EACFC4] text-[#0F2942] text-[15px] leading-relaxed">
            Olá! Sou o ViajaAI, seu planejador de viagens inteligente. Para onde você gostaria de ir?
          </div>
        </div>

        {/* Botões de Sugestão de Destino */}
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

        {/* Horário da mensagem */}
        <span className="text-xs text-gray-400 mt-1">09:00</span>

      </div>

      {/* Footer / Input de mensagens */}
      <footer className="p-6 pt-2 bg-white flex flex-col gap-3">
         
         <div className="flex items-center gap-3 p-2 rounded-2xl border bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#D68585]/30 transition-all">
            
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <ImageIcon size={22} strokeWidth={1.5} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors -ml-2">
              <MapPin size={22} strokeWidth={1.5} />
            </button>

            {/* Campo de texto estático */}
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

      {/* Coluna Direita - Roteiro de Viagem */}
      <div className="flex-1">
        <Roteiro />
      </div>
      
    </div>
  );
}

export function Roteiro() {
  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-sm border overflow-hidden">
      
      {/* Cabeçalho do Roteiro */}
      <header className="p-6 border-b flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-[#0F2942]">
          <MapPin size={24} strokeWidth={1.5} />
        </div>
        <div className="flex flex-col">
          <h2 className="font-bold text-[#0F2942] text-xl">Roteiro da Viagem</h2>
          <p className="text-sm text-gray-400">Seu itinerário</p>
        </div>
      </header>

      {/* Conteúdo do Roteiro (que deve vir das respostas do Chat)*/}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
        
        {/* Informações Gerais */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-[#FCF3F3] rounded-2xl">
            <MapPin size={20} className="text-[#D68585]" strokeWidth={1.5} />
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium">Destino</p>
              <p className="text-sm font-semibold text-[#0F2942]">Rio de Janeiro</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-[#FCF3F3] rounded-2xl">
            <Users size={20} className="text-[#D68585]" strokeWidth={1.5} />
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium">Viajantes</p>
              <p className="text-sm font-semibold text-[#0F2942]">2 pessoas</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-[#FCF3F3] rounded-2xl">
            <DollarSign size={20} className="text-[#D68585]" strokeWidth={1.5} />
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium">Orçamento</p>
              <p className="text-sm font-semibold text-[#0F2942]">R$ 5.000</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-[#FCF3F3] rounded-2xl">
            <Calendar size={20} className="text-[#D68585]" strokeWidth={1.5} />
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium">Datas</p>
              <p className="text-sm font-semibold text-[#0F2942]">20-23 de Maio</p>
            </div>
          </div>
        </div>

        {/* Divisor */}
        <div className="border-t border-gray-100"></div>

        {/* Atividades do Roteiro (que vira do BD)*/}
        <div className="space-y-3">
          <h3 className="font-semibold text-[#0F2942] text-sm">Atividades Planejadas</h3>
          
          {[
            { day: "Dia 1", activity: "Chegada e check-in no hotel" },
            { day: "Dia 2", activity: "Visita ao Cristo Redentor" },
            { day: "Dia 3", activity: "Praia de Copacabana" },
            { day: "Dia 4", activity: "Explorar o Bairro da Lapa" },
            { day: "Dia 4", activity: "Check-out no hotel" },
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#D68585]/30 transition-colors">
              <p className="text-xs font-semibold text-[#D68585]">{item.day}</p>
              <p className="text-sm text-[#0F2942] mt-1">{item.activity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}