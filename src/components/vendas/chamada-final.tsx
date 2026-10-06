import Image from "next/image";
import { vendas } from "@/content/vendas";
import { BotaoCompra } from "@/components/vendas/botao-compra";

export function ChamadaFinal() {
  const { chamadaFinal } = vendas;

  return (
    <section
      aria-labelledby="titulo-final"
      className="relative flex min-h-[560px] items-end overflow-hidden bg-background"
    >
      <Image
        src="/fotos/final-cta-1080.webp"
        alt="Garlet de cabeça baixa, com as mãos juntas, no gramado ao pôr do sol"
        fill
        sizes="100vw"
        className="object-cover object-top"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-b from-background/15 via-background/55 via-30% to-background"
      />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-12 md:py-24">
        <div className="flex max-w-xl flex-col gap-4">
          <h2
            id="titulo-final"
            className="text-[30px] leading-[1.1] md:text-5xl"
          >
            {chamadaFinal.titulo}
          </h2>
          <p className="text-[17px] text-foreground md:text-[19px]">
            {chamadaFinal.texto}
          </p>
          <BotaoCompra id="cta-final" className="md:max-w-md" />
          <p className="text-sm text-muted-foreground">
            {chamadaFinal.microtexto}
          </p>
        </div>
      </div>
    </section>
  );
}
