"use client";

import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

/**
 * Fundo vivo da página de vendas: preto puxando para o cinza, manchas de luz
 * laranja que flutuam e fotos do site misturadas ao fundo, que sobem em
 * velocidades diferentes conforme a rolagem (efeito de profundidade).
 * Fica fixo atrás de tudo e é só decorativo (aria-hidden).
 * Só anima transform e opacity, para rodar liso no celular.
 */

const FOTOS = [
  { src: "/fotos/hero-noite-450.webp", pos: "left-[-12%] top-[8%] w-[55vw] md:w-[30vw]", velocidade: -0.35 },
  { src: "/fotos/historia-barra-480.webp", pos: "right-[-10%] top-[45%] w-[50vw] md:w-[26vw]", velocidade: -0.6 },
  { src: "/fotos/metodo-parque-480.webp", pos: "left-[-6%] top-[95%] w-[48vw] md:w-[24vw]", velocidade: -0.85 },
  { src: "/fotos/sem-academia-mureta-540.webp", pos: "right-[-8%] top-[140%] w-[52vw] md:w-[28vw]", velocidade: -1.05 },
  { src: "/fotos/final-cta-540.webp", pos: "left-[4%] top-[190%] w-[50vw] md:w-[26vw]", velocidade: -1.25 },
] as const;

function FotoFundo({
  foto,
  progresso,
}: {
  foto: (typeof FOTOS)[number];
  progresso: ReturnType<typeof useSpring>;
}) {
  const y = useTransform(progresso, [0, 1], ["0vh", `${foto.velocidade * 100}vh`]);
  const rotate = useTransform(progresso, [0, 1], [-4, 4 * Math.sign(foto.velocidade)]);
  return (
    <motion.div
      style={{ y, rotate }}
      className={`absolute aspect-[4/5] ${foto.pos} fundo-flutuar`}
    >
      <Image
        src={foto.src}
        alt=""
        fill
        sizes="30vw"
        className="object-cover opacity-[0.22] grayscale contrast-125 [mask-image:radial-gradient(closest-side,black_55%,transparent)]"
      />
      <div className="absolute inset-0 bg-primary/25 mix-blend-color [mask-image:radial-gradient(closest-side,black_55%,transparent)]" />
    </motion.div>
  );
}

export function FundoAnimado() {
  const { scrollYProgress } = useScroll();
  const progresso = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  const luzY = useTransform(progresso, [0, 1], ["0%", "-30%"]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* Base: preto para cinza grafite */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#1f1f23_0%,#0b0b0c_60%)]" />

      {/* Luzes laranja e cinza flutuando */}
      <motion.div style={{ y: luzY }} className="absolute inset-0">
        <div className="fundo-luz fundo-luz-1 absolute left-[-20%] top-[-10%] size-[90vmax] bg-[radial-gradient(closest-side,rgba(255,77,31,0.30),transparent)]" />
        <div className="fundo-luz fundo-luz-2 absolute right-[-30%] top-[30%] size-[80vmax] bg-[radial-gradient(closest-side,rgba(120,120,130,0.22),transparent)]" />
        <div className="fundo-luz fundo-luz-3 absolute bottom-[-40%] left-[10%] size-[85vmax] bg-[radial-gradient(closest-side,rgba(199,58,18,0.28),transparent)]" />
      </motion.div>

      {/* Fotos do site fazendo parte do fundo */}
      {FOTOS.map((foto) => (
        <FotoFundo key={foto.src} foto={foto} progresso={progresso} />
      ))}

      {/* Grade fina e textura para dar profundidade */}
      <div className="fundo-grade absolute inset-0 opacity-[0.07] [background-image:linear-gradient(#f5f3ef_1px,transparent_1px),linear-gradient(90deg,#f5f3ef_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(11,11,12,0.85)_100%)]" />
    </div>
  );
}
