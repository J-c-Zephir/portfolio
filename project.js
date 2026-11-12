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
