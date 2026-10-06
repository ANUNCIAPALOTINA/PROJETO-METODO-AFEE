import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { capitulos } from "@/content/ebook/capitulos";
import integridade from "@/content/ebook/integridade.json";
import { vendas } from "@/content/vendas";

// Mesma normalização do scripts/converter-ebook.py
function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Mn}/gu, "")
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function paragrafosPuros(markdown: string): string[] {
  return markdown
    .split("\n\n")
    .map((p) =>
      p
        .replace(/^## /, "")
        .replace(/\*+/g, "")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean);
}

describe("ebook em capítulos", () => {
  it("tem os 12 capítulos, numerados em ordem e com slugs únicos", () => {
    expect(capitulos).toHaveLength(12);
    expect(capitulos.map((c) => c.numero)).toEqual(
      Array.from({ length: 12 }, (_, i) => i + 1),
    );
    expect(new Set(capitulos.map((c) => c.slug)).size).toBe(12);
  });

  it("entrega exatamente o que a página de vendas promete, na mesma ordem", () => {
    expect(capitulos.map((c) => c.titulo)).toEqual([
      ...vendas.conteudo.itens,
    ]);
  });

  it("não perdeu nem mudou nenhum parágrafo do documento revisado", () => {
    const todos = capitulos.flatMap((c) => paragrafosPuros(c.markdown));
    expect(todos).toHaveLength(integridade.paragrafos);
    const hash = createHash("sha256")
      .update(normalizar(todos.join("\n")), "utf8")
      .digest("hex");
    expect(hash).toBe(integridade.sha256);
  });

  it("a contagem de palavras bate com o documento", () => {
    const soma = capitulos.reduce((n, c) => n + c.palavras, 0);
    expect(soma).toBe(integridade.palavras);
    for (const c of capitulos) {
      expect(c.palavras).toBeGreaterThan(0);
      expect(c.minutos).toBeGreaterThanOrEqual(1);
    }
  });

  it("usa o nome do autor (Exaustar) e a grafia revisada", () => {
    const tudo = capitulos.map((c) => c.titulo + "\n" + c.markdown).join("\n");
    expect(tudo).not.toMatch(/exaurir/i);
    expect(tudo).not.toMatch(/E – Executar/);
    expect(tudo).not.toMatch(/calistênia/i);
    expect(tudo).not.toMatch(/<w:|xml:space/);
    expect(tudo).toMatch(/E – Exaustar/);
  });

  it("os 4 passos do método estão no capítulo 6", () => {
    const md = capitulos[5].markdown;
    for (const passo of [
      "A – Aquecer",
      "F – Forçar",
      "E – Estimular",
      "E – Exaustar",
    ]) {
      expect(md).toContain(passo);
    }
  });
});
