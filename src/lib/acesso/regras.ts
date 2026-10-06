// Regras PURAS do controle de acesso (sem rede, sem banco): fáceis de testar.
// Quem fala com o Supabase é src/lib/acesso/index.ts.

/** Linha da tabela `acessos`. As datas chegam como texto ISO (timestamptz) ou Date. */
export type Acesso = {
  email: string;
  concedido_em: string | Date;
  /** Nulo = acesso vitalício. */
  expira_em: string | Date | null;
  /** Preenchido = acesso revogado (ex.: reembolso). */
  revogado_em: string | Date | null;
  origem_payment_id: string | null;
};

/** Minúsculo e sem espaços nas pontas: é como o e-mail é gravado e comparado. */
export function normalizarEmail(email: string): string {
  return email.trim().toLowerCase();
}

function paraMs(data: string | Date): number {
  return (data instanceof Date ? data : new Date(data)).getTime();
}

/**
 * Diz se o acesso vale agora.
 * - sem registro: não;
 * - revogado: não (mesmo que ainda não tenha expirado);
 * - expira_em nulo: sim (vitalício);
 * - expira_em no passado ou exatamente agora: não;
 * - data inválida: não (falha fechada).
 */
export function temAcessoAtivo(
  acesso: Pick<Acesso, "expira_em" | "revogado_em"> | null | undefined,
  agora: Date = new Date(),
): boolean {
  if (!acesso) return false;
  if (acesso.revogado_em != null) return false;
  if (acesso.expira_em == null) return true;
  const expiraMs = paraMs(acesso.expira_em);
  if (Number.isNaN(expiraMs)) return false;
  return expiraMs > agora.getTime();
}
