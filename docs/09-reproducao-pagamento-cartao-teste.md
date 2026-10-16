# Reprodução e causa raiz — pagamento com cartão

**Status:** causa raiz confirmada e corrigida em ambiente local de teste
**Data:** 2026-10-15
**Ambiente:** servidor local (`http://localhost:3001`), credenciais oficiais de **teste**, `live_mode: false`
**Base:** `docs/08-projeto-solucao-pagamentos-cartao.md`

## Resumo

O pagamento com cartão **não estava quebrado no backend**. A falha acontecia **antes** de qualquer chamada ao servidor: o MercadoPago.js não conseguia tokenizar o cartão porque o número do documento (CPF) era lido de um campo **com máscara** (`123.456.789-09`) em vez de apenas dígitos.

Resultado: o SDK devolvia erro de tokenização, nenhuma requisição era enviada ao backend, e a tela mostrava a mensagem genérica `Confira os dados do cartão e tente de novo.` — exatamente o sintoma relatado.

Com a correção, o mesmo cartão oficial de teste aprovado conclui a compra e chega em `/obrigado`.

## Causa raiz

No `MercadoPago.js` v2 (CardForm), o `identificationNumber` apontava para o campo visível do CPF, que aplica máscara brasileira:

```text
identificationNumber: { id: "cpf" }   // valor: 123.456.789-09  → tokenização falhava
```

O SDK exige o número do documento **apenas com dígitos**. A máscara (pontos e traço) invalida a tokenização.

Correção aplicada: campo técnico separado, somente dígitos, mantendo o campo visível mascarado para o usuário.

```text
identificationNumber: { id: "mp-cpf" }  // valor: 12345678909  → tokenização OK
```

## Evidência — teste diferencial

Mesmo cartão oficial de teste aprovado, mesmo comprador, mesma tela. Só o campo de identificação mudou.

| Cenário | Requisição a `/api/pagamentos` | Resultado |
|---|---|---|
| Identificação vinda do CPF mascarado | **nenhuma** | mensagem `Confira os dados do cartão e tente de novo.` |
| Identificação vinda do campo só-dígitos | `201` | `{"situacao":"aprovado"}` e navegação para `/obrigado` |

Isso prova que a falha ocorria na **tokenização no navegador**, não no backend, e que a causa era o formato do documento entregue ao SDK.

## Testes executados com dados oficiais

Dados oficiais de sandbox usados: cartão Mastercard terminando em `3311`, validade `11/30`, CVV `123` e o CPF de teste da documentação. Os valores completos ficam apenas na lista oficial de cartões de teste do Mercado Pago — por regra do projeto, número de cartão e documento não são gravados neste relatório.
O status é definido pelo **nome do titular**: `APRO` = aprovado; `OTHE` = recusado por erro geral.

| Cenário | Titular | HTTP | Situação devolvida | Comportamento na tela |
|---|---|---|---|---|
| Aprovado | `APRO` | 201 | `aprovado` | navegou para `/obrigado` |
| Recusado | `OTHE` | 201 | `recusado` | mensagem de recusa exibida, permaneceu no checkout |

Conferência direta na API do Mercado Pago:

| Pagamento | status | status_detail | meio | parcelas | live_mode |
|---|---|---|---|---|---|
| `1353764037` | `approved` | `accredited` | `master` / crédito | 1 | false |
| `1353756423` | `rejected` | `cc_rejected_other_reason` | `master` / crédito | 1 | false |

Confirmações adicionais observadas:

- o SDK montou os três campos seguros (`secure-fields.mercadopago.com`) com a chave pública de teste;
- emissor (`Santander`) e parcelas foram preenchidos automaticamente pelo SDK;
- `issuer_id` (`12749`) foi aceito pelo gateway;
- o identificador do pagador chegou ao gateway;
- o backend manteve valor (`16.18`) e moeda vindos do servidor;
- a identificação do comprador foi enviada em `payer.identification`.

## O que também foi corrigido

- campos preenchidos automaticamente pelo navegador mantêm fundo escuro e texto claro;
- placeholders dos campos seguros do Mercado Pago com contraste legível;
- CPF visível mascarado, valor técnico sem máscara;
- campo de tipo de documento montado de forma válida para o SDK.

## O que ainda falta (fora desta correção)

1. **Mensagens de recusa: mapa já existe, cobertura é parcial.** `src/lib/pagamentos/status.ts` já traduz 8 `status_detail` (`saldo insuficiente`, `número`, `validade`, `código de segurança`, `autorização`, `cartão desabilitado`, `risco`, `outros`). A frase genérica `O cartão não foi aprovado. Tente outro cartão ou pague com Pix.` só aparece quando o detalhe **não está mapeado** — foi o caso do cenário `OTHE` (`cc_rejected_other_reason`). Falta cobrir os detalhes restantes.
2. **Código HTTP da recusa.** A recusa financeira hoje responde `201`. Faz sentido avaliar um código mais preciso para o frontend.
3. **Device ID.** Enviar o identificador de dispositivo (`X-meli-session-id`) ajuda na análise antifraude e na aprovação.
4. **3DS 2.0.** Avaliar o fluxo de autenticação para cartões que exigem validação.
5. **Cobertura adicional de testes:** CVV inválido (`SECU`), validade inválida (`EXPI`), erro de formulário (`FORM`), fundos insuficientes (`FUND`), duplicidade (`DUPL`), parcelas inválidas (`INST`), pendente (`CONT`) e autorização (`CALL`).
6. **Publicação.** A correção está apenas na branch local; a produção continua com o comportamento antigo até o merge autorizado.

## Como repetir

1. Preencher `.env.local` com as credenciais oficiais de **teste** (nunca de produção).
2. `npm run dev` e abrir `/checkout`.
3. Escolher **Cartão** e preencher com um cartão oficial de teste.
4. Usar o nome do titular para escolher o cenário: `APRO`, `OTHE`, `SECU`, `EXPI`, etc.
5. Conferir: houve requisição a `/api/pagamentos`? qual `situacao` voltou? a tela navegou para `/obrigado`?

Nunca registrar número de cartão, CVV, CPF, e-mail ou token completo em relatório, print ou chat.

## Evidências e limites

## Verificação das alegações da avaliação CardForm x Brick

Duas alegações do relatório `docs/11-avaliacao-cardform-vs-card-payment-brick.md` foram testadas aqui:

| Alegação | Resultado |
|---|---|
| `docs/09` dizia que "toda recusa" usa a frase genérica | **procede** — corrigido: o mapa de 8 `status_detail` já existe em `src/lib/pagamentos/status.ts` e a frase genérica só cobre detalhe não mapeado |
| CPF vazio/inválido faz a tela culpar o cartão (`formulario-checkout.tsx:146`) | **não reproduzido** — testado duas vezes em navegador: CPF vazio e CPF de 11 dígitos com verificador errado mostraram `CPF inválido. Confira os 11 números.` no próprio campo do CPF, **sem** mensagem genérica de cartão e **sem** requisição enviada |

A ordem atual (tokenizar e depois validar o comprador) continua sendo uma ineficiência — gasta uma tokenização antes de barrar dados inválidos — mas não produz o erro no campo errado.

- Execução real em servidor local com credenciais de teste; os dois pagamentos existem no sandbox e foram conferidos por consulta à API.
- Nenhum dado real foi usado e nenhum segredo foi impresso.
- O teste foi feito com **credenciais de teste**. Diferenças de comportamento entre sandbox e produção não podem ser descartadas até uma homologação final, mas a causa raiz identificada é determinística: máscara no documento entregue ao SDK.
