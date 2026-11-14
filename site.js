/* ==========================================================================
   Script partagé par toutes les pages
   --------------------------------------------------------------------------
   PROJECTS : la liste de tous les projets. C'est ici qu'on ajoute un projet.
     slug    identifiant court (sert aussi pour les images : assets/thumbs/<img>.jpg)
     yt      identifiant YouTube (aperçu dans le menu + lecteur)
     mp4     vidéo .mp4 (optionnel) — si présent, utilisé à la place de YouTube
     preview petit clip .mp4 muet pour le menu (optionnel, le plus fluide)
     type    "video" | "medium" | "audio"
   ========================================================================== */

const PROJECTS = [
  // L'ordre ici = l'ordre partout (accueil, menu, « projet suivant ») : du plus récent au plus vieux
  { slug: "synapse", title: "Synapse", cat: "Installations interactives", href: "synapse.html", img: "synapse", yt: "GTYOYnzdigc", year: "2026", type: "medium" },
  { slug: "jubile", title: "Le Jubilé", cat: "Marketing", also: ["Design graphique"], href: "jubile.html", img: "jubile", yt: "KdMAZOnvMUk", preview: "assets/video/jubile_cadres.mp4", year: "2026", type: "video" },
  { slug: "specto", title: "SPECTO", cat: "Installations interactives", href: "specto.html", img: "specto", yt: "iqVjYFW3w5A", year: "2025", type: "medium" },
  { slug: "mona", title: "M.O.N.A II", cat: "Installations interactives", href: "Mona.html", img: "mona", year: "2025", type: "medium" },
  { slug: "edria", title: "Edria", cat: "Installations interactives", href: "edria.html", img: "edria", yt: "jD4cE27zTVo", year: "2023", type: "medium" },
  { slug: "floating", title: "Floating On Rocks", cat: "Installations interactives", href: "floating_on_rocks.html", img: "floating", yt: "HeN42N1bFSw", year: "2024", type: "medium" },
  { slug: "reflexion", title: "Réflexion", cat: "Installations interactives", href: "reflexion.html", img: "reflexion", yt: "jlcYcuUHIjQ", year: "2024", type: "medium" },
  { slug: "impressions", title: "Impressions", cat: "Installations interactives", href: "impressions.html", img: "impressions", yt: "_CKtip_CZqU", year: "2024", type: "medium" },
  { slug: "anomalie", title: "Anomalie", cat: "Installations interactives", href: "anomalie.html", img: "anomalie", yt: "JAQpQ-Um8jk", year: "2022", type: "medium" },
  { slug: "requetes", title: "Requêtes Parallèles", cat: "Animation 2D/3D", href: "requetes_paralleles.html", img: "requetes", mp4: "https://video.wixstatic.com/video/0627c0_0d1d6c1f721c4bd7a46ce67d6ee07357/720p/mp4/file.mp4", year: "2025", type: "video" },
  { slug: "echoes", title: "Echoes Within", cat: "Vidéographie", href: "echoes_within.html", img: "echoes", yt: "jqFNszXkwOc", year: "2024", type: "video" },
  { slug: "lunacrim", title: "Lunacrim", cat: "Production musicale", href: "lunacrim.html", img: "lunacrim", year: "2024", type: "audio" },
  { slug: "deluge", title: "Déluge", cat: "Marketing", href: "deluge.html", img: "deluge", yt: "_QQqhYrla_M", year: "2023", type: "video" },
  { slug: "oniria", title: "Oniria", cat: "Production musicale", href: "Oniria.html", img: "oniria", year: "2023", type: "audio" },
  { slug: "youandme", title: "You and Me (Champions of Edria)", cat: "Production musicale", href: "you_and_me.html", img: "youandme", year: "2023", type: "audio" },
  { slug: "cielo", title: "Cielo", cat: "Animation 2D/3D", href: "cielo.html", img: "cielo", yt: "jB-XUsEORJo", year: "2022", type: "video" },
  { slug: "il", title: "Il", cat: "Vidéographie", href: "il.html", img: "il", yt: "5fLxOkyAZWg", year: "2022", type: "video" },
  { slug: "maniac", title: "Maniac", cat: "Vidéographie", href: "maniac.html", img: "maniac", yt: "LvveaRCHk0I", year: "2022", type: "video" },
  { slug: "humain", title: "Humain", cat: "Design graphique", href: "humain.html", img: "humain", year: "2022", type: "medium" },
  { slug: "echec", title: "La partie d'échec", cat: "Design graphique", href: "echec.html", img: "echec", yt: "pvmWcnQOTOg", year: "2022", type: "medium" },
  { slug: "cdi", title: "Summer Recap CDI", cat: "Vidéographie", href: "cdi.html", img: "cdi", yt: "1puzJGAlPdw", year: "2022", type: "video" },
  { slug: "storm", title: "Storm", cat: "Animation 2D/3D", href: "storm.html", img: "storm", yt: "FUjk3KNE17Y", year: "2021", type: "video" },
];

