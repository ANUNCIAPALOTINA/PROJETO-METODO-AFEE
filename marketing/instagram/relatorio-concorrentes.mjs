// Compila data/concorrentes_raw.json em RELATORIO-CONCORRENTES.md (estatística local + análise do Gemini).
import { readFileSync, writeFileSync } from "node:fs";

const raw = JSON.parse(readFileSync("data/concorrentes_raw.json", "utf8"));
const GEMINI = (process.env.GEMINI_API_KEY || "").trim();
const ps = raw.perfis.filter((p) => p.posts?.length);
const posts = ps.flatMap((p) => p.posts.map((x) => ({ ...x, conta: p.username, grupo: p.grupo, seg: p.seguidores })));
const top = [...posts].sort((a, b) => (b.views ?? b.curtidas * 20 ?? 0) - (a.views ?? a.curtidas * 20 ?? 0)).slice(0, 20);
const precos = raw.perfis.flatMap((p) => (p.paginas_de_venda ?? []).flatMap((v) => (v.precos ?? []).map((pr) => `@${p.username}: ${pr} (${v.titulo ?? v.url})`)));
const tipos = {};
for (const x of posts) tipos[x.tipo] = (tipos[x.tipo] ?? 0) + 1;

const md = [
  `# Relatório de concorrentes · ${raw.coletado_em.slice(0, 10)}\n`,
  `Fonte: data/concorrentes_raw.json (${raw.perfis.length} perfis lidos, ${raw.erros.length} com erro).\n`,
  `## Contas\n`,
  `| Conta | Grupo | Seguidores | Links na bio |`,
  `|---|---|---|---|`,
  ...raw.perfis.sort((a, b) => (b.seguidores ?? 0) - (a.seguidores ?? 0)).map((p) => `| @${p.username} | ${p.grupo === "brazil_competitors" ? "BR" : "Global"} | ${p.seguidores ?? "?"} | ${(p.links ?? []).join(" ") || "-"} |`),
  `\n## Formatos nos últimos posts\n`,
  ...Object.entries(tipos).map(([t, n]) => `- ${t}: ${n}`),
  `\n## Top 20 posts\n`,
  ...top.map((x, i) => `${i + 1}. @${x.conta} · ${x.tipo} · ${x.views ?? "?"} views · ${x.curtidas ?? "?"} curtidas · ${x.url}\n   > ${x.gancho}`),
  `\n## Preços encontrados nas páginas de venda\n`,
  ...(precos.length ? precos.map((p) => `- ${p}`) : ["- Nenhum preço visível nos links da bio."]),
];

if (GEMINI) {
  const lm = await (await fetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200", { headers: { "x-goog-api-key": GEMINI } })).json();
  const modelo = (lm.models ?? []).map((m) => m.name.replace(/^models\//, "")).filter((n) => /^gemini-\d+(\.\d+)?-flash$/.test(n)).sort().at(-1);
  const resumo = raw.perfis.map((p) => ({ u: p.username, g: p.grupo, seg: p.seguidores, bio: p.bio, links: p.links, vendas: (p.paginas_de_venda ?? []).map((v) => ({ t: v.titulo, precos: v.precos, trecho: v.trecho?.slice(0, 300) })), posts: p.posts.map((x) => ({ tipo: x.tipo, views: x.views, curtidas: x.curtidas, gancho: x.gancho })) }));
  const pedido = `Você é analista de marketing do Método AFEE: ebook de calistenia em PT-BR, R$ 16,18, entregue como app PWA interativo (cronômetro, Termômetro do descanso), método em 4 fases (Aquecer, Forçar, Estimular, Exaustar). Com os dados abaixo de concorrentes (BR e globais), escreva em PT-BR, direto, com seções:\n## Esteira de produtos (o que vendem, faixa de preço de ebooks/cursos/apps/consultoria)\n## Padrões de ganchos virais (com exemplos reais dos dados)\n## Brechas de posicionamento onde o AFEE se sobressai\n## 10 ganchos prontos para o @afee_calistenia\nRegras: só fatos dos dados (diga quando faltar), sem links no conteúdo (só "Link na bio"), sem promessa de resultado.\n\n${JSON.stringify(resumo).slice(0, 120000)}`;
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": GEMINI },
    body: JSON.stringify({ contents: [{ parts: [{ text: pedido }] }] }),
  });
  const j = await r.json();
  md.push(`\n# Análise (Gemini ${modelo})\n`, r.ok ? j.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") : `Gemini indisponível: ${j.error?.message}`);
}
writeFileSync("RELATORIO-CONCORRENTES.md", md.join("\n") + "\n");
console.log("Salvo RELATORIO-CONCORRENTES.md");
