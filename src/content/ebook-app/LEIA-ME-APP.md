# Ebook-app Método AFEE: estado (2026-10-25)

## O que é
Ebook interativo autocontido em `index.html`, com as fotos embutidas.
- A rota protegida `/ebook` lê esse arquivo, confirma o acesso pago e injeta a marca d'água com o e-mail do aluno.
- O modo instalável/offline é removido na entrega para não deixar uma cópia acessível depois do logout.
- O arquivo não fica em `public/`: só a rota autenticada o entrega.

## Conteúdo e recursos
- 12 capítulos com texto integral do `Metodo-AFEE-previa.pdf` (sem edição), aviso legal da seção 8 do guia.
- Livro dividido em 4 partes = A·F·E·E (caps 1–3, 4–6, 7–9, 10–12). Barra de progresso em degraus no topo.
- Cap 4 abre com a foto da parada de mão inteira (sem corte); cap 7 abre com termômetro animado (enche com a rolagem).
- Interativos: semana de treino (cap 4), duração força×resistência (cap 5), fases A·F·E·E (cap 6), termômetro (cap 7), alimentação (cap 8), "seu motivo" salvo no aparelho (cap 9), roteiro do dia com checklist (cap 10).
- Cronômetro AFEE (botão "Treino"): descansos 1:30/2:00/5:00 e 0:15/0:25/0:40, relógio do treino que avisa a hora do Exaustar, bipe + vibração, tela acesa.
- Progresso salvo no aparelho: capítulos lidos, "continuar de onde parou".

## Como editar
O conteúdo entregue está em `src/content/ebook-app/index.html`. O gerador original não está versionado neste repositório.

Para sincronizar as fotos já tratadas da página de vendas dentro do ebook, execute `scripts/atualizar-fotos-ebook.ps1` no PowerShell 7. O script substitui somente as seis imagens conhecidas e compara o SHA-256 de cada imagem embutida com o WebP de `public/fotos/`.

## Pendências
- Versionar o gerador original antes da próxima alteração estrutural do ebook. O script atual resolve apenas a troca segura das fotos.
