import { precoFormatado, produto } from "@/config/produto";

/** Resumo do que está sendo comprado. O preço vem do arquivo central do produto. */
export function ResumoPedido() {
  return (
    <aside
      aria-labelledby="resumo-titulo"
      className="rounded-[2px] border border-border bg-card p-6"
    >
      <h2 id="resumo-titulo" className="text-xl">
        Seu pedido
      </h2>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="font-medium">{produto.nome}</p>
          <p className="text-sm text-muted-foreground">
            Ebook · {produto.subtitulo}
          </p>
        </div>
        <p className="font-heading text-xl font-bold whitespace-nowrap">
          {precoFormatado}
        </p>
      </div>
      <ul className="mt-5 space-y-2 border-t border-border pt-5 text-[15px] text-muted-foreground">
        <li>Pagamento único, sem mensalidade.</li>
        <li>Acesso liberado assim que o pagamento for confirmado.</li>
        <li>Garantia de {produto.garantiaDias} dias.</li>
      </ul>
    </aside>
  );
}
