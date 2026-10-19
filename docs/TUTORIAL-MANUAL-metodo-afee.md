# Tutorial manual — Método AFEE

O que **só o Garlet** pode fazer. Tudo aqui é ação dele, na ordem. O que o agente
consegue resolver não está nesta lista.

Atualizado: 2026-10-19

---

## A. Pagamento que travou (17/10, ~23:10) — descobrir se houve cobrança

O checkout travou em "Processando…" **depois** de enviar a cobrança. A correção já
está no ar (o botão não trava mais: avisa em 30 s e libera). Falta saber **o que
aconteceu com aquele pagamento** — e isso está em dois lugares que só você abre.

### A1. A cobrança apareceu? (isto é dinheiro — faça primeiro)

1. Abra o **aplicativo do Mercado Pago** no celular.
2. Entre em **Atividade** (ou **Cobranças** / **Vendas**, conforme a versão).
3. Procure uma cobrança de **R$ 16,18** com data de **17/10** por volta de **23:10**.
4. Anote o que aparecer:

| O que você vê | O que significa | O que fazer |
|---|---|---|
| **Aprovada / Pago** | A compra funcionou; só a tela não avisou. O comprador deve ter recebido o acesso. | Nada a corrigir. Guarde o **ID da cobrança** — ele serve para o passo A3. |
| **Pendente / em análise** | O Mercado Pago recebeu e ainda está decidindo. | Espere a confirmação; o acesso libera quando aprovar. |
| **Recusada / cancelada** | Não entrou dinheiro. | Guarde o **ID** e vá para o A2. |
| **Nada apareceu** | A cobrança **não chegou** ao Mercado Pago. | Vá para o A2 — é lá que se descobre por quê. |

**Sinal de que deu certo:** você consegue dizer, olhando a tela, em qual das quatro
situações está. Anote o **ID** se houver.

### A2. O registro do servidor (só existe no painel do Netlify)

1. Entre em **app.netlify.com** e abra o site do **Método AFEE**.
2. No menu do site, abra **Logs → Functions**.
3. Filtre pela janela de **17/10, por volta de 23:10**.
4. Copie (ou tire print de) o que aparece na função de pagamento — especialmente
   qualquer linha com **erro**, **timeout** ou **502**.

**Sinal de que deu certo:** existe uma linha registrada naquele horário. Se o painel
mostrar que não há nada naquela janela, isso **também** é resposta: significa que a
requisição nunca chegou até a função.

### A3. Relatório de qualidade da integração (Mercado Pago)

Este é o **único** lugar que confirma se o `Device ID` está sendo **considerado**
pelo antifraude — do nosso lado isso não é legível.

1. Entre em **mercadopago.com.br/developers/panel** (Painel do desenvolvedor).
2. Clique no **card da aplicação** do Método AFEE.
3. No menu lateral, abra **Qualidade da integração**.
4. Faça a medição **manual**: ela pede o **ID de um pagamento feito com credenciais
   de produção** — use o ID que você anotou no A1.
5. Leia a pontuação e as recomendações.

> Existe também a medição **automática**, que o Mercado Pago roda **do dia 1 ao 7 de
> cada mês** para integrações que já tenham ao menos um pagamento de produção. Se a
> medição manual não aceitar o ID, espere a janela do mês.

**Sinal de que deu certo:** aparece uma pontuação com a lista de recomendações.
Se alguma recomendação falar de **Device ID** ou **antifraude**, me mande o print.

---

## B. Conferência de autofill (aparência dos campos preenchidos)

O navegador preenche os dados salvos com um fundo próprio, que pode **apagar** o
fundo escuro da página e deixar letra clara em fundo claro — ilegível. A regra de
estilo existe no código, mas o comportamento real do navegador não pôde ser forçado
pelo agente: precisa de olho humano.

1. No **computador**, abra o **Chrome** e vá em `metodo-afee.netlify.app/checkout`.
2. Escolha pagar com **cartão**.
3. Clique no campo do número do cartão e deixe o Chrome **preencher sozinho** o que
   ele tem salvo.
4. Confira se **todos** os campos continuam **escuros, com letra clara e legível**
   (nome, número, validade, código de segurança).
5. Repita no **iPhone**, no **Safari**.

**Sinal de que deu certo:** você lê todos os campos sem esforço, depois do
preenchimento automático.

**Se algum campo ficar apagado ou ilegível:** tire um print e me mande. É ajuste de
estilo, abre tarefa para o `engenharia`.

---

## C. Decisão pendente: 3DS 2.0 entra agora?

O 3DS é a etapa em que o banco pede uma confirmação extra (código no app) antes de
aprovar. Hoje **não está implementado**, e nos 17 cenários oficiais de teste nenhum
emissor pediu esse desafio — por isso ele nunca apareceu.

