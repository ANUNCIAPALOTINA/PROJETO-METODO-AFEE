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
  `O Método AFEE está com preço de lançamento: ${preco} (de ${precoDe}). Link na bio.`;

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
      `Método AFEE, o ebook completo.\n\n12 capítulos: divisão da semana, tempo de treino, as quatro fases, o Termômetro, alimentação, motivação e rotina.\n\nPreço de lançamento: ${p.preco} (de ${p.precoDe}). Pix ou cartão, acesso na hora.\n\nLink na bio.\n\n${HASHTAGS}`,
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
      `Tempo de treino, descanso, divisão da semana e as quatro fases. Tudo organizado num ebook só.\n\nPreço de lançamento: ${p.preco} (de ${p.precoDe}). Pix ou cartão, acesso na hora.\n\nLink na bio.\n\n${HASHTAGS}`,
  },
];

// Semana 03 · Sair de casa (caps. 9 e 10 do ebook: motivação, disciplina e rotina).
export const semana03 = [
  {
    id: "01-saia-de-casa",
    dia: "Segunda",
    formato: "carrossel",
    objetivo: "Identificação, motivação (alcance)",
    slides: [
      { tipo: "capa", foto: "hero-noite-900.webp", posicao: "center 4%", etiqueta: "Capítulo 9, um pedaço", titulo: "Sem vontade de treinar hoje?" },
      { tipo: "texto", etiqueta: "A verdade", titulo: "Motivação você não vai ter todos os dias.", corpo: "Motivo + ação. Foque no que faz você se mexer, não no que você sente." },
      { tipo: "texto", etiqueta: "O truque", titulo: "Minta pra si mesmo: você só vai até o lugar.", corpo: "Chegando lá, aí sim decide se treina ou não." },
      { tipo: "texto", etiqueta: "O que acontece", titulo: "Você já saiu, já chegou. Vai voltar pra casa?", corpo: "Não. Mesmo cansado, você treina." },
      { tipo: "cta", titulo: "O problema é o conforto, não o cansaço." },
    ],
    legenda: (p) =>
      `O difícil não é o treino. É sair de casa.\n\nMinha regra: eu só prometo ir até o lugar. Chegando lá, decido. Quase sempre eu treino.\n\nManda pra quem precisa ler isso hoje.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "02-seja-sincero",
    dia: "Terça",
    formato: "carrossel",
    objetivo: "Reflexão, gera comentários (engajamento)",
    slides: [
      { tipo: "capa", foto: "historia-barra-812.webp", etiqueta: "Pergunta séria", titulo: "Por que você quer treinar de verdade?" },
      { tipo: "texto", etiqueta: "O clichê", titulo: "“É pela saúde.”", corpo: "Todo mundo fala isso. Quem para em poucos meses também falava." },
      { tipo: "texto", etiqueta: "Seja sincero", titulo: "Mostrar que é capaz? Impressionar alguém? Fazer os movimentos mais legais?", corpo: "Tudo bem. Ninguém precisa saber, só você." },
      { tipo: "texto", etiqueta: "O ponto", titulo: "O motivo real é o que te tira de casa nos dias ruins." },
      { tipo: "cta", titulo: "Treino com direção começa no motivo." },
    ],
    legenda: (p) =>
      `Se o seu motivo é "só pela saúde", você provavelmente vai parar.\n\nAche o motivo real, aquele que você não fala pra ninguém. É ele que te leva pro treino no frio, no calor e no cansaço.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "03-rotina-pronta",
    dia: "Quarta",
    formato: "carrossel",
    objetivo: "Educativo prático, gera salvamentos (alcance)",
    slides: [
      { tipo: "capa", foto: "metodo-parque-850.webp", etiqueta: "Capítulo 10, um pedaço", titulo: "Deixe tudo pronto antes da hora do treino" },
      {
        tipo: "lista",
        etiqueta: "Como eu faço",
        titulo: "Meu dia de treino",
        itens: [
          ["Manhã", "Pão, pasta de amendoim e café"],
          ["Meio-dia", "Almoço bom e mochila arrumada"],
          ["Tarde", "Hipercalórico"],
          ["17h às 19h", "Só trocar de roupa e sair"],
        ],
      },
      { tipo: "texto", etiqueta: "A lógica", titulo: "Uma ação leva à outra.", corpo: "Fiz tudo isso pra chegar em casa e não treinar? Não faz sentido." },
      { tipo: "cta", titulo: "Rotina é um passo a passo, não força de vontade." },
    ],
    legenda: (p) =>
      `Roupa separada, fone carregado, mochila pronta. Na hora do treino eu só me troco e saio.\n\nQuando cada hábito do dia está feito, treinar vira só o próximo passo.\n\nSalva e monta o seu.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "04-relato-joao",
    dia: "Quinta",
    formato: "imagem",
    objetivo: "Prova social (conversão)",
    slides: [{ tipo: "relato", nome: "João", texto: "Bom, me ajudou a sair de casa treinar kkkkkk" }],
    legenda: (p) =>
      `Sair de casa é metade do treino. Valeu, João.\n\nResultado individual, varia de pessoa para pessoa.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "05-sozinho-ou-com-amigo",
    dia: "Sexta",
    formato: "carrossel",
    objetivo: "Engajamento, marcar amigo (alcance)",
    slides: [
      { tipo: "capa", foto: "final-cta-1080.webp", etiqueta: "E você?", titulo: "Treinar sozinho ou com um amigo?" },
      { tipo: "texto", etiqueta: "Sozinho", titulo: "Fone no ouvido e descarrega tudo.", corpo: "Com um treino bem definido, você rende muito bem sozinho." },
      { tipo: "texto", etiqueta: "Com amigo", titulo: "Um puxa o outro nos dias ruins.", corpo: "Se ajudem nas séries finais, conversem e se divirtam. Treino não é pra ser chato." },
      { tipo: "texto", etiqueta: "A dica", titulo: "Escolha a música do treino antes de sair de casa.", corpo: "Aquela que tocou na série mais difícil." },
      { tipo: "cta", titulo: "Os dois funcionam com direção." },
    ],
    legenda: (p) =>
      `Eu sempre gostei de treinar sozinho. Mas um parceiro que te tira de casa nos dias ruins vale muito.\n\nMarca aqui quem treina (ou deveria treinar) com você.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "06-dia-perdido",
    dia: "Sábado",
    formato: "imagem",
    objetivo: "Motivação (alcance)",
    slides: [{ tipo: "capa", foto: "obrigado-noite-900.webp", etiqueta: "Pensa nisso", titulo: "Fez todos os hábitos do dia. Por que não ir treinar?" }],
    legenda: (p) =>
      `Quando o dia todo foi organizado pro treino, ficar em casa vira o dia perdido.\n\nMolde o dia pra que treinar seja só mais uma parte dele.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "07-oferta",
    dia: "Domingo",
    formato: "imagem",
    objetivo: "Oferta direta (conversão)",
    slides: [{ tipo: "cta", titulo: "Método AFEE", oferta: true }],
    legenda: (p) =>
      `Motivação, disciplina e rotina têm capítulo próprio no ebook. Junto com a divisão da semana e as quatro fases do treino.\n\nPreço de lançamento: ${p.preco} (de ${p.precoDe}). Pix ou cartão, acesso na hora.\n\nLink na bio.\n\n${HASHTAGS}`,
  },
];

