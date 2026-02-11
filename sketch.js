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

const HUD_H = 56; // / NEW: reserved space at top for HUD text (pixels) // /

// / FIX: REMOVED these lines because text() cannot run outside draw()/setup() // /
// text("Static array → grid render", 10, 8);
// text("Random level: walls + obstacles + words", 10, 26);

// / NEW: word list + counts (edit these to customize) // /
const WORD_LIST = ["GO", "HI", "KEY", "EXIT"]; // / words to place // /
const NUM_OBSTACLES = 12; // / fewer looks nicer in this maze; change if you want // /
const NUM_WORDS = 4; // / change if you want more words // /

/*
GRID LEGEND (how numbers map to visuals):
- 0 = floor (walkable, light gray)
- 1 = wall (blocked, dark teal)
*/
// / NEW LEGEND (extra tile types): // /
// / - 2 = obstacle (drawn as a smaller block on top of floor) // /
// / - "GO"/"HI"/... = word tile (string) // /
const grid = [
  // Row 0 (top edge - all walls)
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

  // Row 1 (open hallway with wall in middle)
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],

  // Row 2 (complex maze pattern)
  [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],

  // Row 3
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],

  // Row 4
  [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],

  // Row 5
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],

  // Row 6
  [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],

  // Row 7
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],

  // Row 8
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],

  // Row 9
  [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],

  // Row 10 (bottom edge - all walls)
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// / NEW: keep a copy of the original maze so random generation doesn’t erase it // /
const BASE_GRID = grid.map((row) => row.slice()); // / copies each row // /

/*
p5.js SETUP: Runs once when sketch loads
*/
function setup() {
  createCanvas(grid[0].length * TS, grid.length * TS + HUD_H); // / NEW: taller canvas for HUD // /

  noStroke();
  textFont("sans-serif");

  // / NEW: generate new “extras” each run while keeping the maze // /
  generateNewLevel(); // /
}

/*
p5.js DRAW: Runs 60 times per second (game loop)
*/
function draw() {
  background(240);

  drawGrid();

  // / FIX: HUD panel at top, same color as walls so it blends with the blue border // /
  push();
  fill(30, 50, 60); // / same as wall color // /
  rect(0, 0, width, HUD_H);
  pop();

  // then draw the HUD text on top of the panel
  drawHUD();
}

// / NEW: draws the whole level (tiles + obstacles + word tiles) // /
function drawGrid() {
  // / We use push/pop so text settings for tiles don’t mess with the HUD // /
  push(); // /

  // / FIX: tile text should be centered, always // /
  textAlign(CENTER, CENTER); // /
  textSize(TS * 0.45); // / fits inside a 32px tile // /

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      // Base tile draw (wall vs floor)
      if (grid[r][c] === 1) {
        fill(30, 50, 60); // wall
      } else {
        fill(230); // floor
      }
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

  pop(); // /
}

// / FIXED: HUD is now drawn inside the top HUD bar, readable (white text) // /
function drawHUD() {
  push();

  fill(255); // / white text on blue bar // /
  textAlign(LEFT, TOP);
  textSize(14);

  text("Static array → grid render", 10, 8);
  text("Random add-ons: obstacles + words", 10, 26);
  text("Press R to reroll", 10, 44);

  pop();
}

// / NEW: builds a new level WITHOUT deleting the maze // /
function generateNewLevel() {
  const rows = grid.length;
  const cols = grid[0].length;

  // restore the original maze layout first
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      grid[r][c] = BASE_GRID[r][c];
    }
  }

  // enforce border walls
  for (let c = 0; c < cols; c++) {
    grid[0][c] = 1;
    grid[rows - 1][c] = 1;
  }
  for (let r = 0; r < rows; r++) {
    grid[r][0] = 1;
    grid[r][cols - 1] = 1;
  }

  // Place random obstacles and words ONLY on empty floors (0)
  placeRandomTiles(NUM_OBSTACLES, () => 2);
  placeRandomTiles(NUM_WORDS, () => random(WORD_LIST));
}

// helper to place N tiles in random empty floor spots
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

// press R to generate a new level while running
function keyPressed() {
  if (key === "r" || key === "R") {
    generateNewLevel();
  }
}
