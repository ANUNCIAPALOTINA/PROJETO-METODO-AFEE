# Método AFEE — Página de vendas no Figma, celular (Passo 6, parcial)

Arquivo: https://www.figma.com/design/nm9doWDDKQVdCoXqEa3cul (página **Vendas**).

**Estado:** construído, mas **sem conferência visual minha**. O Figma bloqueou as chamadas por limite de cota antes da imagem de verificação (assento "View" = 20 chamadas por mês, [documentação](https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/)).
**Decisão do autor:** parar o Figma aqui e continuar **direto no código**. O desktop (1440 px) e as telas do sistema (checkout, obrigado, entrar, leitor) ficam sem desenho no Figma e serão definidos no código.

---

## 1. O que existe na página Vendas

| Item | Detalhe |
|---|---|
| Página de celular, 390 px | 13 seções, na ordem aprovada |
| Componentes próprios | Item com marcador, Item de conteúdo, Fase do método, Pergunta frequente (Fechada e Aberta) |
| Componentes dos fundamentos reaproveitados | Botão, Selo de garantia, Logo AFEE |
| Fotos enviadas (8, servidor confirmou) | hero-noite, historia-barra, evolucao, metodo-parque, termometro-paradamao, sem-academia-mureta, faixa-grama, final-cta |
| Estado do botão fixo | Quadro separado, à esquerda da página |

### Ordem das seções

| # | Seção | Foto |
|---|---|---|
| 1 | Barra do topo (logo e "Entrar") | — |
| 2 | Hero | hero-noite (de fundo, com degradê) |
| 3 | Identificação | — |
| 4 | Minha história | historia-barra e evolucao |
| 5 | Método A·F·E·E e Termômetro | metodo-parque e termometro-paradamao |
| 6 | Sem academia, sem aparelho | sem-academia-mureta |
| 7 | O que tem dentro e bloco de preço (R$ 16,18) | — |
| 8 | Para quem é e para quem não é | — |
| 9 | Faixa de imagem | faixa-grama |
| 10 | Garantia de 7 dias | — |
| 11 | Perguntas frequentes | — |
| 12 | Chamada final | final-cta |
| 13 | Rodapé com aviso legal | — |

---

## 2. Decisões de design desta etapa

| Item | Decisão |
|---|---|
| Hero | Foto de fundo, degradê escuro embaixo, texto na parte de baixo |
| Botão de compra | No hero, no bloco de preço, na chamada final e fixo na base depois do hero |
| Preço | Só R$ 16,18, pagamento único, sem preço riscado |
| Conteúdo | Lista numerada com os 12 itens do ebook |
| Perguntas frequentes | Lista que abre e fecha, com a primeira aberta |
| Topo | Logo e um link "Entrar" para quem já comprou (acréscimo meu, para o login de volta) |

---

## 3. Pontos a conferir (ninguém olhou ainda)

- Alinhamento do logo reduzido na barra do topo e no rodapé.
- Altura do hero (720 px) com a foto e o texto por cima.
- Legibilidade do texto sobre a foto final (foto clara com degradê).
- Quebra de linha nos títulos e nas perguntas.
- **Perguntas frequentes 2 a 8** estão só no estado "Fechada", sem resposta visível. As respostas estão em `docs/01-oferta.md`, seção 9.
- Na FAQ, ficaram de fora as perguntas "O acesso expira?" e "Posso baixar o ebook em PDF?", que dependem de decisões suas.

---

## 4. O que NÃO foi feito no Figma

| Item | Onde passa a ser definido |
|---|---|
| Versão desktop (1440 px) da página de vendas | Código |
| Checkout, obrigado, entrar | Código |
| Leitor do ebook (tema claro) | Código |
| Foto `obrigado-noite` (foto 7) | Código, em `/obrigado` |
