// Gera uma cena de vídeo com o Veo (Gemini API) a partir de um prompt.
// Uso: node marketing/instagram/veo.mjs "<prompt>" <saida.mp4> [modelo] [segundos]
// Modelo padrão: veo-3.1-lite-generate-preview (o mais barato). Cobrança é por segundo no Google.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const limpar = (v) => (v || "").trim().replace(/^[A-Z_]+\s*=\s*/, "").replace(/^["']|["']$/g, "").trim();
const KEY = limpar(process.env.GEMINI_API_KEY);
const [prompt, saida, modelo = "veo-3.1-lite-generate-preview", seg = "6"] = process.argv.slice(2);
if (!KEY) throw new Error("Sem GEMINI_API_KEY");
if (!prompt || !saida) throw new Error('Uso: veo.mjs "<prompt>" <saida.mp4> [modelo] [segundos]');

const API = "https://generativelanguage.googleapis.com/v1beta";
const H = { "content-type": "application/json", "x-goog-api-key": KEY };
const REGRA = " Vertical 9:16. Sem rosto visível (mãos, silhueta ou contraluz). Sem texto, sem logos.";

const r = await fetch(`${API}/models/${modelo}:predictLongRunning`, {
  method: "POST",
  headers: H,
  body: JSON.stringify({
    instances: [{ prompt: prompt + REGRA }],
    parameters: { aspectRatio: "9:16", durationSeconds: Number(seg) },
  }),
});
const j = await r.json();
if (!r.ok) throw new Error(`Veo ${r.status}: ${j.error?.message}`);
console.log(`Veo ${modelo}: operação iniciada (${seg}s)`);

let op = j;
for (let i = 0; !op.done; i++) {
  if (i > 60) throw new Error("Veo demorou mais de 15 min");
  await new Promise((r) => setTimeout(r, 15000));
  op = await (await fetch(`${API}/${j.name}`, { headers: H })).json();
}
if (op.error) throw new Error(`Veo falhou: ${op.error.message}`);
const uri = op.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;
if (!uri) throw new Error(`Veo sem vídeo: ${JSON.stringify(op.response).slice(0, 300)}`);
const v = await fetch(uri, { headers: { "x-goog-api-key": KEY } });
if (!v.ok) throw new Error(`Download ${v.status}`);
mkdirSync(dirname(saida), { recursive: true });
writeFileSync(saida, Buffer.from(await v.arrayBuffer()));
console.log(`Salvo em ${saida}`);