**Recomendação técnica: deixar para a segunda etapa.** O que se perde sem ele:
se algum emissor exigir o desafio, o pagamento fica **em análise** e o comprador não
vê tela de confirmação — ele só espera.

**Sua decisão:** de acordo em deixar para depois, ou querer agora.

---

## D. Provar o cartão com um cartão real (só depois do próximo deploy)

O defeito que fazia o cartão falhar **sem chegar ao servidor** foi encontrado em 19/10: o CPF que o
Mercado Pago lê estava sendo alimentado pelo estado da tela, e não pelo que estava no campo — se o
navegador preenchesse o CPF sozinho, o campo ia **vazio** para o Mercado Pago e a cobrança nem era
criada. A correção está em execução com a engenharia e **ainda não foi publicada**.

Cartão de teste **não serve** aqui: o Mercado Pago responde `bin_not_found` porque cartão de teste
não existe em modo de produção. A prova final é com um cartão de verdade.

1. Espere o aviso de que a correção foi **publicada** (não teste antes — o site ainda está com a
   versão antiga).
2. No **computador**, abra o **Chrome**, vá em `metodo-afee.netlify.app/checkout` e abra o
   **console** do navegador (tecla **F12** → aba **Console**; ou botão direito → **Inspecionar** →
   **Console**).
3. Preencha nome, e-mail e CPF — **digite o CPF à mão, não deixe o navegador preencher sozinho** —
   escolha **Cartão**, preencha os dados e clique em pagar.
4. Anote o que aconteceu:

| O que você vê | O que significa | O que fazer |
|---|---|---|
| Chegou em **/obrigado** | O cartão funciona ponta a ponta. | Me avise — fecho o cartão. |
| **Recusa** ("O cartão não foi aprovado…") | O caminho funciona; o banco recusou aquele cartão. | Tente outro cartão e me diga a mensagem. |
| **Mensagem de erro** na tela | A falha agora aparece com motivo (era isso que faltava). | Tire um print da tela **e** do console. |
| Botão **preso em "Processando…"** por mais de 30 s | Ainda há um caminho mudo. | Tire print do console — é lá que o Mercado Pago escreve o motivo. |

**Sinal de que deu certo:** você consegue dizer em qual das quatro linhas você caiu — e, se falhou,
o console tem uma linha vermelha que começa com `[afee]` ou `mercadopago`.

---

## E. Webhook do Mercado Pago — trocar o segredo (destrava a entrega do ebook)

Hoje **toda** notificação do Mercado Pago chega ao site e é recusada com `401`. Consequência: quem
paga **não recebe o acesso automaticamente**.

A causa foi encontrada em 19/10: o site cria os pagamentos com as credenciais da aplicação
**ANUNCIA PALOTINA** (é ela que assina as notificações), mas o segredo guardado na Netlify é o de
**outra** aplicação. Segredo de aplicação diferente ⇒ recusa em 100%.

1. Entre em **mercadopago.com.br/developers/panel**.
2. Abra o card da aplicação **ANUNCIA PALOTINA** (não a do Método AFEE).
3. No menu lateral, abra **Webhooks** (ou **Notificações**).
4. Copie o **segredo da assinatura** (*clave secreta* / *signature secret*).
5. Em **app.netlify.com** → site do **Método AFEE** → **Site configuration → Environment variables**,
   abra a variável `MERCADOPAGO_WEBHOOK_SECRET` e **substitua** o valor pelo copiado. Salve.
6. **Não precisa publicar** — a variável vale no próximo processamento. Mas só passa a valer depois
   de um novo deploy/execução; me avise quando salvar que eu confiro pelo log do Netlify.

**Sinal de que deu certo:** a próxima notificação no log do Netlify deixa de mostrar
`[webhook-mp] assinatura inválida` e passa a liberar o acesso. Se continuar `401`, o segredo copiado
não é o da aplicação certa.

---

## Pendências deste tutorial

- [ ] **A1** — conferir no app do Mercado Pago se a cobrança de R$ 16,18 apareceu (e anotar o ID)
- [ ] **A2** — copiar o registro da função no painel do Netlify, janela de 17/10 ~23:10
- [ ] **A3** — rodar o relatório de qualidade da integração (precisa do ID do A1)
- [ ] **B** — testar autofill no Chrome (computador) e no Safari (iPhone)
- [ ] **C** — decidir sobre o 3DS 2.0
- [ ] **D** — provar o cartão com cartão real, **depois** do aviso de publicação (console aberto)
- [ ] **E** — colar em `MERCADOPAGO_WEBHOOK_SECRET` o segredo da aplicação **ANUNCIA PALOTINA** (destrava a entrega do ebook)
