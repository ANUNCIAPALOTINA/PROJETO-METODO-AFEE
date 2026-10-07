import Image from "next/image";
import { relatos, textosRelatos } from "@/content/relatos";
import { Revelar } from "@/components/vendas/revelar";
import { Etiqueta, Secao, TituloSecao } from "@/components/vendas/secao";

/** Relatos de alunos. Não renderiza nada enquanto não houver relato real. */
export function Relatos() {
  if (relatos.length === 0) return null;

  return (
    <Secao labelledBy="titulo-relatos">
      <Etiqueta>{textosRelatos.etiqueta}</Etiqueta>
      <TituloSecao id="titulo-relatos">{textosRelatos.titulo}</TituloSecao>

      <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-2 lg:grid-cols-3">
        {relatos.map((relato, i) => (
          <Revelar key={relato.nome + i} atraso={(i % 3) * 0.12}>
            <figure className="flex h-full flex-col gap-4 border border-border bg-card/70 p-5 backdrop-blur transition-colors duration-300 hover:border-primary">
              {relato.foto ? (
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={relato.foto.src}
                    alt={relato.foto.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              ) : null}
              <span
                aria-hidden
                className="font-heading text-[48px] leading-[0.6] font-bold text-primary"
              >
                “
              </span>
              <blockquote className="flex-1 text-[17px] text-foreground">
                {relato.texto}
              </blockquote>
              <figcaption className="border-t border-border pt-3 text-sm">
                <span className="font-semibold text-foreground">
                  {relato.nome}
                </span>
                {relato.detalhe ? (
                  <span className="text-muted-foreground">
                    {" · "}
                    {relato.detalhe}
                  </span>
                ) : null}
              </figcaption>
            </figure>
          </Revelar>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">{textosRelatos.aviso}</p>
    </Secao>
  );
}
