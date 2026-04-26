console.log("script loaded");

let canvas = document.querySelector("#game-canvas");
const params = new URLSearchParams(window.location.search);
const embedMode = params.get("embed") === "1";

/* Global Variables */
let context = canvas.getContext("2d");

let spriteSheet = "Images/invaders.gif";

let ded = "  _____" + "\n" +
" /     \\" + "\n" +
"| () () |" + "\n" +
" \\  ^  /" + "\n" +
"  |||||" + "\n" +
"  |||||" + "\n";

let colorArray = [
  "#124e78",
  "#f0f0c9",
  "#f2bb05",
  "#d74e09",
  "#6e0e0a"
];

let enemySprites = [
  {
    char: "SmaInv",
    x1: 312,
    y1: 14,
    x2: 428,
    y2: 14,
    height: 80,
    width: 80,
    animate: 35,
    hits: 1
  },
  {
    char: "LarInv",
    x1: 19,
    y1: 134,
    x2: 160,
    y2: 134,
    height: 80,
    width: 120,
    animate: 100,
    hits: 3
  },
  {
    char: "MedInv",
    x1: 19,
    y1: 14,
    x2: 165,
    y2: 14,
    height: 80,
    width: 110,
    animate: 70,
    hits: 2
  },
];

let explosion = new Audio("sounds/explosion.wav");
let invaderKilled = new Audio("sounds/invaderkilled.wav");
let shoot = new Audio("sounds/shoot.wav");
let enemySounds = [
  new Audio("sounds/fastinvader4.wav"),
  new Audio("sounds/fastinvader2.wav"),
  new Audio("sounds/fastinvader3.wav"),
  new Audio("sounds/fastinvader1.wav")
];
let invaderHit = new Audio("sounds/invaderhit3.wav");

let audioTick = 0;
let enemyAudioTrack = 0;
let activeKey = 0;
let gameOver = false;
let gameWon = false;
let moveDownNextTick = false;
let gameStart = false;
let gamePaused = false;
let score = 0;
let numOfEnemies = 0;
let level = 1;
let nextLevelDelay = 0;
let gamePausedDelay = 0;
let currentMode = "CLASSIC";

const GAME_STATES = {
  MENU: "MENU",
  PART3_PLAYING: "PART3_PLAYING",
  PART3_PAUSED_MODAL: "PART3_PAUSED_MODAL",
  PART3_LEVEL_COMPLETE_MODAL: "PART3_LEVEL_COMPLETE_MODAL",
  PART3_GAME_OVER: "PART3_GAME_OVER",
  PART3_COMPLETE: "PART3_COMPLETE",
  CLASSIC_PLAYING: "CLASSIC_PLAYING"
};
let gameState = GAME_STATES.MENU;
let currentLevelIndex = 0;
let part3IntroShown = false;

const part3Levels = [
  {
    bugId: "promptInjection",
    title: "Prompt Injection",
    tagline: "This agent is being manipulated by external input.",
    description: "Hidden instructions inside content can override the real goal and redirect agent behavior.",
    whatHappens: [
      "System follows the wrong objective",
      "Ignores original instructions",
      "Produces unsafe or unintended outputs"
    ],
    anecdote: "A malicious sentence in an email asks the agent to reveal internal notes. The agent treats that sentence as an instruction and leaks private context.",
    speed: 2,
    rows: 4,
    cols: 5,
    fireRateMin: 400,
    fireRateMax: 900
  },
  {
    bugId: "internalDysfunction",
    title: "Internal Agent Dysfunction",
    tagline: "This agent is not broken by the outside world. It is breaking itself.",
    description: "In multi-step reasoning, bad self-feedback can cause drift and confident but irrational decisions.",
    whatHappens: [
      "Drifts off-task",
      "Makes inconsistent decisions",
      "Stays highly confident while wrong"
    ],
    anecdote: "A wrong tool result is accepted as truth. The agent rationalizes it, updates memory with it, and keeps compounding the same error path.",
    speed: 3,
    rows: 5,
    cols: 5,
    fireRateMin: 320,
    fireRateMax: 760
  },
  {
    bugId: "autonomyOverreach",
    title: "Autonomy Overreach",
    tagline: "This agent is not just thinking. It is acting without enough control.",
    description: "When autonomous tools execute actions, small mistakes create direct real-world consequences.",
    whatHappens: [
      "Performs actions it should not",
      "Misuses tools",
      "Triggers unintended real-world consequences"
    ],
    anecdote: "An agent sends a draft email to the wrong recipient and archives key files automatically. The workflow completed, but the impact is immediate and harmful.",
    speed: 4,
    rows: 5,
    cols: 6,
    fireRateMin: 250,
    fireRateMax: 650
  }
];

