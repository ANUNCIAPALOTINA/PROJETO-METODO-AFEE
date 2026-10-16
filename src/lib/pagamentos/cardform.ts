/**
 * Contrato do CardForm do MercadoPago.js — o que o SDK exige dos campos que
 * nós montamos. Fica isolado aqui para ser testável sem navegador: foi
 * exatamente esse contrato que quebrou o checkout (CPF com máscara entregue ao
 * `identificationNumber`), e nenhum teste de componente pegaria a regressão.
 */

import { somenteDigitos } from "./cpf";

/** Tipo de documento aceito pelo CardForm no Brasil. */
export const TIPO_DOCUMENTO_CARDFORM = "CPF";

/** Id do campo técnico (invisível) que o SDK lê como `identificationNumber`. */
export const ID_DOCUMENTO_CARDFORM = "mp-cpf";

/**
 * Valor entregue ao `identificationNumber` do CardForm.
 * O SDK exige SOMENTE DÍGITOS: com máscara (`123.456.789-09`) a tokenização
 * falha no navegador e nenhuma requisição chega ao backend.
 * O campo visível continua mascarado para quem digita.
 */
export function numeroDocumentoCardform(cpf: string): string {
  return somenteDigitos(cpf);
}

/** Trecho do retorno de `getCardFormData()` que interessa quando não há token. */
export type DadosBrutosCartao = {
  token?: string | null;
  paymentMethodId?: string | null;
};

/**
 * Mensagem para quando o SDK não devolveu token. O SDK não diz qual campo
 * falhou, então usamos o que ele conseguiu reconhecer: sem bandeira, o
 * problema está no número; com bandeira identificada, está na validade ou no
 * código de segurança. CPF/identificação é tratado antes, pelo formulário.
 */
export function mensagemFalhaTokenizacao(
  dados: DadosBrutosCartao | null | undefined,
): string {
  if (!dados?.paymentMethodId) {
    return "Confira o número do cartão e tente de novo.";
  }
  return "Confira a validade e o código de segurança do cartão.";
}
