# Método AFEE — Identidade visual (Passo 3)

Rascunho para aprovação. Nada aqui foi para o código ainda, e o Figma só entra na Fase 2.
Os contrastes abaixo foram **calculados** (padrão WCAG), não estimados.

---

## 1. Decisões que sustentam este documento

| Item | Decisão |
|---|---|
| Fundo | Escuro na página de vendas, claro na área de leitura |
| Destaque | Laranja avermelhado |
| Títulos | Sem serifa geométrica, em negrito |
| Texto do ebook | Serifada de livro |
| Logo | Wordmark "AFEE" criado por mim |
| Formato | Cantos retos, bem marcados |

**Sensação geral:** intensidade e clareza. Fundo quase preto, luz quente das suas fotos, laranja só onde o olho precisa ir (botão, números, destaques). Pouco enfeite, muito contraste.

---

## 2. Cores

### 2.1 Tema escuro (vendas, checkout, obrigado, entrar)

| Papel | Nome | Código |
|---|---|---|
| Fundo | `ink` | `#0B0B0C` |
| Superfície (cartões) | `surface` | `#151517` |
| Superfície elevada | `surface-2` | `#1E1E21` |
| Borda | `line` | `#2A2A2E` |
| Texto principal | `text` | `#F5F3EF` |
| Texto suave | `text-muted` | `#A7A39B` |
| **Destaque** | `accent` | `#FF4D1F` |
| Destaque ao passar o mouse | `accent-hover` | `#FF6A3D` |
| Sucesso | `ok` | `#3DDC84` |
| Erro | `error` | `#FF5C5C` |

### 2.2 Tema claro (leitor do ebook)

| Papel | Nome | Código |
|---|---|---|
| Fundo (papel) | `paper` | `#FAF7F2` |
| Superfície | `paper-2` | `#F1ECE3` |
| Borda | `paper-line` | `#E2DBCE` |
| Texto principal | `ink-text` | `#1A1816` |
| Texto suave | `ink-muted` | `#5C574F` |
| **Destaque (links e detalhes)** | `accent-deep` | `#C73A12` |

O laranja vivo `#FF4D1F` **não é usado como texto sobre o papel claro**, porque não passa no contraste. No leitor entra a versão mais escura, `#C73A12`.

### 2.3 Contraste calculado

| Combinação | Razão | Resultado |
|---|---|---|
| Texto `#F5F3EF` sobre `#0B0B0C` | 17,75 | Passa (AAA) |
| Texto suave `#A7A39B` sobre `#0B0B0C` | 7,83 | Passa (AAA) |
| Texto suave sobre `#151517` | 7,26 | Passa (AAA) |
| Laranja `#FF4D1F` sobre `#0B0B0C` | 5,93 | Passa (AA) |
| Laranja sobre `#151517` | 5,50 | Passa (AA) |
| **Texto `#0B0B0C` sobre botão laranja** | **5,93** | **Passa (AA)** |
| Texto branco sobre botão laranja | 3,32 | **Reprovado** para texto normal |
| Texto `#1A1816` sobre `#FAF7F2` | 16,57 | Passa (AAA) |
| Texto suave `#5C574F` sobre `#FAF7F2` | 6,70 | Passa (AA) |
| `#C73A12` sobre `#FAF7F2` | 4,86 | Passa (AA) |
| Laranja vivo sobre `#FAF7F2` | 3,10 | **Reprovado** para texto |

**Regra decorrente:** o texto dos botões laranja é **escuro** (`#0B0B0C`), nunca branco.

### 2.4 Uso do laranja
- Botão de compra e botões principais.
- Letras e números do método (A, F, E, E, Termômetro).
- Detalhe fino (sublinhado, barra de progresso, ícones).
- **Fora disso, não.** Se tudo é laranja, nada se destaca.

---

## 3. Tipografia

| Uso | Fonte | Peso |
|---|---|---|
| Títulos (vendas e sistema) | **Space Grotesk** | 700 |
| Texto da página de vendas e interface | **Inter** | 400, 500, 600 |
| Corpo do texto do ebook | **Literata** | 400, 600 (e itálico) |

Todas gratuitas (Google Fonts), carregadas pelo Next.js junto ao site, sem pedido a servidor externo no navegador do cliente.

### 3.1 Escala (celular → computador)

| Nível | Celular | Computador | Linha |
|---|---|---|---|
| Hero (H1) | 40 px | 72 px | 1,05 |
| Título de seção (H2) | 30 px | 48 px | 1,1 |
| Subtítulo (H3) | 22 px | 28 px | 1,2 |
| Texto da venda | 17 px | 19 px | 1,6 |
| Texto pequeno / rodapé | 14 px | 14 px | 1,5 |
| **Texto do ebook** | **18 px** | **20 px** | **1,75** |

