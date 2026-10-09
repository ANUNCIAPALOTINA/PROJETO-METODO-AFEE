/**
 * Conteúdo dos posts do Instagram (carrosséis e imagens únicas).
 * REGRAS: só relatos reais de src/content/relatos.ts, sem promessa de resultado
 * garantido, voz do Garlet (primeira pessoa, frases curtas).
 * Preço vem de src/config/produto.ts (lido pelo gerar.mjs), nunca escrito aqui.
 *
 * Tipos de slide: capa, texto, lista, fase, relato, cta.
 * Capa: `posicao` (CSS background-position) ajusta o enquadramento da foto; padrão "center".
 */

const HASHTAGS =
  "#calistenia #calisteniabrasil #treinoemcasa #treinosemacademia #barrafixa #flexao #treinodecalistenia #metodoafee";

const CTA_LEGENDA = (preco, precoDe) =>
  `O Método AFEE está com preço de lançamento: ${preco} (de ${precoDe}). Link na bio.\nOu comente MÉTODO que eu te mando o link.`;

export const semana01 = [
  {
    id: "01-girando-em-circulos",
    dia: "Segunda",
    formato: "carrossel",
    objetivo: "Dor + identificação (alcance)",
    slides: [
      { tipo: "capa", foto: "hero-noite-900.webp", posicao: "center 4%", etiqueta: "Pra quem já treina", titulo: "Você treina. Mas sente que está girando em círculos?" },
      { tipo: "texto", etiqueta: "Sinal 1", titulo: "Você não sabe se o seu treino está funcionando de verdade." },
      { tipo: "texto", etiqueta: "Sinal 2", titulo: "Você não sabe como dividir a semana nem quanto descansar." },
      { tipo: "texto", etiqueta: "Sinal 3", titulo: "Você acha que calistenia é complicada demais ou “não é para mim”." },
      { tipo: "texto", etiqueta: "A real", titulo: "O problema não é você. Falta direção.", corpo: "Todo mundo ensina a fazer o movimento. Ninguém ensina a montar o treino." },
      { tipo: "cta", titulo: "Treino com começo, meio e fim." },
    ],
    legenda: (p) =>
      `Se você se viu em pelo menos um desses sinais, não é falta de esforço. É falta de direção.\n\nEu treinei anos assim, sem saber se estava evoluindo. Foi isso que me fez criar o AFEE: uma sigla, quatro fases, e você nunca mais treina perdido.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "02-quatro-fases",
    dia: "Terça",
    formato: "carrossel",
    objetivo: "Apresentar o método (consideração)",
    slides: [
      { tipo: "capa", foto: "metodo-parque-850.webp", etiqueta: "O método", titulo: "Quatro fases. Uma lógica.", sub: "Uma sigla. Nunca mais treinar perdido." },
      { tipo: "fase", letra: "A", nome: "Aquecer", texto: "Prepara o corpo do jeito certo.", idx: 0 },
      { tipo: "fase", letra: "F", nome: "Forçar", texto: "Onde a força é construída.", idx: 1 },
      { tipo: "fase", letra: "E", nome: "Estimular", texto: "O coração do treino.", idx: 2 },
      { tipo: "fase", letra: "E", nome: "Exaustar", texto: "O fim que faz a diferença.", idx: 3 },
      { tipo: "texto", etiqueta: "O Termômetro", titulo: "O detalhe que acerta o ritmo de cada série.", corpo: "Sem chegar à falha, sem deixar o corpo esfriar. Explico tudo só no ebook." },
      { tipo: "cta", titulo: "Aquecer. Forçar. Estimular. Exaustar." },
    ],
    legenda: (p) =>
      `AFEE é a ordem que eu sigo em todo treino: Aquecer, Forçar, Estimular, Exaustar.\n\nCada fase tem um papel. Quando você sabe onde está no treino, sabe o que fazer a seguir.\n\nSalva esse post pra lembrar a sequência.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "03-dividir-a-semana",
    dia: "Quarta",
    formato: "carrossel",
    objetivo: "Educativo, gera salvamentos (alcance)",
    slides: [
      { tipo: "capa", foto: "historia-barra-812.webp", etiqueta: "Capítulo 4, um pedaço", titulo: "Como eu divido os treinos na semana" },
      { tipo: "texto", etiqueta: "Primeiro", titulo: "Na calistenia nenhum exercício é isolado.", corpo: "Na flexão, braço e peito fazem a força, mas costas e abdômen também trabalham. Por isso a divisão é por grupos maiores." },
      {
        tipo: "lista",
        etiqueta: "Exemplo de semana",
        titulo: "Um jeito de dividir",
        itens: [
          ["Seg", "Costas e bíceps"],
          ["Ter", "Peito e tríceps"],
          ["Qua", "Abdômen e pernas"],
          ["Qui", "Descanso"],
          ["Sex", "Treino geral"],
          ["Sáb e Dom", "Movimentos avançados e progressões"],
        ],
      },
      { tipo: "texto", etiqueta: "Dica", titulo: "Escolha um movimento-alvo e treine as progressões dele.", corpo: "Muscle up, por exemplo. Desbloqueie um, faça bem feito, depois parta pro próximo." },
      { tipo: "texto", etiqueta: "Cuidado", titulo: "Não misture puxar e empurrar no treino comum.", corpo: "Alternando barra e flexão você demora pra chegar na exaustão e o treino perde efeito." },
      { tipo: "cta", titulo: "O capítulo completo está no ebook." },
    ],
    legenda: (p) =>
      `Esse é o jeito que eu divido a semana. Só um dia de descanso total, mas cada grupo fica mais de dois dias sem ser o foco.\n\nAdapte aos seus dias. O importante é ter uma divisão e seguir.\n\nSalva pra montar a sua semana.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "04-relatos",
    dia: "Quinta",
    formato: "carrossel",
    objetivo: "Prova social (conversão)",
    slides: [
      { tipo: "capa", foto: "final-cta-1080.webp", etiqueta: "Quem já aplicou", titulo: "O que os alunos falaram do Método AFEE" },
      { tipo: "relato", nome: "Lucas", texto: "Comecei a treinar faz 3 meses, meu shape começou a ficar bom e saiu até uns movimentos novos." },
      { tipo: "relato", nome: "Bruno", texto: "Garlet, eu nunca tinha pensado em treinar assim. Agora eu vou treinar sabendo como começa e termina." },
      { tipo: "relato", nome: "Luis Hoffman", texto: "O conteúdo é bom, foi direto ao ponto. Não tem milagre, mas é o melhor método que já vi até hoje." },
      { tipo: "relato", nome: "Marco B.", texto: "Método único, ninguém ensina na internet." },
      { tipo: "relato", nome: "João", texto: "Bom, me ajudou a sair de casa treinar kkkkkk" },
      { tipo: "cta", titulo: "Agora é a sua vez." },
    ],
    legenda: (p) =>
      `Relatos reais de quem aplicou o método. Obrigado, pessoal.\n\nComo o Luis disse: não tem milagre. Tem direção e constância.\n\nResultados individuais, variam de pessoa para pessoa.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "05-sem-academia",
    dia: "Sexta",
    formato: "imagem",
    objetivo: "Quebrar objeção (alcance)",
    slides: [
      { tipo: "capa", foto: "sem-academia-mureta-1080.webp", etiqueta: "Sem desculpa", titulo: "Sem academia, sem aparelho.", sub: "Um murinho já basta. Você treina com o que tem, onde estiver." },
    ],
    legenda: (p) =>
      `Calistenia é só o peso do corpo. Uma barra ajuda, mas não é obrigatória.\n\nPraça, parque, quintal, mureta. O melhor lugar é o que te faz querer ir.\n\nMarca aquele amigo que sempre fala que não treina porque não tem academia.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "06-minha-historia",
    dia: "Sábado",
    formato: "carrossel",
    objetivo: "Conexão com o autor (confiança)",
    slides: [
      { tipo: "capa", foto: "obrigado-noite-900.webp", etiqueta: "Minha história", titulo: "Como nasceu o Método AFEE" },
      { tipo: "texto", etiqueta: "Antes", titulo: "Sempre fui magro “de ruim”." },
      { tipo: "texto", etiqueta: "O erro", titulo: "Treinei anos sem método.", corpo: "Fazia o movimento, mas não sabia montar o treino." },
      { tipo: "texto", etiqueta: "A queda", titulo: "Um acidente de moto me tirou 10 kg e 6 meses de treino." },
      { tipo: "texto", etiqueta: "O recomeço", titulo: "Recomecei do zero, dessa vez com lógica.", corpo: "Em 6 meses, nasceu o AFEE." },
      { tipo: "cta", titulo: "Escrevi tudo o que aprendi em 12 capítulos." },
    ],
    legenda: (p) =>
      `Perder 10 kg e 6 meses de treino foi o que me obrigou a parar e pensar.\n\nRecomecei do zero, mas dessa vez anotando o que funcionava. Dali saiu o AFEE.\n\nSe você está recomeçando agora, comece pelo mais simples. Com direção.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "07-oferta",
    dia: "Domingo",
    formato: "imagem",
    objetivo: "Oferta direta (conversão)",
    slides: [{ tipo: "cta", titulo: "Método AFEE", oferta: true }],
    legenda: (p) =>
      `Método AFEE, o ebook completo.\n\n12 capítulos: divisão da semana, tempo de treino, as quatro fases, o Termômetro, alimentação, motivação e rotina.\n\nPreço de lançamento: ${p.preco} (de ${p.precoDe}). Pix ou cartão, acesso na hora.\n\nLink na bio. Ou comente MÉTODO que eu te mando.\n\n${HASHTAGS}`,
  },
];