const CONTACT = "mailto:jczephir1+work@gmail.com";
const SOCIALS = [
  ["Instagram", "https://www.instagram.com/real_jc_art/"],
  ["LinkedIn", "https://www.linkedin.com/in/jean-christophe-zephir-ba1202251/"],
  ["SoundCloud", "https://soundcloud.com/jonnyz-king"],
];

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = window.matchMedia("(hover: hover)").matches;
const isExternal = (href) => /^https?:/.test(href);
const ytThumb = (id) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* --------------------------------------------------------------------------
   Texte brouillé
   -------------------------------------------------------------------------- */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function scramble(el, duration = 900) {
  if (!el) return;
  const final = el.dataset.final || el.textContent;
  el.dataset.final = final;
  if (reduceMotion) { el.textContent = final; return; }
  cancelAnimationFrame(el._raf);
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min(1, (now - start) / duration);
    const revealed = Math.floor(p * final.length);
    let out = "";
    for (let i = 0; i < final.length; i++) {
      const ch = final[i];
      out += i < revealed || /[\s©\-'’.(),]/.test(ch) ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out;
    if (p < 1) el._raf = requestAnimationFrame(tick);
  };
  el._raf = requestAnimationFrame(tick);
}

/* --------------------------------------------------------------------------
   Loader « ZEPHIR » — typographie cinétique sur fond noir.
   Les lettres glissent d'une disposition à l'autre (dispersées, en cascade,
   en paires) en s'inclinant pendant le mouvement, puis forment le mot.
   -------------------------------------------------------------------------- */
function runLoader() {
  return new Promise((resolve) => {
    const word = "ZEPHIR";
    const el = document.createElement("div");
    el.className = "ldr";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = `${[...word].map((l) => `<span class="ldr__l">${l}</span>`).join("")}<p class="ldr__count">000</p>`;
    document.body.appendChild(el);
    const letters = [...el.querySelectorAll(".ldr__l")];
    const count = el.querySelector(".ldr__count");

    const W = window.innerWidth, H = window.innerHeight;
    const F = Math.min(H * 0.24, W * 0.15);            // taille des lettres
    el.style.setProperty("--f", `${F}px`);
    const sizes = letters.map((l) => ({ w: l.offsetWidth, h: l.offsetHeight }));

    // Comme chez Mikki Sindhunata : les lettres restent serrées dans un petit
    // rectangle au centre et y échangent leurs places, puis forment le mot.
    // Positions = centre de chaque lettre par rapport au centre de l'écran.
    const cw = Math.max(...sizes.map((s) => s.w)) * 0.98, ch = F * 0.86;
    const g32 = [[-1, -0.5], [0, -0.5], [1, -0.5], [-1, 0.5], [0, 0.5], [1, 0.5]];   // 3 × 2
    const cell = (k) => [g32[k][0] * cw, g32[k][1] * ch];
    const total = sizes.reduce((a, s) => a + s.w, 0) * 0.98;
    let acc = -total / 2;
    const line = sizes.map((s) => { const x = acc + s.w * 0.49; acc += s.w * 0.98; return [x, 0]; });
    // pos[i] = case (0 à 5) de la lettre i dans le rectangle 3 × 2.
    // Trois échanges suffisent pour retrouver ZEP / HIR (1, 2, 3… ZEPHIR)
    const steps = [[0, 2], [1, 4], [3, 5]];
    const pos = [0, 1, 2, 3, 4, 5];
    [...steps].reverse().forEach(([i, j]) => { [pos[i], pos[j]] = [pos[j], pos[i]]; });
    const layouts = [pos.map(cell), line];
    const tf = (i, [x, y], skew = 0) =>
      `translate(${(x - sizes[i].w / 2).toFixed(1)}px, ${(y - sizes[i].h / 2).toFixed(1)}px) skewX(${skew}deg)`;

    letters.forEach((l, i) => { l.style.transform = tf(i, layouts[0][i]); });

    const t0 = performance.now();
    const DUR = reduceMotion ? 1 : 2300;
    (function counter() {
      const p = Math.min(1, (performance.now() - t0) / DUR);
      count.textContent = String(Math.round(p * 100)).padStart(3, "0");
      if (p < 1) requestAnimationFrame(counter);
    })();

    if (reduceMotion) {
      letters.forEach((l, i) => { l.style.transform = tf(i, line[i]); });
      setTimeout(finish, 500);
      return;
    }

    const EASE = "cubic-bezier(.77, 0, .18, 1)";
    function move(from, to, dur, stagger) {
      return Promise.all(letters.map((l, i) => {
        const a = layouts[from][i], b = layouts[to][i];
        const dx = b[0] - a[0];
        const skew = clamp(-dx / cw * 6, -10, 10); // s'incline dans le sens du mouvement
        return l.animate(
          [{ transform: tf(i, a) }, { transform: tf(i, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], skew), offset: 0.5 }, { transform: tf(i, b) }],
          { duration: dur, delay: i * stagger, easing: EASE, fill: "forwards" }
        ).finished;
      }));
    }
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));

    (async () => {
      // apparition, puis trois échanges (deux lettres à la fois)
      await Promise.all(letters.map((l, i) => l.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, delay: i * 25, fill: "both" }).finished));
      const cur = pos.map(cell);
      const swap = (i, j, dur) => {
        [pos[i], pos[j]] = [pos[j], pos[i]];
        const anims = [i, j].map((k) => {
          const a = cur[k], b = cell(pos[k]);
          cur[k] = b;
          return letters[k].animate(
            [{ transform: tf(k, a) }, { transform: tf(k, b) }],
            { duration: dur, easing: "cubic-bezier(.86, 0, .14, 1)", fill: "forwards" }
          ).finished;
        });
        return Promise.all(anims);
      };
      await wait(120);
      for (const [i, j] of steps) {
        await swap(i, j, 380);
        await wait(90);
      }
      await wait(60);
      // ZEP / HIR → ZEPHIR
      await Promise.all(letters.map((l, i) => l.animate(
        [{ transform: tf(i, cur[i]) }, { transform: tf(i, line[i]) }],
        { duration: 430, delay: i * 12, easing: "cubic-bezier(.86, 0, .14, 1)", fill: "forwards" }
      ).finished));
      await wait(200);
      finish();
    })();

    function finish() {
      el.classList.add("is-out");
      resolve();
      setTimeout(() => el.remove(), 1250);
    }
  });
}

/* --------------------------------------------------------------------------
   Menu plein écran avec aperçu vidéo flouté au survol
   -------------------------------------------------------------------------- */
function buildMenu() {
  const here = location.pathname.split("/").pop() || "index.html";
  const btn = document.createElement("button");
  btn.className = "mbtn";
  btn.type = "button";
  btn.setAttribute("aria-label", "Ouvrir le menu");
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-controls", "site-menu");
  btn.innerHTML = "<span></span><span></span>";

  const nav = document.createElement("nav");
  nav.className = "mnu";
  nav.id = "site-menu";
  nav.setAttribute("aria-label", "Menu");
  const link = (href, label, cls = "") =>
    `<a href="${href}" class="${cls}" ${href === here ? 'aria-current="page"' : ""}>${label}</a>`;
  nav.innerHTML = `
    <div class="mnu__top">
      <a href="index.html" class="mnu__logo">ZEPHIR</a>
      <div class="mnu__links">
        ${link("index.html", "Accueil")}
        ${link("aboutme.html", "Qui suis-je ?")}
        ${link(CONTACT, "Travaillons ensemble", "is-hl")}
      </div>
    </div>
    <div class="mnu__filters filters"></div>
    <div class="mnu__body">
      <div class="mnu__head" aria-hidden="true"><span>N°</span><span>Projet</span><span>Catégorie</span><span style="text-align:right">Année</span></div>
      ${PROJECTS.map((p, i) => `
        <a class="mnu__row" href="${p.href}" data-i="${i}">
          <span class="n">${String(i + 1).padStart(2, "0")}</span>
          <span class="t">${p.title}</span>
          <span class="c">${p.cat}</span>
          <span class="y">${p.year || "—"}</span>
        </a>`).join("")}
      <div class="mnu__preview" aria-hidden="true"><img alt=""><div class="vid"></div></div>
    </div>
    <div class="mnu__foot">
      <a href="${CONTACT}">jczephir1+work@gmail.com</a>
      <span>${SOCIALS.map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${n}</a>`).join(' <span class="sep">|</span> ')}</span>
    </div>`;

  document.body.append(nav, btn);

  // Pour que les vidéos YouTube de l'aperçu démarrent plus vite :
  // on ouvre la connexion dès que le menu s'ouvre (une seule fois)
  let warmed = false;
  const warm = () => {
    if (warmed || !canHover) return;
    warmed = true;
    ["https://www.youtube-nocookie.com", "https://www.youtube.com", "https://i.ytimg.com", "https://www.google.com"].forEach((h) => {
      const l = document.createElement("link");
      l.rel = "preconnect";
      l.href = h;
      l.crossOrigin = "";
      document.head.appendChild(l);
    });
  };
  btn.addEventListener("pointerenter", warm, { once: true });
  const open = (on) => {
    if (on) warm();
    document.documentElement.classList.toggle("menu-open", on);
    btn.setAttribute("aria-expanded", String(on));
    btn.setAttribute("aria-label", on ? "Fermer le menu" : "Ouvrir le menu");
    if (on) nav.querySelector(".mnu__row")?.focus({ preventScroll: true });
    else { hidePreview(); }
  };
  btn.addEventListener("click", () => open(!document.documentElement.classList.contains("menu-open")));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") open(false); });
  document.querySelectorAll("[data-open-menu]").forEach((b) => b.addEventListener("click", () => open(true)));

  // --- aperçu ---
  const body = nav.querySelector(".mnu__body");
  const prev = nav.querySelector(".mnu__preview");
  const img = prev.querySelector("img");
  const vid = prev.querySelector(".vid");
  let active = null;
  let vidTimer = null;
  let ytWatch = null;
  window.addEventListener("message", (e) => {
    if (!ytWatch || e.source !== ytWatch.contentWindow) return;
    let data;
    try { data = typeof e.data === "string" ? JSON.parse(e.data) : e.data; } catch (err) { return; }
    const state = data?.info?.playerState;
    if (state === 1) setTimeout(revealVid, 120);
  });

  // Effet « flou → net » rejoué à chaque nouveau projet survolé
  const EASE = "cubic-bezier(.16, 1, .3, 1)";
  let prevAnim = null, vidAnim = null;
  function blurIn(el, peak = 0.9, dur = 950) {
    return el.animate(
      [
        { opacity: 0, filter: "blur(30px)", scale: "1.1" },
        { opacity: peak, filter: "blur(0px)", scale: "1" },
      ],
      { duration: reduceMotion ? 1 : dur, easing: EASE, fill: "forwards" }
    );
  }
  function revealVid() {
    vidAnim?.cancel();
    vidAnim = blurIn(vid, 1, 600);
  }

  // Texte : réagit tout de suite
  let lit = null;
  function highlight(row) {
    if (row === lit) return;
    lit?.classList.remove("is-active");
    lit = row;
    row.classList.add("is-active");
    body.classList.add("is-hovering");
    scramble(row.querySelector(".t"), 450);
    scramble(row.querySelector(".c"), 400);
    scramble(row.querySelector(".y"), 350);
  }
  // Image/vidéo de fond : après un court délai (« attaque »)
  function showPreview(row) {
    highlight(row);
    if (row === active) return;
    active = row;
    const p = PROJECTS[+row.dataset.i];

    img.src = `assets/thumbs/${p.img}.jpg`;
    prevAnim?.cancel();
    prevAnim = blurIn(prev);

    clearTimeout(vidTimer);
    vidAnim?.cancel();
    vid.innerHTML = "";
    if (!canHover) return;
    vidTimer = setTimeout(() => {
      const src = p.preview || p.mp4;
      if (src) {
        vid.innerHTML = `<video src="${src}" muted autoplay loop playsinline></video>`;
        vid.querySelector("video").addEventListener("playing", revealVid, { once: true });
      } else if (p.yt) {
        const q = `autoplay=1&mute=1&controls=0&loop=1&playlist=${p.yt}&modestbranding=1&playsinline=1&rel=0&disablekb=1&iv_load_policy=3&start=6&enablejsapi=1&origin=${encodeURIComponent(location.origin)}`;
        vid.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${p.yt}?${q}" allow="autoplay; encrypted-media" tabindex="-1" title=""></iframe>`;
        // On ne révèle la vidéo que quand YouTube confirme qu'elle joue
        // (sinon l'image reste affichée — pas d'écran noir ni de logo YouTube)
        const frame = vid.querySelector("iframe");
        frame.addEventListener("load", () => {
          frame.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: "mnu" }), "*");
        }, { once: true });
        ytWatch = frame;
      }
    }, 40);
  }
  function hidePreview() {
    clearTimeout(vidTimer);
    lit?.classList.remove("is-active");
    lit = null;
    active = null;
    body.classList.remove("is-hovering");
    vidAnim?.cancel();
    if (prevAnim) {
      const out = prev.animate([{ opacity: 0, filter: "blur(20px)" }], { duration: 350, easing: "ease", fill: "forwards" });
      out.onfinish = () => { prevAnim?.cancel(); out.cancel(); };
    }
    setTimeout(() => { if (!active) vid.innerHTML = ""; }, 400);
  }
  // « Attaque » : l'aperçu n'apparaît que si la souris reste un instant sur la ligne.
  // En balayant vite la liste, rien ne s'affiche.
  const ATTACK = 70; // ms
  let attackTimer = null;
  nav.querySelectorAll(".mnu__row").forEach((row) => {
    row.addEventListener("mouseenter", () => {
      highlight(row);
      clearTimeout(attackTimer);
      attackTimer = setTimeout(() => showPreview(row), ATTACK);
    });
    row.addEventListener("mouseleave", () => clearTimeout(attackTimer));
    row.addEventListener("focus", () => showPreview(row));
  });
  body.addEventListener("mouseleave", () => { clearTimeout(attackTimer); hidePreview(); });

  // --- filtres catégorie + année dans le menu ---
  const filters = createFilters(nav.querySelector(".mnu__filters"), (cat, year) => {
    nav.querySelectorAll(".mnu__row").forEach((row) => {
      const p = PROJECTS[+row.dataset.i];
      row.hidden = !matches(p, cat, year);
    });
  });
  filters.apply();
}

