# Ebook-app Método AFEE: estado (2026-10-07)

## O que é
Ebook interativo instalável (PWA): `index.html` autocontido (fotos embutidas, ~780 KB) + `manifest.webmanifest`, `sw.js`, ícones.
- Hospedado em HTTPS (site, Netlify, Vercel…), vira app: "Adicionar à tela inicial" e funciona offline depois da 1ª abertura.
- Aberto direto do computador (duplo clique), funciona como página, sem modo app.
- Prévia privada no claude.ai: artifact "Método AFEE" (https://claude.ai/artifact/MhZioYQWPKjibFSBvc4jmv).

## Conteúdo e recursos
- 12 capítulos com texto integral do `Metodo-AFEE-previa.pdf` (sem edição), aviso legal da seção 8 do guia.
- Livro dividido em 4 partes = A·F·E·E (caps 1–3, 4–6, 7–9, 10–12). Barra de progresso em degraus no topo.
- Cap 4 abre com a foto da parada de mão inteira (sem corte); cap 7 abre com termômetro animado (enche com a rolagem).
- Interativos: semana de treino (cap 4), duração força×resistência (cap 5), fases A·F·E·E (cap 6), termômetro (cap 7), alimentação (cap 8), "seu motivo" salvo no aparelho (cap 9), roteiro do dia com checklist (cap 10).
- Cronômetro AFEE (botão "Treino"): descansos 1:30/2:00/5:00 e 0:15/0:25/0:40, relógio do treino que avisa a hora do Exaustar, bipe + vibração, tela acesa.
- Progresso salvo no aparelho: capítulos lidos, "continuar de onde parou".

## Como editar
Fontes em `_fonte/`. Pipeline: `parse.py <pdf> chapters.json` → `build.py` (lê template.html, widgets.html, panel.html, app.js, chapters.json e as fotos de `src/fotos/` do kit) → `out/metodo-afee.html` (artifact) + `dist/` (app).
Configurações por capítulo (foto, citação de impacto, destaque, posição dos widgets) ficam no topo do `build.py`.

## Pendências
- Proteção de acesso pós-pagamento ainda não existe (link aberto = qualquer um com o link lê).
