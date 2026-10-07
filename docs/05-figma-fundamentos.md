# Método AFEE — Fundamentos no Figma (Passo 5)

Rascunho para aprovação. Arquivo do Figma: https://www.figma.com/design/nm9doWDDKQVdCoXqEa3cul

Conta: time "A equipe de BAZAR BAZAR" (e-mail `bazar.pna@gmail.com`), assento "View", plano Starter.
Nenhuma tela foi desenhada ainda. Isso começa no Passo 6.

---

## 1. Estrutura do arquivo

| Página | Seções | Estado |
|---|---|---|
| **Fundamentos** | Capa, Cores, Tipografia, Espaço e forma, Componentes, Vitrine de componentes | Pronta |
| Vendas | Telas da página de vendas, celular (390 px) e computador (1440 px) | Passo 6 |
| Sistema | Checkout, obrigado, entrar e leitor do ebook | Passos 7 e 8 |

Decisão: poucas páginas, com seções. O plano Starter pode limitar o número de páginas por arquivo.

---

## 2. Variáveis

O plano Starter aceita **só 1 modo por coleção**, então o par escuro/claro virou **duas coleções** com os mesmos nomes de variável. No código, isso vira dois temas.

| Coleção | Variáveis | Uso |
|---|---|---|
| Primitivas | 21 cores | Valores brutos, ocultas nos seletores |
| Cor · Escuro | 13 | Página de vendas, checkout, obrigado, entrar |
| Cor · Claro | 13 | Leitor do ebook |
| Forma | 12 | Espaçamentos (base de 4 px), raio de 2 px, bordas de 1 e 2 px |

As variáveis de cor semânticas apontam (alias) para as primitivas. Todas têm escopo definido (nenhuma em "todos os escopos") e sintaxe de código WEB.

### Mapa Figma → CSS (mesmos nomes do shadcn)

| Variável | CSS | Escuro | Claro |
|---|---|---|---|
| `background` | `--background` | `#0B0B0C` | `#FAF7F2` |
| `card` | `--card` | `#151517` | `#F1ECE3` |
| `card-elevated` | `--card-elevated` | `#1E1E21` | `#E2DBCE` |
| `border` | `--border` | `#2A2A2E` | `#E2DBCE` |
| `input` | `--input` | `#6B6B72` | `#857F72` |
| `foreground` | `--foreground` | `#F5F3EF` | `#1A1816` |
| `muted-foreground` | `--muted-foreground` | `#A7A39B` | `#5C574F` |
| `primary` | `--primary` | `#FF4D1F` | `#C73A12` |
| `primary-hover` | `--primary-hover` | `#FF6A3D` | `#A82F0D` |
| `primary-foreground` | `--primary-foreground` | `#0B0B0C` | `#FAF7F2` |
| `success` | `--success` | `#3DDC84` | `#12703A` |
| `destructive` | `--destructive` | `#FF5C5C` | `#B3261E` |
| `ring` | `--ring` | `#FF4D1F` | `#C73A12` |

Forma: `spacing/1` a `spacing/24` → `--space-1` a `--space-24` (4, 8, 12, 16, 24, 32, 48, 64, 96 px). `radius/padrao` → `--radius` (2 px). `stroke/fina` → `--stroke-thin` (1 px). `stroke/forte` → `--stroke-strong` (2 px).

---

## 3. Estilos de texto (15)

| Grupo | Estilos |
|---|---|
| Título (Space Grotesk Bold) | Hero, Seção e Subtítulo, cada um em Celular e Computador (40/72, 30/48, 22/28 px) |
| Venda (Inter) | Corpo Celular (17) e Computador (19), Pequeno (14), Botão (Semi Bold 17), Etiqueta (Semi Bold 12, caixa-alta) |
| Ebook (Literata) | Corpo Celular (18) e Computador (20), com linha de 175%, e Título do capítulo (Space Grotesk 28) |
| Marca | Logo (Space Grotesk Bold 56, espaçamento de -2%) |

As três fontes existem no Figma e não foi preciso trocar nenhuma.

---

## 4. Componentes

| Componente | Variantes | Observação |
|---|---|---|
| **Botão** | Estilo (Primário, Secundário) × Estado (Padrão, Hover, Desabilitado) = 6 | Altura de 56 px. Texto escuro sobre o laranja |
| **Campo de formulário** | Estado (Padrão, Foco, Erro) = 3 | Rótulo sempre visível. Erro com mensagem em texto, não só cor |
| **Cartão** | — | Fundo `card`, borda de 1 px |
| **Selo de garantia** | — | Número 7 em quadro laranja e texto |
| **Logo AFEE** | Tema (Escuro, Claro) = 2 | Letras mais a barra de 4 degraus |

Preenchimentos, bordas, espaçamentos e raios estão **ligados às variáveis**, não a valores fixos.

---

## 5. O que mudou em relação ao planejado

| Mudança | Motivo |
|---|---|
| Duas coleções de cor em vez de dois modos | O plano Starter limita cada coleção a 1 modo |
| Nova variável `input` (borda de campo) | A borda `#2A2A2E` dava contraste de 1,38 sobre o fundo, e o mínimo para o contorno de um campo é 3:1. A nova passa (3,45 no escuro, 3,72 no claro) |
| Sucesso, erro e hover próprios no tema claro | Os do tema escuro não têm contraste sobre o papel claro |
| `docs/03-identidade-visual.md` atualizado | Reflete as cores novas e a borda de campo |

---

## 6. Limites desta etapa

- Os componentes estão **só no tema escuro**, que é o da venda. O tema claro tem só o logo. Os componentes do leitor entram no Passo 8.
- O logo é um conceito em texto e barras. Se você quiser um desenho de marca mais elaborado, é um passo à parte.
- O arquivo está num time com assento "View". Funcionou para criar e editar, mas se o Figma passar a bloquear, é por isso.

---

## 7. Pendências

| # | Pendência | Quando |
|---|---|---|
| 1 | Aprovar os fundamentos (cores, tipos, componentes e logo) | Agora |
| 2 | Decidir se o arquivo fica no time do Bazar ou vai para outro lugar | Quando quiser |
