/**
 * Main page behavior (loaded as a normal <script> — no import/bundler).
 * - Scrollama: highlights the step you are reading + updates the phone bubble
 * - Typed.js: "live typing" for the me / dad lines
 * - AOS: light entrance motion on the hero + sections
 * - Starfield: background mood is driven by the phone "theme" in the scrolly,
 *   then switches to calmer "technical" stars once you move past the story
 */

const bubble = document.getElementById("bubble");
const storyOverlay = document.getElementById("storyOverlay");
const phoneState = document.getElementById("phoneState");
const steps = document.querySelectorAll(".step");
const scrollySection = document.getElementById("hook");

let activeTypedInstance = null;

function destroyTypedIfNeeded() {
  if (activeTypedInstance) {
    activeTypedInstance.destroy();
    activeTypedInstance = null;
  }
}

function updateBubble(type, text) {
  destroyTypedIfNeeded();
  if (!bubble) return;
  bubble.className = `msg ${type}`;
  bubble.innerHTML = "";

  // Live typing is meant to feel like WhatsApp-style composing for chat lines.
  if (type === "me" || type === "dad") {
    if (window.Typed) {
      activeTypedInstance = new Typed("#bubble", {
        strings: [text],
        typeSpeed: 23,
        showCursor: false,
      });
    } else {
      bubble.textContent = text;
    }
  } else {
    bubble.textContent = text;
  }
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
  const type = step.dataset.type;
  const text = step.dataset.text;
  const theme = step.dataset.theme || "safe";

  steps.forEach((item) => item.classList.remove("is-active"));
  step.classList.add("is-active");

  if (phoneState) phoneState.dataset.theme = theme;
  updateBubble(type, text);
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

if (storyOverlay) {
  storyOverlay.textContent =
    "Scroll to watch one text thread go from normal to not-my-dad in real time.";
}

updateBackgroundFromScroll();
