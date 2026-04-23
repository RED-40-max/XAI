const output = document.getElementById("output");
const buildCount = document.getElementById("buildCount");
const progressBar = document.getElementById("progressBar");
const partButtons = document.querySelectorAll("[data-part]");

const selectedParts = new Set();

const partInfo = {
  goal: {
    title: "Goal Parser",
    desc: "This reads your request and turns it into smaller tasks. If the goal is misunderstood, everything else can drift.",
    analogy: "Like reading a recipe title before cooking."
  },
  memory: {
    title: "Memory Bank",
    desc: "This stores earlier facts so the agent can stay consistent across multiple steps.",
    analogy: "Like keeping sticky notes on your desk while working."
  },
  tools: {
    title: "Tool Belt",
    desc: "This lets the agent do actions beyond text, like search, files, API calls, or simple scripts.",
    analogy: "Like having a calculator, map, and flashlight in your backpack."
  },
  safety: {
    title: "Safety Guard",
    desc: "This checks what the agent should avoid. It cannot catch everything, but it reduces risky behavior.",
    analogy: "Like a gatekeeper who asks, 'Should we really do this?'"
  },
  feedback: {
    title: "Feedback Loop",
    desc: "This helps the agent check results and improve on the next attempt.",
    analogy: "Like proofreading your own draft before submitting it."
  }
};

function renderPart(partKey) {
  const part = partInfo[partKey];
  output.innerHTML = `
    <h2>${part.title}</h2>
    <p>${part.desc}</p>
    <p><strong>Simple analogy:</strong> ${part.analogy}</p>
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
  button.addEventListener("click", () => {
    const partKey = button.dataset.part;
    renderPart(partKey);
  });
});

if (window.AOS) {
  AOS.init({
    once: true,
    duration: 700
  });
}