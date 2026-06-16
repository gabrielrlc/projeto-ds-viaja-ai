"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import type { Mensagem } from "@/lib/types/chat";
import { useTypingEffect } from "@/lib/hooks/use_typing_effect";

interface ChatMessageProps {
  mensagem: Mensagem;
  /** Whether to animate the text with a typing effect (only for the latest bot message). */
  animar?: boolean;
  /** Called when typing animation finishes (so parent can mark it as done). */
  onAnimacaoFim?: () => void;
}

export function ChatMessage({ mensagem, animar = false, onAnimacaoFim }: ChatMessageProps) {
  const isBot = mensagem.remetente === "bot";
  const { textoExibido, digitando } = useTypingEffect(
    mensagem.texto,
    16,
    animar && isBot,
  );

  // Track whether we've already called the callback to avoid duplicates.
  const chamouRef = useRef(false);

  useEffect(() => {
    // Reset when the message text changes (new message).
    chamouRef.current = false;
  }, [mensagem.texto]);

  useEffect(() => {
    if (animar && isBot && !digitando && onAnimacaoFim && !chamouRef.current) {
      chamouRef.current = true;
      onAnimacaoFim();
    }
  }, [animar, isBot, digitando, onAnimacaoFim]);

  const textoFinal = animar && isBot ? textoExibido : mensagem.texto;

  return (
    <div
      className={`max-w-[85%] ${isBot ? "self-start animate-chat-bot" : "self-end animate-chat-user"}`}
    >
      <div
        className={`p-4 rounded-2xl border text-[15px] leading-relaxed shadow-sm ${
          isBot
            ? "bg-white border-[#EACFC4] text-[#0F2942] rounded-tl-sm"
            : "bg-[#0F2942] text-white border-[#0F2942] rounded-tr-sm"
        }`}
      >
        {isBot ? (
          <div className="chat-markdown">
            <ReactMarkdown>{textoFinal}</ReactMarkdown>
            {animar && digitando && (
              <span className="inline-block w-[2px] h-[1em] bg-[#D68585] ml-0.5 align-text-bottom animate-pulse" />
            )}
          </div>
        ) : (
          <span className="whitespace-pre-wrap">{textoFinal}</span>
        )}
      </div>
    </div>
  );
}
