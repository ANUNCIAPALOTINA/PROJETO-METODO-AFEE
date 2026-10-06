import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Ebook · Método AFEE", template: "%s · Método AFEE" },
  robots: { index: false, follow: false },
};

/** Leitor em tema CLARO (.tema-claro), com ponte para pular direto ao conteúdo. */
export default function LayoutEbook({ children }: LayoutProps<"/ebook">) {
  return (
    <div className="tema-claro relative isolate flex flex-1 flex-col bg-background text-foreground">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:px-4 focus:py-3 focus:text-primary-foreground"
      >
        Pular para o conteúdo
      </a>
      {children}
    </div>
  );
}
