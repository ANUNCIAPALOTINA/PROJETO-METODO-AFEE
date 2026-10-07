/**
 * Guarda o e-mail do comprador só na aba (sessionStorage) para a tela de
 * obrigado levar a pessoa a /entrar sem pôr o e-mail na URL.
 */
const CHAVE = "afee:email-pedido";

export function guardarEmailPedido(email: string): void {
  try {
    sessionStorage.setItem(CHAVE, email);
  } catch {
    // Armazenamento bloqueado: segue sem o e-mail preenchido.
  }
}

export function lerEmailPedido(): string | null {
  try {
    return sessionStorage.getItem(CHAVE);
  } catch {
    return null;
  }
}
