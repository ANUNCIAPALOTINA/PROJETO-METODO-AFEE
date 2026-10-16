# Avaliação — estabilizar CardForm ou migrar para Card Payment Brick

**Status:** avaliação concluída — nenhuma alteração de código feita nesta tarefa
**Data:** 2026-10-16
**Base:** `docs/08-projeto-solucao-pagamentos-cartao.md`, `docs/09-reproducao-pagamento-cartao-teste.md`
**Escopo desta tarefa:** decidir o caminho, listar riscos, componentes e critérios de aceite. Não implementa.

## 1. O que eu mesmo verifiquei (não o que foi relatado)

Comandos rodados neste repositório, nesta ordem:

| Verificação | Comando | Resultado |
|---|---|---|
| Testes | `npm test` | 111 testes / 13 arquivos, todos passando |
| Tipos | `npm run typecheck` | OK (`next typegen` + `tsc --noEmit` sem erro) |
| Lint | `npm run lint` | OK (eslint sem saída) |
| Build | `npm run build` | OK; `/checkout`, `/obrigado` e as 3 rotas de API presentes |
| Diff | `git diff --stat` | 5 arquivos, +65/−9, **nenhum arquivo de backend alterado** |

Código conferido linha a linha:

- `src/components/checkout/cartao-mp.tsx:114` — `identificationNumber` aponta para `mp-cpf` (campo técnico), não mais para o campo visível.
- `src/components/checkout/cartao-mp.tsx:233` — o campo técnico recebe `somenteDigitos(cpf)`, é `readOnly`, `sr-only` e está dentro do `<form id="form-checkout">`.
- `src/components/checkout/formulario-checkout.tsx:252-258` — `cpf` é passado como prop; o valor é o mesmo estado do campo visível mascarado (`cartao-mp.tsx` deriva os dígitos).
- `src/app/globals.css:134-151` — regras de autofill (`-webkit-text-fill-color` + `box-shadow inset`) e `color-scheme: dark`.
- Busca por `device_id|meli-session|threeDS` em `src/`: **zero ocorrências** (a única correspondência é um base64 de imagem no ebook).

Ou seja: a correção da causa raiz está no repositório, funciona na sandbox (relato do `docs/09`) e as quatro verificações locais passam. O que **não** foi verificado por mim: o comportamento em navegador — não reexecutei o fluxo de compra. Essa parte segue sendo alegação do relatório de reprodução, sustentada pelos dois pagamentos conferidos na API do MP.

## 2. Divergência encontrada no relatório de reprodução

`docs/09:78` afirma: *"Hoje toda recusa cai em `O cartão não foi aprovado. Tente outro cartão ou pague com Pix.`"* — **falso**.

- `src/lib/pagamentos/status.ts:32-43` já mapeia 8 `status_detail` para mensagens específicas (saldo insuficiente, número, validade, CVV, autorização, cartão desabilitado, alto risco…).
- `src/lib/pagamentos/operacoes.ts:112-113` usa esse mapa quando `situacao === "recusado"`.

A frase genérica só aparece para `status_detail` **não mapeado** — que é exatamente o caso do cenário testado (`cc_rejected_other_reason`). O item "mensagens específicas por `status_detail`" portanto **encolhe**: falta mapear os detalhes restantes (começando por `cc_rejected_other_reason`, `cc_rejected_3ds_challenge`, `cc_rejected_max_attempts`), não construir o mapa do zero.

Confirmado por leitura, esse sim: a recusa financeira responde **HTTP 201** (`operacoes.ts:108`).

## 3. Risco de campo errado (novo, encontrado por leitura de código — não testado)

`formulario-checkout.tsx:146-153`: `aoTokenizar` chama `validarLocal()` **depois** de o SDK ter tokenizado. Em `cartao-mp.tsx:121-130`, se não houver token, a mensagem é sempre `"Confira os dados do cartão e tente de novo."`

Consequência: com **CPF vazio ou incompleto**, o SDK não tokeniza (o campo técnico vai vazio porque `somenteDigitos(cpf)` é vazio) e o checkout diz que o problema é no cartão — apontando para o campo errado. É o mesmo sintoma genérico que motivou o projeto, deslocado para outro campo. Correção prevista na Fase 1 do `docs/08` ("mostrar mensagens específicas por campo"): validar o comprador **antes** de acionar o SDK.

## 4. Comparação — CardForm estabilizado vs Card Payment Brick

Fontes oficiais consultadas (docs do Mercado Pago, 2026-10-16): integração de cartão via CardForm (Checkout Transparente), migração CardForm → Bricks, Payment Brick (guest flow) e o `card-form.md` do `sdk-js`, 3DS com Checkout Transparente e com Bricks, Device ID / recomendações de aprovação.

