const output = document.getElementById("output");
const partButtons = document.querySelectorAll(".agent-node, .workflow-side, .workflow-phase-btn");
const flowPaths = document.querySelectorAll(".flow-path");
const stepButtons = document.querySelectorAll(".workflow-step");

let activeStep = null;
let lastSelectionId = null;

const stepOrder = ["prompt", "planning", "act"];

const partInfo = {
  prompt: {
    title: "PROMPT (Input)",
    what: "The user gives a task request. This is where the system gets its goal and constraints.",
    analogy: "Like giving a teammate the assignment brief before they start.",
    role: [
      "Defines the objective and boundaries for the run.",
      "Starts the planning and execution loop."
    ],
    links: [],
    step: "prompt"
  },
  goal: {
    title: "PLANNING (Decomposition Engine)",
    what: "Planning breaks a goal into smaller steps so the agent can act systematically. Planning enables complex behavior, but introduces compounding risk. A flawed plan does not fail once; it propagates across every step, making errors harder to detect as they scale (Weng, 2023).",
    analogy: "Like writing a recipe before cooking. One wrong instruction can throw off the entire meal.",
    role: [
      "Defines a sequence of actions the rest of the system follows.",
      "Controlled by: Brain",
      "Uses: Memory",
      "Updated by: Reflection"
    ],
    links: ["b2p", "p2b", "p2a"],
    step: "planning"
  },
  memory: {
    title: "MEMORY (Context + Persistence)",
    what: "Memory stores and retrieves information, including short-term context and long-term external data. Memory allows agents to build on past steps, but also to reinforce mistakes. Incorrect or outdated memory can be reused repeatedly, amplifying errors across actions and leading to unintended outcomes like misinformation or data exposure (Weng, 2023).",
    analogy: "Like using a shared notebook. If one bad note is written early, every later decision repeats it.",
    role: [
      "Acts as persistent context retrieved before decisions.",
      "Updated after actions to shape future behavior.",
      "Accessed by: Brain, Planning",
      "Updated by: Tools, Reflection"
    ],
    links: ["m2b"],
    step: "planning"
  },
  tools: {
    title: "TOOLS (External Action Layer)",
    what: "Tools allow the agent to act beyond text generation (APIs, search, code execution, financial systems). Tools make agents powerful, but also introduce real world consequences. As agents gain access to systems (banking, files, APIs), mistakes move to real impacts: financial, operational, or security-related (CBA, 2026).",
    analogy: "Like handing someone your keys, card, and phone to run errands - useful, but high impact if misunderstood.",
    role: [
      "Executes actions and expands real-world capability.",
      "Called by: Brain",
      "Returns results to: Brain, Memory"
    ],
    links: ["b2t", "t2b", "b2a", "t2a", "p2a"],
    step: "act"
  },
  safety: {
    title: "AGENT BRAIN (Controller / Decision Core)",
    what: "The controller coordinates planning, memory, tools, and reflection. It decides what to do next and keeps the full loop aligned.",
    analogy: "Like a project manager who delegates tasks, checks context, and keeps the full workflow aligned.",
    role: [
      "Calls planning and tools.",
      "Reads and updates memory.",
      "Adjusts behavior from reflection feedback."
    ],
    links: ["m2b", "b2t", "t2b", "b2p", "p2b", "b2a"],
    step: "planning"
  },
  feedback: {
    title: "REFLECTION (Self-Correction Loop)",
    what: "Reflection allows the agent to evaluate past actions and adjust future behavior. Reflection enables adaptation, but can fail. Agents may generate incorrect self-feedback ('hallucinatory reflection'), reinforcing bad decisions instead of correcting them (Shinn et al., 2023). Over time, this creates self-reinforcing failure loops.",
    analogy: "Like reviewing a test - good reflection catches mistakes; bad reflection doubles down on them.",
    role: [
      "Continuously reviews and critiques prior outputs.",
      "Feeds into: Brain, Planning",
      "Updates: Memory"
    ],
    links: ["p2b", "b2p", "p2a", "p2r", "r2p"],
    step: "planning"
  },
  result: {
    title: "OUTPUT (Final Product)",
    what: "After planning and action, the agent returns a usable final output with findings.",
    analogy: "Like turning rough notes into a finished report.",
    role: [
      "Delivers the result to the user.",
      "Can trigger another loop if refinement is needed."
    ],
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
    <p><strong>What it is:</strong> ${part.what}</p>
    <p><strong>Analogy:</strong> ${part.analogy}</p>
    <p><strong>Connections / Role in System</strong></p>
    <ul>
      ${(part.role || []).map((item) => `<li>${item}</li>`).join("")}
    </ul>
    <p><strong>Loop:</strong> Plan >> Act (Tools) >> Store (Memory) >> Reflect >> Update >> Repeat</p>
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