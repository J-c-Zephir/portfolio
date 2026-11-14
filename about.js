/* ==========================================================================
   Page « Qui suis-je ? » — parallaxe, lignes pointillées, coulisses
   ========================================================================== */

/* La page s'ouvre un peu défilée (comme les pages « works » d'AUGE) :
   on voit le bas de la photo et le texte ; en remontant, la photo apparaît
   au complet. Seulement à l'arrivée sur la page (pas au retour arrière,
   ni avec un lien vers une section). */
const photo = document.querySelector(".ah__photo");
const zoom = photo.querySelector(".ah__zoom");
const heroImg = photo.querySelector("img");
const spacer = document.querySelector(".ah__spacer");
const nav = performance.getEntriesByType?.("navigation")[0];
const logo = document.querySelector(".toplogo");
const bar = document.querySelector(".ah__bar");
const root = document.documentElement;
// position d'arrivée : on voit la photo et le début du texte
// le texte commence à 60 % de l'écran, ou un peu avant le bas de la photo
// sur les écrans étroits (où la photo est moins haute)
const startY = () => {
  const photoH = zoom.offsetHeight;
  return Math.max(0, Math.round(spacer.offsetHeight - Math.min(photoH * 0.85, window.innerHeight * 0.6)));
};
if (!location.hash && window.scrollY === 0 && nav?.type !== "back_forward") {
  window.scrollTo(0, startY());
}

/* Pendant le défilement :
   - la photo est un peu zoomée ; en remontant, elle se dézoome au complet
   - tout en haut (--top = 1), le logo ZEPHIR glisse au centre (avec un flou
     de mouvement) et la barre du bas (copyright, LinkedIn, Instagram,
     contact) apparaît
   - les valeurs suivent le défilement en douceur (lissage à chaque image)
   - on cache la photo quand elle est entièrement couverte */
const ease = (x) => x * x * (3 - 2 * x);
// flou de mouvement horizontal pour le logo
fxSvg().insertAdjacentHTML("beforeend",
  '<filter id="logoblur" x="-30%" y="0" width="160%" height="100%"><feGaussianBlur stdDeviation="0 0"/></filter>');
const logoBlur = document.querySelector("#logoblur feGaussianBlur");
const logoIn = document.createElement("span");
logoIn.className = "tl-in";
while (logo.firstChild) logoIn.appendChild(logo.firstChild);
logo.appendChild(logoIn);

const cur = { s: 1, top: 0, dx: 0 };
let raf = null;
function targets() {
  const y = window.scrollY;
  const sy = startY() || 1;
  return {
    s: reduceMotion ? 1 : 1 + clamp(y / sy, 0, 1) * 0.1,
    top: ease(1 - clamp(y / sy, 0, 1)),
  };
}
function tick() {
  const t = targets();
  const k = reduceMotion ? 1 : 0.12;
  cur.s += (t.s - cur.s) * k;
  cur.top += (t.top - cur.top) * k;
  zoom.style.setProperty("--s", cur.s.toFixed(4));
  root.style.setProperty("--top", cur.top.toFixed(3));
  bar.classList.toggle("is-on", cur.top > 0.5);
  const span = (window.innerWidth - logo.offsetWidth) / 2 - logo.offsetLeft;
  const dx = span * cur.top;
  const v = Math.abs(dx - cur.dx);
  cur.dx = dx;
  logo.style.translate = `${dx.toFixed(1)}px 0`;
  logoBlur.setAttribute("stdDeviation", `${Math.min(v * 0.6, 14).toFixed(2)} 0`);
  logoIn.style.filter = v > 0.3 ? "url(#logoblur)" : "";
  photo.style.visibility = window.scrollY > spacer.offsetHeight + 40 ? "hidden" : "";
  const done = Math.abs(t.s - cur.s) < 0.0005 && Math.abs(t.top - cur.top) < 0.002;
  raf = done ? null : requestAnimationFrame(tick);
  if (done) logoIn.style.filter = "";
}
const wake = () => { if (!raf) raf = requestAnimationFrame(tick); };
window.addEventListener("scroll", wake, { passive: true });
window.addEventListener("resize", wake);
// au chargement : pas de transition, on part directement de la bonne position
Object.assign(cur, targets());
wake();

/* Même distorsion que les textes de l'accueil, sans le flou,
   seulement sur la partie visible de la photo */
makeWarp(heroImg, {
  blur: false, radius: 340, scale: 260, freq: 0.022, magnet: 0,
  region: 'x="0" y="0" width="100%" height="100%"',
  bounds: () => ({ left: 0, right: window.innerWidth, top: 0, bottom: Math.min(zoom.offsetHeight, spacer.getBoundingClientRect().bottom) }),
});

/* Services : chaque mot reçoit un ordre et une inclinaison au hasard */
document.querySelectorAll(".box__list li, .box__rows li").forEach((li, i) => {
  li.style.setProperty("--i", i);
  li.style.setProperty("--r", `${((Math.random() * 2 - 1) * 6).toFixed(1)}deg`);
});

