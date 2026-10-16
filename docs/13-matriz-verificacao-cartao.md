# Verificação independente — matriz de testes do checkout de cartão

**Tarefa:** `t_94773fc7` (maestro) · **Data:** 2026-10-16
**Objeto verificado:** o fluxo de cartão do Método AFEE, no estado em que foi entregue (commit local `a0681f3`, que contém exatamente a árvore que eu testei)
**Ambiente:** servidor local (`npm run dev` em `http://localhost:3001`), credenciais **de teste** do Mercado Pago lidas de `.env.local` (prefixo `TEST-`), **cartões oficiais de teste** do MP
**Regra seguida:** nenhum cartão real; nenhum número de cartão, CVV, CPF real ou token completo aparece neste relatório, no repositório ou nos registros do quadro. Nada foi publicado e nenhum merge na `main`.

## 1. Veredito

O que estava quebrado (tokenização do cartão) **está corrigido e provado de ponta a ponta**: pagamento aprovado chega a `/obrigado`, pagamento recusado volta como **recusa financeira (HTTP 402)** com mensagem específica, dados inválidos como **400**, falha técnica como **502** — três caminhos distintos, todos exercitados com a API real do MP em modo de teste.

Ficam **4 lacunas** (§5) e **1 divergência de repositório** (§6). Nenhuma delas bloqueia a homologação, mas nenhuma deve passar batido.

## 2. Portões de qualidade (executados por mim, na árvore commitada)

| Verificação | Comando | Resultado |
|---|---|---|
| Testes | `npm test` | **135 testes / 15 arquivos**, todos passando |
| Tipos | `npm run typecheck` | OK |
| Lint | `npm run lint` | OK (zero erros) |
| Build | `npm run build` | OK — `/checkout`, `/obrigado`, `/api/pagamentos`, `/api/pagamentos/[id]/status`, `/api/webhooks/mercadopago` presentes |

Rodei os quatro **duas vezes**: antes e depois do commit `a0681f3`, na árvore limpa. Mesmo resultado.

## 3. Matriz de cenários oficiais (API real de teste, via `POST /api/pagamentos`)

Os cenários oficiais do MP são escolhidos pelo **nome do titular** no cartão de teste. Cada linha foi um pagamento real no sandbox, com token real gerado pelo MP e conferência do pagamento na API de volta.

| Cenário (titular) | HTTP da nossa API | Situação devolvida | `status_detail` no MP | Mensagem exibida ao comprador |
|---|---|---|---|---|
| `APRO` | 201 | aprovado | `accredited` | — (segue para `/obrigado`) |
| `CONT` | 201 | analise | `pending_contingency` | — (tela "Pagamento em análise") |
| `OTHE` | **402** | recusado | `cc_rejected_other_reason` | O banco não autorizou o pagamento… |
| `CALL` | **402** | recusado | `cc_rejected_call_for_authorize` | O banco pediu autorização… |
| `FUND` | **402** | recusado | `cc_rejected_insufficient_amount` | Saldo insuficiente no cartão. |
| `SECU` | **402** | recusado | `cc_rejected_bad_filled_security_code` | Confira o código de segurança. |
| `EXPI` | **402** | recusado | `cc_rejected_bad_filled_date` | Confira a validade do cartão. |
| `FORM` | **402** | recusado | `cc_rejected_bad_filled_other` | Confira os dados do cartão. |
| `DUPL` | **402** | recusado | `cc_rejected_duplicated_payment` | Já existe um pagamento igual em andamento… |
| `LOCK` | **402** | recusado | `cc_rejected_card_disabled` | Cartão desabilitado… |
| `CTNA` | **402** | recusado | `cc_rejected_card_type_not_allowed` | Este tipo de cartão não é aceito… |
| `BLAC` | **402** | recusado | `cc_rejected_blacklist` | O banco bloqueou este pagamento por segurança… |
| `ATTE` | **402** | recusado | `cc_rejected_max_attempts` | Muitas tentativas com este cartão… |
| `CARD` | **402** | recusado | `cc_rejected_bad_filled_card_number` | Confira o número do cartão. |
| `TEST` | **402** | recusado | `cc_rejected_bad_filled_card_number` | Confira o número do cartão. |
| `UNSU` | **402** | recusado | `cc_rejected_other_reason` | O banco não autorizou o pagamento… |
| **`INST`** | **402** | recusado | `cc_rejected_invalid_installments` | **frase genérica** (detalhe não mapeado — ver §5.1) |

