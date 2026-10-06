# Método AFEE — Mapa do site (Passo 2)

Rascunho para aprovação. Nada aqui foi para o código ainda.
Itens marcados **[PENDENTE]** dependem de uma resposta ou de um dado seu.

---

## 1. Decisões que sustentam o mapa

| Item | Decisão |
|---|---|
| Hospedagem | Netlify (conta paga já usada no Bazar) |
| Endereço | `.netlify.app` por enquanto. **[PENDENTE]** domínio próprio antes de vender |
| Pagamento | Mercado Pago, checkout **dentro do site** (Pix e cartão) |
| Dados no checkout | Nome, e-mail e CPF |
| Acesso | Login por link no e-mail (Supabase) |
| Depois de pagar | `/obrigado` com botão "Acessar agora" + link no e-mail |
| Suporte | Só e-mail. **[PENDENTE]** endereço real (placeholder: `suporte@exemplo.com`) |

---

## 2. Páginas

| Rota | Acesso | Função |
|---|---|---|
| `/` | Público | Página de vendas |
| `/checkout` | Público | Nome, e-mail, CPF e pagamento (Pix ou cartão) |
| `/obrigado` | Público, por token do pedido | Status do pagamento e botão "Acessar agora" |
| `/entrar` | Público | Login por link no e-mail, para quem volta |
| `/ebook` | **Protegido** | Índice do ebook e progresso |
| `/ebook/[capitulo]` | **Protegido** | Leitor, um capítulo por página |
| `/suporte` | Público | Contato, reembolso em 7 dias e dúvidas de acesso |
| `/termos` | Público | Termos de uso e compra |
| `/privacidade` | Público | Política de privacidade (LGPD) |

APIs internas (não são telas):

| Rota | Função |
|---|---|
| `POST /api/pedido` | Valida os dados, cria o pedido e o pagamento no Mercado Pago |
| `GET /api/pedido/[token]` | Consulta o status do pedido (usado pela tela de Pix aguardando) |
| `POST /api/webhook/mercadopago` | Recebe o aviso de pagamento, confirma no Mercado Pago e libera o acesso |
| `POST /api/acesso` | Gera a sessão do botão "Acessar agora" |

---

## 3. Fluxo de compra

```
/  (vendas)
 └─ botão "Quero o Método AFEE"
     └─ /checkout
         ├─ Pix → mostra QR code + "copia e cola" → espera pagamento
         └─ Cartão → aprovado | em análise | recusado
             └─ /obrigado?p=<token do pedido>
                 ├─ aprovado → "Acessar agora" → /ebook  (+ e-mail com o link)
                 ├─ pendente → "Estamos aguardando o Pix" (atualiza sozinho)
                 └─ recusado → "Não foi aprovado" → volta ao /checkout
```

### 3.1 Estados da tela de checkout

| Estado | O que o cliente vê |
|---|---|
| Inicial | Resumo (Método AFEE, R$ 16,18, garantia de 7 dias) e formulário |
| Validando | Botão desabilitado com indicador de carregamento |
| Erro de campo | Mensagem junto do campo (CPF inválido, e-mail inválido) |
| Pix gerado | QR code, código "copia e cola", botão copiar e prazo de validade |
| Cartão recusado | Mensagem simples e nova tentativa, ou trocar para Pix |
| Falha do Mercado Pago | "Não conseguimos processar agora. Tente de novo em alguns minutos." Nada é cobrado |

### 3.2 Estados da tela `/obrigado`

| Estado | Mensagem | Ação |
|---|---|---|
| Aprovado | "Pagamento confirmado." | Botão **Acessar agora** e aviso de que o link foi enviado ao e-mail |
| Pix aguardando | "Aguardando o seu Pix." | Atualiza sozinho e mostra o QR de novo se o cliente voltou |
| Em análise | "Seu pagamento está em análise. Avisamos por e-mail." | Link para `/suporte` |
| Recusado ou expirado | "Esse pagamento não foi concluído." | Botão para tentar de novo |
| Token inválido | "Pedido não encontrado." | Link para `/suporte` e `/entrar` |

---

## 4. Fluxo de acesso

### 4.1 Primeiro acesso (logo após pagar)
1. O Mercado Pago avisa o webhook que o pagamento foi aprovado.
2. O servidor **consulta o pagamento direto na API do Mercado Pago** (nunca confia só no aviso recebido), confirma valor e status e marca o pedido como pago.
3. O servidor cria o usuário no Supabase (se não existir) e registra o direito de acesso.
4. A tela `/obrigado` percebe a aprovação e mostra **Acessar agora**. O clique gera a sessão e leva a `/ebook`.
5. Em paralelo, o cliente recebe um e-mail com o link de acesso.

### 4.2 Acessos seguintes
1. O cliente abre `/entrar` e digita o e-mail.
2. A tela responde sempre a mesma coisa: "Se existe uma compra com esse e-mail, enviamos o link." Isso impede descobrir quem comprou.
3. Se houver compra, o link chega por e-mail. Senão, nada chega. A tela de espera oferece o link para comprar.
4. O link abre `/ebook` já logado.

### 4.3 Regras de proteção
- `/ebook` e `/ebook/[capitulo]` exigem **sessão válida e direito de acesso ativo**. Sem isso, vão para `/entrar`.
- O texto dos capítulos **não fica no HTML público** nem no bundle. É buscado do servidor só para quem tem acesso.
- Marca d'água discreta com o e-mail do comprador no leitor, para desencorajar o repasse.
- O token do pedido é aleatório e longo. O link de `/obrigado` não vale como acesso depois de usado.
- Reembolso feito no Mercado Pago **revoga o acesso** (via webhook de reembolso).

---

## 5. Navegação e rodapé

- A página de vendas **não tem menu cheio**, só logo e um botão. Menu distrai quem está decidindo comprar.
- Botão de compra fixo no rodapé do celular.
- Rodapé em todas as páginas públicas: Termos, Privacidade, Suporte e Entrar.
- Aviso legal da seção 11 do `01-oferta.md` no rodapé da página de vendas.

---

## 6. Pendências técnicas e de conta

| # | Pendência | Quando preciso |
|---|---|---|
| 1 | Conta Mercado Pago com credenciais de teste (chave pública e token) e depois de produção | Fase 6 |
| 2 | Projeto no Supabase (posso criar com o conector, vou perguntar antes) | Passo 16 |
| 3 | Domínio próprio, para o e-mail de acesso entregar bem | Antes de vender |
| 4 | Serviço de envio de e-mail (por exemplo Resend) ligado ao domínio | Antes de vender |
| 5 | E-mail de suporte real, no lugar de `suporte@exemplo.com` | Passo 13 |
| 6 | Dados do vendedor para os Termos: nome ou razão social e CPF ou CNPJ | Passo 13 |
| 7 | Nota fiscal: depende de como você vende (CPF ou MEI/CNPJ) | Antes de vender |
| 8 | Acesso vitalício ou por prazo? (herdado do Passo 1) | Passo 16 |
| 9 | Liberar PDF para download? (herdado do Passo 1) | Passo 18 |

**Alerta:** sem domínio próprio, o link mágico por e-mail tem alto risco de ir para o spam. O site pode ser construído e testado no `.netlify.app`, mas **não deve começar a vender assim**.
