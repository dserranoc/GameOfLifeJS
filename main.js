const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");

const genNumberE = document.getElementsByClassName("generationN");

const resolution = 10;
canvas.width = 800;
canvas.height = 800;

const COLS = canvas.width / resolution;
const ROWS = canvas.height / resolution;

const FPS = 60;

var pause = false;

var genNumber = 0;

function buildGrid() {
  return new Array(COLS)
    .fill(null)
    .map(() =>
      new Array(ROWS).fill(null).map(() => Math.floor(Math.random() * 2))
    );
}

let grid = buildGrid();

stopBtn.addEventListener("click", () => {
  pause = !pause;
  stopBtn.innerHTML = !pause ? "Parar" : "Reanudar";
});

resetBtn.addEventListener("click", () => {
  pause = true;
  grid = buildGrid();
  genNumber = 0;
  pause = false;
});

requestAnimationFrame(update);

function update() {
  if (!pause) {
    grid = nextGen(grid);
    genNumber++;
    genNumberE[0].innerHTML = genNumber;
    render(grid);
  }

  requestAnimationFrame(update);
}

function nextGen(grid) {
  const nextGen = grid.map((arr) => [...arr]);

  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];
      let numNeighbours = 0;
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (i === 0 && j === 0) {
            continue;
          }
          const x_cell = col + i;
          const y_cell = row + j;

          if (x_cell >= 0 && y_cell >= 0 && x_cell < COLS && y_cell < ROWS) {
            const currentNeighbour = grid[col + i][row + j];
            numNeighbours += currentNeighbour;
          }
        }
      }
      // reglas
      if (cell === 1 && numNeighbours < 2) {
        nextGen[col][row] = 0;
      } else if (cell === 1 && numNeighbours > 3) {
        nextGen[col][row] = 0;
      } else if (cell === 0 && numNeighbours === 3) {
        nextGen[col][row] = 1;
      }
    }
  }

  return nextGen;
}
function render(grid) {
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];

      ctx.beginPath();
      ctx.rect(col * resolution, row * resolution, resolution, resolution);
      ctx.fillStyle = cell ? "white" : "black";
      ctx.fill();
      //   ctx.stroke();
    }
  }
}
