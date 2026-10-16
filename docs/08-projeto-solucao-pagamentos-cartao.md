# Projeto de solução — pagamentos com cartão

**Status:** planejado — não publicar até concluir os testes
**Data de abertura:** 2026-10-15
**Projeto:** Método AFEE
**Escopo:** checkout próprio com Mercado Pago, cartão de crédito e confirmação de acesso

## Objetivo

Tornar o pagamento com cartão previsível, diagnosticável e seguro, eliminando o erro genérico de cartão, corrigindo a integração dos campos e validando o fluxo completo em ambiente de teste antes de qualquer publicação.

## Sintomas observados

- O cartão preenchido não conclui o pagamento.
- A tela mostra apenas `Confira os dados do cartão e tente de novo.`
- Campos preenchidos automaticamente ficam claros/azulados em um checkout escuro.
- O CPF aparece como inválido mesmo quando o formato parece correto.
- Não é possível distinguir erro de campo, falha de tokenização, recusa financeira, antifraude ou falha técnica.

## Causa raiz confirmada (2026-10-15)

O `identificationNumber` do CardForm apontava para o campo visível do CPF, que aplica máscara (`123.456.789-09`). O SDK exige o documento **somente com dígitos**, então a tokenização falhava no navegador e nenhuma requisição chegava ao backend. Corrigido com um campo técnico só-dígitos, mantendo o campo visível mascarado.

Evidência completa e teste diferencial: `docs/09-reproducao-pagamento-cartao-teste.md`.

## Hipóteses a confirmar

1. O CardForm não está expondo qual campo impede a tokenização.
2. O CPF mascarado está sendo usado diretamente pelo SDK, em vez de um valor técnico com somente dígitos.
3. O `identificationType` oculto não está montado conforme o contrato do CardForm.
4. O backend transforma respostas diferentes do Mercado Pago em uma mesma mensagem.
5. O Device ID não está sendo encaminhado ao Mercado Pago.
6. O fluxo não cobre autenticação 3DS.
7. O preenchimento automático do navegador altera apenas a aparência ou também o estado interno dos iframes.

## Decisão técnica inicial

Manter o CardForm na primeira correção, porque ele já está integrado ao checkout e preserva o design próprio. Só migrar para Card Payment Brick ou Checkout Pro se o CardForm continuar instável depois da implementação conforme a documentação e dos testes oficiais.

## Fases

### Fase 0 — Proteção e reprodução

- [ ] Não usar cartão real em testes, screenshots ou chat.
- [ ] Separar credenciais de teste e produção.
- [ ] Reproduzir com contas e cartões oficiais de teste.
- [ ] Registrar se o erro ocorre antes ou depois da criação do token.
- [ ] Registrar request/response seguro sem número do cartão, CVV ou token completo.

**Saída:** reprodução determinística e ponto exato da falha.

### Fase 1 — Frontend/CardForm

- [x] Montar `identificationType` e `identificationNumber` conforme a API oficial (constantes em `src/lib/pagamentos/cardform.ts`, com teste de ligação).
- [x] Manter CPF visível mascarado e valor técnico sem máscara (`numeroDocumentoCardform`, verificado no DOM).
- [ ] Mapear e-mail do comprador no CardForm — **não é necessário**: o e-mail vem do nosso formulário e o servidor envia em `payer.email` + `metadata.email_comprador` (é de lá que o acesso é concedido, inclusive no Pix).
- [x] Adicionar callbacks de montagem, tokenização e erro. O SDK v2 não expõe callback de validade por campo — daí a validação nossa antes de tokenizar.
- [x] Impedir envio antes de o SDK estar pronto e antes de o comprador estar válido (trava no clique do botão, antes de qualquer tokenização).
- [x] Mostrar mensagens específicas por campo sem expor dados sensíveis (CPF, número, validade/código).
- [x] Corrigir autofill para manter fundo escuro e texto claro (`globals.css:134-151`).
- [ ] Verificar número, validade, CVV, emissor e parcelas em viewport desktop e celular — desktop conferido nesta entrega; celular fica para a matriz de testes (`t_94773fc7`).

**Saída:** token gerado de forma confiável ou erro de campo identificado.

### Fase 2 — Backend/Mercado Pago

- [x] Separar erro de validação, indisponibilidade e recusa de pagamento: `400` / `503` / `502` e **`402` para recusa financeira** (contrato em `docs/12` §2).
- [x] Preservar `status` e `status_detail` de forma segura nos logs (só id, método, status e e-mail mascarado).
- [x] Criar mensagens adequadas para recusa, sem mostrar códigos internos (12 `status_detail` mapeados; genérica só como último recurso).
- [x] Manter valor e moeda definidos exclusivamente no servidor (inalterado; teste garante que valor do navegador é ignorado).
- [x] Confirmar `X-Idempotency-Key` em todas as tentativas (teste automatizado + verificação real: mesma chave ⇒ mesmo pagamento).
- [x] Encaminhar Device ID quando disponível (`X-meli-session-id`, via `security.js`; ver `docs/12` §3).
- [x] Confirmar `payment_method_id`, `issuer_id`, parcelas e identificação do pagador.
- [x] Garantir que cartão, CVV e token completo nunca sejam gravados em log.
- [x] Confirmar webhook, consulta de status e concessão idempotente do acesso (testes existentes, inalterados).

