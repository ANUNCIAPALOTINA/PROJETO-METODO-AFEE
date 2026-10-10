/**
 * Transforma um carrossel em Reel vertical (1080x1920, MP4) com ffmpeg: cada slide
 * aparece centralizado sobre o fundo da marca, com zoom lento e transição suave.
 * Uso: node marketing/instagram/reel.mjs <semana>/<post> [--voz] [--musica arquivo.mp3] [--pasta dir] [--saida x.mp4]
 *   --voz     narra o texto de cada slide com voz de IA grátis (edge-tts, pt-BR); o slide dura o tempo da fala.
 *   --musica  trilha de fundo (livre de direitos), em volume baixo sob a voz.
 * Artes padrão: saida/reel/semana-XX/<post> (gere antes com `gerar.mjs XX --reel`).
 * Saída padrão: public/instagram/semana-XX/<post>/reel.mp4 (URL pública para a API).
 */
import { execFileSync } from "node:child_process";
import { readdirSync, mkdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { semanas } from "./conteudo.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "../..");
const argv = process.argv.slice(2);
const opcao = (nome) => (argv.includes(nome) ? argv[argv.indexOf(nome) + 1] : undefined);
const chave = argv[0];
if (!chave?.includes("/")) throw new Error("Informe <semana>/<post>, ex. 01/02-quatro-fases");
const [semana, id] = chave.split("/");
const post = semanas[semana]?.find((p) => p.id === id);
if (!post) throw new Error(`Post ${chave} não existe em conteudo.mjs`);
const PASTA = resolve(opcao("--pasta") ?? join(AQUI, `saida/reel/semana-${semana}/${id}`));
const SAIDA = resolve(opcao("--saida") ?? join(RAIZ, `public/instagram/semana-${semana}/${id}/reel.mp4`));
const MUSICA = opcao("--musica");
const VOZ = argv.includes("--voz");
const VOZ_NOME = process.env.REEL_VOZ || "pt-BR-AntonioNeural";

const slides = readdirSync(PASTA).filter((f) => /^\d+\.png$/.test(f)).sort();
if (slides.length !== post.slides.length) throw new Error(`Esperava ${post.slides.length} PNG em ${PASTA}`);

// Texto falado de cada slide (o que está escrito nele).
function fala(s) {
  const juntar = (...t) => t.filter(Boolean).join(". ").replace(/\.\./g, ".");
  switch (s.tipo) {
    case "capa": return juntar(s.titulo, s.sub);
    case "texto": return juntar(s.titulo, s.corpo);
    case "lista": return juntar(s.titulo, ...s.itens.map(([k, v]) => `${k}: ${v}`));
    case "fase": return juntar(`Fase ${s.idx + 1}: ${s.nome}`, s.texto);
    case "relato": return juntar(s.texto, `${s.nome}, aluno. Resultado individual`);
    case "cta": return s.oferta ? "Método AFEE. Calistenia com direção. Link na bio." : juntar(s.titulo, "Método AFEE. Link na bio");
  }
}

const ffprobeDur = (f) => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());
const TMP = mkdtempSync(join(tmpdir(), "reel-"));
const BASE = 2.0;
const FADE = 0.25;
const FPS = 30;
const vozes = [];
const dur = post.slides.map((s, i) => {
  if (!VOZ) return BASE;
  const arq = join(TMP, `${i}.mp3`);
  execFileSync("edge-tts", ["--voice", VOZ_NOME, "--rate=+45%", "--text", fala(s), "--write-media", arq], { stdio: "ignore" });
  vozes.push(arq);
  return Math.max(BASE, ffprobeDur(arq) + 0.2);
});
const inicio = dur.map((_, i) => dur.slice(0, i).reduce((a, b) => a + b, 0) - i * FADE);
const total = inicio.at(-1) + dur.at(-1);

const entradas = slides.flatMap((f, i) => ["-loop", "1", "-t", dur[i].toFixed(2), "-i", join(PASTA, f)]);
const filtros = slides.map((_, i) => {
  const q = Math.round(dur[i] * FPS);
  return (
    `[${i}:v]scale=2160:-1,zoompan=z='1+0.04*on/${q}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${q}:s=1080x1350:fps=${FPS},` +
    `pad=1080:1920:0:285:color=0x0B0B0C,setsar=1,format=yuv420p[v${i}]`
  );
});
let anterior = "v0";
for (let i = 1; i < slides.length; i++) {
  const rotulo = i === slides.length - 1 ? "video" : `x${i}`;
  filtros.push(`[${anterior}][v${i}]xfade=transition=fade:duration=${FADE}:offset=${inicio[i].toFixed(2)}[${rotulo}]`);
  anterior = rotulo;
}

// Áudio: voz de cada slide no início dele + música em volume baixo (ou silêncio).
let n = slides.length;
const extras = [];
const mix = [];
vozes.forEach((v, i) => {
  extras.push("-i", v);
  filtros.push(`[${n}:a]adelay=${Math.round((inicio[i] + 0.08) * 1000)}:all=1[a${i}]`);
  mix.push(`[a${i}]`);
  n++;
});
if (MUSICA) {
  extras.push("-stream_loop", "-1", "-i", MUSICA);
  filtros.push(`[${n}:a]volume=${VOZ ? 0.12 : 0.4},afade=t=out:st=${(total - 1.5).toFixed(2)}:d=1.5[m]`);
  mix.push("[m]");
  n++;
}
if (!mix.length) {
  extras.push("-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo");
  mix.push(`[${n}:a]`);
}
filtros.push(`${mix.join("")}amix=inputs=${mix.length}:normalize=0,atrim=0:${total.toFixed(2)},aresample=44100[audio]`);

mkdirSync(dirname(SAIDA), { recursive: true });
execFileSync(
  "ffmpeg",
  [
    "-y", "-loglevel", "error", ...entradas, ...extras,
    "-filter_complex", filtros.join(";"),
    "-map", "[video]", "-map", "[audio]",
    "-c:v", "libx264", "-preset", "medium", "-crf", "21", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "128k", "-t", total.toFixed(2), "-movflags", "+faststart",
    SAIDA,
  ],
  { stdio: "inherit" },
);
console.log(`ok ${chave} → ${SAIDA} (${total.toFixed(1)} s${VOZ ? ", com voz" : ""}${MUSICA ? ", com música" : ""})`);