/* --------------------------------------------------------------------------
   Filtres réutilisables : catégorie + année
   -------------------------------------------------------------------------- */
const ALL_CATS = "Tout";
const ALL_YEARS = "Toutes";
const matches = (p, cat, year) => (cat === ALL_CATS || p.cat === cat || (p.also || []).includes(cat)) && (year === ALL_YEARS || p.year === year);

function createFilters(root, onChange, initial = {}) {
  const CAT_ORDER = ["Vidéographie", "Marketing", "Production musicale", "Design graphique", "Animation 2D/3D", "Installations interactives"];
  const cats = [ALL_CATS, ...new Set([...CAT_ORDER, ...PROJECTS.map((p) => p.cat)])];
  const years = [ALL_YEARS, ...[...new Set(PROJECTS.map((p) => p.year).filter(Boolean))].sort((a, b) => b - a)];
  let cat = cats.includes(initial.cat) ? initial.cat : ALL_CATS;
  let year = years.includes(initial.year) ? initial.year : ALL_YEARS;
  const chip = (kind, v) => `<button type="button" class="filter" data-${kind}="${v}" aria-pressed="false">${v}<sup></sup></button>`;
  root.innerHTML = `
    <div class="filters__group" role="group" aria-label="Catégorie">${cats.map((c) => chip("cat", c)).join("")}</div>
    <div class="filters__group" role="group" aria-label="Année"><span class="filters__label">Année</span>${years.map((y) => chip("year", y)).join("")}</div>`;

  function refresh() {
    root.querySelectorAll("[data-cat]").forEach((b) => {
      const n = PROJECTS.filter((p) => matches(p, b.dataset.cat, year)).length;
      b.setAttribute("aria-pressed", String(b.dataset.cat === cat));
      b.querySelector("sup").textContent = n;
      b.disabled = n === 0 && b.dataset.cat !== cat;
    });
    root.querySelectorAll("[data-year]").forEach((b) => {
      const n = PROJECTS.filter((p) => matches(p, cat, b.dataset.year)).length;
      b.setAttribute("aria-pressed", String(b.dataset.year === year));
      b.querySelector("sup").textContent = n;
      b.disabled = n === 0 && b.dataset.year !== year;
    });
  }
  root.addEventListener("click", (e) => {
    const b = e.target.closest(".filter");
    if (!b || b.disabled) return;
    if (b.dataset.cat) cat = b.dataset.cat;
    if (b.dataset.year) year = b.dataset.year;
    refresh();
    onChange(cat, year, true);
  });
  return {
    apply() { refresh(); onChange(cat, year, false); },
    get state() { return { cat, year }; },
  };
}

/* --------------------------------------------------------------------------
   Bande 3D — ondulation liée à la vitesse, avec rebond (ressorts)
   options :
     items       [{ title, cat, href?, src }]
     wheel       true : la molette fait défiler la bande (accueil)
     scroll      true : le défilement de la page fait bouger la bande (coulisses)
     lightbox    true : clic = agrandir l'image au lieu d'ouvrir un lien
     cta         texte de l'étiquette qui suit la souris
     heights     hauteurs relatives des cartes
     width       fonction qui renvoie la largeur d'une carte
   -------------------------------------------------------------------------- */
