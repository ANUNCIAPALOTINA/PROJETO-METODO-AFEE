/**
 * Robô de postagem do Instagram (Graph API). Sem dependências: Node 20+.
 * Uso:
 *   node marketing/instagram/publicar.mjs verificar            → só lê: conta, permissões e limite de posts
 *   node marketing/instagram/publicar.mjs publicar             → publica o post de hoje (agenda.json)
 *   node marketing/instagram/publicar.mjs publicar 01/07-oferta → publica esse post
 * Variáveis: INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ACCOUNT_ID,
 *   SITE_URL (padrão https://metodo-afee.netlify.app), onde ficam os JPEG de public/instagram/.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { semanas } from "./conteudo.mjs";
import { precos } from "./precos.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const CONTA = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
const SITE = (process.env.SITE_URL || "https://metodo-afee.netlify.app").replace(/\/$/, "");
const [modo = "verificar", escolhido] = process.argv.slice(2);

if (!TOKEN || !CONTA) falhar("Faltam os segredos INSTAGRAM_ACCESS_TOKEN e/ou INSTAGRAM_BUSINESS_ACCOUNT_ID no GitHub.");
// Token do "Login do Instagram" começa com IGAA e usa graph.instagram.com; o do Facebook usa graph.facebook.com.
const API = TOKEN.startsWith("IG") ? "https://graph.instagram.com/v21.0" : "https://graph.facebook.com/v21.0";

function falhar(msg) {
  console.error(`ERRO: ${msg}`);
  process.exit(1);
}

async function graph(caminho, { metodo = "GET", campos = {} } = {}) {
  const url = new URL(`${API}/${caminho}`);
  const corpo = new URLSearchParams({ ...campos, access_token: TOKEN });
  if (metodo === "GET") url.search = corpo;
  const r = await fetch(url, metodo === "GET" ? {} : { method: metodo, body: corpo });
  const json = await r.json();
  if (json.error) throw new Error(`${json.error.message} (código ${json.error.code})`);
  return json;
}

async function verificar() {
  const conta = await graph(CONTA, { campos: { fields: "username,name" } });
  console.log(`Conta: @${conta.username} (${conta.name ?? "sem nome"})`);
  if (!TOKEN.startsWith("IG")) {
    try {
      const { data } = await graph("me/permissions");
      const dadas = data.filter((p) => p.status === "granted").map((p) => p.permission);
      console.log(`Permissões dadas: ${dadas.join(", ")}`);
      if (!dadas.includes("instagram_content_publish")) falhar("Falta a permissão instagram_content_publish.");
    } catch (e) {
      console.log(`(Não deu para listar as permissões: ${e.message})`);
    }
  }
  try {
    const { data } = await graph(`${CONTA}/content_publishing_limit`, { campos: { fields: "quota_usage,config" } });
    const uso = data?.[0];
    console.log(`Pode publicar: SIM. Posts nas últimas 24 h: ${uso?.quota_usage ?? 0} de ${uso?.config?.quota_total ?? 50}.`);
  } catch (e) {
    falhar(`Não pode publicar: ${e.message}. Falta a permissão instagram_content_publish.`);
  }
}

function postDeHoje() {
  if (escolhido) return escolhido;
  const hoje = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
  const agenda = JSON.parse(readFileSync(join(AQUI, "agenda.json"), "utf8"));
  if (!agenda[hoje]) {
    console.log(`Nada agendado para ${hoje}.`);
    process.exit(0);
  }
  return agenda[hoje];
}

async function esperarPronto(id) {
  for (let i = 0; i < 30; i++) {
    const { status_code } = await graph(id, { campos: { fields: "status_code" } });
    if (status_code === "FINISHED") return;
    if (status_code === "ERROR" || status_code === "EXPIRED") throw new Error(`Container ${id}: ${status_code}`);
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error(`Container ${id} não ficou pronto a tempo.`);
}

async function publicar() {
  const chave = postDeHoje();
  const [semana, id] = chave.split("/");
  const post = semanas[semana]?.find((p) => p.id === id);
  if (!post) falhar(`Post ${chave} não existe em conteudo.mjs.`);
  const legenda = post.legenda(precos);
  const imagens = post.slides.map((_, i) => `${SITE}/instagram/semana-${semana}/${id}/${String(i + 1).padStart(2, "0")}.jpg`);

  for (const url of imagens) {
    const r = await fetch(url, { method: "HEAD" });
    if (!r.ok || !String(r.headers.get("content-type")).includes("jpeg")) falhar(`Imagem fora do ar: ${url} (${r.status}). O site já foi publicado com public/instagram?`);
  }

  // Não publica duas vezes: compara com o começo da legenda dos últimos posts.
  const { data: recentes = [] } = await graph(`${CONTA}/media`, { campos: { fields: "caption", limit: "15" } });
  if (recentes.some((m) => m.caption?.slice(0, 80) === legenda.slice(0, 80))) {
    console.log(`Post ${chave} já está no Instagram. Nada a fazer.`);
    return;
  }

  let container;
  if (imagens.length === 1) {
    ({ id: container } = await graph(`${CONTA}/media`, { metodo: "POST", campos: { image_url: imagens[0], caption: legenda } }));
  } else {
    const filhos = [];
    for (const url of imagens) {
      const { id: filho } = await graph(`${CONTA}/media`, { metodo: "POST", campos: { image_url: url, is_carousel_item: "true" } });
      filhos.push(filho);
    }
    for (const f of filhos) await esperarPronto(f);
    ({ id: container } = await graph(`${CONTA}/media`, {
      metodo: "POST",
      campos: { media_type: "CAROUSEL", children: filhos.join(","), caption: legenda },
    }));
  }
  await esperarPronto(container);
  const { id: midia } = await graph(`${CONTA}/media_publish`, { metodo: "POST", campos: { creation_id: container } });
  const { permalink } = await graph(midia, { campos: { fields: "permalink" } });
  console.log(`Publicado ${chave}: ${permalink}`);
}

try {
  if (modo === "verificar") await verificar();
  else if (modo === "publicar") await publicar();
  else falhar(`Modo desconhecido: ${modo}. Use verificar ou publicar.`);
} catch (e) {
  falhar(e.message);
}
