import Link from "next/link";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { rotuloBotaoCompra } from "@/content/vendas";
import { cn } from "@/lib/utils";

/** Botão de compra: um link para o checkout, com o desenho do botão principal. */
export function BotaoCompra({
  id,
  className,
  rotulo = rotuloBotaoCompra,
}: {
  id?: string;
  className?: string;
  rotulo?: string;
}) {
  return (
    <Button
      id={id}
      nativeButton={false}
      render={<Link href={site.rotas.checkout} />}
      className={cn("h-14 w-full text-[17px] font-semibold", className)}
    >
      {rotulo}
    </Button>
  );
}
