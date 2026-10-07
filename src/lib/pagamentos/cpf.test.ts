import { describe, expect, it } from "vitest";
import { formatarCpf, somenteDigitos, validarCpf } from "./cpf";

describe("validarCpf", () => {
  it("aceita CPFs válidos, com ou sem máscara", () => {
    expect(validarCpf("52998224725")).toBe(true);
    expect(validarCpf("529.982.247-25")).toBe(true);
    expect(validarCpf("111.444.777-35")).toBe(true);
  });

  it("rejeita dígito verificador errado", () => {
    expect(validarCpf("52998224724")).toBe(false);
    expect(validarCpf("52998224735")).toBe(false);
  });

  it("rejeita sequências repetidas e tamanhos errados", () => {
    expect(validarCpf("111.111.111-11")).toBe(false);
    expect(validarCpf("00000000000")).toBe(false);
    expect(validarCpf("5299822472")).toBe(false);
    expect(validarCpf("529982247255")).toBe(false);
    expect(validarCpf("")).toBe(false);
    expect(validarCpf("abc")).toBe(false);
  });
});

describe("formatarCpf e somenteDigitos", () => {
  it("formata aos poucos enquanto digita", () => {
    expect(formatarCpf("5")).toBe("5");
    expect(formatarCpf("52998")).toBe("529.98");
    expect(formatarCpf("529982247")).toBe("529.982.247");
    expect(formatarCpf("52998224725")).toBe("529.982.247-25");
    expect(formatarCpf("5299822472599")).toBe("529.982.247-25");
  });

  it("extrai só dígitos", () => {
    expect(somenteDigitos("529.982.247-25")).toBe("52998224725");
  });
});
