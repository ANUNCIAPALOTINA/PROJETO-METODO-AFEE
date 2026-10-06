"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { precoParaGateway, produto } from "@/config/produto";
import { classeCampo } from "./campo";

/** Dados que o SDK devolve depois de tokenizar o cartão (sem número nem CVV). */
export type DadosCartaoTokenizado = {
  token: string;
  paymentMethodId: string;
  issuerId: string;
  installments: string;
};

type CardFormMp = {
  unmount(): void;
  getCardFormData(): DadosCartaoTokenizado;
};

type MercadoPagoMp = {
  cardForm(configuracao: unknown): CardFormMp;
};

declare global {
  interface Window {
    MercadoPago?: new (
      chavePublica: string,
      opcoes?: { locale?: string },
    ) => MercadoPagoMp;
  }
}

/** Ids dos elementos do formulário que o SDK do Mercado Pago preenche. */
const ID = {
  numero: "mp-numero",
  validade: "mp-validade",
  cvv: "mp-cvv",
  titular: "mp-titular",
  emissor: "mp-emissor",
  parcelas: "mp-parcelas",
  tipoDoc: "mp-tipo-doc",
} as const;

const CHAVE_PUBLICA = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;

const classeIframe =
  "h-12 w-full rounded-[2px] border border-input bg-card px-3 [&>iframe]:h-full";

/**
 * Campos do cartão. Número, validade e CVV ficam em iframes do Mercado Pago
 * ("secure fields"): o nosso código e o nosso servidor nunca os veem.
 * O SDK só devolve um token de uso único, que enviamos ao servidor.
 *
 * O CPF do titular é o mesmo campo "cpf" do formulário (idCpf).
 * O valor passado ao SDK serve só para calcular parcelas na tela; quem decide
 * o valor cobrado é o servidor.
 */
export function CamposCartao({
  formId,
  idCpf,
  aoTokenizar,
  aoFalhar,
}: {
  formId: string;
  idCpf: string;
  aoTokenizar: (dados: DadosCartaoTokenizado) => void;
  aoFalhar: (mensagem: string) => void;
}) {
  const [sdkPronto, setSdkPronto] = useState(
    () => typeof window !== "undefined" && !!window.MercadoPago,
  );
  const [carregando, setCarregando] = useState(true);
  const [indisponivel, setIndisponivel] = useState(!CHAVE_PUBLICA);

  const callbacks = useRef({ aoTokenizar, aoFalhar });
  useEffect(() => {
    callbacks.current = { aoTokenizar, aoFalhar };
  });

  useEffect(() => {
    if (!sdkPronto || !CHAVE_PUBLICA || !window.MercadoPago) return;
    let cardForm: CardFormMp | null = null;
    try {
      const mp = new window.MercadoPago(CHAVE_PUBLICA, { locale: "pt-BR" });
      cardForm = mp.cardForm({
        amount: String(precoParaGateway(produto.precoCentavos)),
        iframe: true,
        form: {
          id: formId,
          cardNumber: { id: ID.numero, placeholder: "Número do cartão" },
          expirationDate: { id: ID.validade, placeholder: "MM/AA" },
          securityCode: { id: ID.cvv, placeholder: "CVV" },
          cardholderName: { id: ID.titular, placeholder: "Nome como no cartão" },
          issuer: { id: ID.emissor, placeholder: "Banco emissor" },
          installments: { id: ID.parcelas, placeholder: "Parcelas" },
          identificationType: { id: ID.tipoDoc },
          identificationNumber: { id: idCpf },
        },
        callbacks: {
          onFormMounted: (erro: unknown) => {
            if (erro) setIndisponivel(true);
            setCarregando(false);
          },
          onSubmit: (evento: Event) => {
            evento.preventDefault();
            const dados = cardForm?.getCardFormData();
            if (!dados?.token) {
              callbacks.current.aoFalhar(
                "Confira os dados do cartão e tente de novo.",
              );
              return;
            }
            callbacks.current.aoTokenizar(dados);
          },
          onError: () => {
            callbacks.current.aoFalhar(
              "Confira os dados do cartão e tente de novo.",
            );
          },
        },
      });
    } catch {
      // Falha ao montar o formulário: o efeito de ajuste abaixo avisa a pessoa.
      queueMicrotask(() => {
        setIndisponivel(true);
        setCarregando(false);
      });
    }
    return () => {
      try {
        cardForm?.unmount();
      } catch {
        // já desmontado
      }
    };
  }, [sdkPronto, formId, idCpf]);

  if (indisponivel) {
    return (
      <p role="alert" className="text-destructive">
        Não conseguimos carregar o pagamento por cartão agora. Pague com Pix ou
        tente de novo em alguns minutos.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5" aria-busy={carregando}>
      <Script
        src="https://sdk.mercadopago.com/js/v2"
        strategy="afterInteractive"
        onReady={() => setSdkPronto(true)}
        onError={() => setIndisponivel(true)}
      />

      <div className="flex flex-col gap-2">
        <label htmlFor={ID.numero} className="text-[15px] font-medium">
          Número do cartão
        </label>
        <div id={ID.numero} className={classeIframe} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor={ID.validade} className="text-[15px] font-medium">
            Validade
          </label>
          <div id={ID.validade} className={classeIframe} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={ID.cvv} className="text-[15px] font-medium">
            Código de segurança
          </label>
          <div id={ID.cvv} className={classeIframe} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={ID.titular} className="text-[15px] font-medium">
          Nome do titular, como no cartão
        </label>
        <input
          id={ID.titular}
          name="titular"
          autoComplete="cc-name"
          className={classeCampo}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor={ID.emissor} className="text-[15px] font-medium">
            Banco emissor
          </label>
          <select id={ID.emissor} name="emissor" className={classeCampo} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={ID.parcelas} className="text-[15px] font-medium">
            Parcelas
          </label>
          <select id={ID.parcelas} name="parcelas" className={classeCampo} />
        </div>
      </div>

      {/* O SDK exige o tipo de documento; o número é o campo CPF acima. */}
      <select id={ID.tipoDoc} name="tipoDoc" hidden defaultValue="CPF" />

      <p className="text-sm text-muted-foreground">
        Os dados do cartão vão direto para o Mercado Pago. Nós não guardamos
        nem vemos o número do seu cartão.
      </p>
    </div>
  );
}
