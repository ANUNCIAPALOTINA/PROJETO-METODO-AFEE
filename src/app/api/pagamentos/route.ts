import { criarPagamento } from "@/lib/pagamentos/operacoes";

export async function POST(req: Request) {
  return criarPagamento(req);
}
