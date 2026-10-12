# Guia para outras IAs (Gemini, ChatGPT, Hermes)

## Como ler o projeto (nesta ordem)
1. `README.md` — mapa e regras do João.
2. `DESAFIOS.md` — armadilhas conhecidas (evita retrabalho).
3. Só depois, os arquivos da tarefa.

## Como receber uma tarefa
O João (ou o Claude) cria um `TASK.md` na raiz ou em `tarefas/AAAA-MM-DD-nome.md`:
```md
# TASK: <título curto>
Responsável: Gemini | ChatGPT | Hermes
Objetivo: <uma frase>
Arquivos: <caminhos que pode mexer>
Pronto quando: <critério verificável>
Não fazer: <limites extras>
## Resultado (preenchido por quem fez)
<o que mudou, arquivos, como testar>
```
Entregue em branch própria + Pull Request. Nunca direto na `main`.

## Nunca tocar
- Valores de segredos (nunca escrever chave/token em arquivo ou chat).
- `src/lib/pagamentos`, `src/app/api/webhooks`, `src/lib/acesso`, `supabase/migrations` sem tarefa explícita.
- Preço (`src/config/produto.ts`) e textos do ebook (`src/content/ebook`, testes dependem deles).
- Outros projetos Supabase além de `metodo-afee`.
- Contratar/ativar qualquer serviço pago.

## Estilo
PT-BR, legendas sem links até 09/11/2026, sem promessas de resultado. Rode `npm run typecheck && npm run lint && npm test` antes do PR.
