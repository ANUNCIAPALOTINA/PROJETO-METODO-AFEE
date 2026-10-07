import type { Metadata } from "next";
import Link from "next/link";
import { FormularioCheckout } from "@/components/checkout/formulario-checkout";
import { ResumoPedido } from "@/components/checkout/resumo-pedido";
import { LogoAfee } from "@/components/logo-afee";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Checkout · Método AFEE" };

export default function PaginaCheckout() {
  return (
    <>
      <header className="px-6 py-4">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
          <Link href={site.rotas.vendas} aria-label="Método AFEE, voltar ao início">
            <LogoAfee className="text-2xl" />
          </Link>
          <Link
            href={site.rotas.vendas}
            className="inline-flex min-h-11 items-center text-sm font-medium hover:text-primary"
          >
            Voltar
          </Link>
        </div>
      </header>

      <main className="flex-1 px-6 pt-4 pb-16">
        <div className="mx-auto w-full max-w-5xl">
          <h1 className="text-[30px] leading-[1.1] md:text-4xl">Finalizar compra</h1>
          <div className="mt-8 grid gap-8 md:grid-cols-[1fr_340px] md:items-start">
            <div className="md:order-1">
              <FormularioCheckout />
            </div>
            <div className="md:order-2">
              <ResumoPedido />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
