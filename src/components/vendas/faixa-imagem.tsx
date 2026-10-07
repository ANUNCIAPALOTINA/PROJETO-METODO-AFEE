import Image from "next/image";

/** Faixa de imagem em largura total, entre seções. Decorativa para leitor de tela. */
export function FaixaImagem() {
  return (
    <div className="relative h-[140px] w-full overflow-hidden md:h-[280px]">
      <Image
        src="/fotos/faixa-grama-1080.webp"
        alt=""
        fill
        sizes="100vw"
        className="zoom-lento object-cover opacity-80"
      />
    </div>
  );
}
