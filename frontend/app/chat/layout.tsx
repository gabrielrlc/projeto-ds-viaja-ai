import { MessageSquare, Clock, Compass, PlusCircle, Settings } from "lucide-react";
import Link from "next/link";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Fundo bege clarinho que preenche toda a tela
    <div className="flex h-screen w-full bg-[#FDF7EA] p-4 gap-4 overflow-hidden"> 
      
      {/* Barra Lateral de Navegação */}
      <aside className="w-16 flex flex-col items-center py-4 gap-8">
        
        {/* Logo / Ícone Superior Escuro */}
        <Link href="/" className="w-12 h-12 bg-[#0F2942] rounded-2xl flex items-center justify-center text-white hover:opacity-90 transition-opacity">
          <Compass size={24} strokeWidth={1.5} />
        </Link>

        {/* Menu Principal de Ícones */}
        <nav className="flex flex-col gap-8 items-center text-gray-500 mt-4">
          <Link href="/chat" className="hover:text-slate-900 transition-colors">
            <MessageSquare size={24} strokeWidth={1.5} />
          </Link>
          <Link href="/historico" className="hover:text-slate-900 transition-colors">
            <Clock size={24} strokeWidth={1.5} />
          </Link>
          <Link href="/explorar" className="hover:text-slate-900 transition-colors">
            <Compass size={24} strokeWidth={1.5} />
          </Link>
          <button className="hover:text-slate-900 transition-colors">
            <PlusCircle size={24} strokeWidth={1.5} />
          </button>
        </nav>

        {/* Menu Inferior (Settings e Avatar) */}
        {/* O 'mt-auto' é o truque mágico que empurra tudo isso para a parte de baixo da tela */}
        <div className="mt-auto flex flex-col gap-8 items-center text-gray-500">
          <button className="hover:text-slate-900 transition-colors">
            <Settings size={24} strokeWidth={1.5} />
          </button>
          
          {/* Avatar do Usuário */}
          <div className="w-10 h-10 bg-[#8C1D1D] rounded-full flex items-center justify-center text-white font-semibold cursor-pointer">
            U
          </div>
        </div>
        
      </aside>

      {/* Área Principal onde a página de chat (page.tsx) vai ser renderizada */}
      <main className="flex-1 h-full overflow-hidden">
        {children}
      </main>

    </div>
  );
}