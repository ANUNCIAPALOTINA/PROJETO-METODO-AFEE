"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { lerEmailPedido } from "./email-pedido";

const semAssinatura = () => () => {};

/** "Acessar agora": leva a /entrar (com o e-mail da compra, se estiver na aba). */
export function BotaoAcessar() {
  // No servidor não há sessionStorage; no navegador lemos o e-mail guardado.
  const email = useSyncExternalStore(semAssinatura, lerEmailPedido, () => null);
  const destino = email
    ? `${site.rotas.entrar}?email=${encodeURIComponent(email)}`
    : site.rotas.entrar;
  return (
    <Button
      nativeButton={false}
      render={<Link href={destino} />}
      className="h-14 w-full text-[17px] font-semibold sm:w-auto sm:px-8"
    >
      Acessar agora
    </Button>
  );
}