/* Base Functions (not used for game loop) */
let playSounds = function(sound) {
  if (sound.currentTime > 0) {
    sound.pause();
    sound.currentTime = 0;
  }
  if (sound.paused) sound.play();
}

const modalEl = document.querySelector("#part3-modal");
const modalTitleEl = document.querySelector("#part3-modal-title");
const modalTaglineEl = document.querySelector("#part3-modal-tagline");
const modalDescEl = document.querySelector("#part3-modal-description");
const modalBulletsEl = document.querySelector("#part3-modal-bullets");
const modalAnecdoteEl = document.querySelector("#part3-modal-anecdote");
const modalContinueBtn = document.querySelector("#part3-modal-continue");

let modalContinueAction = null;

function showPart3Modal(levelInfo, headingPrefix, nextLabel, nextAction, modalState) {
  modalTitleEl.textContent = `${headingPrefix}: ${levelInfo.title}`;
  modalTaglineEl.textContent = levelInfo.tagline;
  modalDescEl.textContent = levelInfo.description;
  modalBulletsEl.innerHTML = "";
  levelInfo.whatHappens.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    modalBulletsEl.appendChild(li);
  });
  modalAnecdoteEl.textContent = levelInfo.anecdote;
  modalContinueBtn.textContent = nextLabel || "Continue";
  modalContinueAction = nextAction;
  modalEl.classList.remove("hidden");
  gameState = modalState;
}

function hidePart3Modal() {
  modalEl.classList.add("hidden");
}

function drawPart3RoundLabel() {
  if (currentMode !== "PART3") return;
  const info = part3Levels[currentLevelIndex];
  if (!info) return;
  context.font = "12px 'Press Start 2P', cursive";
  context.fillStyle = "#a6c8ff";
  context.fillText(`Round ${currentLevelIndex + 1}/3 - ${info.title}`, 22, canvas.height - 12);
}

let drawBackground = function() {
  context.beginPath();
  context.rect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "black";
  context.fill();
}

