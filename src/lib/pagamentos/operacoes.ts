import { clienteMpDoAmbiente, type ClienteMp, type PagamentoMp } from "./cliente-mp";
import { PREFIXO_REFERENCIA } from "./constantes";
import { decidirPagamento } from "./decisao";
import { validarPedido } from "./entrada";
import { mascararEmail } from "./mascarar";
import {
  mensagemDeRecusa,
  situacaoDoPagamento,
  type SituacaoPagamento,
} from "./status";

const SEM_CACHE = { "Cache-Control": "no-store" } as const;

function json(status: number, corpo: Record<string, unknown>): Response {
  return Response.json(corpo, { status, headers: SEM_CACHE });
}

/** Cliente do ambiente, ou null se o token do MP não está configurado. */
function clienteOuNulo(): ClienteMp | null {
  try {
    return clienteMpDoAmbiente();
  } catch {
    console.error("[pagamentos] MERCADOPAGO_ACCESS_TOKEN não configurado");
    return null;
  }
}

/**
 * POST /api/pagamentos. O corpo traz só os dados do comprador (e o token do
 * cartão gerado no navegador). O VALOR é decidido em cliente-mp.ts.
 * Devolve ao navegador apenas o necessário.
 */
export async function criarPagamento(
  req: Request,
  cliente: ClienteMp | null = clienteOuNulo(),
): Promise<Response> {
  let corpo: unknown;
  try {
    corpo = await req.json();
  } catch {
    return json(400, { erro: "corpo_invalido" });
  }

  const validacao = validarPedido(corpo, () => crypto.randomUUID());
  if (!validacao.ok) return json(400, { erro: "dados_invalidos", erros: validacao.erros });
  const { pedido } = validacao;

  if (!cliente) return json(503, { erro: "pagamentos_indisponiveis" });

  const pagador = {
    email: pedido.comprador.email,
    primeiroNome: pedido.comprador.primeiroNome,
    sobrenome: pedido.comprador.sobrenome,
    cpf: pedido.comprador.cpf,
  };

  let pagamento: PagamentoMp;
  try {
    pagamento =
      pedido.metodo === "pix"
        ? await cliente.criarPagamentoPix(pagador, pedido.chave)
        : await cliente.criarPagamentoCartao(
            pagador,
            {
              token: pedido.token,
              metodoPagamentoId: pedido.metodoPagamentoId,
              emissorId: pedido.emissorId,
              parcelas: pedido.parcelas,
            },
            pedido.chave,
          );
  } catch (erro) {
    console.error("[pagamentos] falha ao criar pagamento", {
      metodo: pedido.metodo,
      email: mascararEmail(pedido.comprador.email),
      erro: erro instanceof Error ? erro.message : "desconhecido",
    });
    return json(502, {
      erro: "mp_indisponivel",
      mensagem:
        "Não conseguimos processar agora. Tente de novo em alguns minutos. Nada foi cobrado.",
    });
  }

  console.info("[pagamentos] criado", {
    pagamento: pagamento.id,
    metodo: pedido.metodo,
    status: pagamento.status,
    email: mascararEmail(pedido.comprador.email),
  });

  if (pedido.metodo === "pix") {
    if (!pagamento.pix) {
      return json(502, {
        erro: "pix_sem_qr",
        mensagem: "Não conseguimos gerar o Pix agora. Tente de novo.",
      });
    }
    return json(201, {
      metodo: "pix",
      id: pagamento.id,
      qrCode: pagamento.pix.qrCode,
      qrCodeBase64: pagamento.pix.qrCodeBase64,
    });
  }

  const situacao = situacaoDoPagamento(pagamento);
  return json(201, {
    metodo: "cartao",
    id: pagamento.id,
    situacao,
    ...(situacao === "recusado"
      ? { mensagem: mensagemDeRecusa(pagamento.statusDetail) }
      : {}),
  });
}

/**
 * GET /api/pagamentos/[id]/status. Consulta o MP e devolve só a situação.
 * Se o pagamento está aprovado, também concede o acesso (idempotente), como
 * reforço do webhook: a decisão vem do pagamento buscado no MP, nunca do navegador.
 */
export async function consultarStatus(
  id: string,
  cliente: ClienteMp | null = clienteOuNulo(),
  conceder?: (email: string, paymentId: string) => Promise<void>,
): Promise<Response> {
  if (!/^\d{1,20}$/.test(id)) return json(404, { erro: "nao_encontrado" });
  if (!cliente) return json(503, { erro: "pagamentos_indisponiveis" });

  let pagamento: PagamentoMp | null;
  try {
    pagamento = await cliente.buscarPagamento(id);
  } catch {
    return json(502, { erro: "mp_indisponivel" });
  }
  if (!pagamento || !pagamento.referenciaExterna?.startsWith(PREFIXO_REFERENCIA)) {
    return json(404, { erro: "nao_encontrado" });
  }

  let situacao: SituacaoPagamento = situacaoDoPagamento(pagamento);
  const decisao = decidirPagamento(pagamento);
  // Aprovado mas fora do que vendemos (valor/moeda): não anunciar sucesso.
  if (situacao === "aprovado" && decisao.acao !== "conceder") {
    situacao = "analise";
  }
  if (situacao === "aprovado" && conceder && pagamento.email) {
    try {
      await conceder(pagamento.email, pagamento.id);
    } catch (erro) {
      // O webhook ainda pode conceder; a tela segue mostrando o sucesso.
      console.error("[pagamentos] falha ao conceder pelo status", pagamento.id, erro);
    }
  }
  return json(200, { situacao });
}
