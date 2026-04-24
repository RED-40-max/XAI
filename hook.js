/**
 * Main page behavior (loaded as a normal <script> — no import/bundler).
 * - Scrollama: highlights the step you are reading + updates phone imagery
 * - AOS: light entrance motion on the hero + sections
 * - Starfield: background mood is driven by the phone "theme" in the scrolly,
 *   then switches to calmer "technical" stars once you move past the story
 */

const phoneReel = document.getElementById("phoneReel");
const phoneState = document.getElementById("phoneState");
const scrollySection = document.getElementById("hook");
const phoneSlides = phoneReel ? Array.from(phoneReel.querySelectorAll(".phone-slide")) : [];

function getScrollyProgress() {
  if (!scrollySection) return 0;
  const rect = scrollySection.getBoundingClientRect();
  const total = Math.max(1, scrollySection.offsetHeight - window.innerHeight * 0.7);
  const raw = (-rect.top + window.innerHeight * 0.2) / total;
  return Math.max(0, Math.min(1, raw));
}

function updatePhoneReelFromProgress(progress) {
  if (!phoneReel || !phoneSlides.length) return;
  const screenHeight = phoneState ? phoneState.clientHeight : 0;
  if (!screenHeight) return;
  const reelHeight = screenHeight * phoneSlides.length;
  const maxOffset = Math.max(0, reelHeight - screenHeight);
  const y = -Math.round(maxOffset * progress);
  phoneReel.style.transform = `translateY(${y}px)`;
}

function isScrollyInFocus() {
  if (!scrollySection) return false;
  const r = scrollySection.getBoundingClientRect();
  // While a big chunk of the scrolly is on-screen, let the phone "themes" own the void.
  return r.top < window.innerHeight * 0.55 && r.bottom > window.innerHeight * 0.25;
}

/**
 * When you are not inside the scrolly, fade the background toward "system lab" mode.
 * Any section with data-star-hint on index.html can win based on what is most visible.
 */
function updateBackgroundFromScroll() {
  const progress = getScrollyProgress();
  updatePhoneReelFromProgress(progress);
  if (phoneState) {
    if (progress < 0.34) phoneState.dataset.theme = "safe";
    else if (progress < 0.67) phoneState.dataset.theme = "odd";
    else phoneState.dataset.theme = "danger";
  }
  if (window.Starfield && isScrollyInFocus() && phoneState) {
    window.Starfield.setFromPhoneTheme(phoneState.dataset.theme || "safe");
  }
  if (!window.Starfield || isScrollyInFocus()) return;
  const hintSections = document.querySelectorAll("[data-star-hint]");
  let bestEl = null;
  let bestScore = 0;
  hintSections.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const visibleH = Math.max(0, Math.min(rect.bottom, vh) - Math.max(0, rect.top));
    const score = visibleH * visibleH; // big sections prefer a slightly stronger read
    if (score > bestScore) {
      bestScore = score;
      bestEl = el;
    }
  });
  if (bestEl) {
    const hint = bestEl.getAttribute("data-star-hint");
    if (hint) window.Starfield.setMood(hint);
  }
}

window.addEventListener("scroll", updateBackgroundFromScroll, { passive: true });
window.addEventListener("resize", () => {
  updatePhoneReelFromProgress(getScrollyProgress());
});

if (window.AOS) {
  window.AOS.init({
    once: true,
    duration: 700,
  });
} else {
  // Fail-safe so content stays visible if AOS fails.
  document.querySelectorAll("[data-aos]").forEach((el) => {
    el.style.opacity = "1";
    el.style.transform = "none";
  });
}

if (window.Starfield) {
  window.Starfield.init({ canvasId: "starfield", mood: "calm" });
}

updateBackgroundFromScroll();
