const bubble = document.getElementById("bubble");
const storyOverlay = document.getElementById("storyOverlay");
const phoneState = document.getElementById("phoneState");
const steps = document.querySelectorAll(".step");
import AOS from 'aos';
import 'aos/dist/aos.css';
import Typed from 'typed.js';
import scrollama from "scrollama";


let activeTypedInstance = null;

function destroyTypedIfNeeded() {
  if (activeTypedInstance) {
    activeTypedInstance.destroy();
    activeTypedInstance = null;
  }
}

function updateBubble(type, text) {
  destroyTypedIfNeeded();
  bubble.className = `msg ${type}`;
  bubble.innerHTML = "";

  // Typed.js gives the "live texting" effect for chat bubbles.
  if (type === "me" || type === "dad") {
    activeTypedInstance = new Typed("#bubble", {
      strings: [text],
      typeSpeed: 23,
      showCursor: false
    });
  } else {
    bubble.textContent = text;
  }
}

function handleStepEnter(response) {
  const step = response.element;
  const type = step.dataset.type;
  const text = step.dataset.text;
  const theme = step.dataset.theme || "safe";

  steps.forEach((item) => item.classList.remove("is-active"));
  step.classList.add("is-active");

  phoneState.dataset.theme = theme;
  updateBubble(type, text);
}

const scroller = scrollama();
scroller
  .setup({
    step: ".step",
    offset: 0.63,
    debug: false
  })
  .onStepEnter(handleStepEnter);

window.addEventListener("resize", () => {
  scroller.resize();
});

if (window.AOS) {
  AOS.init({
    once: true,
    duration: 700
  });
}

storyOverlay.textContent = "Scroll to watch one text thread slowly turn suspicious.";