"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hook that produces a typewriter effect for a given text.
 * Returns the portion of text revealed so far and a flag
 * indicating whether the animation is still running.
 *
 * @param texto       Full text to animate.
 * @param velocidade  Milliseconds between each character (default 18ms).
 * @param ativo       Whether to animate at all. If false, returns the full text immediately.
 */
export function useTypingEffect(
  texto: string,
  velocidade = 18,
  ativo = true,
): { textoExibido: string; digitando: boolean } {
  const [textoExibido, setTextoExibido] = useState(ativo ? "" : texto);
  const [digitando, setDigitando] = useState(ativo);
  const indexRef = useRef(0);

  useEffect(() => {
    // If the effect is disabled, show the full text immediately.
    if (!ativo) {
      setTextoExibido(texto);
      setDigitando(false);
      return;
    }

    // Reset on new text.
    indexRef.current = 0;
    setTextoExibido("");
    setDigitando(true);

    const interval = setInterval(() => {
      indexRef.current += 1;
      // Reveal characters in chunks of 1-2 for a natural speed feel
      const next = texto.slice(0, indexRef.current);
      setTextoExibido(next);

      if (indexRef.current >= texto.length) {
        clearInterval(interval);
        setDigitando(false);
      }
    }, velocidade);

    return () => clearInterval(interval);
  }, [texto, velocidade, ativo]);

  return { textoExibido, digitando };
}
