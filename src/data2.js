/* Conteúdo voltado a quem vai contratar: formatos de trabalho, casos em profundidade, perguntas
 * frequentes e o diagnóstico rápido. Números dos casos vêm das apresentações de resultados
 * (tabelas de custo de deslocamento, séries mensais e quadros de antes e depois). */

window.AG_SERVICES = [
  {
    id: "diagnostico", tag: "Primeiro passo",
    nome: "Diagnóstico de perdas",
    para: "Para quem sabe que tem dinheiro parado na operação, mas não sabe onde.",
    entrega: ["Visita ao chão de fábrica e mapa do fluxo de valor", "Cronoanálise e separação do que agrega valor", "Lista de oportunidades priorizada por ganho estimado"],
    prova: "Numa única turma em Patos de Minas, o diagnóstico levantou 229 oportunidades.",
  },
  {
    id: "implantacao", tag: "Consultoria direta",
    nome: "Implantação Lean na sua empresa",
    para: "Para a diretoria que quer resultado medido em reais, com a própria equipe conduzindo os projetos.",
    entrega: ["Projetos Kaizen nas maiores perdas, de 4 a 5 meses", "Acompanhamento de indicadores com a direção", "Benefício/custo e payback calculados por projeto"],
    prova: "Na Multibag (2024), a produção média diária subiu 18% sobre 2023.",
  },
  {
    id: "programas", tag: "Instituições",
    nome: "Programas para grupos de empresas",
    para: "Para SEBRAE, federações, sindicatos e prefeituras que querem levar o Lean a uma região ou cadeia.",
    entrega: ["Turmas de 2 a 311 empresas, cerca de 82 h por ciclo", "Capacitação em sala e projeto no posto de trabalho", "Relatório consolidado com o ganho de cada empresa"],
    prova: "18 programas em 6 estados, com R$ 54 mi em ganhos anuais medidos.",
  },
  {
    id: "lideres", tag: "Pessoas",
    nome: "Formação de líderes e WCM",
    para: "Para quem precisa de líderes que sustentem rotina, padrão e indicador sem depender de consultor.",
    entrega: ["Pilares do WCM, 5S com auditoria e gestão à vista", "Formação de multiplicadores dentro da empresa", "Coaching de líderes de produção"],
    prova: "Quinze anos implantando os 20 pilares do WCM na Stola do Brasil.",
  },
  {
    id: "direcao", tag: "Operações",
    nome: "Apoio à direção industrial",
    para: "Para empresas que precisam reorganizar produção, qualidade, logística e manutenção ao mesmo tempo.",
    entrega: ["Leitura integrada de produção, custos e pessoas", "Plano de ação com metas por área", "Rotina de gestão com a liderança"],
    prova: "Experiência como diretor industrial e operacional em metalúrgicas de SP.",
  },
  {
    id: "leanos", tag: "Sustentação",
    nome: "LeanOS para manter o ganho",
    para: "Para quem já melhorou e não quer ver o resultado regredir depois que o projeto acaba.",
    entrega: ["Rotinas com checklist e evidência", "Alertas de regressão com dono e prazo", "Índice de Sustentação de 0 a 100"],
    prova: "Software criado a partir do que se repetiu em centenas de programas.",
  },
];

