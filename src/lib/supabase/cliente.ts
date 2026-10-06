import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase do navegador (Client Components), com a chave publicável.
 * Só enxerga o que o RLS permite. NUNCA use a service role aqui.
 * Importante: as variáveis NEXT_PUBLIC_* precisam ser lidas por nome literal
 * para o Next embutir o valor no bundle.
 */
export function criarClienteNavegador() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !chave) {
    throw new Error(
      "Faltam NEXT_PUBLIC_SUPABASE_URL e/ou NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }
  return createBrowserClient(url, chave);
}
