import { vendas } from "@/content/vendas";
import { Secao, TituloSecao } from "@/components/vendas/secao";

/**
 * Perguntas frequentes com <details>: abre e fecha sem JavaScript, funciona com
 * teclado (Enter e espaço) e leitores de tela. A primeira vem aberta.
 */
export function Faq() {
  const { faq } = vendas;

  return (
    <Secao fundo="card" labelledBy="titulo-faq">
      <div className="mx-auto max-w-3xl">
        <TituloSecao id="titulo-faq">{faq.titulo}</TituloSecao>
        <div className="mt-6 flex flex-col md:mt-8">
          {faq.itens.map((item, i) => (
            <details
              key={item.pergunta}
              open={i === 0}
              className="group border-b border-border"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3 text-[17px] font-semibold text-foreground md:text-[19px] [&::-webkit-details-marker]:hidden">
                <span>{item.pergunta}</span>
                <span
                  aria-hidden
                  className="font-heading text-[28px] leading-none font-bold text-primary"
                >
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <p className="pb-4 text-[16px] text-muted-foreground md:text-[17px]">
                {item.resposta}
              </p>
            </details>
          ))}
        </div>
      </div>
    </Secao>
  );
}
