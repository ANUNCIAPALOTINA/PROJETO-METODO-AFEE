import { describe, expect, it } from "vitest";
import {
  MENSAGEM_ENCERRADO,
  mensagemDeRecusa,
  situacaoDoPagamento,
} from "./status";

describe("situacaoDoPagamento", () => {
  it("traduz os status do MP", () => {
    expect(situacaoDoPagamento({ status: "approved" })).toBe("aprovado");
    expect(situacaoDoPagamento({ status: "rejected" })).toBe("recusado");
    expect(situacaoDoPagamento({ status: "in_process" })).toBe("analise");
    expect(situacaoDoPagamento({ status: "refunded" })).toBe("encerrado");
  });

  it("trata status pendente ou desconhecido como pendente (seguimos esperando)", () => {
    expect(situacaoDoPagamento({ status: "pending" })).toBe("pendente");
    expect(situacaoDoPagamento({ status: "pending_challenge" })).toBe("pendente");
  });
});

describe("mensagemDeRecusa", () => {
  it("cobre os detalhes conhecidos do gateway", () => {
    const esperado: Array<[string, RegExp]> = [
      ["cc_rejected_insufficient_amount", /Saldo insuficiente/],
      ["cc_rejected_bad_filled_card_number", /número do cartão/],
      ["cc_rejected_bad_filled_date", /validade/],
      ["cc_rejected_bad_filled_security_code", /código de segurança/],
      ["cc_rejected_invalid_installments", /parcelas/],
      ["cc_rejected_call_for_authorize", /autorização/],
      ["cc_rejected_card_disabled", /desabilitado/],
      ["cc_rejected_high_risk", /segurança/],
      ["cc_rejected_max_attempts", /Muitas tentativas/],
      ["cc_rejected_3ds_challenge", /autenticação/],
      ["cc_rejected_blacklist", /bloqueou/],
      ["cc_rejected_card_type_not_allowed", /tipo de cartão/],
      ["cc_rejected_other_reason", /banco não autorizou/],
      ["cc_rejected_duplicated_payment", /pagamento igual/],
    ];
    for (const [detalhe, padrao] of esperado) {
      expect(mensagemDeRecusa(detalhe)).toMatch(padrao);
    }
  });

  it("usa a frase genérica só em detalhe que ainda não conhecemos", () => {
    expect(mensagemDeRecusa("cc_rejected_novidade_do_mp")).toBe(
      "O cartão não foi aprovado. Tente outro cartão ou pague com Pix.",
    );
    expect(mensagemDeRecusa(null)).toMatch(/não foi aprovado/);
  });

  it("não expõe código interno na mensagem", () => {
    expect(mensagemDeRecusa("cc_rejected_other_reason")).not.toContain("cc_rejected");
  });

  it("tem mensagem própria para pagamento encerrado", () => {
    expect(MENSAGEM_ENCERRADO).toMatch(/cancelado ou estornado/);
  });
});
