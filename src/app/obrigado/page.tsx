import type { Metadata } from "next";
import Link from "next/link";
import { BotaoAcessar } from "@/components/checkout/botao-acessar";
import { LogoAfee } from "@/components/logo-afee";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Obrigado · Método AFEE" };

/**
 * Página só informativa. Ela NÃO cria acesso: o acesso é liberado pelo
 * webhook do Mercado Pago, depois que o pagamento é confirmado na API.
 */
export default function PaginaObrigado() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <LogoAfee className="text-4xl" />
      <h1 className="text-[30px] leading-[1.1] md:text-5xl">Obrigado pela compra!</h1>
      <p className="max-w-md text-[17px] text-muted-foreground">
        Seu pagamento foi enviado. Assim que o Mercado Pago confirmar, o seu
        acesso ao Método AFEE é liberado, em geral em poucos segundos. Entre
        com o mesmo e-mail que você usou na compra.
      </p>
      <BotaoAcessar />
      <p className="max-w-md text-sm text-muted-foreground">
        O acesso ainda não apareceu? Espere um minuto e tente de novo. Se
        continuar, fale com o{" "}
        <Link href={site.rotas.suporte} className="text-primary underline underline-offset-4">
          suporte
        </Link>
        .
      </p>
    </main>
  );
}
