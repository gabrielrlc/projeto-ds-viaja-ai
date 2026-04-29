"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, MessageSquare, History, Settings, User } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const getLinkStyle = (path: string) => {
    const isActive = pathname === path || pathname.startsWith(`${path}/`);
    if (isActive && path !== "/") {
      return "flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-2xl bg-white/70 text-[#A63C3C] shadow-sm font-semibold transition-colors border border-white/50";
    }
    return "flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-2xl text-[#0F2942] hover:bg-white/60 transition-colors opacity-70 hover:opacity-100";
  };

  return (
    <>
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


      <aside className="w-20 lg:w-64 shrink-0 flex flex-col justify-between h-full py-8 border-r border-white/40 bg-white/40 backdrop-blur-md shadow-[4px_0_24px_rgba(0,0,0,0.05)] transition-all z-20">
        <div className="flex flex-col gap-10 px-4">
          <Link href="/" className="flex items-center justify-center lg:justify-start lg:px-4 hover:opacity-80 transition-opacity">
            <div className="hidden lg:block">
              <Image src="/logo.png" width={120} height={50} alt="Logo ViajaAí" className="object-contain" />
            </div>
            <div className="flex lg:hidden w-12 h-12 bg-[#0F2942] rounded-xl items-center justify-center shadow-lg transition-transform active:scale-95">
              <Compass className="text-white" size={26} strokeWidth={2} />
            </div>
          </Link>

          <nav className="flex flex-col gap-2">
            <Link href="/" className="flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-2xl text-[#0F2942] hover:bg-white/60 transition-colors opacity-70 hover:opacity-100">
              <Home size={22} strokeWidth={1.5} />
              <span className="hidden lg:block font-medium">Início</span>
            </Link>

            <Link href="/explorar" className={getLinkStyle("/explorar")}>
              <Compass size={22} strokeWidth={pathname === "/explorar" ? 2 : 1.5} />
              <span className="hidden lg:block font-medium">Explorar</span>
            </Link>

            <Link href="/chat" className={getLinkStyle("/chat")}>
              <MessageSquare size={22} strokeWidth={pathname.startsWith("/chat") ? 2 : 1.5} />
              <span className="hidden lg:block font-medium">Novo Roteiro</span>
            </Link>

            <Link href="/historico" className={getLinkStyle("/historico")}>
              <History size={22} strokeWidth={pathname === "/historico" ? 2 : 1.5} />
              <span className="hidden lg:block font-medium">Histórico</span>
            </Link>
          </nav>
        </div>

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
    </>
  );
}