"use client";

import { useEffect, useRef } from "react";
import { CHAVE_ULTIMO_CAPITULO } from "./ultimo-capitulo";

/**
 * Barra fina de progresso do capítulo (rolagem dentro do artigo `alvoId`).
 * Sem animação própria (move direto com a rolagem), então já respeita
 * "reduzir movimento". Também lembra o último capítulo aberto neste aparelho.
 */
export function ProgressoLeitura({
  alvoId,
  slug,
}: {
  alvoId: string;
  slug: string;
}) {
  const barra = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_ULTIMO_CAPITULO, slug);
    } catch {
      // Sem armazenamento (aba privada etc.): só não lembra o capítulo.
    }

    let quadro = 0;
    const atualizar = () => {
      quadro = 0;
      const alvo = document.getElementById(alvoId);
      if (!alvo || !barra.current) return;
      const r = alvo.getBoundingClientRect();
      // 100% quando o fim do artigo chega ao pé da tela.
      const lido = (window.innerHeight - r.top) / r.height;
      const p = Math.min(1, Math.max(0, lido));
      barra.current.style.transform = `scaleX(${p})`;
    };
    const agendar = () => {
      if (!quadro) quadro = requestAnimationFrame(atualizar);
    };

    atualizar();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
      if (quadro) cancelAnimationFrame(quadro);
    };
  }, [alvoId, slug]);

  return (
    <div aria-hidden className="h-1 w-full bg-border">
      <div
        ref={barra}
        className="h-full w-full origin-left bg-primary"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