Valor cobrado em todas elas: **R$ 16,18**, igual ao preço do produto (`src/config/produto.ts:14`, `precoCentavos: 1618`). Nenhum cenário cobrou valor diferente, inclusive com 2 parcelas.

**Distinção recusa × falha técnica, conferida ao vivo:**

| Situação | HTTP | Corpo | Observação |
|---|---|---|---|
| Recusa do banco | **402** | `{situacao:"recusado", mensagem:…}` | era `201` antes da correção |
| Token de cartão inexistente (erro técnico) | **502** | `{erro:"mp_indisponivel", mensagem:"…Nada foi cobrado."}` | distinto do 402 |
| CPF inválido | **400** | `{erro:"dados_invalidos", erros:{cpf:…}}` | campo a campo |
| Sem bandeira identificada | **400** | `erros:{metodo:"Não foi possível identificar a bandeira do cartão."}` | |
| Sem token | **400** | `erros:{token:…, metodo:…}` | |

## 4. Navegador (o caminho que estava quebrado)

| Verificação | Resultado observado |
|---|---|
| Campos seguros montados | 3 iframes de `secure-fields.mercadopago.com` (número, validade, código) + selects de emissor e parcelas |
| **CPF vazio** + clique em Pagar | erro **no campo CPF** (`CPF inválido. Confira os 11 números.`), **zero** requisições a `/api/pagamentos` — o SDK nem é acionado |
| CPF `123.456.789-09` no campo visível | campo técnico `mp-cpf` = **`12345678909`** (só dígitos) e `mp-tipo-doc` = `CPF` — a causa raiz segue corrigida |
| **Device ID** | `MP_DEVICE_SESSION_ID` e `#deviceId` com **231 caracteres**; o valor aparece **no corpo do POST** enviado pelo checkout (`deviceIdLen: 231`, formato `armor.<hex>.<hex>`) |
| Cartão recusado (`OTHE`) no navegador | tela mostra a mensagem de recusa, permanece em `/checkout`, botão volta a `Pagar R$ 16,18 no cartão` |
| Cartão aprovado (`APRO`) no navegador | navegou para **`/obrigado`**; POST com token real, bandeira `visa`, 1 parcela |
| Tema escuro | medido no DOM: body `rgb(11,11,12)`, campos (nossos e o wrapper dos campos do MP) `rgb(21,21,23)`, texto `rgb(245,243,239)`; conferido também em captura de tela |
| Autofill | **regra existe** (`src/app/globals.css:136-145`, `input/textarea/select:-webkit-autofill` com `box-shadow` inset na cor do card) — mas **não consegui forçar o autofill real do Chrome** (§5.2) |

## 5. Lacunas e falhas encontradas

**5.1 `cc_rejected_invalid_installments` cai na frase genérica.** O cenário oficial `INST` (parcelas inválidas) devolve esse `status_detail`, que **não está** no mapa de `src/lib/pagamentos/status.ts:37-60`. O `docs/12` afirma que "todo detalhe conhecido do gateway tem entrada aqui" — isso é falso para esse detalhe, que é oficial. Correção de uma linha; o efeito é só de qualidade de mensagem (a recusa continua correta, em 402).

**5.2 Autofill real não foi forçado.** O domínio CDP `Autofill` não existe no navegador deste ambiente (`Autofill.enable wasn't found`), então **não** consegui preencher um campo por autofill do Chrome. Verifiquei a regra CSS e o tema renderizado, não o comportamento do autofill. Continua sendo o item que o `docs/12` já marcava como pendente: é verificação manual (Chrome desktop e iPhone), para a conversa de tutoriais / homologação.

