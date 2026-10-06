# Método AFEE — Tratamento das fotos (Passo 4)

Rascunho para aprovação. As fotos tratadas estão em `assets/fotos/tratadas/` e as originais, intactas, em `assets/fotos/originais/`.
O processo é refeito por `scripts/tratar-fotos.py`, que lê uma pasta com as originais e gera tudo de novo.

---

## 1. Decisões que sustentam este documento

| Item | Decisão |
|---|---|
| Direitos | Você confirmou que pode usar as fotos comercialmente |
| Foto 10 (três imagens lado a lado) | É a sua própria evolução. Entra como "Minha evolução", sem datas |
| Tratamento | Só recorte e redução de tamanho. Sem filtro, sem retoque |
| Fotos que chegaram só no chat | Ficam de fora até virarem arquivo (ver seção 5) |

---

## 2. Onde cada foto entra

| Lugar na página | Arquivo tratado | Original | Tamanhos |
|---|---|---|---|
| Topo (hero) | `hero-noite` | 5.jpg | 450, 900 |
| Minha história | `historia-barra` | 2.webp (recortada) | 480, 812 |
| Minha história (evolução) | `evolucao` | 10.jpg | 540, 1080 |
| Método A·F·E·E | `metodo-parque` | 1.webp (recortada) | 480, 850 |
| "Sem academia, sem aparelho" | `sem-academia-mureta` | 8.jpg | 540, 800, 1080 |
| Termômetro (miniatura) | `termometro-paradamao` | 4.png | 240, 472 |
| Faixa larga antes da garantia | `faixa-grama` | 9.jpg (recortada em faixa) | 540, 800, 1080 |
| Chamada final | `final-cta` | 6.jpg | 540, 800, 1080 |
| Página `/obrigado` | `obrigado-noite` | 7.jpg | 450, 900 |

**Descartada:** a foto 3. A foto 6 é a mesma imagem, em tamanho maior e sem a interface do Instagram.

Todas em WebP, qualidade 82. As 21 versões somam **cerca de 790 KB**. O Next.js ainda serve AVIF quando o navegador aceita, na Fase 3.

---

## 3. O que foi feito em cada foto

| Foto | Tratamento |
|---|---|
| 1 | Recorte de 850×850 px. Tira a borda preta, a seta do carrossel (à direita) e as bolinhas (embaixo) |
| 2 | Recorte de 812×866 px. Tira a borda preta, as duas setas do carrossel e as bolinhas. **Perde um pedaço da sola do tênis**, o resto da cena fica inteiro |
| 9 | Recorte em faixa de 1080×450 px (21:9), centrado no corpo e na grama. O desfoque é da própria foto (câmera na altura da grama) |
| 4 | Sem alteração, só em duas larguras. É a menor das fotos (472 px), então **não pode passar de 240 px de largura na tela** |
| 5, 6, 7, 8, 10 | Sem recorte, só redução de tamanho. Nunca se amplia além do original |

Contraste com o texto: nas fotos com fundo claro (1, 6, 8, 9), qualquer texto por cima leva um degradê escuro por baixo, conforme o `03-identidade-visual.md`.

---

## 4. Texto alternativo (leitores de tela e SEO)

| Arquivo | Texto alternativo |
|---|---|
| `hero-noite` | Garlet, em pé à noite, de baixo para cima, com faixas nos pulsos, em pose de braço dobrado |
| `historia-barra` | Garlet pendurado numa barra com o corpo na horizontal e as pernas levantadas, contra o céu azul |
| `evolucao` | Minha evolução: três fotos lado a lado, do início do treino até hoje |
| `metodo-parque` | Garlet de lado, em um parque ao pôr do sol, com as mãos à frente |
| `sem-academia-mureta` | Garlet sentado na beirada de uma mureta de concreto, com as pernas estendidas, à beira de um lago |
| `termometro-paradamao` | Garlet em parada de mão no gramado |
| `faixa-grama` | Garlet fazendo flexão no gramado, visto de longe, ao pôr do sol |
| `final-cta` | Garlet de cabeça baixa, com as mãos juntas, no gramado ao pôr do sol |
| `obrigado-noite` | Garlet em pé à noite, de baixo para cima, em fundo escuro |

**Legenda da foto de evolução:** "Minha evolução". Sem datas e sem números de quilos, porque você não passou esses dados. Se quiser colocar tempo de treino, me diga.

---

## 5. Fotos que ficaram de fora

Chegaram **só pelo chat**, sem virar arquivo, e por isso não entram no site:
- Sentado na mureta com céu azul (parecida com a foto 8).
- Cinco poses noturnas: braço dobrado, de frente, braço levantado, olhando o bíceps e de costas.

Como incluir depois: subir os arquivos numa pasta do Google Drive e me passar o nome da pasta. Eu busco pelo conector e rodo `scripts/tratar-fotos.py`. Também precisaria dizer para que lugar cada uma vai.

---

## 6. Pendências deste passo

| # | Pendência | Quando |
|---|---|---|
| 1 | Fotos maiores, se existirem: as de 1 a 5 têm no máximo 941 px, e a página fica melhor com 1600 px ou mais nas fotos de topo | Quando quiser |
| 2 | Decidir se as 6 fotos que ficaram só no chat entram (via Drive) | Quando quiser |
| 3 | Dados da evolução para a legenda (tempo de treino, por exemplo), se quiser | Passo 12 |