function createStrip(root, opts) {
  const o = Object.assign({
    wheel: false, scroll: false, lightbox: false, cta: "Voir le projet",
    heights: [0.72, 0.9, 0.62, 0.84, 0.97, 0.68, 0.8, 0.6, 0.92, 0.75],
    width: () => (window.innerWidth <= 760 ? window.innerWidth * 0.56 : clamp(window.innerWidth * 0.2, 220, 420)),
    labelSpace: 58,
  }, opts);

  const track = document.createElement("div");
  track.className = "strip__track";
  root.appendChild(track);

  // Filtre SVG de flou horizontal (motion blur)
  const blurId = `mblur-${Math.random().toString(36).slice(2, 7)}`;
  root.insertAdjacentHTML("beforeend",
    `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="${blurId}" x="-15%" y="0" width="130%" height="100%"><feGaussianBlur stdDeviation="0 0"/></filter></svg>`);
  const blurNode = root.querySelector(`#${blurId} feGaussianBlur`);
  track.style.setProperty("--mblur", `url(#${blurId})`);
  let blurAmt = 0, blurOn = false;
  let cta = document.querySelector(".cta");
  if (!cta) {
    cta = document.createElement("div");
    cta.className = "cta";
    cta.setAttribute("aria-hidden", "true");
    document.body.appendChild(cta);
  }

  let items = [];
  let cards = [];
  let springs = [];
  let imgs = [];
  let lefts = [];
  let loopWidth = 0;
  let cardW = 0;
  let widths = [];
  let offset = 0;
  let velocity = 0;
  const hist = new Array(40).fill(0);
  let dragging = false, dragStartX = 0, dragLastX = 0, dragMoved = 0;
  let hovering = false;
  let hovered = null;
  const AUTO = reduceMotion ? 0 : 0.45;

  function cardHTML(p, i, clone) {
    const ext = p.href && isExternal(p.href);
    const tag = p.href && !o.lightbox ? "a" : "button";
    const attrs = tag === "a"
      ? `href="${p.href}" ${ext ? 'target="_blank" rel="noopener"' : ""}`
      : `type="button" data-full="${p.full || p.src}"`;
    return `
      <${tag} class="card" ${attrs} ${clone ? 'aria-hidden="true" tabindex="-1"' : ""} style="--delay:${(i % 10) * 0.085}s;--tilt:${i % 2 ? 6 : -6}deg">
        <div class="card__media">
          <div class="card__img"><img src="${p.src}" alt="${clone ? "" : p.title}" loading="${clone ? "lazy" : "eager"}" decoding="async" draggable="false"></div>
          <div class="card__info">
            <p class="card__title">${p.title}</p>
            <p class="card__cat">${p.cat || ""}</p>
          </div>
        </div>
      </${tag}>`;
  }

  function build(list, animate) {
    items = list;
    const copies = Math.max(2, Math.ceil((window.innerWidth * 2) / (o.width() * Math.max(1, items.length))) + 1);
    let html = "";
    for (let c = 0; c < copies; c++) html += items.map((p, i) => cardHTML(p, i, c > 0)).join("");
    if (animate) track.classList.add("is-entering");
    track.innerHTML = html;
    cards = [...track.querySelectorAll(".card")];
    springs = cards.map(() => ({ y: 0, vy: 0, lift: 0, r: 0, dof: -1 }));
    imgs = cards.map((c) => c.querySelector(".card__img"));
    cards.forEach((card, idx) => {
      card.addEventListener("focus", () => {
        scramble(card.querySelector(".card__title"), 500);
        const r = card.getBoundingClientRect();
        if (r.left < 0 || r.right > window.innerWidth) offset += r.left - window.innerWidth * 0.3;
      });
      card.addEventListener("mouseenter", () => { hovered = idx; });
      card.addEventListener("mouseleave", () => { if (hovered === idx) hovered = null; });
    });
    // Quand une image arrive, on connaît sa vraie forme : on remet la bande en page
    let relayout = 0;
    cards.slice(0, items.length).forEach((card) => {
      const im = card.querySelector("img");
      if (!im.complete) im.addEventListener("load", () => {
        cancelAnimationFrame(relayout);
        relayout = requestAnimationFrame(layout);
      }, { once: true });
    });
    layout();
    if (animate) {
      offset = 0;
      void track.offsetHeight;
      requestAnimationFrame(() => { track.classList.remove("is-entering"); distortIn(); });
    }
  }

  /* Apparition : chaque image visible arrive très déformée (vagues de
     bruit) et se « remet en place » en même temps qu'elle se dévoile. */
  const dFilters = [];
  function distortFilter(n) {
    if (dFilters[n]) return dFilters[n];
    const id = `cd${fxN++}`;
    fxSvg().insertAdjacentHTML("beforeend", `
      <filter id="${id}" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.022" numOctaves="2" seed="${(Math.random() * 99) | 0}" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G"/>
      </filter>`);
    const f = fxDefs.querySelector(`#${id}`);
    return (dFilters[n] = { id, disp: f.querySelector("feDisplacementMap"), turb: f.querySelector("feTurbulence") });
  }
  function distortIn() {
    if (reduceMotion || !document.body.classList.contains("is-ready")) return;
    const vw = window.innerWidth;
    const list = [];
    cards.forEach((card, i) => {
      const r = card.getBoundingClientRect();
      if (r.right < -50 || r.left > vw + 50 || list.length >= 14) return;
      const f = distortFilter(list.length);
      const img = card.querySelector("img");
      const delay = parseFloat(card.style.getPropertyValue("--delay")) * 1000 || 0;
      img.style.filter = `url(#${f.id})`;
      f.disp.setAttribute("scale", "220");
      list.push({ img, f, delay });
    });
    const t0 = performance.now(), D = 1700;
    const step = (now) => {
      let alive = false;
      for (const it of list) {
        const p = clamp((now - t0 - it.delay) / D, 0, 1);
        const e = 1 - Math.pow(1 - p, 3);
        it.f.disp.setAttribute("scale", (220 * (1 - e)).toFixed(1));
        it.f.turb.setAttribute("baseFrequency", `${(0.008 + 0.01 * (1 - e)).toFixed(4)} ${(0.022 - 0.01 * e).toFixed(4)}`);
        if (p < 1) alive = true;
        else if (it.img.style.filter) it.img.style.filter = "";
      }
      if (alive) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  // première apparition : quand la page passe en « prête »
  new MutationObserver((m, mo) => {
    if (document.body.classList.contains("is-ready")) { mo.disconnect(); distortIn(); }
  }).observe(document.body, { attributes: true, attributeFilter: ["class"] });

  // Chaque carte prend la forme de son image (largeur / hauteur réelles).
  // La surface reste à peu près la même d'une carte à l'autre : une image
  // verticale est plus haute et plus étroite, une panoramique plus large.
  const ratioOf = (n) => {
    const p = items[n];
    if (p.ratio) return p.ratio;
    const im = imgs[n]?.querySelector("img");
    return im && im.naturalWidth ? im.naturalWidth / im.naturalHeight : 1.5;
  };
  function layout() {
    if (!cards.length) return;
    const available = root.clientHeight - o.labelSpace * 2;
    cardW = o.width();
    const area = cardW * available * 0.78;
    widths = cards.map((card, i) => {
      const n = i % items.length;
      const r = ratioOf(n);
      const k = Math.sqrt(o.heights[n % o.heights.length] / 0.8);
      let h = Math.sqrt(area / r) * k;
      h = clamp(h, 120, available);
      const w = Math.min(h * r, cardW * 2.2);
      h = w / r;
      card.style.setProperty("--w", `${w.toFixed(1)}px`);
      card.style.setProperty("--h", `${h.toFixed(1)}px`);
      return w;
    });
    lefts = cards.map((c) => c.offsetLeft);
    loopWidth = cards[items.length] ? cards[items.length].offsetLeft - cards[0].offsetLeft : track.scrollWidth;
  }

  // --- entrées : molette, défilement de page, glisser ---
  if (o.wheel) {
    window.addEventListener("wheel", (e) => {
      if (document.documentElement.classList.contains("menu-open")) return;
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      velocity = clamp(velocity + d * 0.07, -45, 45);
    }, { passive: true });
  }
  if (o.scroll) {
    let lastY = window.scrollY;
    window.addEventListener("scroll", () => {
      const d = window.scrollY - lastY;
      lastY = window.scrollY;
      const r = root.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) velocity += d * 0.18;
    }, { passive: true });
  }
  root.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    dragging = true;
    dragStartX = dragLastX = e.clientX;
    dragMoved = 0;
  });
  window.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragLastX;
    dragLastX = e.clientX;
    dragMoved = Math.abs(e.clientX - dragStartX);
    if (dragMoved > 6) root.classList.add("is-dragging");
    offset -= dx;
    velocity = -dx * 0.6;
  });
  window.addEventListener("pointerup", () => { dragging = false; root.classList.remove("is-dragging"); });
  track.addEventListener("click", (e) => {
    if (dragMoved > 6) { e.preventDefault(); e.stopPropagation(); dragMoved = 0; return; }
    const b = e.target.closest("button.card");
    if (b && o.lightbox) openLightbox(b.dataset.full, b.querySelector("img").alt);
  }, true);

  // --- survol : étiquette + titre brouillé ---
  let current = null;
  root.addEventListener("pointermove", (e) => {
    cta.textContent = o.cta;
    cta.style.translate = `${e.clientX}px ${e.clientY}px`;
    const card = e.target.closest(".card");
    cta.classList.toggle("is-on", !!(card && e.target.closest(".card__img")) && !dragging);
    if (card !== current) {
      current = card;
      if (card) {
        scramble(card.querySelector(".card__title"), 500);
        scramble(card.querySelector(".card__cat"), 400);
      }
    }
  });
  root.addEventListener("pointerenter", () => { hovering = true; });
  root.addEventListener("pointerleave", () => { hovering = false; current = null; hovered = null; cta.classList.remove("is-on"); });

  // --- boucle d'animation ---
  // Hors de l'écran (ex. coulisses en bas de page) : on ne calcule rien
  let onScreen = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((en) => { onScreen = en[0].isIntersecting; }, { rootMargin: "200px" }).observe(root);
  }
  function frame() {
    if (!onScreen) { requestAnimationFrame(frame); return; }
    if (!dragging) {
      offset += (hovering ? AUTO * 0.25 : AUTO) + velocity;
      velocity *= 0.94;
    }
    hist.unshift(velocity);
    hist.length = 40;

    if (loopWidth) {
      const x = -(((offset % loopWidth) + loopWidth) % loopWidth);
      track.style.transform = `translate3d(${x}px,0,0)`;
      const vw = window.innerWidth;
      for (let i = 0; i < cards.length; i++) {
        const cw = widths[i] || cardW;
        const sx = lefts[i] + x + cw / 2;
        if (sx < -cw || sx > vw + cw) continue;
        const t = clamp(sx / vw, 0, 1);
        const s = springs[i];
        // la vitesse "arrive" plus tard sur les cartes de droite → vague
        const v = hist[Math.round(t * 30)] || 0;
        // Ressort très doux : petite amplitude, beaucoup d'amortissement
        const target = clamp(v * 0.5, -20, 20);
        s.vy = (s.vy + (target - s.y) * 0.03) * 0.86;
        s.y += s.vy;
        s.lift += ((hovered === i ? 1 : 0) - s.lift) * 0.08;
        const rotY = (t - 0.5) * -16;              // plans inclinés vers le centre
        const rotX = clamp(-s.vy * 0.35, -2.5, 2.5); // légère bascule
        const rotZ = clamp(s.vy * 0.05, -0.6, 0.6);
        // Profondeur de champ : les cartes vers les bords reculent et deviennent floues
        const d = Math.abs(t - 0.5) * 2;
        const z = -d * d * 160 + s.lift * 70;
        // courbe raide : presque net au milieu, plein flou seulement tout au bord
        const edge = Math.max(0, (d - 0.28) / 0.72);
        const dof = hovered === i ? 0 : edge * edge * edge * 3;
        if (Math.abs(dof - s.dof) > 0.05) {
          s.dof = dof;
          imgs[i].style.setProperty("--dof", `${dof.toFixed(2)}px`);
        }
        cards[i].firstElementChild.style.transform =
          `translate3d(0,${s.y.toFixed(2)}px,${z.toFixed(1)}px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg)`;
      }
    }

    // Flou de mouvement horizontal selon la vitesse
    const want = reduceMotion ? 0 : clamp(Math.abs(velocity) * 0.25, 0, 7);
    blurAmt += (want - blurAmt) * 0.18;
    if (blurAmt > 0.35) {
      blurNode.setAttribute("stdDeviation", `${blurAmt.toFixed(2)} 0`);
      if (!blurOn) { track.classList.add("is-blurring"); blurOn = true; }
    } else if (blurOn) {
      track.classList.remove("is-blurring");
      blurOn = false;
    }
    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", layout);
  requestAnimationFrame(frame);
  return { build, layout };
}

