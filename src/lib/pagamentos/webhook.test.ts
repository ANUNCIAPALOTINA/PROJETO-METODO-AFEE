import { describe, expect, it, vi } from "vitest";
import { produto } from "@/config/produto";
import { hmacSha256Hex, montarManifesto } from "./assinatura";
import type { PagamentoMp } from "./cliente-mp";
import { processarWebhook, type DepsWebhook } from "./webhook";

const SEGREDO = "segredo-de-teste";

function pagamento(extra: Partial<PagamentoMp> = {}): PagamentoMp {
  return {
    id: "555",
    status: "approved",
    statusDetail: "accredited",
    valor: produto.precoCentavos / 100,
    moeda: "BRL",
    referenciaExterna: "afee-1",
    email: "aluno@exemplo.com",
    valorReembolsado: 0,
    pix: null,
    ...extra,
  };
}

function requisicao(opcoes: { dataId?: string; tipo?: string; assinar?: boolean; corpo?: unknown; segredoAssinatura?: string } = {}) {
  const { dataId = "555", tipo = "payment", assinar = true, corpo, segredoAssinatura = SEGREDO } = opcoes;
  const requestId = "req-1";
  const ts = "1742505638683";
  const headers = new Headers({ "x-request-id": requestId, "content-type": "application/json" });
  if (assinar) {
    const v1 = hmacSha256Hex(segredoAssinatura, montarManifesto({ dataId, requestId, ts }));
    headers.set("x-signature", `ts=${ts},v1=${v1}`);
  }
  const query = new URLSearchParams({ "data.id": dataId });
  if (tipo) query.set("type", tipo);
  return new Request(`https://site.teste/api/webhooks/mercadopago?${query}`, {
    method: "POST",
    headers,
    body: JSON.stringify(corpo ?? { type: tipo, data: { id: dataId } }),
  });
}

function deps(p: PagamentoMp | null | Error): DepsWebhook & {
  conceder: ReturnType<typeof vi.fn>;
  revogar: ReturnType<typeof vi.fn>;
  buscarPagamento: ReturnType<typeof vi.fn>;
} {
  return {
    segredo: SEGREDO,
    buscarPagamento: vi.fn(async () => {
      if (p instanceof Error) throw p;
      return p;
    }),
    conceder: vi.fn(async () => {}),
    revogar: vi.fn(async () => {}),
  };
}

describe("processarWebhook", () => {
  it("aprovado: confere assinatura, busca na API e concede", async () => {
    const d = deps(pagamento());
    const r = await processarWebhook(requisicao(), d);
    expect(r.status).toBe(200);
    expect(d.buscarPagamento).toHaveBeenCalledWith("555");
    expect(d.conceder).toHaveBeenCalledWith("aluno@exemplo.com", "555");
    expect(d.revogar).not.toHaveBeenCalled();
  });

  it("é idempotente: repetir a notificação chama conceder de novo com os mesmos dados", async () => {
    const d = deps(pagamento());
    await processarWebhook(requisicao(), d);
    await processarWebhook(requisicao(), d);
    expect(d.conceder).toHaveBeenCalledTimes(2);
    expect(d.conceder.mock.calls[0]).toEqual(d.conceder.mock.calls[1]);
  });

  it.each(["refunded", "charged_back", "cancelled"])("%s: revoga", async (status) => {
    const d = deps(pagamento({ status }));
    const r = await processarWebhook(requisicao(), d);
    expect(r.status).toBe(200);
    expect(d.revogar).toHaveBeenCalledWith("aluno@exemplo.com", "555");
    expect(d.conceder).not.toHaveBeenCalled();
  });

  it("assinatura ausente ou forjada: 401 e nada é consultado nem gravado", async () => {
    for (const req of [requisicao({ assinar: false }), requisicao({ segredoAssinatura: "errado" })]) {
      const d = deps(pagamento());
      const r = await processarWebhook(req, d);
      expect(r.status).toBe(401);
      expect(d.buscarPagamento).not.toHaveBeenCalled();
      expect(d.conceder).not.toHaveBeenCalled();
    }
  });

  it("id alterado depois de assinado: 401", async () => {
    const original = requisicao({ dataId: "555" });
    const adulterada = new Request(original.url.replace("data.id=555", "data.id=556"), {
      method: "POST",
      headers: original.headers,
      body: "{}",
    });
    const d = deps(pagamento());
    expect((await processarWebhook(adulterada, d)).status).toBe(401);
  });

  it("sem segredo configurado: 500", async () => {
    const d = { ...deps(pagamento()), segredo: undefined };
    const antes = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    delete process.env.MERCADOPAGO_WEBHOOK_SECRET;
    try {
      expect((await processarWebhook(requisicao(), d)).status).toBe(500);
    } finally {
      if (antes !== undefined) process.env.MERCADOPAGO_WEBHOOK_SECRET = antes;
    }
  });

  it("evento que não é de pagamento: 200 sem consultar", async () => {
    const d = deps(pagamento());
    const r = await processarWebhook(requisicao({ tipo: "merchant_order" }), d);
    expect(r.status).toBe(200);
    expect(d.buscarPagamento).not.toHaveBeenCalled();
  });

  it("o corpo da notificação não manda em nada: status 'approved' no corpo é ignorado", async () => {
    const d = deps(pagamento({ status: "pending" }));
    const r = await processarWebhook(
      requisicao({ corpo: { type: "payment", status: "approved", data: { id: "555", status: "approved" } } }),
      d,
    );
    expect(r.status).toBe(200);
    expect(d.conceder).not.toHaveBeenCalled();
  });

  it("valor ou moeda divergentes: 200, mas não concede", async () => {
    for (const extra of [{ valor: 1 }, { moeda: "USD" }]) {
      const d = deps(pagamento(extra));
      const r = await processarWebhook(requisicao(), d);
      expect(r.status).toBe(200);
      expect(d.conceder).not.toHaveBeenCalled();
    }
  });

  it("pagamento inexistente (notificação de teste): 200", async () => {
    const d = deps(null);
    expect((await processarWebhook(requisicao({ dataId: "123456" }), d)).status).toBe(200);
    expect(d.conceder).not.toHaveBeenCalled();
  });

  it("falha ao consultar o MP: 502 (o MP reenvia)", async () => {
    const d = deps(new Error("rede"));
    expect((await processarWebhook(requisicao(), d)).status).toBe(502);
  });

  it("falha ao gravar o acesso: 500 (o MP reenvia)", async () => {
    const d = deps(pagamento());
    d.conceder.mockRejectedValueOnce(new Error("banco fora"));
    expect((await processarWebhook(requisicao(), d)).status).toBe(500);
    d.revogar.mockRejectedValueOnce(new Error("banco fora"));
    const d2 = deps(pagamento({ status: "refunded" }));
    d2.revogar.mockRejectedValueOnce(new Error("banco fora"));
    expect((await processarWebhook(requisicao(), d2)).status).toBe(500);
  });

  it("não loga e-mail completo", async () => {
    const espiao = vi.spyOn(console, "info").mockImplementation(() => {});
    await processarWebhook(requisicao(), deps(pagamento()));
    const saida = JSON.stringify(espiao.mock.calls);
    espiao.mockRestore();
    expect(saida).not.toContain("aluno@exemplo.com");
    expect(saida).toContain("a***@exemplo.com");
  });
});
