import { precoFormatado, precoOriginalFormatado } from "@/config/produto";
import { promocao, vendas } from "@/content/vendas";
import { BotaoCompra } from "@/components/vendas/botao-compra";
import { SeloGarantia } from "@/components/vendas/selo-garantia";
import { Etiqueta, Secao, TituloSecao } from "@/components/vendas/secao";

export function ConteudoPreco() {
  const { conteudo, preco } = vendas;

  return (
    <Secao labelledBy="titulo-conteudo">
      <div className="grid items-start gap-8 md:grid-cols-[1fr_minmax(0,400px)] md:gap-12">
        <div className="flex flex-col gap-4">
          <div>
            <Etiqueta>{conteudo.etiqueta}</Etiqueta>
            <TituloSecao id="titulo-conteudo">{conteudo.titulo}</TituloSecao>
          </div>
          <ol className="grid gap-x-6 md:grid-cols-2">
            {conteudo.itens.map((item, i) => (
              <li
                key={item}
                className="flex items-start gap-3 border-b border-border py-2"
              >
                <span
                  aria-hidden
                  className="w-7 shrink-0 font-heading text-[17px] leading-[1.4] font-bold text-primary"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[15px] text-foreground md:text-[16px]">
                  {item}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div
          id="bloco-preco"
          className="caixa-preco flex flex-col gap-3 border-2 border-primary bg-card-elevated/90 p-6 backdrop-blur md:sticky md:top-8"
        >
          <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
            {preco.etiqueta}
          </p>
          <p className="selo-promocao w-fit border border-primary bg-primary/15 px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-primary uppercase">
            {promocao.chamada}
          </p>
          <p className="flex items-baseline gap-3 font-heading text-[48px] leading-[1.05] font-bold">
            <span className="text-[20px] font-medium text-muted-foreground line-through decoration-primary decoration-2">
              {precoOriginalFormatado}
            </span>
            {precoFormatado}
          </p>
          <p className="text-[17px] text-muted-foreground">{preco.condicao}</p>
          <BotaoCompra id="cta-preco" />
          <SeloGarantia />
          <p className="text-sm text-muted-foreground">{preco.seguranca}</p>
        </div>
      </div>
    </Secao>
  );
}
