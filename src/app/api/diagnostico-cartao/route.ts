import { NextResponse } from "next/server";

const ETAPAS = new Set(["clique_tokenizacao", "formulario_montado", "token_recebido", "erro_sdk"]);

export async function POST(request: Request) {
  try {
    const corpo = (await request.json()) as { etapa?: unknown; erro?: unknown };
    if (typeof corpo.etapa !== "string" || !ETAPAS.has(corpo.etapa)) {
      return NextResponse.json({ erro: "etapa_invalida" }, { status: 400 });
    }
    const erro = typeof corpo.erro === "string" ? corpo.erro.slice(0, 240) : undefined;
    console.info("[diagnostico-cartao]", { etapa: corpo.etapa, erro });
    return new Response(null, { status: 204 });
  } catch {
    return NextResponse.json({ erro: "corpo_invalido" }, { status: 400 });
  }
}