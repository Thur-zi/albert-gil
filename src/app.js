(() => {
  "use strict";
  const P = window.AG_PROGRAMS, PAIRS = window.AG_PAIRS, SECT = window.AG_SECTORS;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const HAS_GSAP = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MOTION = HAS_GSAP && !REDUCED;
  const HOVER = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------------- Formatação ---------------- */
  const nf1 = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const nf0 = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
  const nfBC = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });
  const brl = (v) => {
    if (v >= 1e6) return "R$ " + nf1.format(v / 1e6) + " mi";
    if (v >= 1e3) return "R$ " + nf0.format(v / 1e3) + " mil";
    return "R$ " + nf0.format(v);
  };
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------------- Agregados ---------------- */
  const UF = {
    "Belo Horizonte": "MG", Betim: "MG", "Conselheiro Lafaiete": "MG", "João Monlevade": "MG", "Sete Lagoas": "MG", Ubá: "MG",
    Itajubá: "MG", "Patos de Minas": "MG", Uberlândia: "MG", Uberaba: "MG", Araxá: "MG", "Volta Redonda": "RJ", Petrópolis: "RJ",
    "Nova Friburgo": "RJ", "Duque de Caxias": "RJ", "Rio de Janeiro": "RJ", "Santo André": "SP", "Caxias do Sul": "RS",
    "São Leopoldo": "RS", Cariacica: "ES", Recife: "PE",
  };
  const counts = (e) => e.g && !e.p && !e.x;
  const progTotal = (p) => (p.semTotal ? 0 : p.gTotal ?? p.empresas.reduce((s, e) => s + (counts(e) ? e.g : 0), 0));
  P.forEach((p) => (p.total = progTotal(p)));
  const withTotal = P.filter((p) => p.total > 0).sort((a, b) => b.total - a.total);
  const GRAND = withTotal.reduce((s, p) => s + p.total, 0);
  const COMPANIES = P.reduce((s, p) => s + p.e, 0);
  const allCities = new Set([...P.flatMap((p) => p.cidades), ...window.AG_OTHERS.map((o) => o.cidade)]);
  const STATES = new Set([...allCities].map((c) => UF[c]).filter(Boolean));
  const bcs = P.flatMap((p) => p.empresas.filter((e) => e.bc).map((e) => e.bc)).sort((a, b) => a - b);
  const BC_MED = bcs.length ? (bcs.length % 2 ? bcs[(bcs.length - 1) / 2] : (bcs[bcs.length / 2 - 1] + bcs[bcs.length / 2]) / 2) : 0;
  let TOP = { g: 0 };
  P.forEach((p) => p.empresas.forEach((e) => { if (counts(e) && e.g > TOP.g) TOP = { ...e, prog: p }; }));

  /* ---------------- Render: hero e resultados ---------------- */
  $("#stripGain").textContent = "R$ " + nf0.format(Math.round(GRAND / 1e6)) + " mi";
  $("#stripStates").textContent = STATES.size;
  $("#stripStates").nextElementSibling.textContent = `estados, ${P.length} programas`;

  const bigGain = $("#bigGain");
  const setBig = (v) => (bigGain.innerHTML = "<small>R$</small>" + nf1.format(v / 1e6) + " mi");
  setBig(GRAND);
  $("#bigNote").textContent = `Soma de ${withTotal.length} programas com resultado financeiro consolidado, entre ${Math.min(...withTotal.map((p) => p.ano))} e ${Math.max(...withTotal.map((p) => p.ano))}. Valores projetados ficam fora da conta.`;

  const maxT = withTotal[0].total;
  $("#bars").innerHTML = withTotal.map((p) => `
    <li data-prog="${p.id}" tabindex="0" role="button" aria-label="Abrir ${esc(p.nome)}">
      <span class="bars__name">${esc(p.nome)}<small>${esc(p.anoLabel)} · ${esc(p.local)}</small></span>
      <span class="bars__val">${brl(p.total)}</span>
      <span class="bars__track"><span class="bars__fill" style="--w:${((p.total / maxT) * 100).toFixed(2)}%"></span></span>
    </li>`).join("");

  const KPIS = [
    ["Escala", COMPANIES, 0, "", "", `empresas nos ${P.length} programas desta página`],
    ["Benefício/custo", BC_MED, 0, "", "<i>×</i>", `retorno mediano em ${bcs.length} empresas com o dado, de ${nfBC.format(bcs[0])}× a ${nf0.format(bcs[bcs.length - 1])}×`],
    ["Desperdício", 60, 0, "−", "<i>%</i>", "de atividades sem valor agregado, em média, na turma de BH e Lafaiete"],
    ["Recorde", TOP.g / 1e6, 1, '<small style="font-size:.45em;margin-right:.15em">R$</small>', "<i> mi</i>", `de ganho anual numa única empresa: ${esc(TOP.n)}, ${esc(TOP.prog.local.split(" (")[0])}`],
  ];
  const fmtK = (v, d) => (d ? nf1.format(v) : nf0.format(Math.round(v)));
  $("#kpis").innerHTML = KPIS.map(([l, v, d, pre, suf, t]) =>
    `<div class="kpi"><span class="label">${l}</span><b class="num">${pre}<span class="kv" data-v="${v}" data-d="${d}">${fmtK(v, d)}</span>${suf}</b><span>${t}</span></div>`).join("");

  /* ---------------- Faixa de clientes ---------------- */
  const names = ["BorgWarner", "Metaltécnica", "Denso", "Rancho de Minas", "Stola do Brasil", "Julev Bolsas", "Metaldavi", "Pássaro Livre", "Tirolez", "MM Plastic", "Inpel", "Hystermaq", "Resen Munck", "Cincol", "GIMA Máquinas", "Ryjor", "Visual Propaganda", "Oficina do Baiano"];
  const symSvg = '<svg class="sym" viewBox="0 0 300 250" aria-hidden="true"><use href="#sym" class="r"/></svg>';
  const mq = names.map((n) => `<span class="marquee__item">${esc(n)}${symSvg}</span>`).join("");
  $("#marquee").innerHTML = mq + mq.replace(/class="marquee__item"/g, 'class="marquee__item" aria-hidden="true"');

  /* ---------------- Índice de programas ---------------- */
  let filter = "all", sortBy = "ano";
  const sectorCount = (k) => P.filter((p) => p.setores.includes(k)).length;
  $("#filters").innerHTML =
    `<button class="chip" aria-pressed="true" data-f="all">Todos<span class="c">${P.length}</span></button>` +
    Object.entries(SECT).filter(([k]) => sectorCount(k)).map(([k, v]) => `<button class="chip" aria-pressed="false" data-f="${k}">${v}<span class="c">${sectorCount(k)}</span></button>`).join("") +
    `<div class="filters__sort"><span class="label">Ordenar</span><button class="chip" aria-pressed="true" data-s="ano">Ano</button><button class="chip" aria-pressed="false" data-s="ganho">Ganho</button></div>`;

  const arrowSvg = '<span class="row__a"><svg><use href="#arrow"/></svg></span>';
  function renderIndex() {
    const list = P.filter((p) => filter === "all" || p.setores.includes(filter))
      .sort((a, b) => (sortBy === "ano" ? a.ano - b.ano || b.total - a.total : b.total - a.total));
    $("#index").innerHTML = list.length ? list.map((p) => `
      <li><button class="row" data-prog="${p.id}">
        <span class="row__y">${esc(p.anoLabel)}</span>
        <span class="row__t">${esc(p.nome)}<small>${esc(p.parceiro)}</small></span>
        <span class="row__l">${esc(p.local)}</span>
        <span class="row__e">${p.e}<small>empresas</small></span>
        <span class="row__g">${p.total ? brl(p.total) : "—"}<small>${p.total ? "ganho anual" : "sem total"}</small></span>
        ${arrowSvg}
      </button></li>`).join("") : '<li class="index__empty">Nenhum programa neste filtro.</li>';
    if (MOTION) gsap.from("#index .row", { opacity: 0, x: -14, duration: 0.5, stagger: 0.03, ease: "power3.out", clearProps: "all" });
  }
  renderIndex();
  $("#filters").addEventListener("click", (ev) => {
    const b = ev.target.closest("button");
    if (!b) return;
    if (b.dataset.f) { filter = b.dataset.f; $$("#filters [data-f]").forEach((x) => x.setAttribute("aria-pressed", x === b)); }
    if (b.dataset.s) { sortBy = b.dataset.s; $$("#filters [data-s]").forEach((x) => x.setAttribute("aria-pressed", x === b)); }
    renderIndex();
    if (MOTION) ScrollTrigger.refresh();
  });
  $("#others").innerHTML = window.AG_OTHERS.map((o) => `<div><b>${esc(o.nome)}</b>${esc(o.nota)}</div>`).join("");

  /* Pré-visualização que segue o cursor. Ao rolar, confere o que está sob o cursor:
     o navegador não avisa quando a lista sai de baixo de um ponteiro parado. */
  const peek = $("#peek");
  if (HOVER) {
    let qx, qy, peekRow = null, px = -1, py = -1, visible = false;
    if (MOTION) {
      qx = gsap.quickTo(peek, "x", { duration: 0.55, ease: "power3" });
      qy = gsap.quickTo(peek, "y", { duration: 0.55, ease: "power3" });
      gsap.set(peek, { yPercent: -50, scale: 0.92 });
    }
    const hide = () => {
      if (!visible) return;
      visible = false; peekRow = null;
      if (MOTION) gsap.to(peek, { opacity: 0, scale: 0.92, duration: 0.2, overwrite: "auto" }); else peek.style.opacity = 0;
    };
    const at = (x, y) => {
      const el = document.elementFromPoint(x, y);
      const row = el && el.closest ? el.closest("#index .row") : null;
      if (!row || !caseEl.hidden) return hide();
      if (row !== peekRow) {
        peekRow = row;
        const p = P.find((q) => q.id === row.dataset.prog);
        const img = p.fotos[0] ? `<img src="img/ba/${p.fotos[0]}-depois.webp" alt="">` : "";
        peek.innerHTML = `${img}<div class="peek__k"><b>${esc(p.kpis[0][0])}</b><span>${esc(p.kpis[0][1])}</span></div>`;
      }
      const tx = x + 28, ty = y;
      if (qx) { qx(tx); qy(ty); } else peek.style.transform = `translate(${tx}px, ${ty - 80}px)`;
      if (!visible) { visible = true; if (MOTION) gsap.to(peek, { opacity: 1, scale: 1, duration: 0.25, overwrite: "auto" }); else peek.style.opacity = 1; }
    };
    window.addEventListener("pointermove", (e) => { px = e.clientX; py = e.clientY; if (visible || e.target.closest?.("#index")) at(px, py); }, { passive: true });
    let raf = 0;
    window.addEventListener("scroll", () => {
      if (!visible || raf) return;
      raf = requestAnimationFrame(() => { raf = 0; at(px, py); });
    }, { passive: true });
    document.addEventListener("pointerleave", hide);
  }

  /* ---------------- Comparador antes/depois ---------------- */
  function cmpHTML(key, alt) {
    return `<div class="cmp-frame"><span class="crop crop--tl"></span><span class="crop crop--tr"></span><span class="crop crop--bl"></span><span class="crop crop--br"></span>
      <div class="cmp" data-cmp>
        <img src="img/ba/${key}-antes.webp" alt="Antes: ${esc(alt)}" loading="lazy" width="640" height="480">
        <img class="cmp__after" src="img/ba/${key}-depois.webp" alt="Depois: ${esc(alt)}" loading="lazy" width="640" height="480">
        <span class="cmp__tag cmp__tag--a">Antes</span><span class="cmp__tag cmp__tag--d">Depois</span>
        <span class="cmp__line"></span>
        <input type="range" min="0" max="100" value="50" aria-label="Comparar antes e depois: ${esc(alt)}" id="cmp-${key}-${Math.random().toString(36).slice(2, 7)}">
        <span class="cmp__knob"><svg><use href="#drag"/></svg></span>
      </div></div>`;
  }
  function initCmp(root) {
    $$("[data-cmp]", root).forEach((el) => {
      if (el._init) return;
      el._init = true;
      const input = $("input", el);
      const set = (v) => { v = Math.max(0, Math.min(100, v)); el.style.setProperty("--pos", v + "%"); input.value = v; };
      el._set = set;
      input.addEventListener("input", () => set(+input.value));
      input.style.pointerEvents = "none";
      let down = false;
      const fromEvent = (e) => { const r = el.getBoundingClientRect(); set(((e.clientX - r.left) / r.width) * 100); };
      el.addEventListener("pointerdown", (e) => { down = true; el.setPointerCapture(e.pointerId); fromEvent(e); input.focus({ preventScroll: true }); });
      el.addEventListener("pointermove", (e) => { if (down) fromEvent(e); });
      const up = () => (down = false);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
    });
  }

  /* Antes e depois: palco com lista. Troca com cortina amarela e varredura do comparador. */
  const G = window.AG_GALLERY, pad = (n) => String(n).padStart(2, "0");
  const stageFrame = $("#stageFrame"), stageCap = $("#stageCap"), stageList = $("#stageList");
  stageList.innerHTML = G.map((k, i) => {
    const d = PAIRS[k];
    return `<li><button class="stage__item" data-i="${i}" aria-current="${i === 0}"><img src="img/ba/t/${k}-depois.webp" alt="" loading="lazy" width="64" height="48"><span style="margin:0"><b>${esc(d.emp)}</b><span>${esc(d.titulo)} · ${esc(d.kpi)}</span></span><i></i></button></li>`;
  }).join("");
  stageFrame.innerHTML = cmpHTML(G[0], `${PAIRS[G[0]].titulo}, ${PAIRS[G[0]].emp}`) + '<div class="stage__wipe"></div>';
  initCmp(stageFrame);
  const stageCmp = $("[data-cmp]", stageFrame);
  $$("img", stageCmp).forEach((im) => im.removeAttribute("loading"));
  const capHTML = (i) => {
    const d = PAIRS[G[i]];
    const pr = P.find((x) => x.id === d.prog);
    return `<span class="card__n">${pad(i + 1)} / ${pad(G.length)} · ${esc(d.emp)} · ${esc(d.lugar)} · ${esc(pr ? pr.anoLabel : "")}</span>
      <div><h3>${esc(d.titulo)}</h3><p>${esc(d.txt)}</p><span class="card__kpi">${esc(d.kpi)}</span></div>
      <button class="stage__go" data-prog="${d.prog}">Ver o programa <svg><use href="#arrow"/></svg></button>`;
  };
  stageCap.innerHTML = capHTML(0);
  const preload = (i) => { const k = G[(i + G.length) % G.length]; new Image().src = `img/ba/${k}-antes.webp`; new Image().src = `img/ba/${k}-depois.webp`; };
  preload(1);
  let stageCur = 0, stageBusy = false, autoOn = MOTION, elapsed = 0, stageHover = false, stageInView = false;
  const AUTO = 7000;
  const swap = (i) => {
    const k = G[i], d = PAIRS[k], [a, b] = $$("img", stageCmp);
    a.src = `img/ba/${k}-antes.webp`; a.alt = `Antes: ${d.titulo}, ${d.emp}`;
    b.src = `img/ba/${k}-depois.webp`; b.alt = `Depois: ${d.titulo}, ${d.emp}`;
    $("input", stageCmp).setAttribute("aria-label", `Comparar antes e depois: ${d.titulo}, ${d.emp}`);
    stageCap.innerHTML = capHTML(i);
  };
  const sweep = (from) => {
    const st = { v: from };
    stageCmp._set(from);
    return gsap.to(st, { v: 50, duration: 1.2, ease: "power3.inOut", onUpdate: () => stageCmp._set(st.v) });
  };
  function showStage(i) {
    i = (i + G.length) % G.length;
    if (i === stageCur || stageBusy) return;
    stageCur = i; elapsed = 0;
    const items = $$(".stage__item", stageList);
    items.forEach((b, j) => { b.setAttribute("aria-current", j === i); b.style.setProperty("--p", 0); });
    const it = items[i], lr = stageList.getBoundingClientRect(), ir = it.getBoundingClientRect();
    if (stageList.scrollHeight > stageList.clientHeight) stageList.scrollTo({ top: stageList.scrollTop + ir.top - lr.top - lr.height / 2 + ir.height / 2, behavior: "smooth" });
    if (stageList.scrollWidth > stageList.clientWidth) stageList.scrollTo({ left: stageList.scrollLeft + ir.left - lr.left - 8, behavior: "smooth" });
    preload(i + 1);
    if (!MOTION) { swap(i); stageCmp._set(50); return; }
    stageBusy = true;
    const wipe = $(".stage__wipe", stageFrame);
    gsap.timeline({ onComplete: () => (stageBusy = false) })
      .set(wipe, { transformOrigin: "left center" })
      .to(wipe, { scaleX: 1, duration: 0.42, ease: "expo.in" })
      .add(() => { swap(i); stageCmp._set(100); })
      .set(wipe, { transformOrigin: "right center" })
      .to(wipe, { scaleX: 0, duration: 0.6, ease: "expo.out" })
      .from(stageCap.children, { y: 16, opacity: 0, duration: 0.5, stagger: 0.06, ease: "power3.out" }, "<")
      .add(() => sweep(100), "<0.15");
  }
  stageList.addEventListener("click", (e) => { const b = e.target.closest(".stage__item"); if (b) showStage(+b.dataset.i); });
  stageCmp.addEventListener("pointerdown", () => { autoOn = false; $$(".stage__item", stageList).forEach((b) => b.style.setProperty("--p", 0)); });
  $("input", stageCmp).addEventListener("keydown", () => (autoOn = false));
  $("#stage").addEventListener("pointerenter", () => (stageHover = true));
  $("#stage").addEventListener("pointerleave", () => (stageHover = false));

  /* ---------------- Gaveta de caso ---------------- */
  const caseEl = $("#case"), panel = $("#casePanel");
  let lastFocus = null, current = null;
  const order = () => P.slice().sort((a, b) => a.ano - b.ano);
  function caseHTML(p) {
    const list = order(), i = list.indexOf(p);
    const rows = p.empresas.slice().sort((a, b) => (b.g || 0) - (a.g || 0));
    const hasG = rows.some((e) => e.g), hasBC = rows.some((e) => e.bc);
    const notes = [];
    if (p.gNota) notes.push(`Ganho do programa: ${p.gNota}.`);
    if (rows.some((e) => e.p)) notes.push("“Projetado” indica ganho previsto pela empresa no fechamento, fora das somas da página.");
    if (rows.some((e) => e.x)) notes.push("“A validar” indica valor da planilha consolidada ainda sem confirmação, fora das somas da página.");
    if (p.semTotal) notes.push("O relatório deste programa não traz o ganho de todas as empresas, por isso ele não entra na soma geral.");
    notes.push("Fonte: relatório de resultados e planilha consolidada do programa. Valores anuais declarados pelas empresas.");
    const pairs = p.fotos.filter((k) => PAIRS[k]);
    return `
      <div class="case__bar">
        <span class="label">Programa ${String(i + 1).padStart(2, "0")} de ${list.length}</span>
        <div class="case__nav">
          <button class="icon-btn" data-go="-1" aria-label="Programa anterior"><svg><use href="#prev"/></svg></button>
          <button class="icon-btn" data-go="1" aria-label="Próximo programa"><svg><use href="#next"/></svg></button>
          <button class="icon-btn" data-close aria-label="Fechar"><svg><use href="#close"/></svg></button>
        </div>
      </div>
      <div class="eyebrow label tq" style="margin-bottom:0"><span class="rule"></span>${esc(p.anoLabel)} · ${esc(p.parceiro)}</div>
      <h3 class="display" id="caseTitle">${esc(p.nome)}</h3>
      <div class="case__meta"><span>${esc(p.local)}</span><span>${p.e} ${p.e === 1 ? "empresa" : "empresas"}</span>${p.total ? `<span>${brl(p.total)} por ano</span>` : ""}</div>
      <p class="case__lead">${esc(p.resumo)}</p>
      <div class="case__kpis">${p.kpis.map(([b, s]) => `<div><b class="num">${esc(b)}</b><span>${esc(s)}</span></div>`).join("")}</div>
      <h4><span>Empresas e resultados</span><span>${rows.length} de ${p.e}</span></h4>
      <div class="tbl-wrap"><table class="tbl">
        <thead><tr><th>Empresa</th><th>O que mudou</th>${hasG ? '<th class="n">Ganho anual</th>' : ""}${hasBC ? '<th class="n">B/C</th>' : ""}</tr></thead>
        <tbody>${rows.map((e) => `<tr>
          <td><b>${esc(e.n)}</b>${e.s ? `<small>${esc(e.s)}</small>` : ""}</td>
          <td>${esc(e.r || "—")}</td>
          ${hasG ? `<td class="n">${e.g ? brl(e.g) + (e.p ? '<span class="proj">projetado</span>' : e.x ? '<span class="proj">a validar</span>' : "") : "—"}</td>` : ""}
          ${hasBC ? `<td class="n">${e.bc ? nfBC.format(e.bc) + "×" : "—"}</td>` : ""}
        </tr>`).join("")}</tbody>
      </table></div>
      ${pairs.length ? `<h4><span>Antes e depois</span><span>${pairs.length} ${pairs.length > 1 ? "registros" : "registro"}</span></h4>
        <div class="case__pairs">${pairs.map((k) => `<figure style="margin:0">${cmpHTML(k, `${PAIRS[k].titulo}, ${PAIRS[k].emp}`)}<figcaption class="mono" style="font-size:12px;margin-top:12px;color:var(--ink-soft)">${esc(PAIRS[k].emp)} · ${esc(PAIRS[k].titulo)} · ${esc(PAIRS[k].kpi)}</figcaption></figure>`).join("")}</div>` : ""}
      <p class="case__foot">${notes.join("<br>")}</p>`;
  }
  function openCase(id, from) {
    const p = P.find((x) => x.id === id);
    if (!p) return;
    current = p;
    if (!caseEl.hidden) { panel.innerHTML = caseHTML(p); panel.scrollTop = 0; initCmp(panel); $("[data-close]", panel).focus(); return; }
    lastFocus = from || document.activeElement;
    panel.innerHTML = caseHTML(p);
    caseEl.hidden = false;
    document.documentElement.style.overflow = "hidden";
    if (window.__lenis) window.__lenis.stop();
    initCmp(panel);
    panel.scrollTop = 0;
    if (MOTION) {
      gsap.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 0.6, ease: "expo.out" });
      gsap.fromTo(".case__scrim", { opacity: 0 }, { opacity: 1, duration: 0.4 });
      gsap.from($$(".case__lead, .case__kpis > div, .tbl tbody tr", panel), { opacity: 0, y: 14, stagger: 0.025, duration: 0.5, delay: 0.2, ease: "power3.out" });
    }
    $("[data-close]", panel).focus();
  }
  function closeCase() {
    const done = () => {
      caseEl.hidden = true;
      document.documentElement.style.overflow = "";
      if (window.__lenis) window.__lenis.start();
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    };
    if (MOTION) { gsap.to(panel, { xPercent: 100, duration: 0.4, ease: "power3.in" }); gsap.to(".case__scrim", { opacity: 0, duration: 0.4, onComplete: done }); }
    else done();
  }
  caseEl.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) return closeCase();
    const go = e.target.closest("[data-go]");
    if (go) { const list = order(); const i = (list.indexOf(current) + +go.dataset.go + list.length) % list.length; openCase(list[i].id); }
  });
  document.addEventListener("keydown", (e) => {
    if (caseEl.hidden) return;
    if (e.key === "Escape") closeCase();
    if (e.key === "Tab") {
      const f = $$('button, a[href], input, [tabindex="0"]', panel).filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-prog]");
    if (t && !caseEl.contains(t)) openCase(t.dataset.prog, t);
  });
  $("#bars").addEventListener("keydown", (e) => {
    const t = e.target.closest("[data-prog]");
    if (t && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openCase(t.dataset.prog, t); }
  });

  /* ---------------- Mapa ----------------
     Os ~1.800 pontos são desenhados num canvas (uma onda de 1,4 s e depois fica parado);
     os pinos são botões HTML com animação só de transform/opacity, que a GPU compõe. */
  const M = window.BR_MAP, canvas = $("#mapCanvas"), pinLayer = $("#mapPins"), tipWrap = $(".map__svgwrap");
  const W = M.W * M.k + 1, H = M.H + 1;
  tipWrap.style.aspectRatio = `${W.toFixed(3)} / ${H}`;
  const cityProgs = {};
  P.forEach((p) => p.cidades.forEach((c) => (cityProgs[c] = cityProgs[c] || []).push(p.nome)));
  window.AG_OTHERS.forEach((o) => (cityProgs[o.cidade] = cityProgs[o.cidade] || []).push(o.nome));
  const bh = M.cities["Belo Horizonte"];
  const DOTS = [];
  let maxD = 0;
  for (let i = 0; i < M.d.length; i += 3) {
    const d = Math.hypot(M.d[i] - bh[0], M.d[i + 1] - bh[1]);
    maxD = Math.max(maxD, d);
    DOTS.push([M.d[i] * M.k + 0.5, M.d[i + 1] + 0.5, M.d[i + 2], d]);
  }
  let mapT = MOTION ? 0 : 1;
  function drawMap() {
    const w = tipWrap.clientWidth, h = (w * H) / W, dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (!w) return;
    if (canvas.width !== Math.round(w * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
    const ctx = canvas.getContext("2d"), sc = (w / W) * dpr, r = 0.3 * sc;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const front = mapT * (maxD + 6);
    for (const [x, y, wk, d] of DOTS) {
      const a = Math.max(0, Math.min(1, (front - d) / 6));
      if (!a) continue;
      ctx.globalAlpha = a;
      ctx.fillStyle = wk ? "#2f5c58" : "#33403f";
      ctx.beginPath(); ctx.arc(x * sc, y * sc, r, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  pinLayer.innerHTML = Object.keys(cityProgs).filter((c) => M.cities[c]).map((c) => {
    const pt = M.cities[c], x = ((pt[0] * M.k + 0.5) / W) * 100, y = ((pt[1] + 0.5) / H) * 100;
    return `<button class="pin" data-city="${esc(c)}" style="left:${x.toFixed(2)}%;top:${y.toFixed(2)}%" aria-label="${esc(c)}: ${cityProgs[c].length} programa(s)"></button>`;
  }).join("");
  drawMap();
  let mapRaf = 0;
  window.addEventListener("resize", () => { cancelAnimationFrame(mapRaf); mapRaf = requestAnimationFrame(drawMap); });
  function waveMap() {
    if (MOTION) gsap.fromTo("#mapPins .pin", { scale: 0 }, { scale: 1, duration: 0.5, stagger: 0.05, delay: 0.5, ease: "back.out(3)", clearProps: "transform" });
    if (mapT >= 1) return drawMap();
    const t0 = performance.now();
    const step = (t) => { mapT = Math.min(1, (t - t0) / 1400); drawMap(); if (mapT < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  const cityList = Object.entries(cityProgs).filter(([c]) => M.cities[c]).sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
  $("#cities").innerHTML = cityList.map(([c, l]) => `<li data-city="${esc(c)}">${esc(c)} <span>${UF[c]} · ${l.length}</span></li>`).join("");
  const tip = $("#mapTip");
  const hiCity = (c, on) => {
    $$(`[data-city="${CSS.escape(c)}"]`).forEach((el) => el.classList.toggle("hi", on));
    if (!on) return tip.classList.remove("on");
    const g = $(`.pin[data-city="${CSS.escape(c)}"]`, pinLayer);
    if (!g) return;
    const r = g.getBoundingClientRect(), wr = tipWrap.getBoundingClientRect();
    tip.innerHTML = `<b>${esc(c)} · ${UF[c]}</b><span>${cityProgs[c].map(esc).join("<br>")}</span>`;
    const half = tip.offsetWidth / 2;
    const x = Math.max(half, Math.min(wr.width - half, r.left + r.width / 2 - wr.left));
    tip.style.left = x + "px"; tip.style.top = r.top - wr.top + "px";
    tip.classList.add("on");
  };
  $$("[data-city]").forEach((el) => {
    el.addEventListener("pointerenter", () => hiCity(el.dataset.city, true));
    el.addEventListener("pointerleave", () => hiCity(el.dataset.city, false));
    el.addEventListener("focus", () => hiCity(el.dataset.city, true));
    el.addEventListener("blur", () => hiCity(el.dataset.city, false));
  });

  /* ---------------- Ferramentas, setores, LeanOS, trajetória ---------------- */
  $("#tools").innerHTML = window.AG_TOOLS.map(([k, c, d], i) => `
    <button class="tool" aria-expanded="false" aria-label="${esc(k)}: ${esc(d)}">
      <span class="tool__c">${esc(c)}</span><span class="tool__k">${esc(k)}</span>
      <span class="tool__d" aria-hidden="true"><span>${esc(d)}</span><b>${esc(k)}</b></span>
    </button>`).join("");
  $("#tools").addEventListener("click", (e) => {
    const b = e.target.closest(".tool");
    if (!b) return;
    const on = b.getAttribute("aria-expanded") !== "true";
    $$("#tools .tool").forEach((x) => x.setAttribute("aria-expanded", "false"));
    b.setAttribute("aria-expanded", on);
  });

  const SECT_TXT = {
    ind: "Metalmecânica, autopeças, plásticos, confecção, fechaduras",
    ofi: "Oficinas de leves e pesados, centros automotivos",
    ali: "Laticínios, panificação, torrefação, pão de queijo",
    con: "Canteiro, almoxarifado, traço, cronograma",
    ser: "Logística, varejo, locação, comunicação visual",
    pub: "Atendimento ao cidadão e fluxo de benefícios",
  };
  $("#sectors").innerHTML = Object.entries(SECT).map(([k, v]) => {
    const n = sectorCount(k) + window.AG_OTHERS.filter((o) => o.setor === k).length;
    return `<div class="sector"><span class="label">Setor</span><b>${esc(v)}</b><span>${esc(SECT_TXT[k])}</span><strong class="num">${String(n).padStart(2, "0")}</strong><span class="label" style="color:var(--ink-soft)">${n === 1 ? "programa" : "programas"}</span></div>`;
  }).join("");

  const L = window.LION, lion = $("#lion");
  lion.setAttribute("viewBox", L.vb);
  lion.innerHTML = `<path d="${L.mane}" fill="#F5A623" fill-rule="evenodd"/><path d="${L.face}" fill="#E8F1EF" fill-rule="evenodd"/>`;

  const sp = [78, 80, 79, 83, 85, 84, 88, 90, 89, 92, 93, 94];
  const sx = (i) => (i / (sp.length - 1)) * 196 + 2, sy = (v) => 60 - ((v - 70) / 30) * 56;
  const line = sp.map((v, i) => `${i ? "L" : "M"}${sx(i).toFixed(1)} ${sy(v).toFixed(1)}`).join(" ");
  $("#spark .l").setAttribute("d", line);
  $("#spark .a").setAttribute("d", `${line} L198 64 L2 64Z`);
  const dot = $("#spark circle");
  dot.setAttribute("cx", sx(sp.length - 1)); dot.setAttribute("cy", sy(sp[sp.length - 1]));
  const tick = () => { const d = new Date(); $("#clock").textContent = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }); };
  tick(); setInterval(tick, 30000);

  $("#tl").innerHTML = window.AG_TIMELINE.map((t, i) => `
    <div class="tl__i"><span class="tl__y num">${t.ano}</span><span class="tl__t">${esc(t.t)}</span><span class="tl__d">${esc(t.d)}</span>
      <span class="tl__bar" style="--h:${36 + i * 30}px"></span></div>`).join("");
  $("#quotes").innerHTML = window.AG_QUOTES.map((q) => `
    <blockquote class="quote" style="margin:0"><p>“${esc(q.q)}”</p><footer><b>${esc(q.who)}</b><span>${esc(q.ctx)}</span></footer></blockquote>`).join("");

  /* ---------------- Navegação, menu, capítulo, progresso ---------------- */
  const nav = $("#nav"), roofs = $$("#nav .sym .r");
  const zones = $$("[data-nav]");
  const chapters = $$("[data-chapter]"), rail = $("#rail");
  let lastY = window.scrollY, curChap = "";
  function onScroll() {
    const y = window.scrollY;
    let mode = "clear";
    if (y > 24) for (const z of zones) { const r = z.getBoundingClientRect(); if (r.top <= 34 && r.bottom > 34) { mode = z.dataset.nav; break; } }
    ["solid", "dark", "turq", "los"].forEach((m) => nav.classList.toggle("is-" + m, mode === m));
    const goingDown = y > lastY + 4, goingUp = y < lastY - 4;
    if (goingDown && y > 640 && caseEl.hidden) nav.classList.add("is-hidden");
    else if (goingUp || y < 640) nav.classList.remove("is-hidden");
    lastY = y;
    const max = document.documentElement.scrollHeight - innerHeight;
    const prog = max > 0 ? y / max : 0;
    roofs.forEach((r, i) => r.classList.toggle("on", prog > i / 3 + 0.015 || prog > 0.985));
    let c = chapters[0];
    for (const s of chapters) if (s.getBoundingClientRect().top < innerHeight * 0.5) c = s;
    const mid = innerHeight / 2;
    let back = "solid";
    for (const z of zones) { const r = z.getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) { back = z.dataset.nav; break; } }
    rail.classList.toggle("is-inv", back !== "solid");
    if (c && c.dataset.chapter !== curChap) {
      curChap = c.dataset.chapter;
      rail.classList.toggle("is-off", curChap === "00");
      $$("a", rail).forEach((a) => a.classList.toggle("on", a.dataset.sec === c.id));
      rail.classList.add("flash");
      clearTimeout(rail._t);
      rail._t = setTimeout(() => rail.classList.remove("flash"), 1600);
      $$(".nav__links a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + c.id));
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const drawerNav = $("#drawerNav"), menuBtn = $("#menuBtn");
  const setMenu = (open) => {
    drawerNav.hidden = !open; menuBtn.setAttribute("aria-expanded", open);
    if (open) { if (MOTION) gsap.from("#drawerNav a", { yPercent: 60, opacity: 0, stagger: 0.04, duration: 0.5, ease: "expo.out" }); $("#menuClose").focus(); }
  };
  menuBtn.addEventListener("click", () => setMenu(true));
  $("#menuClose").addEventListener("click", () => setMenu(false));

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    const target = id === "#topo" ? document.body : $(id);
    if (!target) return;
    e.preventDefault();
    setMenu(false);
    if (window.__lenis) window.__lenis.scrollTo(id === "#topo" ? 0 : target, { duration: 1.3 });
    else (id === "#topo" ? window.scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" }) : target.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" }));
  });

  /* ---------------- Serviços ---------------- */
  let svcPref = null;
  $("#services").innerHTML = window.AG_SERVICES.map((v) => `
    <article class="svc">
      <span class="svc__tag">${esc(v.tag)}</span>
      <h3>${esc(v.nome)}</h3>
      <p>${esc(v.para)}</p>
      <ul>${v.entrega.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>
      <p class="svc__proof">${esc(v.prova)}</p>
      <button class="svc__cta" data-svc="${v.id}">Quero conversar sobre isto <svg><use href="#arrow"/></svg></button>
    </article>`).join("");
  $("#services").addEventListener("click", (e) => {
    const b = e.target.closest("[data-svc]");
    if (!b) return;
    b.blur();
    svcPref = b.dataset.svc;
    renderQuizSide();
    const t = $("#contato");
    if (window.__lenis) window.__lenis.scrollTo(t, { duration: 1.3 }); else t.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" });
  });

  /* ---------------- Casos em profundidade ---------------- */
  const CASES = window.AG_CASES;
  const fmtU = (v, u) => (u === "R$" ? brl(v) : nf0.format(v) + (u === "min" ? " min" : u === "h" ? " h" : u === "passos" ? "" : u === "peças" ? "" : ""));
  function chartHTML(c) {
    if (c.tipo === "serie") {
      const max = Math.max(...c.itens.map((i) => i[1]));
      return `<div class="chart"><h5><span>${esc(c.titulo)}</span></h5><div class="cols">${c.itens.map(([l, v]) =>
        `<div class="col"><b>${nf0.format(v)}</b><i style="--h:${((v / max) * 100).toFixed(1)}%"></i><span>${esc(l)}</span></div>`).join("")}</div></div>`;
    }
    const max = Math.max(...c.itens.flatMap((i) => [i[1], i[2]]));
    const w = (v) => Math.max(0.6, (v / max) * 100).toFixed(1) + "%";
    return `<div class="chart"><h5><span>${esc(c.titulo)}</span><span class="chart__legend"><span><i style="background:#56635f"></i>Antes</span><span><i style="background:var(--kaizen)"></i>Depois</span></span></h5>
      ${c.itens.map(([l, a, d, la, ld]) => `<div class="prow"><span>${esc(l)}</span>
        <div class="pbar"><i style="--w:${w(a)}"></i><em>${la || fmtU(a, c.unidade)}</em></div>
        <div class="pbar d"><i style="--w:${w(d)}"></i><em>${ld || fmtU(d, c.unidade)}</em></div></div>`).join("")}</div>`;
  }
  $("#caseTabs").innerHTML = CASES.map((c, i) => `<li role="presentation"><button class="ctab" role="tab" id="ctab-${c.id}" aria-controls="caseView" aria-selected="${i === 0}" data-case="${i}"><b>${esc(c.emp)}</b><span>${esc(c.setor)} · ${esc(c.kpis[0][0])}</span></button></li>`).join("");
  let caseCur = -1;
  function showCase(i, anim) {
    if (i === caseCur) return;
    caseCur = i;
    const c = CASES[i], view = $("#caseView");
    $$(".ctab").forEach((t, j) => t.setAttribute("aria-selected", j === i));
    view.setAttribute("aria-labelledby", "ctab-" + c.id);
    const foto = c.fotos.find((k) => PAIRS[k]);
    view.innerHTML = `
      <div class="case-v__meta"><span>${esc(c.setor)}</span><span>${esc(c.lugar)}</span><span>${esc(c.ano)}</span></div>
      <h3>${esc(c.titulo)}</h3>
      <div class="case-v__pca">
        <div><h4>Problema</h4><p>${esc(c.problema)}</p></div>
        <div><h4>Causa</h4><p>${esc(c.causa)}</p></div>
        <div><h4>O que foi feito</h4><ul>${c.acao.map((a) => `<li>${esc(a)}</li>`).join("")}</ul></div>
      </div>
      <div class="case-v__kpis">${c.kpis.map(([b, t]) => `<div><b class="num">${esc(b)}</b><span>${esc(t)}</span></div>`).join("")}</div>
      <div class="case-v__vis${foto ? "" : " solo"}">
        ${chartHTML(c.chart)}
        ${foto ? `<figure style="margin:0">${cmpHTML(foto, `${PAIRS[foto].titulo}, ${c.emp}`)}<figcaption style="font-size:13.5px;margin-top:12px;color:rgba(243,241,236,.6)">${esc(PAIRS[foto].titulo)} · foto de celular feita durante o projeto</figcaption></figure>` : ""}
      </div>
      <div class="case-v__foot">
        <p>Fonte: relatório de resultados do programa. Valores anuais declarados pela empresa.</p>
        <div style="display:flex;gap:22px;flex-wrap:wrap">
          <button class="stage__go" data-prog="${c.prog}">Ver o programa <svg><use href="#arrow"/></svg></button>
          <a class="stage__go" href="#contato" style="color:var(--kaizen);text-decoration:none">Tem um problema parecido? <svg><use href="#arrow"/></svg></a>
        </div>
      </div>`;
    initCmp(view);
    if (MOTION && anim) {
      gsap.from(view.children, { y: 18, opacity: 0, duration: 0.6, stagger: 0.05, ease: "power3.out" });
      gsap.from($$(".pbar i", view), { scaleX: 0, duration: 1, stagger: 0.04, delay: 0.25, ease: "expo.out" });
      gsap.from($$(".col i", view), { scaleY: 0, duration: 0.9, stagger: 0.07, delay: 0.25, ease: "expo.out" });
    }
  }
  showCase(0, false);
  const toCaseTop = () => {
    const v = $("#caseView"), top = v.getBoundingClientRect().top;
    if (top < 80 || top > innerHeight * 0.6) {
      if (window.__lenis) window.__lenis.scrollTo(v, { offset: -110, duration: 0.9 });
      else window.scrollTo({ top: window.scrollY + top - 110, behavior: REDUCED ? "auto" : "smooth" });
    }
  };
  $("#caseTabs").addEventListener("click", (e) => { const b = e.target.closest("[data-case]"); if (b) { showCase(+b.dataset.case, true); toCaseTop(); } });
  $("#caseTabs").addEventListener("keydown", (e) => {
    if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
    e.preventDefault();
    const n = (caseCur + (e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1) + CASES.length) % CASES.length;
    showCase(n, true); $$(".ctab")[n].focus();
  });

  /* ---------------- Simulador ----------------
     Números deslizam até o valor novo, as figuras mudam de cor em cascata
     e um contador mostra o custo do tempo sem valor enquanto a seção está na tela. */
  const simP = $("#simP"), simC = $("#simC"), simN = $("#simN");
  const REDUCAO = 0.601, HORAS_ANO = 2112;
  const shown = { desp: 0, rec: 0, cons: 0, fte: 0 };
  let simDesp = 0, tickVal = 0, tickOn = false, tickLast = 0;
  const pplBox = $("#simPpl");
  pplBox.innerHTML = Array.from({ length: 100 }, () => '<svg viewBox="0 0 12 20"><use href="#person"/></svg>').join("");
  const ppl = $$("svg", pplBox);
  const paint = () => {
    $("#simBig").innerHTML = `<small>R$</small>${brl(shown.desp).replace("R$ ", "")}`;
    $("#simRec").textContent = brl(shown.rec);
    $("#simCons").textContent = brl(shown.cons);
    $("#simFte").textContent = nf1.format(shown.fte);
  };
  function sim(e) {
    const p = +simP.value, c = +simC.value, n = +simN.value / 100;
    const folha = p * c * 12, desp = folha * n, rec = desp * REDUCAO, cons = desp * 0.3;
    simDesp = desp;
    $("#simPo").textContent = nf0.format(p);
    $("#simCo").textContent = "R$ " + nf0.format(c);
    $("#simNo").textContent = Math.round(n * 100) + "%";
    [simP, simC, simN].forEach((el) => el.style.setProperty("--f", ((el.value - el.min) / (el.max - el.min)) * 100 + "%"));
    if (e) { const f = e.target.closest(".field"); f.classList.add("is-on"); clearTimeout(f._t); f._t = setTimeout(() => f.classList.remove("is-on"), 700); }
    const target = { desp, rec, cons, fte: p * n * REDUCAO };
    if (MOTION) gsap.to(shown, { ...target, duration: 0.6, ease: "power3.out", overwrite: true, onUpdate: paint });
    else { Object.assign(shown, target); paint(); }
    $("#simCap").textContent = `É quanto a folha de ${brl(folha)} por ano paga por tempo que o cliente não compra.`;
    const cells = ppl.length, per = Math.max(1, Math.ceil(p / cells)), active = Math.min(cells, Math.ceil(p / per));
    const nW = Math.round(active * n), nR = Math.round(active * n * REDUCAO);
    ppl.forEach((el, i) => {
      el.style.display = i < active ? "" : "none";
      el.style.transitionDelay = MOTION ? (i % 20) * 12 + Math.floor(i / 20) * 18 + "ms" : "0ms";
      el.classList.toggle("r", i < nR);
      el.classList.toggle("w", i >= nR && i < nW);
    });
    pplBox.style.gridTemplateColumns = `repeat(${Math.min(20, Math.max(10, active))}, 1fr)`;
    $("#simPplCap").textContent = per === 1 ? "cada figura = 1 pessoa" : `cada figura = ${per} pessoas`;
    $("#simCalc").innerHTML = `${nf0.format(p)} pessoas × R$ ${nf0.format(c)} × 12 meses = <b>${brl(folha)}</b> de folha por ano<br>
      ${brl(folha)} × ${Math.round(n * 100)}% de tempo sem valor = <b>${brl(desp)}</b><br>
      ${brl(desp)} × 60,1% de redução média = <b>${brl(rec)}</b> de potencial<br>
      Cenário conservador, com 30% de redução: <b>${brl(cons)}</b><br>
      Contador: ${brl(desp)} ÷ ${nf0.format(HORAS_ANO)} horas de trabalho por ano`;
  }
  [simP, simC, simN].forEach((el) => el.addEventListener("input", sim));
  sim();
  const nf2 = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const tickLoop = (t) => {
    if (!tickOn) return;
    if (tickLast) tickVal += (simDesp / (HORAS_ANO * 3600)) * ((t - tickLast) / 1000);
    tickLast = t;
    $("#simTick").textContent = "R$ " + nf2.format(tickVal);
    requestAnimationFrame(tickLoop);
  };
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((es) => es.forEach((en) => {
      tickOn = en.isIntersecting; tickLast = 0;
      if (tickOn) requestAnimationFrame(tickLoop);
    }), { threshold: 0.25 }).observe($("#sim"));
  }

  /* ---------------- Perguntas ---------------- */
  $("#faq").innerHTML = window.AG_FAQ.map(([q, a]) => `<details><summary>${esc(q)}<i aria-hidden="true"></i></summary><div class="faq__a"><p>${esc(a)}</p></div></details>`).join("");
  $$("#faq details").forEach((d) => d.addEventListener("toggle", () => {
    if (d.open && MOTION) gsap.from($(".faq__a", d), { height: 0, opacity: 0, duration: 0.45, ease: "power3.out", clearProps: "height,opacity" });
  }));

  /* ---------------- Por onde começar ---------------- */
  const QZ = window.AG_QUIZ, ans = {};
  let qi = 0;
  const SVC = Object.fromEntries(window.AG_SERVICES.map((v) => [v.id, v]));
  const label = (qid, v) => QZ.find((q) => q.id === qid).opts.find((o) => o[0] === v)[1];
  function recommend() {
    if (svcPref) return SVC[svcPref];
    if (ans.setor === "inst") return SVC.programas;
    if (ans.dor === "regride") return SVC.leanos;
    if (ans.dor === "pessoas") return SVC.lideres;
    if (ans.porte === "g" && (ans.dor === "prod" || ans.dor === "custo")) return SVC.implantacao;
    return SVC.diagnostico;
  }
  const SETOR_TXT = { ind: "Tenho uma indústria", ofi: "Tenho uma oficina", con: "Tenho uma construtora", ali: "Tenho uma empresa de alimentos", ser: "Tenho uma empresa de comércio e serviços", inst: "Represento uma instituição que atende várias empresas" };
  const PORTE_TXT = { p: "com até 20 pessoas", m: "com 20 a 100 pessoas", g: "com mais de 100 pessoas" };
  const RELATED = { ind: ["case", "metaltecnica"], ofi: ["case", "carrera"], con: ["case", "pittelli"], ali: ["prog", "procompi-2017"], ser: ["prog", "rio-2017"], inst: ["prog", "bh-lafaiete-2014"] };
  function renderQuizSide() {
    const side = $("#quizSide");
    const done = QZ.every((q) => ans[q.id]);
    if (!done && !svcPref) {
      side.innerHTML = `<span class="label">Sua recomendação</span><div class="quiz__empty"><b>3</b>perguntas rápidas e você vê qual formato faz sentido, um caso parecido com o seu e uma mensagem pronta para enviar.</div>`;
      return;
    }
    const v = recommend();
    let rel = "";
    if (ans.setor) {
      const [kind, id] = RELATED[ans.setor];
      if (kind === "case") { const c = CASES.find((x) => x.id === id); rel = `<p>Caso parecido: <b>${esc(c.emp)}</b>, ${esc(c.kpis[0][0])} ${esc(c.kpis[0][1])}.</p>`; }
      else { const p = P.find((x) => x.id === id); rel = `<p>Programa parecido: <b>${esc(p.nome)}</b>.</p>`; }
    }
    const txt = done
      ? `Olá, Albert! Vi seu portfólio. ${SETOR_TXT[ans.setor]} ${PORTE_TXT[ans.porte]}, e hoje o que mais pesa é: ${label("dor", ans.dor).toLowerCase()}. Gostaria de conversar sobre ${v.nome.charAt(0).toLowerCase() + v.nome.slice(1)}.`
      : `Olá, Albert! Vi seu portfólio e gostaria de conversar sobre ${v.nome.toLowerCase()}.`;
    side.innerHTML = `<span class="label">Recomendado para você</span><h4>${esc(v.nome)}</h4><p>${esc(v.para)}</p>${rel}
      <label for="quizMsg" class="label" style="color:rgba(243,241,236,.6)">Mensagem pronta</label>
      <textarea class="quiz__msg" id="quizMsg">${esc(txt)}</textarea>
      <div class="quiz__acts"><button class="btn" id="quizCopy" type="button">Copiar mensagem</button><a class="btn" href="https://www.linkedin.com/in/albert-gil-a85a03206/" target="_blank" rel="noopener">Abrir LinkedIn <svg><use href="#arrow-ne"/></svg></a></div>
      <span class="quiz__copied" id="quizCopied"></span>`;
    $("#quizCopy").addEventListener("click", () => {
      const ta = $("#quizMsg"), ok = () => ($("#quizCopied").textContent = "Mensagem copiada. Cole no LinkedIn do Albert.");
      const fallback = () => { ta.focus(); ta.select(); $("#quizCopied").textContent = "Texto selecionado: use Ctrl+C para copiar."; };
      try { navigator.clipboard.writeText(ta.value).then(ok, fallback); } catch (err) { fallback(); }
    });
    if (MOTION) gsap.from(side.children, { y: 12, opacity: 0, duration: 0.5, stagger: 0.05, ease: "power3.out" });
  }
  function renderQuiz() {
    const q = QZ[qi];
    $("#quizStep").textContent = `Pergunta ${qi + 1} de ${QZ.length}`;
    $("#quizQ").textContent = q.q;
    $("#quizOpts").setAttribute("aria-label", q.q);
    $("#quizOpts").innerHTML = q.opts.map(([v, t]) => `<button class="opt" type="button" data-v="${v}" aria-pressed="${ans[q.id] === v}">${esc(t)}</button>`).join("");
    $$(".quiz__prog i").forEach((el, j) => el.classList.toggle("on", j < qi || (j === qi && ans[q.id])));
    $("#quizBack").hidden = qi === 0;
    if (MOTION) gsap.from([$("#quizQ"), ...$$("#quizOpts .opt")], { x: 16, opacity: 0, duration: 0.4, stagger: 0.03, ease: "power3.out" });
  }
  $("#quizOpts").addEventListener("click", (e) => {
    const b = e.target.closest(".opt");
    if (!b) return;
    ans[QZ[qi].id] = b.dataset.v;
    svcPref = null;
    $$("#quizOpts .opt").forEach((x) => x.setAttribute("aria-pressed", x === b));
    setTimeout(() => {
      if (qi < QZ.length - 1) { qi++; renderQuiz(); }
      else { $$(".quiz__prog i").forEach((el) => el.classList.add("on")); }
      renderQuizSide();
    }, 220);
  });
  $("#quizBack").addEventListener("click", () => { if (qi > 0) { qi--; renderQuiz(); } });
  renderQuiz();
  renderQuizSide();

  /* ---------------- Ampliar a comparação ---------------- */
  const lb = $("#lb");
  stageFrame.insertAdjacentHTML("beforeend", '<button class="stage__zoom" id="stageZoom" aria-label="Ampliar comparação"><svg><use href="#expand"/></svg></button>');
  let lbLast = null;
  $("#stageZoom").addEventListener("click", () => {
    const k = G[stageCur], d = PAIRS[k];
    lbLast = document.activeElement;
    $("#lbIn").innerHTML = cmpHTML(k, `${d.titulo}, ${d.emp}`) + `<div class="lb__cap"><b>${esc(d.emp)} · ${esc(d.titulo)}</b><span>${esc(d.kpi)} · foto de celular feita durante o projeto</span></div>`;
    $$("#lbIn img").forEach((im) => im.removeAttribute("loading"));
    initCmp($("#lbIn"));
    lb.hidden = false; autoOn = false;
    if (window.__lenis) window.__lenis.stop();
    $("#lbClose").focus();
    if (MOTION) gsap.from("#lbIn", { scale: 0.94, opacity: 0, duration: 0.45, ease: "expo.out" });
  });
  const lbClose = () => { lb.hidden = true; if (window.__lenis) window.__lenis.start(); if (lbLast) lbLast.focus({ preventScroll: true }); };
  $("#lbClose").addEventListener("click", lbClose);
  lb.addEventListener("click", (e) => { if (e.target === lb) lbClose(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !lb.hidden) lbClose(); });

  /* ---------------- Botão fixo no celular ---------------- */
  const mcta = $("#mcta");
  const mctaCheck = () => {
    const c = $("#contato").getBoundingClientRect();
    mcta.classList.toggle("on", window.scrollY > innerHeight * 0.9 && c.top > innerHeight * 0.6 && lb.hidden && caseEl.hidden);
  };
  window.addEventListener("scroll", mctaCheck, { passive: true });
  mctaCheck();

  /* ---------------- Manifesto ---------------- */
  const mt = $("#manifestoText");
  const HL = ["processos,", "indicadores", "pessoas", "estratégia", "clara."];
  mt.innerHTML = mt.textContent.trim().split(/\s+/).map((w) => `<span class="w${HL.includes(w) ? " hl" : ""}">${esc(w)}</span>`).join(" ");

  /* ---------------- Movimento ---------------- */
  function stepsPath() {
    const box = $("#steps"), path = $("#stepsLine path");
    if (!box || innerWidth <= 1080) return;
    const bw = box.offsetWidth, bh = box.offsetHeight;
    const st = $$(".step", box).map((s) => ({ top: s.offsetTop + 2, right: s.offsetLeft + s.offsetWidth }));
    $("#stepsLine").setAttribute("viewBox", `0 0 ${bw} ${bh}`);
    let d = `M0 ${st[0].top}`;
    st.forEach((r, i) => { if (i) d += ` V${r.top}`; d += ` H${r.right}`; });
    path.setAttribute("d", d);
    const len = path.getTotalLength();
    path.style.strokeDasharray = len; path._len = len;
    return len;
  }

  if (!MOTION) {
    stepsPath();
    $("#ruler").style.setProperty("--v", "87%");
    $("#idxVal").textContent = "87";
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);

  if (typeof window.Lenis === "function") {
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* Pré-carregamento: os três telhados sobem e a cortina abre. */
  let seen = false;
  try { seen = sessionStorage.getItem("ag-intro") === "1"; sessionStorage.setItem("ag-intro", "1"); } catch (e) { /* armazenamento indisponível */ }
  const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
  if (!seen) {
    const loader = document.createElement("div");
    loader.className = "loader";
    loader.setAttribute("aria-hidden", "true");
    loader.innerHTML = `<div class="loader__in"><svg class="sym" viewBox="0 0 300 250"><path class="r" d="M0 250V125l100 50v75z"/><path class="r" d="M100 250V63l100 50v137z"/><path class="r" d="M200 250V0l100 50v200z"/></svg><div class="loader__word"><span>ALBERT</span><span>GIL</span></div></div><span class="loader__pct num">000</span>`;
    document.body.appendChild(loader);
    const pct = $(".loader__pct", loader), o = { v: 0 };
    intro
      .from($$(".r", loader), { scaleY: 0, duration: 0.55, stagger: 0.16, ease: "power4.out" })
      .from($$(".loader__word span", loader), { yPercent: 110, duration: 0.6, stagger: 0.08 }, 0.25)
      .to(o, { v: 100, duration: 1.0, ease: "power2.inOut", onUpdate: () => (pct.textContent = String(Math.round(o.v)).padStart(3, "0")) }, 0)
      .to(loader, { yPercent: -100, duration: 0.85, ease: "expo.inOut", onComplete: () => loader.remove() }, 1.05);
  }
  const t0 = seen ? 0 : 1.35;
  const heroSplit = window.SplitText ? SplitText.create("#heroTitle", { type: "lines", mask: "lines", linesClass: "hl" }) : null;
  if (heroSplit) intro.from(heroSplit.lines, { yPercent: 110, duration: 1.1, stagger: 0.09 }, t0);
  intro
    .from(".hero__copy .eyebrow, .hero__p, .hero__ctas", { opacity: 0, y: 18, duration: 0.9, stagger: 0.08 }, t0 + 0.25)
    .from(".hero__portrait img", { yPercent: 8, opacity: 0, duration: 1.3 }, t0 + 0.05)
    .from(".hero__tag", { clipPath: "inset(0 100% 0 0)", duration: 0.8, ease: "expo.inOut" }, t0 + 0.7)
    .from(".hero__super", { yPercent: 18, opacity: 0, duration: 1.6 }, t0)
    .from(".hero__strip li", { yPercent: 100, opacity: 0, duration: 0.8, stagger: 0.06 }, t0 + 0.45);

  /* Parallax do herói */
  gsap.to(".hero__super", { yPercent: 14, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero__portrait", { yPercent: 6, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  /* Títulos: linhas sobem por máscara quando entram na tela */
  if (window.SplitText) {
    $$("[data-split]").forEach((el) => {
      SplitText.create(el, {
        type: "lines", mask: "lines", autoSplit: true,
        onSplit: (s) => gsap.from(s.lines, { yPercent: 105, duration: 1, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } }),
      });
    });
  }

  /* Número grande e barras */
  const o = { v: 0 };
  gsap.to(o, { v: GRAND, duration: 2.2, ease: "power3.out", onUpdate: () => setBig(o.v), scrollTrigger: { trigger: "#bigGain", start: "top 85%", once: true } });
  gsap.from(".bars__fill", { scaleX: 0, duration: 1.3, ease: "expo.out", stagger: 0.05, scrollTrigger: { trigger: "#bars", start: "top 80%", once: true } });
  $$(".kv").forEach((el) => {
    const v = +el.dataset.v, d = +el.dataset.d, o2 = { n: 0 };
    el.textContent = fmtK(0, d);
    gsap.to(o2, { n: v, duration: 1.8, ease: "power3.out", onUpdate: () => (el.textContent = fmtK(o2.n, d)), scrollTrigger: { trigger: "#kpis", start: "top 88%", once: true } });
  });
  gsap.from(".kpi", { opacity: 0, y: 24, duration: 0.8, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: "#kpis", start: "top 88%", once: true } });

  /* Faixa: velocidade e direção seguem a rolagem */
  const track = $("#marquee");
  let mx = 0, dir = 1, boost = 0;
  if (window.__lenis) window.__lenis.on("scroll", (l) => { if (l.velocity) { dir = l.velocity > 0 ? 1 : -1; boost = Math.min(Math.abs(l.velocity) * 0.6, 14); } });
  gsap.ticker.add(() => {
    const half = track.scrollWidth / 2;
    if (!half) return;
    mx -= (0.6 + boost) * dir;
    boost *= 0.92;
    if (mx <= -half) mx += half;
    if (mx > 0) mx -= half;
    track.style.transform = `translate3d(${mx}px,0,0)`;
  });

  /* Mapa: os pontos acendem em onda a partir de BH */
  ScrollTrigger.create({ trigger: "#map", start: "top 75%", once: true, onEnter: waveMap });

  gsap.from("#cities li", { opacity: 0, x: -10, duration: 0.5, stagger: 0.03, scrollTrigger: { trigger: "#cities", start: "top 85%", once: true } });

  /* Antes e depois: varredura de entrada e troca automática enquanto o palco está na tela */
  const mm = gsap.matchMedia();
  ScrollTrigger.create({
    trigger: "#stage", start: "top 70%", end: "bottom 30%",
    onToggle: (self) => (stageInView = self.isActive),
    onEnter: () => { if (!stageFrame._intro) { stageFrame._intro = true; sweep(100); } },
  });
  gsap.from(stageFrame, { clipPath: "inset(0 0 100% 0)", duration: 1.2, ease: "expo.inOut", scrollTrigger: { trigger: "#stage", start: "top 80%", once: true } });
  gsap.from(".stage__item", { opacity: 0, x: 20, duration: 0.6, stagger: 0.04, ease: "power3.out", scrollTrigger: { trigger: "#stage", start: "top 75%", once: true } });
  gsap.ticker.add((t, dt) => {
    if (!autoOn || !stageInView || stageHover || stageBusy || !caseEl.hidden || document.hidden) return;
    elapsed += dt;
    const item = $$(".stage__item", stageList)[stageCur];
    if (item) item.style.setProperty("--p", Math.min(1, elapsed / AUTO).toFixed(3));
    if (elapsed >= AUTO) showStage(stageCur + 1);
  });

  gsap.from(".svc", { y: 40, opacity: 0, duration: 0.8, stagger: 0.07, ease: "power3.out", scrollTrigger: { trigger: "#services", start: "top 82%", once: true } });
  gsap.from(".partners li", { y: 12, opacity: 0, duration: 0.5, stagger: 0.05, scrollTrigger: { trigger: ".partners", start: "top 92%", once: true } });
  ScrollTrigger.create({ trigger: "#caseView", start: "top 75%", once: true, onEnter: () => {
    gsap.from($$("#caseView .pbar i"), { scaleX: 0, duration: 1.1, stagger: 0.05, ease: "expo.out" });
    gsap.from($$("#caseView .col i"), { scaleY: 0, duration: 1, stagger: 0.07, ease: "expo.out" });
  } });
  gsap.from("#sim", { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut", scrollTrigger: { trigger: "#sim", start: "top 82%", once: true } });
  gsap.from("#simPpl svg", { y: 14, opacity: 0, duration: 0.5, stagger: { each: 0.008, from: "start" }, ease: "back.out(2)", scrollTrigger: { trigger: "#simPpl", start: "top 88%", once: true } });
  gsap.from(".sim .field", { x: -24, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: "#sim", start: "top 75%", once: true } });
  gsap.from("#quiz", { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: "#quiz", start: "top 88%", once: true } });

  /* Manifesto: as palavras acendem com a rolagem (seção com sticky nativo) */
  const ws = $$(".w", mt), pillars = $$(".pillar");
  ws.forEach((w) => w.style.setProperty("--o", 0.14));
  pillars.forEach((pl) => pl.style.setProperty("--p", 0));
  ScrollTrigger.create({
    trigger: "#manifesto", start: "top top", end: "bottom bottom", scrub: true,
    onUpdate: (self) => {
      const p = self.progress, n = ws.length;
      ws.forEach((w, i) => { const t = Math.min(1, Math.max(0, (p * 1.35 * n - i) / 2)); w.style.setProperty("--o", (0.14 + 0.86 * t).toFixed(3)); });
      pillars.forEach((pl, i) => pl.style.setProperty("--p", Math.min(1, Math.max(0, (p - 0.62 - i * 0.07) / 0.14)).toFixed(3)));
    },
  });

  /* Método: os degraus nascem do chão conforme a rolagem e a escada Kaizen se desenha logo atrás.
     Só deslocamento (sem transparência) e tudo termina quando a escada chega a 35% da tela. */
  mm.add("(min-width: 1081px)", () => {
    const path = $("#stepsLine path");
    const len = stepsPath() || 0;
    gsap.set("#steps", { clipPath: "inset(-60px -60px 0px -60px)" });
    gsap.set(path, { strokeDashoffset: len });
    const tl = gsap.timeline({ scrollTrigger: { trigger: "#steps", start: "top bottom", end: "top 58%", scrub: 0.4 } });
    $$(".step").forEach((st, k) => tl.from(st, { yPercent: 75, duration: 0.5, ease: "power2.out" }, k * 0.22));
    tl.to(path, { strokeDashoffset: 0, duration: 1, ease: "none" }, 0.5);
    const onR = () => { const l = stepsPath(); if (l) gsap.set(path, { strokeDashoffset: l * (1 - Math.max(0, Math.min(1, (tl.time() - 0.5) / 1))) }); };
    ScrollTrigger.addEventListener("refresh", onR);
    return () => ScrollTrigger.removeEventListener("refresh", onR);
  });
  mm.add("(max-width: 1080px)", () => {
    gsap.from(".step", { opacity: 0, y: 30, stagger: 0.1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: "#steps", start: "top 85%", once: true } });
  });
  gsap.from(".tool", { opacity: 0, duration: 0.6, stagger: { each: 0.04, from: "start", grid: "auto" }, scrollTrigger: { trigger: "#tools", start: "top 85%", once: true } });
  gsap.from(".sector", { clipPath: "inset(100% 0 0 0)", duration: 0.9, stagger: 0.07, ease: "expo.out", scrollTrigger: { trigger: "#sectors", start: "top 88%", once: true } });

  /* LeanOS: índice sobe até 87, régua enche, gráfico se desenha */
  ScrollTrigger.create({
    trigger: "#screen", start: "top 75%", once: true,
    onEnter: () => {
      const v = { n: 0 };
      gsap.to(v, { n: 87, duration: 1.6, ease: "power3.out", onUpdate: () => ($("#idxVal").textContent = Math.round(v.n)) });
      $("#ruler").style.setProperty("--v", "87%");
      const l = $("#spark .l"), len = l.getTotalLength();
      gsap.fromTo(l, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" });
      gsap.from("#spark .a", { opacity: 0, duration: 1, delay: 0.8 });
      gsap.from("#spark circle", { scale: 0, transformOrigin: "center", duration: 0.5, delay: 1.5, ease: "back.out(3)" });
      gsap.from(".lamp, .alert", { opacity: 0, y: 10, stagger: 0.08, duration: 0.6, delay: 0.3 });
    },
  });
  gsap.from(".screen", { yPercent: 8, rotate: -1.2, ease: "none", scrollTrigger: { trigger: ".los", start: "top bottom", end: "center center", scrub: true } });

  /* Trajetória: a escada cresce da esquerda para a direita */
  gsap.from(".tl__bar", { scaleY: 0, transformOrigin: "50% 100%", duration: 0.9, stagger: 0.09, ease: "expo.out", scrollTrigger: { trigger: "#tl", start: "top 80%", once: true } });
  gsap.from(".tl__y, .tl__t, .tl__d", { opacity: 0, y: 12, duration: 0.6, stagger: 0.03, scrollTrigger: { trigger: "#tl", start: "top 80%", once: true } });
  gsap.from(".quote", { opacity: 0, y: 30, duration: 0.9, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: "#quotes", start: "top 85%", once: true } });

  /* Contato: o supersímbolo sobe com a rolagem */
  gsap.from(".cta__super", { yPercent: 30, ease: "none", scrollTrigger: { trigger: ".cta", start: "top bottom", end: "bottom bottom", scrub: true } });

  /* Herói: camadas reagem ao mouse */
  if (HOVER) {
    const sx2 = gsap.quickTo(".hero__super", "x", { duration: 1.2, ease: "power3" }), sy2 = gsap.quickTo(".hero__super", "y", { duration: 1.2, ease: "power3" });
    const px2 = gsap.quickTo(".hero__portrait img", "x", { duration: 1.2, ease: "power3" });
    $("#hero").addEventListener("pointermove", (e) => {
      const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
      sx2(nx * -40); sy2(ny * -24); px2(nx * 14);
    });
    const ui = $(".los__ui"), scr = $("#screen");
    const rx = gsap.quickTo(scr, "rotationX", { duration: 0.8, ease: "power3" }), ry = gsap.quickTo(scr, "rotationY", { duration: 0.8, ease: "power3" });
    ui.addEventListener("pointermove", (e) => { const r = ui.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * 9); rx(((e.clientY - r.top) / r.height - 0.5) * -7); });
    ui.addEventListener("pointerleave", () => { rx(0); ry(0); });
  }

  /* Botões magnéticos */
  if (HOVER) {
    $$(".btn").forEach((b) => {
      const qx = gsap.quickTo(b, "x", { duration: 0.4, ease: "power3" }), qy = gsap.quickTo(b, "y", { duration: 0.4, ease: "power3" });
      b.addEventListener("pointermove", (e) => { const r = b.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * 0.22); qy((e.clientY - r.top - r.height / 2) * 0.3); });
      b.addEventListener("pointerleave", () => { qx(0); qy(0); });
    });
  }

  document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
