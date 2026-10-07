import { vendas } from "@/content/vendas";
import { ItemMarcador } from "@/components/vendas/item-marcador";
import { Paragrafo, Secao, TituloSecao } from "@/components/vendas/secao";

export function Identificacao() {
  const { identificacao } = vendas;

  return (
    <Secao labelledBy="titulo-identificacao">
      <div className="flex max-w-2xl flex-col gap-4">
        <TituloSecao id="titulo-identificacao">
          {identificacao.titulo}
        </TituloSecao>
        {identificacao.paragrafos.map((texto) => (
          <Paragrafo key={texto}>{texto}</Paragrafo>
        ))}
        <ul className="flex flex-col gap-2 text-[17px] text-foreground md:text-[19px]">
          {identificacao.dores.map((dor) => (
            <ItemMarcador key={dor}>{dor}</ItemMarcador>
          ))}
        </ul>
        <Paragrafo forte>{identificacao.fecho}</Paragrafo>
      </div>
    </Secao>
  );
}
