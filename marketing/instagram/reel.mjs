/**
 * Transforma um carrossel em Reel vertical (1080x1920, MP4) com ffmpeg: cada slide
 * aparece centralizado sobre o fundo da marca, com zoom lento e transição suave.
 * Uso: node marketing/instagram/reel.mjs <semana>/<post> [pasta-das-artes] [saida.mp4]
 * Ex.: reel.mjs 01/02-quatro-fases → public/instagram/semana-01/02-quatro-fases/reel.mp4
 * As artes (NN.png) vêm de gerar.mjs; padrão: marketing/instagram/saida/semana-XX/<post>.
 */
import { execFileSync } from "node:child_process";
import { readdirSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "../..");
const [chave, pastaArg, saidaArg] = process.argv.slice(2);
if (!chave?.includes("/")) throw new Error("Informe <semana>/<post>, ex. 01/02-quatro-fases");
const [semana, id] = chave.split("/");
const PASTA = resolve(pastaArg ?? join(AQUI, `saida/semana-${semana}/${id}`));
const SAIDA = resolve(saidaArg ?? join(RAIZ, `public/instagram/semana-${semana}/${id}/reel.mp4`));

const slides = readdirSync(PASTA).filter((f) => /^\d+\.png$/.test(f)).sort();
if (slides.length < 2) throw new Error(`Reel precisa de 2+ slides em ${PASTA}`);

const SEG = 3.2; // segundos por slide
const FADE = 0.4;
const FPS = 30;
const quadros = Math.round(SEG * FPS);

const entradas = slides.flatMap((f) => ["-loop", "1", "-t", String(SEG), "-i", join(PASTA, f)]);
// Cada slide: zoom de 1.00 a 1.04 centralizado, sobre fundo #0B0B0C 1080x1920.
const filtros = slides.map(
  (_, i) =>
    `[${i}:v]scale=2160:-1,zoompan=z='1+0.04*on/${quadros}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${quadros}:s=1080x1350:fps=${FPS},` +
    `pad=1080:1920:0:285:color=0x0B0B0C,setsar=1,format=yuv420p[v${i}]`,
);
let anterior = "v0";
slides.slice(1).forEach((_, j) => {
  const i = j + 1;
  const rotulo = i === slides.length - 1 ? "saida" : `x${i}`;
  filtros.push(`[${anterior}][v${i}]xfade=transition=fade:duration=${FADE}:offset=${(i * (SEG - FADE)).toFixed(2)}[${rotulo}]`);
  anterior = rotulo;
});
const duracao = slides.length * SEG - (slides.length - 1) * FADE;

mkdirSync(dirname(SAIDA), { recursive: true });
execFileSync(
  "ffmpeg",
  [
    "-y", "-loglevel", "error",
    ...entradas,
    "-f", "lavfi", "-t", duracao.toFixed(2), "-i", "anullsrc=r=44100:cl=stereo",
    "-filter_complex", filtros.join(";"),
    "-map", "[saida]", "-map", `${slides.length}:a`,
    "-c:v", "libx264", "-preset", "medium", "-crf", "21", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "128k", "-shortest", "-movflags", "+faststart",
    SAIDA,
  ],
  { stdio: "inherit" },
);
console.log(`ok ${chave} → ${SAIDA} (${duracao.toFixed(1)} s)`);
