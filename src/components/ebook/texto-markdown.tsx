import { Fragment } from "react";
import { analisarMarkdown, type Inline } from "./markdown";

function Inlines({ itens }: { itens: Inline[] }) {
  return (
    <>
      {itens.map((item, i) => {
        if (item.tipo === "texto") return <Fragment key={i}>{item.texto}</Fragment>;
        if (item.tipo === "negrito") {
          return (
            <strong key={i} className="font-semibold text-foreground">
              <Inlines itens={item.filhos} />
            </strong>
          );
        }
        return (
          <em key={i}>
            <Inlines itens={item.filhos} />
          </em>
        );
      })}
    </>
  );
}

/**
 * Renderiza o markdown do capítulo. Só elementos React com texto
 * (escapado pelo React), nunca HTML cru.
 */
export function TextoMarkdown({ markdown }: { markdown: string }) {
  const blocos = analisarMarkdown(markdown);
  return (
    <>
      {blocos.map((bloco, i) =>
        bloco.tipo === "subtitulo" ? (
          <h2
            key={i}
            className="mt-12 mb-1 text-[26px] leading-[1.2] text-foreground md:text-[30px]"
          >
            <Inlines itens={bloco.filhos} />
          </h2>
        ) : (
          <p key={i} className="mt-6 first:mt-0">
            <Inlines itens={bloco.filhos} />
          </p>
        ),
      )}
    </>
  );
}
