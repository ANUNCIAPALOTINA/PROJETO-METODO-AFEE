/** Mascaras para log. Nunca escreva e-mail, CPF ou cartão completos em log. */

/** "joao@exemplo.com" vira "j***@exemplo.com". */
export function mascararEmail(email: string | null | undefined): string {
  if (!email) return "(sem e-mail)";
  const arroba = email.lastIndexOf("@");
  if (arroba < 1) return "***";
  return `${email[0]}***${email.slice(arroba)}`;
}
