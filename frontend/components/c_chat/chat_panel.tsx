"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { ChatHeader } from "@/components/c_chat/chat_header";
import { ChatInput } from "@/components/c_chat/chat_input";
import { ChatLoading } from "@/components/c_chat/chat_loading";
import { ChatMessage } from "@/components/c_chat/chat_message";
import { ChatOptions } from "@/components/c_chat/chat_options";
import type {
  DadosColetados,
  Mensagem,
  OpcoesObjetos,
  RoteiroIa,
} from "@/lib/types/chat";

interface ChatPanelProps {
  mensagens: Mensagem[];
  opcoes: string[];
  input: string;
  setInput: (valor: string) => void;
  carregando: boolean;
  etapaAtual: string;
  roteiroIa: RoteiroIa | null;
  opcoesObjetos: OpcoesObjetos;
  dadosColetados: DadosColetados;
  bottomRef: RefObject<HTMLDivElement | null>;
  enviarMensagem: (texto: string) => void;
}

export function ChatPanel({
  mensagens,
  opcoes,
  input,
  setInput,
  carregando,
  etapaAtual,
  roteiroIa,
  opcoesObjetos,
  dadosColetados,
  bottomRef,
  enviarMensagem,
}: ChatPanelProps) {
  // Track how many messages have completed their typing animation.
  // All messages up to this count are shown fully; the next bot message animates.
  const [mensagensAnimadas, setMensagensAnimadas] = useState(0);
  const prevCountRef = useRef(mensagens.length);

  // When the messages array grows, we keep `mensagensAnimadas` as-is so
  // the newly added bot message(s) will get the typing effect.
  // When it shrinks (chat reset), reset the counter.
  useEffect(() => {
    if (mensagens.length < prevCountRef.current) {
      // Chat was reset
      setMensagensAnimadas(0);
    }
    prevCountRef.current = mensagens.length;
  }, [mensagens.length]);

  const marcarAnimada = useCallback(() => {
    setMensagensAnimadas((prev) => prev + 1);
  }, []);

  // Find the index of the first bot message that hasn't been animated yet.
  let proximaBotParaAnimar = -1;
  let botCount = 0;
  for (let i = 0; i < mensagens.length; i++) {
    if (mensagens[i].remetente === "bot") {
      if (botCount >= mensagensAnimadas) {
        proximaBotParaAnimar = i;
        break;
      }
      botCount++;
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white rounded-3xl shadow-sm border overflow-hidden">
      <ChatHeader roteiroIa={roteiroIa} />

      <div className="flex-1 p-6 bg-white overflow-y-auto flex flex-col gap-4 custom-scrollbar">
        {mensagens.map((msg, idx) => (
          <ChatMessage
            key={idx}
            mensagem={msg}
            animar={idx === proximaBotParaAnimar}
            onAnimacaoFim={idx === proximaBotParaAnimar ? marcarAnimada : undefined}
          />
        ))}

        {carregando && <ChatLoading />}

        <ChatOptions
          opcoes={opcoes}
          carregando={carregando}
          etapaAtual={etapaAtual}
          opcoesObjetos={opcoesObjetos}
          dadosColetados={dadosColetados}
          enviarMensagem={enviarMensagem}
        />

        <div ref={bottomRef} />
      </div>

      <ChatInput
        input={input}
        setInput={setInput}
        carregando={carregando}
        roteiroIa={roteiroIa}
        enviarMensagem={enviarMensagem}
      />
    </div>
  );
}
