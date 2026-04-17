import { Sparkles, Image as ImageIcon, MapPin, Send } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-sm border overflow-hidden">
      
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
  );
}