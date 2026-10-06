import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Proxy (antigo middleware, renomeado no Next 16). Roda só em /ebook e /ebook/*.
// Função: renovar o cookie de sessão do Supabase e mandar quem não tem sessão
// para /entrar. A checagem do DIREITO de acesso (tabela `acessos`) NÃO é feita
// aqui: cada página chama obterAlunoComAcesso() (src/lib/acesso), que também
// protege Server Functions que o matcher do proxy não cobre.

function paraEntrar(request: NextRequest) {
  const resposta = NextResponse.redirect(new URL("/entrar", request.url));
  resposta.headers.set("Cache-Control", "private, no-store");
  return resposta;
}

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  // Sem configuração do Supabase, falha fechada: ninguém entra.
  if (!url || !chave) return paraEntrar(request);

  let resposta = NextResponse.next({ request });

  const supabase = createServerClient(url, chave, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesParaGravar, cabecalhos) {
        // Repassa o cookie renovado para a requisição (páginas) e para a resposta (navegador).
        cookiesParaGravar.forEach(({ name, value }) => request.cookies.set(name, value));
        resposta = NextResponse.next({ request });
        cookiesParaGravar.forEach(({ name, value, options }) =>
          resposta.cookies.set(name, value, options),
        );
        Object.entries(cabecalhos).forEach(([chaveCab, valor]) =>
          resposta.headers.set(chaveCab, valor),
        );
      },
    },
  });

  // getClaims valida o JWT e renova a sessão quando preciso. Não rode código entre
  // createServerClient e esta chamada.
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return paraEntrar(request);

  // Conteúdo pago e pessoal: nunca em cache compartilhado.
  resposta.headers.set("Cache-Control", "private, no-store");
  return resposta;
}

export const config = {
  matcher: ["/ebook", "/ebook/:path*"],
};
