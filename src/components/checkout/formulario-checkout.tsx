"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { precoFormatado } from "@/config/produto";
import { site } from "@/config/site";
import { formatarCpf, validarCpf } from "@/lib/pagamentos/cpf";
import {
  MSG_CPF_INVALIDO,
  validarComprador,
  type ErrosEntrada,
} from "@/lib/pagamentos/entrada";
import { Campo } from "./campo";
import { CamposCartao, type DadosCartaoTokenizado } from "./cartao-mp";
import { lerDeviceId } from "./device-id";
import { guardarEmailPedido } from "./email-pedido";
import { TelaPix, type PixGerado } from "./tela-pix";
import { useStatusPagamento, type SituacaoNavegador } from "./use-status-pagamento";

const ID_FORM = "form-checkout";
const ID_CPF = "cpf";
const ID_SCRIPT_SEGURANCA = "mp-security-js";

/**
 * Script de segurança do Mercado Pago: cria a variável global
 * `MP_DEVICE_SESSION_ID` e preenche o campo oculto `#deviceId`.
 * Injetado à mão (e não por `next/script`) porque o atributo `view` não existe
 * na tipagem do Next; sem ele o MP não sabe de qual seção veio o Device ID.
 * Carrega uma vez por página.
 */
function injetarScriptSeguranca() {
  if (document.getElementById(ID_SCRIPT_SEGURANCA)) return;
  const script = document.createElement("script");
  script.id = ID_SCRIPT_SEGURANCA;
  script.src = "https://www.mercadopago.com/v2/security.js";
  script.setAttribute("view", "checkout");
  script.async = true;
  document.head.appendChild(script);
}

type Metodo = "pix" | "cartao";

type RespostaApi = {
  erro?: string;
  erros?: ErrosEntrada;
  mensagem?: string;
  metodo?: Metodo;
  id?: string;
  situacao?: SituacaoNavegador;
  qrCode?: string;
  qrCodeBase64?: string;
};

const MSG_FALHA =
  "Não conseguimos processar agora. Tente de novo em alguns minutos. Nada foi cobrado.";

const MSG_RECUSA =
  "O cartão não foi aprovado. Tente outro cartão ou pague com Pix.";

/** Espera da confirmação de um cartão que ficou "em análise". */
function EsperaCartao({ id, aoAprovar }: { id: string; aoAprovar: () => void }) {
  useStatusPagamento(id, (situacao) => {
    if (situacao === "aprovado") aoAprovar();
  });
  return (
    <section
      aria-live="polite"
      className="rounded-[2px] border border-border bg-card p-6"
    >
      <h2 className="text-2xl">Pagamento em análise</h2>
      <p className="mt-3 text-muted-foreground">
        O banco está analisando seu pagamento. Esta tela atualiza sozinha e
        você também recebe um e-mail. Dúvidas?{" "}
        <Link href={site.rotas.suporte} className="text-primary underline underline-offset-4">
          Fale com o suporte
        </Link>
        .
      </p>
    </section>
  );
}

