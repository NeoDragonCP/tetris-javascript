import { width, tetrominoesArray, tetrominoesColors } from "./tetrominos.js";

document.addEventListener("DOMContentLoaded", () => {
  // Main grid
  const grid = document.getElementById("grid");

  // Mini Grid (Displays next Tetromino)
  const miniGrid = document.getElementById("miniGrid_Display");
  const numberOfSquares = 200;
  const miniGridWidth = 4;
  let miniGridIndex = 0;

  let timerId; // for gametick

  const scoreDisplayLabel = document.getElementById("score-display");
  let score = 0;

  const startBtn = document.getElementById("start-btn");

  const upNextTetrominoArray = [
    [1, miniGridWidth + 1, miniGridWidth * 2 + 1, 2], //lTetromino
    [0, miniGridWidth, miniGridWidth + 1, miniGridWidth * 2 + 1], //zTetromino
    [1, miniGridWidth, miniGridWidth + 1, miniGridWidth + 2], //tTetromino
    [0, 1, miniGridWidth, miniGridWidth + 1], //oTetromino
    [1, miniGridWidth + 1, miniGridWidth * 2 + 1, miniGridWidth * 3 + 1],
  ];

  let currentPosition = 4;
  let currentRotation = 0;
  let randomValue = 0;
  let currentTetromino;
  let currentTetrominoValue = 0;
  let currentTetrominoColor = tetrominoesColors[0];

  function createSquaresInGrid(numOfSquares, numOfTakenSquares, useMiniGrid) {
    let _grid = grid;
    if (useMiniGrid === true) _grid = miniGrid;

    // Create the base grid
    if (numOfSquares >= 1) {
      for (let i = 1; i <= numOfSquares; i++) {
        let gridSquare = document.createElement("div");
        gridSquare.className = "square";
        _grid.append(gridSquare);
      }
    }

    // Create the bottom "taken" divs
    if (numOfTakenSquares >= 1) {
      for (let i = 1; i <= numOfTakenSquares; i++) {
        let takenSquare = document.createElement("div");
        takenSquare.className = "taken";
        _grid.append(takenSquare);
      }
    }
  }

  // Create all the squares in the grid first
  createSquaresInGrid(numberOfSquares, 10, false);

  // Create mini grid
  createSquaresInGrid(16, 0, true);

  //const squaresArray = Array.from(document.getElementsByClassName("square")); // old way just getting the squares
  let squaresArray = Array.from(document.querySelectorAll(".grid div"));
  let miniGridSquaresArray = Array.from(
    document.querySelectorAll(".miniGrid_Display div")
  );

  // Get a random tetromino
  getRandomTetromino();

  // Start moving down
  setUpTimerInterval();

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

  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      drawTetromino();
      setUpTimerInterval();
    }
  });

  // * * *

  function displayMiniGrid() {
    miniGridSquaresArray.forEach((square) => {
      square.classList.remove("tetromino");
    });
    upNextTetrominoArray[randomValue].forEach((index) => {
      miniGridSquaresArray[miniGridIndex + index].classList.add("tetromino");
    });
  }

  function drawTetromino() {
    currentTetromino.forEach((index) => {
      squaresArray[currentPosition + index].classList.add("tetromino");
      squaresArray[currentPosition + index].classList.add("active");
      squaresArray[currentPosition + index].classList.add(
        currentTetrominoColor
      );
    });
  }

  function undrawTetromino() {
    currentTetromino.forEach((index) => {
      squaresArray[currentPosition + index].classList.remove("tetromino");
      squaresArray[currentPosition + index].classList.remove("active");
      squaresArray[currentPosition + index].classList.remove(
        currentTetrominoColor
      );
    });
  }

  function getRandomColorForTetromino() {
    let randomColorIndex = Math.floor(Math.random() * tetrominoesColors.length);

    return tetrominoesColors[randomColorIndex];
  }

  function removeColorFromPassedSquare(piece) {
    for (let i = 0; i < tetrominoesColors.length; i++) {
      piece.classList.remove(tetrominoesColors[i]);
    }
  }

  function getRandomTetromino() {
    // If no random value, get one
    if (randomValue === 0) {
      randomValue = getRandomTetrominoValue();
    }

    // Set the current Tetromino to the previous random value (up next piece)
    currentTetrominoValue = randomValue;
    currentTetromino = tetrominoesArray[currentTetrominoValue][currentRotation];
    currentPosition = 4;

    // Get the next piece and display it in the mini grid
    randomValue = getRandomTetrominoValue();
    currentTetrominoColor = getRandomColorForTetromino();
    displayMiniGrid();
  }

  function getRandomTetrominoValue() {
    return Math.floor(Math.random() * tetrominoesArray.length);
  }

  // Make Tetromino move down
  function setUpTimerInterval() {
    timerId = setInterval(moveTetrominoDown, 500);
  }

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
    currentTetromino = tetrominoesArray[currentTetrominoValue][currentRotation];
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
      currentTetromino.forEach((index) => {
        squaresArray[currentPosition + index].classList.add("taken");
        squaresArray[currentPosition + index].classList.remove("active");
      });

      getRandomTetromino();
      drawTetromino();
      addScore();
      gameOver();
    }
  }

  function addScore() {
    for (let i = 0; i < numberOfSquares - 1; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      if (
        row.every((index) => squaresArray[index].classList.contains("taken"))
      ) {
        score += 10;
        scoreDisplayLabel.innerHTML = score;
        row.forEach((index) => {
          squaresArray[index].classList.remove("taken");
          squaresArray[index].classList.remove("tetromino");
          removeColorFromPassedSquare(squaresArray[index]);
        });
        const squaresRemoved = squaresArray.splice(i, width);
        squaresArray = squaresRemoved.concat(squaresArray);
        squaresArray.forEach((cell) => grid.appendChild(cell));
      }
    }
  }

  function gameOver() {
    if (
      currentTetromino.some((index) =>
        squaresArray[currentPosition + index].classList.contains("taken")
      )
    ) {
      scoreDisplayLabel.innerHTML = "Game Over!";
      clearInterval(timerId);
    }
  }
});
