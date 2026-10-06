import type { PagamentoMp } from "./cliente-mp";

/** Situação resumida que o navegador pode ver. */
export type SituacaoPagamento =
  | "aprovado"
  | "pendente"
  | "analise"
  | "recusado"
  | "encerrado";

export function situacaoDoPagamento(
  pagamento: Pick<PagamentoMp, "status">,
): SituacaoPagamento {
  switch (pagamento.status) {
    case "approved":
      return "aprovado";
    case "in_process":
    case "in_mediation":
      return "analise";
    case "rejected":
      return "recusado";
    case "cancelled":
    case "refunded":
    case "charged_back":
      return "encerrado";
    default:
      // pending, authorized e qualquer status novo: seguimos esperando.
      return "pendente";
  }
}

const MENSAGENS_RECUSA: Record<string, string> = {
  cc_rejected_insufficient_amount: "Saldo insuficiente no cartão.",
  cc_rejected_bad_filled_card_number: "Confira o número do cartão.",
  cc_rejected_bad_filled_date: "Confira a validade do cartão.",
  cc_rejected_bad_filled_security_code: "Confira o código de segurança.",
  cc_rejected_bad_filled_other: "Confira os dados do cartão.",
  cc_rejected_call_for_authorize:
    "O banco pediu autorização. Fale com ele ou use outro cartão.",
  cc_rejected_card_disabled: "Cartão desabilitado. Ligue para o banco ou use outro.",
  cc_rejected_high_risk:
    "Não foi possível aprovar por segurança. Tente o Pix ou outro cartão.",
};

/** Mensagem simples para recusa de cartão. Nunca expõe detalhes internos. */
export function mensagemDeRecusa(statusDetail: string | null): string {
  return (
    (statusDetail && MENSAGENS_RECUSA[statusDetail]) ||
    "O cartão não foi aprovado. Tente outro cartão ou pague com Pix."
  );
}
