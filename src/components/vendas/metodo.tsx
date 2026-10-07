import Image from "next/image";
import { vendas } from "@/content/vendas";
import { MetodoDiagrama } from "@/components/metodo-diagrama";
import {
  Etiqueta,
  Paragrafo,
  Secao,
  TituloSecao,
} from "@/components/vendas/secao";

function Fase({
  letra,
  nome,
  descricao,
}: {
  letra: string;
  nome: string;
  descricao: string;
}) {
  return (
    <article className="flex items-start gap-4 border border-border bg-card p-4">
      <div
        aria-hidden
        className="flex size-14 shrink-0 items-center justify-center border-2 border-primary font-heading text-[30px] leading-none font-bold text-primary"
      >
        {letra}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-[22px] leading-[1.2]">{nome}</h3>
        <p className="text-[17px] text-muted-foreground">{descricao}</p>
      </div>
    </article>
  );
}

export function Metodo() {
  const { metodo } = vendas;

  return (
    <Secao labelledBy="titulo-metodo">
      <div className="flex max-w-2xl flex-col gap-4">
        <div>
          <Etiqueta>{metodo.etiqueta}</Etiqueta>
          <TituloSecao id="titulo-metodo">{metodo.titulo}</TituloSecao>
        </div>
        <Paragrafo>{metodo.abertura}</Paragrafo>
      </div>

      <div className="mt-8 md:mt-12">
        <MetodoDiagrama />
      </div>

      <div className="mt-12 grid items-start gap-8 md:mt-20 md:grid-cols-2 md:gap-16">
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src="/fotos/metodo-parque-850.webp"
            alt="Garlet de lado, em um parque ao pôr do sol, com as mãos à frente"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-4">
          {metodo.fases.map((fase) => (
            <Fase key={fase.nome} {...fase} />
          ))}

          <aside className="flex items-start gap-4 border border-border bg-card p-4">
            <div className="relative h-[140px] w-[100px] shrink-0 overflow-hidden md:h-[168px] md:w-[120px]">
              <Image
                src="/fotos/termometro-paradamao-472.webp"
                alt="Garlet em parada de mão no gramado"
                fill
                sizes="120px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
                {metodo.termometro.etiqueta}
              </h3>
              <p className="text-[15px] text-muted-foreground">
                {metodo.termometro.texto}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </Secao>
  );
}
