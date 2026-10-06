import { produto } from "@/config/produto";
import { vendas } from "@/content/vendas";
import { cn } from "@/lib/utils";

export function SeloGarantia({ className }: { className?: string }) {
  const { selo } = vendas.garantia;

  return (
    <div
      className={cn(
        "flex items-center gap-4 border border-border p-4",
        className,
      )}
    >
      <div
        aria-hidden
        className="flex size-12 shrink-0 items-center justify-center border-2 border-primary font-heading text-[22px] font-bold text-primary"
      >
        {produto.garantiaDias}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[17px] leading-tight font-semibold text-foreground">
          {selo.titulo}
        </p>
        <p className="text-sm text-muted-foreground">{selo.texto}</p>
      </div>
    </div>
  );
}
