# Portfólio Albert Gil

Landing page de portfólio da Albert Gil Consulting (Lean, WCM e excelência operacional).

- `index.html` é o site pronto. Basta hospedar a pasta inteira (`index.html` + `img/`) no GitHub Pages, Cloudflare Pages ou Netlify.
- `src/` guarda as fontes. Edite lá e rode `python build.py` para gerar `index.html` e `dist/artifact.html`.
  - `src/data.js`: programas, empresas, ganhos, pares de antes e depois, ferramentas, trajetória e depoimentos.
  - `src/data2.js`: serviços, casos em profundidade, perguntas frequentes e o diagnóstico "Por onde começar".
  - `src/page.html`: estrutura e estilos (paleta e tipografia do manual de marca v2.0).
  - `src/app.js`: renderização, gaveta de casos, mapa e animações (GSAP 3.13, ScrollTrigger, SplitText e Lenis via CDN).
- `img/ba/`: fotos de antes e depois extraídas das apresentações, ampliadas 4x com Real-ESRGAN (general x4v3, rodando local),
  misturadas 15% com Lanczos, recortadas em 4:3 (1440×1080) com o mesmo tratamento no antes e no depois. `img/ba/t/` tem as miniaturas.

## Curadoria dos dados

- Os valores em R$ são ganhos líquidos anuais declarados pelas empresas ao fim de cada programa.
- Ficam fora das somas: valores projetados (Rancho de Minas, Erominas), valores a validar (Santa Clara) e
  programas cujo relatório não traz o ganho de todas as empresas (Lean Automotivo, Nova Friburgo, João Monlevade).
- Foram descartados: Satis (R$ 42 mi) e Destilaria Veredas (R$ 162 mi), fora de escala na planilha do IEL.
- "Apresentação - Lean 2015" é duplicata de "Apresentação - Lean"; o deck BH/CL repete a turma dos slides 78 a 100 dele.
- Anos de Ubá, Petrópolis, Volta Redonda e IEL vêm da data de modificação das planilhas.

## A validar com o Albert

- Formatos de serviço em `data2.js` (principalmente "Apoio à direção industrial"), textos das perguntas frequentes e o tom das mensagens.
- Canais de contato: hoje só há LinkedIn. WhatsApp, e-mail ou telefone aumentam muito a conversão.
