# Instagram · gerador de artes

Gera os carrosséis e imagens do Instagram (1080x1350 PNG) e as legendas.

- Textos e roteiro dos posts: `conteudo.mjs` (só relatos reais, sem promessa de resultado).
- Artes: `gerar.mjs` (HTML + Playwright). Preço lido de `src/config/produto.ts`.

```bash
NODE_PATH=$(npm root -g) node marketing/instagram/gerar.mjs 02         # semana 02 em marketing/instagram/saida/semana-02 (ignorada no git)
NODE_PATH=$(npm root -g) node marketing/instagram/gerar.mjs 02 <pasta> # semana 02 em outra pasta
```

Precisa do Playwright com Chromium instalado e internet para as fontes (Google Fonts).
