/* ==========================================================================
   Pages audio — lecteur avec CD qui tourne
   La source est définie sur <main class="au">, au choix :
     data-src="assets/audio/fichier.mp3"         (fichier dans le site — recommandé)
     data-soundcloud="https://soundcloud.com/..."  (piste ou playlist)
     data-spotify="spotify:track:ID"
   ========================================================================== */

const au = document.querySelector(".au");
const disc = document.querySelector(".cd__disc");
const playBtn = document.querySelector(".au__play");
const nowEl = document.querySelector(".au__now");
const barFill = document.querySelector(".au__bar i");
const bar = document.querySelector(".au__bar");
const curEl = document.querySelector(".au__time .cur");
const durEl = document.querySelector(".au__time .dur");
const listEl = document.querySelector(".au__list");
const engineEl = document.querySelector(".au__engine");

let playing = false;
let player = null; // { toggle(), seek(ratio), skip?(i) }

function setPlaying(on) {
  playing = on;
  au.classList.toggle("is-playing", on);
  playBtn.setAttribute("aria-label", on ? "Pause" : "Lecture");
}
const knob = document.querySelector(".au__bar b");
function setProgress(cur, dur, force) {
  if (bar.classList.contains("is-scrubbing") && !force) return;
  curEl.textContent = fmt(cur);
  if (dur) durEl.textContent = fmt(dur);
  const pct = dur ? `${(cur / dur) * 100}%` : "0%";
  barFill.style.width = pct;
  knob.style.left = pct;
}
function loadScript(src) {
  return new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = res;
    s.onerror = rej;
    document.head.appendChild(s);
  });
}

/* ---------- Rotation du CD : accélère au play, ralentit à la pause ---------- */
let angle = 0, speed = 0, scrollKick = 0, lastY = window.scrollY;
window.addEventListener("scroll", () => {
  scrollKick += (window.scrollY - lastY) * 0.04;
  lastY = window.scrollY;
}, { passive: true });
const SPIN_SPEED = 80; // degrés par seconde quand ça joue (≈ 13 tours/minute)
let lastT = performance.now();
(function spin(now = performance.now()) {
  const dt = Math.min(0.05, (now - lastT) / 1000); // indépendant de la fréquence de l'écran
  lastT = now;
  const target = playing ? SPIN_SPEED : 0;
  speed += (target - speed) * Math.min(1, dt * (playing ? 1.2 : 0.9)); // démarre et s'arrête en douceur
  scrollKick *= Math.pow(0.9, dt * 60);
  const step = speed * dt + (reduceMotion ? 0 : scrollKick);
  // disque immobile : pas besoin de redessiner
  if (Math.abs(step) > 0.001) {
    angle = (angle + step) % 360;
    disc.style.transform = `rotate(${angle}deg)`;
  }
  requestAnimationFrame(spin);
})();

/* ---------- Fichier local ---------- */
function useFile(src) {
  const a = new Audio(src);
  a.preload = "metadata";
  a.addEventListener("play", () => setPlaying(true));
  a.addEventListener("pause", () => setPlaying(false));
  a.addEventListener("ended", () => setPlaying(false));
  a.addEventListener("timeupdate", () => setProgress(a.currentTime, a.duration));
  a.addEventListener("loadedmetadata", () => setProgress(0, a.duration));
  player = {
    toggle: () => (a.paused ? a.play() : a.pause()),
    seek: (r) => { if (a.duration) a.currentTime = r * a.duration; },
    seekBy: (d) => { a.currentTime = clamp(a.currentTime + d, 0, a.duration || 0); },
    duration: () => a.duration,
  };
  playBtn.disabled = false;
}

