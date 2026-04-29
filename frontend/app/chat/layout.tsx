import Image from "next/image";
import Link from "next/link";
import { Compass, Home, MessageSquare, History, Settings, User } from "lucide-react";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      {/* fundo */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/fundo-login.jpg"
          alt="Fundo"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>
      </div>

      {/* barra de navegação */}
      <aside className="w-20 lg:w-64 flex-shrink-0 flex flex-col justify-between h-full py-8 border-r border-white/40 bg-white/40 backdrop-blur-md shadow-[4px_0_24px_rgba(0,0,0,0.05)] transition-all z-20">
        <div className="flex flex-col gap-10 px-4">
          {/* logo */}
          <Link href="/" className="flex items-center justify-center lg:justify-start lg:px-4 hover:opacity-80 transition-opacity">
            <div className="hidden lg:block">
              <Image
                src="/logo.png"
                width={120}
                height={50}
                alt="Logo ViajaAí"
                className="object-contain"
              />
            </div>
            <div className="flex lg:hidden w-12 h-12 bg-[#0F2942] rounded-xl items-center justify-center shadow-lg transition-transform active:scale-95">
              <Compass className="text-white" size={26} strokeWidth={2} />
            </div>
          </Link>

          {/* links da nav bar */}
          <nav className="flex flex-col gap-2">
            <Link href="/" className="flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-2xl text-[#0F2942] hover:bg-white/60 transition-colors opacity-70 hover:opacity-100">
              <Home size={22} strokeWidth={1.5} />
              <span className="hidden lg:block font-medium">Início</span>
            </Link>

            <Link href="/explorar" className="flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-2xl text-[#0F2942] hover:bg-white/60 transition-colors opacity-70 hover:opacity-100">
              <Compass size={22} strokeWidth={1.5} />
              <span className="hidden lg:block font-medium">Explorar</span>
            </Link>

            <Link href="/chat" className="flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-2xl bg-white/70 text-[#A63C3C] shadow-sm font-semibold transition-colors border border-white/50">
              <MessageSquare size={22} strokeWidth={2} />
              <span className="hidden lg:block">Novo Roteiro</span>
            </Link>

            <Link href="/historico" className="flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-2xl text-[#0F2942] hover:bg-white/60 transition-colors opacity-70 hover:opacity-100">
              <History size={22} strokeWidth={1.5} />
              <span className="hidden lg:block font-medium">Histórico</span>
            </Link>
          </nav>
        </div>

        {/* rodapé da navbar */}
        <div className="flex flex-col gap-2 px-4">
          <Link href="/configuracoes" className="flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-2xl text-[#0F2942] hover:bg-white/60 transition-colors opacity-70 hover:opacity-100">
            <Settings size={22} strokeWidth={1.5} />
            <span className="hidden lg:block font-medium">Configurações</span>
          </Link>

          <Link href="/login" className="flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-2xl text-[#0F2942] hover:bg-white/60 transition-colors opacity-70 hover:opacity-100">
            <User size={22} strokeWidth={1.5} />
            <span className="hidden lg:block font-medium">Meu Perfil</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 h-full overflow-hidden p-4 lg:p-8 z-10">
        {children}
      </main>
    </div>
  );
}