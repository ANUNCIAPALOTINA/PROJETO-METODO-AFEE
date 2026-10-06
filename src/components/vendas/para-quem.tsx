import { vendas } from "@/content/vendas";
import { ItemMarcador } from "@/components/vendas/item-marcador";
import { Secao, TituloSecao } from "@/components/vendas/secao";

export function ParaQuem() {
  const { paraQuem } = vendas;

  return (
    <Secao fundo="card" labelledBy="titulo-para-quem">
      <TituloSecao id="titulo-para-quem">{paraQuem.titulo}</TituloSecao>
      <div className="mt-8 grid gap-10 md:mt-12 md:grid-cols-2 md:gap-16">
        <div className="flex flex-col gap-6">
          <h3 className="text-[22px] leading-[1.2] md:text-[28px]">
            {paraQuem.eParaVoce.titulo}
          </h3>
          <ul className="flex flex-col gap-4 text-[17px] text-foreground md:text-[19px]">
            {paraQuem.eParaVoce.itens.map((item) => (
              <ItemMarcador key={item}>{item}</ItemMarcador>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-6">
          <h3 className="text-[22px] leading-[1.2] md:text-[28px]">
            {paraQuem.naoEParaVoce.titulo}
          </h3>
          <ul className="flex flex-col gap-4 text-[17px] text-muted-foreground md:text-[19px]">
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
