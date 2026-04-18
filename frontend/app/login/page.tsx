"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect, Suspense } from "react";

// estados da pagina
type Visao = "login" | "registro" | "recuperar";

export default function AuthPage() {
  const [visao, setVisao] = useState<Visao>("login");

    return (
        <Suspense fallback={<div>Carregando...</div>}>
        <AuthContent visao={visao} setVisao={setVisao} />
        </Suspense>
    );
    }


function AuthContent({ visao, setVisao }: { visao: Visao, setVisao: (v: Visao) => void }) {
  const searchParams = useSearchParams();
  const abaInicial = searchParams.get("aba");

  useEffect(() => {
    if (abaInicial === "registro") {
      setVisao("registro");
    }
  }, [abaInicial, setVisao]);

  // estados do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const envioform = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (visao === "login") {
      console.log("Fazendo login com:", { email, senha });
    } else if (visao === "registro") {
      console.log("Criando conta para:", { nome, email, senha });
    } else if (visao === "recuperar") {
      console.log("Enviando e-mail de recuperação para:", email);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      {/* Fundo */}
        <div className="absolute inset-0 -z-10">
        <Image
            src="/fundo-login.jpg" 
            alt="Paisagem de fundo"
            fill 
            priority 
            className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        </div>

      {/* card */}
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl flex flex-col gap-6 transition-all duration-300">
        
        {/* cabeçalho */}
        <div className="flex flex-col items-center gap-1 text-center">
          <Image src="/logo.png" width={170} height={40} alt="Logo Viaja Aí" />
          <h1 className="text-2xl font-bold text-primary">
            {visao === "login" && "Bem-vindo de volta!"}
            {visao === "registro" && "Crie sua conta"}
            {visao === "recuperar" && "Recuperar senha"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {visao === "login" && "Insira seus dados para continuar planejando."}
            {visao === "registro" && "Junte-se a nós agora mesmo."}
            {visao === "recuperar" && "Digite seu e-mail para receber um link de redefinição de senha."}
          </p>
        </div>

        {/* formulário */}
        <form onSubmit={envioform} className="flex flex-col gap-4">
          
          {/* campo de nome (registro) */}
          {visao === "registro" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-primary">Nome completo</label>
              <input
                type="text"
                required
                placeholder="Como quer ser chamado?"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="h-12 rounded-xl border border-input bg-transparent px-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          )}

          {/* campo de email (todos) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-primary">E-mail</label>
            <input
              type="email"
              required
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl border border-input bg-transparent px-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* campo de senha (login e registro) */}
          {visao !== "recuperar" && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-primary">Senha</label>
                {/* botão de esqueci a senha */}
                {visao === "login" && (
                  <button
                    type="button"
                    onClick={() => setVisao("recuperar")}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="h-12 rounded-xl border border-input bg-transparent px-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          )}

          {/* botão principal */}
          <Button type="submit" size="lg" className="mt-2 h-12 w-full text-base rounded-xl">
            {visao === "login" && "Entrar"}
            {visao === "registro" && "Criar Conta"}
            {visao === "recuperar" && "Enviar link de recuperação"}
          </Button>
        </form>

        {/* rodapé */}
        <div className="text-center text-sm text-muted-foreground mt-2">
          {visao === "login" && (
            <p>
              Ainda não tem uma conta?{" "}
              <button type="button" onClick={() => setVisao("registro")} className="font-semibold text-primary hover:underline">
                Crie aqui
              </button>
            </p>
          )}
          {visao === "registro" && (
            <p>
              Já tem uma conta?{" "}
              <button type="button" onClick={() => setVisao("login")} className="font-semibold text-primary hover:underline">
                Faça login
              </button>
            </p>
          )}
          {visao === "recuperar" && (
            <button type="button" onClick={() => setVisao("login")} className="font-semibold text-primary hover:underline flex items-center justify-center gap-2 w-full">
               ← Voltar para o Login
            </button>
          )}
        </div>

      </div>
    </div>
  );
}