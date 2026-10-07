import { precoFormatado, produto } from "@/config/produto";

/**
 * Textos da página de vendas, vindos de docs/01-oferta.md.
 * Edite aqui para mudar uma frase, sem mexer no desenho da página.
 * Regra de copy: nenhuma promessa de resultado garantido; resultado é sempre
 * apresentado como a experiência do autor.
 */

/** Texto do botão de compra (o preço vem do arquivo central). */
export const rotuloBotaoCompra = `Quero o ${produto.nome} · ${precoFormatado}`;

/** Selo de promoção. Os preços vêm de src/config/produto.ts. */
export const promocao = {
  chamada: "Promoção histórica de fim de ano",
};

export const vendas = {
  hero: {
    etiqueta: "Calistenia · Método AFEE",
    titulo: "Pare de treinar sem saber se está funcionando.",
    subtitulo:
      "Treino de calistenia com começo, meio e fim. Sem academia, sem aparelho.",
    autor: `Por ${produto.autor.exibicao} · Ebook com acesso imediato`,
    microtexto: `Pagamento único · Garantia de ${produto.garantiaDias} dias · Acesso imediato`,
  },

  identificacao: {
    titulo: "Você treina. Mas sente que está girando em círculos?",
    paragrafos: [
      "Todo mundo ensina a fazer o movimento. Ninguém ensina a montar o treino.",
    ],
    dores: [
      "Você não sabe se o seu treino está funcionando de verdade.",
      "Você não sabe como dividir a semana nem quanto descansar.",
      "Você acha que calistenia é complicada demais ou “não é para mim”.",
    ],
    fecho:
      "O problema não é você. Falta direção.",
  },

  historia: {
    etiqueta: "Minha história",
    titulo: "Sempre fui magro “de ruim”. Recomecei do zero.",
    paragrafos: [
      "Treinei anos sem método. Um acidente de moto me tirou 10 kg e 6 meses de treino.",
      "Recomecei do zero, dessa vez com lógica. Em 6 meses, nasceu o AFEE.",
    ],
    legendaEvolucao: "Minha evolução",
  },

  metodo: {
    etiqueta: "O método",
    titulo: "Quatro fases. Uma lógica.",
    abertura:
      "Uma sigla. Nunca mais treinar perdido.",
    fases: [
      {
        letra: "A",
        nome: "Aquecer",
        descricao:
          "Prepara o corpo do jeito certo.",
      },
      {
        letra: "F",
        nome: "Forçar",
        descricao:
          "Onde a força é construída.",
      },
      {
        letra: "E",
        nome: "Estimular",
        descricao:
          "O coração do treino.",
      },
      {
        letra: "E",
        nome: "Exaustar",
        descricao:
          "O fim que faz a diferença.",
      },
    ],
    termometro: {
      etiqueta: "O Termômetro",
      texto:
        "O detalhe que acerta o ritmo de cada série. Só no ebook.",
    },
  },

  semAcademia: {
    titulo: "Sem academia, sem aparelho.",
    texto:
      "Um murinho já basta. Você treina com o que tem, onde estiver.",
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
        "Está começando e quer um caminho claro.",
        "Já treina, mas sente que parou de evoluir.",
        "Quer treinar sem academia e sem aparelho.",
        "Prefere lógica a copiar treino dos outros.",
      ],
    },
    naoEParaVoce: {
      titulo: "Não é para você se:",
      itens: [
        "Quer tutorial de movimento avançado. O AFEE organiza o treino.",
        "Quer resultado sem esforço.",
        "Procura cardápio pronto.",
      ],
    },
  },

  garantia: {
    titulo: `${produto.garantiaDias} dias para decidir sem risco`,
    texto: `Não gostou? Devolvo 100% em até ${produto.garantiaDias} dias.`,
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
          "Não. Só o peso do corpo. Uma barra ajuda, mas não é obrigatória.",
      },
      {
        pergunta: "Sou iniciante e nunca fiz uma barra fixa. Serve para mim?",
        resposta:
          "Serve. Foi escrito para quem está começando.",
      },
      {
        pergunta: "Já treino há anos. O que eu ganho?",
        resposta:
          "Estrutura. Treino organizado do começo ao fim.",
      },
      {
        pergunta: "Em quanto tempo vejo resultado?",
        resposta:
          "Varia de pessoa para pessoa. Na minha experiência, a resistência melhora em cerca de um mês. Não há garantia de resultado.",
      },
      {
        pergunta: "Como recebo o acesso?",
        resposta:
          "Na hora, após o pagamento. O link também chega no seu e-mail.",
      },
      {
        pergunta: "É seguro comprar?",
        resposta:
          "Sim. Pagamento pelo Mercado Pago.",
      },
      {
        pergunta: "Como peço reembolso?",
        resposta: `Dentro dos ${produto.garantiaDias} dias, enviando um e-mail para ${produto.suporteEmail}.`,
      },
      {
        pergunta: "Tenho alguma condição de saúde. Posso treinar?",
        resposta:
          "Consulte um médico antes de começar. O ebook não substitui orientação profissional.",
      },
    ],
  },

  chamadaFinal: {
    titulo: "Comece pelo mais simples. Com direção.",
    texto:
      "Com método, você chega mais longe.",
    microtexto: `Garantia de ${produto.garantiaDias} dias · Acesso imediato`,
  },

  avisoLegal:
    "Os resultados descritos são a experiência do autor e de pessoas que aplicaram o método. Resultados variam de pessoa para pessoa e não são garantidos. Este material é informativo e não substitui avaliação médica, nem orientação de educador físico ou nutricionista. Consulte um profissional de saúde antes de iniciar qualquer atividade física ou mudar a alimentação.",
} as const;
