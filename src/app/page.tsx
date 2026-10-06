import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MetodoDiagrama } from "@/components/metodo-diagrama";

// Página de teste do Passo 9: só prova que fontes, cores e foto funcionam.
// A página de vendas de verdade é o Passo 12.
export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative flex min-h-[720px] items-end overflow-hidden bg-background md:items-center">
        <div className="mx-auto grid w-full max-w-6xl md:grid-cols-2 md:gap-12 md:px-6">
          {/* Celular: foto de fundo. Computador: coluna da direita, no tamanho natural */}
          <div className="absolute inset-0 md:relative md:order-2 md:min-h-[min(100svh,900px)] md:self-stretch">
            <Image
              src="/fotos/hero-noite-900.webp"
              alt="Garlet, em pé à noite, de baixo para cima, com faixas nos pulsos, em pose de braço dobrado"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-top"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-b from-transparent from-20% via-background/85 via-52% to-background md:bg-linear-to-t md:from-background md:via-transparent md:via-25% md:to-transparent"
            />
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col gap-4 px-6 pb-8 md:order-1 md:mx-0 md:max-w-none md:justify-center md:px-0 md:py-16">
            <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
              Calistenia · Método AFEE
            </p>
            <h1 className="text-[40px] leading-[1.05] md:text-6xl">
              Pare de treinar sem saber se está funcionando.
            </h1>
            <p className="text-[17px] text-foreground">
              O Método AFEE é um jeito simples de montar seu treino de
              calistenia com começo, meio e fim. Você sabe o que fazer em cada
              fase e por quê. Sem academia, sem aparelho.
            </p>
            <p className="text-sm text-muted-foreground">
              Por João “Garlet” · Ebook com acesso imediato
            </p>
            <Button className="h-14 w-full text-[17px] font-semibold md:max-w-md">
              Quero o Método AFEE · R$ 16,18
            </Button>
            <p className="text-sm text-muted-foreground">
              Pagamento único · Garantia de 7 dias · Acesso imediato
            </p>
          </div>
        </div>
      </section>

      {/* Prévia temporária do Passo 10: no Passo 12 vai para a seção do método */}
      <section className="bg-background px-6 py-12">
        <div className="mx-auto max-w-xl">
          <p className="mb-2 text-xs font-semibold tracking-[0.12em] text-primary uppercase">
            O método
          </p>
          <h2 className="mb-6 text-[30px] leading-[1.1] md:text-5xl">
            Quatro fases. Uma lógica.
          </h2>
          <MetodoDiagrama />
        </div>
      </section>
    </main>
  );
}