// Semana 04 · Comece agora (caps. 3, 8, 11 e 12 do ebook).
export const semana04 = [
  {
    id: "01-calistenia-ou-academia",
    dia: "Segunda",
    formato: "carrossel",
    objetivo: "Polêmica leve, gera comentários (alcance)",
    slides: [
      { tipo: "capa", foto: "sem-academia-mureta-1080.webp", etiqueta: "Capítulo 3, um pedaço", titulo: "Por que eu começaria pela calistenia, não pela academia" },
      { tipo: "texto", etiqueta: "Na calistenia", titulo: "Você já começa movendo o próprio peso.", corpo: "Um exercício trabalha vários músculos de uma vez." },
      { tipo: "texto", etiqueta: "Na academia", titulo: "Normalmente começa com 5, 10, 15 kg num músculo só.", corpo: "Percebe como a progressão demora mais?" },
      { tipo: "texto", etiqueta: "Sem briga", titulo: "Peso e aparelho podem vir depois.", corpo: "Com um ou dois anos de calistenia, eles somam. Tudo no seu tempo." },
      { tipo: "cta", titulo: "Comece pelo próprio corpo." },
    ],
    legenda: (p) =>
      `Academia não é inimiga. Mas pra começar, eu escolheria a calistenia.\n\nVocê move o seu próprio peso desde o primeiro dia e trabalha vários músculos juntos.\n\nConcorda? Comenta aí.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "02-comer-e-o-dificil",
    dia: "Terça",
    formato: "carrossel",
    objetivo: "Educativo, gera salvamentos (alcance)",
    slides: [
      { tipo: "capa", foto: "hero-noite-900.webp", posicao: "center 4%", etiqueta: "Capítulo 8, um pedaço", titulo: "Treinar é fácil. Comer bem é difícil." },
      { tipo: "texto", etiqueta: "Metabolismo acelerado", titulo: "Coma mais do que você gasta.", corpo: "Arroz, ovos, pasta de amendoim, batata-doce, pão. Frutas e salada também." },
      { tipo: "texto", etiqueta: "A dica", titulo: "Saciado? Coma mais um pouco.", corpo: "E use refeição líquida: aveia, leite, frutas, farinha de arroz." },
      { tipo: "texto", etiqueta: "Metabolismo lento", titulo: "Coma menos do que você gasta.", corpo: "E, se puder, procure um nutricionista." },
      { tipo: "cta", titulo: "Sem dieta escrava. Comer bem vira normal." },
    ],
    legenda: (p) =>
      `O que mais acelerou minha evolução não foi um exercício. Foi entender a alimentação.\n\nNão sou nutricionista: isso é o que funcionou pra mim. Se você está acima do peso, procure um profissional.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "03-qualquer-lugar",
    dia: "Quarta",
    formato: "carrossel",
    objetivo: "Quebrar objeção de equipamento (consideração)",
    slides: [
      { tipo: "capa", foto: "metodo-parque-850.webp", etiqueta: "Capítulo 11", titulo: "O melhor lugar de treino é o que você gosta" },
      { tipo: "texto", etiqueta: "Não precisa", titulo: "Não precisa ser um lugar feito pra treinar." },
      { tipo: "texto", etiqueta: "Adapte", titulo: "Um murinho vira flexão. Uma barra de praça vira treino de costas.", corpo: "As possibilidades são infinitas." },
      { tipo: "texto", etiqueta: "Bônus", titulo: "Cada lugar novo traz exercícios novos.", corpo: "O treino nunca fica repetitivo." },
      { tipo: "cta", titulo: "Sem academia, sem aparelho." },
    ],
    legenda: (p) =>
      `Praça, parque, murinho, quintal. Se você gosta do lugar, você volta pra ele.\n\nOnde você treina hoje? Comenta aí.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "04-relato-luis",
    dia: "Quinta",
    formato: "imagem",
    objetivo: "Prova social honesta (conversão)",
    slides: [{ tipo: "relato", nome: "Luis Hoffman", texto: "O conteúdo é bom, foi direto ao ponto. Não tem milagre, mas é o melhor método que já vi até hoje." }],
    legenda: (p) =>
      `"Não tem milagre." Concordo, Luis. Tem método.\n\nResultado individual, varia de pessoa para pessoa.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "05-pratica-vale-mais",
    dia: "Sexta",
    formato: "carrossel",
    objetivo: "Reflexão, compartilhamento (alcance)",
    slides: [
      { tipo: "capa", foto: "historia-barra-812.webp", etiqueta: "Capítulo 12", titulo: "Você sabe tudo de treino. Mas treina?" },
      { tipo: "texto", etiqueta: "O problema", titulo: "Muito vídeo, muita informação, nada de prática.", corpo: "O cérebro “engorda” de informação." },
      { tipo: "texto", etiqueta: "Todo mundo conhece", titulo: "Aquele que sabe o certo e o errado de tudo.", corpo: "Mas não faz nada do que fala." },
      { tipo: "texto", etiqueta: "A conclusão", titulo: "Não espere saber tudo pra começar.", corpo: "Fazer qualquer coisa é melhor que não fazer nada." },
      { tipo: "cta", titulo: "Pare de assistir. Comece a treinar." },
    ],
    legenda: (p) =>
      `Essa reflexão veio de um amigo que está aplicando o método AFEE: informação sem prática é só gordura no cérebro.\n\nManda pra quem vive vendo vídeo de treino e não sai do sofá.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "06-relato-marco",
    dia: "Sábado",
    formato: "imagem",
    objetivo: "Prova social (conversão)",
    slides: [{ tipo: "relato", nome: "Marco B.", texto: "Método único, ninguém ensina na internet." }],
    legenda: (p) =>
      `Valeu, Marco. Foi pra isso que eu escrevi o método.\n\nResultado individual, varia de pessoa para pessoa.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "07-oferta",
    dia: "Domingo",
    formato: "imagem",
    objetivo: "Oferta direta (conversão)",
    slides: [{ tipo: "cta", titulo: "Método AFEE", oferta: true }],
    legenda: (p) =>
      `Quatro semanas de conteúdo aqui no perfil. No ebook está tudo junto, em ordem, em 12 capítulos.\n\nPreço de lançamento: ${p.preco} (de ${p.precoDe}). Pix ou cartão, acesso na hora.\n\nLink na bio.\n\n${HASHTAGS}`,
  },
];

