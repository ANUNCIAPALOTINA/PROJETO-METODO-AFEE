/** Endereço da API do Mercado Pago. */
export const URL_API_MP = "https://api.mercadopago.com";

/**
 * Prefixo do external_reference de todo pagamento criado por este site.
 * O webhook só concede/revoga acesso para pagamentos com este prefixo,
 * para que outras cobranças da mesma conta MP não mexam nos acessos.
 */
export const PREFIXO_REFERENCIA = "afee-";

/** Validade do Pix. O QR da tela e a data enviada ao MP usam este valor. */
export const PIX_VALIDADE_HORAS = 24;
