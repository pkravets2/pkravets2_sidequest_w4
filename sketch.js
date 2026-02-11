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

// / NEW: word list + counts (edit these to customize) // /
const WORD_LIST = ["GO", "HI", "KEY", "EXIT"]; // / simple words to place // /
const NUM_OBSTACLES = 18; // / how many obstacles to try placing // /
const NUM_WORDS = 6; // / how many word tiles to try placing // /

/*
GRID LEGEND (how numbers map to visuals):
- 0 = floor (walkable, light gray)
- 1 = wall (blocked, dark teal)
*/
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

// / FIX: you referenced BASE_GRID but didn’t define it in your pasted code // /
// / This stores a copy of your original maze so we can restore it each run // /
const BASE_GRID = grid.map((row) => row.slice()); // / FIX // /

/*
p5.js SETUP: Runs once when sketch loads
*/
function setup() {
  // Canvas size = grid dimensions × tile size
  // grid[0].length = 16 columns, grid.length = 11 rows
  // Canvas = 16×32 = 512px wide, 11×32 = 352px tall
  createCanvas(grid[0].length * TS, grid.length * TS);

  // Drawing style setup
  noStroke(); // No black outlines on tiles (clean look)
  textFont("sans-serif"); // Clean font for UI text
  textSize(14); // Small text size for HUD

  // / NEW: makes word text easier to center in tiles // /
  textAlign(CENTER, CENTER); // / centers text at (x,y) you give it // /

  // / NEW: generate a fresh level EACH run by overwriting values inside grid // /
  generateNewLevel(); // / this edits grid in place (grid stays same size) // /
}

/*
p5.js DRAW: Runs 60 times per second (game loop)
*/
function draw() {
  // Clear screen with light gray background each frame
  background(240);

  // / FIX: ensure tiles/words always use centered alignment each frame // /
  textAlign(CENTER, CENTER); // / FIX // /

  /*
  CORE RENDERING LOOP: Draw every tile in the grid
  
  Nested loops:
  - Outer loop: iterate ROWS (r = 0 to 10)
  - Inner loop: iterate COLUMNS in each row (c = 0 to 15)
  */
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      // TILE TYPE CHECK: What kind of tile is at grid[r][c]?
      if (grid[r][c] === 1) {
        // WALL TILE: Dark teal colour (RGB: 30, 50, 60)
        fill(30, 50, 60);
      } else {
        // FLOOR TILE: Light gray (RGB: 230, 230, 230)
        fill(230);
      }

      rect(c * TS, r * TS, TS, TS);

      // / NEW: draw obstacles ON TOP of floor (without changing your wall/floor logic) // /
      if (grid[r][c] === 2) {
        fill(90);
        rect(c * TS + 6, r * TS + 6, TS - 12, TS - 12);
      }

      // / NEW: draw word tiles if the grid cell stores a string like "GO" // /
      if (typeof grid[r][c] === "string") {
        fill(250);
        rect(c * TS + 2, r * TS + 2, TS - 4, TS - 4);
        fill(0);

        // / FIX: nudge text slightly down so it looks visually centered (optional) // /
        text(grid[r][c], c * TS + TS / 2, r * TS + TS / 2 + 1); // / FIX // /
      }
    }
  }

  // UI LABEL: Explain what students are seeing
  fill(0);

  // / NEW: switch alignment back for HUD text so it behaves like normal labels // /
  textAlign(LEFT, TOP); // / FIX: TOP is more predictable than BASELINE // /

  text("Static array → grid render", 10, 10);
  text("Random level: walls + obstacles + words", 10, 28);
}

// / NEW: builds a new level WITHOUT deleting the maze // /
function generateNewLevel() {
  const rows = grid.length;
  const cols = grid[0].length;

  // / STEP 1: restore the original maze from BASE_GRID (so maze stays!) // /
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      grid[r][c] = BASE_GRID[r][c];
    }
  }

  // / STEP 2: enforce border walls (fixes any accidental border issues) // /
  for (let c = 0; c < cols; c++) {
    grid[0][c] = 1;
    grid[rows - 1][c] = 1;
  }
  for (let r = 0; r < rows; r++) {
    grid[r][0] = 1;
    grid[r][cols - 1] = 1;
  }

  // / STEP 3: place obstacles + words ONLY on floors (0) so walls stay intact // /
  placeRandomTiles(NUM_OBSTACLES, () => 2);
  placeRandomTiles(NUM_WORDS, () => random(WORD_LIST));
}

// / NEW: helper to place N tiles in random empty spots // /
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