/* Lignes pointillées de la section blanche (s'adaptent à la taille) */
const svg = document.querySelector(".pod__lines");
function drawLines() {
  const r = svg.getBoundingClientRect();
  const W = r.width, H = r.height;
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  const grid = document.querySelector(".pod__grid").getBoundingClientRect();
  const gx = grid.left - r.left, gw = grid.width;
  const vx = [gx - 34, gx + gw * 0.21, gx + gw * 0.72, gx + gw + 34].filter((x) => x > 10 && x < W - 10);
  const hy = [100, H * 0.42, H - 110];
  // anneaux ondulés en haut au centre
  const cx = gx + gw * 0.55, cy = -40;
  let rings = "";
  for (let k = 0; k < 7; k++) {
    const R = 150 + k * 52;
    let d = "";
    for (let a = 0; a <= 360; a += 6) {
      const rad = (a * Math.PI) / 180;
      const rr = R + Math.sin(rad * 5 + k) * (10 + k * 2);
      d += `${a ? "L" : "M"}${(cx + Math.cos(rad) * rr).toFixed(1)},${(cy + Math.sin(rad) * rr * 0.9).toFixed(1)}`;
    }
    rings += `<path class="d2" d="${d}Z"/>`;
  }
  const squares = [[W * 0.9, H * 0.17], [W * 0.95, H * 0.62], [W * 0.06, H * 0.78], [W * 0.12, H * 0.3]]
    .map(([x, y]) => `<rect class="sq" x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="26" height="26"/>`).join("");
  svg.innerHTML = `
    ${vx.map((x) => `<line class="d" x1="${x}" y1="0" x2="${x}" y2="${H}"/>`).join("")}
    ${hy.map((y) => `<line class="d" x1="0" y1="${y}" x2="${W}" y2="${y}"/>`).join("")}
    <path class="d" d="M0,${H * 0.05} Q${W * 0.5},${H * 0.62} ${W},${H * 0.05}"/>
    <g class="rings">${rings}</g>
    ${squares}`;
}
drawLines();
let rt;
window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(drawLines, 150); });
document.fonts?.ready.then(drawLines);

/* Coulisses : même bande 3D que l'accueil, animée par le défilement de la page.
   Pour ajouter une photo : ajoute une ligne (image dans assets/thumbs/). */
const BTS = [
  { title: "Déluge — tournage", cat: "Vidéographie", src: "assets/thumbs/bts_deluge.jpg" },
  { title: "Synapse — conception sonore", cat: "Synapse · Direction sonore", src: "assets/thumbs/bts_synapse_son.jpg", full: "assets/png/bts_synapse_son.jpg" },
  { title: "SPECTO — l'équipe", cat: "De g. à d. : JC Zephir, Dominic Roberts, Maude Langlois, Noémie Poirier, Justin Lepitre", src: "assets/thumbs/bts_specto.jpg" },
  { title: "Edria — prototype", cat: "Installation", src: "assets/thumbs/bts_edria1.jpg" },
  { title: "Passages — teaser", cat: "Le Culte · Direction audiovisuelle", src: "assets/thumbs/bts_passages.jpg", full: "assets/png/bts_passages.jpg" },
  { title: "Au studio", cat: "Musique", src: "assets/thumbs/bts_studio.jpg" },
  { title: "Requêtes Parallèles — l'équipe", cat: "De g. à d. : Rachel Pelletier, JC Zephir, Meryem Berbiche", src: "assets/thumbs/bts_requetes.jpg" },
  { title: "Anomalie — Arduino", cat: "Installation", src: "assets/thumbs/bts_anomalie1.jpg" },
  { title: "Déluge — la sphère", cat: "De g. à d. : Léonie Poulin, Maude Langlois", src: "assets/thumbs/bts_deluge3.jpg", full: "assets/png/bts_deluge3.jpg" },
  { title: "Il — sur le plateau", cat: "Vidéographie", src: "assets/thumbs/bts_il.jpg" },
  { title: "Le Jubilé — tournage de la vidéo", cat: "Vidéographie", src: "assets/thumbs/bts_jubile.jpg", full: "assets/png/bts_jubile.jpg" },
  { title: "Maniac — installation 9 écrans", cat: "Vidéographie", src: "assets/thumbs/bts_maniac.jpg" },
  { title: "Edria — lumières", cat: "Installation", src: "assets/thumbs/bts_edria2.jpg" },
  { title: "Déluge — contre-jour", cat: "Vidéographie", src: "assets/thumbs/bts_deluge4.jpg", full: "assets/png/bts_deluge4.jpg" },
  { title: "Anomalie — VCV Rack", cat: "Son génératif", src: "assets/thumbs/bts_anomalie2.jpg" },
  { title: "Jean-Christophe — caméra en main", cat: "Vidéographie", src: "assets/thumbs/bts_jc_video.jpg", full: "assets/png/bts_jc_video.jpg" },
];

const bts = createStrip(document.querySelector(".bts__strip"), {
  scroll: true,
  lightbox: true,
  cta: "Agrandir",
  heights: [0.78, 0.6, 0.92, 0.7, 0.84, 0.66, 0.96, 0.62, 0.8, 0.72, 0.88, 0.64, 0.9, 0.7, 0.82, 0.68],
  width: () => (window.innerWidth <= 760 ? window.innerWidth * 0.62 : clamp(window.innerWidth * 0.24, 240, 460)),
});
bts.build(BTS, false);

// Les cartes apparaissent quand on arrive à la section
new IntersectionObserver((entries, io) => {
  if (entries[0].isIntersecting) { document.body.classList.add("is-ready"); io.disconnect(); }
}, { threshold: 0.15 }).observe(document.querySelector(".bts"));
