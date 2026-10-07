import { NextResponse, type NextRequest } from "next/server";
import { criarClienteServidor } from "@/lib/supabase/servidor";

// Encerra a sessão. Só POST (um GET poderia ser disparado por link ou imagem de terceiros).
export async function POST(request: NextRequest) {
  // Barra POST vindo de outro site.
  const origem = request.headers.get("origin");
  if (origem && origem !== request.nextUrl.origin) {
    return new NextResponse("Origem não permitida.", { status: 403 });
  }

  const supabase = await criarClienteServidor();
  await supabase.auth.signOut();

  // 303: o navegador troca o POST por GET na página de destino.
  const resposta = NextResponse.redirect(new URL("/", request.url), 303);
  resposta.headers.set("Cache-Control", "private, no-store");
  return resposta;
}
