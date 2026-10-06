import { precoFormatado } from "@/config/produto";
import { vendas } from "@/content/vendas";
import { BotaoCompra } from "@/components/vendas/botao-compra";
import { SeloGarantia } from "@/components/vendas/selo-garantia";
import { Etiqueta, Secao, TituloSecao } from "@/components/vendas/secao";

export function ConteudoPreco() {
  const { conteudo, preco } = vendas;

  return (
    <Secao labelledBy="titulo-conteudo">
      <div className="grid items-start gap-12 md:grid-cols-[1fr_minmax(0,420px)] md:gap-16">
        <div className="flex flex-col gap-6">
          <div>
            <Etiqueta>{conteudo.etiqueta}</Etiqueta>
            <TituloSecao id="titulo-conteudo">{conteudo.titulo}</TituloSecao>
          </div>
          <ol className="flex flex-col">
            {conteudo.itens.map((item, i) => (
              <li
                key={item}
                className="flex items-start gap-4 border-b border-border py-3"
              >
                <span
                  aria-hidden
                  className="w-8 shrink-0 font-heading text-[22px] leading-[1.2] font-bold text-primary"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[17px] text-foreground md:text-[19px]">
                  {item}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div
          id="bloco-preco"
          className="flex flex-col gap-4 border-2 border-primary bg-card-elevated p-6 md:sticky md:top-8"
        >
          <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
            {preco.etiqueta}
          </p>
          <p className="font-heading text-[40px] leading-[1.05] font-bold">
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
