import { vendas } from "@/content/vendas";
import { SeloGarantia } from "@/components/vendas/selo-garantia";
import { Paragrafo, Secao, TituloSecao } from "@/components/vendas/secao";

export function Garantia() {
  const { garantia } = vendas;

  return (
    <Secao labelledBy="titulo-garantia">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <TituloSecao id="titulo-garantia">{garantia.titulo}</TituloSecao>
        <Paragrafo>{garantia.texto}</Paragrafo>
        <SeloGarantia className="max-w-md" />
      </div>
    </Secao>
  );
}
