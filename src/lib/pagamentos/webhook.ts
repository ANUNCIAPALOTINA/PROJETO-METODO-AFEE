import { verificarAssinatura } from "./assinatura";
import type { PagamentoMp } from "./cliente-mp";
import { decidirPagamento } from "./decisao";
import { mascararEmail } from "./mascarar";

/**
 * Dependências injetadas (a rota usa as reais; os testes usam falsas).
 * `conceder` e `revogar` DEVEM ser idempotentes (o MP reenvia notificações)
 * e devem usar o paymentId: revogar só desfaz o acesso concedido por AQUELE
 * pagamento (um Pix vencido de uma segunda tentativa não pode tirar o acesso
 * de quem já pagou por outro pagamento).
 */
export type DepsWebhook = {
  buscarPagamento(id: string): Promise<PagamentoMp | null>;
  conceder(email: string, paymentId: string): Promise<void>;
  revogar(email: string, paymentId: string): Promise<void>;
  /** Segredo do webhook. Padrão: MERCADOPAGO_WEBHOOK_SECRET. */
  segredo?: string;
};

function resposta(status: number, corpo: Record<string, unknown>): Response {
  return Response.json(corpo, { status });
}

async function lerTipoDoCorpo(req: Request): Promise<string | null> {
  try {
    const corpo: unknown = await req.json();
    if (typeof corpo === "object" && corpo !== null) {
      const tipo = (corpo as Record<string, unknown>).type;
      return typeof tipo === "string" ? tipo : null;
    }
  } catch {
    // corpo ausente ou inválido: tratado como evento irrelevante
  }
  return null;
}

/**
 * Processa uma notificação do Mercado Pago.
 *  - 401: assinatura inválida (o MP não deve reenviar o que é forjado)
 *  - 200: evento irrelevante, pagamento inexistente ou decisão "ignorar"
 *  - 500/502: falha nossa ou do MP (o MP reenvia depois)
 * O corpo da notificação NUNCA decide nada: só o pagamento buscado na API.
 */
export async function processarWebhook(
  req: Request,
  deps: DepsWebhook,
): Promise<Response> {
  const segredo = deps.segredo ?? process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!segredo) {
    console.error("[webhook-mp] MERCADOPAGO_WEBHOOK_SECRET não configurado");
    return resposta(500, { erro: "webhook_nao_configurado" });
  }

  const url = new URL(req.url);
  const dataId = url.searchParams.get("data.id");

  const assinaturaOk = verificarAssinatura({
    segredo,
    xSignature: req.headers.get("x-signature"),
    xRequestId: req.headers.get("x-request-id"),
    dataId,
  });
  if (!assinaturaOk) {
    console.warn("[webhook-mp] assinatura inválida");
    return resposta(401, { erro: "assinatura_invalida" });
  }

  const tipo = url.searchParams.get("type") ?? (await lerTipoDoCorpo(req));
  if (tipo !== "payment") {
    return resposta(200, { ok: true, ignorado: "evento_irrelevante" });
  }
  if (!dataId || !/^\d{1,20}$/.test(dataId)) {
    return resposta(200, { ok: true, ignorado: "id_invalido" });
  }

  let pagamento: PagamentoMp | null;
  try {
    pagamento = await deps.buscarPagamento(dataId);
  } catch (erro) {
    console.error("[webhook-mp] falha ao buscar pagamento", dataId, erro);
    return resposta(502, { erro: "falha_ao_consultar_mp" });
  }
  if (!pagamento) {
    // Ex.: notificação de teste do painel (id fictício).
    return resposta(200, { ok: true, ignorado: "pagamento_inexistente" });
  }

  const decisao = decidirPagamento(pagamento);
  console.info("[webhook-mp]", {
    pagamento: pagamento.id,
    status: pagamento.status,
    acao: decisao.acao,
    motivo: decisao.motivo,
    email: mascararEmail(pagamento.email),
  });

  if (decisao.acao === "ignorar" || !pagamento.email) {
    return resposta(200, { ok: true, ignorado: decisao.motivo });
  }

  try {
    if (decisao.acao === "conceder") {
      await deps.conceder(pagamento.email, pagamento.id);
    } else {
      await deps.revogar(pagamento.email, pagamento.id);
    }
  } catch (erro) {
    console.error("[webhook-mp] falha ao gravar acesso", pagamento.id, erro);
    return resposta(500, { erro: "falha_ao_gravar" });
  }
  return resposta(200, { ok: true, acao: decisao.acao });
}
