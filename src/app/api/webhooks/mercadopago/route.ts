import { produto } from "@/config/produto";
import { concederAcesso, revogarAcesso } from "@/lib/acesso";
import { clienteMpDoAmbiente } from "@/lib/pagamentos/cliente-mp";
import { processarWebhook } from "@/lib/pagamentos/webhook";

/**
 * Só o Mercado Pago chama esta rota (POST). Cadastre a URL
 * `<NEXT_PUBLIC_SITE_URL>/api/webhooks/mercadopago` no painel do MP
 * (evento "Pagamentos") e copie o segredo para MERCADOPAGO_WEBHOOK_SECRET.
 */
export async function POST(req: Request) {
  return processarWebhook(req, {
    buscarPagamento: (id) => clienteMpDoAmbiente().buscarPagamento(id),
    // O valor só é gravado como registro: já foi conferido contra o produto.
    conceder: (email, paymentId) =>
      concederAcesso(email, paymentId, { valorCentavos: produto.precoCentavos }),
    revogar: revogarAcesso,
  });
}
