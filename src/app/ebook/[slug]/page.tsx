import { notFound } from "next/navigation";
import { CabecalhoEbook } from "@/components/ebook/cabecalho-ebook";
import { exigirAluno } from "@/components/ebook/exigir-aluno";
import { MarcaDagua } from "@/components/ebook/marca-dagua";
import { NavegacaoCapitulos } from "@/components/ebook/navegacao-capitulos";
import { ProgressoLeitura } from "@/components/ebook/progresso-leitura";
import { RodapeEbook } from "@/components/ebook/rodape-ebook";
import { TextoMarkdown } from "@/components/ebook/texto-markdown";
import { capitulos, capituloPorSlug, vizinhos } from "@/content/ebook";

// Depende de quem está logado: nunca pode ser gerada/guardada como página pública.
export const dynamic = "force-dynamic";

export default async function PaginaCapitulo({
  params,
}: PageProps<"/ebook/[slug]">) {
  // Primeiro o acesso: quem não pagou vai para /entrar sem saber se o slug existe.
  const { email } = await exigirAluno();
  const { slug } = await params;

  const capitulo = capituloPorSlug(slug);
  if (!capitulo) notFound();
  const { anterior, proximo } = vizinhos(slug);

  return (
    <>
      <MarcaDagua email={email} />
      <CabecalhoEbook fixo>
        <ProgressoLeitura alvoId="leitura" slug={slug} />
      </CabecalhoEbook>

      <main id="conteudo" className="relative z-10 flex-1 px-5 py-10 md:py-16">
        <article id="leitura" className="mx-auto w-full max-w-[65ch]">
          <header>
            <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-primary uppercase">
              Capítulo {capitulo.numero} de {capitulos.length} ·{" "}
              {capitulo.minutos} min de leitura
            </p>
            <h1 className="text-[30px] leading-[1.1] md:text-[40px]">
              {capitulo.titulo}
            </h1>
          </header>
          <div className="mt-8 font-serif text-[19px] leading-[1.75] text-foreground md:text-[20px]">
            <TextoMarkdown markdown={capitulo.markdown} />
          </div>
        </article>

        <NavegacaoCapitulos anterior={anterior} proximo={proximo} />
      </main>

      <RodapeEbook email={email} />
    </>
  );
}
