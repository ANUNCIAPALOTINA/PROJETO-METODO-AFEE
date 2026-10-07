import type { Metadata } from "next";
import Link from "next/link";
import { FormularioEntrar } from "@/components/entrar/formulario-entrar";
import { LogoAfee } from "@/components/logo-afee";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Entrar · Método AFEE" };

export default async function PaginaEntrar({
  searchParams,
}: PageProps<"/entrar">) {
  const { erro } = await searchParams;

  return (
    <>
      <header className="px-6 py-4">
        <div className="mx-auto flex w-full max-w-6xl items-center">
          <Link
            href={site.rotas.vendas}
            aria-label="Método AFEE, início"
            className="inline-flex min-h-11 items-center"
          >
            <LogoAfee className="text-2xl" />
          </Link>
        </div>
      </header>

      <main
        id="conteudo"
        className="flex flex-1 flex-col items-center px-6 py-10 md:py-16"
      >
        <div className="w-full max-w-md">
          <h1 className="text-[30px] leading-[1.1] md:text-5xl">
            Entrar para ler o ebook
          </h1>
          <p className="mt-4 mb-8 text-[17px] text-muted-foreground">
            Digite o e-mail da sua compra e enviamos um link para você entrar.
          </p>
          <FormularioEntrar linkInvalido={erro === "link"} />
        </div>
      </main>

      <footer className="px-6 py-8">
        <div className="mx-auto flex w-full max-w-md flex-col text-sm text-muted-foreground">
          <p>
            Ainda não tem o ebook?{" "}
            <Link
              href={site.rotas.vendas}
              className="inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4 hover:text-primary-hover"
            >
              Conheça o Método AFEE
            </Link>
          </p>
          <p>
            Precisa de ajuda?{" "}
            <Link
              href={site.rotas.suporte}
              className="inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4 hover:text-primary-hover"
            >
              Fale com o suporte
            </Link>
          </p>
        </div>
      </footer>
    </>
  );
}
