import { describe, expect, it, vi } from "vitest";
import { precoParaGateway, produto } from "@/config/produto";
import { criarClienteMp, ErroMp, normalizarPagamento } from "./cliente-mp";

const pagador = { email: "a@b.com", primeiroNome: "Ana", sobrenome: "Souza", cpf: "52998224725" };

function fetchFalso(status: number, corpo: unknown) {
  return vi.fn(async () => new Response(JSON.stringify(corpo), { status }));
}

function cliente(fetchImpl: typeof fetch) {
  return criarClienteMp({ accessToken: "TOKEN-DE-TESTE", fetchImpl, baseUrl: "https://mp.teste" });
}

const respostaPix = {
  id: 987654321,
  status: "pending",
  status_detail: "pending_waiting_transfer",
  transaction_amount: 16.18,
  currency_id: "BRL",
  external_reference: "afee-xyz",
  payer: { email: "A@B.com" },
  point_of_interaction: { transaction_data: { qr_code: "000201...", qr_code_base64: "iVBOR..." } },
};

describe("criarPagamentoPix", () => {
  it("envia valor do produto, Idempotency-Key e token; devolve o QR", async () => {
    const f = fetchFalso(201, respostaPix);
    const p = await cliente(f as unknown as typeof fetch).criarPagamentoPix(pagador, "chave-1");

    expect(f).toHaveBeenCalledTimes(1);
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://mp.teste/v1/payments");
    expect(init.method).toBe("POST");
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer TOKEN-DE-TESTE");
    expect(headers["X-Idempotency-Key"]).toBe("chave-1");

    const corpo = JSON.parse(init.body as string);
    expect(corpo.transaction_amount).toBe(precoParaGateway(produto.precoCentavos));
    expect(corpo.payment_method_id).toBe("pix");
    expect(corpo.external_reference).toMatch(/^afee-/);
    expect(corpo.payer.identification).toEqual({ type: "CPF", number: "52998224725" });

    expect(p.id).toBe("987654321");
    expect(p.pix).toEqual({ qrCode: "000201...", qrCodeBase64: "iVBOR..." });
    expect(p.email).toBe("a@b.com");
  });

  it("lança ErroMp se o MP recusar (sem vazar o token)", async () => {
    const f = fetchFalso(401, { message: "invalid token" });
    const erro = await cliente(f as unknown as typeof fetch).criarPagamentoPix(pagador, "k").catch((e) => e);
    expect(erro).toBeInstanceOf(ErroMp);
    expect(erro.status).toBe(401);
    expect(String(erro.message)).not.toContain("TOKEN-DE-TESTE");
  });

  it("transforma falha de rede em ErroMp", async () => {
    const f = vi.fn(async () => {
      throw new TypeError("fetch failed");
    });
    await expect(cliente(f as unknown as typeof fetch).criarPagamentoPix(pagador, "k")).rejects.toBeInstanceOf(ErroMp);
  });
});

describe("criarPagamentoCartao", () => {
  it("envia token, parcelas e bandeira, nunca número de cartão", async () => {
    const f = fetchFalso(201, { ...respostaPix, status: "approved", point_of_interaction: undefined });
    await cliente(f as unknown as typeof fetch).criarPagamentoCartao(
      pagador,
      { token: "tok_123", metodoPagamentoId: "visa", emissorId: "25", parcelas: 1 },
      "chave-2",
    );
    const corpo = JSON.parse((f.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(corpo).toMatchObject({
      token: "tok_123",
      installments: 1,
      payment_method_id: "visa",
      issuer_id: 25,
      transaction_amount: precoParaGateway(produto.precoCentavos),
    });
    expect(corpo.card_number).toBeUndefined();
  });
});

describe("buscarPagamento", () => {
  it("faz GET e normaliza", async () => {
    const f = fetchFalso(200, { ...respostaPix, status: "approved" });
    const p = await cliente(f as unknown as typeof fetch).buscarPagamento("987654321");
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://mp.teste/v1/payments/987654321");
    expect(init.method).toBe("GET");
    expect(p?.status).toBe("approved");
    expect(p?.valor).toBe(16.18);
    expect(p?.moeda).toBe("BRL");
  });

  it("devolve null em 404 e para ids que não são numéricos (sem chamar a API)", async () => {
    const f = fetchFalso(404, { message: "not found" });
    const c = cliente(f as unknown as typeof fetch);
    expect(await c.buscarPagamento("1")).toBeNull();
    expect(await c.buscarPagamento("../../users")).toBeNull();
    expect(f).toHaveBeenCalledTimes(1);
  });

  it("lança em 500 para o MP reenviar o webhook", async () => {
    const f = fetchFalso(500, {});
    await expect(cliente(f as unknown as typeof fetch).buscarPagamento("1")).rejects.toBeInstanceOf(ErroMp);
  });
});

describe("normalizarPagamento", () => {
  it("lança sem id ou status e trata campos ausentes", () => {
    expect(() => normalizarPagamento({})).toThrow(ErroMp);
    expect(() => normalizarPagamento(null)).toThrow(ErroMp);
    const p = normalizarPagamento({ id: 1, status: "approved" });
    expect(p.valor).toBeNaN();
    expect(p.moeda).toBe("");
    expect(p.email).toBeNull();
    expect(p.pix).toBeNull();
  });
});

describe("dataExpiracaoPix", () => {
  it("soma 24h e escreve em horário de Brasília", async () => {
    const { dataExpiracaoPix } = await import("./cliente-mp");
    expect(dataExpiracaoPix(new Date("2026-10-06T15:00:00Z"))).toBe("2026-10-07T12:00:00.000-03:00");
  });
});
