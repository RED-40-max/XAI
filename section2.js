const output = document.getElementById("output");
const partButtons = document.querySelectorAll(".agent-node, .workflow-side, .workflow-phase-btn");
const flowPaths = document.querySelectorAll(".flow-path");
const stepButtons = document.querySelectorAll(".workflow-step");

let activeStep = null;
let lastSelectionId = null;

const stepOrder = ["prompt", "planning", "act"];

const partInfo = {
  prompt: {
    title: "Prompt (Input)",
    desc: "The user gives a task request. This is where the system gets its goal and constraints.",
    analogy: "Like giving a teammate the assignment brief before they start.",
    links: [],
    step: "prompt"
  },
  goal: {
    title: "Planning (Decision Layer)",
    desc: "Planning breaks goals into concrete steps before action. If the plan is wrong, the rest of the loop can look confident while still drifting in the wrong direction.",
    analogy: "Like writing a recipe before cooking. One wrong instruction can throw off the entire meal.",
    links: ["b2p", "p2b", "p2a"],
    step: "planning"
  },
  memory: {
    title: "Memory (Working + Persistent)",
    desc: "Memory provides both short-term working context and long-term history. This improves continuity, but stale or wrong memory can be reused and amplified.",
    analogy: "Like using a shared notebook. If one bad note is written early, every later decision repeats it.",
    links: ["m2b"],
    step: "planning"
  },
  tools: {
    title: "Tools (External Action Layer)",
    desc: "Tools and action execution let agents affect the outside world through APIs, files, search, and other systems. This is where model mistakes become real consequences.",
    analogy: "Like handing someone your keys, card, and phone to run errands - useful, but high impact if misunderstood.",
    links: ["b2t", "t2b", "b2a", "t2a", "p2a"],
    step: "act"
  },
  safety: {
    title: "Agent Brain (Controller / Decision Core)",
    desc: "The controller coordinates planning, memory, and tools. It is the central orchestration layer where signals are combined into system behavior.",
    analogy: "Like a project manager who delegates tasks, checks context, and keeps the full workflow aligned.",
    links: ["m2b", "b2t", "t2b", "b2p", "p2b", "b2a"],
    step: "planning"
  },
  feedback: {
    title: "Reflection (Self-Correction Loop)",
    desc: "Reflection reviews outcomes and adjusts future decisions. Strong reflection improves reliability; weak reflection can reinforce bad patterns.",
    analogy: "Like reviewing a test - good reflection catches mistakes; bad reflection doubles down on them.",
    links: ["p2b", "b2p", "p2a", "p2r", "r2p"],
    step: "planning"
  },
  result: {
    title: "Output (Final Product)",
    desc: "After planning and action, the agent returns a usable final output with findings.",
    analogy: "Like turning rough notes into a finished report.",
    links: [],
    step: "act"
  }
};

const stepToParts = {
  prompt: ["prompt"],
  planning: ["goal", "memory", "safety", "feedback"],
  act: ["tools", "result"]
};

function setActiveStep(stepKey) {
  activeStep = stepKey;
  stepButtons.forEach((button) => {
    const isActive = button.dataset.step === stepKey;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function updateProgressFromStep(stepKey, selectionId) {
  if (selectionId === lastSelectionId) return;
  lastSelectionId = selectionId;
  const reached = stepOrder.includes(stepKey) ? stepOrder.indexOf(stepKey) : -1;
  stepButtons.forEach((button) => {
    const stepKeyForBtn = button.dataset.step;
    const btnIndex = stepOrder.indexOf(stepKeyForBtn);
    button.classList.toggle("is-complete", btnIndex <= reached && reached >= 0);
  });
}

function renderPart(partKey, selectionId) {
  const part = partInfo[partKey];
  if (!part) return;

  partButtons.forEach((btn) => {
    const isActive = btn.dataset.part === partKey;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  const litLinks = new Set(part.links || []);
  flowPaths.forEach((path) => {
    path.classList.toggle("is-lit", litLinks.has(path.dataset.link));
  });

  setActiveStep(part.step);

  const relatedParts = new Set(stepToParts[part.step] || []);
  partButtons.forEach((btn) => {
    if (btn.dataset.part !== partKey) {
      btn.classList.toggle("is-related", relatedParts.has(btn.dataset.part));
    }
  });

  output.innerHTML = `
    <h2>${part.title}</h2>
    <p>${part.desc}</p>
    <p><strong>Analogy:</strong> ${part.analogy}</p>
  `;

  updateProgressFromStep(part.step, selectionId);
}

partButtons.forEach((button) => {
  const handleActivate = () => {
    const partKey = button.dataset.part;
    renderPart(partKey, `part:${partKey}`);
  };
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", handleActivate);
  button.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleActivate();
    }
  });
});

stepButtons.forEach((button) => {
  const handleActivate = () => {
    const stepKey = button.dataset.step;
    const firstPart = (stepToParts[stepKey] && stepToParts[stepKey][0]) || "prompt";
    renderPart(firstPart, `step:${stepKey}`);
  };
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", handleActivate);
  button.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleActivate();
    }
  });
});

if (window.AOS) {
  window.AOS.init({
    once: true,
    duration: 700
  });
} else {
  document.querySelectorAll("[data-aos]").forEach((el) => {
    el.style.opacity = "1";
    el.style.transform = "none";
  });
}