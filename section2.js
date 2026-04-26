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
    what: "Receives the user goal, context, and constraints that start the workflow.",
    analogy: "Like handing a project brief to a team before work begins.",
    examples: [
      "Research EV vs gas cars and summarize findings",
      "Schedule follow-ups based on priorities",
      "Draft a response using past context"
    ],
    risk: "Ambiguous or manipulative prompts can steer the whole system off-track from the first step.",
    links: [],
    step: "prompt"
  },
  goal: {
    title: "PLANNING (Decomposition Engine)",
    what: "Planning breaks a goal into smaller steps so the agent can act systematically. Planning enables complex behavior, but introduces compounding risk. A flawed plan does not fail once; it propagates across every step, making errors harder to detect as they scale (Weng, 2023).",
    analogy: "Like writing a recipe before cooking. One wrong instruction can throw off the entire meal.",
    examples: [
      "Break a research task into search, compare, summarize",
      "Order steps before tool usage",
      "Set subgoals and checkpoints"
    ],
    risk: "Bad planning creates cascading errors: each later step executes confidently on flawed assumptions.",
    links: ["b2p", "p2b", "p2a"],
    step: "planning"
  },
  memory: {
    title: "MEMORY (Context + Persistence)",
    what: "Memory stores and retrieves information, including short-term context and long-term external data. Memory allows agents to build on past steps, but also to reinforce mistakes. Incorrect or outdated memory can be reused repeatedly, amplifying errors across actions and leading to unintended outcomes like misinformation or data exposure (Weng, 2023).",
    analogy: "Like using a shared notebook. If one bad note is written early, every later decision repeats it.",
    examples: [
      "Store recent conversation context",
      "Retrieve prior preferences or constraints",
      "Track intermediate results across steps"
    ],
    risk: "Outdated or poisoned memory can be repeatedly reused, causing persistent misinformation and drift.",
    links: ["m2b"],
    step: "planning"
  },
  tools: {
    title: "TOOLS (External Action Layer)",
    what: "Tools allow the agent to act beyond text generation (APIs, search, code execution, financial systems). Tools make agents powerful, but also introduce real world consequences. As agents gain access to systems (banking, files, APIs), mistakes move to real impacts: financial, operational, or security-related (CBA, 2026).",
    analogy: "Like handing someone your keys, card, and phone to run errands - useful, but high impact if misunderstood.",
    examples: [
      "Use web search and APIs",
      "Write/read files and send updates",
      "Trigger actions in external platforms"
    ],
    risk: "Over-permissioned or misused tools can cause real-world damage: leaks, wrong transactions, or unsafe actions.",
    links: ["b2t", "t2b", "b2a", "t2a", "p2a"],
    step: "act"
  },
  safety: {
    title: "AGENT BRAIN (Controller / Decision Core)",
    what: "The controller coordinates planning, memory, tools, and reflection. It decides what to do next and keeps the full loop aligned.",
    analogy: "Like a project manager who delegates tasks, checks context, and keeps the full workflow aligned.",
    examples: [
      "Select next action from plan",
      "Route requests to tools",
      "Integrate feedback from reflection"
    ],
    risk: "If core reasoning drifts, the whole system can appear coherent while repeatedly making bad decisions.",
    links: ["m2b", "b2t", "t2b", "b2p", "p2b", "b2a"],
    step: "planning"
  },
  feedback: {
    title: "REFLECTION (Self-Correction Loop)",
    what: "Reflection allows the agent to evaluate past actions and adjust future behavior. Reflection enables adaptation, but can fail. Agents may generate incorrect self-feedback ('hallucinatory reflection'), reinforcing bad decisions instead of correcting them (Shinn et al., 2023). Over time, this creates self-reinforcing failure loops.",
    analogy: "Like reviewing a test - good reflection catches mistakes; bad reflection doubles down on them.",
    examples: [
      "Evaluate output quality and relevance",
      "Revise the plan after failed actions",
      "Update memory with corrective notes"
    ],
    risk: "Reflection can become corrupt when false self-critique is treated as truth, reinforcing failure loops.",
    links: ["p2b", "b2p", "p2a", "p2r", "r2p"],
    step: "planning"
  },
  result: {
    title: "OUTPUT (Final Product)",
    what: "After planning and action, the agent returns a usable final output with findings.",
    analogy: "Like turning rough notes into a finished report.",
    examples: [
      "Final summary report",
      "Draft message or recommendation",
      "Structured result with key evidence"
    ],
    risk: "If earlier stages were wrong, output can look polished while hiding inaccurate or unsafe conclusions.",
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
    <p><strong>Analogy / Place in system:</strong> ${part.analogy}</p>
    <p><strong>Examples of what it can do</strong></p>
    <ul>
      ${(part.examples || []).map((item) => `<li>${item}</li>`).join("")}
    </ul>
    <p><strong>What could go wrong / corruption risk:</strong> ${part.risk}</p>
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