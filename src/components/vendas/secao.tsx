import { cn } from "@/lib/utils";
import { Revelar } from "@/components/vendas/revelar";

/** Seção da página de vendas: fundo, espaçamento e largura máxima padrão. */
export function Secao({
  children,
  fundo = "background",
  id,
  className,
  labelledBy,
}: {
  children: React.ReactNode;
  fundo?: "background" | "card";
  id?: string;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "relative px-6 py-10 md:py-16",
        fundo === "card"
          ? "border-y border-border/60 bg-card/55 backdrop-blur-md"
          : "bg-transparent",
        className,
      )}
    >
      <Revelar className="mx-auto w-full max-w-6xl">{children}</Revelar>
    </section>
  );
}

export function Etiqueta({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-xs font-semibold tracking-[0.12em] text-primary uppercase">
      {children}
    </p>
  );
}

export function TituloSecao({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <h2 id={id} className="text-[30px] leading-[1.1] md:text-5xl">
      {children}
    </h2>
  );
}

/** Parágrafo de leitura: até ~65 caracteres por linha no computador. */
export function Paragrafo({
  children,
  forte = false,
}: {
  children: React.ReactNode;
  forte?: boolean;
}) {
  return (
    <p
      className={cn(
        "max-w-[65ch] text-[17px] leading-[1.6] md:text-[19px]",
        forte ? "font-semibold text-foreground" : "text-muted-foreground",
      )}
    >
      {children}
    </p>
  );
}
