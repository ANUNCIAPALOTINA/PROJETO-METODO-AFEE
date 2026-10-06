import { describe, expect, it } from "vitest";
import { produto } from "@/config/produto";
import type { PagamentoMp } from "./cliente-mp";
import { decidirPagamento } from "./decisao";

const valorDoProduto = produto.precoCentavos / 100;

function pagamento(extra: Partial<PagamentoMp> = {}): PagamentoMp {
  return {
    id: "1001",
    status: "approved",
    statusDetail: "accredited",
    valor: valorDoProduto,
    moeda: "BRL",
    referenciaExterna: "afee-abc",
    email: "aluno@exemplo.com",
    valorReembolsado: 0,
    pix: null,
    ...extra,
  };
}

describe("decidirPagamento", () => {
  it("concede quando aprovado, valor e moeda batem", () => {
    expect(decidirPagamento(pagamento())).toEqual({ acao: "conceder", motivo: "aprovado" });
  });

  it.each(["refunded", "charged_back", "cancelled"])("revoga em %s", (status) => {
    expect(decidirPagamento(pagamento({ status, statusDetail: null }))).toEqual({
      acao: "revogar",
      motivo: status,
    });
  });

  it.each(["pending", "in_process", "rejected", "authorized", "in_mediation", "novo_status"])(
    "ignora %s",
    (status) => {
      expect(decidirPagamento(pagamento({ status })).acao).toBe("ignorar");
    },
  );

  it("não concede se o valor for diferente (maior ou menor)", () => {
    expect(decidirPagamento(pagamento({ valor: 1 })).motivo).toBe("valor_divergente");
    expect(decidirPagamento(pagamento({ valor: valorDoProduto + 0.01 })).acao).toBe("ignorar");
    expect(decidirPagamento(pagamento({ valor: Number.NaN })).acao).toBe("ignorar");
  });

  it("não revoga pagamento de valor diferente", () => {
    expect(decidirPagamento(pagamento({ status: "refunded", valor: 99 })).acao).toBe("ignorar");
  });

  it("não concede em outra moeda", () => {
    expect(decidirPagamento(pagamento({ moeda: "USD" })).motivo).toBe("moeda_divergente");
    expect(decidirPagamento(pagamento({ moeda: "" })).acao).toBe("ignorar");
  });

  it("ignora pagamento que não nasceu neste site", () => {
    expect(decidirPagamento(pagamento({ referenciaExterna: null })).motivo).toBe(
      "referencia_externa_desconhecida",
    );
    expect(decidirPagamento(pagamento({ referenciaExterna: "outra-loja-1" })).acao).toBe("ignorar");
  });

  it("ignora sem e-mail (não há para quem conceder)", () => {
    expect(decidirPagamento(pagamento({ email: null })).motivo).toBe("sem_email");
  });

  it("reembolso parcial não revoga nem concede de novo", () => {
    expect(
      decidirPagamento(pagamento({ statusDetail: "partially_refunded" })).motivo,
    ).toBe("reembolso_parcial");
  });
});