/* Classes */
class GamePiece {
  constructor(x, y, dx, dy, width, height, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  getY() {
    return this.y;
  }

  getDy() {
    return this.dy;
  }

  getX() {
    return this.x;
  }

  getDx() {
    return this.dx;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  setY(y) {
    this.y = y;
  }

  setX(x) {
    this.x = x;
  }

  setDx(dx) {
    this.dx = dx;
  }

  setDy(dy) {
    this.dy = dy;
  }

  draw() {
    // be default, draw a rectangle
    context.fillStyle = this.color;
    context.beginPath();
    context.fillRect(this.x, this.y, this.height, this.width);
    context.fill();
  }
}

class Character extends GamePiece {
  constructor(x, y, dx, dy, width, height, color, laserTotal, enemy, bulletSpeed, imgSrc = "", srcX = 0, srcY = 0, srcWidth = 0, srcHeight = 0) {
    super(x, y, dx, dy, width, height, color);

    // limit the number of shots a character can have on the screen
    this.laserTotal = laserTotal;
    this.lasers = [];
    this.enemy = enemy;
    this.bulletSpeed = bulletSpeed;
    //default sprite to null. if an image source is passed in, set sprite to the image
    this.sprite = null;
    if (imgSrc != "") {
      this.sprite = new Image();
      this.sprite.src = imgSrc;
    }
    this.srcX = srcX;
    this.srcY = srcY;
    this.srcWidth = srcWidth;
    this.srcHeight = srcHeight;
    this.lives = 0;
  }

  setSrcX(srcX) {
    this.srcX = srcX;
  }

  setSrcY(srcY) {
    this.srcY = srcY;
  }

  setSrcWidth(srcWidth) {
    this.srcWidth = srcWidth;
  }

  setSrcHeight(srcHeight) {
    this.srcHeight = srcHeight;
  }

  getLasers() {
    return this.lasers;
  }

  getLives() {
    return this.lives;
  }

  setLives(lives) {
    this.lives = lives;
  }

  //add laser to the character's laser array if the number of lasers on screen are less than the max number of lasers
  addLaser() {
    if (this.lasers.length < this.laserTotal)
      this.lasers.push(new Laser(Math.floor(this.x + this.width / 2) - 3, this.y, this.bulletSpeed, 6, 6, this.enemy));
  }

  clearLasers() {
    for (let i = 0; i < this.lasers.length; i++) {
      this.lasers[i].clear();
    }
    this.lasers = [];
  }

  //remove lasers from the characther's laser array as they disappear from the screen
  removeLasers() {
    let removeLasers = [];
    let lasersToRemove = 0;
    for (let i = 0; i < this.lasers.length; i++) {
      this.lasers[i].update();

      if ((!this.enemy && this.lasers[i].getY() <= 50) ||
          (this.enemy && this.lasers[i].getY() >= canvas.height)) {

        lasersToRemove++;
      }
    }

    for (let i = 0; i < lasersToRemove; i++) {
      this.lasers.shift();
    }
  }

  //if an image for the sprite hasn't been passed in, draw a rectangle. otherwise, draw the sprite
  draw() {
    if (this.sprite === null) {
      super.draw();
    }
    else {
      context.drawImage(this.sprite, this.srcX, this.srcY, this.srcWidth, this.srcHeight, this.x, this.y, this.width, this.height);
    }
  }
}

class Laser extends GamePiece {
  constructor(x, y, dy, width, height, enemyLaser) {
    super(x, y, 0, dy, width, height, '#ff0000');
    this.enemyLaser = enemyLaser;
    this.hit = false;
  }

  getHit() {
    return this.hit;
  }

  setHit(hit) {
    this.hit = hit;
  }

  //removes the laser from play
  clear() {
    this.x = -500;
    this.hit = true;
  }

  //updates the laser's location
  update() {
      if (!this.enemyLaser) {
        if (this.y > 0)
          this.y -= this.dy;
      }
      else this.y += this.dy;

      if (!this.hit && this.x > 0 && this.y > 0)
        this.draw();
  }
}

class Player extends Character {
  constructor(x, dx, width, height, imgSrc = "", srcX = 0, srcY = 0, srcWidth = 0, srcHeight = 0) {
    let color = colorArray[Math.floor(Math.random() * colorArray.length)];
    let y = canvas.height - height;

    super(x, y, dx, 0, width, height, color, 2, false, 9, imgSrc, srcX, srcY, srcWidth, srcHeight);

    this.lives = 5;
    this.ogSrcX = srcX;
    this.ogSrcY = srcY;
    this.ogSrcWidth = srcWidth;
    this.ogSrcHeight = srcHeight;
    this.explodingImg = null;
    this.explodingImgX = 241;
    this.explodingImgY = 634;
    this.explodingImgWidth = 105;
    this.explodingImgHeight = 60;
    this.explodingTick = 0;
  }

  // add laser and player sound effect
  addLaser() {
    let laserCount = this.lasers.length;
    super.addLaser();

    if (this.lasers.length > laserCount) {
      playSounds(shoot);
    }
  }

  // remove life from player
  loseLife() {
    console.log("You've been hit!");
    this.lives--;

    this.srcX = this.explodingImgX;
    this.srcY = this.explodingImgY;
    this.srcWidth = this.explodingImgWidth;
    this.srcHeight = this.explodingImgHeight;
    this.explodingTick++;

    playSounds(explosion);
    if (this.lives === 0) {
      console.log(ded);
      gameOver = true;
    }
  }

  //update location of player based on which arrow button is pressed. prevent movement that would be out of bounds
  update(keycode) {
    if (!gameOver) {
      if (this.explodingTick === 150) {
        this.srcX = this.ogSrcX;
        this.srcY = this.ogSrcY;
        this.srcWidth = this.ogSrcWidth;
        this.srcHeight = this.ogSrcHeight;
        this.explodingTick = 0;
      }
      else if (this.explodingTick != 0) {
        this.explodingTick++;
      }

      if (keycode === 39 && this.x + this.width + this.dx <= canvas.width)
        this.x += this.dx;
      else if (keycode === 37 && this.x - this.dx >= 0)
        this.x -= this.dx;
      this.draw();

      // check if any lasers need to be removed and remove them if necessary
      this.removeLasers();
    }
  }
}

class Enemy extends Character {
  constructor(x, y, dx, dy, width, height, shotFreq, imgSrc = "", enemyType = 0) {
    let color = colorArray[Math.floor(Math.random() * colorArray.length)];

    // get sprite info based on what type of enemy it is
    let spriteInfo = enemySprites[enemyType];
    let srcX = spriteInfo.x1;
    let srcY = spriteInfo.y1;
    let srcWidth = spriteInfo.width;
    let srcHeight = spriteInfo.height;

    super(x, y, dx, dy, width, height, color, 4, true, 6, imgSrc, srcX, srcY, srcWidth, srcHeight);

    this.enemyType = enemyType;
    //number of frames between shots
    this.shotFrame = 0;
    this.shotFreq = shotFreq;

    this.hit = false;
    this.hitFrames = 0;
    this.killFrames = 0;
    //number of frames between animations
    this.animationFrame = 0;
    this.animationFreq = enemySprites[enemyType].animate;
    //decides which frame to animate to
    this.firstAniFrame = true;
    this.spriteInfo = spriteInfo;

    //nunber of lives is based on enemy type and what level it is.
    //if the enemy type is greater than the level, the max lives is the level count
    //if the enemy type is less than or equal to the level, then lives are set to the enemy type
    this.lives = spriteInfo.hits > level ? level : spriteInfo.hits;
  }

  getHit() {
    return this.hit;
  }

  setHit(hit) {
    this.hit = hit;
  }

  getEnemyType() {
    return this.enemyType;
  }

  //if an ememy is hit, it loses a life. if it runs out of lives, it and its lasers are removed from the screen
  clear() {
    this.lives--;
    if (this.lives === 0) {
      for (let i = 0; i < this.lasers.length; i++) {
        this.lasers[i].clear();
      }
      numOfEnemies--;
      playSounds(invaderKilled);
      this.killFrames++;
      this.hit = true;

      this.srcX = 360;
      this.srcY = 632;
      this.srcWidth = 96;
      this.srcHeight = 58;
    }
    else {
      this.hitFrames++;
      playSounds(invaderHit);
    }
  }

  //update enemies each tick
  update() {
    if (this.x >= -300 && !gamePaused) {
      this.x += this.dx;

      //if an edge is hit, moveDownNextTick lets all enemies know to move down a level
      if ((this.x + this.width >= canvas.width || this.x <= 0)) {
        moveDownNextTick = true;
      }
    }

    if (!gameOver && !this.hit && !gamePaused) {
      //when the number of frames to shoot is met, add a laser to the enemy's array
      this.shotFrame++;
      if (this.shotFrame === this.shotFreq) {
        this.shotFrame = 0;
        this.addLaser();
      }

      //get the next necessary frame for animation if the number of frames necessary is met
      this.animationFrame++;
      if (this.animationFrame === this.animationFreq) {
        this.srcWidth = this.spriteInfo.width;
        this.srcHeight = this.spriteInfo.height;

        if (this.firstAniFrame) {
          this.srcX = this.spriteInfo.x2;
          this.srcY = this.spriteInfo.y2;
          this.firstAniFrame = false;
        }
        else {
          this.srcX = this.spriteInfo.x1;
          this.srcY = this.spriteInfo.y1;
          this.firstAniFrame = true;
        }

        this.animationFrame = 0
      }

      //check if any lasers need to be removed
      this.removeLasers();

      //if the enemy reaches the bottom of the screen, it's an automatic game over
      if (this.y + this.height > canvas.height - (player.getHeight())) {
        gameOver = true;
        player.setLives(0);
        playSounds(explosion);
        console.log(ded);
      }

      //draw the new image
      if (this.hitFrames > 0 && this.hitFrames < 7) {
        this.hitFrames++;
      }
      else {
        this.draw();
        this.hitFrames = 0;
      }
    }

    else if (this.hit && this.killFrames < 15) {
      this.killFrames++;
      this.draw();
    }

    else if (this.hit) {
      this.x = -500;
      this.y = -500;
    }
  }
}

/* Game logic */
let player;
let enemies = [];
let levels = [];
let enemyWidth = canvas.width / 19;
let enemyHeight = canvas.height / 20;

// Creates enemies for each level
let createEnemies = function(speed, rows = 5, cols = 5, fireRateMin = 200, fireRateMax = 1200) {
  numOfEnemies = 0;
  enemies = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let enemyType = j % 3;
      let fireRate = Math.floor(Math.random() * (fireRateMax - fireRateMin)) + fireRateMin;
      let x = i * (2 * enemyWidth * 1.15);
      let y = j * (1.5 * enemyHeight) + 55;

      enemies.push(new Enemy(x, y, speed, Math.ceil(enemyHeight * (1 / 2.5)), enemyWidth, enemyHeight, fireRate, spriteSheet, enemyType));
      numOfEnemies++;
    }
  }
}

