import Image from "next/image";
import { Revelar } from "@/components/vendas/revelar";
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
    <article className="flex items-center gap-4 border border-border bg-card/70 p-3 backdrop-blur transition-colors duration-300 hover:border-primary">
      <div
        aria-hidden
        className="flex size-14 shrink-0 items-center justify-center border-2 border-primary font-heading text-[30px] leading-none font-bold text-primary"
      >
        {letra}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-[22px] leading-[1.2]">{nome}</h3>
        <p className="text-[15px] text-muted-foreground">{descricao}</p>
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

      <div className="mt-6 md:mt-8">
        <MetodoDiagrama />
      </div>

      <div className="mt-8 grid items-start gap-6 md:mt-12 md:grid-cols-2 md:gap-12">
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src="/fotos/metodo-parque-850.webp"
            alt="Garlet de lado, em um parque ao pôr do sol, com as mãos à frente"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="zoom-lento object-cover"
          />
        </div>

        <div className="flex flex-col gap-3">
          {metodo.fases.map((fase, i) => (
            <Revelar key={fase.nome} atraso={i * 0.12}>
              <Fase {...fase} />
            </Revelar>
          ))}

          <aside className="flex items-center gap-4 border border-primary/60 bg-card/70 p-3 backdrop-blur">
            <div className="relative h-[96px] w-[72px] shrink-0 overflow-hidden">
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
