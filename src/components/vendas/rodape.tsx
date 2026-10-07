import Link from "next/link";
import { LogoAfee } from "@/components/logo-afee";
import { produto } from "@/config/produto";
import { site } from "@/config/site";
import { vendas } from "@/content/vendas";

const links = [
  { rotulo: "Termos", href: site.rotas.termos },
  { rotulo: "Privacidade", href: site.rotas.privacidade },
  { rotulo: "Suporte", href: site.rotas.suporte },
  { rotulo: "Entrar", href: site.rotas.entrar },
];

export function Rodape() {
  return (
    // pb extra no celular: o botão fixo de compra não pode cobrir o aviso legal
    <footer className="border-t border-border bg-background/80 backdrop-blur px-6 pt-12 pb-28 md:pb-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <LogoAfee className="self-start text-2xl" />
        <nav aria-label="Links do rodapé">
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-foreground">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="py-1 hover:text-primary">
                  {link.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="max-w-3xl text-sm text-muted-foreground">
          {vendas.avisoLegal}
        </p>
        <p className="text-sm text-muted-foreground">© {produto.nome}</p>
      </div>
    </footer>
  );
}