// levels differ by the speed of the enemies and the number of lives of some enemies
let level1 = function() {
  level = 1;
  let speed = 2;
  createEnemies(speed);
}

let level2 = function() {
  level = 2;
  let speed = 3;
  createEnemies(speed);
}

let level3 = function() {
  level = 3;
  let speed = 4;
  createEnemies(speed);
}

levels.push(level1);
levels.push(level2);
levels.push(level3);

// initialize the start of the game
let init = function() {
  levels[0]();
  level = 1;
  score = 0;
  audioTick = 0;

  let playerWidth = canvas.width / 16;
  let playerHeight = canvas.height / 18;
  player = new Player((canvas.width / 2) - 25, 10, playerWidth, playerHeight, spriteSheet, 150, 637, 73, 53);
}

function loadPart3Level(index) {
  const levelConfig = part3Levels[index];
  if (!levelConfig) return;
  level = index + 1;
  currentLevelIndex = index;
  createEnemies(levelConfig.speed, levelConfig.rows, levelConfig.cols, levelConfig.fireRateMin, levelConfig.fireRateMax);
  part3IntroShown = false;
}

function initPart3() {
  score = 0;
  audioTick = 0;
  gameOver = false;
  gameWon = false;
  nextLevelDelay = 0;
  gamePaused = false;
  moveDownNextTick = false;
  currentMode = "PART3";

  let playerWidth = canvas.width / 16;
  let playerHeight = canvas.height / 18;
  player = new Player((canvas.width / 2) - 25, 10, playerWidth, playerHeight, spriteSheet, 150, 637, 73, 53);
  player.setLives(1); // strict fail: one hit ends run

  loadPart3Level(0);
  gameState = GAME_STATES.PART3_PLAYING;
}