/* --------------------------------------------------------------------------
   Lecteur vidéo : image + bouton lecture → vidéo
   <div class="player" data-yt="ID" data-poster="..."></div>
   <div class="player" data-mp4="..." data-poster="..."></div>
   -------------------------------------------------------------------------- */
const PLAY_HTML = `
  <span class="play" aria-hidden="true">
    <svg class="ring" viewBox="0 0 100 100"><defs><path id="pr" d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0"/></defs>
      <text><textPath href="#pr">Lecture · Regarder · Lecture · Regarder ·</textPath></text></svg>
    <svg class="tri" viewBox="0 0 24 24"><path fill="currentColor" d="M5 3.5v17l15-8.5z"/></svg>
  </span>`;

function initPlayers(scope = document) {
  scope.querySelectorAll(".player:not([data-ready])").forEach((el) => {
    el.dataset.ready = "1";
    const yt = el.dataset.yt;
    const mp4 = el.dataset.mp4;
    const poster = el.dataset.poster || (yt ? ytThumb(yt) : "");
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.setAttribute("aria-label", el.dataset.label || "Lire la vidéo");
    el.insertAdjacentHTML("afterbegin", `${poster ? `<img src="${poster}" alt="" loading="lazy">` : ""}${PLAY_HTML}`);
    const img = el.querySelector("img");
    if (img && yt && !el.dataset.poster) img.addEventListener("error", () => { img.src = `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`; }, { once: true });

    // Le bouton suit doucement la souris
    if (canHover && !reduceMotion) {
      el.addEventListener("pointermove", (e) => {
        if (el.classList.contains("is-playing")) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--px", `${e.clientX - r.left}px`);
        el.style.setProperty("--py", `${e.clientY - r.top}px`);
      });
      el.addEventListener("pointerleave", () => { el.style.removeProperty("--px"); el.style.removeProperty("--py"); });
    }

    const play = () => {
      if (el.classList.contains("is-playing")) return;
      el.classList.add("is-playing");
      el.removeAttribute("role");
      el.removeAttribute("tabindex");
      if (mp4) {
        el.insertAdjacentHTML("beforeend", `<video src="${mp4}" controls autoplay playsinline style="position:absolute;inset:0;width:100%;height:100%;background:#000"></video>`);
      } else if (yt) {
        el.insertAdjacentHTML("beforeend",
          `<iframe src="https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0&modestbranding=1&playsinline=1" title="Vidéo" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`);
      }
    };
    el.addEventListener("click", play);
    el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); } });
    el._play = play;
  });
  document.querySelectorAll("[data-play]").forEach((b) => b.addEventListener("click", () => {
    const target = document.querySelector(b.dataset.play);
    target?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    setTimeout(() => target?._play?.(), 500);
  }));
}

/* --------------------------------------------------------------------------
   Barre de progression : cliquer OU glisser pour avancer/reculer.
   Flèches ← → au clavier quand la barre a le focus.
   -------------------------------------------------------------------------- */
function makeScrubber(bar, onSeek, onStep) {
  bar.setAttribute("role", "slider");
  bar.setAttribute("tabindex", "0");
  bar.setAttribute("aria-label", "Position dans la piste");
  const ratioAt = (x) => { const r = bar.getBoundingClientRect(); return clamp((x - r.left) / r.width, 0, 1); };
  let drag = false;
  bar.addEventListener("pointerdown", (e) => {
    drag = true;
    bar.setPointerCapture(e.pointerId);
    bar.classList.add("is-scrubbing");
    onSeek(ratioAt(e.clientX), false);
  });
  bar.addEventListener("pointermove", (e) => { if (drag) onSeek(ratioAt(e.clientX), false); });
  const end = (e) => {
    if (!drag) return;
    drag = false;
    bar.classList.remove("is-scrubbing");
    onSeek(ratioAt(e.clientX), true);
  };
  bar.addEventListener("pointerup", end);
  bar.addEventListener("pointercancel", end);
  bar.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); onStep(5); }
    if (e.key === "ArrowLeft") { e.preventDefault(); onStep(-5); }
  });
}
const SKIP_ICONS = {
  back: `<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4"/><text x="12" y="15.5" text-anchor="middle" font-size="7" font-family="sans-serif" fill="currentColor" stroke="none">10</text></svg>`,
  fwd: `<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M20 12a8 8 0 1 1-2.4-5.7M20 4v4h-4"/><text x="12" y="15.5" text-anchor="middle" font-size="7" font-family="sans-serif" fill="currentColor" stroke="none">10</text></svg>`,
};

