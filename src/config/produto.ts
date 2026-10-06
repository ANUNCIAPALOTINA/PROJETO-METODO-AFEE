/**
 * Dados do produto. FONTE ÚNICA: a página de vendas, o checkout e a cobrança
 * no Mercado Pago leem o preço daqui. Para mudar o preço, mude só este arquivo.
 */
export const produto = {
  nome: "Método AFEE",
  subtitulo: "Calistenia com direção",
  autor: {
    nome: "João",
    apelido: "Garlet",
    exibicao: "João “Garlet”",
  },
  /** Em centavos, número inteiro, para nunca haver erro de arredondamento. */
  precoCentavos: 1618,
  moeda: "BRL",
  garantiaDias: 7,
  /** PENDENTE: trocar pelo e-mail real de suporte antes de vender. */
  suporteEmail: "suporte@exemplo.com",
} as const;

function validarCentavos(centavos: number): void {
  if (!Number.isInteger(centavos) || centavos < 0) {
    throw new Error(
      `Preço inválido: ${centavos}. Use um número inteiro de centavos, maior ou igual a zero.`,
    );
  }
}

const formatadorBRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: produto.moeda,
});

/** Texto do preço para a tela. Ex.: 1618 vira "R$ 16,18". */
export function formatarPreco(centavos: number): string {
  validarCentavos(centavos);
  return formatadorBRL.format(centavos / 100);
}

/** Valor em reais para enviar ao Mercado Pago. Ex.: 1618 vira 16.18. */
export function precoParaGateway(centavos: number): number {
  validarCentavos(centavos);
  return Number((centavos / 100).toFixed(2));
}

export const precoFormatado = formatarPreco(produto.precoCentavos);
