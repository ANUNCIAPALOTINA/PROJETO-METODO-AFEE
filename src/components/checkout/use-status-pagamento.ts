"use client";

import { useEffect, useRef } from "react";

export type SituacaoNavegador =
  | "aprovado"
  | "pendente"
  | "analise"
  | "recusado"
  | "encerrado";

const INTERVALO_MS = 4000;
const LIMITE_MS = 30 * 60 * 1000;

/**
 * Consulta leve de GET /api/pagamentos/[id]/status. Para sozinha quando a
 * situação deixa de ser "pendente"/"analise", ao desmontar, ou após 30 min.
 * Não pergunta enquanto a aba está escondida.
 */
export function useStatusPagamento(
  id: string | null,
  aoMudar: (situacao: SituacaoNavegador) => void,
) {
  const callback = useRef(aoMudar);
  useEffect(() => {
    callback.current = aoMudar;
  });

  useEffect(() => {
    if (!id) return;
    let parado = false;
    const inicio = Date.now();

    async function consultar() {
      if (parado || document.hidden) return;
      try {
        const resposta = await fetch(`/api/pagamentos/${id}/status`, {
          cache: "no-store",
        });
        if (!resposta.ok) return;
        const dados = (await resposta.json()) as { situacao?: SituacaoNavegador };
        if (parado || !dados.situacao) return;
        if (dados.situacao !== "pendente" && dados.situacao !== "analise") {
          parado = true;
          clearInterval(timer);
        }
        callback.current(dados.situacao);
      } catch {
        // Falha de rede passageira: tenta de novo no próximo ciclo.
      }
    }

    const timer = setInterval(() => {
      if (Date.now() - inicio > LIMITE_MS) {
        parado = true;
        clearInterval(timer);
        return;
      }
      void consultar();
    }, INTERVALO_MS);
    return () => {
      parado = true;
      clearInterval(timer);
    };
  }, [id]);
}