| Dimensão | CardForm estabilizado (estado atual) | Card Payment Brick |
|---|---|---|
| **Compatibilidade com o checkout próprio** | Total: o formulário é nosso; o SDK só injeta 3 iframes (número, validade, CVV). Preço continua decidido no servidor. | Parcial: o bloco de cartão (campos + botão) passa a ser renderizado pelo MP dentro do nosso `<div>`. O resto do formulário (nome, e-mail, CPF, escolha Pix/cartão, termos) segue nosso. Servidor **não muda**: o `onSubmit` entrega `token`, `payment_method_id`, `issuer_id`, `installments`, `payer.identification`. |
| **CPF mascarado vs valor técnico** | É exatamente o ponto frágil: nós mantemos dois valores (visível mascarado + técnico só-dígitos) e a coerência é responsabilidade nossa. Foi o que quebrou. | **Deixa de existir**: o Brick coleta o documento com o próprio seletor de tipo e cuida do formato. A classe inteira de bug desaparece. |
| **identificationType / identificationNumber** | Precisamos entregar um `<select hidden>` montado e um input só-dígitos válidos (`cartao-mp.tsx:113-114`, `:223-233`). Erro de contrato = tokenização silenciosamente falha. | Fora do nosso controle, resolvido pelo Brick (`initialization.payer.identification` opcional, preenche o campo). |
| **Erros de validação / tokenização** | O SDK não diz qual campo falhou: só `onSubmit` sem token ou `onError` genérico. Hoje isso vira uma frase única. Melhorar exige validação nossa antes de tokenizar. | Validação e mensagens por campo dentro do Brick; `onError` estruturado; o Brick não submete formulário inválido. |
| **Device ID** | Não implementado (zero ocorrências em `src/`). O SDK JS coleta por padrão, mas o backend **não** envia `X-meli-session-id`. | Idem. A doc oficial trata Device ID como recomendação comum aos dois caminhos — **não é diferente**. |
| **3DS 2.0** | Custa caro: `three_d_secure_mode: "optional"` no backend **e** implementação manual do *challenge* — iframe com form POST para `external_resource_url` com `creq`, escuta de evento, polling de status, janelas de ~30s/5min e `cc_rejected_3ds_challenge`. | Barato: mesmo `three_d_secure_mode: "optional"` no backend e o *challenge* exibido pelo **Status Screen Brick** com o `three_ds_info`. É o único ponto em que a migração economiza trabalho de verdade. |
| **Idempotência** | Já resolvida no nosso lado e **independe** da escolha: `chave` reutilizada na repetição por queda de rede e renovada após resposta definitiva (`formulario-checkout.tsx:71-107`), `X-Idempotency-Key` em toda criação (`cliente-mp.ts:140`). | Igual — o servidor não muda. Cuidado novo: `unmount()` do Brick ao sair da tela, senão estado velho sobrevive a uma nova tentativa. |
| **Campos escuros com autofill** | Nossos campos: resolvido (`globals.css:134-151`). Dentro dos iframes seguros do MP o CSS **não alcança** (origem diferente); o que controlamos lá é só `style` (`color`, `fontFamily`, `fontSize`, `placeholderColor`, `cartao-mp.tsx:51-56`). Autofill de navegador não preenche iframe de outra origem. | O Brick renderiza no HTML da nossa página, com tema oficial `dark` e variáveis de cor (`customVariables`) — menos remendo nosso, visual mais preso ao que o MP define. |
| **Manutenção / futuro** | CardForm continua documentado no Checkout Transparente (não está formalmente deprecado), mas o MP publica guia de migração e empurra Bricks. | Caminho que o MP desenvolve ativamente (guest flow + fast payments). |

## 5. Recomendação

**Etapa 1 (agora): manter o CardForm estabilizado. Não migrar nesta entrega.**
**Etapa 2 (quando 3DS entrar no escopo): migrar para Card Payment Brick, preferencialmente já com o Status Screen Brick.**

Fundamento:

1. A falha que motivou o projeto **não foi instabilidade do CardForm** — foi contrato de dados nosso (documento mascarado entregue ao SDK). O teste diferencial em `docs/09` mostra o SDK montando os campos seguros e tokenizando normalmente com o valor só-dígitos. A decisão registrada no `docs/08` ("só migrar se o CardForm continuar instável") aponta para não migrar.
2. **Cinco dos seis itens abertos não são afetados pela escolha**: mensagens por `status_detail`, código HTTP da recusa, Device ID, cobertura dos cenários oficiais restantes e homologação. Migrar não resolve nenhum deles e ainda mistura duas mudanças grandes perto da homologação.
3. O único item que a migração resolve sozinha é o 3DS (e, de quebra, anula a classe de bug do CPF). Por isso a migração deve ser **acionada pelo 3DS**, não feita "por precaução".
4. Gatilhos explícitos para antecipar a migração para Etapa 1: (a) homologação de produção mostrar tokenização instável; (b) necessidade de cartão de débito/cartões salvos; (c) o erro de identificação voltar uma segunda vez — aí a mitigação manual já terá se mostrado insuficiente (2ª ocorrência = reincidência; na 3ª, para e sobe decisão).