export function FormularioCheckout() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [metodo, setMetodo] = useState<Metodo>("pix");
  const [erros, setErros] = useState<ErrosEntrada>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [pix, setPix] = useState<PixGerado | null>(null);
  const [analise, setAnalise] = useState<string | null>(null);
  const [processandoCartao, setProcessandoCartao] = useState(false);

  // Chave de idempotência: igual enquanto a tentativa pode ser repetida
  // (ex.: queda de rede), nova depois de uma resposta definitiva.
  const chave = useRef<string | null>(null);
  // Trava de reentrada do cartão: dois cliques muito rápidos acontecem antes
  // de o React atualizar `processandoCartao`, então a trava é um ref.
  const emAndamento = useRef(false);

  useEffect(injetarScriptSeguranca, []);

  function novaChave() {
    chave.current = crypto.randomUUID();
  }

  function liberarCartao() {
    emAndamento.current = false;
    setProcessandoCartao(false);
  }

  function concluir() {
    guardarEmailPedido(email.trim().toLowerCase());
    router.push(site.rotas.obrigado);
  }

  function validarLocal(): boolean {
    const r = validarComprador({ nome, email, cpf });
    if (r.ok) {
      setErros({});
      return true;
    }
    setErros(r.erros);
    const primeiro = (["nome", "email", "cpf"] as const).find((c) => r.erros[c]);
    if (primeiro) document.getElementById(primeiro === "cpf" ? ID_CPF : primeiro)?.focus();
    return false;
  }

  async function criarPagamento(extra: Record<string, unknown>) {
    if (enviando) return;
    setEnviando(true);
    setErroGeral(null);
    chave.current ??= crypto.randomUUID();
    // Sem AbortController o fetch espera para sempre se a resposta não chegar
    // (função morta pelo tempo na Netlify, conexão pendurada): o botão fica
    // travado em "Processando…" sem nenhuma mensagem. 30s é abaixo do teto de
    // 60s da função, o que dá margem para o erro chegar ao usuário.
    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), 30_000);
    try {
      const resposta = await fetch("/api/pagamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          cpf,
          chave: chave.current,
          metodo,
          // Recomendação antifraude do MP. Fica de fora se o script de
          // segurança ainda não tiver gerado o valor.
          deviceId: lerDeviceId(),
          ...extra,
        }),
        signal: controlador.signal,
      });
      const dados = (await resposta.json().catch(() => ({}))) as RespostaApi;
      novaChave();

      if (resposta.status === 400 && dados.erros) {
        const { token, metodo: erroMetodo, ...camposDoForm } = dados.erros;
        setErros(camposDoForm);
        if (token || erroMetodo) setErroGeral(token ?? erroMetodo ?? MSG_FALHA);
        return;
      }
      // 402 = o banco não autorizou (ou o pagamento foi encerrado). Diferente
      // do 502 (falha técnica) e do 400 (dados inválidos).
      if (resposta.status === 402) {
        setErroGeral(dados.mensagem ?? MSG_RECUSA);
        return;
      }
      if (!resposta.ok || !dados.id) {
        setErroGeral(dados.mensagem ?? MSG_FALHA);
        return;
      }
      if (dados.metodo === "pix" && dados.qrCode && dados.qrCodeBase64) {
        setPix({ id: dados.id, qrCode: dados.qrCode, qrCodeBase64: dados.qrCodeBase64 });
        return;
      }
      if (dados.situacao === "aprovado") {
        concluir();
      } else if (dados.situacao === "recusado" || dados.situacao === "encerrado") {
        setErroGeral(dados.mensagem ?? MSG_RECUSA);
      } else {
        setAnalise(dados.id);
      }
    } catch (erro) {
      // Falha de rede: mantém a mesma chave de idempotência para repetir sem cobrar duas vezes.
      if (erro instanceof DOMException && erro.name === "AbortError") {
        setErroGeral(
          "Estamos com dificuldades para processar agora. Tente de novo em alguns minutos. Nada foi cobrado.",
        );
        return;
      }
      setErroGeral(MSG_FALHA);
    } finally {
      clearTimeout(temporizador);
      setEnviando(false);
    }
  }

  function aoEnviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // No cartão, quem trata o envio é o SDK (tokeniza e chama aoTokenizar).
    if (metodo !== "pix") return;
    if (!validarLocal()) return;
    void criarPagamento({});
  }

  /**
   * Cartão: barra o envio ANTES de o SDK tentar tokenizar quando o comprador
   * (nome, e-mail ou CPF) está inválido, para o erro aparecer no campo certo em
   * vez de virar "confira os dados do cartão". Também segura clique duplo.
   */
  function aoClicarEnviar(e: MouseEvent<HTMLButtonElement>) {
    if (metodo === "pix") return;
    if (emAndamento.current || !validarLocal()) {
      e.preventDefault();
      return;
    }
    emAndamento.current = true;
    setProcessandoCartao(true);
    setErroGeral(null);
  }

  function aoTokenizar(dados: DadosCartaoTokenizado) {
    if (!validarLocal()) {
      liberarCartao();
      return;
    }
    void criarPagamento({
      token: dados.token,
      metodoPagamentoId: dados.paymentMethodId,
      emissorId: dados.issuerId,
      parcelas: Number(dados.installments) || 1,
    }).finally(liberarCartao);
  }

  if (pix) {
    return (
      <div className="flex flex-col gap-4">
        <TelaPix pix={pix} aoAprovar={concluir} />
        <Button variant="ghost" className="h-12 self-start px-4" onClick={() => setPix(null)}>
          Voltar e escolher outra forma de pagamento
        </Button>
      </div>
    );
  }
  if (analise) return <EsperaCartao id={analise} aoAprovar={concluir} />;

  return (
    <form
      id={ID_FORM}
      onSubmit={aoEnviar}
      noValidate
      aria-busy={enviando}
      className="flex flex-col gap-6"
    >
      {/* O script de segurança (usarScriptSeguranca) escreve o Device ID aqui. */}
      <input type="hidden" id="deviceId" name="deviceId" />
      {erroGeral ? (
        <p role="alert" className="rounded-[2px] border border-destructive p-4 text-destructive">
          {erroGeral}
        </p>
      ) : null}

      <div className="flex flex-col gap-5">
        <Campo
          id="nome"
          name="nome"
          rotulo="Nome completo"
          autoComplete="name"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          erro={erros.nome}
          required
        />
        <Campo
          id="email"
          name="email"
          type="email"
          inputMode="email"
          rotulo="E-mail"
          autoComplete="email"
          dica="É nele que você recebe o acesso. Confira se está certo."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          erro={erros.email}
          required
        />
        <Campo
          id={ID_CPF}
          name="cpf"
          inputMode="numeric"
          rotulo="CPF"
          autoComplete="off"
          placeholder="000.000.000-00"
          dica="Exigido pelo Mercado Pago para emitir o pagamento."
          value={cpf}
          onChange={(e) => setCpf(formatarCpf(e.target.value))}
          erro={erros.cpf}
          maxLength={14}
          required
        />
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-[15px] font-medium">Forma de pagamento</legend>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              ["pix", "Pix"],
              ["cartao", "Cartão"],
            ] as const
          ).map(([valor, rotulo]) => (
            <label
              key={valor}
              className="flex min-h-12 cursor-pointer items-center justify-center rounded-[2px] border border-input bg-card px-4 py-3 text-[17px] font-medium has-checked:border-primary has-checked:bg-card-elevated has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring"
            >
              <input
                type="radio"
                name="metodo"
                value={valor}
                checked={metodo === valor}
                onChange={() => {
                  setMetodo(valor);
                  setErroGeral(null);
                  liberarCartao();
                }}
                className="sr-only"
              />
              {rotulo}
            </label>
          ))}
        </div>
      </fieldset>

      {metodo === "cartao" ? (
        <CamposCartao
          formId={ID_FORM}
          cpf={cpf}
          cpfValido={validarCpf(cpf)}
          aoTokenizar={aoTokenizar}
          aoFalhar={(mensagem) => {
            liberarCartao();
            setErroGeral(mensagem);
          }}
          aoFalharCpf={() => {
            liberarCartao();
            setErros((anteriores) => ({ ...anteriores, cpf: MSG_CPF_INVALIDO }));
            document.getElementById(ID_CPF)?.focus();
          }}
        />
      ) : null}

      <Button
        type="submit"
        onClick={aoClicarEnviar}
        disabled={enviando || processandoCartao}
        className="h-14 w-full text-[17px] font-semibold"
      >
        {enviando || processandoCartao
          ? "Processando…"
          : metodo === "pix"
            ? `Gerar Pix · ${precoFormatado}`
            : `Pagar ${precoFormatado} no cartão`}
      </Button>

      <p className="text-sm text-muted-foreground">
        Ao comprar, você concorda com os{" "}
        <Link href={site.rotas.termos} className="text-primary underline underline-offset-4">
          Termos
        </Link>{" "}
        e a{" "}
        <Link href={site.rotas.privacidade} className="text-primary underline underline-offset-4">
          Política de Privacidade
        </Link>
        . Pagamento processado pelo Mercado Pago.
      </p>
    </form>
  );
}