/* --------------------------------------------------------------------------
   Pistes audio : <div class="track" data-src="fichier.mp3" data-title="Titre"></div>
   -------------------------------------------------------------------------- */
const fmt = (s) => (isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");
const ICONS = `<svg class="i-play" viewBox="0 0 24 24"><path fill="currentColor" d="M6 4v16l14-8z"/></svg><svg class="i-pause" viewBox="0 0 24 24"><path fill="currentColor" d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>`;
function initTracks(scope = document) {
  scope.querySelectorAll(".track[data-src]:not([data-ready])").forEach((el) => {
    el.dataset.ready = "1";
    const audio = new Audio();
    audio.preload = "metadata";
    audio.src = el.dataset.src;
    el.innerHTML = `
      <div class="track__disc" aria-hidden="true"></div>
      <div class="track__mid">
        <p class="track__title">${el.dataset.title || "Écouter"}</p>
        <div class="track__bar"><i></i><b></b></div>
        <p class="track__time"><span class="cur">0:00</span> / <span class="dur">—</span></p>
      </div>
      <div class="track__ctrls">
        <button type="button" class="skip" data-skip="-10" aria-label="Reculer de 10 secondes">${SKIP_ICONS.back}</button>
        <button type="button" class="track__btn" aria-label="Lecture">${ICONS}</button>
        <button type="button" class="skip" data-skip="10" aria-label="Avancer de 10 secondes">${SKIP_ICONS.fwd}</button>
      </div>`;
    const btn = el.querySelector(".track__btn");
    const bar = el.querySelector(".track__bar");
    const fill = bar.querySelector("i");
    const knob = bar.querySelector("b");
    const show = (t) => {
      const r = audio.duration ? t / audio.duration : 0;
      fill.style.width = `${r * 100}%`;
      knob.style.left = `${r * 100}%`;
      el.querySelector(".cur").textContent = fmt(t);
      bar.setAttribute("aria-valuenow", Math.round(r * 100));
    };
    const pauseOthers = () => {
      document.querySelectorAll("audio, video").forEach((m) => m !== audio && m.pause());
      window.__tracks?.forEach((a) => a !== audio && a.pause());
    };
    btn.addEventListener("click", () => {
      if (audio.paused) { pauseOthers(); audio.play(); } else audio.pause();
    });
    el.querySelectorAll(".skip").forEach((b) => b.addEventListener("click", () => {
      audio.currentTime = clamp(audio.currentTime + +b.dataset.skip, 0, audio.duration || 0);
      show(audio.currentTime);
    }));
    (window.__tracks ||= []).push(audio);
    audio.addEventListener("play", () => { el.classList.add("is-playing"); btn.setAttribute("aria-label", "Pause"); });
    audio.addEventListener("pause", () => { el.classList.remove("is-playing"); btn.setAttribute("aria-label", "Lecture"); });
    audio.addEventListener("loadedmetadata", () => { el.querySelector(".dur").textContent = fmt(audio.duration); });
    audio.addEventListener("timeupdate", () => { if (!bar.classList.contains("is-scrubbing")) show(audio.currentTime); });
    makeScrubber(bar,
      (r) => { if (audio.duration) { audio.currentTime = r * audio.duration; show(audio.currentTime); } },
      (d) => { audio.currentTime = clamp(audio.currentTime + d, 0, audio.duration || 0); show(audio.currentTime); });
  });
}

/* Même lecteur, mais la source est une piste ou une playlist SoundCloud :
   <div class="track" data-soundcloud="https://soundcloud.com/..." data-title="..."></div>
   (le script SoundCloud n'est chargé que si la page en contient un) */
let scApi = null;
function loadScApi() {
  return scApi ||= new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = "https://w.soundcloud.com/player/api.js";
    s.onload = res;
    s.onerror = rej;
    document.head.appendChild(s);
  });
}
function initScTracks(scope = document) {
  scope.querySelectorAll(".track[data-soundcloud]:not([data-ready])").forEach((el) => {
    el.dataset.ready = "1";
    el.classList.add("track--sc");
    el.innerHTML = `
      <div class="track__disc" aria-hidden="true"></div>
      <div class="track__mid">
        <p class="track__title">${el.dataset.title || "Écouter"}</p>
        <p class="track__now">Chargement…</p>
        <div class="track__bar"><i></i><b></b></div>
        <p class="track__time"><span class="cur">0:00</span> / <span class="dur">—</span></p>
      </div>
      <div class="track__ctrls">
        <button type="button" class="skip" data-skip="-10" aria-label="Reculer de 10 secondes">${SKIP_ICONS.back}</button>
        <button type="button" class="track__btn" aria-label="Lecture" disabled>${ICONS}</button>
        <button type="button" class="skip" data-skip="10" aria-label="Avancer de 10 secondes">${SKIP_ICONS.fwd}</button>
      </div>
      <ol class="track__list"></ol>
      <div class="track__engine" aria-hidden="true"></div>`;
    const btn = el.querySelector(".track__btn");
    const bar = el.querySelector(".track__bar");
    const fill = bar.querySelector("i");
    const knob = bar.querySelector("b");
    const now = el.querySelector(".track__now");
    const list = el.querySelector(".track__list");
    let dur = 0, pos = 0, w = null;
    const show = (t) => {
      pos = t;
      const r = dur ? t / dur : 0;
      fill.style.width = `${r * 100}%`;
      knob.style.left = `${r * 100}%`;
      el.querySelector(".cur").textContent = fmt(t);
    };
    const start = () => {
      if (w) return;
      const url = encodeURIComponent(el.dataset.soundcloud);
      el.querySelector(".track__engine").innerHTML =
        `<iframe allow="autoplay" title="SoundCloud" src="https://w.soundcloud.com/player/?url=${url}&auto_play=false&visual=false&show_comments=false"></iframe>`;
      loadScApi().then(() => {
        w = SC.Widget(el.querySelector("iframe"));
        const E = SC.Widget.Events;
        const refresh = () => {
          w.getCurrentSound((snd) => { if (snd) now.textContent = snd.title; });
          w.getDuration((d) => { dur = d / 1000; el.querySelector(".dur").textContent = fmt(dur); });
          w.getCurrentSoundIndex((i) => list.querySelectorAll("button").forEach((b, k) => b.setAttribute("aria-current", String(k === i))));
        };
        w.bind(E.READY, () => {
          w.getSounds((snds) => {
            if (!snds?.length) {
              // playlist vide ou pistes privées : on renvoie vers SoundCloud
              now.innerHTML = `Pistes bientôt disponibles — <a href="${el.dataset.link || el.dataset.soundcloud}" target="_blank" rel="noopener">SoundCloud ↗</a>`;
              return;
            }
            btn.disabled = false;
            if (snds.length > 1) {
              list.innerHTML = snds.map((x, i) => `<li><button type="button" data-i="${i}"><span>${String(i + 1).padStart(2, "0")}</span><span>${x.title || `Piste ${i + 1}`}</span><span>${x.duration ? fmt(x.duration / 1000) : ""}</span></button></li>`).join("");
            }
            refresh();
          });
        });
        w.bind(E.PLAY, () => {
          document.querySelectorAll("audio, video").forEach((m) => m.pause());
          window.__tracks?.forEach((a) => a.pause());
          el.classList.add("is-playing"); btn.setAttribute("aria-label", "Pause"); refresh();
        });
        w.bind(E.PAUSE, () => { el.classList.remove("is-playing"); btn.setAttribute("aria-label", "Lecture"); });
        w.bind(E.FINISH, () => el.classList.remove("is-playing"));
        w.bind(E.PLAY_PROGRESS, (e) => { if (!bar.classList.contains("is-scrubbing")) show(e.currentPosition / 1000); });
      }).catch(() => { now.innerHTML = `<a href="${el.dataset.soundcloud}" target="_blank" rel="noopener">Écouter sur SoundCloud ↗</a>`; });
    };
    // on prépare le lecteur seulement quand il approche de l'écran
    new IntersectionObserver((en, io) => { if (en[0].isIntersecting) { io.disconnect(); start(); } }, { rootMargin: "400px" }).observe(el);
    btn.addEventListener("click", () => w?.toggle());
    list.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b || !w) return;
      w.skip(+b.dataset.i);
      setTimeout(() => w.play(), 200);
    });
    el.querySelectorAll(".skip").forEach((b) => b.addEventListener("click", () => {
      if (dur) w?.seekTo(clamp(pos + +b.dataset.skip, 0, dur) * 1000);
    }));
    makeScrubber(bar,
      (r, done) => { show(r * dur); if (done && dur) w?.seekTo(r * dur * 1000); },
      (d) => { if (dur) w?.seekTo(clamp(pos + d, 0, dur) * 1000); });
  });
}