## 6. Riscos

| # | Risco | Caminho | Severidade | Mitigação |
|---|---|---|---|---|
| R1 | Erro de identificação volta (máscara/formato) e o sintoma é de novo o genérico | CardForm | Alta | Teste automatizado que garante que o valor entregue ao SDK é só-dígitos; validar CPF **antes** de tokenizar |
| R2 | Erro no campo errado (CPF vazio → mensagem de cartão) | Ambos | Média | Validar comprador antes do SDK (item 3 acima) |
| R3 | 3DS manual: iframe do *challenge*, timeout de 30s, `cc_rejected_3ds_challenge` sem mensagem | CardForm | Alta se 3DS for ligado | Migrar para Brick ao ligar 3DS |
| R4 | "Campos escuros com autofill" não é garantido dentro dos iframes do MP | CardForm | Baixa | Verificar visualmente em homologação; aceitar o que o `style` do SDK permite |
| R5 | Sinal antifraude perdido por falta de `X-meli-session-id` | Ambos | Média | Conferir o relatório de qualidade de integração do MP e enviar o header quando disponível |
| R6 | Migração ao Brick troca peça recém-provada por peça não-provada; layout e tema precisam de ajuste (`customVariables`), e exige `unmount()` ao navegar | Brick | Média | Só migrar com 3DS no escopo e homologação própria |
| R7 | [pré-existente] `docs/09` registra em texto claro um número de cartão de teste oficial e um CPF | — | Baixa (dado público de sandbox, mas contraria a regra do projeto) | Trocar por referência à página oficial de cartões de teste do MP |

## 7. Componentes afetados

Já tocados pela correção (verificado): `src/components/checkout/cartao-mp.tsx`, `src/components/checkout/formulario-checkout.tsx`, `src/app/globals.css`.

Serão tocados pela Etapa 1: `src/lib/pagamentos/status.ts` (mapa de mensagens), `src/lib/pagamentos/operacoes.ts` (HTTP da recusa, `three_d_secure_mode`, header de Device ID), `src/lib/pagamentos/cliente-mp.ts` (headers), `src/lib/pagamentos/entrada.ts` (aceitar e validar `deviceId`), `src/app/api/pagamentos/[id]/status/route.ts` e `src/lib/pagamentos/webhook.ts` (status `pending`/3DS).

Só na migração: componente do Brick em `src/components/checkout/`, brick de Status Screen (3DS), e ajuste de tema no `globals.css`.

Não mudam em nenhum cenário: `src/config/produto.ts` (preço), `src/lib/pagamentos/decisao.ts` e `assinatura.ts` (webhook), fluxo Pix.

## 8. Critérios de aceite

1. `npm test`, `npm run typecheck`, `npm run lint` e `npm run build` passando (hoje: 111/111 + OK/OK/OK).
2. Teste automatizado provando que o valor entregue ao SDK como `identificationNumber` contém **somente dígitos**, para CPF com máscara, sem máscara e parcial.
3. CPF vazio/inválido exibe erro **no campo CPF**, antes de qualquer tentativa de tokenização — nunca a mensagem de cartão.
4. Cartão oficial de teste aprovado percorre o fluxo até `/obrigado` (já comprovado na sandbox; reconfirmar na homologação).
5. Cartão recusado mostra mensagem específica para o `status_detail` retornado; detalhe não mapeado cai em mensagem genérica apenas como último recurso.
6. Recusa financeira e falha técnica são distinguíveis pelo cliente (código HTTP coerente com o `docs/08`, Fase 2).
7. `X-Idempotency-Key` presente em toda criação; duplo clique e repetição por queda de rede não geram duas cobranças.
8. `X-meli-session-id` (Device ID) enviado quando disponível, ou registrado por escrito por que não se aplica, com a checagem do relatório de qualidade de integração do MP.
9. Se 3DS for ligado: `three_d_secure_mode: "optional"` no backend, *challenge* exibido e concluído, `cc_rejected_3ds_challenge` com mensagem própria, pagamento que volta a `approved` libera o acesso (webhook/status idempotentes).
10. Campos escuros e legíveis com autofill, nos nossos campos e no bloco do MP, em desktop e celular.
11. Mensagens de erro testadas no lugar certo para: número, validade, CVV, CPF, e-mail, emissor/parcelas, token ausente.
12. Nenhum log, print, relatório ou doc do repositório contém número de cartão, CVV, CPF ou token completo (aplicar também ao R7).
13. Migração (se acontecer): `unmount()` do Brick ao sair da tela; Pix e preço intactos; homologação antes de qualquer merge na `main` e publicação só com autorização do Garlet.