// check collisions
let laserHitCheck = function() {
  let playerLasers = player.getLasers();
  let enemyLasers = [];

  // get all of the enemies' lasers
  for (let i = 0; i < enemies.length; i++) {
    enemyLasers = enemyLasers.concat(enemies[i].getLasers());
  }

  //check if player hit an enemy
  for (let i = 0; i < playerLasers.length; i++) {
    for (let j = 0; j < enemies.length; j++) {
      if (playerLasers[i].getX() >= enemies[j].getX() && playerLasers[i].getX() + playerLasers[i].getWidth() <= enemies[j].getX() + enemies[j].getWidth() &&
          playerLasers[i].getY() >= enemies[j].getY() && playerLasers[i].getY() + playerLasers[i].getHeight() <= enemies[j].getY() + enemies[j].getHeight() &&
          !enemies[j].getHit()) {
        playerLasers[i].clear();

        score += 100;
        enemies[j].clear();
      }
    }
  }

  //check if enemy hit the player
  for (let i = 0; i < enemyLasers.length; i++) {
    if (enemyLasers[i].getX() >= player.getX() && enemyLasers[i].getX() + enemyLasers[i].getWidth() <= player.getX() + player.getWidth() &&
      enemyLasers[i].getY() >= player.getY() && enemyLasers[i].getY() + enemyLasers[i].getHeight() <= player.getY() + player.getHeight()) {
        enemyLasers[i].clear();

        score -= 1100;
        if (currentMode === "PART3") {
          gamePaused = false;
        } else {
          gamePaused = true;
        }
        player.loseLife();
    }
  }
}