/* --------------------------------------------------------------------------
   Visionneuse d'images
   -------------------------------------------------------------------------- */
let lbx;
function openLightbox(src, alt = "") {
  if (!lbx) {
    lbx = document.createElement("div");
    lbx.className = "lbx";
    lbx.setAttribute("role", "dialog");
    lbx.setAttribute("aria-modal", "true");
    lbx.innerHTML = `<img alt=""><button type="button">Fermer ✕</button>`;
    document.body.appendChild(lbx);
    const close = () => { lbx.classList.remove("is-on"); document.documentElement.classList.remove("lbx-open"); };
    lbx.addEventListener("click", close);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }
  const img = lbx.querySelector("img");
  img.src = src;
  img.alt = alt;
  lbx.classList.remove("is-on");
  void lbx.offsetWidth; // repart de l'état flou pour rejouer l'animation
  lbx.classList.add("is-on");
  document.documentElement.classList.add("lbx-open");
  lbx.querySelector("button").focus();
}
function initLightbox(scope = document) {
  scope.querySelectorAll("[data-lightbox] img").forEach((img) => {
    img.addEventListener("click", () => openLightbox(img.dataset.full || img.currentSrc || img.src, img.alt));
  });
}

/* --------------------------------------------------------------------------
   Apparition au défilement
   -------------------------------------------------------------------------- */
function initReveal() {
  const els = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-in")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    });
  }, { rootMargin: "0px 0px -10% 0px" });
  els.forEach((e) => io.observe(e));
}

/* --------------------------------------------------------------------------
   Warp : distorsion liquide qui « voit » la souris quand elle s'approche du
   texte et le désintègre, comme une main derrière une vitre texturée.
   - L'intensité dépend de la distance entre la souris et le texte
     (pas besoin de bouger : il suffit d'être proche).
   - Le motif est génératif : deux couches de bruit dérivent et se
     transforment en continu, sans rebond.
   - La zone d'effet s'estompe sans bord visible (pas de cercle, pas d'aura).
   -------------------------------------------------------------------------- */
const SPOT = "data:image/svg+xml," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><radialGradient id="g">' +
  '<stop offset="0" stop-color="#fff"/>' +
  '<stop offset=".3" stop-color="#fff" stop-opacity=".9"/>' +
  '<stop offset=".6" stop-color="#fff" stop-opacity=".45"/>' +
  '<stop offset=".85" stop-color="#fff" stop-opacity=".1"/>' +
  '<stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>' +
  '<rect width="200" height="200" fill="url(#g)"/></svg>');
let fxDefs = null, fxN = 0;
function fxSvg() {
  if (!fxDefs) {
    document.body.insertAdjacentHTML("beforeend",
      '<svg class="fx-defs" width="0" height="0" style="position:absolute;width:0;height:0" aria-hidden="true"><defs></defs></svg>');
    fxDefs = document.body.lastElementChild.firstElementChild;
  }
  return fxDefs;
}

const warps = [];
const mouse = { x: -1e4, y: -1e4, moved: 0 };
let warpRaf = null;

function warpTick(now) {
  const t = now / 1000;
  mouse.moved *= 0.96;                              // l'élan du mouvement retombe doucement
  let alive = false;
  for (const w of warps) {
    const r = w.el.getBoundingClientRect();
    // zone sensible (par défaut : l'élément lui-même)
    const b = w.bounds ? w.bounds(r) : r;
    // distance entre la souris et le bord le plus proche
    const dx = Math.max(b.left - mouse.x, 0, mouse.x - b.right);
    const dy = Math.max(b.top - mouse.y, 0, mouse.y - b.bottom);
    const dist = Math.hypot(dx, dy);
    const near = clamp(1 - dist / w.reach, 0, 1);
    const target = near * near * (3 - 2 * near) * (0.6 + 0.4 * mouse.moved);
    w.str += (target - w.str) * 0.06;
    // pendant que le texte apparaît (désintégration), on lui laisse le filtre ;
    // le warp reprend tout seul juste après
    if (w.el._dissolving) { w.on = false; if (target > 0) alive = true; continue; }
    if (w.str < 0.004 && target === 0) {
      if (w.on) { w.el.style.filter = ""; w.on = false; }
      if (w.magnet && (w.mx || w.my)) { w.mx = w.my = 0; w.el.style.translate = ""; }
      continue;
    }
    // aimant : l'objet glisse un peu vers la souris, à partir de son centre
    if (w.magnet) {
      const cx = r.left - w.mx + r.width / 2, cy = r.top - w.my + r.height / 2;
      const lim = w.magnet;
      const tx = clamp((mouse.x - cx) * 0.06, -lim, lim) * w.str;
      const ty = clamp((mouse.y - cy) * 0.06, -lim, lim) * w.str;
      w.mx += (tx - w.mx) * 0.12;
      w.my += (ty - w.my) * 0.12;
      w.el.style.translate = `${w.mx.toFixed(2)}px ${w.my.toFixed(2)}px`;
    }
    alive = true;
    // position de la souris dans le repère de l'élément (même s'il est agrandi)
    const sc = r.width / (w.el.offsetWidth || r.width);
    const mx = (mouse.x - r.left) / sc, my = (mouse.y - r.top) / sc;
    if (!w.on) {
      w.on = true;
      w.x = mx; w.y = my;
      w.el.style.filter = `url(#${w.id})`;
    }
    // la tache glisse vers la souris, sans dépasser
    w.x += (mx - w.x) * 0.1;
    w.y += (my - w.y) * 0.1;
    const R = w.radius;
    w.spot.setAttribute("x", (w.x - R).toFixed(1));
    w.spot.setAttribute("y", (w.y - R).toFixed(1));
    w.spot.setAttribute("width", (2 * R).toFixed(1));
    w.spot.setAttribute("height", (2 * R).toFixed(1));
    // motif génératif : deux bruits qui dérivent en sens inverse et respirent
    const a = t * 0.35 + w.phase, d = w.drift;
    w.o1.setAttribute("dx", (Math.cos(a) * d).toFixed(2));
    w.o1.setAttribute("dy", (Math.sin(a * 1.3) * d).toFixed(2));
    w.o2.setAttribute("dx", (Math.sin(a * 0.8) * -d).toFixed(2));
    w.o2.setAttribute("dy", (Math.cos(a * 0.6) * -d).toFixed(2));
    const f = w.freq * (1 + 0.1 * Math.sin(t * 0.5 + w.phase));
    w.t1.setAttribute("baseFrequency", `${f.toFixed(4)} ${(f * 1.4).toFixed(4)}`);
    w.disp.setAttribute("scale", (w.scale * w.str).toFixed(2));
    if (w.soft) w.blur.setAttribute("stdDeviation", (w.soft * w.str).toFixed(2));
  }
  warpRaf = alive ? requestAnimationFrame(warpTick) : null;
}
function warpWake() { if (!warpRaf) warpRaf = requestAnimationFrame(warpTick); }

if (canHover && !reduceMotion) {
  let lx = 0, ly = 0;
  window.addEventListener("pointermove", (e) => {
    mouse.moved = Math.min(1, mouse.moved + Math.hypot(e.clientX - lx, e.clientY - ly) / 120);
    lx = mouse.x = e.clientX;
    ly = mouse.y = e.clientY;
    warpWake();
  }, { passive: true });
  window.addEventListener("scroll", warpWake, { passive: true });
  document.documentElement.addEventListener("pointerleave", () => { mouse.x = mouse.y = -1e4; warpWake(); });
}

