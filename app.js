document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");
  const width = 10;
  const startBtn = document.getElementById("start-btn");

  // Tetrominoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const tetrominoesArray = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  let currentPosition = 4;
  let currentRotation = 0;
  let randomValue = 0;
  let currentTetromino;

  // Get a random tetromino
  getRandomTetromino();

  function createSquaresInGrid() {
    // Create the base grid
    let numberOfSquaresToCreate = 200;
    for (let i = 1; i <= numberOfSquaresToCreate; i++) {
      let gridSquare = document.createElement("div");
      gridSquare.className = "square";
      grid.append(gridSquare);
    }

    // Create the bottom "taken" divs
    let numberOfTakenSquares = 10;
    for (let i = 1; i <= numberOfTakenSquares; i++) {
      let takenSquare = document.createElement("div");
      takenSquare.className = "taken";
      grid.append(takenSquare);
    }
  }

  // Create all the squares in the grid first
  createSquaresInGrid();

  //const squaresArray = Array.from(document.getElementsByClassName("square")); // old way just getting the squares
  let squaresArray = Array.from(document.querySelectorAll(".grid div"));

  function drawTetromino() {
    currentTetromino.forEach((index) => {
      squaresArray[currentPosition + index].classList.add("tetromino");
    });
  }

  function undrawTetromino() {
    currentTetromino.forEach((index) => {
      squaresArray[currentPosition + index].classList.remove("tetromino");
    });
  }

  function getRandomTetromino() {
    randomValue = getRandomTetrominoValue();
    currentTetromino = tetrominoesArray[randomValue][currentRotation];
    currentPosition = 4;
  }

  function getRandomTetrominoValue() {
    return Math.floor(Math.random() * tetrominoesArray.length);
  }

  // Make Tetromino move down
  timerId = setInterval(moveTetrominoDown, 500);

  function moveTetrominoDown() {
    undrawTetromino();
    currentPosition += width;
    drawTetromino();
    freezeTetromino();
  }

  function freezeTetromino() {
    // if some are taken set them all to taken

    if (
      currentTetromino.some((index) =>
        squaresArray[currentPosition + index + width].classList.contains(
          "taken"
        )
      )
    ) {
      currentTetromino.forEach((index) =>
        squaresArray[currentPosition + index].classList.add("taken")
      );

      getRandomTetromino();
      drawTetromino();
    }
  }
});
