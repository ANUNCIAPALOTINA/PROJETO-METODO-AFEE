// Assistentes externos (Gemini e ChatGPT) para o marketing do Método AFEE.
// Uso: node marketing/instagram/ia.mjs [semana]  (sem semana = a mais nova)
// Gera marketing/instagram/ia/sugestoes-semana-XX.md com ganchos e legendas
// alternativas para cada post. Só roda com GEMINI_API_KEY e/ou OPENAI_API_KEY;
// sem chave, avisa e sai sem erro. Nada é publicado: é material para revisão.
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { semanas } from "./conteudo.mjs";
import { precos } from "./precos.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const semana = process.argv[2] ? process.argv[2].padStart(2, "0") : Object.keys(semanas).sort().at(-1);
const posts = semanas[semana];
if (!posts) throw new Error(`Semana ${semana} não existe em conteudo.mjs`);

// Limpa a chave colada com espaço, aspas ou "GEMINI_API_KEY=" na frente.
const limpar = (v) => (v || "").trim().replace(/^[A-Z_]+\s*=\s*/, "").replace(/^["']|["']$/g, "").trim();
const GEMINI = limpar(process.env.GEMINI_API_KEY);
const OPENAI = limpar(process.env.OPENAI_API_KEY);
let GEMINI_MODELO = process.env.GEMINI_MODELO || "";
const OPENAI_MODELO = process.env.OPENAI_MODELO || "gpt-4.1-mini";

if (GEMINI) console.log(`Chave Gemini: ${GEMINI.length} caracteres, começa com "${GEMINI.slice(0, 3)}"${/\s/.test(GEMINI) ? ", TEM ESPAÇO NO MEIO" : ""}`);
if (!GEMINI && !OPENAI) {
  console.log("Sem GEMINI_API_KEY e sem OPENAI_API_KEY: Gemini e ChatGPT não estão em uso.");
  process.exit(0);
}

const REGRAS = `Você ajuda a divulgar o Método AFEE, ebook de calistenia em português (A·F·E·E = Aquecer, Forçar, Estimular, Exaustar, mais o Termômetro do descanso). Preço ${precos.preco} (de ${precos.precoDe}). Regras: português do Brasil, tom direto e simples; nunca prometa resultado ("perca X kg", "garantido", prazos); relatos só com o texto dado e com "Resultado individual"; sem urgência falsa; CTA "Link na bio" ou "comente MÉTODO".`;

function pedido(post) {
  const slides = post.slides.map((s, i) => `${i + 1}. ${[s.etiqueta, s.titulo, s.corpo, s.texto, s.nome].filter(Boolean).join(" | ")}`).join("\n");
  return `${REGRAS}\n\nPost "${post.id}" (${post.formato}, objetivo: ${post.objetivo}).\nSlides:\n${slides}\n\nLegenda atual:\n${post.legenda(precos)}\n\nResponda em markdown curto:\n- 5 ganchos alternativos para a capa (até 12 palavras cada)\n- 1 legenda alternativa (até 80 palavras, mesmas regras)\n- 1 roteiro de Reel de até 25 s, cena por cena`;
}

// Sem GEMINI_MODELO, escolhe sozinho o Flash mais novo disponível para a chave
// (o Google aposenta modelos antigos para contas novas).
async function escolherModeloGemini() {
  const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200", { headers: { "x-goog-api-key": GEMINI } });
  const j = await r.json();
  if (!r.ok) throw new Error(`Gemini ${r.status}: ${j.error?.message}`);
  const versao = (n) => Number(n.match(/gemini-(\d+(?:\.\d+)?)/)?.[1] ?? 0);
  const flash = (j.models ?? [])
    .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
    .map((m) => m.name.replace(/^models\//, ""))
    .filter((n) => /^gemini-\d+(\.\d+)?-flash$/.test(n))
    .sort((a, b) => versao(b) - versao(a));
  if (!flash.length) throw new Error("Nenhum modelo Gemini Flash disponível para esta chave");
  return flash[0];
}

async function gemini(texto) {
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODELO}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": GEMINI },
    body: JSON.stringify({ contents: [{ parts: [{ text: texto }] }] }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`Gemini ${r.status}: ${j.error?.message}`);
  return j.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
}

async function chatgpt(texto) {
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${OPENAI}` },
    body: JSON.stringify({ model: OPENAI_MODELO, messages: [{ role: "user", content: texto }] }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`ChatGPT ${r.status}: ${j.error?.message}`);
  return j.choices?.[0]?.message?.content ?? "";
}

if (GEMINI && !GEMINI_MODELO) GEMINI_MODELO = await escolherModeloGemini();
if (GEMINI) console.log(`Modelo Gemini: ${GEMINI_MODELO}`);

const saida = [`# Sugestões de IA · semana ${semana}\n\nGerado por ${[GEMINI && `Gemini (${GEMINI_MODELO})`, OPENAI && "ChatGPT"].filter(Boolean).join(" e ")}. Material para revisão: nada aqui é publicado sozinho.\n`];
for (const post of posts) {
  saida.push(`\n## ${post.id}\n`);
  for (const [nome, fn, ok] of [["Gemini", gemini, GEMINI], ["ChatGPT", chatgpt, OPENAI]]) {
    if (!ok) continue;
    try {
      saida.push(`\n### ${nome}\n\n${(await fn(pedido(post))).trim()}\n`);
    } catch (e) {
      saida.push(`\n### ${nome}\n\nFalhou: ${e.message}\n`);
      console.error(`${post.id} ${nome}: ${e.message}`);
    }
  }
  console.log(`ok ${post.id}`);
}
mkdirSync(join(AQUI, "ia"), { recursive: true });
const arq = join(AQUI, "ia", `sugestoes-semana-${semana}.md`);
writeFileSync(arq, saida.join(""));
console.log(`Salvo em ${arq}`);
