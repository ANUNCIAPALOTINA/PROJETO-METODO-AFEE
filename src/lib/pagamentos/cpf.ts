/** Funções puras de CPF. Sem dependências, seguras para servidor e navegador. */

export function somenteDigitos(texto: string): string {
  return texto.replace(/\D/g, "");
}

function digitoVerificador(base: string): number {
  // Pesos: base.length + 1 até 2. Ex.: 10..2 para os 9 primeiros dígitos.
  let soma = 0;
  for (let i = 0; i < base.length; i++) {
    soma += Number(base[i]) * (base.length + 1 - i);
  }
  const resto = (soma * 10) % 11;
  return resto === 10 ? 0 : resto;
}

/** Valida os 11 dígitos e os dois dígitos verificadores. Aceita máscara. */
export function validarCpf(texto: string): boolean {
  const cpf = somenteDigitos(texto);
  if (cpf.length !== 11) return false;
  // 111.111.111-11 e afins passam na conta, mas não existem.
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  const d1 = digitoVerificador(cpf.slice(0, 9));
  if (d1 !== Number(cpf[9])) return false;
  const d2 = digitoVerificador(cpf.slice(0, 10));
  return d2 === Number(cpf[10]);
}

/** Máscara para digitar: "12345678909" vira "123.456.789-09" (aceita parcial). */
export function formatarCpf(texto: string): string {
  const d = somenteDigitos(texto).slice(0, 11);
  const partes = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 9)].filter(Boolean);
  let saida = partes.join(".");
  if (d.length > 9) saida += `-${d.slice(9)}`;
  return saida;
}
