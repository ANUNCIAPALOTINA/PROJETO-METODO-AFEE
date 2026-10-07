import Link from "next/link";
import { LogoAfee } from "@/components/logo-afee";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

const linkClasse =
  "inline-flex min-h-11 items-center px-3 text-sm font-medium text-foreground hover:text-primary";

/** Cabeçalho do leitor: logo, índice e sair. `children` entra na borda de baixo (barra de progresso). */
export function CabecalhoEbook({
  fixo = false,
  children,
}: {
  fixo?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <header
      className={cn(
        "relative z-20 border-b border-border bg-background",
        fixo && "sticky top-0",
      )}
    >
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-3 py-1">
        <Link
          href={site.rotas.ebook}
          aria-label="Método AFEE, índice do ebook"
          className="inline-flex min-h-11 items-center px-2"
        >
          <LogoAfee className="text-xl" />
        </Link>
        <nav aria-label="Ebook" className="flex items-center">
          <Link href={site.rotas.ebook} className={linkClasse}>
            Índice
          </Link>
          <form method="post" action="/auth/sair">
            <button type="submit" className={cn(linkClasse, "cursor-pointer")}>
              Sair
            </button>
          </form>
        </nav>
      </div>
      {children}
    </header>
  );
}
