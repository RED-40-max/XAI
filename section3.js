const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startGame");
const scoreLabel = document.getElementById("scoreLabel");
const levelLabel = document.getElementById("levelLabel");
const statusLabel = document.getElementById("statusLabel");
const bugOutput = document.getElementById("bug-output");
const bugOverlay = document.getElementById("bugOverlay");
const bugOverlayTitle = document.getElementById("bugOverlayTitle");
const bugOverlayText = document.getElementById("bugOverlayText");
const bugOverlayHint = document.getElementById("bugOverlayHint");
const bugOverlayContinue = document.getElementById("bugOverlayContinue");

const keys = { left: false, right: false, fire: false };
const bullets = [];
let bugs = [];
let bugDirection = 1;
let bugStepDown = 16;
let lastBugMoveAt = 0;
let bugMoveIntervalMs = 650;
let nextBugType = 0;

let gameLoopId = null;
let score = 0;
let gameRunning = false;
let level = 1;
let pausedByOverlay = false;

const player = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 38,
  w: 40,
  h: 20,
  speed: 5
};

const bugFacts = {
  prompt: {
    title: "Prompt Injection",
    text: "A sneaky input tries to override the real instructions and hijack behavior."
  },
  drift: {
    title: "Task Drift",
    text: "The model starts moving away from the user goal, even without direct attacks."
  },
  overreach: {
    title: "Autonomy Overreach",
    text: "The agent takes actions with tools that were not actually intended by the user."
  }
};
const bugTypeOrder = ["prompt", "drift", "overreach"];

function createBugs() {
  bugs = [];
  const bugType = bugTypeOrder[nextBugType % bugTypeOrder.length];
  nextBugType += 1;
  const rows = Math.min(3 + Math.floor((level - 1) / 2), 5);
  const cols = 8;
  bugDirection = 1;
  bugStepDown = 16 + Math.min(level, 4);
  bugMoveIntervalMs = Math.max(180, 650 - (level - 1) * 60);
  lastBugMoveAt = performance.now();

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      bugs.push({
        x: 70 + col * 74,
        y: 48 + row * 42,
        w: 36,
        h: 22,
        alive: true,
        type: bugType
      });
    }
  }
}

function startGame() {
  score = 0;
  level = 1;
  nextBugType = 0;
  pausedByOverlay = false;
  scoreLabel.textContent = `Score: ${score}`;
  levelLabel.textContent = `Level: ${level}`;
  statusLabel.textContent = "Status: Defending";
  bugOutput.innerHTML = `
    <h2>Bug Decoder</h2>
    <p>Shoot a bug in-game to see what it represents.</p>
  `;
  bullets.length = 0;
  createBugs();
  gameRunning = true;

  if (gameLoopId) {
    cancelAnimationFrame(gameLoopId);
  }
  loop();
}

function drawPlayer() {
  ctx.fillStyle = "#7ef6de";
  ctx.fillRect(player.x, player.y, player.w, player.h);
  ctx.fillStyle = "#b7fff1";
  ctx.fillRect(player.x + 14, player.y - 8, 12, 8);
}

function drawBullets() {
  ctx.fillStyle = "#ffe182";
  bullets.forEach((bullet) => {
    ctx.fillRect(bullet.x, bullet.y, 4, 10);
  });
}

function drawBugs() {
  bugs.forEach((bug) => {
    if (!bug.alive) return;
    if (bug.type === "prompt") ctx.fillStyle = "#ff6e8a";
    if (bug.type === "drift") ctx.fillStyle = "#ffb84d";
    if (bug.type === "overreach") ctx.fillStyle = "#be8bff";
    ctx.fillRect(bug.x, bug.y, bug.w, bug.h);
    ctx.fillStyle = "#0f0f17";
    ctx.fillRect(bug.x + 12, bug.y + 8, 4, 4);
    ctx.fillRect(bug.x + 20, bug.y + 8, 4, 4);
  });
}

