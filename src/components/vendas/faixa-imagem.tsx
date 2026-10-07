import Image from "next/image";

/** Faixa de imagem em largura total, entre seções. Decorativa para leitor de tela. */
export function FaixaImagem() {
  return (
    <div className="relative h-[163px] w-full overflow-hidden bg-card md:h-[360px]">
      <Image
        src="/fotos/faixa-grama-1080.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
    </div>
  );
}
