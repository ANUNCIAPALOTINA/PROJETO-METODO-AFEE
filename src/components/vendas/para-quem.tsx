import { vendas } from "@/content/vendas";
import { ItemMarcador } from "@/components/vendas/item-marcador";
import { Secao, TituloSecao } from "@/components/vendas/secao";

export function ParaQuem() {
  const { paraQuem } = vendas;

  return (
    <Secao fundo="card" labelledBy="titulo-para-quem">
      <TituloSecao id="titulo-para-quem">{paraQuem.titulo}</TituloSecao>
      <div className="mt-6 grid gap-8 md:mt-8 md:grid-cols-2 md:gap-12">
        <div className="flex flex-col gap-3">
          <h3 className="text-[22px] leading-[1.2] md:text-[28px]">
            {paraQuem.eParaVoce.titulo}
          </h3>
          <ul className="flex flex-col gap-2 text-[17px] text-foreground md:text-[19px]">
            {paraQuem.eParaVoce.itens.map((item) => (
              <ItemMarcador key={item}>{item}</ItemMarcador>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-[22px] leading-[1.2] md:text-[28px]">
            {paraQuem.naoEParaVoce.titulo}
          </h3>
          <ul className="flex flex-col gap-2 text-[17px] text-muted-foreground md:text-[19px]">
            {paraQuem.naoEParaVoce.itens.map((item) => (
              <ItemMarcador key={item} negativo>
                {item}
              </ItemMarcador>
            ))}
          </ul>
        </div>
      </div>
    </Secao>
  );
}
