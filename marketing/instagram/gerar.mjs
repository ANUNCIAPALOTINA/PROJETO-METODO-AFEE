/**
 * Gera as artes do Instagram (1080x1350, PNG) a partir de conteudo.mjs.
 * Uso: node marketing/instagram/gerar.mjs [semana] [pasta-de-saida] [--publico]
 * Ex.: gerar.mjs 02 → marketing/instagram/saida/semana-02 (padrão: semana 01)
 * --publico: também grava JPEG em public/instagram/semana-XX/<post>/NN.jpg, que o site
 * serve em https://metodo-afee.netlify.app/instagram/... (a API do Instagram só aceita JPEG por URL).
 * Precisa do Playwright (Chromium). Fontes vêm do Google Fonts.
 */
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { semanas } from "./conteudo.mjs";
import { precos } from "./precos.mjs";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  ({ chromium } = require(join(process.execPath, "../../lib/node_modules/playwright")));
}

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "../..");
const ARGS = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const PUBLICO = process.argv.includes("--publico");
const SEMANA = ARGS[0] ?? "01";
if (!semanas[SEMANA]) throw new Error(`Semana ${SEMANA} não existe em conteudo.mjs`);
const SAIDA = resolve(ARGS[1] ?? join(AQUI, `saida/semana-${SEMANA}`));
const FOTOS = join(RAIZ, "public/fotos");
const PUBLICA = join(RAIZ, `public/instagram/semana-${SEMANA}`);


const esc = (s = "") => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
// Data URI: a página é aberta com setContent (about:blank), que não carrega file://.
const foto = (f) => `data:image/webp;base64,${readFileSync(join(FOTOS, f)).toString("base64")}`;

const logo = (tam) => `
  <div class="logo" style="font-size:${tam}px">
    <b>AFEE</b>
    <span class="degraus">${[0.071, 0.143, 0.214, 0.286].map((h) => `<i style="height:${h}em"></i>`).join("")}</span>
  </div>`;

const CSS = `
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1350px}
body{background:#0B0B0C;color:#F5F3EF;font-family:Inter,sans-serif;overflow:hidden}
.slide{position:relative;width:1080px;height:1350px;padding:96px 88px;display:flex;flex-direction:column;
  background:radial-gradient(circle at 85% 8%,rgba(255,77,31,.22),transparent 45%),linear-gradient(160deg,#0B0B0C 40%,#1F1F23)}
.grade::before{content:"";position:absolute;inset:0;pointer-events:none;
  background-image:linear-gradient(rgba(245,243,239,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(245,243,239,.07) 1px,transparent 1px);
  background-size:64px 64px;-webkit-mask-image:linear-gradient(180deg,#000 0%,transparent 75%)}
.etiqueta{font:600 32px Inter;letter-spacing:.12em;text-transform:uppercase;color:#FF4D1F;position:relative}
h1{font-family:"Space Grotesk";font-weight:700;letter-spacing:-.02em;line-height:1.05;position:relative}
.corpo{font:400 38px/1.45 Inter;color:#A7A39B;position:relative;max-width:860px}
.logo{display:inline-flex;flex-direction:column;gap:.107em}
.logo b{font-family:"Space Grotesk";font-weight:700;letter-spacing:-.02em;line-height:1}
.degraus{display:flex;align-items:flex-end;gap:.071em;width:100%}
.degraus i{flex:1;background:#FF4D1F;display:block}
.rodape{position:absolute;left:88px;right:88px;bottom:72px;display:flex;justify-content:space-between;align-items:flex-end;z-index:3}
.contador{font:600 30px Inter;letter-spacing:.12em;color:#A7A39B}
.arraste{font:600 30px Inter;letter-spacing:.12em;color:#F5F3EF;text-transform:uppercase}
.foto{position:absolute;inset:0;background-size:cover;background-position:center;z-index:0}
.foto::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,11,12,.15) 0%,rgba(11,11,12,.6) 48%,#0B0B0C 80%)}
.sobre{position:relative;z-index:2;margin-top:auto;margin-bottom:120px}
.quadro{width:300px;height:300px;border:4px solid #FF4D1F;display:flex;align-items:center;justify-content:center;
  font:700 230px "Space Grotesk";color:#FF4D1F;line-height:1}
.passos{display:flex;gap:12px;align-items:flex-end}
.passos i{width:56px;background:#2A2A2E;display:block}
.passos i.on{background:#FF4D1F}
.linha{display:flex;gap:32px;padding:26px 0;border-bottom:1px solid #2A2A2E;font:500 38px Inter}
.linha span:first-child{flex:0 0 260px;color:#FF4D1F;font-weight:600}
.aspas{font:700 220px/0.6 "Space Grotesk";color:#FF4D1F;height:110px}
.preco{font:700 150px "Space Grotesk";letter-spacing:-.03em;color:#F5F3EF;line-height:1}
.de{font:500 46px Inter;color:#A7A39B;text-decoration:line-through}
.botao{display:inline-block;background:#FF4D1F;color:#0B0B0C;font:700 40px "Space Grotesk";padding:28px 44px;border-radius:2px}
.itens{font:500 34px/1.9 Inter;color:#F5F3EF}
.itens b{color:#FF4D1F}
.aviso{font:400 30px Inter;color:#A7A39B}
`;

