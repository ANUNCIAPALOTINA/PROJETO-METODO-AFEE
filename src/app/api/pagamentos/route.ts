import { criarPagamento } from "@/lib/pagamentos/operacoes";

// Netlify: o tempo máximo de execução de funções varia conforme o plano.
// 60s é o teto comum em planos pagos; ajuste no painel se o plano permitir mais.
export const maxDuration = 60;

export async function POST(req: Request) {
  return criarPagamento(req);
}
