/**
 * Main page behavior (loaded as a normal <script> — no import/bundler).
 * - Scrollama: highlights the step you are reading + updates phone imagery
 * - AOS: light entrance motion on the hero + sections
 * - Starfield: background mood is driven by the phone "theme" in the scrolly,
 *   then switches to calmer "technical" stars once you move past the story
 */

const phoneSlide = document.getElementById("phoneSlide");
const phoneState = document.getElementById("phoneState");
const steps = document.querySelectorAll(".step");
const scrollySection = document.getElementById("hook");
const stepList = Array.from(steps);
const phoneFrames = ["assets/1.png", "assets/2.png", "assets/3.png"];
let activeFrameIndex = 0;

function frameIndexFromStep(stepIndex) {
  if (stepList.length <= 1) return 0;
  const progress = stepIndex / (stepList.length - 1);
  return Math.min(phoneFrames.length - 1, Math.floor(progress * phoneFrames.length));
}

function updatePhoneFrame(stepIndex) {
  if (!phoneSlide) return;
  const nextIndex = frameIndexFromStep(stepIndex);
  if (nextIndex === activeFrameIndex) return;
  activeFrameIndex = nextIndex;
  phoneSlide.classList.add("is-changing");
  window.setTimeout(() => {
    phoneSlide.src = phoneFrames[nextIndex];
    phoneSlide.alt = `Chat thread frame ${nextIndex + 1}`;
  }, 90);
  window.setTimeout(() => {
    phoneSlide.classList.remove("is-changing");
  }, 260);
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

function handleStepEnter(response) {
  const step = response.element;
  const theme = step.dataset.theme || "safe";

  steps.forEach((item) => item.classList.remove("is-active"));
  step.classList.add("is-active");

  if (phoneState) phoneState.dataset.theme = theme;
  const idx = stepList.indexOf(step);
  updatePhoneFrame(idx < 0 ? 0 : idx);
  if (window.Starfield) {
    window.Starfield.setFromPhoneTheme(theme);
  }
}

// Scrollama reads your scroll position and calls our handler when a step is centered.
if (window.scrollama) {
  const scroller = window.scrollama();
  scroller
    .setup({
      step: ".step",
      offset: 0.63,
      debug: false,
    })
    .onStepEnter(handleStepEnter);

  window.addEventListener("resize", () => {
    scroller.resize();
  });
}

window.addEventListener("scroll", updateBackgroundFromScroll, { passive: true });

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
