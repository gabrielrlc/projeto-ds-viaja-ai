"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// ── Tipos ──────────────────────────────────────────────────────────────────

type Visao = "login" | "registro" | "recuperar";

// ── Textos por visão ───────────────────────────────────────────────────────

const TEXTOS: Record<
  Visao,
  { titulo: string; subtitulo: string; botao: string }
> = {
  login: {
    titulo: "Bem-vindo de volta!",
    subtitulo: "Insira seus dados para continuar planejando.",
    botao: "Entrar",
  },
  registro: {
    titulo: "Crie sua conta",
    subtitulo: "Junte-se a nós agora mesmo.",
    botao: "Criar Conta",
  },
  recuperar: {
    titulo: "Recuperar senha",
    subtitulo: "Digite seu e-mail para receber um link de redefinição.",
    botao: "Enviar link de recuperação",
  },
};

// ── Subcomponente de campo ─────────────────────────────────────────────────

function Campo({
  label,
  type,
  placeholder,
  value,
  onChange,
  children,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-primary">{label}</label>
        {children}
      </div>
      <input
        type={type}
        required
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 rounded-xl border border-input bg-transparent px-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}

// ── Conteúdo da página (precisa de Suspense por causa do useSearchParams) ──

function AuthContent({
  visao,
  setVisao,
}: {
  visao: Visao;
  setVisao: (v: Visao) => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // lê o parâmetro ?aba= da URL para definir a visão inicial
  useEffect(() => {
    if (searchParams.get("aba") === "registro") setVisao("registro");
  }, [searchParams, setVisao]);

  const { titulo, subtitulo, botao } = TEXTOS[visao];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrar com a API de autenticação
    if (visao === "login") router.push("/chat");
    if (visao === "registro") console.log("Registro:", { nome, email, senha });
    if (visao === "recuperar") console.log("Recuperação:", { email });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      {/* fundo */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/fundo-login.jpg"
          alt="Paisagem de fundo"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* card */}
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl flex flex-col gap-6">
        {/* cabeçalho */}
        <div className="flex flex-col items-center gap-1 text-center">
          <Image src="/logo.png" width={170} height={40} alt="Logo Viaja Aí" />
          <h1 className="text-2xl font-bold text-primary">{titulo}</h1>
          <p className="text-sm text-muted-foreground">{subtitulo}</p>
        </div>

        {/* formulário */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {visao === "registro" && (
            <Campo
              label="Nome completo"
              type="text"
              placeholder="Como quer ser chamado?"
              value={nome}
              onChange={setNome}
            />
          )}

          <Campo
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={setEmail}
          />

          {visao !== "recuperar" && (
            <Campo
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={setSenha}
            >
              {visao === "login" && (
                <button
                  type="button"
                  onClick={() => setVisao("recuperar")}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Esqueceu a senha?
                </button>
              )}
            </Campo>
          )}

          <Button
            type="submit"
            size="lg"
            className="mt-2 h-12 w-full text-base rounded-xl"
          >
            {botao}
          </Button>
        </form>

        {/* rodapé */}
        <div className="text-center text-sm text-muted-foreground">
          {visao === "login" && (
            <p>
              Ainda não tem uma conta?{" "}
              <button
                type="button"
                onClick={() => setVisao("registro")}
                className="font-semibold text-primary hover:underline"
              >
                Crie aqui
              </button>
            </p>
          )}
          {visao === "registro" && (
            <p>
              Já tem uma conta?{" "}
              <button
                type="button"
                onClick={() => setVisao("login")}
                className="font-semibold text-primary hover:underline"
              >
                Faça login
              </button>
            </p>
          )}
          {visao === "recuperar" && (
            <button
              type="button"
              onClick={() => setVisao("login")}
              className="font-semibold text-primary hover:underline flex items-center justify-center gap-2 w-full"
            >
              ← Voltar para o Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────

export default function AuthPage() {
  const [visao, setVisao] = useState<Visao>("login");

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AuthContent visao={visao} setVisao={setVisao} />
    </Suspense>
  );
}