**5.3 Concessão de acesso não foi executada ao vivo.** O `.env.local` está **sem** as variáveis do Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `MERCADOPAGO_WEBHOOK_SECRET` vazias), então a gravação do acesso não pode ser exercitada aqui. Comportamento observado, e que vale registrar:
- `GET /api/pagamentos/[id]/status` respondeu **200 `aprovado`** mesmo com a concessão falhando, e registra `[pagamentos] falha ao conceder pelo status …` (ou seja: a tela pode dizer "obrigado" sem o acesso ter sido gravado — o webhook é a rede de segurança).
- Webhook com pagamento aprovado devolveu **500 `falha_ao_gravar`** (falha fechada: o MP reenvia) em vez de "ok" silencioso. Esse comportamento está correto; o que não pude provar ao vivo é a gravação em si.
- A lógica de gravar/revogar está coberta por teste automatizado (`operacoes.test.ts`, `webhook.test.ts`), mas isso é cobertura de código, **não** prova de banco.

**5.4 3DS 2.0 não implementado** (declarado no `docs/12` §6, decisão de escopo pendente). Consequência registrada: emissor que exigir desafio deixa o pagamento em análise, sem tela de desafio. Nenhum emissor pediu desafio nos cenários oficiais de teste, então isso não apareceu na matriz.

**Itens que eu NÃO exercitei ao vivo** (declarados): HTTP 503 (token do MP ausente no servidor), 3DS, e o relatório de qualidade de integração do MP (que é o único lugar que confirma se o Device ID está sendo *considerado* pelo antifraude).

## 6. Divergência de repositório (registrada, não resolvida)

Durante a verificação (00:23:50) apareceu um **commit local** `a0681f3 — fix(checkout): estabiliza a tokenizacao do cartao no Mercado Pago`, na branch `feat/estrutura-agencia-marketing`, com a identidade do repositório (`ANUNCIAPALOTINA`). Não fui eu e não é resultado de script do projeto (só há workflows de marketing que commitam com `[skip ci]`).
- Contém as 28 mudanças do cartão **e** arquivos de `agencia/` e `docs/07-agencia-marketing.md`, que são de outro assunto (mistura de escopos no mesmo commit).
- **Não foi publicado**: nenhuma branch remota contém o commit; `main` segue em `39e410e` (`origin/main`).
- O commit contém exatamente a árvore que eu testei (a árvore ficou limpa e os quatro portões passam sobre ela).

Quem commitou e por quê é uma pergunta para o Garlet — não invento autoria.

## 7. O que foi conferido como NÃO alterado

- **Preço:** `src/config/produto.ts:14` = `1618` centavos; `git diff` desse arquivo vazio; na tela e no gateway, R$ 16,18 em todas as execuções.
- **Pix:** `git diff` vazio em `src/components/checkout/tela-pix.tsx`, `decisao.ts`, `webhook.ts` (fluxo Pix intocado). Pix criado de verdade na API de teste: **201** com `qrCode` e `qrCodeBase64`, `GET /status` → 200 `pendente`.
- **Idempotência:** dois `POST` com a mesma chave devolveram o **mesmo** `payment_id` (conferido: `iguais: true`). O cabeçalho `X-Idempotency-Key` vai em toda criação (teste automatizado).
- **Webhook (rota real, segredo de teste injetado no ambiente):** assinatura válida + recusado → 200 `ignorado: status_rejected`; assinatura inválida → **401**; evento irrelevante → 200 `evento_irrelevante`; pagamento inexistente → 200 `pagamento_inexistente`. O corpo da notificação não decide nada.
- **Status:** `GET /status` de pagamento aprovado → 200 `aprovado`; id inexistente → 404; id não numérico → 404.
- **Vazamento de dados:** zero ocorrências de número de cartão/CVV/token nos logs do servidor e no repositório; `.env.local` continua fora do git; nenhum número de cartão de teste em arquivo versionado (`docs/09` e `docs/12` mantêm apenas um CPF de teste público, resíduo menor do risco R7).

## 8. Recomendação

1. **Homologar com as credenciais de produção** (Supabase + webhook configurados), que é onde a concessão de acesso passa a ser exercitável de verdade — é o único item da matriz que só falta por ambiente.
2. Corrigir a mensagem de `cc_rejected_invalid_installments` (1 linha).
3. Fazer a conferência manual de autofill (Chrome desktop + iPhone) e a do relatório de qualidade de integração do MP.
4. Só depois disso decidir o merge na `main` e o 3DS — as duas decisões são do Garlet.
