// Leitor de concorrentes do Instagram. Usa a API oficial quando o token é EAA; senão, Playwright sem login (a conta da AFEE nunca é usada).
// Uso: node marketing/instagram/concorrentes.mjs
// Lê as contas de concorrentes.json pela Business Discovery da Graph API, ranqueia os posts
// por engajamento relativo ao tamanho da conta e grava concorrentes/relatorio-AAAA-MM-DD.md.
// Com GEMINI_API_KEY, o Gemini resume padrões e sugere 5 posts no estilo AFEE.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const limpar = (v) => (v || "").trim().replace(/^[A-Z_]+\s*=\s*/, "").replace(/^["']|["']$/g, "").trim();
const TOKEN = limpar(process.env.INSTAGRAM_ACCESS_TOKEN);
const CONTA_INFORMADA = limpar(process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID);
const GEMINI = limpar(process.env.GEMINI_API_KEY);
const API = "https://graph.facebook.com/v21.0";
const { contas } = JSON.parse(readFileSync(join(AQUI, "concorrentes.json"), "utf8"));
const hoje = new Date().toISOString().slice(0, 10);

// A Business Discovery só existe na API do Facebook (token EAA...). Sem ele, coleta pública com Playwright, sem login.
const OFICIAL = TOKEN && !TOKEN.startsWith("IG");
console.log(OFICIAL ? "Fonte: API oficial (Business Discovery)." : "Fonte: página pública do Instagram via Playwright, sem login.");

async function graph(caminho, campos) {
  const url = new URL(`${API}/${caminho}`);
  url.search = new URLSearchParams({ ...campos, access_token: TOKEN });
  const j = await (await fetch(url)).json();
  if (j.error) throw new Error(`${j.error.message} (código ${j.error.code})`);
  return j;
}

async function minhaConta() {
  if (CONTA_INFORMADA) return CONTA_INFORMADA;
  const { data = [] } = await graph("me/accounts", { fields: "instagram_business_account{id,username}" });
  const c = data.map((p) => p.instagram_business_account).filter(Boolean);
  return (c.find((x) => /afee/i.test(x.username)) ?? c[0])?.id ?? (() => { throw new Error("Nenhuma conta do Instagram no token."); })();
}

const EU = OFICIAL ? await minhaConta() : null;
const web = OFICIAL ? null : await (await import("./coletar-web.mjs")).abrirColetor();
const perfis = [];
for (const u of contas) {
  try {
    const campos = `business_discovery.username(${u}){username,followers_count,media_count,media.limit(25){caption,like_count,comments_count,media_type,media_product_type,timestamp,permalink}}`;
    const b = OFICIAL ? (await graph(EU, { fields: campos })).business_discovery : await web.ler(u);
    const posts = (b.media?.data ?? []).map((m) => ({
      ...m,
      conta: b.username,
      seguidores: b.followers_count,
      taxa: ((m.like_count ?? 0) + 3 * (m.comments_count ?? 0)) / Math.max(b.followers_count, 1),
    }));
    perfis.push({ ...b, posts });
    console.log(`@${u}: ${b.followers_count} seguidores, ${posts.length} posts lidos`);
  } catch (e) {
    console.log(`@${u}: não lido (${e.message})`);
  }
  await new Promise((r) => setTimeout(r, OFICIAL ? 1500 : 8000 + Math.random() * 7000)); // educado com o limite de chamadas
}
await web?.fechar();

const formato = (m) => (m.media_product_type === "REELS" ? "Reel" : m.media_type === "CAROUSEL_ALBUM" ? "Carrossel" : m.media_type === "VIDEO" ? "Vídeo" : "Foto");
const todos = perfis.flatMap((p) => p.posts).sort((a, b) => b.taxa - a.taxa);
const top = todos.slice(0, 15);
const porFormato = {};
for (const m of todos) (porFormato[formato(m)] ??= []).push(m.taxa);
const media = (a) => a.reduce((s, x) => s + x, 0) / a.length;

const linhas = [
  `# Concorrentes · ${hoje}\n`,
  `Fonte: ${OFICIAL ? "API oficial (Business Discovery)" : "página pública via Playwright, sem login"}. Engajamento = (curtidas + 3×comentários) ÷ seguidores.\n`,
  `## Contas\n`,
  `| Conta | Seguidores | Posts | Engajamento médio |`,
  `|---|---|---|---|`,
  ...perfis.map((p) => `| @${p.username} | ${p.followers_count} | ${p.media_count} | ${p.posts.length ? (media(p.posts.map((m) => m.taxa)) * 100).toFixed(2) + "%" : "-"} |`),
  `\n## Formato que mais engaja\n`,
  ...Object.entries(porFormato).sort((a, b) => media(b[1]) - media(a[1])).map(([f, t]) => `- ${f}: ${(media(t) * 100).toFixed(2)}% (${t.length} posts)`),
  `\n## Top 15 posts\n`,
  ...top.map((m, i) => `${i + 1}. **@${m.conta}** · ${formato(m)} · ${(m.taxa * 100).toFixed(2)}% · ${m.like_count ?? "?"} curtidas, ${m.comments_count} coment.${m.views ? ` · ${m.views} views` : ""} · ${m.timestamp.slice(0, 10)} · ${m.permalink}\n   > ${(m.caption ?? "").replace(/\s+/g, " ").slice(0, 220)}`),
];

if (GEMINI && top.length) {
  try {
    const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200", { headers: { "x-goog-api-key": GEMINI } });
    const modelo = ((await r.json()).models ?? []).map((m) => m.name.replace(/^models\//, "")).filter((n) => /^gemini-\d+(\.\d+)?-flash$/.test(n)).sort().at(-1);
    const pedido = `Você analisa concorrentes de calistenia para o @afee_calistenia, que vende o ebook Método AFEE (Aquecer, Forçar, Estimular, Exaustar + Termômetro do descanso). Abaixo, os posts que mais engajaram nas contas concorrentes. Em português do Brasil, curto: 1) 5 padrões que explicam o engajamento (gancho, formato, tema, CTA); 2) 5 ideias de post para o AFEE inspiradas nesses padrões, sem copiar, cada uma com gancho do 1º slide e formato. Regras: sem links nem "comente que eu mando o link" (só "Link na bio"), sem promessa de resultado.\n\n${top.map((m) => `- ${formato(m)}, ${(m.taxa * 100).toFixed(2)}%: ${(m.caption ?? "").slice(0, 300)}`).join("\n")}`;
    const g = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": GEMINI },
      body: JSON.stringify({ contents: [{ parts: [{ text: pedido }] }] }),
    });
    const j = await g.json();
    if (!g.ok) throw new Error(j.error?.message);
    linhas.push(`\n## Análise do Gemini (${modelo})\n`, j.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "");
  } catch (e) {
    linhas.push(`\n(Gemini indisponível: ${e.message})`);
  }
}

mkdirSync(join(AQUI, "concorrentes"), { recursive: true });
writeFileSync(join(AQUI, "concorrentes", `relatorio-${hoje}.md`), linhas.join("\n") + "\n");
writeFileSync(join(AQUI, "concorrentes", "ultimo.md"), linhas.join("\n") + "\n");
console.log(`Relatório: marketing/instagram/concorrentes/relatorio-${hoje}.md (${perfis.length}/${contas.length} contas)`);
if (!perfis.length) process.exit(1);