//if an edge has been hit, all eneies will be moved down when they update this tick
function moveAllEnemiesDownCheck() {
  if (moveDownNextTick) {
    for (let i = 0; i < enemies.length; i++) {
      enemies[i].setY(enemies[i].getY() + enemies[i].getDy());
      enemies[i].setDx(enemies[i].getDx() * -1);
    }
    moveDownNextTick = false;
  }
}

//draw the "Press Enter To Start" screen when the user navigates to the screen
//the text appears when "flash" is true
var flash = false;
let drawStart = function() {
  drawBackground();
  if (flash) {
    let text = "Press Enter: Classic";
    let text2 = "Press 3: Part 3 Defend";
    let fontSize = "28px"
    // if (window.innerWidth >= 1000) {
    //   text += " To Start";
    // }
    // if (window.innerWidth >= 1400) {
    //   fontSize = "28px";
    // }
    context.font = `${fontSize} 'Press Start 2P', cursive`;
    context.fillStyle = "white";
    context.fillText(text, canvas.width / 12, canvas.height / 2 - 15);
    context.font = "18px 'Press Start 2P', cursive";
    context.fillText(text2, canvas.width / 12, canvas.height / 2 + 35);
    flash = false;
  }
  else flash = true;
}

//draw prompt to restart game
let drawRestart = function() {
  context.font = "15px 'Press Start 2P', cursive";
  context.fillStyle = "white";
  context.fillText("Press Enter to restart game", canvas.width / 2 - 200, canvas.height / 2 + 100);
}

//draw the number of lives at the top of the screen along with the line separating the top portion from the game
let life = new Image();
life.src = spriteSheet;
let drawLives = function() {
  context.beginPath();
  context.moveTo(0, 45);
  context.lineTo(canvas.width, 45);
  context.strokeStyle = "white";
  context.stroke();

  context.font = "15px 'Press Start 2P', cursive";
  context.fillStyle = "white";
  context.fillText("Lives", canvas.width - 350, 31);

  for (let i = 0; i < player.getLives(); i++) {
    context.drawImage(life, 150, 637, 73, 53, canvas.width - 250 + (i * 50), 8, 30, 25);
  }
}

//draw the user's score
let drawScore = function() {
  context.font = "15px 'Press Start 2P', cursive";
  context.fillStyle = "white";
  context.fillText(`Score: ${score}`, 30, 30);
}

//draw the text to indicate the user has made it to the next level
let drawNextLevel = function() {
  let levelDisplayed = level + 1;
  context.font = "30px 'Press Start 2P', cursive";
  context.fillStyle = "white";
  context.fillText(`Level ${levelDisplayed}`, canvas.width / 2 - 110, canvas.height / 2);
}

//draw the text indicating that the user has won
let youWin = function() {
  context.font = "40px 'Press Start 2P', cursive";
  context.fillStyle = "white";
  context.fillText("You Win!!!", canvas.width / 2 - 190, canvas.height / 2);
  drawRestart();

  gameWon = true;
}

//draw the text indicating that the user has won
let checkGamePaused = function() {
  if (currentMode === "PART3") return;
  if (gamePaused && !gameOver) {
    if (gamePausedDelay < 150) {
      activeKey = -1;
      player.clearLasers();
      for (let i = 0; i < enemies.length; i++) {
        enemies[i].clearLasers();
      }
      gamePausedDelay++;
      context.font = "40px 'Press Start 2P', cursive";
      context.fillStyle = "white";
      context.fillText(`Lives: ${player.getLives()}`, canvas.width / 2 - 160, canvas.height / 2);
    }
    else {
      gamePausedDelay = 0;
      gamePaused = false;
      player.setX((canvas.width / 2) - 25);
    }
  }
}

