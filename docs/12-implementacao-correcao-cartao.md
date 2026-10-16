# Implementação — correção do checkout de cartão (Fase 1 e Fase 2)

**Status:** implementado e verificado em ambiente local de teste; **não publicado**, nenhum merge na `main`
**Data:** 2026-10-16
**Base:** `docs/11-avaliacao-cardform-vs-card-payment-brick.md` (recomendação aprovada), `docs/08`, `docs/09`
**Alternativa implementada:** manter o **CardForm estabilizado** e fechar os itens da Fase 1/2 que não dependem da escolha do formulário. 3DS 2.0 fica para a Etapa 2 (ver §6).

## 1. O que mudou

| # | Item | Alteração | Arquivos |
|---|---|---|---|
| 1 | CPF mascarado × valor técnico | O valor entregue ao `identificationNumber` saiu de dentro do componente e virou função testável (`numeroDocumentoCardform`). Continua só-dígitos, agora com teste de regressão. | `src/lib/pagamentos/cardform.ts` (novo), `src/components/checkout/cartao-mp.tsx` |
| 2 | `identificationType` / `identificationNumber` | Tipo e id do campo viraram constantes (`TIPO_DOCUMENTO_CARDFORM`, `ID_DOCUMENTO_CARDFORM`) e há teste que falha se o componente voltar a apontar o SDK para o campo visível. | `src/lib/pagamentos/cardform.ts`, `cardform.test.ts` |
| 3 | Validação do comprador depois da tokenização | O envio ao SDK é barrado **antes da tokenização** quando o comprador é inválido (trava no clique do botão): deixa de gastar uma tokenização para depois recusar os dados. Se o SDK ainda assim não devolver token, o erro vai para o **CPF** quando o CPF é o problema, e para o cartão com mensagem específica quando não é. | `formulario-checkout.tsx`, `cartao-mp.tsx` |
| 4 | Erros de tokenização específicos | A frase única `Confira os dados do cartão e tente de novo.` foi trocada por mensagem que aponta o campo provável: número (quando o SDK não identificou a bandeira) ou validade/código (quando identificou). | `src/lib/pagamentos/cardform.ts`, `cartao-mp.tsx` |
| 5 | Mensagens de recusa | O mapa `status_detail → mensagem` ganhou os detalhes que faltavam: `cc_rejected_other_reason`, `cc_rejected_max_attempts`, `cc_rejected_3ds_challenge`, `cc_rejected_blacklist`, `cc_rejected_card_type_not_allowed`, `cc_rejected_duplicated_payment`. A frase genérica só vale para detalhe novo do MP. | `src/lib/pagamentos/status.ts` |
| 6 | Recusa financeira × falha técnica | A recusa passou a responder **HTTP 402** com a mensagem específica (era `201`, indistinguível de sucesso). Falha técnica continua **502**, dados inválidos **400**, MP não configurado **503**. Pagamento cancelado/estornado na criação também responde 402, com mensagem própria. | `src/lib/pagamentos/operacoes.ts`, `formulario-checkout.tsx` |
| 7 | Device ID | O checkout injeta `security.js?view=checkout` do MP, lê `MP_DEVICE_SESSION_ID` (ou o campo oculto `#deviceId`) no momento do envio e manda no corpo; o servidor valida e repassa em **`X-meli-session-id`** na criação do pagamento. Valor ausente ou estranho não bloqueia a compra. | `src/components/checkout/device-id.ts` (novo), `formulario-checkout.tsx`, `entrada.ts`, `cliente-mp.ts` |
| 8 | Clique duplo | Trava de reentrada por `ref` (o estado do React não atualiza entre dois cliques muito rápidos) + botão em `Processando…` durante a tokenização. | `formulario-checkout.tsx` |

Nada mudou em `src/config/produto.ts` (preço), `decisao.ts`, `assinatura.ts` (webhook) nem no fluxo Pix além do Device ID opcional.

Nenhum log, mensagem ou doc do repositório carrega número de cartão, CVV, CPF ou token completo (verificação descrita em §7).

## 2. Contrato da API depois da mudança

`POST /api/pagamentos`

| Código | Quando | Corpo |
|---|---|---|
| `201` | Pix criado, ou cartão aprovado/em análise/pendente | `{metodo, id, situacao}` (+ `qrCode`, `qrCodeBase64` no Pix) |
| `400` | Dados inválidos (nome, e-mail, CPF, token, bandeira, método) | `{erro: "dados_invalidos", erros: {…}}` |
| `402` | **Recusa financeira** do banco, ou pagamento cancelado/estornado | `{metodo, id, situacao, mensagem}` |
| `502` | Falha técnica ao falar com o MP | `{erro: "mp_indisponivel", mensagem}` |
| `503` | Token do MP não configurado no servidor | `{erro: "pagamentos_indisponiveis"}` |