- Título em **caixa normal**, não em caixa-alta contínua. Caixa-alta fica só em etiquetas pequenas (ex.: "CALISTENIA · MÉTODO AFEE") com espaçamento entre letras.
- Largura máxima do texto do ebook: **65 caracteres** por linha.
- Mínimo de 16 px em campos de formulário, para o iPhone não dar zoom ao digitar.

---

## 4. Espaçamento, forma e profundidade

- **Base de 4 px.** Espaços usados: 4, 8, 12, 16, 24, 32, 48, 64, 96.
- **Cantos:** raio de **2 px** (retos, bem marcados). Sem pílulas, sem círculos em botões.
- **Bordas:** 1 px em cartões, **2 px** nos elementos de destaque (campo em foco, cartão do preço).
- **Profundidade:** sem sombras suaves. Elevação por **borda e mudança de superfície**. O cartão do preço tem uma borda laranja de 2 px.
- **Foco de teclado:** contorno de 2 px em laranja, com 2 px de afastamento. Sempre visível.

---

## 5. Componentes-base

### Botão principal
- Fundo `#FF4D1F`, texto `#0B0B0C`, peso 600, altura 56 px no celular, largura total.
- Hover: `#FF6A3D`. Pressionado: desloca 1 px para baixo.
- Desabilitado: fundo `surface-2`, texto `text-muted`.

### Botão secundário
- Sem preenchimento, borda de 1 px `line`, texto `text`. Hover: borda `text-muted`.

### Campo de formulário
- Fundo `surface`, borda de 1 px `line`, 56 px de altura, texto de 16 px.
- Foco: borda de 2 px laranja. Erro: borda `error` e mensagem **embaixo**, em texto, nunca só pela cor.
- Rótulo sempre visível acima do campo, nunca só como texto de exemplo.

### Cartão
- Fundo `surface`, borda de 1 px `line`, padding 24 px.

### Selo de garantia
- Ícone de escudo, "Garantia de 7 dias" e texto curto. Borda de 1 px.

---

## 6. Logo

**Conceito:** o nome **AFEE** em Space Grotesk 700, com espaçamento curto entre letras. Embaixo, uma **barra fina em quatro degraus crescentes**, cada um correspondendo a uma fase (Aquecer, Forçar, Estimular, Exaurir). Lembra a subida do termômetro do método.

| Versão | Uso |
|---|---|
| Completa (AFEE + barra) | Topo do site, rodapé, e-mail |
| Só as letras | Ícone de favorito e favicon |
| Texto "Método AFEE" em linha | Cabeçalho do leitor |

- Sobre o escuro: letras `#F5F3EF`, barra `#FF4D1F`.
- Sobre o claro: letras `#1A1816`, barra `#C73A12`.
- Entrego em SVG (nítido em qualquer tamanho) no Passo 5, no Figma.

---

## 7. Fotos e imagem

- **Tratamento:** sem filtro pesado. Só um degradê escuro por baixo (de transparente para `#0B0B0C`), para o texto ficar legível por cima.
- **Origem:** as 5 fotos enviadas têm a interface do Instagram (setas, bolinhas do carrossel). Vou **recortar essas bordas**. Se você tiver os originais, a qualidade melhora. O Passo 4 trata disso.
- Formato otimizado (WebP/AVIF), com tamanhos para celular e computador, para a página carregar rápido no 4G.
- Todas com **texto alternativo** descrevendo a cena.

---

## 8. Movimento

- Animações curtas (150 a 300 ms) e com função clara: aparecer ao rolar, o diagrama AFEE do 21st.dev, a barra de progresso do leitor.
- **Respeita a preferência "reduzir movimento"** do aparelho: nesse caso, nada se mexe.
- O diagrama animado do 21st.dev será adaptado: o centro vira o logo AFEE e os nós viram as quatro fases mais o Termômetro, com cantos retos e o laranja do destaque.

---

## 9. Adaptação do componente do 21st.dev

O componente enviado usa o padrão do shadcn (`bg-primary`, `bg-muted`, `border-border`). Mapeamento:

| shadcn | Valor no projeto |
|---|---|
| `--primary` | `#FF4D1F` |
| `--primary-foreground` | `#0B0B0C` |
| `--background` | `#0B0B0C` |
| `--foreground` | `#F5F3EF` |
| `--muted` / `--card` | `#151517` |
| `--muted-foreground` | `#A7A39B` |
| `--border` | `#2A2A2E` |
| `--radius` | `2px` |

Ajustes no componente: trocar `rounded-2xl` e `rounded-xl` por cantos retos, trocar os logos de Figma, Claude, shadcn, React, Motion e Tailwind pelos nós do método, e o botão "Learn more" por texto em português.

---

## 10. Pendências deste passo

| # | Pendência | Quando |
|---|---|---|
| 1 | Aprovar o conceito do logo (a versão visual sai no Figma) | Fase 2 |
| 2 | Originais das fotos, se tiver (sem a interface do Instagram) | Passo 4 |
