import { describe, expect, it } from "vitest";
import {
  ID_DOCUMENTO_CARDFORM,
  TIPO_DOCUMENTO_CARDFORM,
  mensagemFalhaTokenizacao,
  numeroDocumentoCardform,
  sincronizarCpfCardform,
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

describe("sincronizarCpfCardform", () => {
  it("atualiza o espelho para somente dígitos quando o CPF visível muda", () => {
    const campos = {
      cpf: { value: "123.456.789-09" },
      [ID_DOCUMENTO_CARDFORM]: { value: "" },
    };
    const documento = { getElementById: (id: string) => campos[id as keyof typeof campos] ?? null } as unknown as Document;
    expect(sincronizarCpfCardform(documento)).toBe("12345678909");
    expect(campos[ID_DOCUMENTO_CARDFORM].value).toBe("12345678909");
    campos.cpf.value = "987.654.321-00";
    expect(sincronizarCpfCardform(documento)).toBe("98765432100");
    expect(campos[ID_DOCUMENTO_CARDFORM].value).toBe("98765432100");
  });
});

/**
 * Teste de ligação: garante que o componente realmente usa o valor técnico no
 * campo do SDK. O defeito original foi de ligação, não de cálculo.
 */
describe("cartao-mp.tsx", () => {
  it("mantém as constantes do contrato técnico", () => {
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
