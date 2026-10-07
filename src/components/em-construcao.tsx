import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoAfee } from "@/components/logo-afee";
import { site } from "@/config/site";

/** Página provisória para as rotas que ainda não existem. */
export function EmConstrucao({ titulo }: { titulo: string }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <LogoAfee className="text-4xl" />
      <h1 className="text-[30px] leading-[1.1] md:text-5xl">{titulo}</h1>
      <p className="max-w-md text-[17px] text-muted-foreground">
        Esta página está em construção. Volte para o início para conhecer o
        Método AFEE.
      </p>
      <Button
        nativeButton={false}
        render={<Link href={site.rotas.vendas} />}
        className="h-14 px-8 text-[17px] font-semibold"
      >
        Voltar para o início
      </Button>
    </main>
  );
}
