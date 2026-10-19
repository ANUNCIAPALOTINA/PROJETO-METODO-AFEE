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

/** Lê o CPF visível no DOM, inclusive quando o autofill não atualizou o React. */
export function sincronizarCpfCardform(documento: Pick<Document, "getElementById">): string {
  const campo = documento.getElementById("cpf");
  return numeroDocumentoCardform(campo && "value" in campo ? String(campo.value) : "");
}

/** Trecho do retorno de `getCardFormData()` que interessa quando não há token. */
export type DadosBrutosCartao = {
  token?: string | null;
  paymentMethodId?: string | null;
};

// ── Causa real do erro do SDK (portado do Bela Gestão, pagamento.js:840-960) ──

/** Limite de caracteres da causa exibida na tela. */
const CAUSA_MAX = 140;

/**
 * Coleta recursivamente as causas textuais que o SDK costuma entregar,
 * separando códigos/status (que não são CVV e não devem ser mascarados)
 * do texto descritivo.
 */
function coletarCausa(
  erro: unknown,
  nivel: number,
): { textos: string[]; codigos: string[] } {
  const out = { textos: [] as string[], codigos: [] as string[] };
  if (erro == null || nivel > 4) return out;
  const texto = (v: unknown) => {
    if (v == null) return;
    const t = String(v).replace(/\s+/g, " ").trim();
    if (t) out.textos.push(t);
  };
  const codigo = (v: unknown) => {
    if (v == null) return;
    const t = String(v).trim();
    if (t) out.codigos.push(t);
  };
  if (typeof erro === "string") {
    texto(erro);
    return out;
  }
  if (typeof erro === "number" || typeof erro === "boolean") {
    texto(String(erro));
    return out;
  }
  if (Array.isArray(erro)) {
    erro.forEach((item) => {
      const f = coletarCausa(item, nivel + 1);
      out.textos.push(...f.textos);
      out.codigos.push(...f.codigos);
    });
    return out;
  }
  if (typeof erro !== "object") return out;

  const obj = erro as Record<string, unknown>;
  texto(obj.message);
  if (typeof obj.error === "string") {
    texto(obj.error);
  } else if (obj.error && typeof obj.error === "object") {
    const f = coletarCausa(obj.error, nivel + 1);
    out.textos.push(...f.textos);
    out.codigos.push(...f.codigos);
  }
  texto(obj.detail);
  texto(obj.description);

  const cause = obj.cause;
  if (typeof cause === "string") {
    texto(cause);
  } else if (Array.isArray(cause)) {
    cause.forEach((c) => {
      if (c && typeof c === "object") {
        const co = c as Record<string, unknown>;
        texto(
          co.description ??
            co.message ??
            co.detail ??
            (typeof co.error === "string" ? co.error : ""),
        );
        codigo(co.code);
      } else {
        const f = coletarCausa(c, nivel + 1);
        out.textos.push(...f.textos);
        out.codigos.push(...f.codigos);
      }
    });
  } else if (cause && typeof cause === "object") {
    const co = cause as Record<string, unknown>;
    texto(co.description ?? co.message ?? co.detail);
    codigo(co.code);
  }

  if (obj.status != null) codigo("HTTP " + String(obj.status).trim());
  return out;
}

function juntarCausas(partes: string[]): string {
  const vistos: string[] = [];
  partes.forEach((p) => {
    const t = String(p == null ? "" : p).replace(/\s+/g, " ").trim();
    if (t && vistos.indexOf(t) === -1) vistos.push(t);
  });
  return vistos.join(" · ");
}

/**
 * A tela nunca mostra valor de campo do cartão. Mesmo assim, antes de exibir
 * o texto do provedor, varremos dois padrões sensíveis: número de cartão
 * (12+ dígitos seguidos) e o que pareça CVV (3–4 dígitos isolados).
 */
function sanitizarCausa(texto: string): string {
  let s = String(texto == null ? "" : texto).replace(/\s+/g, " ").trim();
  if (!s) return "";
  s = s.replace(/\d{12,}/g, "[numero omitido]");
  s = s.replace(/(^|[^\w])(\d{3,4})(?![\w])/g, (_m, pre: string) => pre + "[cvv omitido]");
  return s;
}

/**
 * Monta a causa final: descrição sanitizada + códigos/status, truncada em
 * ~140 caracteres. Portado do Bela Gestão (pagamento.js:922-934).
 */
export function causaDoErro(erro: unknown): string {
  if (erro == null) return "";
  const { textos, codigos } = coletarCausa(erro, 0);
  const partes: string[] = [];
  const descricao = sanitizarCausa(juntarCausas(textos));
  if (descricao) partes.push(descricao);
  const cod = juntarCausas(codigos);
  if (cod) partes.push("código " + cod);
  let s = partes.join(" · ");
  if (s.length > CAUSA_MAX) s = s.slice(0, CAUSA_MAX - 1).trimEnd() + "…";
  return s;
}

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