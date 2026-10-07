import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase com a service role: ignora o RLS e pode tudo.
 * Só para o servidor confiável (webhook de pagamento, concessão e revogação de acesso).
 * Nunca passe este cliente nem a chave para o navegador.
 */
export function criarClienteAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !chave) {
    throw new Error(
      "Faltam NEXT_PUBLIC_SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return createClient(url, chave, {
    // Servidor sem estado: não guarda sessão nem renova token.
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
