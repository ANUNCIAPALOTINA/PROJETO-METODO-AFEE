import { produto } from "@/config/produto";
import type { PagamentoMp } from "./cliente-mp";
import { PREFIXO_REFERENCIA } from "./constantes";

export type Decisao = {
  acao: "conceder" | "revogar" | "ignorar";
  motivo: string;
};

const STATUS_REVOGAR = new Set(["refunded", "charged_back", "cancelled"]);

/**
 * Decide o que fazer com um pagamento QUE VEIO DA API do Mercado Pago
 * (nunca do corpo do webhook). Função pura.
 *
 * Só concede ou revoga se o pagamento for deste produto: referência com o
 * nosso prefixo, moeda BRL e valor igual ao preço atual (em centavos).
 */
export function decidirPagamento(pagamento: PagamentoMp): Decisao {
  if (!pagamento.referenciaExterna?.startsWith(PREFIXO_REFERENCIA)) {
    return { acao: "ignorar", motivo: "referencia_externa_desconhecida" };
  }
  if (pagamento.moeda !== produto.moeda) {
    return { acao: "ignorar", motivo: "moeda_divergente" };
  }
  if (
    !Number.isFinite(pagamento.valor) ||
    Math.round(pagamento.valor * 100) !== produto.precoCentavos
  ) {
    return { acao: "ignorar", motivo: "valor_divergente" };
  }
  if (!pagamento.email) {
    return { acao: "ignorar", motivo: "sem_email" };
  }

  if (pagamento.status === "approved") {
    // Reembolso parcial mantém "approved"; o acesso segue valendo.
    if (pagamento.statusDetail === "partially_refunded") {
      return { acao: "ignorar", motivo: "reembolso_parcial" };
    }
    return { acao: "conceder", motivo: "aprovado" };
  }
  if (STATUS_REVOGAR.has(pagamento.status)) {
    return { acao: "revogar", motivo: pagamento.status };
  }
  return { acao: "ignorar", motivo: `status_${pagamento.status}` };
}
