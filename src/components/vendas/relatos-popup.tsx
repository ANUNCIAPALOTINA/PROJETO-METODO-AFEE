"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { relatos, textosRelatos } from "@/content/relatos";

// Enquanto qualquer um destes estiver na tela, o popup some (não cobre compra nem preço).
const PROTEGIDOS = ["cta-hero", "cta-preco", "cta-final", "bloco-preco"];
const ESPERA_INICIAL = 6000;
const TEMPO_NA_TELA = 7000;
const INTERVALO = 4000;
const CHAVE_FECHADO = "afee-relatos-fechado";

/**
 * Relatos reais de alunos em cartões pequenos que entram e saem pela beirada
 * da página. Não aparece se a lista estiver vazia ou se o visitante fechar.
 */
export function RelatosPopup() {
  const [indice, setIndice] = useState(0);
  const [aberto, setAberto] = useState(false);
  const [fechado, setFechado] = useState(false);
  const [protegidoNaTela, setProtegidoNaTela] = useState(true);

  useEffect(() => {
    const visiveis: Record<string, boolean> = {};
    const observador = new IntersectionObserver((entradas) => {
      for (const e of entradas) visiveis[e.target.id] = e.isIntersecting;
      setProtegidoNaTela(Object.values(visiveis).some(Boolean));
    });
    for (const id of PROTEGIDOS) {
      const el = document.getElementById(id);
      if (el) observador.observe(el);
    }
    return () => observador.disconnect();
  }, []);

  useEffect(() => {
    if (relatos.length === 0 || fechado) return;
    let ativo = true;
    let timer: ReturnType<typeof setTimeout>;
    const jaFechou = () => {
      try {
        return sessionStorage.getItem(CHAVE_FECHADO) !== null;
      } catch {
        return false;
      }
    };
    const mostrar = () => {
      if (!ativo || jaFechou()) return;
      setAberto(true);
      timer = setTimeout(() => {
        setAberto(false);
        timer = setTimeout(() => {
          setIndice((i) => (i + 1) % relatos.length);
          mostrar();
        }, INTERVALO);
      }, TEMPO_NA_TELA);
    };
    timer = setTimeout(mostrar, ESPERA_INICIAL);
    return () => {
      ativo = false;
      clearTimeout(timer);
    };
  }, [fechado]);

  if (relatos.length === 0 || fechado) return null;

  const relato = relatos[indice];
  const visivel = aberto && !protegidoNaTela;

  function fechar() {
    setFechado(true);
    try {
      sessionStorage.setItem(CHAVE_FECHADO, "1");
    } catch {}
  }

  return (
    <aside
      aria-label={textosRelatos.titulo}
      aria-live="polite"
      className="pointer-events-none fixed inset-x-3 bottom-[92px] z-40 md:inset-x-auto md:bottom-6 md:left-6 md:w-[340px]"
    >
      <AnimatePresence>
        {visivel ? (
          <motion.figure
            key={indice}
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto relative flex max-w-sm gap-3 border border-primary/70 bg-card/95 p-3 pr-9 shadow-[0_0_32px_-8px_rgba(255,77,31,0.5)] backdrop-blur"
          >
            {relato.foto ? (
              <div className="relative h-16 w-16 shrink-0 overflow-hidden">
                <Image
                  src={relato.foto.src}
                  alt={relato.foto.alt}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            ) : null}
            <div className="flex min-w-0 flex-col gap-1">
              <p className="text-[10px] font-semibold tracking-[0.12em] text-primary uppercase">
                {textosRelatos.etiqueta}
              </p>
              <blockquote className="line-clamp-3 text-sm text-foreground">
                “{relato.texto}”
              </blockquote>
              <figcaption className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{relato.nome}</span>
                {relato.detalhe ? ` · ${relato.detalhe}` : null}
              </figcaption>
              <p className="text-[10px] text-muted-foreground">{textosRelatos.aviso}</p>
            </div>
            <button
              type="button"
              onClick={fechar}
              aria-label="Fechar relatos"
              className="absolute top-1.5 right-1.5 flex size-7 items-center justify-center text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </motion.figure>
        ) : null}
      </AnimatePresence>
    </aside>
  );
}
