import { cn } from "@/lib/utils";

/**
 * Logo AFEE: as quatro letras mais a barra de quatro degraus
 * (Aquecer, Forçar, Estimular, Exaurir). Tudo em `em`, então o tamanho
 * é controlado só pelo font-size de quem usa (ex.: className="text-3xl").
 */
export function LogoAfee({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="AFEE"
      className={cn(
        "inline-flex flex-col items-start gap-[0.107em]",
        className,
      )}
    >
      <span
        aria-hidden
        className="font-heading leading-none font-bold tracking-[-0.02em] text-foreground"
      >
        AFEE
      </span>
      <span aria-hidden className="flex w-full items-end gap-[0.071em]">
        {[0.071, 0.143, 0.214, 0.286].map((altura) => (
          <span
            key={altura}
            className="flex-1 bg-primary"
            style={{ height: `${altura}em` }}
          />
        ))}
      </span>
    </span>
  );
}