function rodape(i, total, formato, tipo) {
  const direita =
    formato === "carrossel"
      ? i === 0
        ? `<span class="arraste">Arraste →</span>`
        : `<span class="contador">${String(i + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}</span>`
      : "";
  return `<div class="rodape">${tipo === "cta" ? "<span></span>" : logo(44)}${direita}</div>`;
}

function corpoSlide(s) {
  switch (s.tipo) {
    case "capa":
      return `<div class="foto" style="background-image:url('${foto(s.foto)}');background-position:${s.posicao ?? "center"}"></div>
        <div class="sobre">
          <div class="etiqueta">${esc(s.etiqueta)}</div>
          <h1 style="font-size:96px;margin-top:28px">${esc(s.titulo)}</h1>
          ${s.sub ? `<p class="corpo" style="margin-top:32px;color:#F5F3EF">${esc(s.sub)}</p>` : ""}
        </div>`;
    case "texto":
      return `<div style="margin:auto 0;position:relative">
          <div class="etiqueta">${esc(s.etiqueta)}</div>
          <h1 style="font-size:${s.titulo.length > 60 ? 80 : 96}px;margin-top:36px">${esc(s.titulo)}</h1>
          ${s.corpo ? `<p class="corpo" style="margin-top:44px">${esc(s.corpo)}</p>` : ""}
        </div>`;
    case "lista":
      return `<div style="margin-top:40px;position:relative">
          <div class="etiqueta">${esc(s.etiqueta)}</div>
          <h1 style="font-size:84px;margin:28px 0 40px">${esc(s.titulo)}</h1>
          ${s.itens.map(([k, v]) => `<div class="linha"><span>${esc(k)}</span><span>${esc(v)}</span></div>`).join("")}
        </div>`;
    case "fase":
      return `<div style="margin:auto 0;position:relative">
          <div class="passos">${[1, 2, 3, 4].map((n, j) => `<i class="${j <= s.idx ? "on" : ""}" style="height:${n * 18}px"></i>`).join("")}</div>
          <div class="quadro" style="margin-top:56px">${s.letra}</div>
          <div class="etiqueta" style="margin-top:56px">Fase ${s.idx + 1} de 4</div>
          <h1 style="font-size:120px;margin-top:16px">${esc(s.nome)}</h1>
          <p class="corpo" style="margin-top:24px;font-size:44px">${esc(s.texto)}</p>
        </div>`;
    case "relato":
      return `<div style="margin:auto 0;position:relative">
          <div class="aspas">“</div>
          <h1 style="font-size:${s.texto.length > 80 ? 66 : 84}px;line-height:1.15;font-weight:500">${esc(s.texto)}</h1>
          <div class="etiqueta" style="margin-top:48px">${esc(s.nome)} · aluno</div>
          <p class="aviso" style="margin-top:20px">Resultado individual. Varia de pessoa para pessoa.</p>
        </div>`;
    case "cta":
      return `<div style="margin:auto 0;position:relative">
          ${logo(140)}
          <h1 style="font-size:${s.oferta ? 72 : 80}px;margin-top:64px">${s.oferta ? "Calistenia com direção." : esc(s.titulo)}</h1>
          <p class="itens" style="margin-top:36px"><b>■</b> 12 capítulos<br><b>■</b> Sem academia, sem aparelho<br><b>■</b> Acesso na hora · Pix ou cartão</p>
          <div style="margin-top:44px;display:flex;align-items:baseline;gap:28px">
            <span class="preco">${precos.preco}</span><span class="de">${precos.precoDe}</span>
          </div>
          <div class="botao" style="margin-top:40px">Link na bio →</div>
        </div>`;
  }
}

const html = (s, i, total, formato) => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
<style>${CSS}</style></head><body><div class="slide grade">${corpoSlide(s)}${rodape(i, total, formato, s.tipo)}</div></body></html>`;

const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 1080, height: 1350 } });
const legendas = [`# Legendas · Semana ${SEMANA}\n\nPreço lido de src/config/produto.ts: ${precos.preco} (de ${precos.precoDe}).\n`];

for (const post of semanas[SEMANA]) {
  const pasta = join(SAIDA, post.id);
  mkdirSync(pasta, { recursive: true });
  for (const [i, s] of post.slides.entries()) {
    await pagina.setContent(html(s, i, post.slides.length, post.formato), { waitUntil: "networkidle" });
    await pagina.evaluate(() => document.fonts.ready);
    const nome = String(i + 1).padStart(2, "0");
    await pagina.screenshot({ path: join(pasta, `${nome}.png`) });
    if (PUBLICO) {
      mkdirSync(join(PUBLICA, post.id), { recursive: true });
      await pagina.screenshot({ path: join(PUBLICA, post.id, `${nome}.jpg`), type: "jpeg", quality: 90 });
    }
  }
  const legenda = post.legenda(precos);
  writeFileSync(join(pasta, "legenda.txt"), legenda);
  legendas.push(`## ${post.dia} · ${post.id}\n\nFormato: ${post.formato} (${post.slides.length} ${post.slides.length > 1 ? "slides" : "imagem"}) · Objetivo: ${post.objetivo}\n\n\`\`\`\n${legenda}\n\`\`\`\n`);
  console.log("ok", post.id);
}
writeFileSync(join(SAIDA, "LEGENDAS.md"), legendas.join("\n"));
await navegador.close();
