import { describe, expect, it } from "vitest";
import {
  formatarPreco,
  precoFormatado,
  precoParaGateway,
  produto,
} from "@/config/produto";

// O espaço entre "R$" e o valor é um espaço sem quebra; normalizamos para comparar.
const semNbsp = (texto: string) => texto.replace(/ /g, " ");

describe("preço do Método AFEE", () => {
  it("está em 1618 centavos (R$ 16,18)", () => {
    expect(produto.precoCentavos).toBe(1618);
  });

  it("aparece na tela como R$ 16,18", () => {
    expect(semNbsp(precoFormatado)).toBe("R$ 16,18");
    expect(semNbsp(formatarPreco(1618))).toBe("R$ 16,18");
  });

  it("vai para o Mercado Pago como 16.18, sem erro de arredondamento", () => {
    expect(precoParaGateway(1618)).toBe(16.18);
    expect(precoParaGateway(produto.precoCentavos) * 100).toBeCloseTo(1618, 6);
  });

  it("formata outros valores com a vírgula certa", () => {
    expect(semNbsp(formatarPreco(5))).toBe("R$ 0,05");
    expect(semNbsp(formatarPreco(100))).toBe("R$ 1,00");
    expect(semNbsp(formatarPreco(123456))).toBe("R$ 1.234,56");
  });

  it("recusa valores que não são centavos inteiros", () => {
    expect(() => formatarPreco(16.18)).toThrow();
    expect(() => precoParaGateway(16.18)).toThrow();
    expect(() => formatarPreco(-1)).toThrow();
    expect(() => formatarPreco(Number.NaN)).toThrow();
  });
});
