/**
 * Relatos REAIS de alunos do Método AFEE. Nunca inventar relato, nome ou número.
 * Só entra aqui o que o aluno autorizou publicar, com o nome do jeito que ele
 * autorizou (nome completo, só o primeiro nome ou iniciais).
 * Aparecem como cartões pequenos na beirada da página (relatos-popup.tsx).
 * Enquanto a lista estiver vazia, nada aparece.
 */
export type Relato = {
  /** Nome como o aluno autorizou: "Carlos", "Carlos S." etc. */
  nome: string;
  /** Texto do aluno, com as palavras dele (pode ser um trecho). */
  texto: string;
  /** Opcional: cidade, idade ou tempo de treino, se o aluno autorizou. */
  detalhe?: string;
  /** Opcional: foto de antes e depois em public/fotos/relatos/ (autorizada). */
  foto?: { src: string; alt: string };
};

export const relatos: readonly Relato[] = [];

export const textosRelatos = {
  etiqueta: "Quem já aplicou",
  titulo: "Relatos de alunos",
  aviso: "Resultados individuais, variam de pessoa para pessoa.",
};
