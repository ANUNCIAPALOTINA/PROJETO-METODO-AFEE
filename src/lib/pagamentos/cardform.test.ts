import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  ID_DOCUMENTO_CARDFORM,
  TIPO_DOCUMENTO_CARDFORM,
  mensagemFalhaTokenizacao,
  numeroDocumentoCardform,
} from "./cardform";

/**
 * Regressão da causa raiz (docs/09): o `identificationNumber` do CardForm
 * recebia o CPF COM máscara e a tokenização falhava no navegador.
 */
describe("numeroDocumentoCardform", () => {
  it("entrega somente dígitos, com ou sem máscara, completo ou parcial", () => {
    const casos: Array<[string, string]> = [
      ["529.982.247-25", "52998224725"],
      ["52998224725", "52998224725"],
      ["529.982", "529982"],
      ["529.982.247-25 ", "52998224725"],
      ["", ""],
      ["...-", ""],
    ];
    for (const [entrada, esperado] of casos) {
      const valor = numeroDocumentoCardform(entrada);
      expect(valor).toBe(esperado);
      expect(valor).toMatch(/^\d*$/);
    }
  });

  it("nunca devolve ponto nem traço (o que quebrava a tokenização)", () => {
    expect(numeroDocumentoCardform("529.982.247-25")).not.toMatch(/[.\-]/);
  });
});

/**
 * Teste de ligação: garante que o componente realmente usa o valor técnico no
 * campo do SDK. O defeito original foi de ligação, não de cálculo.
 */
describe("cartao-mp.tsx", () => {
  const fonte = readFileSync(
    fileURLToPath(new URL("../../components/checkout/cartao-mp.tsx", import.meta.url)),
    "utf8",
  );

  it("aponta identificationNumber para o campo técnico só-dígitos", () => {
    expect(fonte).toContain("identificationNumber: { id: ID_DOCUMENTO_CARDFORM }");
    expect(fonte).toContain("value={numeroDocumentoCardform(cpf)}");
    expect(fonte).not.toContain('identificationNumber: { id: "cpf" }');
  });

  it("monta o tipo de documento que o SDK exige", () => {
    expect(fonte).toContain("identificationType: { id: ID.tipoDoc }");
    expect(fonte).toContain("defaultValue={TIPO_DOCUMENTO_CARDFORM}");
    expect(ID_DOCUMENTO_CARDFORM).toBe("mp-cpf");
    expect(TIPO_DOCUMENTO_CARDFORM).toBe("CPF");
  });
});

describe("mensagemFalhaTokenizacao", () => {
  it("aponta o número quando o SDK não identificou a bandeira", () => {
    expect(mensagemFalhaTokenizacao(null)).toBe("Confira o número do cartão e tente de novo.");
    expect(mensagemFalhaTokenizacao({ paymentMethodId: "" })).toMatch(/número do cartão/);
  });

  it("aponta validade/código quando a bandeira já foi identificada", () => {
    expect(mensagemFalhaTokenizacao({ paymentMethodId: "visa" })).toBe(
      "Confira a validade e o código de segurança do cartão.",
    );
  });

  it("nunca devolve a frase antiga, que não dizia qual campo conferir", () => {
    expect(mensagemFalhaTokenizacao(null)).not.toBe("Confira os dados do cartão e tente de novo.");
  });
});
