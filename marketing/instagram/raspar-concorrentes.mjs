// Raspagem pública (sem login) dos alvos de targets.json com Playwright headless.
// Por perfil: bio, links da bio, últimos 6 posts (gancho/legenda/views) e produtos/preços achados nos links.
// Saída: data/concorrentes_raw.json. Uso: node marketing/instagram/raspar-concorrentes.mjs
// Roda melhor em IP residencial (PC do João): IPs de datacenter (GitHub Actions) levam 429 do Instagram.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { chromium } from "playwright";

const alvos = JSON.parse(readFileSync("targets.json", "utf8"));
const lista = Object.entries(alvos).flatMap(([grupo, us]) => us.map((u) => ({ grupo, u })));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const PRECO = /(R\$\s?\d{1,4}(?:[.,]\d{2})?|US?\$\s?\d{1,4}(?:[.,]\d{2})?|\d{1,4}[.,]\d{2}\s?(?:€|USD))/gi;
const VENDA = /hotmart|kiwify|eduzz|monetizze|pay\.|checkout|gumroad|stan\.store|linktr\.ee|beacons|bio\.site|lnk\.bio|carrd|programa|curso|ebook|app/i;

const navegador = await chromium.launch({ headless: true });
const ctx = await navegador.newContext({
  locale: "pt-BR",
  viewport: { width: 1280, height: 900 },
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
});
const pagina = await ctx.newPage();

async function perfil(u) {
  let dados = null;
  const ouvir = async (r) => {
    if (r.url().includes("web_profile_info") && r.ok()) dados = (await r.json().catch(() => null))?.data?.user ?? dados;
  };
  pagina.on("response", ouvir);
  try {
    const r = await pagina.goto(`https://www.instagram.com/${u}/`, { waitUntil: "domcontentloaded", timeout: 30000 });
    if (r?.status() === 429) throw new Error("429");
    for (let i = 0; i < 20 && !dados; i++) await espera(500);
    if (!dados) {
      // Plano B: pede a mesma resposta que a página usa, com o cookie de visitante já criado.
      const api = await pagina.request.get(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${u}`, {
        headers: { "x-ig-app-id": "936619743392459", referer: `https://www.instagram.com/${u}/` },
      });
      if (api.status() === 429) throw new Error("429");
      if (api.ok()) dados = (await api.json()).data?.user;
    }
    if (!dados) {
      // Plano C: só o resumo da meta tag (seguidores e bio curta).
      const meta = await pagina.locator('meta[property="og:description"]').getAttribute("content").catch(() => null);
      if (!meta) throw new Error("perfil não abriu (parede de login ou inexistente)");
      return { username: u, resumo_meta: meta, posts: [], links: [] };
    }
  } finally {
    pagina.off("response", ouvir);
  }
  const links = [...new Set([dados.external_url, ...(dados.bio_links ?? []).map((l) => l.url)].filter(Boolean))];
  const posts = (dados.edge_owner_to_timeline_media?.edges ?? []).slice(0, 6).map(({ node: n }) => {
    const legenda = n.edge_media_to_caption?.edges?.[0]?.node?.text ?? "";
    return {
      url: `https://www.instagram.com/p/${n.shortcode}/`,
      tipo: n.product_type === "clips" ? "Reel" : n.__typename === "GraphSidecar" ? "Carrossel" : n.is_video ? "Vídeo" : "Foto",
      data: new Date(n.taken_at_timestamp * 1000).toISOString().slice(0, 10),
      gancho: legenda.split("\n")[0].slice(0, 160),
      legenda: legenda.slice(0, 600),
      views: n.video_view_count ?? null,
      curtidas: n.edge_liked_by?.count ?? n.edge_media_preview_like?.count ?? null,
      comentarios: n.edge_media_to_comment?.count ?? null,
    };
  });
  return {
    username: dados.username,
    nome: dados.full_name,
    seguidores: dados.edge_followed_by?.count,
    posts_total: dados.edge_owner_to_timeline_media?.count,
    verificado: dados.is_verified,
    categoria: dados.category_name,
    bio: dados.biography,
    links,
    posts,
  };
}

async function produtos(url) {
  const p = await ctx.newPage();
  try {
    await p.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 });
    await espera(2500);
    const texto = (await p.locator("body").innerText().catch(() => "")).replace(/\s+/g, " ");
    const hrefs = await p.$$eval("a[href]", (as) => as.map((a) => ({ t: a.innerText.trim().slice(0, 80), h: a.href })));
    return {
      url,
      final: p.url(),
      titulo: await p.title(),
      precos: [...new Set(texto.match(PRECO) ?? [])].slice(0, 15),
      ofertas: hrefs.filter((a) => VENDA.test(a.h + " " + a.t)).slice(0, 15),
      trecho: texto.slice(0, 800),
    };
  } catch (e) {
    return { url, erro: e.message };
  } finally {
    await p.close();
  }
}

await pagina.goto("https://www.instagram.com/", { waitUntil: "domcontentloaded" }).catch(() => {});
const saida = { coletado_em: new Date().toISOString(), perfis: [], erros: [] };
for (const { grupo, u } of lista) {
  let feito = false;
  for (let tentativa = 1; tentativa <= 3 && !feito; tentativa++) {
    try {
      const p = await perfil(u);
      p.grupo = grupo;
      p.paginas_de_venda = [];
      for (const l of p.links.slice(0, 3)) p.paginas_de_venda.push(await produtos(l));
      saida.perfis.push(p);
      console.log(`✓ @${u}: ${p.seguidores ?? "?"} seguidores, ${p.posts.length} posts, ${p.links.length} links`);
      feito = true;
    } catch (e) {
      const pausa = e.message === "429" ? 60000 * tentativa : 5000;
      console.log(`… @${u} tentativa ${tentativa}: ${e.message}${tentativa < 3 ? `, espero ${pausa / 1000}s` : ""}`);
      if (tentativa === 3) saida.erros.push({ username: u, grupo, erro: e.message });
      else await espera(pausa);
    }
  }
  await espera(6000 + Math.random() * 6000);
}
await navegador.close();
mkdirSync("data", { recursive: true });
writeFileSync("data/concorrentes_raw.json", JSON.stringify(saida, null, 2));
console.log(`Salvo data/concorrentes_raw.json: ${saida.perfis.length} perfis, ${saida.erros.length} erros.`);
if (!saida.perfis.length) process.exit(1);
