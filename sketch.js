/*
Week 4 — Example 1: Grid + Static Maze
Course: GBDA302
Instructors: Dr. Karen Cochrane and David Han
Date: Feb. 5, 2026

PURPOSE: This is the simplest possible p5.js sketch that demonstrates:
1. How a 2D array represents a maze/game level
2. Nested loops to iterate through grid rows/columns
3. Converting grid coordinates (r,c) → screen coordinates (x,y)
4. Tile-based rendering (every cell = one rectangle)
*/

const TS = 32; // TILE SIZE: pixels per grid cell (32x32 squares)
const HUD_H = 56; // reserved space at top for HUD text (pixels)

// Random content
const WORD_LIST = ["GO", "HI", "KEY", "EXIT"];
const NUM_OBSTACLES = 12;
const NUM_WORDS = 4;

/*
GRID LEGEND:
- 0 = floor
- 1 = wall
- 2 = obstacle
- "GO"/"KEY"/... = word tile (string)
*/
const grid = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Keep a copy of the original maze so generation doesn’t erase it
const BASE_GRID = grid.map((row) => row.slice());

function setup() {
  createCanvas(grid[0].length * TS, grid.length * TS + HUD_H);

  noStroke();
  textFont("sans-serif");

  // Make a new set of random extras on start
  generateNewLevel();
}

function draw() {
  background(240);

  drawGrid();

  // HUD bar (blue like the walls)
  push();
  fill(30, 50, 60);
  rect(0, 0, width, HUD_H);
  pop();

  drawHUD();
}

function drawGrid() {
  push();

  // Tile/word text settings
  textAlign(CENTER, CENTER);
  textSize(TS * 0.45);

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      // Base tile (wall/floor)
      if (grid[r][c] === 1) fill(30, 50, 60);
      else fill(230);

      rect(c * TS, HUD_H + r * TS, TS, TS);

      // Obstacle overlay
      if (grid[r][c] === 2) {
        fill(90);
        rect(c * TS + 6, HUD_H + r * TS + 6, TS - 12, TS - 12);
      }

      // Word tile overlay
      if (typeof grid[r][c] === "string") {
        fill(250);
        rect(c * TS + 2, HUD_H + r * TS + 2, TS - 4, TS - 4);

        fill(0);
        text(grid[r][c], c * TS + TS / 2, HUD_H + r * TS + TS / 2);
      }
    }
  }

  pop();
}

function drawHUD() {
  push();

  fill(255); // white text on blue bar
  textAlign(LEFT, TOP);
  textSize(14);

  text("Static array → grid render", 10, 8);
  text("Random add-ons: obstacles + words", 10, 26);
  text("Press R to reroll", 10, 44);

  pop();
}

function generateNewLevel() {
  const rows = grid.length;
  const cols = grid[0].length;

  // Restore the original maze layout first
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      grid[r][c] = BASE_GRID[r][c];
    }
  }

  // Enforce border walls (extra safety)
  for (let c = 0; c < cols; c++) {
    grid[0][c] = 1;
    grid[rows - 1][c] = 1;
  }
  for (let r = 0; r < rows; r++) {
    grid[r][0] = 1;
    grid[r][cols - 1] = 1;
  }

  // Add random obstacles + words only on open floor tiles
  placeRandomTiles(NUM_OBSTACLES, () => 2);
  placeRandomTiles(NUM_WORDS, () => random(WORD_LIST));
}

function placeRandomTiles(count, makeTileValue) {
  let placed = 0;
  let tries = 0;
  const maxTries = 5000;

  while (placed < count && tries < maxTries) {
    tries++;

    const r = floor(random(1, grid.length - 1));
    const c = floor(random(1, grid[0].length - 1));

    if (grid[r][c] === 0) {
      grid[r][c] = makeTileValue();
      placed++;
    }
  }
}

function keyPressed() {
  if (key === "r" || key === "R") {
    generateNewLevel();
  }
}
