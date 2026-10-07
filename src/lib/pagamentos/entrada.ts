import { somenteDigitos, validarCpf } from "./cpf";

export type ErrosEntrada = Partial<
  Record<"nome" | "email" | "cpf" | "token" | "metodo", string>
>;

export type DadosComprador = {
  primeiroNome: string;
  sobrenome: string;
  nome: string;
  email: string;
  /** Só dígitos. */
  cpf: string;
};

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Valida o comprador. Usada no navegador (mensagens) e no servidor (verdade). */
export function validarComprador(entrada: {
  nome?: unknown;
  email?: unknown;
  cpf?: unknown;
}): { ok: true; dados: DadosComprador } | { ok: false; erros: ErrosEntrada } {
  const erros: ErrosEntrada = {};

  const nome =
    typeof entrada.nome === "string"
      ? entrada.nome.trim().replace(/\s+/g, " ")
      : "";
  const partes = nome.split(" ").filter(Boolean);
  if (partes.length < 2 || nome.length > 100) {
    erros.nome = "Informe nome e sobrenome.";
  }

  const email =
    typeof entrada.email === "string" ? entrada.email.trim().toLowerCase() : "";
  if (!REGEX_EMAIL.test(email) || email.length > 254) {
    erros.email = "Informe um e-mail válido.";
  }

  const cpfTexto = typeof entrada.cpf === "string" ? entrada.cpf : "";
  if (!validarCpf(cpfTexto)) {
    erros.cpf = "CPF inválido. Confira os 11 números.";
  }

  if (Object.keys(erros).length > 0) return { ok: false, erros };
  return {
    ok: true,
    dados: {
      primeiroNome: partes[0],
      sobrenome: partes.slice(1).join(" "),
      nome,
      email,
      cpf: somenteDigitos(cpfTexto),
    },
  };
}

export type PedidoPagamento =
  | { metodo: "pix"; comprador: DadosComprador; chave: string }
  | {
      metodo: "cartao";
      comprador: DadosComprador;
      chave: string;
      token: string;
      metodoPagamentoId: string;
      emissorId?: string;
      parcelas: number;
    };

const REGEX_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const REGEX_TOKEN = /^[A-Za-z0-9_-]{8,200}$/;
const REGEX_METODO_ID = /^[a-z0-9_]{2,40}$/;

/**
 * Valida o corpo de POST /api/pagamentos. NÃO existe campo de valor aqui:
 * o preço é decidido no servidor.
 */
export function validarPedido(
  corpo: unknown,
  gerarChave: () => string,
): { ok: true; pedido: PedidoPagamento } | { ok: false; erros: ErrosEntrada } {
  if (typeof corpo !== "object" || corpo === null) {
    return { ok: false, erros: { metodo: "Pedido inválido." } };
  }
  const c = corpo as Record<string, unknown>;

  const comprador = validarComprador(c);
  const erros: ErrosEntrada = comprador.ok ? {} : { ...comprador.erros };

  if (c.metodo !== "pix" && c.metodo !== "cartao") {
    erros.metodo = "Escolha Pix ou cartão.";
  }

  const chave =
    typeof c.chave === "string" && REGEX_UUID.test(c.chave)
      ? c.chave.toLowerCase()
      : gerarChave();

  if (c.metodo === "cartao") {
    if (typeof c.token !== "string" || !REGEX_TOKEN.test(c.token)) {
      erros.token = "Não foi possível ler os dados do cartão. Tente de novo.";
    }
    if (
      typeof c.metodoPagamentoId !== "string" ||
      !REGEX_METODO_ID.test(c.metodoPagamentoId)
    ) {
      erros.metodo = "Não foi possível identificar a bandeira do cartão.";
    }
  }

  if (!comprador.ok || Object.keys(erros).length > 0) {
    return { ok: false, erros };
  }

  if (c.metodo === "pix") {
    return {
      ok: true,
      pedido: { metodo: "pix", comprador: comprador.dados, chave },
    };
  }

  const parcelasBrutas = Number(c.parcelas ?? 1);
  const parcelas =
    Number.isInteger(parcelasBrutas) && parcelasBrutas >= 1 && parcelasBrutas <= 12
      ? parcelasBrutas
      : 1;
  const emissor =
    typeof c.emissorId === "string" || typeof c.emissorId === "number"
      ? String(c.emissorId)
      : undefined;

  return {
    ok: true,
    pedido: {
      metodo: "cartao",
      comprador: comprador.dados,
      chave,
      token: c.token as string,
      metodoPagamentoId: c.metodoPagamentoId as string,
      emissorId: emissor && /^\d{1,10}$/.test(emissor) ? emissor : undefined,
      parcelas,
    },
  };
}
