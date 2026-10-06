/**
 * Markdown MÍNIMO e PRÓPRIO do leitor do ebook (sem dependências).
 * Suporta só o que o conteúdo usa:
 *  - parágrafos separados por linha em branco;
 *  - "## " no início de um bloco = subtítulo;
 *  - **negrito** e *itálico* (e ***os dois***).
 * Tudo vira uma árvore de dados. Quem renderiza (texto-markdown.tsx) só cria
 * elementos React com TEXTO, então qualquer HTML no conteúdo (ex.: <script>)
 * sai escrito na tela e nunca é interpretado. Não existe HTML cru aqui.
 */

export type Inline =
  | { tipo: "texto"; texto: string }
  | { tipo: "negrito"; filhos: Inline[] }
  | { tipo: "italico"; filhos: Inline[] };

export type Bloco = {
  tipo: "paragrafo" | "subtitulo";
  filhos: Inline[];
};

const ESPACO = /\s/;

/** Acha o fechamento de `marca` a partir de `de`, sem espaço antes dele. */
function acharFechamento(texto: string, marca: string, de: number): number {
  let i = texto.indexOf(marca, de);
  while (i !== -1) {
    const antes = texto[i - 1];
    // Fecha só se houver conteúdo e o caractere anterior não for espaço.
    if (i > de && antes !== undefined && !ESPACO.test(antes)) {
      // Para "*" simples, ignora um "*" que faz parte de "**".
      if (marca !== "*" || (texto[i + 1] !== "*" && antes !== "*")) return i;
    }
    i = texto.indexOf(marca, i + 1);
  }
  return -1;
}

export function analisarInline(texto: string): Inline[] {
  const saida: Inline[] = [];
  let buffer = "";

  const descarregar = () => {
    if (buffer) {
      saida.push({ tipo: "texto", texto: buffer });
      buffer = "";
    }
  };

  let i = 0;
  while (i < texto.length) {
    if (texto[i] === "*") {
      const marca = texto.startsWith("***", i)
        ? "***"
        : texto.startsWith("**", i)
          ? "**"
          : "*";
      const inicio = i + marca.length;
      const proximo = texto[inicio];
      // O abridor precisa ser seguido de algo que não seja espaço.
      if (proximo !== undefined && !ESPACO.test(proximo) && proximo !== "*") {
        const fim = acharFechamento(texto, marca, inicio);
        if (fim !== -1) {
          const miolo = analisarInline(texto.slice(inicio, fim));
          descarregar();
          if (marca === "***") {
            saida.push({
              tipo: "negrito",
              filhos: [{ tipo: "italico", filhos: miolo }],
            });
          } else {
            saida.push({
              tipo: marca === "**" ? "negrito" : "italico",
              filhos: miolo,
            });
          }
          i = fim + marca.length;
          continue;
        }
      }
      // Sem par: o asterisco é só um caractere comum.
      buffer += texto[i];
      i += 1;
      continue;
    }
    buffer += texto[i];
    i += 1;
  }
  descarregar();
  return saida;
}

export function analisarMarkdown(markdown: string): Bloco[] {
  const blocos: Bloco[] = [];
  const brutos = markdown.replace(/\r\n?/g, "\n").split(/\n[ \t]*\n/);

  for (const bruto of brutos) {
    const linhas = bruto
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (linhas.length === 0) continue;

    if (linhas[0].startsWith("## ") && linhas[0].slice(3).trim()) {
      blocos.push({
        tipo: "subtitulo",
        filhos: analisarInline(linhas[0].slice(3).trim()),
      });
      linhas.shift();
      if (linhas.length === 0) continue;
    }
    // Quebra de linha simples dentro do parágrafo vira espaço.
    blocos.push({ tipo: "paragrafo", filhos: analisarInline(linhas.join(" ")) });
  }
  return blocos;
}
