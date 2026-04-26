const output = document.getElementById("output");
const buildCount = document.getElementById("buildCount");
const progressBar = document.getElementById("progressBar");
const partButtons = document.querySelectorAll(".agent-node");
const flowPaths = document.querySelectorAll(".flow-path");

const selectedParts = new Set();


const partInfo = {
  goal: {
    title: "Planning (Decomposition Engine)",
    desc: "Planning breaks a goal into smaller steps so the agent can act systematically. A flawed plan does not fail once - it propagates across every following step.",
    analogy: "Like writing a recipe before cooking. One wrong instruction can throw off the entire meal.",
    links: ["gm", "gf", "fg", "tg", "mg", "sg", "gs"]
  },
  memory: {
    title: "Memory (Context + Persistence)",
    desc: "Memory stores and retrieves past context. It helps continuity, but bad memory can be reused repeatedly and amplify mistakes.",
    analogy: "Like using a shared notebook. If one bad note is written early, every later decision repeats it.",
    links: ["gm", "mg", "mt", "tm"]
  },
  tools: {
    title: "Tools (External Action Layer)",
    desc: "Tools let agents act beyond text - APIs, files, search, and system actions. This increases power and real-world risk.",
    analogy: "Like handing someone your keys, card, and phone to run errands - useful, but high impact if misunderstood.",
    links: ["mt", "tm", "ft", "tg"]
  },
  safety: {
    title: "Safety (Guardrails)",
    desc: "Safety layers check what the agent should avoid. Guardrails reduce risk, but they must be actively designed and updated.",
    analogy: "Like a gatekeeper who checks risky requests before action.",
    links: ["sg", "gs"]
  },
  feedback: {
    title: "Reflection (Self-Correction Loop)",
    desc: "Reflection evaluates past actions and adjusts next steps. It can correct mistakes, but weak reflection may reinforce errors instead.",
    analogy: "Like reviewing a test - good reflection catches mistakes; bad reflection doubles down on them.",
    links: ["gf", "fg", "ft"]
  }
};

function renderPart(partKey) {
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

  output.innerHTML = `
    <h2>${part.title}</h2>
    <p>${part.desc}</p>
    <p><strong>Analogy:</strong> ${part.analogy}</p>
  `;

  selectedParts.add(partKey);
  updateProgress();
}

function updateProgress() {
  const count = selectedParts.size;
  const percent = (count / 5) * 100;
  buildCount.textContent = String(count);
  progressBar.style.width = `${percent}%`;

  if (count === 5) {
    output.innerHTML += `
      <p><strong>Factory Complete:</strong> Your mini agent now has goals, memory, tools, safety, and feedback.</p>
    `;
  }
}

partButtons.forEach((button) => {
  const handleActivate = () => {
    renderPart(button.dataset.part);
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