export const semana05 = [
  {
    id: "01-cinco-mitos",
    dia: "Sábado",
    formato: "carrossel",
    objetivo: "Quebra de mito, gera comentários e salvamentos (alcance)",
    slides: [
      { tipo: "capa", foto: "sem-academia-mureta-1080.webp", etiqueta: "Mito x verdade", titulo: "5 mentiras que te contaram sobre treinar sem academia" },
      { tipo: "texto", etiqueta: "Mito 1", titulo: "“Calistenia não dá força.”", corpo: "Verdade: em vez de pôr peso, você deixa o movimento mais difícil." },
      { tipo: "texto", etiqueta: "Mito 2", titulo: "“Tem que ir até a falha em toda série.”", corpo: "Verdade: no meio do treino, pare 1 ou 2 repetições antes. A falha fica pro final." },
      { tipo: "texto", etiqueta: "Mito 3", titulo: "“Alonga antes, com o músculo frio.”", corpo: "Verdade: primeiro aqueça. Elástico frio esticado rasga." },
      { tipo: "texto", etiqueta: "Mito 4", titulo: "“Precisa de equipamento.”", corpo: "Verdade: um murinho, um banco e uma barra de praça bastam." },
      { tipo: "texto", etiqueta: "Mito 5", titulo: "“Treina tudo junto no mesmo dia.”", corpo: "Verdade: separe empurrar e puxar." },
      { tipo: "cta", titulo: "Qual desses você acreditava? Comenta o número." },
    ],
    legenda: (p) =>
      `Qual desses você acreditava? Comenta o número 👇\n\nTodos estão explicados no ebook, com o porquê de cada um.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "02-forcar-primeiro",
    dia: "Domingo",
    formato: "carrossel",
    objetivo: "Ideia exclusiva do AFEE, gera salvamentos (consideração)",
    slides: [
      { tipo: "capa", foto: "historia-barra-812.webp", etiqueta: "O erro do iniciante", titulo: "Deixar a barra pro final é o motivo de você não evoluir nela" },
      { tipo: "texto", etiqueta: "O problema", titulo: "Depois de 40 minutos de treino, não sobra força pro movimento difícil.", corpo: "Ele fica sempre por último. E nunca melhora." },
      { tipo: "fase", letra: "F", nome: "Forçar", texto: "Aqueceu? Faça agora o movimento mais pesado pra você.", idx: 1 },
      { tipo: "texto", etiqueta: "Depois", titulo: "Aí sim vem o resto do treino.", corpo: "Estimular e, no fim, Exaustar." },
      { tipo: "cta", titulo: "O mais pesado vem primeiro." },
    ],
    legenda: (p) =>
      `Você deixa o exercício mais difícil pro final do treino?\n\nNo Método AFEE ele vem logo depois do aquecimento. É o F de Forçar.\n\nManda pra quem só faz o fácil.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "03-quanto-custa",
    dia: "Segunda",
    formato: "carrossel",
    objetivo: "Quebrar objeção de preço (conversão)",
    slides: [
      { tipo: "capa", foto: "metodo-parque-850.webp", etiqueta: "Fiz a conta", titulo: "Quanto custa começar a treinar?" },
      { tipo: "texto", etiqueta: "Academia", titulo: "Mensalidade todo mês.", corpo: "Mais o deslocamento e o horário de funcionamento." },
      { tipo: "texto", etiqueta: "App de treino", titulo: "Assinatura todo mês.", corpo: "E um treino genérico, igual pra todo mundo." },
      { tipo: "texto", etiqueta: "Método AFEE", titulo: "Paga uma vez. Treina na praça ou em casa.", corpo: "Sem mensalidade e sem aparelho." },
      { tipo: "texto", etiqueta: "Importante", titulo: "Não substitui um profissional se você tem lesão.", corpo: "Mas organiza o seu treino do começo ao fim." },
      { tipo: "cta", titulo: "Método AFEE", oferta: true },
    ],
    legenda: (p) =>
      `Academia e app cobram todo mês. O Método AFEE você paga uma vez: ${p.preco} (de ${p.precoDe}).\n\nTreino na praça, no parque ou em casa.\n\nLink na bio.\n\n${HASHTAGS}`,
  },
  {
    id: "04-relato-lucas",
    dia: "Terça",
    formato: "imagem",
    objetivo: "Prova social (conversão)",
    slides: [{ tipo: "relato", nome: "Lucas", texto: "Comecei a treinar faz 3 meses, meu shape começou a ficar bom e saiu até uns movimentos novos." }],
    legenda: (p) =>
      `Movimento novo é o melhor sinal de que o treino tem direção. Valeu, Lucas.\n\nResultado individual, varia de pessoa para pessoa.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "05-um-treino-quatro-fases",
    dia: "Quarta",
    formato: "carrossel",
    objetivo: "Treino pronto pra salvar (alcance)",
    slides: [
      { tipo: "capa", foto: "faixa-grama-1080.webp", etiqueta: "Salva pra amanhã", titulo: "Sem academia. Um treino. Quatro fases." },
      { tipo: "fase", letra: "A", nome: "Aquecer", texto: "Movimentos dinâmicos até suar leve.", idx: 0 },
      { tipo: "fase", letra: "F", nome: "Forçar", texto: "O movimento mais pesado pra você, logo no começo.", idx: 1 },
      { tipo: "fase", letra: "E", nome: "Estimular", texto: "2 a 5 séries por exercício, parando 1 ou 2 repetições antes da falha.", idx: 2 },
      { tipo: "fase", letra: "E", nome: "Exaustar", texto: "Um exercício mais leve, agora sim até a falha.", idx: 3 },
      { tipo: "cta", titulo: "Começo, meio e fim." },
    ],
    legenda: (p) =>
      `Salva esse post e faz amanhã, em qualquer lugar.\n\nO ebook mostra quais exercícios entram em cada fase e como avançar.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "06-termometro",
    dia: "Quinta",
    formato: "carrossel",
    objetivo: "Curiosidade sobre o método (consideração)",
    slides: [
      { tipo: "capa", foto: "obrigado-noite-900.webp", etiqueta: "Do ebook", titulo: "Existe um termômetro que diz a hora da próxima série" },
      { tipo: "texto", etiqueta: "O que é", titulo: "Ele mede o quão frio ou quente seu corpo está." },
      { tipo: "texto", etiqueta: "Frio demais", titulo: "Descansou demais? O corpo esfriou.", corpo: "A próxima série rende menos." },
      { tipo: "texto", etiqueta: "Quente demais", titulo: "Sem descanso nenhum? Você fadiga rápido.", corpo: "E o treino acaba antes da hora." },
      { tipo: "cta", titulo: "Treino quente, sem fadiga." },
    ],
    legenda: (p) =>
      `Quanto tempo você descansa entre as séries? Comenta aí.\n\nNo Método AFEE quem decide é o termômetro: nem frio, nem fadigado.\n\n${CTA_LEGENDA(p.preco, p.precoDe)}\n\n${HASHTAGS}`,
  },
  {
    id: "07-dentro-do-ebook",
    dia: "Sexta",
    formato: "carrossel",
    objetivo: "Quebrar a objeção 'barato deve ser raso' (conversão)",
    slides: [
      { tipo: "capa", foto: "final-cta-1080.webp", etiqueta: "Por dentro", titulo: "O que vem dentro do Método AFEE" },
      { tipo: "lista", etiqueta: "12 capítulos, em ordem", titulo: "O que você aprende", itens: [["Método", "Aquecer, Forçar, Estimular, Exaustar"], ["Descanso", "O termômetro"], ["Semana", "Empurrar e puxar"], ["Lugar", "Praça, parque, casa"], ["Comida", "Do jeito simples"]] },
      { tipo: "relato", nome: "Luis Hoffman", texto: "O conteúdo é bom, foi direto ao ponto. Não tem milagre, mas é o melhor método que já vi até hoje." },
      { tipo: "cta", titulo: "Método AFEE", oferta: true },
    ],
    legenda: (p) =>
      `“É barato, deve ser raso.” Olha o que vem dentro e decide.\n\nPreço de lançamento: ${p.preco} (de ${p.precoDe}). Pix ou cartão, acesso na hora.\n\nLink na bio.\n\n${HASHTAGS}`,
  },
];

export const semanas = { "01": semana01, "02": semana02, "03": semana03, "04": semana04, "05": semana05 };
