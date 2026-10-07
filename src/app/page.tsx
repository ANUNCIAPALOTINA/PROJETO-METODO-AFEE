import { BarraTopo } from "@/components/vendas/barra-topo";
import { BotaoFixo } from "@/components/vendas/botao-fixo";
import { ChamadaFinal } from "@/components/vendas/chamada-final";
import { ConteudoPreco } from "@/components/vendas/conteudo-preco";
import { FaixaImagem } from "@/components/vendas/faixa-imagem";
import { Faq } from "@/components/vendas/faq";
import { FundoAnimado } from "@/components/vendas/fundo-animado";
import { Garantia } from "@/components/vendas/garantia";
import { Hero } from "@/components/vendas/hero";
import { Historia } from "@/components/vendas/historia";
import { Identificacao } from "@/components/vendas/identificacao";
import { Metodo } from "@/components/vendas/metodo";
import { ParaQuem } from "@/components/vendas/para-quem";
import { Rodape } from "@/components/vendas/rodape";
import { SemAcademia } from "@/components/vendas/sem-academia";

// Página de vendas. Textos em src/content/vendas.ts; preço em src/config/produto.ts.
export default function Home() {
  return (
    <>
      <FundoAnimado />
      <BarraTopo />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Identificacao />
        <Historia />
        <Metodo />
        <SemAcademia />
        <ConteudoPreco />
        <ParaQuem />
        <FaixaImagem />
        <Garantia />
        <Faq />
        <ChamadaFinal />
      </main>
      <Rodape />
      <BotaoFixo />
    </>
  );
}
