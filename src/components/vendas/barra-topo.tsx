import Link from "next/link";
import { LogoAfee } from "@/components/logo-afee";
import { site } from "@/config/site";

export function BarraTopo() {
  return (
    <header className="bg-background px-6 py-4">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link href={site.rotas.vendas} aria-label="Método AFEE, início">
          <LogoAfee className="text-2xl" />
        </Link>
        <Link
          href={site.rotas.entrar}
          className="py-2 text-sm font-medium text-foreground hover:text-primary"
        >
          Entrar
        </Link>
      </div>
    </header>
  );
}
