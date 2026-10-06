import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { criarClienteServidor } from "@/lib/supabase/servidor";

// Destino do link mágico. Aceita os dois formatos do Supabase:
// - ?code=...        (PKCE: o link só funciona no mesmo navegador que pediu);
// - ?token_hash=...&type=... (funciona também se o e-mail abrir em outro aparelho;
//   exige ajustar o modelo do e-mail no painel do Supabase).
// O destino é fixo (/ebook): não aceitamos `next` da URL, evitando redirecionamento aberto.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const tipo = searchParams.get("type") as EmailOtpType | null;

  const supabase = await criarClienteServidor();

  let deuCerto = false;
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    deuCerto = !error;
  } else if (tokenHash && tipo) {
    const { error } = await supabase.auth.verifyOtp({ type: tipo, token_hash: tokenHash });
    deuCerto = !error;
  }

  const destino = deuCerto ? "/ebook" : "/entrar?erro=link";
  const resposta = NextResponse.redirect(new URL(destino, request.url));
  resposta.headers.set("Cache-Control", "private, no-store");
  return resposta;
}