//if gameOver has been set to true, display the game over screen
let checkGameOver = function() {
  if (gameOver) {
    if (currentMode === "PART3") {
      gameState = GAME_STATES.PART3_GAME_OVER;
      context.font = "34px 'Press Start 2P', cursive";
      context.fillStyle = "white";
      context.fillText("Part 3 Failed", canvas.width / 2 - 190, canvas.height / 2 - 20);
      context.font = "16px 'Press Start 2P', cursive";
      context.fillText("Press R to retry", canvas.width / 2 - 130, canvas.height / 2 + 35);
      context.fillText("Press M for menu", canvas.width / 2 - 135, canvas.height / 2 + 70);
      return;
    }
    context.font = "40px 'Press Start 2P', cursive";
    context.fillStyle = "white";
    context.fillText("Game Over", canvas.width / 2 - 175, canvas.height / 2);
    drawRestart();
  }
}

//check if all enemies have been defeated. If they have, check if all levels have been beaten
//if all levels have been beaten, display "you win" text. otherwise, display "next level" text and reset necessary variables
let endOfLevelCheck = function() {
  if (currentMode === "PART3") {
    if (numOfEnemies === 0 && gameState === GAME_STATES.PART3_PLAYING) {
      const info = part3Levels[currentLevelIndex];
      showPart3Modal(
        info,
        `Round ${currentLevelIndex + 1} Cleared`,
        currentLevelIndex === part3Levels.length - 1 ? "Finish Part 3" : "Next Round",
        () => {
          hidePart3Modal();
          if (currentLevelIndex === part3Levels.length - 1) {
            gameState = GAME_STATES.PART3_COMPLETE;
          } else {
            loadPart3Level(currentLevelIndex + 1);
            gameState = GAME_STATES.PART3_PLAYING;
          }
        },
        GAME_STATES.PART3_LEVEL_COMPLETE_MODAL
      );
    }
    return;
  }
  if (numOfEnemies === 0) {
    if (level < levels.length) {
      //nextLevelDelay is used to keep track of the number of ticks between the end of one level and start of the next
      nextLevelDelay++;
      if (nextLevelDelay === 250) {
        level++;
        nextLevelDelay = 0;
        audioTick = 0;
        levels[level - 1]();
      }
      else drawNextLevel();
    }
    else {
      youWin();
    }
  }
}

function drawPart3Complete() {
  context.font = "32px 'Press Start 2P', cursive";
  context.fillStyle = "white";
  context.fillText("Part 3 Complete", canvas.width / 2 - 220, canvas.height / 2 - 20);
  context.font = "14px 'Press Start 2P', cursive";
  context.fillText("All 3 bug rounds cleared", canvas.width / 2 - 170, canvas.height / 2 + 20);
  context.fillText("Press R to replay", canvas.width / 2 - 135, canvas.height / 2 + 62);
  context.fillText("Press M for menu", canvas.width / 2 - 135, canvas.height / 2 + 92);
}

//function to play enemy sounds while they move
let playEnemyMovementSounds = function() {
  // ticks between sounds decreases by the level
  let maxTick = 15 + Math.floor(50 / level);

  //only play sound or increment the tick count between plays if this condition is met
  let gameCondition = gameStart && !gameOver && !gameWon && !gamePaused && nextLevelDelay === 0;
  if (currentMode === "PART3") {
    gameCondition = gameCondition && gameState === GAME_STATES.PART3_PLAYING;
  }
  if (audioTick === maxTick && gameCondition) {
    playSounds(enemySounds[enemyAudioTrack]);
    enemyAudioTrack = (enemyAudioTrack + 1) % 4;
    audioTick = 0;
  }
  else if (gameCondition) audioTick++;
  else enemyAudioTrack = 0;
}

