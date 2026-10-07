import Image from "next/image";
import { vendas } from "@/content/vendas";
import { Paragrafo, Secao, TituloSecao } from "@/components/vendas/secao";

export function SemAcademia() {
  const { semAcademia } = vendas;

  return (
    <Secao fundo="card" labelledBy="titulo-sem-academia">
      <div className="grid items-center gap-6 md:grid-cols-2 md:gap-12">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src="/fotos/sem-academia-mureta-1080.webp"
            alt="Garlet sentado na beirada de uma mureta de concreto, com as pernas estendidas, à beira de um lago"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="zoom-lento object-cover"
          />
        </div>
        <div className="flex flex-col gap-4">
          <TituloSecao id="titulo-sem-academia">
            {semAcademia.titulo}
          </TituloSecao>
          <Paragrafo>{semAcademia.texto}</Paragrafo>
        </div>
      </div>
    </Secao>
  );
}
