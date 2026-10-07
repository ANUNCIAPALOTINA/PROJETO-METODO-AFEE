import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Classes do campo de texto: 48 px de altura, borda visível, foco do tema. */
export const classeCampo =
  "block h-12 w-full rounded-[2px] border border-input bg-card px-4 text-[17px] text-foreground placeholder:text-muted-foreground aria-invalid:border-destructive disabled:opacity-60";

type Props = Omit<ComponentProps<"input">, "id"> & {
  id: string;
  rotulo: string;
  erro?: string;
  dica?: ReactNode;
};

/** Campo com rótulo visível, dica e mensagem de erro ligadas por aria. */
export function Campo({ id, rotulo, erro, dica, className, ...resto }: Props) {
  const idErro = `${id}-erro`;
  const idDica = `${id}-dica`;
  const descricao = [erro ? idErro : null, dica ? idDica : null]
    .filter(Boolean)
    .join(" ");
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[15px] font-medium">
        {rotulo}
      </label>
      <input
        id={id}
        aria-invalid={erro ? true : undefined}
        aria-describedby={descricao || undefined}
        className={cn(classeCampo, className)}
        {...resto}
      />
      {dica ? (
        <p id={idDica} className="text-sm text-muted-foreground">
          {dica}
        </p>
      ) : null}
      {erro ? (
        <p id={idErro} className="text-sm font-medium text-destructive">
          {erro}
        </p>
      ) : null}
    </div>
  );
}
