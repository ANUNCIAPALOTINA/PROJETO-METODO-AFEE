import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { relatos } from "./relatos";

describe("relatos de alunos", () => {
  it("todo relato tem nome e texto preenchidos", () => {
    for (const r of relatos) {
      expect(r.nome.trim()).not.toBe("");
      expect(r.texto.trim()).not.toBe("");
    }
  });

  it("toda foto de relato existe em public/ e tem texto alternativo", () => {
    for (const r of relatos) {
      if (!r.foto) continue;
      expect(r.foto.alt.trim()).not.toBe("");
      expect(existsSync(join(process.cwd(), "public", r.foto.src))).toBe(true);
    }
  });
});
