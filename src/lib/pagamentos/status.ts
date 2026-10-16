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

/**
 * Mensagens por `status_detail`. Todo detalhe conhecido do gateway tem entrada
 * aqui; a frase genérica do fim só vale para detalhe que o MP criar e nós ainda
 * não conhecermos.
 */
const MENSAGENS_RECUSA: Record<string, string> = {
  cc_rejected_insufficient_amount: "Saldo insuficiente no cartão.",
  cc_rejected_bad_filled_card_number: "Confira o número do cartão.",
  cc_rejected_bad_filled_date: "Confira a validade do cartão.",
  cc_rejected_bad_filled_security_code: "Confira o código de segurança.",
  cc_rejected_bad_filled_other: "Confira os dados do cartão.",
  cc_rejected_invalid_installments:
    "Este cartão não aceita o número de parcelas escolhido. Pague em 1 parcela ou use outro cartão.",
  cc_rejected_call_for_authorize:
    "O banco pediu autorização. Fale com ele ou use outro cartão.",
  cc_rejected_card_disabled: "Cartão desabilitado. Ligue para o banco ou use outro.",
  cc_rejected_high_risk:
    "Não foi possível aprovar por segurança. Tente o Pix ou outro cartão.",
  cc_rejected_max_attempts:
    "Muitas tentativas com este cartão. Espere alguns minutos ou use outro cartão.",
  cc_rejected_3ds_challenge:
    "A autenticação do cartão não foi concluída. Tente de novo ou use outro cartão.",
  cc_rejected_blacklist:
    "O banco bloqueou este pagamento por segurança. Fale com o banco ou use outro cartão.",
  cc_rejected_card_type_not_allowed:
    "Este tipo de cartão não é aceito. Use um cartão de crédito ou pague com Pix.",
  cc_rejected_other_reason:
    "O banco não autorizou o pagamento. Tente outro cartão ou pague com Pix.",
  cc_rejected_duplicated_payment:
    "Já existe um pagamento igual em andamento. Se você não reconhece, fale com o suporte.",
};

/** Mensagem simples para recusa de cartão. Nunca expõe detalhes internos. */
export function mensagemDeRecusa(statusDetail: string | null): string {
  return (
    (statusDetail && MENSAGENS_RECUSA[statusDetail]) ||
    "O cartão não foi aprovado. Tente outro cartão ou pague com Pix."
  );
}

/** Pagamento que não foi recusado pelo banco, mas não vale mais (cancelado, estornado). */
export const MENSAGEM_ENCERRADO =
  "Este pagamento não está mais ativo (cancelado ou estornado). Tente de novo ou pague com Pix.";
