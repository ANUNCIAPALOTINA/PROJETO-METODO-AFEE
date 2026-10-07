import "server-only";
import { criarClienteAdmin } from "@/lib/supabase/admin";
import { criarClienteServidor } from "@/lib/supabase/servidor";
import { normalizarEmail, temAcessoAtivo, type Acesso } from "./regras";

export { normalizarEmail, temAcessoAtivo } from "./regras";
export type { Acesso } from "./regras";

/**
 * Devolve o aluno logado SE ele tiver acesso ativo; senão null.
 * Chamar `cookies()` já torna a página dinâmica (nunca pré-renderizada).
 * Use getUser(), que confirma o token no servidor do Supabase, e não só o cookie.
 * O RLS deixa o aluno ler apenas a própria linha de `acessos`.
 */
export async function obterAlunoComAcesso(): Promise<{ email: string } | null> {
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.email) return null;

  const email = normalizarEmail(data.user.email);
  const { data: acesso, error: erroAcesso } = await supabase
    .from("acessos")
    .select("email, concedido_em, expira_em, revogado_em, origem_payment_id")
    .eq("email", email)
    .maybeSingle<Acesso>();
  if (erroAcesso || !acesso) return null;

  return temAcessoAtivo(acesso) ? { email } : null;
}

type OpcoesConcessao = {
  /** Valor pago, em centavos (só para registro em `compras`). */
  valorCentavos?: number;
  /** Fim do acesso. Omitido ou null = vitalício. */
  expiraEm?: Date | null;
};

/**
 * Concede (ou renova) o acesso depois de um pagamento aprovado. IDEMPOTENTE:
 * repetir o mesmo paymentId não duplica a compra nem mexe no acesso.
 * Também garante que o usuário exista no Supabase Auth, para o link mágico
 * chegar mesmo com `shouldCreateUser: false` em /entrar.
 * Só o servidor confiável (webhook) deve chamar, depois de confirmar o pagamento no gateway.
 */
export async function concederAcesso(
  email: string,
  paymentId: string,
  opcoes: OpcoesConcessao = {},
): Promise<void> {
  const emailNorm = normalizarEmail(email);
  const admin = criarClienteAdmin();

  // 1) Compra: o paymentId é único; se já existe, ignora (não duplica).
  const { error: erroCompra } = await admin.from("compras").upsert(
    {
      email: emailNorm,
      gateway_payment_id: paymentId,
      status: "aprovada",
      valor_centavos: opcoes.valorCentavos ?? null,
    },
    { onConflict: "gateway_payment_id", ignoreDuplicates: true },
  );
  if (erroCompra) throw new Error(`Falha ao registrar a compra: ${erroCompra.message}`);

  // 2) Acesso: se este pagamento já originou o acesso, não há nada a fazer.
  const { data: atual, error: erroLeitura } = await admin
    .from("acessos")
    .select("origem_payment_id")
    .eq("email", emailNorm)
    .maybeSingle();
  if (erroLeitura) throw new Error(`Falha ao ler o acesso: ${erroLeitura.message}`);
  if (atual?.origem_payment_id === paymentId) return;

  // Novo pagamento (primeira compra ou recompra): concede e limpa qualquer revogação.
  const { error: erroAcesso } = await admin.from("acessos").upsert(
    {
      email: emailNorm,
      concedido_em: new Date().toISOString(),
      expira_em: opcoes.expiraEm ? opcoes.expiraEm.toISOString() : null,
      revogado_em: null,
      origem_payment_id: paymentId,
    },
    { onConflict: "email" },
  );
  if (erroAcesso) throw new Error(`Falha ao conceder o acesso: ${erroAcesso.message}`);

  // 3) Usuário no Auth (confirmado, pois o pagamento já comprovou o e-mail). Se já existe, segue.
  const { error: erroUsuario } = await admin.auth.admin.createUser({
    email: emailNorm,
    email_confirm: true,
  });
  if (erroUsuario && erroUsuario.code !== "email_exists") {
    throw new Error(`Falha ao criar o usuário: ${erroUsuario.message}`);
  }
}

/**
 * Revoga o acesso (ex.: reembolso). IDEMPOTENTE e restrito ao pagamento:
 * só revoga se o acesso atual foi originado por este paymentId, então o
 * reembolso de uma compra antiga não derruba o acesso de uma compra mais nova.
 * Repetir a chamada não altera a data da revogação.
 */
export async function revogarAcesso(email: string, paymentId: string): Promise<void> {
  const emailNorm = normalizarEmail(email);
  const admin = criarClienteAdmin();

  const { error: erroCompra } = await admin
    .from("compras")
    .update({ status: "reembolsada" })
    .eq("gateway_payment_id", paymentId);
  if (erroCompra) throw new Error(`Falha ao atualizar a compra: ${erroCompra.message}`);

  const { error } = await admin
    .from("acessos")
    .update({ revogado_em: new Date().toISOString() })
    .eq("email", emailNorm)
    .eq("origem_payment_id", paymentId)
    .is("revogado_em", null);
  if (error) throw new Error(`Falha ao revogar o acesso: ${error.message}`);
}
