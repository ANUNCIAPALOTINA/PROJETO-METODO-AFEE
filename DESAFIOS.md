# Desafios conhecidos (resumo)
Versão completa na pasta compartilhada do projeto (`DESAFIOS.md`).

- `npm run typecheck` antes do `next build` (tipos vêm do `next typegen`).
- Mudar `vendas.conteudo.itens` quebra os testes do ebook.
- `workflow_dispatch` e `cron` só funcionam com o workflow na `main`.
- O `fetch` do Node e instagram.com são bloqueados no proxy da nuvem do Claude: chamadas reais rodam no GitHub Actions.
- Instagram dá 429 para coleta vinda do Actions: concorrentes só pelo PC do João.
- Robô publica, mas o plugin /instagram só responde comentários.
- Restrição de links até 09/11/2026: `publicar.mjs` bloqueia legenda com URL; post e Reel com 20 min de intervalo.
- Vídeo grátis: ffmpeg zoompan com uma frame por imagem (senão arquivos gigantes). Veo parado.
- Playwright: imagens via data URI (file:// não carrega); rodar com `NODE_PATH=$(npm root -g)`.
- Prévia do Netlify não abre da nuvem; teste logado só com o João.
