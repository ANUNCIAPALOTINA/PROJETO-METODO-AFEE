import { produto } from "@/config/produto";
import { concederAcesso } from "@/lib/acesso";
import { consultarStatus } from "@/lib/pagamentos/operacoes";

// No Next.js 16, `params` é uma Promise.
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  return consultarStatus(id, undefined, (email, paymentId) =>
    concederAcesso(email, paymentId, { valorCentavos: produto.precoCentavos }),
  );
}
