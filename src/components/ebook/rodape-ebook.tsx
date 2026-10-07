import Link from "next/link";
import { site } from "@/config/site";

/** Rodapé do leitor, com a licença do aluno (marca d'água discreta, versão legível). */
export function RodapeEbook({ email }: { email: string }) {
  return (
    <footer className="relative z-10 border-t border-border bg-background px-5 py-8">
      <div className="mx-auto flex w-full max-w-[65ch] flex-col gap-3 text-sm text-muted-foreground">
        <p>
          Licenciado para <span className="break-all">{email}</span>. Uso
          pessoal, não compartilhe.
        </p>
        <p>
          Precisa de ajuda?{" "}
          <Link
            href={site.rotas.suporte}
            className="inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4 hover:text-primary-hover"
          >
            Fale com o suporte
          </Link>
        </p>
      </div>
    </footer>
  );
}
