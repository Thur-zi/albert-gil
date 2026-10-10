# Portfólio Albert Gil

Landing page de portfólio da Albert Gil Consulting (Lean, WCM e excelência operacional).

- `index.html` é o site pronto. Basta hospedar a pasta inteira (`index.html` + `img/`) no GitHub Pages, Cloudflare Pages ou Netlify.
- `src/` guarda as fontes. Edite lá e rode `python build.py` para gerar `index.html` e `dist/artifact.html`.
  - `src/data.js`: programas, empresas, ganhos, pares de antes e depois, trajetória e depoimentos.
  - `src/data2.js`: serviços, casos em profundidade, perguntas frequentes e o diagnóstico "Por onde começar".
  - `src/page.html`: estrutura e estilos (paleta e tipografia do manual de marca v2.0).
  - `src/app.js`: renderização, gaveta de casos, mapa, simulador e animações (GSAP 3.13, ScrollTrigger, SplitText e Lenis via CDN).
- `img/ba/`: fotos de antes e depois. As originais de câmera foram recortadas em 4:3 (1440×1080); as que só existiam dentro
  das apresentações foram ampliadas com Real-ESRGAN, rodando local. Antes e depois sempre têm o mesmo tratamento.
- `og/og.html`: fonte da imagem de compartilhamento (`img/og.jpg`), renderizada com Chrome headless.

## Regras dos números

- Valores em R$ são ganhos líquidos anuais declarados pelas empresas, conferidos nas análises de benefício/custo.
- Valores projetados e valores sem confirmação documental ficam fora das somas; os sem confirmação não são exibidos.
- Programas sem o ganho de todas as empresas aparecem sem total.
