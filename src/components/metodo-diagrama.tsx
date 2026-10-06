"use client";

import { useId, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { Thermometer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LogoAfee } from "@/components/logo-afee";

/**
 * Diagrama do Método AFEE, adaptado do componente do 21st.dev.
 * Centro: logo. Em volta, no sentido horário: A, F, Estimular, Exaurir e o
 * Termômetro (que fecha o ciclo voltando ao A).
 *
 * Mudanças em relação ao original:
 * - sem Math.random() (causava erro de hidratação no Next.js);
 * - cores por var(--primary) etc. (var(--color-*) não existe com @theme inline);
 * - ids do SVG sem ":" (alguns navegadores não resolvem url(#:r1:));
 * - respeita "reduzir movimento" e é descrito por aria-label.
 */

const LARGURA = 564;
const ALTURA = 410;

type No = {
  id: string;
  rotulo: string;
  nome: string;
  x: number;
  y: number;
  path: string;
  atraso: number;
  termometro?: boolean;
};

const nos: No[] = [
  {
    id: "a",
    rotulo: "A",
    nome: "Aquecer",
    x: 110,
    y: 80,
    path: "M 270 205 V 95 Q 270 80 255 80 H 110",
    atraso: 0.1,
  },
  {
    id: "f",
    rotulo: "F",
    nome: "Forçar",
    x: 454,
    y: 80,
    path: "M 294 205 V 95 Q 294 80 309 80 H 454",
    atraso: 0.25,
  },
  {
    id: "e1",
    rotulo: "E",
    nome: "Estimular",
    x: 466,
    y: 295,
    path: "M 296 205 V 280 Q 296 295 311 295 H 466",
    atraso: 0.4,
  },
  {
    id: "e2",
    rotulo: "E",
    nome: "Exaurir",
    x: 282,
    y: 345,
    path: "M 282 205 V 345",
    atraso: 0.55,
  },
  {
    id: "t",
    rotulo: "",
    nome: "Termômetro",
    x: 98,
    y: 295,
    path: "M 268 205 V 280 Q 268 295 253 295 H 98",
    atraso: 0.7,
    termometro: true,
  },
];

const DESCRICAO =
  "Diagrama do Método AFEE, em ciclo: Aquecer, Forçar, Estimular e Exaurir, com o Termômetro fechando o ciclo.";

function Linha({ no, id, parado }: { no: No; id: string; parado: boolean }) {
  return (
    <>
      <path
        d={no.path}
        stroke="var(--input)"
        strokeOpacity={0.55}
        strokeWidth="1"
        fill="none"
      />
      {!parado && (
        <>
          <motion.path
            d={no.path}
            stroke={`url(#${id})`}
            strokeWidth="2"
            fill="none"
            strokeDasharray="40 160"
            initial={{ strokeDashoffset: 200 }}
            animate={{ strokeDashoffset: -200 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              delay: no.atraso * 2,
            }}
          />
          <defs>
            <linearGradient id={id} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="transparent" />
              <stop
                offset="50%"
                stopColor="var(--primary)"
                stopOpacity="0.85"
              />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </>
      )}
    </>
  );
}

// Lê "reduzir movimento" de forma segura para o servidor: no servidor e na
// primeira renderização do navegador o valor é `false` (igual), e só depois
// da hidratação o React troca para o valor real, sem erro de hidratação.
const CONSULTA_MOVIMENTO = "(prefers-reduced-motion: reduce)";
function assinarMovimento(aviso: () => void) {
  const lista = window.matchMedia(CONSULTA_MOVIMENTO);
  lista.addEventListener("change", aviso);
  return () => lista.removeEventListener("change", aviso);
}
const lerMovimento = () => window.matchMedia(CONSULTA_MOVIMENTO).matches;
const lerMovimentoNoServidor = () => false;

export function MetodoDiagrama() {
  const uid = useId().replace(/:/g, "");
  const parado = useSyncExternalStore(
    assinarMovimento,
    lerMovimento,
    lerMovimentoNoServidor,
  );

  return (
    <Card className="mx-auto w-full max-w-141 gap-0 py-0">
      <div
        role="img"
        aria-label={DESCRICAO}
        className="relative aspect-[564/410] w-full overflow-hidden bg-card"
      >
        {/* Fundo de pontinhos */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-b from-card/60 via-transparent to-card/60"
        />

        {/* Linhas */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={`0 0 ${LARGURA} ${ALTURA}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {nos.map((no) => (
            <Linha key={no.id} no={no} id={`${uid}-${no.id}`} parado={parado} />
          ))}
        </svg>

        {/* Centro: logo */}
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 border border-border bg-background p-2 sm:p-4"
        >
          <LogoAfee className="text-xl sm:text-4xl" />
          {!parado && (
            <motion.div
              className="absolute inset-0 border-2 border-primary/20"
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          )}
        </div>

        {/* Nós */}
        {nos.map((no) => (
          <motion.div
            key={no.id}
            aria-hidden
            initial={parado ? false : { opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={parado ? { duration: 0 } : { delay: no.atraso }}
            style={{
              left: `${(no.x / LARGURA) * 100}%`,
              top: `${(no.y / ALTURA) * 100}%`,
            }}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="flex size-9 items-center justify-center border-2 border-primary bg-background font-heading text-base font-bold text-primary sm:size-12 sm:text-xl">
              {no.termometro ? (
                <Thermometer className="size-4 sm:size-6" strokeWidth={2.25} />
              ) : (
                no.rotulo
              )}
            </div>
            <span className="absolute top-full left-1/2 mt-1 -translate-x-1/2 text-[11px] leading-none font-medium whitespace-nowrap text-muted-foreground sm:text-sm">
              {no.nome}
            </span>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
