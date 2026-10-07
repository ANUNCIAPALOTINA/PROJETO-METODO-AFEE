import "server-only";
import { capitulos, type Capitulo } from "./capitulos";

/**
 * Porta de entrada do conteúdo PAGO do ebook.
 * O "server-only" faz o build FALHAR se algum componente de navegador
 * importar este arquivo, o que impede o texto de vazar para o código público.
 * Use só em páginas e rotas de servidor, depois de checar o acesso do aluno.
 */
export { capitulos, type Capitulo };

export function capituloPorSlug(slug: string): Capitulo | undefined {
  return capitulos.find((c) => c.slug === slug);
}

/** Capítulo anterior e próximo, para a navegação do leitor. */
export function vizinhos(slug: string): {
  anterior?: Capitulo;
  proximo?: Capitulo;
} {
  const i = capitulos.findIndex((c) => c.slug === slug);
  if (i < 0) return {};
  return { anterior: capitulos[i - 1], proximo: capitulos[i + 1] };
}