/* ---------- SoundCloud (piste ou playlist) ---------- */
async function useSoundCloud(url) {
  engineEl.innerHTML = `<iframe allow="autoplay" title="SoundCloud" src="https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=false&visual=false&show_comments=false"></iframe>`;
  await loadScript("https://w.soundcloud.com/player/api.js");
  const w = SC.Widget(engineEl.querySelector("iframe"));
  const E = SC.Widget.Events;
  let duration = 0;
  let sounds = [];

  const refreshCurrent = () => {
    w.getCurrentSound((s) => { if (s) nowEl.textContent = s.title || nowEl.textContent; });
    w.getCurrentSoundIndex((i) => {
      listEl?.querySelectorAll("button").forEach((b, k) => b.setAttribute("aria-current", String(k === i)));
    });
    w.getDuration((d) => { duration = d / 1000; setProgress(0, duration); });
  };

  w.bind(E.READY, () => {
    playBtn.disabled = false;
    w.getSounds((list) => {
      sounds = list || [];
      if (listEl && sounds.length > 1) {
        listEl.innerHTML = sounds.map((s, i) => `
          <li><button type="button" data-i="${i}">
            <span>${String(i + 1).padStart(2, "0")}</span>
            <span>${s.title || `Piste ${i + 1}`}</span>
            <span>${s.duration ? fmt(s.duration / 1000) : ""}</span>
          </button></li>`).join("");
        listEl.addEventListener("click", (e) => {
          const b = e.target.closest("button");
          if (!b) return;
          w.skip(+b.dataset.i);
          setTimeout(() => { w.play(); refreshCurrent(); }, 200);
        });
      }
      refreshCurrent();
    });
  });
  w.bind(E.PLAY, () => { setPlaying(true); refreshCurrent(); });
  w.bind(E.PAUSE, () => setPlaying(false));
  w.bind(E.FINISH, () => setPlaying(false));
  w.bind(E.PLAY_PROGRESS, (e) => setProgress(e.currentPosition / 1000, duration));

  player = {
    toggle: () => w.toggle(),
    seek: (r) => { if (duration) w.seekTo(r * duration * 1000); },
    seekBy: (d) => w.getPosition((ms) => w.seekTo(clamp(ms + d * 1000, 0, duration * 1000))),
    duration: () => duration,
  };
}

/* ---------- Spotify ---------- */
function useSpotify(uri) {
  const holder = document.createElement("div");
  engineEl.appendChild(holder);
  window.onSpotifyIframeApiReady = (IFrameAPI) => {
    IFrameAPI.createController(holder, { uri, width: 300, height: 80 }, (ctrl) => {
      playBtn.disabled = false;
      let dur = 0, pos = 0;
      ctrl.addListener("playback_update", (e) => {
        const d = e.data;
        dur = d.duration / 1000;
        pos = d.position / 1000;
        setPlaying(!d.isPaused);
        setProgress(d.position / 1000, dur);
      });
      player = {
        toggle: () => ctrl.togglePlay(),
        seek: (r) => { if (dur) ctrl.seek(r * dur); },
        seekBy: (d) => ctrl.seek(clamp(pos + d, 0, dur)),
        duration: () => dur,
      };
    });
  };
  loadScript("https://open.spotify.com/embed/iframe-api/v1");
}

/* ---------- Démarrage ---------- */
playBtn.disabled = true;
playBtn.addEventListener("click", () => player?.toggle());
// Glisser la barre pour avancer/reculer (on n'envoie la position qu'au relâchement)
makeScrubber(bar,
  (r, done) => {
    const d = player?.duration?.() || 0;
    setProgress(r * d, d, true);
    if (done) player?.seek(r);
  },
  (step) => player?.seekBy?.(step));
document.querySelectorAll(".au__btns .skip").forEach((b) =>
  b.addEventListener("click", () => player?.seekBy?.(+b.dataset.skip)));
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !/INPUT|TEXTAREA|BUTTON/.test(document.activeElement.tagName)) {
    e.preventDefault();
    player?.toggle();
  }
});

if (au.dataset.src) useFile(au.dataset.src);
else if (au.dataset.soundcloud) useSoundCloud(au.dataset.soundcloud).catch(() => { nowEl.textContent = "Lecteur indisponible — écouter sur SoundCloud"; });
else if (au.dataset.spotify) useSpotify(au.dataset.spotify);
