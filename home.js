/* ==========================================================================
   Page d'accueil — bande 3D + filtres. Les projets sont dans site.js.
   ========================================================================== */

// Ordre d'affichage dans la bande : on mélange les catégories pour varier les images
const STRIP_ORDER = ["edria", "il", "cielo", "specto", "oniria", "deluge", "humain", "synapse", "cdi",
  "impressions", "requetes", "lunacrim", "mona", "echoes", "floating", "echec", "storm", "maniac",
  "reflexion", "youandme", "anomalie"];

const bySlug = Object.fromEntries(PROJECTS.map((p) => [p.slug, p]));
const ordered = STRIP_ORDER.map((s) => bySlug[s]).filter(Boolean);
const toCard = (p) => ({ title: p.title, cat: `${p.cat}${p.year ? ` — ${p.year}` : ""}`, href: p.href, src: `assets/thumbs/${p.img}.jpg` });

const strip = createStrip(document.querySelector(".strip"), { wheel: true });

/* Filtres catégorie + année ------------------------------------------- */
// Lien direct possible : index.html#cat=Vidéographie&year=2022
const params = new URLSearchParams(decodeURIComponent(location.hash.slice(1)));
let first = true;
const filters = createFilters(document.querySelector(".stage > .filters"), (cat, year, fromClick) => {
  strip.build(ordered.filter((p) => matches(p, cat, year)).map(toCard), fromClick);
  if (!first) {
    const h = new URLSearchParams();
    if (cat !== ALL_CATS) h.set("cat", cat);
    if (year !== ALL_YEARS) h.set("year", year);
    try { history.replaceState(null, "", h.toString() ? `#${h}` : location.pathname); } catch (err) {}
  }
  first = false;
}, { cat: params.get("cat"), year: params.get("year") });
filters.apply();

/* Loader puis apparition ----------------------------------------------- */
// Le loader ne joue qu'une fois par visite (pas à chaque retour sur l'accueil)
let seen = false;
try { seen = sessionStorage.getItem("zephir-intro") === "1"; sessionStorage.setItem("zephir-intro", "1"); } catch (e) {}

(seen ? Promise.resolve() : runLoader()).then(() => {
  strip.layout();
  setTimeout(() => {
    document.body.classList.add("is-ready");
    scramble(document.querySelector(".hero__label"), 1200);
  }, seen ? 50 : 350);
});
