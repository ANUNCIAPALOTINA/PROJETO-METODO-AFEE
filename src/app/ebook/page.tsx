import Link from "next/link";
import { ContinuarLeitura } from "@/components/ebook/continuar-leitura";
import { CabecalhoEbook } from "@/components/ebook/cabecalho-ebook";
import { exigirAluno } from "@/components/ebook/exigir-aluno";
import { RodapeEbook } from "@/components/ebook/rodape-ebook";
import { site } from "@/config/site";
import { capitulos } from "@/content/ebook";

// Depende de quem está logado: nunca pode ser gerada/guardada como página pública.
export const dynamic = "force-dynamic";

export default async function PaginaIndiceEbook() {
  const { email } = await exigirAluno();
  const itens = capitulos.map(({ slug, numero, titulo }) => ({
    slug,
    numero,
    titulo,
  }));

  return (
    <>
      <CabecalhoEbook />
      <main id="conteudo" className="flex-1 px-5 py-10 md:py-16">
        <div className="mx-auto w-full max-w-[65ch]">
          <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-primary uppercase">
            Método AFEE
          </p>
          <h1 className="text-[30px] leading-[1.1] md:text-5xl">Seu ebook</h1>
          <p className="mt-4 font-serif text-[19px] leading-[1.7] text-muted-foreground">
            {capitulos.length} capítulos, do jeito que o João “Garlet” explica
            o treino com começo, meio e fim. Leia na ordem ou volte ao que
            precisar.
          </p>
          <div className="mt-8">
            <ContinuarLeitura itens={itens} />
          </div>

          <h2 className="mt-14 mb-4 text-[22px] leading-[1.2]">Capítulos</h2>
          <ol className="flex flex-col border-t border-border">
            {capitulos.map((c) => (
              <li key={c.slug} className="border-b border-border">
                <Link
                  href={`${site.rotas.ebook}/${c.slug}`}
                  className="flex min-h-[72px] items-center gap-4 py-4 hover:bg-card"
                >
                  <span
                    aria-hidden
                    className="w-10 shrink-0 text-right font-heading text-2xl font-bold text-primary"
                  >
                    {c.numero}
                  </span>
                  <span className="flex flex-1 flex-col gap-1">
                    <span className="font-serif text-[18px] leading-[1.35] font-semibold">
                      <span className="sr-only">Capítulo {c.numero}: </span>
                      {c.titulo}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {c.minutos} min de leitura
                    </span>
                  </span>
                  <span aria-hidden className="pr-2 text-muted-foreground">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </main>
      <RodapeEbook email={email} />
    </>
  );
}
