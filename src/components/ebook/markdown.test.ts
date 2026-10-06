import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { analisarInline, analisarMarkdown } from "./markdown";
import { TextoMarkdown } from "./texto-markdown";

const html = (md: string) =>
  renderToStaticMarkup(createElement(TextoMarkdown, { markdown: md }));

describe("analisarMarkdown", () => {
  it("separa parágrafos por linha em branco", () => {
    const b = analisarMarkdown("Um.\n\nDois.\n\n\n\nTrês.");
    expect(b.map((x) => x.tipo)).toEqual(["paragrafo", "paragrafo", "paragrafo"]);
  });

  it("trata ## como subtítulo", () => {
    const b = analisarMarkdown("Abertura.\n\n## O que eu descobri?\n\nDepois.");
    expect(b[1]).toEqual({
      tipo: "subtitulo",
      filhos: [{ tipo: "texto", texto: "O que eu descobri?" }],
    });
    expect(b).toHaveLength(3);
  });

  it("junta quebras simples dentro do parágrafo e ignora vazio e CRLF", () => {
    const b = analisarMarkdown("\r\nlinha a\r\nlinha b\r\n\r\n   \r\nfim\r\n");
    expect(b).toHaveLength(2);
    expect(b[0].filhos).toEqual([{ tipo: "texto", texto: "linha a linha b" }]);
  });

  it("não vira subtítulo sem espaço depois dos #", () => {
    expect(analisarMarkdown("##sem espaço")[0].tipo).toBe("paragrafo");
  });
});

describe("analisarInline", () => {
  it("lê negrito e itálico", () => {
    expect(analisarInline("a **b** c *d* e")).toEqual([
      { tipo: "texto", texto: "a " },
      { tipo: "negrito", filhos: [{ tipo: "texto", texto: "b" }] },
      { tipo: "texto", texto: " c " },
      { tipo: "italico", filhos: [{ tipo: "texto", texto: "d" }] },
      { tipo: "texto", texto: " e" },
    ]);
  });

  it("aceita itálico dentro de negrito e ***os dois***", () => {
    expect(analisarInline("**a *b* c**")).toEqual([
      {
        tipo: "negrito",
        filhos: [
          { tipo: "texto", texto: "a " },
          { tipo: "italico", filhos: [{ tipo: "texto", texto: "b" }] },
          { tipo: "texto", texto: " c" },
        ],
      },
    ]);
    expect(analisarInline("***x***")).toEqual([
      {
        tipo: "negrito",
        filhos: [{ tipo: "italico", filhos: [{ tipo: "texto", texto: "x" }] }],
      },
    ]);
  });

  it("deixa asteriscos sem par ou com espaço como texto", () => {
    expect(analisarInline("2 * 3 * 4")).toEqual([
      { tipo: "texto", texto: "2 * 3 * 4" },
    ]);
    expect(analisarInline("**aberto")).toEqual([
      { tipo: "texto", texto: "**aberto" },
    ]);
  });
});

describe("TextoMarkdown (saída HTML)", () => {
  it("renderiza parágrafo, subtítulo, negrito e itálico", () => {
    const saida = html("Oi **forte** e *leve*.\n\n## Título");
    expect(saida).toContain("<strong");
    expect(saida).toContain("forte</strong>");
    expect(saida).toContain("<em>leve</em>");
    expect(saida).toContain("<h2");
    expect(saida).toContain("Título</h2>");
  });

  it("<script> sai como TEXTO, nunca como tag", () => {
    const saida = html("Veja <script>alert(1)</script> aqui\n\n## <img src=x onerror=alert(1)>");
    expect(saida).not.toContain("<script");
    expect(saida).not.toContain("<img");
    expect(saida).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(saida).toContain("&lt;img src=x onerror=alert(1)&gt;");
  });

  it("não interpreta HTML dentro de negrito", () => {
    const saida = html("**<b onclick=x>oi</b>**");
    expect(saida).not.toContain("<b ");
    expect(saida).toContain("&lt;b onclick=x&gt;oi&lt;/b&gt;");
  });
});
