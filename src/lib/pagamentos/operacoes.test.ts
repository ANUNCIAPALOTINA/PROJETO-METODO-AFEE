import { describe, expect, it, vi } from "vitest";
import type { ClienteMp, PagamentoMp } from "./cliente-mp";
import { consultarStatus, criarPagamento } from "./operacoes";

function pg(extra: Partial<PagamentoMp> = {}): PagamentoMp {
  return {
    id: "777",
    status: "pending",
    statusDetail: null,
    valor: 16.18,
    moeda: "BRL",
    referenciaExterna: "afee-1",
    email: "a@b.com",
    valorReembolsado: 0,
    pix: { qrCode: "COPIA-E-COLA", qrCodeBase64: "BASE64" },
    ...extra,
  };
}

function clienteFalso(p: PagamentoMp | null = pg()) {
  return {
    criarPagamentoPix: vi.fn<ClienteMp["criarPagamentoPix"]>(async () => p as PagamentoMp),
    criarPagamentoCartao: vi.fn<ClienteMp["criarPagamentoCartao"]>(async () => p as PagamentoMp),
    buscarPagamento: vi.fn<ClienteMp["buscarPagamento"]>(async () => p),
  } satisfies ClienteMp;
}

const comprador = { nome: "Ana Souza", email: "ana@exemplo.com", cpf: "52998224725" };

function post(corpo: unknown) {
  return new Request("https://site.teste/api/pagamentos", { method: "POST", body: JSON.stringify(corpo) });
}

describe("criarPagamento", () => {
  it("Pix: devolve só id, qr_code e qr_code_base64", async () => {
    const c = clienteFalso();
    const r = await criarPagamento(post({ ...comprador, metodo: "pix" }), c);
    expect(r.status).toBe(201);
    expect(await r.json()).toEqual({ metodo: "pix", id: "777", qrCode: "COPIA-E-COLA", qrCodeBase64: "BASE64" });
    expect(c.criarPagamentoPix).toHaveBeenCalledTimes(1);
  });

  it("não aceita valor vindo do navegador (nem repassa)", async () => {
    const c = clienteFalso();
    await criarPagamento(post({ ...comprador, metodo: "pix", valor: 0.01, transaction_amount: 0.01 }), c);
    expect(JSON.stringify(c.criarPagamentoPix.mock.calls)).not.toContain("0.01");
  });

  it("cartão recusado: devolve situação e mensagem simples", async () => {
    const c = clienteFalso(pg({ status: "rejected", statusDetail: "cc_rejected_insufficient_amount", pix: null }));
    const r = await criarPagamento(
      post({ ...comprador, metodo: "cartao", token: "abcdef1234567890", metodoPagamentoId: "visa" }),
      c,
    );
    expect(await r.json()).toEqual({
      metodo: "cartao",
      id: "777",
      situacao: "recusado",
      mensagem: "Saldo insuficiente no cartão.",
    });
  });

  it("dados inválidos: 400 sem chamar o MP", async () => {
    const c = clienteFalso();
    const r = await criarPagamento(post({ ...comprador, cpf: "111.111.111-11", metodo: "pix" }), c);
    expect(r.status).toBe(400);
    expect((await r.json()).erros.cpf).toBeTruthy();
    expect(c.criarPagamentoPix).not.toHaveBeenCalled();
  });

  it("JSON quebrado: 400; sem token do MP: 503; MP fora do ar: 502", async () => {
    const quebrado = new Request("https://site.teste/api/pagamentos", { method: "POST", body: "{" });
    expect((await criarPagamento(quebrado, clienteFalso())).status).toBe(400);
    expect((await criarPagamento(post({ ...comprador, metodo: "pix" }), null)).status).toBe(503);
    const c = clienteFalso();
    c.criarPagamentoPix.mockRejectedValueOnce(new Error("boom"));
    const erro = vi.spyOn(console, "error").mockImplementation(() => {});
    const r = await criarPagamento(post({ ...comprador, metodo: "pix" }), c);
    erro.mockRestore();
    expect(r.status).toBe(502);
  });
});

describe("consultarStatus", () => {
  it("devolve só a situação", async () => {
    const r = await consultarStatus("777", clienteFalso(pg({ status: "approved" })));
    expect(await r.json()).toEqual({ situacao: "aprovado" });
  });

  it("aprovado com valor diferente não aparece como aprovado", async () => {
    const r = await consultarStatus("777", clienteFalso(pg({ status: "approved", valor: 1 })));
    expect(await r.json()).toEqual({ situacao: "analise" });
  });

  it("404 para pagamento inexistente, id estranho ou de outra loja", async () => {
    expect((await consultarStatus("777", clienteFalso(null))).status).toBe(404);
    expect((await consultarStatus("abc", clienteFalso())).status).toBe(404);
    expect((await consultarStatus("777", clienteFalso(pg({ referenciaExterna: "outra-1" })))).status).toBe(404);
  });
});
