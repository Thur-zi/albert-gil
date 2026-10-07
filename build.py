"""Monta o site a partir de src/.

Gera:
  index.html          documento completo, pronto para hospedar (GitHub Pages, Cloudflare, Netlify)
  dist/artifact.html  o mesmo conteúdo sem <html>/<head>, para publicar como Artifact
Os scripts de src/ são embutidos; as imagens continuam em img/ (caminhos relativos).
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src"
SITE = "https://thur-zi.github.io/albert-gil"


def inline(match: re.Match) -> str:
    code = (SRC / match.group(1)).read_text(encoding="utf-8")
    return "<script>\n" + code + "\n</script>"


page = re.sub(r"<!--INLINE:([\w.]+)-->", inline, (SRC / "page.html").read_text(encoding="utf-8"))

(ROOT / "dist").mkdir(exist_ok=True)
(ROOT / "dist" / "artifact.html").write_text(page, encoding="utf-8")

head_end = page.index("</style>") + len("</style>")
doc = (
    '<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
    '<meta name="theme-color" content="#00a79d">\n'
    '<meta property="og:type" content="website">\n'
    '<meta property="og:locale" content="pt_BR">\n'
    '<meta property="og:site_name" content="Albert Gil Consulting">\n'
    f'<meta property="og:url" content="{SITE}/">\n'
    '<meta property="og:title" content="Albert Gil · Melhoria contínua, um degrau por vez">\n'
    '<meta property="og:description" content="Lean Manufacturing e WCM com resultado medido em reais: R$ 54 mi em ganhos anuais, retorno mediano de 68 vezes e 511 empresas em 18 programas. Veja os casos, o antes e depois e simule o custo do desperdício na sua operação.">\n'
    f'<meta property="og:image" content="{SITE}/img/og.jpg">\n'
    '<meta property="og:image:width" content="1200">\n'
    '<meta property="og:image:height" content="630">\n'
    '<meta property="og:image:alt" content="Albert Gil, consultor Lean e WCM, ao lado da frase Melhoria contínua, um degrau por vez, e dos números R$ 54 mi, 68x e 511 empresas">\n'
    '<meta name="twitter:card" content="summary_large_image">\n'
    '<meta name="twitter:title" content="Albert Gil · Melhoria contínua, um degrau por vez">\n'
    '<meta name="twitter:description" content="R$ 54 mi em ganhos medidos, retorno mediano de 68 vezes, 511 empresas. Casos reais e simulador do custo do desperdício.">\n'
    f'<meta name="twitter:image" content="{SITE}/img/og.jpg">\n'
    f'<link rel="canonical" href="{SITE}/">\n'
    '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22-20 -40 340 330%22%3E%3Crect x=%22-20%22 y=%22-40%22 width=%22340%22 height=%22330%22 fill=%22%2300a79d%22/%3E%3Cpath fill=%22%23f5b800%22 d=%22M0 250V125l100 50v75zM100 250V63l100 50v137zM200 250V0l100 50v200z%22/%3E%3C/svg%3E">\n'
    + page[:head_end]
    + "\n</head>\n<body>\n"
    + page[head_end:]
    + "\n</body>\n</html>\n"
)
(ROOT / "index.html").write_text(doc, encoding="utf-8")
print("ok", len(doc) // 1024, "KB")
