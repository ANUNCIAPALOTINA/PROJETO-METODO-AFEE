"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { PIX_VALIDADE_HORAS } from "@/lib/pagamentos/constantes";
import { useStatusPagamento, type SituacaoNavegador } from "./use-status-pagamento";

export type PixGerado = { id: string; qrCode: string; qrCodeBase64: string };

/** QR do Pix, "copia e cola" e espera automática pela confirmação. */
export function TelaPix({
  pix,
  aoAprovar,
}: {
  pix: PixGerado;
  aoAprovar: () => void;
}) {
  const [situacao, setSituacao] = useState<SituacaoNavegador>("pendente");
  const [copiado, setCopiado] = useState<"nao" | "sim" | "falhou">("nao");

  useStatusPagamento(pix.id, (nova) => {
    setSituacao(nova);
    if (nova === "aprovado") aoAprovar();
  });

  async function copiar() {
    try {
      await navigator.clipboard.writeText(pix.qrCode);
      setCopiado("sim");
    } catch {
      // Sem permissão da área de transferência: seleciona o texto para copiar à mão.
      document.getElementById("pix-codigo")?.focus();
      setCopiado("falhou");
    }
  }

  const encerrado = situacao === "encerrado" || situacao === "recusado";

  return (
    <section
      aria-labelledby="pix-titulo"
      className="rounded-[2px] border border-border bg-card p-6"
    >
      <h2 id="pix-titulo" className="text-2xl">
        Pague com Pix
      </h2>

      {encerrado ? (
        <div className="mt-4 space-y-4" role="alert">
          <p>Esse Pix não está mais válido.</p>
          <Button
            className="h-12 px-6 text-[17px] font-semibold"
            onClick={() => window.location.assign(site.rotas.checkout)}
          >
            Gerar um novo Pix
          </Button>
        </div>
      ) : (
        <>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-[15px] text-muted-foreground">
            <li>Abra o app do seu banco e escolha pagar com Pix.</li>
            <li>Leia o QR code ou use o código &ldquo;copia e cola&rdquo;.</li>
            <li>Confirme. Esta tela atualiza sozinha.</li>
          </ol>

          <div className="mt-5 flex justify-center">
            <Image
              src={`data:image/png;base64,${pix.qrCodeBase64}`}
              alt="QR code do Pix para pagamento"
              width={224}
              height={224}
              unoptimized
              className="size-56 bg-white p-2"
            />
          </div>

          <label htmlFor="pix-codigo" className="mt-5 block text-[15px] font-medium">
            Pix copia e cola
          </label>
          <input
            id="pix-codigo"
            readOnly
            value={pix.qrCode}
            onFocus={(e) => e.currentTarget.select()}
            className="mt-2 block h-12 w-full rounded-[2px] border border-input bg-background px-3 text-sm"
          />
          <Button
            type="button"
            onClick={copiar}
            className="mt-3 h-12 w-full text-[17px] font-semibold"
          >
            Copiar código
          </Button>
          <p aria-live="polite" className="mt-2 min-h-6 text-sm text-muted-foreground">
            {copiado === "sim" ? "Código copiado." : null}
            {copiado === "falhou"
              ? "Não deu para copiar sozinho. O código está selecionado, copie com o dedo."
              : null}
          </p>

          <p aria-live="polite" className="mt-3 flex items-center gap-2 text-[15px]">
            <span aria-hidden className="size-2 animate-pulse rounded-full bg-primary" />
            {situacao === "analise"
              ? "Pagamento em análise. Avisamos por e-mail."
              : "Aguardando o pagamento…"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            O código vale por {PIX_VALIDADE_HORAS} horas. Precisa de ajuda?{" "}
            <Link href={site.rotas.suporte} className="text-primary underline underline-offset-4">
              Fale com o suporte
            </Link>
            .
          </p>
        </>
      )}
    </section>
  );
}
