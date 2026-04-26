const output = document.getElementById("output");
const buildCount = document.getElementById("buildCount");
const progressBar = document.getElementById("progressBar");
const partButtons = document.querySelectorAll(".agent-node");
const flowPaths = document.querySelectorAll(".flow-path");

const selectedParts = new Set();


const partInfo = {
  goal: {
    title: "Planning (Decision Layer)",
    desc: "Planning breaks goals into concrete steps before action. If the plan is wrong, the rest of the loop can look confident while still drifting in the wrong direction.",
    analogy: "Like writing a recipe before cooking. One wrong instruction can throw off the entire meal.",
    links: ["b2p", "p2b", "p2a"]
  },
  memory: {
    title: "Memory (Working + Persistent)",
    desc: "Memory provides both short-term working context and long-term history. This improves continuity, but stale or wrong memory can be reused and amplified.",
    analogy: "Like using a shared notebook. If one bad note is written early, every later decision repeats it.",
    links: ["m2b"]
  },
  tools: {
    title: "Tools (External Action Layer)",
    desc: "Tools and action execution let agents affect the outside world through APIs, files, search, and other systems. This is where model mistakes become real consequences.",
    analogy: "Like handing someone your keys, card, and phone to run errands - useful, but high impact if misunderstood.",
    links: ["b2t", "t2b", "b2a", "t2a", "p2a"]
  },
  safety: {
    title: "Agent Brain (Controller / Decision Core)",
    desc: "The controller coordinates planning, memory, and tools. It is the central orchestration layer where signals are combined into system behavior.",
    analogy: "Like a project manager who delegates tasks, checks context, and keeps the full workflow aligned.",
    links: ["m2b", "b2t", "t2b", "b2p", "p2b", "b2a"]
  },
  feedback: {
    title: "Reflection (Self-Correction Loop)",
    desc: "Reflection reviews outcomes and adjusts future decisions. Strong reflection improves reliability; weak reflection can reinforce bad patterns.",
    analogy: "Like reviewing a test - good reflection catches mistakes; bad reflection doubles down on them.",
    links: ["p2b", "b2p", "p2a"]
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