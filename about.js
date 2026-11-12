/* ==========================================================================
   Page « Qui suis-je ? » — parallaxe, lignes pointillées, coulisses
   ========================================================================== */

/* Parallaxe douce de la photo d'en-tête */
const heroImg = document.querySelector(".ah__bg img");
const header = document.querySelector(".ah");
function parallax() {
  const h = header.offsetHeight;
  const y = Math.min(window.scrollY, h);
  heroImg.style.setProperty("--ty", `${y * 0.25}px`);
  heroImg.style.setProperty("--s", (1.12 - (y / h) * 0.06).toFixed(4));
}
if (!reduceMotion) {
  window.addEventListener("scroll", () => requestAnimationFrame(parallax), { passive: true });
  parallax();
}

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
  { title: "SPECTO — l'équipe", cat: "SAT", src: "assets/thumbs/bts_specto.jpg" },
  { title: "Edria — prototype", cat: "Installation", src: "assets/thumbs/bts_edria1.jpg" },
  { title: "Au studio", cat: "Musique", src: "assets/thumbs/bts_studio.jpg" },
  { title: "Requêtes Parallèles — l'équipe", cat: "Lumino", src: "assets/thumbs/bts_requetes.jpg" },
  { title: "Anomalie — Arduino", cat: "Installation", src: "assets/thumbs/bts_anomalie1.jpg" },
  { title: "Il — sur le plateau", cat: "Vidéographie", src: "assets/thumbs/bts_il.jpg" },
  { title: "Maniac — installation 9 écrans", cat: "Vidéographie", src: "assets/thumbs/bts_maniac.jpg" },
  { title: "Edria — lumières", cat: "Installation", src: "assets/thumbs/bts_edria2.jpg" },
  { title: "Anomalie — VCV Rack", cat: "Son génératif", src: "assets/thumbs/bts_anomalie2.jpg" },
  { title: "Portrait", cat: "Jean-Christophe", src: "assets/thumbs/bts_portrait.jpg" },
];

const bts = createStrip(document.querySelector(".bts__strip"), {
  scroll: true,
  lightbox: true,
  cta: "Agrandir",
  heights: [0.78, 0.6, 0.92, 0.7, 0.84, 0.66, 0.96, 0.62, 0.8, 0.72, 0.88],
  width: () => (window.innerWidth <= 760 ? window.innerWidth * 0.62 : clamp(window.innerWidth * 0.24, 240, 460)),
});
bts.build(BTS, false);

// Les cartes apparaissent quand on arrive à la section
new IntersectionObserver((entries, io) => {
  if (entries[0].isIntersecting) { document.body.classList.add("is-ready"); io.disconnect(); }
}, { threshold: 0.15 }).observe(document.querySelector(".bts"));
