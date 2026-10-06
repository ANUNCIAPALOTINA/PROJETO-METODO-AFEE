import { describe, expect, it } from "vitest";
import { mascararEmail } from "./mascarar";
import { mensagemDeRecusa, situacaoDoPagamento } from "./status";

describe("mascararEmail", () => {
  it("esconde o usuário", () => {
    expect(mascararEmail("joao@exemplo.com")).toBe("j***@exemplo.com");
    expect(mascararEmail(null)).toBe("(sem e-mail)");
    expect(mascararEmail("semarroba")).toBe("***");
  });
});

describe("status", () => {
  it("resume o status do MP", () => {
    expect(situacaoDoPagamento({ status: "approved" })).toBe("aprovado");
    expect(situacaoDoPagamento({ status: "pending" })).toBe("pendente");
    expect(situacaoDoPagamento({ status: "in_process" })).toBe("analise");
    expect(situacaoDoPagamento({ status: "rejected" })).toBe("recusado");
    expect(situacaoDoPagamento({ status: "cancelled" })).toBe("encerrado");
    expect(situacaoDoPagamento({ status: "algo_novo" })).toBe("pendente");
  });

  it("mensagem de recusa nunca vaza o detalhe cru", () => {
    expect(mensagemDeRecusa("cc_rejected_other_reason")).toMatch(/Tente outro cartão/);
    expect(mensagemDeRecusa(null)).toMatch(/Tente outro cartão/);
  });
});
