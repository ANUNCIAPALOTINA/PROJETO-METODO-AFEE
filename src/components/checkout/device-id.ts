"use client";

/**
 * Device ID do Mercado Pago (recomendação de aprovação).
 *
 * A página carrega `https://www.mercadopago.com/v2/security.js` com
 * `view="checkout"`. Quando ele termina de rodar, cria a variável global
 * `MP_DEVICE_SESSION_ID` e, se existir um elemento com `id="deviceId"`,
 * escreve o valor nele. Lemos os dois porque a ordem de carregamento não é
 * garantida; o valor é lido no momento do envio, não no carregamento da página.
 *
 * O valor NÃO é segredo e não identifica a pessoa: é um número de dispositivo
 * usado pelo antifraude do MP. Sem ele a compra continua funcionando.
 */
export function lerDeviceId(): string | undefined {
  if (typeof window === "undefined") return undefined;

  const global = (window as Window & { MP_DEVICE_SESSION_ID?: unknown })
    .MP_DEVICE_SESSION_ID;
  const daVariavel = typeof global === "string" ? global.trim() : "";
  if (daVariavel) return daVariavel;

  const campo = document.getElementById("deviceId");
  const doCampo = campo instanceof HTMLInputElement ? campo.value.trim() : "";
  return doCampo || undefined;
}
