# Instagram · gerador de artes

Gera os carrosséis e imagens do Instagram (1080x1350 PNG) e as legendas.

- Textos e roteiro dos posts: `conteudo.mjs` (só relatos reais, sem promessa de resultado).
- Artes: `gerar.mjs` (HTML + Playwright). Preço lido de `src/config/produto.ts`.

```bash
NODE_PATH=$(npm root -g) node marketing/instagram/gerar.mjs 02         # semana 02 em marketing/instagram/saida/semana-02 (ignorada no git)
NODE_PATH=$(npm root -g) node marketing/instagram/gerar.mjs 02 <pasta> # semana 02 em outra pasta
```

Precisa do Playwright com Chromium instalado e internet para as fontes (Google Fonts).

## Reels (`reel.mjs`)

Transforma um carrossel em Reel 1080x1920 (MP4, ~20 s) com ffmpeg: `node marketing/instagram/reel.mjs 01/02-quatro-fases`. Grava em `public/instagram/semana-XX/<post>/reel.mp4` (URL pública para a API publicar com `media_type=REELS`).

Com voz e música: `gerar.mjs 01 --reel` e depois `reel.mjs 01/02-quatro-fases --voz --musica trilha.mp3` (precisa de `edge-tts` instalado). No GitHub: Actions → "Reels" → Run workflow, que grava os MP4 no branch.