Racional: `402 Payment Required` é o único código que diz "o emissor analisou e não autorizou". Assim o navegador consegue tratar recusa (`402`, mensagem específica), falha técnica (`502`, "nada foi cobrado") e erro de digitação (`400`, campo a campo) por caminhos separados — era o critério 6 do `docs/11` e o item "separar recusa de falha técnica" do `docs/08`.

## 3. Device ID — o que foi feito e o que ainda depende do painel

Feito: script de segurança do MP no checkout (`view="checkout"`), leitura de `MP_DEVICE_SESSION_ID`/`#deviceId` no envio, validação de formato no servidor e cabeçalho `X-meli-session-id` em **toda** criação (Pix e cartão).

Confirmado no navegador local (2026-10-16): o script respondeu com um valor real de **231 caracteres** (formato `armor.<hex>.<hex>`), o campo oculto foi preenchido e o valor apareceu no corpo do `POST /api/pagamentos`. O limite inicial de 200 caracteres foi **corrigido para 512** justamente por causa dessa medição — sem isso, o valor real seria descartado silenciosamente.

Observação honesta: a documentação do MP diz que quem já usa o **MercadoPago.js v2** (nosso caso) não precisa do script porque o Device ID já é coletado pelo SDK. Ou seja, isto é um **reforço** do que o SDK já faz, não uma correção de um sinal perdido. A conferência final é do relatório de **qualidade de integração** do painel do MP, na homologação (pendência de §8).

## 4. Idempotência, webhook, status e concessão de acesso — como foram validados

Nada disso mudou de comportamento; a mudança de status HTTP mexeu só no caminho de resposta ao navegador.

- **Idempotência:** a chave do navegador é reaproveitada na repetição por queda de rede e renovada depois de resposta definitiva; `X-Idempotency-Key` vai em toda criação (teste automatizado, inclusive no cartão). Verificação real: dois `POST /api/pagamentos` com a **mesma** chave devolveram o **mesmo** `id` de pagamento (`1353766157`) — o MP não criou cobrança duplicada.
- **Clique duplo:** trava de reentrada no cliente (item 8 de §1) + chave de idempotência.
- **Webhook:** assinatura verificada, evento irrelevante ignorado, corpo nunca decide nada, notificação duplicada é idempotente por construção (`conceder`/`revogar` por `paymentId`). Coberto por `webhook.test.ts` (inalterado).
- **Status e concessão:** `GET /api/pagamentos/[id]/status` continua concedendo acesso só com pagamento buscado no MP, valor/moeda conferidos no servidor e gravação idempotente; aprovado com valor fora do produto aparece como "em análise". Coberto por `operacoes.test.ts`.

## 5. Verificação executada (comandos e resultados reais)

| Verificação | Comando | Resultado |
|---|---|---|
| Testes | `npm test` | **135 testes / 15 arquivos**, todos passando (antes: 111) |
| Tipos | `npm run typecheck` | OK |
| Lint | `npm run lint` | OK (sem saída) |
| Build | `npm run build` | OK; `/checkout`, `/obrigado` e as 3 rotas de API presentes |

No navegador (servidor local, credenciais de teste, `http://localhost:3001/checkout`):

| Cenário | Resultado observado |
|---|---|
| Cartão selecionado | SDK montou os **3 campos seguros** (`secure-fields.mercadopago.com`) e os selects de emissor/parcelas |
| CPF vazio + clique em "Pagar" | Erro no **campo CPF** (`CPF inválido. Confira os 11 números.`); **nenhuma** requisição a `/api/pagamentos` e **nenhuma** chamada de tokenização ao MP (só as chamadas dos campos seguros apareceram na instrumentação) |
| CPF `529.982.247-25` no campo visível | Campo técnico `mp-cpf` = `52998224725` (só dígitos) e `mp-tipo-doc` = `CPF` — a causa raiz segue corrigida na tela |
| Device ID | `MP_DEVICE_SESSION_ID` e `#deviceId` preenchidos; valor de 231 caracteres confirmado no corpo do POST |
| Fluxo Pix | Pix gerado e tela "Pague com Pix" com QR/copia-e-cola; `GET /status` respondendo `200` no ciclo de consulta |
| Preço e tema | `R$ 16,18` na tela e no pedido; todos os campos (nossos e do MP) escuros e legíveis em desktop |
| Erros de runtime | nenhum `error`/`warn` no log do servidor durante os testes |

**O que eu não executei:** (a) pagamento com cartão aprovado e recusado nesta rodada, porque isso exige digitar dados de cartão de teste e essa execução é o objeto da tarefa de verificação (`t_94773fc7`, matriz de testes) — a ligação que quebrou antes (valor entregue ao SDK) foi conferida no DOM e o caminho de recusa está coberto por 4 testes sobre o código real de `operacoes.ts`; (b) **preenchimento automático real do navegador** (autofill): conferi o tema escuro renderizado e as regras de `globals.css`, mas não forcei o autofill do Chrome — isso fica para a homologação/verificação.

