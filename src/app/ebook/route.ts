import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { obterAlunoComAcesso } from "@/lib/acesso";
import { site } from "@/config/site";
import { prepararAppEbook } from "@/components/ebook/app-ebook";

// Depende de quem está logado: nunca pode ser gerada/guardada como página pública.
export const dynamic = "force-dynamic";

const CAMINHO_APP = join(process.cwd(), "src/content/ebook-app/index.html");

/**
 * O ebook em formato de app (12 capítulos, cronômetro, interativos), servido só
 * a quem tem acesso ativo. O arquivo fica em src/content (nunca em public/),
 * então só chega ao navegador por aqui. O proxy já manda quem não tem sessão
 * para /entrar; aqui se confere o direito de acesso (tabela `acessos`).
 */
export async function GET() {
  const aluno = await obterAlunoComAcesso();
  if (!aluno) {
    return new Response(null, {
      status: 303,
      headers: { Location: site.rotas.entrar, "Cache-Control": "private, no-store" },
    });
  }

  const html = prepararAppEbook(await readFile(CAMINHO_APP, "utf8"), aluno.email);
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
