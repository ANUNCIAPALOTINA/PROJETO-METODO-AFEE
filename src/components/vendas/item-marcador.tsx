import { cn } from "@/lib/utils";

/** Linha de lista com marcador quadrado. `negativo` deixa o marcador cinza. */
export function ItemMarcador({
  children,
  negativo = false,
}: {
  children: React.ReactNode;
  negativo?: boolean;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden
        className={cn(
          "mt-[9px] size-2.5 shrink-0",
          negativo ? "bg-muted-foreground" : "bg-primary",
        )}
      />
      <span>{children}</span>
    </li>
  );
}
