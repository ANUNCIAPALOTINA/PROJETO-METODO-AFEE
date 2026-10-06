import { redirect } from "next/navigation";
import { obterAlunoComAcesso } from "@/lib/acesso";
import { site } from "@/config/site";

/**
 * Porta de entrada das páginas do ebook (código de servidor).
 * Sem aluno com acesso: manda para /entrar (nunca revela se o slug existe).
 * Devolve o e-mail do aluno, usado na marca d'água.
 */
export async function exigirAluno(): Promise<{ email: string }> {
  const aluno = await obterAlunoComAcesso();
  if (!aluno) redirect(site.rotas.entrar);
  return aluno;
}
