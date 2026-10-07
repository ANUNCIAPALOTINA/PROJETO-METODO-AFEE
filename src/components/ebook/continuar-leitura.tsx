"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";
import { CHAVE_ULTIMO_CAPITULO } from "./ultimo-capitulo";

type Item = { slug: string; numero: number; titulo: string };

function inscrever(aoMudar: () => void) {
  window.addEventListener("storage", aoMudar);
  return () => window.removeEventListener("storage", aoMudar);
}

function lerUltimo(): string | null {
  try {
    return localStorage.getItem(CHAVE_ULTIMO_CAPITULO);
  } catch {
    return null;
  }
}

/** Botão "Continuar de onde parou" (lembra só neste aparelho); sem histórico, começa pelo primeiro capítulo. */
export function ContinuarLeitura({ itens }: { itens: Item[] }) {
  const ultimo = useSyncExternalStore(inscrever, lerUltimo, () => null);
  const atual = itens.find((i) => i.slug === ultimo);
  const destino = atual ?? itens[0];
  if (!destino) return null;

  return (
    <Link
      href={`${site.rotas.ebook}/${destino.slug}`}
      className={cn(
        buttonVariants(),
        "h-14 w-full gap-2 px-6 text-[17px] font-semibold sm:w-auto",
      )}
    >
      {atual ? "Continuar de onde parou" : "Começar a ler"}
      <span className="font-normal opacity-90">
        · Capítulo {destino.numero}
      </span>
    </Link>
  );
}
