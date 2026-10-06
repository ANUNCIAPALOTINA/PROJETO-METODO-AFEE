import { produto, precoParaGateway } from "@/config/produto";
import { PIX_VALIDADE_HORAS, PREFIXO_REFERENCIA, URL_API_MP } from "./constantes";

/** Pagamento já normalizado a partir da resposta da API do Mercado Pago. */
export type PagamentoMp = {
  id: string;
  status: string;
  statusDetail: string | null;
  valor: number;
  moeda: string;
  referenciaExterna: string | null;
  email: string | null;
  valorReembolsado: number;
  pix: { qrCode: string; qrCodeBase64: string } | null;
};

export type Pagador = {
  email: string;
  primeiroNome: string;
  sobrenome: string;
  /** Só dígitos. */
  cpf: string;
};

export type ClienteMp = {
  criarPagamentoPix(
    pagador: Pagador,
    chaveIdempotencia: string,
  ): Promise<PagamentoMp>;
  criarPagamentoCartao(
    pagador: Pagador,
    cartao: {
      token: string;
      metodoPagamentoId: string;
      emissorId?: string;
      parcelas: number;
    },
    chaveIdempotencia: string,
  ): Promise<PagamentoMp>;
  /** null quando o pagamento não existe (404). Qualquer outra falha lança. */
  buscarPagamento(id: string): Promise<PagamentoMp | null>;
};

export class ErroMp extends Error {
  constructor(
    message: string,
    readonly status: number | null,
  ) {
    super(message);
    this.name = "ErroMp";
  }
}

type Json = Record<string, unknown>;

function ehObjeto(valor: unknown): valor is Json {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function texto(valor: unknown): string | null {
  return typeof valor === "string" && valor !== "" ? valor : null;
}

function numero(valor: unknown): number | null {
  return typeof valor === "number" && Number.isFinite(valor) ? valor : null;
}

/** Converte a resposta crua da API. Lança se faltar o essencial (id e status). */
export function normalizarPagamento(bruto: unknown): PagamentoMp {
  if (!ehObjeto(bruto)) throw new ErroMp("Resposta do MP inválida", null);
  const id =
    typeof bruto.id === "number" || typeof bruto.id === "string"
      ? String(bruto.id)
      : null;
  const status = texto(bruto.status);
  if (!id || !status) throw new ErroMp("Resposta do MP sem id ou status", null);

  const pagador = ehObjeto(bruto.payer) ? bruto.payer : {};
  const interacao = ehObjeto(bruto.point_of_interaction)
    ? bruto.point_of_interaction
    : {};
  const dadosPix = ehObjeto(interacao.transaction_data)
    ? interacao.transaction_data
    : {};
  const qrCode = texto(dadosPix.qr_code);
  const qrCodeBase64 = texto(dadosPix.qr_code_base64);

  return {
    id,
    status,
    statusDetail: texto(bruto.status_detail),
    valor: numero(bruto.transaction_amount) ?? Number.NaN,
    moeda: texto(bruto.currency_id) ?? "",
    referenciaExterna: texto(bruto.external_reference),
    email: texto(pagador.email)?.toLowerCase() ?? null,
    valorReembolsado: numero(bruto.transaction_amount_refunded) ?? 0,
    pix: qrCode && qrCodeBase64 ? { qrCode, qrCodeBase64 } : null,
  };
}

/** Data de expiração no formato do MP, em horário de Brasília (-03:00, sem horário de verão). */
export function dataExpiracaoPix(agora: Date = new Date()): string {
  const limite = new Date(agora.getTime() + PIX_VALIDADE_HORAS * 3_600_000);
  const brasilia = new Date(limite.getTime() - 3 * 3_600_000);
  return `${brasilia.toISOString().slice(0, 19)}.000-03:00`;
}

export type OpcoesClienteMp = {
  accessToken: string;
  /** Injetável para testar sem rede. */
  fetchImpl?: typeof fetch;
  baseUrl?: string;
  timeoutMs?: number;
};

export function criarClienteMp(opcoes: OpcoesClienteMp): ClienteMp {
  const fetchImpl = opcoes.fetchImpl ?? fetch;
  const baseUrl = opcoes.baseUrl ?? URL_API_MP;
  const timeoutMs = opcoes.timeoutMs ?? 10_000;

  async function chamar(
    metodo: "GET" | "POST",
    caminho: string,
    corpo?: Json,
    chaveIdempotencia?: string,
  ): Promise<{ status: number; json: unknown }> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${opcoes.accessToken}`,
      Accept: "application/json",
    };
    if (corpo) headers["Content-Type"] = "application/json";
    if (chaveIdempotencia) headers["X-Idempotency-Key"] = chaveIdempotencia;

    let resposta: Response;
    try {
      resposta = await fetchImpl(`${baseUrl}${caminho}`, {
        method: metodo,
        headers,
        body: corpo ? JSON.stringify(corpo) : undefined,
        cache: "no-store",
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch {
      // Sem a mensagem original: ela pode conter dados do pedido.
      throw new ErroMp("Falha de rede ao falar com o Mercado Pago", null);
    }
    let json: unknown = null;
    try {
      json = await resposta.json();
    } catch {
      json = null;
    }
    return { status: resposta.status, json };
  }

  function corpoBase(pagador: Pagador): Json {
    return {
      // O VALOR vem sempre do arquivo do produto, nunca do navegador.
      transaction_amount: precoParaGateway(produto.precoCentavos),
      description: produto.nome,
      external_reference: `${PREFIXO_REFERENCIA}${crypto.randomUUID()}`,
      payer: {
        email: pagador.email,
        first_name: pagador.primeiroNome,
        last_name: pagador.sobrenome,
        identification: { type: "CPF", number: pagador.cpf },
      },
    };
  }

  async function criar(
    corpo: Json,
    chaveIdempotencia: string,
  ): Promise<PagamentoMp> {
    const { status, json } = await chamar(
      "POST",
      "/v1/payments",
      corpo,
      chaveIdempotencia,
    );
    if (status < 200 || status >= 300) {
      const causa =
        ehObjeto(json) && texto(json.message) ? String(json.message) : "";
      throw new ErroMp(`MP recusou a criação do pagamento (${status}) ${causa}`.trim(), status);
    }
    return normalizarPagamento(json);
  }

  return {
    criarPagamentoPix(pagador, chaveIdempotencia) {
      return criar(
        {
          ...corpoBase(pagador),
          payment_method_id: "pix",
          date_of_expiration: dataExpiracaoPix(),
        },
        chaveIdempotencia,
      );
    },

    criarPagamentoCartao(pagador, cartao, chaveIdempotencia) {
      const corpo: Json = {
        ...corpoBase(pagador),
        token: cartao.token,
        installments: cartao.parcelas,
        payment_method_id: cartao.metodoPagamentoId,
      };
      if (cartao.emissorId) corpo.issuer_id = Number(cartao.emissorId);
      return criar(corpo, chaveIdempotencia);
    },

    async buscarPagamento(id) {
      if (!/^\d{1,20}$/.test(id)) return null;
      const { status, json } = await chamar("GET", `/v1/payments/${id}`);
      if (status === 404) return null;
      if (status < 200 || status >= 300) {
        throw new ErroMp(`MP respondeu ${status} ao buscar pagamento`, status);
      }
      return normalizarPagamento(json);
    },
  };
}

/** Cliente com o token do ambiente. Lança se a variável não existir. */
export function clienteMpDoAmbiente(): ClienteMp {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    throw new ErroMp("MERCADOPAGO_ACCESS_TOKEN não configurado", null);
  }
  return criarClienteMp({ accessToken });
}
