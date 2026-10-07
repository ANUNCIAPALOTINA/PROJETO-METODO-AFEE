"use client";

import { useEffect, useState } from "react";
import { BotaoCompra } from "@/components/vendas/botao-compra";
import { cn } from "@/lib/utils";

// Botões da página que, quando visíveis, dispensam o botão fixo.
const ALVOS = ["cta-hero", "cta-preco", "cta-final"];

/**
 * Botão de compra fixo na base do celular. Fica escondido enquanto qualquer
 * outro botão de compra está na tela e aparece quando o do hero sai de vista.
 * Começa escondido (igual no servidor e no navegador), sem erro de hidratação.
 */
export function BotaoFixo() {
  const [visiveis, setVisiveis] = useState<Record<string, boolean>>({
    "cta-hero": true,
  });

  useEffect(() => {
    const observador = new IntersectionObserver((entradas) => {
      setVisiveis((atual) => {
        const proximo = { ...atual };
        for (const e of entradas) proximo[e.target.id] = e.isIntersecting;
        return proximo;
      });
    });
    for (const id of ALVOS) {
      const el = document.getElementById(id);
      if (el) observador.observe(el);
    }
    return () => observador.disconnect();
  }, []);

  const mostrar = ALVOS.every((id) => !visiveis[id]);

  return (
    <div
      aria-hidden={!mostrar}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-200 motion-reduce:transition-none md:hidden",
        mostrar ? "translate-y-0" : "invisible translate-y-full",
      )}
    >
      <BotaoCompra />
    </div>
  );
}