## 6. 3DS 2.0 — avaliação e decisão

Avaliado na documentação oficial do MP (Checkout Transparente): o 3DS é **suportado** pelo caminho atual, com `three_d_secure_mode: "optional"` na criação do pagamento (também exige captura automática e `binary_mode=false`). Quando o emissor pede desafio, o pagamento volta `status: pending` / `status_detail: pending_challenge` com `three_ds_info.creq` e `external_resource_url`, e é preciso: montar um iframe com form POST para o `external_resource_url`, exibir o desafio (janela de ~5 minutos para o comprador concluir), acompanhar o resultado e tratar `cc_rejected_3ds_challenge`.

**Decisão: não implementar nesta entrega.** É exatamente o cenário do risco R3 do `docs/11`: no CardForm o desafio é manual (iframe, janelas de tempo, polling) e o retorno é um estado novo que precisa de tela própria. A recomendação aprovada diz para migrar ao **Card Payment Brick + Status Screen Brick** quando o 3DS entrar no escopo, porque lá o desafio é exibido pelo Brick. Enquanto o 3DS não for exigência de lançamento, ligá-lo agora trocaria uma peça recém-provada por uma peça não-provada perto da homologação.

Consequência registrada: se um emissor exigir 3DS com o código atual, o pagamento ficaria em análise (`pending_challenge` cai em "Pagamento em análise") em vez de mostrar o desafio. A mensagem de recusa `cc_rejected_3ds_challenge` já está pronta para o dia em que o 3DS for ligado.

**Pendência de decisão do Garlet:** ligar 3DS agora (e então migrar para Brick) ou deixar para a próxima etapa.

## 7. Divergências registradas entre relatórios (não resolvidas por mim)

Ao trabalhar neste arquivo, `docs/09` foi editado **em paralelo por outra execução** (tarefa raiz do mesmo projeto, mesmo workspace). Situação encontrada ao final e o que faço com ela:

1. **`docs/09` item 1 dizia que "toda recusa" caía na frase genérica** — **está errado**. O mapa `status_detail → mensagem` já existia em `src/lib/pagamentos/status.ts`; a frase genérica só valia para detalhe não mapeado, como o `cc_rejected_other_reason` do cenário testado. Já corrigido no próprio `docs/09` pela execução paralela; o que faltava (cobrir os detalhes restantes) foi feito no item 5 de §1.
2. **`docs/09` trazia número de cartão de teste e CPF em texto claro** — já mascarado pela execução paralela, com referência à página oficial de cartões de teste (risco R7 do `docs/11`, critério 12). Não reescrevi nada nesse arquivo para não disputar o mesmo trecho.
3. **Contradição aberta — vale para o Garlet e para quem revisar:** o `docs/11` §3 registra como "defeito novo" que CPF vazio/incompleto faz o SDK não tokenizar e a tela culpar o cartão. A verificação em navegador relatada no `docs/09` (execução paralela) **não reproduziu** isso: o erro apareceu no campo CPF e nenhuma requisição foi enviada. Minha própria verificação em navegador (após esta entrega) confirma o mesmo comportamento correto — CPF vazio ⇒ erro no campo CPF, zero requisições. **Conclusão honesta:** com o código anterior a mensagem já caía no campo certo; o que esta entrega remove é a **tokenização desperdiçada** (validar antes de tokenizar). O risco R2 do `docs/11` fica rebaixado de "defeito" para "custo desnecessário", agora resolvido.
4. O restante do `docs/09` (causa raiz, teste diferencial, pagamentos conferidos na API) segue válido e não foi alterado.

## 8. O que falta e o que depende de autorização

1. **Matriz de testes completa com cartões oficiais de teste** (aprovado, recusado, `SECU`, `EXPI`, `FORM`, `FUND`, `DUPL`, `INST`, `CONT`, `CALL`) em navegador — tarefa `t_94773fc7`.
2. **Relatório de qualidade de integração do MP** para confirmar se o Device ID está sendo considerado (item 8 do `docs/11`).
3. **3DS 2.0**: decisão de escopo (§6).
4. **Homologação em preview com credenciais de produção e publicação/merge na `main`: bloqueado por decisão do Garlet.** Nada foi publicado e nenhum merge foi feito.

### O que só o Garlet pode fazer

- Autorizar (ou não) o merge na `main` e a publicação — isso coloca a correção em produção.
- Decidir sobre o 3DS nesta entrega ou na próxima.
- Se pedir, fazer um pagamento real controlado depois da homologação (dados nunca no chat).
