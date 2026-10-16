# Playbook — Instagram do Método AFEE

**Status:** operacional
**Objetivo:** manter a publicação diária da página e transformar o processo em referência para futuros clientes da agência.

## O que já existe

- Planejamento semanal aprovado em `marketing/instagram/agenda.json`.
- Conteúdo e roteiros em `marketing/instagram/conteudo.mjs`.
- Artes em `marketing/instagram/gerar.mjs`.
- Reels em `marketing/instagram/reel.mjs`.
- Publicação automatizada em `marketing/instagram/publicar.mjs`.
- Sugestões de IA em `marketing/instagram/ia.mjs`.
- Workflow semanal de ideias em `.github/workflows/ia.yml`.
- Workflow de publicação em `.github/workflows/instagram.yml`.
- Workflow de Reels em `.github/workflows/reels.yml`.

## Rotina atual

1. O planejamento aprovado é registrado na `agenda.json`.
2. O conteúdo da semana é gerado conforme os roteiros existentes.
3. As artes são renderizadas em formato de carrossel.
4. Reels são derivados dos carrosséis selecionados.
5. O GitHub Actions publica conforme a agenda e os segredos configurados.
6. O resultado deve ser acompanhado por alcance, retenção, cliques, conversas e vendas.

## Regra de operação

Não criar um segundo calendário para o Método AFEE. O trabalho da agência é melhorar o sistema existente, ligar cada conteúdo à oferta correta e documentar o processo para replicação.

## Adaptação para clientes

Ao aplicar este playbook a outro cliente, copiar o **processo**, não os textos, identidade ou público do Método AFEE. Cada cliente precisa de:

- briefing próprio;
- oferta própria;
- tom de voz próprio;
- agenda própria;
- aprovação documentada;
- métricas e destino de conversão definidos.

## Próximas melhorias

- registrar a oferta associada a cada item da agenda;
- identificar a origem de cada conversa ou lead;
- criar relatório semanal curto;
- medir quais formatos geram atenção e quais geram conversão;
- transformar os melhores padrões em template de cliente.

## Restrições

- Não inserir tokens ou credenciais neste documento.
- Respeitar as regras de links e promessas do `README.md` do projeto.
- Não publicar material sem aprovação quando a agenda exigir aprovação.
