/* ==========================================================================
   Synapse — mixeur des ambiances (page synapse.html)

   Les exports finaux de l'installation, sans aucun traitement : on ne fait
   que doser le volume de chaque fichier.
   - INFRA et SUPRA : chaque strate jouée à 100 % d'énergie. La jauge fond
     l'une dans l'autre ; à un extrême, la strate est à son volume normal.
   - ACTIVE / IDLE : quelqu'un est connecté avec un rhizome, ou personne
     depuis un moment.
   - SYMBIOSE : déclenchée quand on laisse le biome tranquille (ou au bouton).
   Toutes les boucles font 26 mesures à 125 BPM et sont calées sur la même
   grille : elles jouent en même temps et restent synchronisées.
   ========================================================================== */
(() => {
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const mix = (a, b, t) => a + (b - a) * t;
  const AC = window.AudioContext || window.webkitAudioContext;
  let ctx = null;
  const audio = () => (ctx ||= new AC());
  const cache = new Map();
  const load = (url) => {
    if (!cache.has(url)) cache.set(url, fetch(url).then((r) => r.arrayBuffer())
      .then((b) => new Promise((res, rej) => audio().decodeAudioData(b, res, rej))));
    return cache.get(url);
  };
  const hushOthers = () => {
    document.querySelectorAll("audio, video").forEach((m) => (m.hasAttribute("data-autosound") ? (m.muted = true) : m.pause()));
    window.__tracks?.forEach((a) => a.pause());
  };

  /* ------------------------------------------------------------------------
     1. Le mixeur
     ------------------------------------------------------------------------ */
  const root = document.querySelector(".synmix");
  if (root) {
    const IDLE_SYM = 12000; // ms sans action avant la symbiose
    const files = {
      ai: root.dataset.activeInfra, as: root.dataset.activeSupra,
      ii: root.dataset.idleInfra, is: root.dataset.idleSupra, sy: root.dataset.sym,
    };

    root.innerHTML = `
      <div class="synmix__top">
        <button type="button" class="synmix__play" aria-label="Écouter le biome">
          <svg class="i-play" viewBox="0 0 24 24"><path fill="currentColor" d="M6 4v16l14-8z"/></svg>
          <svg class="i-pause" viewBox="0 0 24 24"><path fill="currentColor" d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>
        </button>
        <div class="synmix__head">
          <p class="synmix__title">Le biome sonore</p>
          <p class="synmix__state" aria-live="polite"></p>
        </div>
        <div class="synmix__modes" role="group" aria-label="Présence des visiteurs">
          <button type="button" data-mode="1" aria-pressed="true">Actif</button>
          <button type="button" data-mode="0" aria-pressed="false">Au repos</button>
        </div>
      </div>
      <canvas class="synmix__scope" aria-hidden="true"></canvas>
      <div class="synmix__gauge" role="slider" tabindex="0"
           aria-label="Répartition de l'énergie entre Infra et Supra"
           aria-valuemin="0" aria-valuemax="100">
        <i class="synmix__infra"></i><i class="synmix__supra"></i>
        <b class="synmix__knob"></b>
        <span class="synmix__mid" aria-hidden="true"></span>
      </div>
      <div class="synmix__legend">
        <p><span class="dot dot--infra"></span>Infra <em data-k="infra"></em></p>
        <button type="button" class="synmix__sym">Symbiose</button>
        <p>Supra <em data-k="supra"></em><span class="dot dot--supra"></span></p>
      </div>
      <div class="synmix__timer" aria-hidden="true"><i></i></div>`;

    const $ = (s) => root.querySelector(s);
    const playBtn = $(".synmix__play"), symBtn = $(".synmix__sym"), gauge = $(".synmix__gauge");
    const stateEl = $(".synmix__state"), canvas = $(".synmix__scope"), cx = canvas.getContext("2d");
    const timerBar = $(".synmix__timer i");

    // état : p = part de l'Infra, act = visiteurs connectés, sym = symbiose
    let p = 0.75, target = 0.75, act = 1, sym = 0, symOn = false;
    let lastTouch = performance.now(), playing = false, nodes = null, setupP = null, raf = 0;

    async function setup() {
      const ac = audio();
      const keys = ["ai", "as", "ii", "is", "sy"];
      const bufs = await Promise.all(keys.map((k) => load(files[k])));
      const out = ac.createGain(); out.gain.value = 0; out.connect(ac.destination);
      const g = {}, an = {};
      keys.forEach((k) => { g[k] = ac.createGain(); g[k].gain.value = 0; g[k].connect(out); });
      // analyseurs (affichage seulement) : Infra, Supra, Symbiose
      ["infra", "supra", "sym"].forEach((k) => { an[k] = ac.createAnalyser(); an[k].fftSize = 1024; });
      g.ai.connect(an.infra); g.ii.connect(an.infra);
      g.as.connect(an.supra); g.is.connect(an.supra);
      g.sy.connect(an.sym);
      nodes = { ac, keys, bufs, out, g, an, srcs: null };
    }
    function start() {
      const { ac, keys, bufs, g, out } = nodes;
      const t0 = ac.currentTime + 0.08;
      nodes.srcs = keys.map((k, i) => {
        const s = ac.createBufferSource();
        s.buffer = bufs[i]; s.loop = true;
        s.connect(g[k]); s.start(t0);
        return s;
      });
      out.gain.cancelScheduledValues(ac.currentTime);
      out.gain.setValueAtTime(0, ac.currentTime);
      out.gain.linearRampToValueAtTime(1, t0 + 0.8);
    }
    function stop() {
      const { ac, out } = nodes, srcs = nodes.srcs;
      out.gain.setTargetAtTime(0, ac.currentTime, 0.1);
      setTimeout(() => srcs?.forEach((s) => { try { s.stop(); } catch (e) {} }), 600);
      nodes.srcs = null;
    }


    // volumes seulement : rien d'autre ne touche au son
    function apply() {
      if (!nodes) return;
      const { ac, g } = nodes, T = ac.currentTime, k = 0.12;
      const keep = 1 - sym;
      const v = {
        ai: p * act * keep, as: (1 - p) * act * keep,
        ii: p * (1 - act) * keep, is: (1 - p) * (1 - act) * keep,
        sy: sym,
      };
      for (const key in v) g[key].gain.setTargetAtTime(v[key], T, k);
    }

    const word = (share) => (share > 0.52 ? "saturation" : share < 0.48 ? "absorption" : "équilibre");
    function render() {
      root.style.setProperty("--p", p.toFixed(4));
      root.style.setProperty("--sym", sym.toFixed(3));
      const pi = Math.round(p * 100);
      gauge.setAttribute("aria-valuenow", pi);
      gauge.setAttribute("aria-valuetext", `Infra ${pi} %, Supra ${100 - pi} %`);
      $('[data-k="infra"]').textContent = `${pi} % · ${word(p)}`;
      $('[data-k="supra"]').textContent = `${100 - pi} % · ${word(1 - p)}`;
      stateEl.textContent = symOn ? "Symbiose : les deux strates acceptent leur équilibre"
        : pi >= 99 ? "Infra au maximum" : pi <= 1 ? "Supra au maximum"
        : p > 0.5 ? "L'Infra domine, le Supra absorbe" : p < 0.5 ? "Le Supra domine, l'Infra absorbe" : "Juste milieu";
      root.classList.toggle("is-sym", symOn);
      apply();
    }
    const touch = () => { lastTouch = performance.now(); symOn = false; kick(); };

    const setFromX = (x) => {
      const r = gauge.getBoundingClientRect();
      target = p = clamp((x - r.left) / r.width, 0, 1);
      touch(); render();
    };
    gauge.addEventListener("pointerdown", (e) => { gauge.setPointerCapture(e.pointerId); gauge.classList.add("is-drag"); setFromX(e.clientX); });
    gauge.addEventListener("pointermove", (e) => { if (gauge.hasPointerCapture(e.pointerId)) setFromX(e.clientX); });
    ["pointerup", "pointercancel"].forEach((t) => gauge.addEventListener(t, () => gauge.classList.remove("is-drag")));
    gauge.addEventListener("keydown", (e) => {
      const step = e.shiftKey ? 0.1 : 0.05;
      const m = { ArrowLeft: -step, ArrowDown: -step, ArrowRight: step, ArrowUp: step }[e.key];
      if (m === undefined && e.key !== "Home" && e.key !== "End") return;
      e.preventDefault();
      target = e.key === "Home" ? 0 : e.key === "End" ? 1 : clamp(target + m, 0, 1);
      touch();
    });
    root.querySelectorAll("[data-mode]").forEach((b) => b.addEventListener("click", () => {
      root.querySelectorAll("[data-mode]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      root.dataset.mode = b.dataset.mode;
      touch();
    }));
    root.dataset.mode = "1";
    symBtn.addEventListener("click", () => { symOn = true; target = 0.5; lastTouch = performance.now(); kick(); render(); });

    playBtn.addEventListener("click", async () => {
      if (playing) {
        playing = false; window.__synBusy = false; root.classList.remove("is-playing"); playBtn.setAttribute("aria-label", "Écouter le biome");
        stop(); return;
      }
      hushOthers();
      document.querySelectorAll("video[data-autosound]").forEach((v) => { v.muted = true; });
      root.classList.add("is-loading");
      try {
        await (setupP ||= setup());
        if (nodes.ac.state === "suspended") await nodes.ac.resume();
        playing = true; window.__synBusy = true; lastTouch = performance.now();
        root.classList.add("is-playing"); playBtn.setAttribute("aria-label", "Pause");
        render(); start(); kick();
      } catch (err) {
        setupP = null;
        stateEl.textContent = "Lecture impossible dans ce navigateur.";
      } finally { root.classList.remove("is-loading"); }
    });
    document.addEventListener("play", (e) => { if (playing && !e.target.muted) playBtn.click(); }, true);
    window.addEventListener("synpad", () => { if (playing) playBtn.click(); });

    /* oscilloscope */
    const COL = { infra: "#a77bff", supra: "#63db8e", sym: "#ff8a3d" };
    const buf = new Float32Array(1024);
    function draw() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w) return;
      if (canvas.width !== Math.round(w * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx.clearRect(0, 0, w, h);
      cx.globalCompositeOperation = "lighter";
      const t = performance.now() / 1000;
      const amt = { infra: p * (1 - sym), supra: (1 - p) * (1 - sym), sym };
      for (const k of ["infra", "supra", "sym"]) {
        const live = playing && nodes;
        if (live) nodes.an[k].getFloatTimeDomainData(buf);
        cx.beginPath();
        const N = 180;
        for (let j = 0; j <= N; j++) {
          const x = (j / N) * w;
          const v = live ? buf[Math.floor((j / N) * (buf.length - 1))] * 1.8
            : Math.sin(j * 0.08 + t * (k === "infra" ? 1.2 : k === "supra" ? 0.8 : 0.5)) * 0.07 * amt[k];
          const y = h / 2 + clamp(v, -1, 1) * h * 0.45;
          j ? cx.lineTo(x, y) : cx.moveTo(x, y);
        }
        cx.strokeStyle = COL[k];
        cx.globalAlpha = 0.15 + 0.85 * amt[k];
        cx.lineWidth = 1 + amt[k] * 1.8;
        cx.stroke();
      }
      cx.globalAlpha = 1; cx.globalCompositeOperation = "source-over";
    }

    /* boucle d'animation : lissage, symbiose après un moment sans action */
    function kick() {
      if (raf) return;
      const tick = () => {
        raf = 0;
        const idleFor = performance.now() - lastTouch;
        if (playing && !symOn && idleFor > IDLE_SYM && !gauge.classList.contains("is-drag")) { symOn = true; target = 0.5; }
        const actT = +(root.dataset.mode ?? 1), symT = symOn ? 1 : 0;
        const moving = Math.abs(target - p) > 0.0005 || Math.abs(actT - act) > 0.001 || Math.abs(symT - sym) > 0.001;
        if (moving) {
          p = mix(p, target, 0.1);
          act = mix(act, actT, 0.06);
          sym = mix(sym, symT, symOn ? 0.025 : 0.06);
          render();
        }
        timerBar.style.transform = `scaleX(${playing && !symOn ? clamp(idleFor / IDLE_SYM, 0, 1) : 0})`;
        draw();
        if (playing || moving) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }
    new ResizeObserver(draw).observe(canvas);
    render(); draw();
  }

  /* warp au survol (même effet que le reste du site) */
  const warp = (el, o) => { try { window.makeWarp?.(el, { blur: false, magnet: 0, ...o }); } catch (e) {} };
  document.querySelectorAll(".synrules li").forEach((el) => warp(el, { radius: 170, scale: 70, freq: 0.03 }));
  document.querySelectorAll(".synpads button").forEach((el) => warp(el, { radius: 130, scale: 55, freq: 0.035 }));

  /* vidéo des coulisses : joue toute seule, avec le son si le navigateur le permet */
  document.querySelectorAll("video[data-autosound]").forEach((v) => {
    v.loop = true; v.playsInline = true;
    const hint = v.parentElement.querySelector(".vsound");
    const showHint = () => hint && (hint.hidden = !v.muted);
    hint?.addEventListener("click", () => { v.muted = false; v.play(); showHint(); });
    v.addEventListener("volumechange", showHint);
    new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) { v.pause(); return; }
      v.muted = !!window.__synBusy; // on ne couvre pas le mixeur ou un son du nœud
      v.play().catch(() => { v.muted = true; v.play().catch(() => {}); }).finally(showHint);
    }, { threshold: 0.5 }).observe(v);
  });

  /* ------------------------------------------------------------------------
     2. Les sons du nœud : trois déclencheurs
     <div class="synpads"><button data-src="…" data-loop>…</button>…</div>
     ------------------------------------------------------------------------ */
  document.querySelectorAll(".synpads [data-src]").forEach((btn) => {
    let src = null;
    const off = () => { window.__synBusy = false; btn.classList.remove("is-on"); btn.setAttribute("aria-pressed", "false"); src = null; };
    btn.setAttribute("aria-pressed", "false");
    btn.addEventListener("click", async () => {
      if (src) { try { src.stop(); } catch (e) {} off(); return; }
      hushOthers();
      document.querySelectorAll("video[data-autosound]").forEach((v) => { v.muted = true; });
      window.dispatchEvent(new Event("synpad"));
      btn.classList.add("is-on");
      const ac = audio();
      if (ac.state === "suspended") await ac.resume();
      const b = await load(btn.dataset.src);
      src = ac.createBufferSource();
      src.buffer = b; src.loop = btn.hasAttribute("data-loop");
      src.connect(ac.destination); src.start();
      window.__synBusy = true;
      btn.classList.add("is-on"); btn.setAttribute("aria-pressed", "true");
      const me = src;
      src.onended = () => { if (src === me) off(); };
    });
  });
})();
