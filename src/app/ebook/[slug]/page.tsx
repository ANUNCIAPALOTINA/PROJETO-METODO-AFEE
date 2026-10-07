import { notFound, redirect } from "next/navigation";
import { exigirAluno } from "@/components/ebook/exigir-aluno";
import { site } from "@/config/site";
import { capituloPorSlug } from "@/content/ebook";

// Depende de quem está logado: nunca pode ser gerada/guardada como página pública.
export const dynamic = "force-dynamic";

/** Links antigos /ebook/<capitulo> levam ao mesmo capítulo dentro do app. */
export default async function PaginaCapitulo({
  params,
}: PageProps<"/ebook/[slug]">) {
  // Primeiro o acesso: quem não pagou vai para /entrar sem saber se o slug existe.
  await exigirAluno();
  const { slug } = await params;

  const capitulo = capituloPorSlug(slug);
  if (!capitulo) notFound();
  redirect(`${site.rotas.ebook}#cap-${capitulo.numero}`);
}
