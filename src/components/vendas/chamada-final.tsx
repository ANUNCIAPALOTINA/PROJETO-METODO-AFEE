import Image from "next/image";
import { vendas } from "@/content/vendas";
import { BotaoCompra } from "@/components/vendas/botao-compra";
import { Revelar } from "@/components/vendas/revelar";
import { SeloPromocao } from "@/components/vendas/selo-promocao";

export function ChamadaFinal() {
  const { chamadaFinal } = vendas;

  return (
    <section
      aria-labelledby="titulo-final"
      className="relative flex min-h-[480px] items-end overflow-hidden md:min-h-[620px]"
    >
      <Image
        src="/fotos/final-cta-1080.webp"
        alt="Garlet correndo no parque ao pôr do sol"
        fill
        sizes="100vw"
        className="zoom-lento object-cover object-center"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-b from-background/15 via-background/55 via-30% to-background"
      />
      <div
        aria-hidden
        className="absolute inset-0 hidden bg-linear-to-l from-background/95 via-background/60 to-transparent md:block"
      />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-10 md:items-end md:py-16">
        <Revelar className="flex max-w-xl flex-col gap-3">
          <h2
            id="titulo-final"
            className="text-[30px] leading-[1.1] md:text-5xl"
          >
            {chamadaFinal.titulo}
          </h2>
          <p className="text-[17px] text-foreground md:text-[19px]">
            {chamadaFinal.texto}
          </p>
          <SeloPromocao />
          <BotaoCompra id="cta-final" className="md:max-w-md" />
          <p className="text-sm text-muted-foreground">
            {chamadaFinal.microtexto}
          </p>
        </Revelar>
      </div>
    </section>
  );
}
