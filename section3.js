import AOS from 'aos';
import 'aos/dist/aos.css';


const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startGame");
const scoreLabel = document.getElementById("scoreLabel");
const statusLabel = document.getElementById("statusLabel");
const bugOutput = document.getElementById("bug-output");

const keys = { left: false, right: false, fire: false };
const bullets = [];
let bugs = [];

let gameLoopId = null;
let score = 0;
let gameRunning = false;

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

function createBugs() {
  bugs = [];
  const types = ["prompt", "drift", "overreach"];

  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      bugs.push({
        x: 70 + col * 76,
        y: 60 + row * 48,
        w: 36,
        h: 22,
        alive: true,
        type: types[row]
      });
    }
  }
}

function startGame() {
  score = 0;
  scoreLabel.textContent = `Score: ${score}`;
  statusLabel.textContent = "Status: Defending";
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

function checkWin() {
  const remaining = bugs.some((bug) => bug.alive);
  if (!remaining) {
    gameRunning = false;
    statusLabel.textContent = "Status: You defended the agent!";
  }
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#080b19";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (gameRunning) {
    movePlayer();
    moveBullets();
    checkCollisions();
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

if (window.AOS) {
  AOS.init({
    once: true,
    duration: 700
  });
}

createBugs();
loop();