function moveBugs(timestamp) {
  if (timestamp - lastBugMoveAt < bugMoveIntervalMs) return;
  lastBugMoveAt = timestamp;

  let hitWall = false;
  bugs.forEach((bug) => {
    if (!bug.alive) return;
    bug.x += bugDirection * (10 + Math.min(level, 6));
    if (bug.x < 8 || bug.x + bug.w > canvas.width - 8) {
      hitWall = true;
    }
  });

  if (hitWall) {
    bugDirection *= -1;
    bugs.forEach((bug) => {
      if (!bug.alive) return;
      bug.y += bugStepDown;
    });
  }
}

function movePlayer() {
  if (keys.left) player.x -= player.speed;
  if (keys.right) player.x += player.speed;
  player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
}

function moveBullets() {
  bullets.forEach((bullet) => {
    bullet.y -= 7;
  });
  for (let i = bullets.length - 1; i >= 0; i -= 1) {
    if (bullets[i].y < -20) bullets.splice(i, 1);
  }
}

function checkCollisions() {
  bullets.forEach((bullet, bulletIndex) => {
    bugs.forEach((bug) => {
      if (!bug.alive) return;
      const hit =
        bullet.x < bug.x + bug.w &&
        bullet.x + 4 > bug.x &&
        bullet.y < bug.y + bug.h &&
        bullet.y + 10 > bug.y;

      if (hit) {
        bug.alive = false;
        bullets.splice(bulletIndex, 1);
        score += 10;
        scoreLabel.textContent = `Score: ${score}`;
        showBugInfo(bug.type);
      }
    });
  });
}

function showBugInfo(type) {
  const fact = bugFacts[type];
  bugOutput.innerHTML = `
    <h2>${fact.title}</h2>
    <p>${fact.text}</p>
  `;
}

function showBugOverlay({ title, text, hint }) {
  pausedByOverlay = true;
  gameRunning = false;
  bugOverlayTitle.textContent = title;
  bugOverlayText.textContent = text;
  bugOverlayHint.textContent = hint || "Click Continue to return to battle.";
  bugOverlay.classList.remove("is-hidden");
}

function hideBugOverlay() {
  bugOverlay.classList.add("is-hidden");
  pausedByOverlay = false;
}

function checkWin() {
  const remaining = bugs.some((bug) => bug.alive);
  if (!remaining) {
    gameRunning = false;
    const clearedType = bugs[0] ? bugs[0].type : "prompt";
    showBugOverlay({
      title: `Level ${level} Cleared`,
      text: `${bugFacts[clearedType].title}: ${bugFacts[clearedType].text}`,
      hint: "Bug analysis complete. Continue to the next wave."
    });
    level += 1;
    levelLabel.textContent = `Level: ${level}`;
    statusLabel.textContent = "Status: Preparing next level";
  }
}

function checkLose() {
  const breach = bugs.some((bug) => bug.alive && bug.y + bug.h >= player.y - 2);
  if (!breach) return;
  gameRunning = false;
  showBugOverlay({
    title: "Ship Corrupted",
    text: "The alien wave reached your ship and started corrupting core systems.",
    hint: "Bug corruption animation shown. Continue to restart the level."
  });
  statusLabel.textContent = "Status: Ship corrupted";
}

function loop(timestamp = performance.now()) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#080b19";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (gameRunning && !pausedByOverlay) {
    movePlayer();
    moveBugs(timestamp);
    moveBullets();
    checkCollisions();
    checkLose();
    checkWin();
  }

  drawPlayer();
  drawBullets();
  drawBugs();

  gameLoopId = requestAnimationFrame(loop);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") keys.left = true;
  if (event.key === "ArrowRight") keys.right = true;
  if (event.key === " " && !keys.fire && gameRunning) {
    bullets.push({ x: player.x + player.w / 2 - 2, y: player.y - 8 });
    keys.fire = true;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft") keys.left = false;
  if (event.key === "ArrowRight") keys.right = false;
  if (event.key === " ") keys.fire = false;
});

startButton.addEventListener("click", startGame);
bugOverlayContinue.addEventListener("click", () => {
  hideBugOverlay();
  bullets.length = 0;
  player.x = canvas.width / 2 - player.w / 2;
  createBugs();
  gameRunning = true;
  statusLabel.textContent = "Status: Defending";
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

createBugs();
loop();