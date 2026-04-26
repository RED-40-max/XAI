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
    title: "PLANNING (Decision Making / Decomposition)",
    what: "Planning breaks the goal into structured steps the system can follow.",
    analogy: "Like writing a recipe before cooking - every step builds on the last.",
    examples: [
      "Goal decomposition",
      "Subgoal creation",
      "Self-critique before acting",
      "Step-by-step reasoning"
    ],
    scenario: [
      "Analyze message tone",
      "Retrieve past communication patterns",
      "Generate multiple reply options",
      "Evaluate which is most appropriate"
    ],
    fail: [
      "Misses a step (no tone analysis -> bad response)",
      "Overcomplicates the process",
      "Uses wrong assumptions ('daughter is upset' when she is not)",
      "Bad plan causes downstream failures"
    ],
    links: ["b2p", "p2b", "p2a"],
    step: "planning"
  },
  memory: {
    title: "MEMORY (Short-term + Long-term Context)",
    what: "Memory stores and retrieves information to guide decisions.",
    analogy: "Like a notebook you keep referencing - if something wrong is written, it keeps affecting decisions.",
    examples: [
      "Short-term: current conversation",
      "Short-term: detected emotions",
      "Short-term: draft responses",
      "Long-term: daughter's preferences",
      "Long-term: communication patterns",
      "Long-term: past successful responses",
      "Long-term: sensitive topics"
    ],
    scenario: [
      "Remembers: she prefers direct communication",
      "Remembers: sarcasm caused conflict before"
    ],
    fail: [
      "Stores incorrect assumptions ('she is always angry')",
      "Uses outdated information",
      "Leaks sensitive data",
      "Reinforces bad patterns repeatedly"
    ],
    links: ["m2b"],
    step: "planning"
  },
  tools: {
    title: "TOOLS (External Action Layer)",
    what: "Tools execute real actions - searching, analyzing, calculating, and generating outputs.",
    analogy: "Like giving someone your phone, credit card, and access to your accounts to get things done.",
    examples: [
      "Sentiment Analyzer: detect tone",
      "Web Search: find information",
      "Knowledge Base: parenting advice",
      "Calendar: schedule follow-ups"
    ],
    scenario: [
      "Sentiment analyzer detects frustration",
      "Knowledge base suggests calm communication strategies",
      "Message generator drafts replies"
    ],
    fail: [
      "Wrong output (misclassifies tone)",
      "Executes wrong action (sends message instead of drafting)",
      "Causes real-world consequences",
      "Blindly trusts tool output"
    ],
    links: ["b2t", "t2b", "t2a"],
    step: "act"
  },
  safety: {
    title: "BRAIN (Decision Core / Controller)",
    what: "The brain is the central decision-maker. It decides what to do next by coordinating planning, tools, memory, and reflection.",
    analogy: "Like a manager directing a team - telling planning what to break down, tools what to execute, and memory what to recall.",
    examples: [
      "Decides to use sentiment analyzer to understand tone",
      "Chooses knowledge base for parenting advice",
      "Determines whether to generate a reply or ask for more context"
    ],
    scenario: [
      "Sees the message and decides: analyze tone first, then generate response options."
    ],
    fail: [
      "Misreads the situation (serious vs casual)",
      "Picks the wrong tool",
      "Hallucinates confidence",
      "Relies on incorrect memory"
    ],
    links: ["m2b", "b2t", "t2b", "b2p", "p2b", "b2a"],
    step: "planning"
  },
  feedback: {
    title: "REFLECTION (Self-Correction Loop)",
    what: "Reflection evaluates what just happened and adjusts future behavior.",
    analogy: "Like reviewing your answers after a test - but sometimes convincing yourself your wrong answer is right.",
    examples: [
      "Evaluating generated replies",
      "Comparing outcomes to past results",
      "Adjusting tone and strategy"
    ],
    scenario: [
      "Reviews: was that response too harsh?",
      "Adjusts by generating softer alternatives"
    ],
    fail: [
      "Thinks a bad response was good",
      "Reinforces incorrect behavior",
      "Fails to catch obvious mistakes",
      "Creates a loop of worsening decisions"
    ],
    links: ["p2b", "b2p", "p2a", "p2r", "r2p"],
    step: "planning"
  },
  action: {
    title: "ACTION EXECUTION (Where it actually happens)",
    what: "This is where planned steps are actually carried out using tools.",
    analogy: "Like the operations team that executes the approved plan in the real world.",
    examples: [
      "Runs sentiment analysis",
      "Generates replies",
      "Produces insights/graphs",
      "Suggests next actions"
    ],
    scenario: [
      "Executes the selected tools in order and returns concrete outputs."
    ],
    fail: [
      "Runs the correct plan too aggressively",
      "Executes on stale context",
      "Produces outputs without proper verification"
    ],
    links: ["b2a", "t2a", "p2a"],
    step: "act"
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
  act: ["tools", "action", "result"]
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
    <p><strong>In the scenario</strong></p>
    <ul>
      ${(part.scenario || []).map((item) => `<li>${item}</li>`).join("")}
    </ul>
    <p><strong>How it can fail / what could go wrong</strong></p>
    <ul>
      ${(part.fail || []).map((item) => `<li>${item}</li>`).join("")}
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