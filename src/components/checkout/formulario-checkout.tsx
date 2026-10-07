"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { precoFormatado } from "@/config/produto";
import { site } from "@/config/site";
import { formatarCpf } from "@/lib/pagamentos/cpf";
import { validarComprador, type ErrosEntrada } from "@/lib/pagamentos/entrada";
import { Campo } from "./campo";
import { CamposCartao, type DadosCartaoTokenizado } from "./cartao-mp";
import { guardarEmailPedido } from "./email-pedido";
import { TelaPix, type PixGerado } from "./tela-pix";
import { useStatusPagamento, type SituacaoNavegador } from "./use-status-pagamento";

const ID_FORM = "form-checkout";
const ID_CPF = "cpf";

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

  // Chave de idempotência: igual enquanto a tentativa pode ser repetida
  // (ex.: queda de rede), nova depois de uma resposta definitiva.
  const chave = useRef<string | null>(null);
  const novaChave = () => {
    chave.current = crypto.randomUUID();
  };

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
    try {
      const resposta = await fetch("/api/pagamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, cpf, chave: chave.current, metodo, ...extra }),
      });
      const dados = (await resposta.json().catch(() => ({}))) as RespostaApi;
      novaChave();

      if (resposta.status === 400 && dados.erros) {
        const { token, metodo: erroMetodo, ...camposDoForm } = dados.erros;
        setErros(camposDoForm);
        if (token || erroMetodo) setErroGeral(token ?? erroMetodo ?? MSG_FALHA);
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
        setErroGeral(dados.mensagem ?? "O cartão não foi aprovado. Tente outro cartão ou pague com Pix.");
      } else {
        setAnalise(dados.id);
      }
    } catch {
      // Falha de rede: mantém a mesma chave de idempotência para repetir sem cobrar duas vezes.
      setErroGeral(MSG_FALHA);
    } finally {
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

  function aoTokenizar(dados: DadosCartaoTokenizado) {
    if (!validarLocal()) return;
    void criarPagamento({
      token: dados.token,
      metodoPagamentoId: dados.paymentMethodId,
      emissorId: dados.issuerId,
      parcelas: Number(dados.installments) || 1,
    });
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
          idCpf={ID_CPF}
          aoTokenizar={aoTokenizar}
          aoFalhar={setErroGeral}
        />
      ) : null}

      <Button
        type="submit"
        disabled={enviando}
        className="h-14 w-full text-[17px] font-semibold"
      >
        {enviando
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
