import { precoFormatado, precoOriginalFormatado } from "@/config/produto";
import { promocao } from "@/content/vendas";

/** Selo "de R$ 161,80 por R$ 16,18", pulsando de leve para chamar o olho. */
export function SeloPromocao() {
  return (
    <p className="selo-promocao inline-flex w-fit flex-wrap items-center gap-x-2 gap-y-1 border border-primary bg-primary/15 px-3 py-1.5 text-sm font-semibold">
      <span className="text-[11px] tracking-[0.12em] text-primary uppercase">
        {promocao.chamada}
      </span>
      <span className="text-foreground">
        de <s className="text-muted-foreground decoration-primary">{precoOriginalFormatado}</s> por{" "}
        <span className="text-primary">{precoFormatado}</span>
      </span>
    </p>
  );
}
