import { describe, expect, it } from "vitest";
import { validarComprador, validarPedido } from "./entrada";

const comprador = { nome: "  Maria  da Silva ", email: " Maria@Exemplo.COM ", cpf: "529.982.247-25" };
const UUID = "3f2b8c1e-9a4d-4b7e-8c21-5d6e7f8a9b0c";

describe("validarComprador", () => {
  it("normaliza nome, e-mail e CPF", () => {
    const r = validarComprador(comprador);
    expect(r).toEqual({
      ok: true,
      dados: {
        primeiroNome: "Maria",
        sobrenome: "da Silva",
        nome: "Maria da Silva",
        email: "maria@exemplo.com",
        cpf: "52998224725",
      },
    });
  });

  it("aponta cada campo inválido", () => {
    const r = validarComprador({ nome: "Maria", email: "x@y", cpf: "123" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.erros).sort()).toEqual(["cpf", "email", "nome"]);
  });

  it("não quebra com tipos errados", () => {
    expect(validarComprador({ nome: 1, email: null, cpf: {} }).ok).toBe(false);
  });
});

describe("validarPedido", () => {
  const gerar = () => "gerada-no-servidor";

  it("aceita Pix e ignora qualquer campo de valor enviado pelo navegador", () => {
    const r = validarPedido({ ...comprador, metodo: "pix", chave: UUID, valor: 0.01, transaction_amount: 1 }, gerar);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.pedido.metodo).toBe("pix");
      expect(r.pedido.chave).toBe(UUID);
      expect(JSON.stringify(r.pedido)).not.toContain("0.01");
    }
  });

  it("gera chave de idempotência se a do navegador for inválida", () => {
    const r = validarPedido({ ...comprador, metodo: "pix", chave: "../x" }, gerar);
    expect(r.ok && r.pedido.chave).toBe("gerada-no-servidor");
  });

  it("cartão exige token e bandeira", () => {
    expect(validarPedido({ ...comprador, metodo: "cartao" }, gerar).ok).toBe(false);
    const r = validarPedido(
      { ...comprador, metodo: "cartao", token: "abcdef1234567890", metodoPagamentoId: "visa", parcelas: 1, emissorId: "25" },
      gerar,
    );
    expect(r.ok).toBe(true);
    if (r.ok && r.pedido.metodo === "cartao") {
      expect(r.pedido.parcelas).toBe(1);
      expect(r.pedido.emissorId).toBe("25");
    }
  });

  it("rejeita token com caracteres estranhos e parcelas absurdas viram 1", () => {
    expect(
      validarPedido({ ...comprador, metodo: "cartao", token: "a b<script>", metodoPagamentoId: "visa" }, gerar).ok,
    ).toBe(false);
    const r = validarPedido(
      { ...comprador, metodo: "cartao", token: "abcdef1234567890", metodoPagamentoId: "visa", parcelas: 99 },
      gerar,
    );
    expect(r.ok && r.pedido.metodo === "cartao" && r.pedido.parcelas).toBe(1);
  });

  it("rejeita método desconhecido e corpo inválido", () => {
    expect(validarPedido({ ...comprador, metodo: "boleto" }, gerar).ok).toBe(false);
    expect(validarPedido(null, gerar).ok).toBe(false);
    expect(validarPedido("texto", gerar).ok).toBe(false);
  });
});