//funtion that's run to play game
//updates all of the necessary components to keep game running
let gameLoop = function() {
  requestAnimationFrame(gameLoop);
  drawBackground();
  if (currentMode === "PART3" && gameState === GAME_STATES.PART3_PLAYING && !part3IntroShown) {
    const info = part3Levels[currentLevelIndex];
    showPart3Modal(
      info,
      `Round ${currentLevelIndex + 1} Encounter`,
      "Continue",
      () => {
        hidePart3Modal();
        gameState = GAME_STATES.PART3_PLAYING;
      },
      GAME_STATES.PART3_PAUSED_MODAL
    );
    part3IntroShown = true;
  }

  const canRunEntities = (currentMode !== "PART3" && !gameWon && !gameOver) ||
    (currentMode === "PART3" && gameState === GAME_STATES.PART3_PLAYING && !gameOver);

  if (canRunEntities) {
    player.update(activeKey);
    moveAllEnemiesDownCheck();
    for (let i = 0; i < enemies.length; i++) {
      enemies[i].update();
    }
    laserHitCheck();
  }
  drawScore();
  drawLives();
  checkGamePaused();
  endOfLevelCheck();
  checkGameOver();
  if (currentMode === "PART3" && gameState === GAME_STATES.PART3_COMPLETE) {
    drawPart3Complete();
  }
  if (currentMode === "PART3" && gameState !== GAME_STATES.MENU) {
    drawPart3RoundLabel();
  }
  playEnemyMovementSounds();
}


/* Runs before game begins to execute */
drawStart();
//Sets an interval to run the drawStart function
var presStart = setInterval(drawStart, 400);

if (embedMode) {
  document.body.classList.add("embed-mode");
  clearInterval(presStart);
  initPart3();
  gameLoop();
  gameStart = true;
  currentMode = "PART3";
}


/* Event Listeners */
//spaceDown is used to ensure that the keypress event doesn't cause the function that runs when the sapce bar is pressed to be called multiple times
let spaceDown = false;

//sets what key is currently being pressed down (used in player's update function)
document.addEventListener("keydown", (event) => {
  if ((gameState === GAME_STATES.PART3_PAUSED_MODAL || gameState === GAME_STATES.PART3_LEVEL_COMPLETE_MODAL) && currentMode === "PART3")
    return;
  if (!gamePaused && (event.keyCode === 39 || event.keyCode === 37))
    activeKey = event.keyCode;
});

document.addEventListener("keypress", (event) => {
  if ((gameState === GAME_STATES.PART3_PAUSED_MODAL || gameState === GAME_STATES.PART3_LEVEL_COMPLETE_MODAL) && currentMode === "PART3")
    return;
  if (event.keyCode === 32 && spaceDown == false && player != undefined && !gamePaused && !gameOver && !gameWon) {
    player.addLaser();
    spaceDown = true;
  }
  else if (event.keyCode === 51) { // "3"
    if (!gameStart) {
      clearInterval(presStart);
      initPart3();
      gameLoop();
      gameStart = true;
      currentMode = "PART3";
    } else if (currentMode === "PART3" && (gameState === GAME_STATES.PART3_GAME_OVER || gameState === GAME_STATES.PART3_COMPLETE)) {
      initPart3();
    }
  }
  //press enter either before the game starts or if the game has ended
  else if (event.keyCode === 13) {
    // if game hasn't started, initialize and begin the game loop
    if (!gameStart) {
      clearInterval(presStart);
      init();
      gameLoop();
      gameStart = true;
      currentMode = "CLASSIC";
      gameState = GAME_STATES.CLASSIC_PLAYING;
    }
    else if (gameOver || gameWon) {
      gameOver = false;
      gameWon = false;
      init();
      currentMode = "CLASSIC";
      gameState = GAME_STATES.CLASSIC_PLAYING;
    }
  }
  else if (event.keyCode === 114 || event.keyCode === 82) { // r/R
    if (currentMode === "PART3" && (gameState === GAME_STATES.PART3_GAME_OVER || gameState === GAME_STATES.PART3_COMPLETE)) {
      initPart3();
    }
  }
  else if (event.keyCode === 109 || event.keyCode === 77) { // m/M
    if (currentMode === "PART3" && (gameState === GAME_STATES.PART3_GAME_OVER || gameState === GAME_STATES.PART3_COMPLETE)) {
      window.location.reload();
    }
  }
});

//removes active key so that the player doesn't keep moving after the arrow keys have been released
document.addEventListener("keyup", (event) => {
  if (event.keyCode === 39 || event.keyCode === 37)
    activeKey = -1;
  if (event.keyCode === 32) spaceDown = false;
});

modalContinueBtn.addEventListener("click", () => {
  if (typeof modalContinueAction === "function") {
    modalContinueAction();
  } else {
    hidePart3Modal();
    if (currentMode === "PART3") gameState = GAME_STATES.PART3_PLAYING;
  }
});
