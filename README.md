# Método AFEE — mapa do projeto

Venda do ebook **Método AFEE** (calistenia) por site próprio + Instagram **@afee_calistenia**.
Dono: João Garlet (não é programador, escreve em PT-BR). Leia também `AGENTES.md` e `DESAFIOS.md`.

## O que existe e onde
| Parte | Onde | Resumo |
|---|---|---|
| Site de vendas | `src/app/page.tsx`, `src/components/vendas/`, `src/content/vendas.ts` | Next.js 16 (App Router, ver `AGENTS.md`) |
| Checkout | `src/app/checkout`, `src/app/api/pagamentos`, `src/lib/pagamentos` | Mercado Pago (Pix e cartão), preço em `src/config/produto.ts` (R$ 16,18) |
| Webhook de pagamento | `src/app/api/webhooks/mercadopago` | libera acesso no Supabase |
| Login e acesso | `src/app/entrar`, `src/app/auth`, `src/lib/acesso`, `src/lib/supabase` | Supabase projeto **metodo-afee** |
| Ebook (app) | `src/app/ebook`, `src/content/ebook-app/`, `src/content/ebook/` | só para quem comprou |
| Banco | `supabase/migrations` | |
| Instagram: artes e legendas | `marketing/instagram/conteudo.mjs`, `gerar.mjs` | carrosséis 1080x1350 (Playwright) |
| Instagram: robô que publica | `marketing/instagram/publicar.mjs`, `agenda.json`, workflow `instagram.yml` | todo dia 19h BRT |
| Reels (vídeo grátis) | `reel.mjs`, `musica/compor.py`, workflow `reels.yml` | slides + zoom + voz + trilha própria |
| Ideias com IA | `ia.mjs`, workflow `ia.yml` (segundas) | Gemini principal |
| Concorrentes | `concorrentes.mjs`, `raspar-concorrentes.mjs`, workflow `concorrentes.yml` | coleta só funciona no PC do João |
| Veo (vídeo pago) | `veo.mjs`, `veo.yml`, `veo-teste.yml` | **parado** (faturamento cancelado) |
| Documentos do produto | `docs/01..06` | oferta, mapa do site, identidade, fotos, Figma |

Fora do repo, na pasta compartilhada do projeto (`/mnt/project-files`): `instagram/semana-XX/` (posts prontos), `instagram/editor-video/`, `marca/` (guia e logos), `ebook-app/`, `layout/`, `DESAFIOS.md` (versão longa).

## Como roda
```bash
npm ci
npm run dev        # site local
npm run typecheck  # antes do build (gera tipos do Next)
npm run lint && npm test
```
Deploy: Netlify publica a `main` automaticamente (produção). Robôs rodam no GitHub Actions.

## Segredos (só nomes; valores ficam no Netlify / GitHub Secrets, nunca no código ou no chat)
Site: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_WEBHOOK_SECRET`, `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`, `NEXT_PUBLIC_SITE_URL`.
Robôs: `INSTAGRAM_ACCESS_TOKEN` (vence ~09/12/2026), `INSTAGRAM_BUSINESS_ACCOUNT_ID`, `GEMINI_API_KEY`, `OPENAI_API_KEY` (opcional), `IG_RESERVA_SESSIONID`, `SITE_URL`. Variáveis: `GEMINI_MODELO`, `OPENAI_MODELO`, `REEL_VOZ`, `ROBO_INSTAGRAM`.

## Regras do João (obrigatórias)
- Tudo em **PT-BR**, respostas curtas, resultado pronto.
- **Sem links no Instagram até 09/11/2026** (legenda, comentário e direct). Use "link na bio". Nada de "comente X que eu te mando".
- **Gemini é a IA principal.** OpenAI só se a chave existir.
- **Nada pago sem avisar o João** (ele cancelou o faturamento do Veo; vídeo é grátis, feito dos slides).
- **Supabase: só o projeto `metodo-afee`.** Nunca tocar em outros projetos (ex.: bazar-local).
- Merge na `main` = produção: só com OK do João.
- Conteúdo só com relatos reais, sem promessa de resultado.
