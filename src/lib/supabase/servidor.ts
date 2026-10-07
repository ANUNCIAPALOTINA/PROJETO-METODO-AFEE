import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente Supabase do servidor (Server Components, Server Actions e Route Handlers).
 * Usa a chave publicável + a sessão do aluno nos cookies, então o RLS vale.
 * Crie um cliente novo a cada requisição; não guarde em variável global.
 */
export async function criarClienteServidor() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !chave) {
    throw new Error(
      "Faltam NEXT_PUBLIC_SUPABASE_URL e/ou NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  // No Next 16, cookies() é assíncrono.
  const armazem = await cookies();

  return createServerClient(url, chave, {
    cookies: {
      getAll() {
        return armazem.getAll();
      },
      setAll(cookiesParaGravar) {
        try {
          cookiesParaGravar.forEach(({ name, value, options }) =>
            armazem.set(name, value, options),
          );
        } catch {
          // Em Server Components não dá para gravar cookie; tudo bem, porque o
          // proxy (src/proxy.ts) já renova a sessão antes de a página renderizar.
        }
      },
    },
  });
}
