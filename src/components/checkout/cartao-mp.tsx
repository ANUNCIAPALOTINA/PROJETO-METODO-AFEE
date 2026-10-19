"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { precoParaGateway, produto } from "@/config/produto";
import {
  ID_DOCUMENTO_CARDFORM,
  TIPO_DOCUMENTO_CARDFORM,
  causaDoErro,
  mensagemFalhaTokenizacao,
  numeroDocumentoCardform,
  sincronizarCpfCardform,
  type DadosBrutosCartao,
} from "@/lib/pagamentos/cardform";
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
  getCardFormData(): DadosCartaoTokenizado & DadosBrutosCartao;
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

const estiloCampoSeguro = {
  color: "#f5f3ef",
  fontFamily: "Inter, sans-serif",
  fontSize: "17px",
  placeholderColor: "#a7a39b",
};

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
  cpf,
  cpfValido,
  aoTokenizar,
  aoFalhar,
  aoFalharCpf,
}: {
  formId: string;
  cpf: string;
  /** CPF válido hoje? Decide se a falha de tokenização vira erro de CPF ou de cartão. */
  cpfValido: boolean;
  aoTokenizar: (dados: DadosCartaoTokenizado) => void;
  aoFalhar: (mensagem: string) => void;
  aoFalharCpf: () => void;
}) {
  const [sdkPronto, setSdkPronto] = useState(
    () => typeof window !== "undefined" && !!window.MercadoPago,
  );
  const [carregando, setCarregando] = useState(true);
  const [indisponivel, setIndisponivel] = useState(!CHAVE_PUBLICA);

  const callbacks = useRef({ aoTokenizar, aoFalhar, aoFalharCpf, cpfValido });
  useEffect(() => {
    callbacks.current = { aoTokenizar, aoFalhar, aoFalharCpf, cpfValido };
  });

  /**
   * Falha de tokenização. Sem CPF válido, o SDK não tokeniza por causa do
   * documento: o erro é do CPF, não do cartão (era o defeito do campo errado).
   * Quando houver erro, extrai a causa real que o SDK entregou (message/cause/
   * error/status, inclusive array) em vez de achar só o que o SDK reconheceu
   * nos campos — portado do Bela Gestão (pagamento.js:940-960).
   */
  function falhaNaTokenizacao(dados: DadosBrutosCartao | null | undefined, erroDoSdk?: unknown) {
    if (!callbacks.current.cpfValido) {
      callbacks.current.aoFalharCpf();
      return;
    }
    const causa = causaDoErro(erroDoSdk);
    if (causa) {
      try {
        console.warn("[afee][cartao] tokenização recusada: " + causa);
      } catch {
        /* console indisponível */
      }
      callbacks.current.aoFalhar("Motivo do Mercado Pago: " + causa);
      return;
    }
    try {
      console.warn("[afee][cartao] tokenização recusada sem causa textual (erro do SDK sem descrição reconhecida).");
    } catch {
      /* console indisponível */
    }
    callbacks.current.aoFalhar(mensagemFalhaTokenizacao(dados));
  }

  function registrarDiagnostico(etapa: string, erro?: unknown) {
    void fetch("/api/diagnostico-cartao", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ etapa, erro: erro ? causaDoErro(erro) : undefined }), keepalive: true }).catch(() => undefined);
  }

  useEffect(() => {
    if (!sdkPronto || !CHAVE_PUBLICA || !window.MercadoPago) return;
    const campoCpf = document.getElementById("cpf");
    const sincronizar = () => sincronizarCpfCardform(document);
    campoCpf?.addEventListener("input", sincronizar);
    campoCpf?.addEventListener("change", sincronizar);
    sincronizar();
    let cardForm: CardFormMp | null = null;
    try {
      const mp = new window.MercadoPago(CHAVE_PUBLICA, { locale: "pt-BR" });
      cardForm = mp.cardForm({
        amount: String(precoParaGateway(produto.precoCentavos)),
        iframe: true,
        form: {
          id: formId,
          cardNumber: {
            id: ID.numero,
            placeholder: "Número do cartão",
            style: estiloCampoSeguro,
          },
          expirationDate: {
            id: ID.validade,
            placeholder: "MM/AA",
            style: estiloCampoSeguro,
          },
          securityCode: { id: ID.cvv, placeholder: "CVV", style: estiloCampoSeguro },
          cardholderName: { id: ID.titular, placeholder: "Nome como no cartão" },
          issuer: { id: ID.emissor, placeholder: "Banco emissor" },
          installments: { id: ID.parcelas, placeholder: "Parcelas" },
          identificationType: { id: ID.tipoDoc },
          identificationNumber: { id: ID_DOCUMENTO_CARDFORM },
        },
        callbacks: {
          onFormMounted: (erro: unknown) => {
            registrarDiagnostico("formulario_montado", erro);
            if (erro) setIndisponivel(true);
            setCarregando(false);
          },
          onSubmit: (evento: Event) => {
            evento.preventDefault();
            const espelho = document.getElementById(ID_DOCUMENTO_CARDFORM);
            if (espelho instanceof HTMLInputElement) espelho.value = sincronizarCpfCardform(document);
            registrarDiagnostico("clique_tokenizacao");
            const dados = cardForm?.getCardFormData();
            if (!dados?.token) {
              falhaNaTokenizacao(dados);
              return;
            }
            callbacks.current.aoTokenizar(dados);
          },
          /**
           * O SDK avisa aqui o resultado de CADA tokenização (portado do Bela
           * Gestão, `pagamento.js:630-635`). Sem este callback, o erro da
           * tokenização morre no console e a pessoa fica sem resposta: era
           * exatamente o travamento em "Processando…". O `onError` geral não
           * substitui este — ele não é chamado quando só a tokenização falha.
           */
          onCardTokenReceived: (erro: unknown) => {
            if (!erro) return; // sem erro: o token chegou; quem trata é o onSubmit
            registrarDiagnostico("erro_sdk", erro);
            falhaNaTokenizacao(cardForm?.getCardFormData(), erro);
          },
          onError: (erro: unknown) => {
            const campo = erro && typeof erro === "object" && "field" in erro ? String((erro as { field?: unknown }).field) : "";
            if (campo === "onFormMounted" || campo === "onFormUnmounted") return;
            registrarDiagnostico("erro_sdk", erro);
            falhaNaTokenizacao(cardForm?.getCardFormData(), erro);
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
      campoCpf?.removeEventListener("input", sincronizar);
      campoCpf?.removeEventListener("change", sincronizar);
      try {
        cardForm?.unmount();
      } catch {
        // já desmontado
      }
    };
  }, [sdkPronto, formId]);

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
      <select
        id={ID.tipoDoc}
        name="tipoDoc"
        className="sr-only"
        aria-hidden="true"
        defaultValue={TIPO_DOCUMENTO_CARDFORM}
      >
        <option value={TIPO_DOCUMENTO_CARDFORM}>CPF</option>
      </select>
      {/* O SDK recebe apenas dígitos; o campo visível mantém a máscara brasileira. */}
      <input
        id={ID_DOCUMENTO_CARDFORM}
        name={ID_DOCUMENTO_CARDFORM}
        value={numeroDocumentoCardform(cpf)}
        readOnly
        tabIndex={-1}
        className="sr-only"
      />

      <p className="text-sm text-muted-foreground">
        Os dados do cartão vão direto para o Mercado Pago. Nós não guardamos
        nem vemos o número do seu cartão.
      </p>
    </div>
  );
}
