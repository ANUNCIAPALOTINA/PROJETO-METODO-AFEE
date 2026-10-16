# Tutorial — credenciais de teste do Mercado Pago

**Para quem:** Garlet
**Objetivo:** liberar o ambiente de teste para reproduzir e corrigir o pagamento com cartão.
**Regra:** os valores ficam apenas no arquivo `.env.local` do computador. Nunca no chat, print, commit ou relatório.

## O que é manual (só você pode fazer)

1. Entrar no painel de desenvolvedor do Mercado Pago com a conta do Método AFEE.
2. Abrir a aplicação já usada pelo site (a mesma que gerou o token de produção).
3. Localizar a seção **Credenciais de teste** (separada das credenciais de produção).
4. Copiar dois valores dessa seção:
   - **Public Key** de teste — começa com `TEST-`;
   - **Access Token** de teste — começa com `TEST-`.
5. Se a aplicação ainda não tiver credenciais de teste, criá-las no próprio painel.
6. Criar ou usar as **contas de teste** (vendedor e comprador) para simular a compra.
7. Consultar a **lista oficial de cartões de teste** para o cenário desejado: aprovado, recusado, CVV inválido, validade inválida, limite insuficiente.

Nada disso precisa ser enviado para mim.

## O que eu faço depois

1. Ler o `.env.local` já preparado no projeto.
2. Confirmar que as credenciais são de teste e não de produção.
3. Subir o servidor local e abrir `/checkout`.
4. Reproduzir o erro do cartão e identificar a etapa exata: formulário, tokenização ou backend.
5. Registrar evidências sem número de cartão, CVV, CPF, e-mail ou token completo.
6. Corrigir CardForm, CPF, mensagens de erro e backend conforme `docs/08-projeto-solucao-pagamentos-cartao.md`.
7. Rodar testes, typecheck, lint e build.
8. Devolver o resultado e só publicar com a sua autorização.

## Arquivo já preparado

`.env.local` na raiz do projeto, com os campos vazios e comentados. Basta colar os valores.

Para preencher com segurança, edite o arquivo direto no seu editor. Se preferir, me diga que eu abro o arquivo no editor e você só cola os valores.

## Onde pedir o valor de cada campo

| Campo | Onde encontrar |
|---|---|
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | Painel MP → sua aplicação → Credenciais de teste → Public Key |
| `MERCADOPAGO_ACCESS_TOKEN` | Painel MP → sua aplicação → Credenciais de teste → Access Token |
| `MERCADOPAGO_WEBHOOK_SECRET` | Painel MP → Webhooks/Notificações → URL do webhook → segredo gerado |
| Variáveis do Supabase | Painel do Supabase → projeto `metodo-afee` → API |

## Cuidados

- Credencial de teste começa com `TEST-`. Se não começar, é de produção: não usar nesta fase.
- Não testar com cartão real.
- Não publicar nada na `main` antes da homologação.
- Não alterar preço nem o fluxo Pix.

## Depois de preenchido

Me avise apenas com a frase **“preenchi o .env.local”**. Não cole os valores.
Eu sigo do passo 2 em diante.
