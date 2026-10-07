import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { prepararAppEbook } from "./app-ebook";

const html = readFileSync(
  join(process.cwd(), "src/content/ebook-app/index.html"),
  "utf8",
);

describe("prepararAppEbook", () => {
  const saida = prepararAppEbook(html, "aluno@exemplo.com");

  it("tira service worker, manifest e ícones (nada de cópia offline fora do login)", () => {
    expect(saida).not.toMatch(/serviceWorker/);
    expect(saida).not.toMatch(/rel="manifest"/);
    expect(saida).not.toMatch(/rel="(?:apple-touch-)?icon"/);
  });

  it("põe a marca d'água com o e-mail do aluno antes do fim da página", () => {
    expect(saida.match(/aluno@exemplo\.com/g)?.length).toBeGreaterThanOrEqual(20);
    expect(saida.indexOf("marca-dagua")).toBeLessThan(saida.lastIndexOf("</body>"));
  });

  it("escapa o e-mail (nada de HTML solto na página)", () => {
    const perigoso = prepararAppEbook(html, '"><script>alert(1)</script>@x.com');
    expect(perigoso).not.toContain("<script>alert(1)");
    expect(perigoso).toContain("&lt;script&gt;");
  });

  it("mantém os 12 capítulos do app", () => {
    for (let n = 1; n <= 12; n++) expect(saida).toContain(`id="cap-${n}"`);
  });

  it("falha alto se o HTML não tiver </body>", () => {
    expect(() => prepararAppEbook("<html></html>", "a@b.com")).toThrow();
  });
});
