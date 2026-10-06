import Image from "next/image";
import { vendas } from "@/content/vendas";
import {
  Etiqueta,
  Paragrafo,
  Secao,
  TituloSecao,
} from "@/components/vendas/secao";

export function Historia() {
  const { historia } = vendas;

  return (
    <Secao fundo="card" labelledBy="titulo-historia">
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
        <div className="relative aspect-[812/866] w-full overflow-hidden">
          <Image
            src="/fotos/historia-barra-812.webp"
            alt="Garlet pendurado numa barra com o corpo na horizontal e as pernas levantadas, contra o céu azul"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <Etiqueta>{historia.etiqueta}</Etiqueta>
            <TituloSecao id="titulo-historia">{historia.titulo}</TituloSecao>
          </div>
          {historia.paragrafos.map((texto) => (
            <Paragrafo key={texto}>{texto}</Paragrafo>
          ))}
        </div>
      </div>

      <figure className="mx-auto mt-12 flex max-w-3xl flex-col gap-2 md:mt-20">
        <div className="relative aspect-[1080/600] w-full overflow-hidden">
          <Image
            src="/fotos/evolucao-1080.webp"
            alt="Minha evolução: três fotos lado a lado, do início do treino até hoje"
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
          />
        </div>
        <figcaption className="text-sm text-muted-foreground">
          {historia.legendaEvolucao}
        </figcaption>
      </figure>
    </Secao>
  );
}