window.AG_CASES = [
  {
    id: "metaltecnica", emp: "Metaltécnica", setor: "Caldeiraria e usinagem", lugar: "João Monlevade (MG)", ano: "2015", prog: "monlevade-2015",
    titulo: "Soldadores andavam 40 metros para buscar gás e consumível.",
    problema: "A área de solda ficava a 40 m do almoxarifado e a sucata saía por caçambas distantes. O galpão crescera sem estudo de fluxo, e o tempo de deslocamento virou custo fixo.",
    causa: "Áreas de apoio longe do ponto de uso e um layout sem sequência de processo.",
    acao: ["Solda realocada a 5 m do almoxarifado", "Caçambas de sucata dentro dos galpões e janela de descarte na máquina de corte", "Caldeiraria em sequência: preparação, montagem leve, pesada, solda e acabamento", "Duas pontes rolantes e almoxarifado junto à usinagem"],
    kpis: [["R$ 975 mil", "ganho líquido anual"], ["16,8×", "benefício/custo"], ["460 m²", "de área liberada"], ["28 t", "de sucata vendidas"]],
    chart: { tipo: "pares", titulo: "Custo anual de deslocamento por frente de trabalho", unidade: "R$", itens: [["Almoxarifado da usinagem", 109560, 43560], ["Caçambas de sucata", 40320, 16128], ["Soldagem", 22176, 8870], ["Descarte na máquina de corte", 15120, 3024], ["Sucata na usinagem", 4158, 1663]] },
    fotos: ["metaltecnica-producao", "metaltecnica-almox"],
  },
  {
    id: "rcs", emp: "RCS Usinagem", setor: "Ferramentaria e usinagem", lugar: "Itajubá (MG)", ano: "2018–2019", prog: "itajuba-2019",
    titulo: "Cada troca no torno CNC parava a máquina por três horas e meia.",
    problema: "Programar o torno levava 1,5 h e preparar a máquina, mais 2 h. No try-out, 14 peças iam para o refugo, uma perda de 28%. A máquina passava 80% do tempo parada.",
    causa: "Programação e preparação feitas com a máquina parada.",
    acao: ["SMED: tudo que pode ser feito com a máquina rodando saiu do tempo de parada", "Software próprio de programação, no conceito Indústria 4.0", "Ferramentas organizadas por posição, ao lado da máquina"],
    kpis: [["45 min", "de programação + set-up (eram 210)"], ["0", "peças de refugo no try-out"], ["+60%", "de OEE"], ["104×", "benefício/custo"]],
    chart: { tipo: "pares", titulo: "Tempo de preparação do torno CNC", unidade: "min", itens: [["Programação", 90, 15], ["Set-up", 120, 30]] },
    fotos: ["rcs-ferramentas", "rcs-bancada"],
  },
  {
    id: "ryjor", emp: "Ryjor Underwear", setor: "Confecção de moda íntima", lugar: "Nova Friburgo (RJ)", ano: "2015", prog: "friburgo-2015",
    titulo: "O corte precisava dobrar a produção sem contratar.",
    problema: "O setor de corte limitava a fábrica: 5.577 peças em março. Rebarbas geravam 21 mil peças de retrabalho por ano, ou 437 horas de duas costureiras.",
    causa: "Retrabalho de rebarba e defeito de bainha tratados no fim da linha, em vez de evitados no corte.",
    acao: ["PDCA no setor de corte com meta mensal", "OEE e 5S aplicados ao corte", "Eliminação do defeito de bainha na origem"],
    kpis: [["3,4×", "peças cortadas por mês"], ["−95%", "de retrabalho"], ["R$ 83 mil", "economizados por ano"]],
    chart: { tipo: "serie", titulo: "Peças cortadas por mês em 2015", unidade: "peças", itens: [["mar", 5577], ["abr", 8564], ["mai", 13600], ["jun", 15222], ["jul", 17135], ["ago", 19186]] },
    fotos: [],
  },
  {
    id: "carrera", emp: "Carrera", setor: "Oficina mecânica", lugar: "Belo Horizonte (MG)", ano: "2015", prog: "oficinas-2015",
    titulo: "Mecânicos perdiam o dia procurando ferramenta e peça.",
    problema: "O deslocamento interno da oficina consumia horas da equipe e segurava os carros no box. Eram 3.960 horas ociosas e improdutivas por ano.",
    causa: "Deslocamento para buscar ferramentas e peças, a perda mais comum entre as 11 oficinas da turma.",
    acao: ["Organização do posto de trabalho, eixo do programa nas 11 oficinas", "Cronoanálise e corte do deslocamento interno", "Um veículo a mais liberado por dia"],
    kpis: [["R$ 1,12 mi", "ganho líquido anual"], ["180×", "benefício/custo"], ["−96%", "de deslocamento interno"], ["+264", "veículos entregues por ano"]],
    chart: { tipo: "pares", titulo: "Deslocamento interno da oficina (antes = 100)", unidade: "", itens: [["Índice de deslocamento", 100, 4, "100", "4"]] },
    fotos: [],
  },
  {
    id: "pittelli", emp: "Pittelli Engenharia", setor: "Construção civil", lugar: "Uberlândia (MG)", ano: "2017–2018", prog: "lean-construction-2018",
    titulo: "Cada saco de cimento custava 39 passos ao servente.",
    problema: "O depósito de cimento ficava longe da betoneira. Eram 205.920 passos por ano só para abastecer a mistura, e o canteiro desorganizado travava a estrutura.",
    causa: "Material de uso contínuo guardado longe do ponto de uso.",
    acao: ["Container de cimento ao lado da betoneira", "Limpeza e organização do canteiro (5S)", "Estudo de passos e rotina de abastecimento"],
    kpis: [["39 → 1", "passo por viagem"], ["−97%", "de deslocamento"], ["+63%", "de produtividade na estrutura"]],
    chart: { tipo: "pares", titulo: "Passos por ano para abastecer a betoneira", unidade: "passos", itens: [["Abastecimento de cimento", 205920, 5280]] },
    fotos: [],
  },
  {
    id: "metaldavi", emp: "Metaldavi", setor: "Metalmecânica", lugar: "Caxias do Sul (RS)", ano: "2012", prog: "focem-abdi",
    titulo: "Um pedido de 600 dobradiças levava dez dias.",
    problema: "A produção era empurrada em lotes grandes, com estoque entre etapas e fábrica desorganizada.",
    causa: "Produção empurrada em lotes grandes.",
    acao: ["5S intermediário e avançado", "Automação de baixo custo nas operações críticas", "Produção puxada pelo pedido"],
    kpis: [["3,9 h", "para o mesmo lote (eram 10 dias)"], ["−95,8%", "de lead time"]],
    chart: { tipo: "pares", titulo: "Tempo para produzir 600 dobradiças", unidade: "h", itens: [["Lote de 600 dobradiças", 240, 3.9, "10 dias", "3,9 h"]] },
    fotos: ["metaldavi-linha"],
  },
];