// Semana 02 · Tempo e ritmo (caps. 4 e 5 do ebook). Fonte dos fatos: ebook-app chapters.json.
export const semana02 = [
  {
    id: "01-treino-curto-ou-longo",
    dia: "Segunda",
    formato: "carrossel",
    objetivo: "Educativo, gera salvamentos (alcance)",
    slides: [
      { tipo: "capa", foto: "metodo-parque-850.webp", etiqueta: "Capítulo 5, um pedaço", titulo: "Treino curto ou treino longo?" },
      { tipo: "texto", etiqueta: "A regra", titulo: "Quanto maior o tempo de treino, mais foco na resistência." },
      { tipo: "texto", etiqueta: "O outro lado", titulo: "Quanto menor o tempo de treino, mais foco na força." },
      { tipo: "texto", etiqueta: "Na prática", titulo: "Dá pra treinar de 45 minutos até 2 horas.", corpo: "Modele intensidade e descanso pelo tempo que você tem e pelo resultado que busca em cada treino." },
      { tipo: "cta", titulo: "Treino com começo, meio e fim." },
    ],
    legenda: (p) =>
      `Não existe tempo certo de treino. Existe o tempo certo pro que você quer naquele dia.\n\nTreino longo puxa resistência. Treino curto puxa força. Escolha antes de começar.\n\nSalva pra lembrar.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "02-quanto-descansar",
    dia: "Terça",
    formato: "carrossel",
    objetivo: "Educativo, responde dúvida comum (alcance)",
    slides: [
      { tipo: "capa", foto: "sem-academia-mureta-1080.webp", etiqueta: "Dúvida comum", titulo: "Quanto descansar entre as séries?" },
      {
        tipo: "lista",
        etiqueta: "O que eu uso",
        titulo: "Descanso no treino",
        itens: [
          ["Entre séries", "De 90 a 120 segundos"],
          ["Trocou de exercício", "Até 5 minutos"],
        ],
      },
      { tipo: "texto", etiqueta: "Cuidado", titulo: "Não estique o descanso além disso.", corpo: "O corpo esfria: você perde força e ritmo, e ainda pode sentir dores." },
      { tipo: "texto", etiqueta: "O ponto", titulo: "Descanso também faz parte do treino.", corpo: "No método AFEE ele é contado, não chutado." },
      { tipo: "cta", titulo: "O ritmo certo está no ebook." },
    ],
    legenda: (p) =>
      `De 90 a 120 segundos entre séries. Até 5 minutos quando troca de exercício.\n\nMais que isso, o corpo esfria e o treino perde força.\n\nVocê cronometra o seu descanso? Me conta nos comentários.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "03-estipule-o-tempo",
    dia: "Quarta",
    formato: "carrossel",
    objetivo: "Mostrar a lógica do método (consideração)",
    slides: [
      { tipo: "capa", foto: "historia-barra-812.webp", etiqueta: "Como eu monto", titulo: "Estipule um tempo e encaixe os exercícios nele" },
      { tipo: "texto", etiqueta: "Passo 1", titulo: "Defina quanto tempo vai treinar.", corpo: "Exemplo: 1h15." },
      { tipo: "texto", etiqueta: "Passo 2", titulo: "Encaixe os exercícios dentro desse tempo.", corpo: "Respeitando o descanso entre as séries." },
      { tipo: "texto", etiqueta: "Passo 3", titulo: "No fim do tempo, a última fase: Exaustar.", corpo: "Você chega cansado, mas ainda com energia para fechar o treino." },
      { tipo: "cta", titulo: "Aquecer. Forçar. Estimular. Exaustar." },
    ],
    legenda: (p) =>
      `Um treino sem hora pra acabar vira treino sem direção.\n\nEu defino o tempo antes, encaixo os exercícios e guardo o final pra última fase do AFEE.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "04-relato-bruno",
    dia: "Quinta",
    formato: "imagem",
    objetivo: "Prova social (conversão)",
    slides: [{ tipo: "relato", nome: "Bruno", texto: "Garlet, eu nunca tinha pensado em treinar assim. Agora eu vou treinar sabendo como começa e termina." }],
    legenda: (p) =>
      `Saber como o treino começa e termina muda tudo. Valeu, Bruno.\n\nResultado individual, varia de pessoa para pessoa.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "05-puxar-e-empurrar",
    dia: "Sexta",
    formato: "carrossel",
    objetivo: "Educativo com teste prático (engajamento)",
    slides: [
      { tipo: "capa", foto: "final-cta-1080.webp", etiqueta: "Faça o teste", titulo: "Por que eu separo puxar e empurrar" },
      { tipo: "texto", etiqueta: "O teste", titulo: "Faça várias séries de barra. Depois, uma série de flexão.", corpo: "A flexão não vai ser difícil." },
      { tipo: "texto", etiqueta: "O motivo", titulo: "Alternando os dois, você demora muito pra chegar na exaustão.", corpo: "O treino fica longo e perde efeito." },
      { tipo: "texto", etiqueta: "A exceção", titulo: "Puxar e empurrar juntos só num treino específico.", corpo: "Uma série de cada, sem pausa, num dia separado. Intenso. Deixe para quando estiver habituado." },
      { tipo: "cta", titulo: "A divisão completa está no capítulo 4." },
    ],
    legenda: (p) =>
      `Testa e me conta: depois de várias séries de barra, a flexão ficou fácil?\n\nÉ por isso que no treino comum eu não misturo puxar e empurrar.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "06-um-movimento-por-vez",
    dia: "Sábado",
    formato: "imagem",
    objetivo: "Motivação (alcance)",
    slides: [{ tipo: "capa", foto: "obrigado-noite-900.webp", etiqueta: "Um de cada vez", titulo: "Desbloqueie um movimento. Faça bem feito. Depois o próximo." }],
    legenda: (p) =>
      `Não queira aprender tudo de uma vez.\n\nEscolha um movimento-alvo, treine as progressões dele e só depois parta pro próximo.\n\nQual é o seu movimento-alvo agora? Comenta aí.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "07-oferta",
    dia: "Domingo",
    formato: "imagem",
    objetivo: "Oferta direta (conversão)",
    slides: [{ tipo: "cta", titulo: "Método AFEE", oferta: true }],
    legenda: (p) =>
      `Tempo de treino, descanso, divisão da semana e as quatro fases. Tudo organizado num ebook só.\n\nPreço de lançamento: ${p.preco} (de ${p.precoDe}). Pix ou cartão, acesso na hora.\n\nLink na bio. Ou comente MÉTODO que eu te mando.\n\n${HASHTAGS}`,
  },
];

export const semanas = { "01": semana01, "02": semana02 };
