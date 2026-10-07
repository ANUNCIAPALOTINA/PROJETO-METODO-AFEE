import { precoFormatado, produto } from "@/config/produto";

/**
 * Textos da página de vendas, vindos de docs/01-oferta.md.
 * Edite aqui para mudar uma frase, sem mexer no desenho da página.
 * Regra de copy: nenhuma promessa de resultado garantido; resultado é sempre
 * apresentado como a experiência do autor.
 */

/** Texto do botão de compra (o preço vem do arquivo central). */
export const rotuloBotaoCompra = `Quero o ${produto.nome} · ${precoFormatado}`;

export const vendas = {
  hero: {
    etiqueta: "Calistenia · Método AFEE",
    titulo: "Pare de treinar sem saber se está funcionando.",
    subtitulo:
      "O Método AFEE é um jeito simples de montar seu treino de calistenia com começo, meio e fim. Você sabe o que fazer em cada fase e por quê. Sem academia, sem aparelho.",
    autor: `Por ${produto.autor.exibicao} · Ebook com acesso imediato`,
    microtexto: `Pagamento único · Garantia de ${produto.garantiaDias} dias · Acesso imediato`,
  },

  identificacao: {
    titulo: "Você treina. Mas sente que está girando em círculos?",
    paragrafos: [
      "Eu também senti. Fazia 3 séries de cada exercício, até a falha, todo dia. No começo, todo mundo evolui. Depois de um ano, estávamos estagnados.",
      "Eu via vídeos de calistenia na internet e me perguntava: como começar? O que eu deveria fazer? Como progredir? Todo mundo ensinava como executar um movimento. Ninguém ensinava como montar o treino.",
    ],
    dores: [
      "Você não sabe se o seu treino está funcionando de verdade.",
      "Você não sabe como dividir a semana nem quanto descansar.",
      "Você acha que calistenia é complicada demais ou “não é para mim”.",
    ],
    fecho:
      "Se você já copiou o treino de alguém que está no auge e se frustrou, o problema não é você. Falta direção.",
  },

  historia: {
    etiqueta: "Minha história",
    titulo: "Sempre fui magro “de ruim”. Recomecei do zero.",
    paragrafos: [
      "Comecei a treinar aos 17 anos, pensando em servir o exército. Barra fixa, flexão, abdominal e corrida. Funcionou por um tempo. Depois do quartel, fiquei muito tempo só correndo, e ainda não era calistenia de verdade.",
      "Quando descobri que era possível construir um shape treinando só com o peso do corpo, passei a estudar tudo. Muita coisa não dava certo. Um ano depois, um acidente de moto: perna quebrada, cirurgia, 6 meses sem andar direito e cerca de 10 kg perdidos. Tudo que eu tinha construído foi embora.",
      "Eu recomecei do mais básico e simples. Dessa vez, fui atrás de entender como organizar o treino. Em 6 meses de muito esforço, cheguei ao que chamo carinhosamente de AFEE.",
    ],
    legendaEvolucao: "Minha evolução",
  },

  metodo: {
    etiqueta: "O método",
    titulo: "Quatro fases. Uma lógica.",
    abertura:
      "O AFEE é uma sigla para você nunca mais ficar perdido na hora de treinar.",
    fases: [
      {
        letra: "A",
        nome: "Aquecer",
        descricao:
          "Esquente o corpo com movimentos dinâmicos, sem aquele alongamento que estica músculo frio.",
      },
      {
        letra: "F",
        nome: "Forçar",
        descricao:
          "Comece pelo movimento mais pesado para você, quando ainda tem energia.",
      },
      {
        letra: "E",
        nome: "Estimular",
        descricao:
          "A parte principal: 2 a 5 séries por exercício, parando 1 ou 2 repetições antes da falha.",
      },
      {
        letra: "E",
        nome: "Exaustar",
        descricao:
          "O fim do treino: exercício mais leve, séries curtas, descanso de 15 a 40 segundos, até a exaustão.",
      },
    ],
    termometro: {
      etiqueta: "O Termômetro",
      texto:
        "Além das quatro fases, você aprende o Termômetro: uma forma simples de saber o quão quente ou frio seu corpo está e quando começar a próxima série, sem deixar o ritmo cair nem se esgotar cedo demais.",
    },
  },

  semAcademia: {
    titulo: "Sem academia, sem aparelho.",
    texto:
      "Um murinho já serve para fazer flexões. O ebook mostra como adaptar o ambiente e usar o que você tem, e assim o seu treino nunca fica repetitivo.",
  },

  conteudo: {
    etiqueta: "Dentro do ebook",
    titulo: "O que você vai encontrar",
    itens: [
      "Minha trajetória na calistenia",
      "O que é, e no que consiste, treinar calistenia",
      "Por que começar pela calistenia e não pela academia",
      "Como dividir os treinos na semana (puxar e empurrar)",
      "Tempo de treino, pausas e descansos",
      "O método AFEE de fato: Aquecer, Forçar, Estimular, Exaustar",
      "O Termômetro",
      "Alimentação, para quem tem metabolismo acelerado e para quem não tem",
      "Motivação e disciplina",
      "Rotina",
      "Local de treino",
      "Acúmulo de conhecimento: por que colocar em prática vale mais que saber tudo",
    ],
  },

  preco: {
    etiqueta: produto.nome,
    condicao: "Pagamento único · Acesso imediato",
    seguranca: "Pagamento seguro pelo Mercado Pago · Pix e cartão",
  },

  paraQuem: {
    titulo: "Para quem é, e para quem não é",
    eParaVoce: {
      titulo: "É para você se:",
      itens: [
        "Está começando e quer um passo a passo simples para não se perder.",
        "Já treina, mas sente que parou de evoluir.",
        "Quer treinar sem academia e sem aparelho.",
        "Prefere um treino com lógica a copiar a rotina de outra pessoa.",
      ],
    },
    naoEParaVoce: {
      titulo: "Não é para você se:",
      itens: [
        "Espera um ebook que ensine, passo a passo, cada movimento avançado (muscle up, bandeira, handstand). O Método AFEE organiza o seu treino. Ele não ensina cada movimento.",
        "Quer resultado sem esforço. O método é simples, mas o treino é pesado.",
        "Procura plano de dieta fechado. O ebook traz princípios de alimentação, não um cardápio.",
      ],
    },
  },

  garantia: {
    titulo: `${produto.garantiaDias} dias para decidir sem risco`,
    texto: `Leia o ebook, aplique o método. Se em até ${produto.garantiaDias} dias você achar que não é para você, eu devolvo 100% do valor. Sem pergunta, sem burocracia.`,
    selo: {
      titulo: `Garantia de ${produto.garantiaDias} dias`,
      texto: "Reembolso total, sem burocracia.",
    },
  },

  // PENDENTE: "O acesso expira?" e "Posso baixar o ebook em PDF?" entram quando
  // o autor decidir (acesso vitalício ou por prazo; PDF liberado ou não).
  faq: {
    titulo: "Perguntas frequentes",
    itens: [
      {
        pergunta: "Preciso de academia ou de equipamento?",
        resposta:
          "Não. O método é pensado para o peso do corpo. Uma barra fixa ajuda, mas o ebook mostra como adaptar o ambiente e usar o que você tem, como um murinho para fazer flexões.",
      },
      {
        pergunta: "Sou iniciante e nunca fiz uma barra fixa. Serve para mim?",
        resposta:
          "Serve. O ebook foi escrito para quem está começando e inclui como adaptar os exercícios ao seu nível.",
      },
      {
        pergunta: "Já treino há anos. O que eu ganho?",
        resposta:
          "Estrutura. O ebook ensina a organizar sessões, descansos e o fim do treino. Ele não traz progressões passo a passo de movimentos avançados.",
      },
      {
        pergunta: "Em quanto tempo vejo resultado?",
        resposta:
          "Depende de cada pessoa. Na minha experiência e de quem aplicou comigo, vi melhora de resistência em cerca de um mês e do shape em alguns meses. Resultado individual varia com treino, alimentação e descanso, e não há garantia.",
      },
      {
        pergunta: "Como recebo o acesso?",
        resposta:
          "Depois da confirmação do pagamento, você entra na tela de obrigado com um botão de acesso e também recebe um link no e-mail.",
      },
      {
        pergunta: "É seguro comprar?",
        resposta:
          "O pagamento é processado pelo Mercado Pago. Eu não tenho acesso aos dados do seu cartão.",
      },
      {
        pergunta: "Como peço reembolso?",
        resposta: `Dentro dos ${produto.garantiaDias} dias, enviando um e-mail para ${produto.suporteEmail}.`,
      },
      {
        pergunta: "Tenho alguma condição de saúde. Posso treinar?",
        resposta:
          "Converse com um médico antes de iniciar qualquer treino. O ebook é informativo e não substitui orientação profissional.",
      },
    ],
  },

  chamadaFinal: {
    titulo: "Comece pelo mais simples. Com direção.",
    texto:
      "Fazer qualquer coisa é melhor que não fazer nada. Mas fazer com método chega mais longe.",
    microtexto: `Garantia de ${produto.garantiaDias} dias · Acesso imediato`,
  },

  avisoLegal:
    "Os resultados descritos são a experiência do autor e de pessoas que aplicaram o método. Resultados variam de pessoa para pessoa e não são garantidos. Este material é informativo e não substitui avaliação médica, nem orientação de educador físico ou nutricionista. Consulte um profissional de saúde antes de iniciar qualquer atividade física ou mudar a alimentação.",
} as const;
