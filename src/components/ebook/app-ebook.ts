/**
 * Prepara o HTML do ebook-app (src/content/ebook-app/index.html) para servir
 * a um aluno logado. Função pura: não lê arquivo nem checa acesso (isso é da rota).
 *
 * 1) Tira o que só serve ao modo "app instalável": manifest, ícones e o service
 *    worker. O service worker guardaria uma cópia do ebook no aparelho, que
 *    sobreviveria ao logout e escaparia da checagem de acesso. Modo offline fica
 *    para depois, com cache ligado ao login.
 * 2) Põe a marca d'água com o e-mail do aluno (mesma ideia do leitor antigo).
 *
 * Se o app for reconstruído e algo mudar, falha em voz alta em vez de servir
 * uma versão sem a limpeza ou sem a marca.
 */

const BLOCO_SERVICE_WORKER =
  /\/\* -+ app instalável[^\n]*\*\/\s*try\{[\s\S]*?serviceWorker[\s\S]*?\}catch\(e\)\{\}\s*/;

function escaparHtml(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function marcaDagua(email: string): string {
  const repeticoes = Array.from(
    { length: 40 },
    () => `<span>${escaparHtml(email)}</span>`,
  ).join("");
  return `<style>
.marca-dagua{position:fixed;inset:0;z-index:90;overflow:hidden;pointer-events:none;user-select:none}
.marca-dagua div{position:absolute;inset:-40%;display:flex;flex-wrap:wrap;align-content:space-around;justify-content:space-around;gap:110px 80px;transform:rotate(-24deg);font:500 13px/1 Inter,system-ui,sans-serif;color:rgba(128,128,128,.13)}
.marca-dagua span{white-space:nowrap}
</style>
<div class="marca-dagua" aria-hidden="true"><div>${repeticoes}</div></div>
`;
}

export function prepararAppEbook(html: string, email: string): string {
  let saida = html
    .replace(/<link rel="manifest"[^>]*>\s*/g, "")
    .replace(/<link rel="(?:icon|apple-touch-icon)"[^>]*>\s*/g, "")
    .replace(BLOCO_SERVICE_WORKER, "");

  if (/serviceWorker|rel="manifest"/.test(saida)) {
    throw new Error("ebook-app: sobrou service worker ou manifest depois da limpeza");
  }
  if (!saida.includes("</body>")) {
    throw new Error("ebook-app: HTML sem </body>, não dá para pôr a marca d'água");
  }
  saida = saida.replace("</body>", `${marcaDagua(email)}</body>`);
  return saida;
}
