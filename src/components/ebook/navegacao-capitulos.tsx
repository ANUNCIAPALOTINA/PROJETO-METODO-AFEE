import Link from "next/link";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

type Destino = { slug: string; numero: number; titulo: string };

const cartao =
  "flex min-h-14 flex-col justify-center gap-1 rounded-sm border border-input bg-card p-4 hover:border-primary hover:bg-card-elevated";

/** Anterior / próximo capítulo. No último, o "próximo" volta ao índice. */
export function NavegacaoCapitulos({
  anterior,
  proximo,
}: {
  anterior?: Destino;
  proximo?: Destino;
}) {
  return (
    <nav
      aria-label="Navegação entre capítulos"
      className="mx-auto mt-16 grid w-full max-w-[65ch] gap-3 sm:grid-cols-2"
    >
      {anterior ? (
        <Link href={`${site.rotas.ebook}/${anterior.slug}`} className={cartao} rel="prev">
          <span className="text-sm text-muted-foreground">← Capítulo anterior</span>
          <span className="font-heading font-bold">
            {anterior.numero}. {anterior.titulo}
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {proximo ? (
        <Link
          href={`${site.rotas.ebook}/${proximo.slug}`}
          className={cn(cartao, "sm:text-right")}
          rel="next"
        >
          <span className="text-sm text-muted-foreground">Próximo capítulo →</span>
          <span className="font-heading font-bold">
            {proximo.numero}. {proximo.titulo}
          </span>
        </Link>
      ) : (
        <Link href={site.rotas.ebook} className={cn(cartao, "sm:text-right")}>
          <span className="text-sm text-muted-foreground">Você terminou</span>
          <span className="font-heading font-bold">Voltar ao índice</span>
        </Link>
      )}
    </nav>
  );
}
