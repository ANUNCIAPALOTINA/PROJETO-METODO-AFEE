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

## Pendências deste tutorial

- [ ] **A1** — conferir no app do Mercado Pago se a cobrança de R$ 16,18 apareceu (e anotar o ID)
- [ ] **A2** — copiar o registro da função no painel do Netlify, janela de 17/10 ~23:10
- [ ] **A3** — rodar o relatório de qualidade da integração (precisa do ID do A1)
- [ ] **B** — testar autofill no Chrome (computador) e no Safari (iPhone)
- [ ] **C** — decidir sobre o 3DS 2.0
