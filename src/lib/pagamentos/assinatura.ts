import { createHmac, timingSafeEqual } from "node:crypto";

/** HMAC-SHA256 em hexadecimal minúsculo. */
export function hmacSha256Hex(segredo: string, mensagem: string): string {
  return createHmac("sha256", segredo).update(mensagem).digest("hex");
}

/** Lê o header x-signature: "ts=1742505638683,v1=<hex>". */
export function lerAssinatura(
  header: string | null | undefined,
): { ts: string; v1: string } | null {
  if (!header) return null;
  let ts = "";
  let v1 = "";
  for (const parte of header.split(",")) {
    const igual = parte.indexOf("=");
    if (igual < 0) continue;
    const chave = parte.slice(0, igual).trim();
    const valor = parte.slice(igual + 1).trim();
    if (chave === "ts") ts = valor;
    if (chave === "v1") v1 = valor;
  }
  return ts && v1 ? { ts, v1 } : null;
}

/**
 * Manifesto assinado pelo Mercado Pago:
 * `id:<data.id>;request-id:<x-request-id>;ts:<ts>;`
 * Se o MP não enviou algum valor, a parte correspondente sai do manifesto.
 * Se o data.id for alfanumérico, entra em minúsculas.
 */
export function montarManifesto(dados: {
  dataId?: string | null;
  requestId?: string | null;
  ts: string;
}): string {
  let manifesto = "";
  if (dados.dataId) {
    const id = /^[a-z0-9]+$/i.test(dados.dataId)
      ? dados.dataId.toLowerCase()
      : dados.dataId;
    manifesto += `id:${id};`;
  }
  if (dados.requestId) manifesto += `request-id:${dados.requestId};`;
  manifesto += `ts:${dados.ts};`;
  return manifesto;
}

/** Comparação em tempo constante de dois hex. Tamanhos diferentes: false. */
function hexIguais(a: string, b: string): boolean {
  if (!/^[0-9a-f]+$/i.test(a) || !/^[0-9a-f]+$/i.test(b)) return false;
  const bufA = Buffer.from(a, "hex");
  const bufB = Buffer.from(b, "hex");
  if (bufA.length !== bufB.length || bufA.length === 0) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Verifica a assinatura do webhook. Sem segredo ou header: sempre false. */
export function verificarAssinatura(entrada: {
  segredo: string | undefined;
  xSignature: string | null | undefined;
  xRequestId: string | null | undefined;
  dataId: string | null | undefined;
}): boolean {
  if (!entrada.segredo) return false;
  const assinatura = lerAssinatura(entrada.xSignature);
  if (!assinatura) return false;
  const manifesto = montarManifesto({
    dataId: entrada.dataId,
    requestId: entrada.xRequestId,
    ts: assinatura.ts,
  });
  const esperado = hmacSha256Hex(entrada.segredo, manifesto);
  return hexIguais(esperado, assinatura.v1);
}
