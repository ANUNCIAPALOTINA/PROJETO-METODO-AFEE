/**
 * Marca d'água discreta com o e-mail do aluno: texto em diagonal, bem leve,
 * ATRÁS do texto do capítulo (não reduz o contraste da leitura). Não bloqueia
 * clique, seleção nem cópia; é só dissuasão leve contra compartilhamento.
 * Escondida de leitores de tela (o e-mail já aparece no rodapé).
 */
export function MarcaDagua({ email }: { email: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute -inset-[40%] flex -rotate-[24deg] flex-wrap content-around justify-around gap-x-20 gap-y-28 font-sans text-sm text-foreground/[0.07]">
        {Array.from({ length: 24 }, (_, i) => (
          <span key={i} className="whitespace-nowrap">
            {email}
          </span>
        ))}
      </div>
    </div>
  );
}
