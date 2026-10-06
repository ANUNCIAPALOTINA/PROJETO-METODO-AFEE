import { describe, expect, it } from "vitest";
import { normalizarEmail, temAcessoAtivo } from "./regras";

const agora = new Date("2026-06-15T12:00:00Z");

describe("normalizarEmail", () => {
  it("passa para minúsculo e tira espaços das pontas", () => {
    expect(normalizarEmail("  Aluno@Exemplo.COM \n")).toBe("aluno@exemplo.com");
  });

  it("não mexe em e-mail já normalizado", () => {
    expect(normalizarEmail("a@b.com")).toBe("a@b.com");
  });
});

describe("temAcessoAtivo", () => {
  it("sem registro não tem acesso", () => {
    expect(temAcessoAtivo(null, agora)).toBe(false);
    expect(temAcessoAtivo(undefined, agora)).toBe(false);
  });

  it("vitalício (expira_em nulo) tem acesso", () => {
    expect(temAcessoAtivo({ expira_em: null, revogado_em: null }, agora)).toBe(true);
  });

  it("com prazo no futuro tem acesso", () => {
    expect(
      temAcessoAtivo({ expira_em: "2026-12-31T00:00:00Z", revogado_em: null }, agora),
    ).toBe(true);
  });

  it("expirado não tem acesso", () => {
    expect(
      temAcessoAtivo({ expira_em: "2026-06-01T00:00:00Z", revogado_em: null }, agora),
    ).toBe(false);
  });

  it("expirando exatamente agora já não vale", () => {
    expect(temAcessoAtivo({ expira_em: agora, revogado_em: null }, agora)).toBe(false);
  });

  it("revogado não tem acesso, mesmo vitalício", () => {
    expect(
      temAcessoAtivo({ expira_em: null, revogado_em: "2026-06-10T00:00:00Z" }, agora),
    ).toBe(false);
  });

  it("revogado não tem acesso, mesmo com prazo no futuro", () => {
    expect(
      temAcessoAtivo(
        { expira_em: "2026-12-31T00:00:00Z", revogado_em: new Date("2026-06-10T00:00:00Z") },
        agora,
      ),
    ).toBe(false);
  });

  it("data de expiração inválida falha fechada", () => {
    expect(temAcessoAtivo({ expira_em: "não é data", revogado_em: null }, agora)).toBe(false);
  });

  it("a comparação de e-mail com maiúsculas e espaços bate depois de normalizar", () => {
    const gravado = normalizarEmail("aluno@exemplo.com");
    expect(normalizarEmail("  ALUNO@Exemplo.com ")).toBe(gravado);
  });
});
