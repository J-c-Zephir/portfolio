/* ==========================================================================
   Pages de projet — petit zoom de l'image d'en-tête au défilement
   ========================================================================== */
const pHero = document.querySelector(".p-hero");
if (pHero && !reduceMotion) {
  const onScroll = () => {
    const h = pHero.offsetHeight;
    const p = Math.min(1, window.scrollY / h);
    pHero.style.setProperty("--hs", (1.06 - p * 0.06).toFixed(4));
  };
  window.addEventListener("scroll", () => requestAnimationFrame(onScroll), { passive: true });
  onScroll();
}
// Petit décalage entre les photos d'une même rangée quand elles apparaissent
document.querySelectorAll(".p-grid figure").forEach((f, i) => f.style.setProperty("--d", `${(i % 3) * 0.09}s`));

// Les très longs titres prennent moins de place
document.querySelectorAll(".p-title").forEach((t) => {
  if (t.textContent.trim().length > 18) t.style.fontSize = "clamp(40px, 7vw, 130px)";
});

/* --------------------------------------------------------------------------
   Processus : la ligne du temps se remplit pendant le défilement,
   et chaque étape s'allume quand on l'atteint.
   -------------------------------------------------------------------------- */
document.querySelectorAll(".proc__steps").forEach((list) => {
  const steps = [...list.querySelectorAll(".step")];
  let ticking = false;
  const update = () => {
    ticking = false;
    const r = list.getBoundingClientRect();
    const mark = window.innerHeight * 0.55;
    list.style.setProperty("--prog", Math.min(1, Math.max(0, (mark - r.top) / r.height)).toFixed(4));
    steps.forEach((s) => s.classList.toggle("is-on", s.getBoundingClientRect().top < mark));
  };
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener("resize", update);
  update();
});

/* Boucles vidéo (façon GIF) : chargées et jouées seulement quand elles sont
   à l'écran, en pause sinon. Avec « réduire les animations », on montre
   l'image fixe et des contrôles à la place. */
const loops = document.querySelectorAll("video[data-loop]");
if (loops.length) {
  if (reduceMotion || !("IntersectionObserver" in window)) {
    loops.forEach((v) => { v.src = v.dataset.src; v.controls = true; });
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(({ target: v, isIntersecting }) => {
        if (isIntersecting) {
          if (!v.src) v.src = v.dataset.src;
          v.play().catch(() => {});
        } else v.pause();
      });
    }, { rootMargin: "120px 0px" });
    loops.forEach((v) => io.observe(v));
  }
}
document.querySelectorAll(".step__media figure").forEach((f, i) => f.style.setProperty("--d", `${(i % 3) * 0.08}s`));
