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

  // * * *
  //assign functions to keyCodes
  function control(e) {
    if (e.keyCode === 37) {
      moveTetrominoLeft();
    } else if (e.keyCode === 38) {
      rotateTetromino();
    } else if (e.keyCode === 39) {
      moveTetrominoRight();
    } else if (e.keyCode === 40) {
      moveTetrominoDown();
    }
  }
  document.addEventListener("keyup", control);
  // * * *

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

  function moveTetrominoLeft() {
    undrawTetromino();
    const isAtLeftEdge = currentTetromino.some(
      (index) => (currentPosition + index) % width === 0
    );

    // Move only if not at the very edge
    if (!isAtLeftEdge) currentPosition -= 1;

    if (
      currentTetromino.some((index) =>
        squaresArray[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }
    drawTetromino();
  }

  function moveTetrominoRight() {
    undrawTetromino();
    const isAtRightEdge = currentTetromino.some(
      (index) => (currentPosition + index) % width === width - 1
    );

    // Move only if not at the very edge
    if (!isAtRightEdge) currentPosition += 1;

    if (
      currentTetromino.some((index) =>
        squaresArray[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }
    drawTetromino();
  }

  function rotateTetromino() {
    undrawTetromino();
    currentRotation++;
    if (currentRotation === currentTetromino.length) {
      currentRotation = 0;
    }
    currentTetromino = tetrominoesArray[randomValue][currentRotation];
    drawTetromino();
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
