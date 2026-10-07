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
      <div className="grid items-center gap-6 md:grid-cols-2 md:gap-12">
        <div className="relative aspect-[812/866] w-full overflow-hidden">
          <Image
            src="/fotos/historia-barra-812.webp"
            alt="Garlet pendurado numa barra com o corpo na horizontal e as pernas levantadas, contra o céu azul"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <Etiqueta>{historia.etiqueta}</Etiqueta>
            <TituloSecao id="titulo-historia">{historia.titulo}</TituloSecao>
          </div>
          {historia.paragrafos.map((texto) => (
            <Paragrafo key={texto}>{texto}</Paragrafo>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-4xl flex-col gap-8 md:mt-12 md:flex-row md:items-start">
        <figure className="flex flex-1 flex-col gap-2">
          <div className="relative aspect-[1080/600] w-full overflow-hidden">
            <Image
              src="/fotos/evolucao-1080.webp"
              alt="Minha evolução: três fotos lado a lado, do início do treino até hoje"
              fill
              sizes="(min-width: 768px) 560px, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="text-sm text-muted-foreground">
            {historia.legendaEvolucao}
          </figcaption>
        </figure>

        <figure className="mx-auto flex w-full max-w-[300px] flex-col gap-2 md:mx-0 md:w-[300px] md:shrink-0">
          <div className="relative aspect-[1080/2047] w-full overflow-hidden">
            <Image
              src="/fotos/aluno-antes-depois-810.webp"
              alt="Foto de antes e depois de um aluno do Método AFEE, depois de meses de treino"
              fill
              sizes="300px"
              className="object-cover"
            />
          </div>
          <figcaption className="text-sm text-muted-foreground">
            {historia.legendaAluno}
          </figcaption>
        </figure>
      </div>
    </Secao>
  );
}