window.AG_FAQ = [
  ["Preciso parar a produção para implantar?", "Não. Os projetos acontecem na rotina, com a equipe da empresa. A parte em sala soma cerca de 28 horas no ciclo; o resto é feito no posto de trabalho."],
  ["Em quanto tempo aparece resultado?", "Os programas consolidam o resultado em 4 a 5 meses. Em Patos de Minas, 10 de 11 empresas recuperaram o investimento em menos de um mês."],
  ["Funciona para empresa pequena?", "Sim. A maior parte das 511 empresas desta página são pequenas e médias: oficinas, confecções, padarias, construtoras e metalúrgicas."],
  ["Funciona fora da indústria?", "Sim. Há resultados em reparação automotiva, construção civil, alimentos, comércio, serviços e gestão pública."],
  ["Como o resultado é medido?", "Cada projeto fecha com o ganho anual calculado pela empresa, o custo do projeto, o benefício/custo e o payback. Tudo vai para um relatório final."],
  ["E se a equipe voltar ao jeito antigo?", "O método termina em padrão e indicador. Para quem quer acompanhamento diário, o LeanOS mede a rotina e avisa quando o resultado começa a regredir."],
  ["Vocês atendem fora de Minas Gerais?", "Sim. Já houve turmas em Minas, Rio de Janeiro, São Paulo, Espírito Santo, Rio Grande do Sul e Pernambuco."],
  ["Quanto custa?", "Depende do formato e do tamanho da operação. Programas em grupo podem ter parte do custo coberta pela instituição parceira. O que se mede sempre é o retorno: o benefício/custo mediano das empresas desta página é de 68 vezes."],
];

window.AG_QUIZ = [
  { id: "setor", q: "Qual é a sua operação?", opts: [["ind", "Indústria"], ["ofi", "Oficina ou serviço automotivo"], ["con", "Construção civil"], ["ali", "Alimentos"], ["ser", "Comércio ou serviços"], ["inst", "Instituição que atende várias empresas"]] },
  { id: "dor", q: "O que mais incomoda hoje?", opts: [["prod", "Produtividade baixa e prazo atrasado"], ["custo", "Custo alto e desperdício"], ["org", "Desorganização, procura e falta de espaço"], ["pessoas", "Equipe sem método e liderança fraca"], ["regride", "Melhorias que não se sustentam"]] },
  { id: "porte", q: "Quantas pessoas trabalham na operação?", opts: [["p", "Até 20"], ["m", "De 20 a 100"], ["g", "Mais de 100"]] },
];