**Saída:** cada resultado do Mercado Pago chega ao usuário com tratamento correto.

### Fase 3 — Segurança e autenticação

- [x] Avaliar 3DS 2.0 para cartões que exigirem autenticação — **avaliado e adiado** para a Etapa 2, junto da migração para Card Payment Brick + Status Screen Brick (avaliação em `docs/12` §6).
- [ ] Definir comportamento para desafio, cancelamento e falha de autenticação (depende de ligar o 3DS; a mensagem de `cc_rejected_3ds_challenge` já existe).
- [ ] Validar origem e assinatura do webhook.
- [ ] Revisar exposição de mensagens, logs e variáveis de ambiente.
- [ ] Confirmar que nenhuma alteração permite manipular preço pelo navegador.

**Saída:** fluxo de aprovação e autenticação documentado.

### Fase 4 — Testes

- [ ] Compra aprovada.
- [ ] Cartão recusado.
- [ ] Número inválido.
- [ ] Validade inválida/expirada.
- [ ] CVV inválido.
- [ ] CPF inválido.
- [ ] E-mail inválido.
- [ ] Emissor/parcelas ausentes.
- [ ] Token ausente ou expirado.
- [ ] Repetição por queda de rede.
- [ ] Duplo clique no botão.
- [ ] Webhook duplicado.
- [ ] Pagamento aprovado e consulta de status posterior.
- [ ] Pagamento aprovado sem webhook imediato.
- [ ] Responsividade e autofill em navegador compatível.

**Saída:** matriz de testes preenchida e todos os critérios críticos aprovados.

### Fase 5 — Homologação e publicação

- [ ] Revisar diff e remover instrumentação temporária.
- [ ] Rodar `npm test`.
- [ ] Rodar `npm run typecheck`.
- [ ] Rodar `npm run lint`.
- [ ] Rodar `npm run build`.
- [ ] Homologar em preview com credenciais adequadas.
- [ ] Fazer publicação somente após aprovação do Garlet.
- [ ] Fazer um pagamento real controlado, se necessário, sem usar dados no chat.
- [ ] Monitorar a primeira execução em produção.

## Critérios de pronto

O projeto só está concluído quando:

1. um cartão oficial de teste aprovado percorre o fluxo completo;
2. um cartão recusado mostra motivo compreensível sem expor dados sensíveis;
3. CPF, validade e demais campos mostram erro no lugar correto;
4. o backend diferencia falha técnica de recusa financeira;
5. o pagamento não duplica após repetição ou queda de rede;
6. acesso só é liberado para pagamento aprovado e validado;
7. logs não contêm cartão, CVV ou token completo;
8. testes, typecheck, lint e build passam;
9. a interface mantém o tema escuro inclusive com autofill;
10. a homologação é feita antes do merge na `main`.

## Fora do escopo inicial

- trocar o Mercado Pago por outro gateway;
- alterar preço do Método AFEE;
- alterar Pix, salvo regressão causada pelo checkout;
- publicar sem homologação;
- usar cartões ou credenciais reais em testes automatizados;
- guardar dados completos do cartão no sistema.

## Arquivos principais

- `src/components/checkout/cartao-mp.tsx`
- `src/components/checkout/formulario-checkout.tsx`
- `src/lib/pagamentos/entrada.ts`
- `src/lib/pagamentos/cliente-mp.ts`
- `src/lib/pagamentos/operacoes.ts`
- `src/lib/pagamentos/status.ts`
- `src/lib/pagamentos/*test.ts`
- `src/app/globals.css`
- `.env.example`

## Decisões pendentes

- ~~usar CardForm estabilizado ou migrar para Card Payment Brick~~ — **decidido em 2026-10-16** (`docs/11`): manter o CardForm estabilizado agora; migrar para Card Payment Brick + Status Screen Brick quando o 3DS entrar no escopo;
- habilitar 3DS nesta primeira entrega ou em uma segunda etapa (recomendação técnica: segunda etapa — `docs/12` §6);
- fonte das credenciais oficiais de teste;
- ambiente de preview para homologação;
- autorização para merge/publicação na `main`.

## Entregas

- `docs/09-reproducao-pagamento-cartao-teste.md` — causa raiz e teste diferencial.
- `docs/11-avaliacao-cardform-vs-card-payment-brick.md` — avaliação e recomendação aprovada.
- `docs/12-implementacao-correcao-cartao.md` — Fase 1 e Fase 2 implementadas, com verificação.