function makeWarp(el, o = {}) {
  if (!canHover || reduceMotion || el.dataset.warp) return;
  el.dataset.warp = "1";
  // mêmes réglages partout, proportionnés à la taille du texte
  // (plafonnés : sur les grands titres, la tache garde une taille « juste »)
  const fs = Math.max(...[el, ...el.querySelectorAll("*")].map((n) => parseFloat(getComputedStyle(n).fontSize) || 16));
  const k = clamp(fs / 16, 1, 9);
  const radius = o.radius || clamp(90 + k * 24, 110, 240);
  const scale = o.scale || clamp(55 + k * 14, 65, 150);
  const freq = o.freq || clamp(0.075 / Math.sqrt(k), 0.045, 0.07);
  const region = o.region || 'x="-40%" y="-80%" width="180%" height="260%"';
  const id = `zw${fxN++}`;
  fxSvg().insertAdjacentHTML("beforeend", `
    <filter id="${id}" ${region} color-interpolation-filters="sRGB" primitiveUnits="userSpaceOnUse">
      <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" seed="${(Math.random() * 99) | 0}" result="n1"/>
      <feOffset in="n1" result="m1"/>
      <feTurbulence type="fractalNoise" baseFrequency="${(freq * 0.45).toFixed(4)}" numOctaves="1" seed="${(Math.random() * 99) | 0}" result="n2"/>
      <feOffset in="n2" result="m2"/>
      <feComposite in="m1" in2="m2" operator="arithmetic" k2=".55" k3=".45" result="n"/>
      <feImage href="${SPOT}" x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="s"/>
      <feFlood flood-color="#808080" result="g"/>
      <feComposite in="n" in2="s" operator="in" result="ln"/>
      <feComposite in="ln" in2="g" operator="over" result="m"/>
      <feDisplacementMap in="SourceGraphic" in2="m" scale="0" xChannelSelector="R" yChannelSelector="G" result="w"/>
      <feGaussianBlur in="w" stdDeviation="0" result="b"/>
      <feComposite in="b" in2="s" operator="arithmetic" k1="1" result="bs"/>
      <feComposite in="w" in2="s" operator="arithmetic" k1="-1" k2="1" result="ws"/>
      <feComposite in="bs" in2="ws" operator="arithmetic" k2="1" k3="1"/>
    </filter>`);
  const f = fxDefs.querySelector(`#${id}`);
  const [t1] = f.querySelectorAll("feTurbulence");
  const [o1, o2] = f.querySelectorAll("feOffset");
  warps.push({
    el, id, radius, scale, freq, reach: radius * 0.85, drift: radius * 0.18,
    soft: o.blur === false ? 0 : scale * 0.025, bounds: o.bounds,
    // aimant (en px) : désactivé pour les logos, qui bougent déjà
    magnet: o.magnet ?? (el.matches(".toplogo, .mnu__logo") ? 0 : clamp(4 + k * 1.5, 5, 16)), mx: 0, my: 0,
    phase: Math.random() * 6.28, str: 0, x: 0, y: 0, on: false,
    t1, o1, o2, spot: f.querySelector("feImage"), disp: f.querySelector("feDisplacementMap"),
    blur: f.querySelector("feGaussianBlur"),
  });
}

/* --------------------------------------------------------------------------
   Apparition du texte : il se « matérialise » à partir d'un flou désintégré
   -------------------------------------------------------------------------- */
function dissolveIn(el, delay = 0) {
  if (reduceMotion) { el.style.opacity = ""; return; }
  el._dissolving = true;
  const id = `zd${fxN++}`;
  fxSvg().insertAdjacentHTML("beforeend", `
    <filter id="${id}" x="-10%" y="-30%" width="120%" height="160%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.06 0.09" numOctaves="2" seed="${(Math.random() * 99) | 0}" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="80" xChannelSelector="R" yChannelSelector="G" result="w"/>
      <feGaussianBlur in="w" stdDeviation="10"/>
    </filter>`);
  const f = fxDefs.querySelector(`#${id}`);
  const disp = f.querySelector("feDisplacementMap");
  const blur = f.querySelector("feGaussianBlur");
  setTimeout(() => {
    el.style.filter = `url(#${id})`;
    const t0 = performance.now(), D = 1150;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / D);
      const e = 1 - Math.pow(1 - p, 3);
      disp.setAttribute("scale", (80 * (1 - e)).toFixed(2));
      blur.setAttribute("stdDeviation", (10 * (1 - e)).toFixed(2));
      el.style.opacity = Math.min(1, p * 2.2).toFixed(3);
      if (p < 1) requestAnimationFrame(step);
      else {
        el.style.filter = "";
        el.style.opacity = "";
        f.remove();
        el._dissolving = false;
        warpWake(); // si la souris est déjà proche, le warp revient aussitôt
      }
    };
    requestAnimationFrame(step);
  }, delay);
}

function initTextFx() {
  // Textes qui se déforment sous la souris
  document.querySelectorAll(
    ".hero__name, .hero__text, .hero__label, .toplogo, .mnu__logo, .ah__big, .ah__cta, .end__cta, " +
    ".bts__title, .p-title, .p-next__title, .au__title, .box__inline, .box:not(.box--services):not(.box--tools) .box__list"
  ).forEach((el) => {
    makeWarp(el);
  });

  // Textes qui apparaissent en se matérialisant
  const els = [...document.querySelectorAll(
    ".p-cat, .p-title, .p-index, .p-meta > div, .p-body > h2, .prose > p, .prose > h3, .p-next__title, " +
    ".ah__tag, .ah__big, .ah__p, .ah__facts, .ah__cta, .box__label, .box__inline, .box__rows, " +
    ".box:not(.box--services) .box__list, .bts__title, .end__cta, .au__text > h2, .au__text > p, .au__text > dl, .au__kicker, .au__title"
  )];
  if (!els.length) return;
  els.forEach((e) => { e.style.opacity = "0"; });
  if (!("IntersectionObserver" in window)) { els.forEach((e) => dissolveIn(e)); return; }
  const io = new IntersectionObserver((entries) => {
    let k = 0;
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      dissolveIn(en.target, k++ * 90);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  els.forEach((e) => io.observe(e));
}

/* --------------------------------------------------------------------------
   Transition de page accueil → projet (navigateurs compatibles : Chrome,
   Edge, Safari récents). L'image de la carte cliquée devient l'image
   d'en-tête du projet. Ailleurs, la page change normalement.
   -------------------------------------------------------------------------- */
let morphCard = null;
document.addEventListener("click", (e) => {
  const a = e.target.closest("a.card");
  morphCard = a && !e.defaultPrevented ? a : null;
}, true);
window.addEventListener("pageswap", (e) => {
  if (!e.viewTransition) return;
  const to = e.activation?.entry?.url || "";
  if (morphCard && to.endsWith(morphCard.getAttribute("href"))) {
    morphCard.querySelector(".card__img").style.viewTransitionName = "hero";
    try { sessionStorage.setItem("zephir-morph", "1"); } catch (err) {}
  } else {
    try { sessionStorage.removeItem("zephir-morph"); } catch (err) {}
  }
});
window.addEventListener("pagereveal", (e) => {
  let on = false;
  try { on = sessionStorage.getItem("zephir-morph") === "1"; sessionStorage.removeItem("zephir-morph"); } catch (err) {}
  const hero = document.querySelector(".p-hero");
  if (!e.viewTransition || !on || !hero) return;
  hero.style.viewTransitionName = "hero";
  e.viewTransition.finished.finally(() => { hero.style.viewTransitionName = ""; });
});

/* --------------------------------------------------------------------------
   Démarrage commun
   -------------------------------------------------------------------------- */
buildMenu();
initTextFx();
initPlayers();
initTracks();
initScTracks();
initLightbox();
initReveal();
document.querySelectorAll(".year").forEach((y) => { y.textContent = new Date().getFullYear(); });
