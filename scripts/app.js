import { width, tetrominoesArray, tetrominoesColors } from "./tetrominos.js";

document.addEventListener("DOMContentLoaded", () => {
  const IS_DEBUGGING = true; // set to true for console logs

  // Main grid
  const grid = document.getElementById("grid");

  // Mini Grid (Displays next Tetromino)
  const miniGrid = document.getElementById("miniGrid_Display");
  const numberOfSquares = 200;
  const miniGridWidth = 4;
  let miniGridIndex = 0;

  let timerId; // for gametick
  let isPlaying = false;
  let gameIsOver = true; // default/start is "on"

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

  function debugLog(passedMessage) {
    // Custom console logging for when debugging is enabled
    if (IS_DEBUGGING != true) return;
    console.log(passedMessage);
  }

  function createSquaresInGrid(numOfSquares, numOfTakenSquares, useMiniGrid) {
    let _grid = grid;
    if (useMiniGrid === true) {
      _grid = miniGrid;
    } else {
      // if using the main grid, clear it first so it's clean on reset
      while (_grid.firstChild) {
        _grid.removeChild(_grid.lastChild);
      }
    }

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

  // Set up the main grid on start
  let squaresArray;
  setUpMainGrid();

  // Create mini grid
  createSquaresInGrid(16, 0, true);
  let miniGridSquaresArray = Array.from(
    document.querySelectorAll(".miniGrid_Display div")
  );

  function setUpMainGrid() {
    // Create all the squares in the grid first
    createSquaresInGrid(numberOfSquares, 10, false);
    squaresArray = Array.from(document.querySelectorAll(".grid div"));
  }

  // * * *
  //assign functions to keyCodes
  function control(e) {
    // Disallow input if game is not playing/running
    if (!isPlaying) return;

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
    // Check if need to restart game
    if (gameIsOver === true) {
      // Restart Game

      debugLog("Restart/Start Game Pressed");

      // Clean the board
      undrawTetromino();
      currentTetrominoValue = 0;
      currentTetromino = [];
      cleanGridOfTetrominos();
      setUpMainGrid(); // this will redraw the main grid and it's taken divs below

      // Set up the new game
      getRandomTetromino();
      drawTetromino();
      setUpTimerInterval();
      isPlaying = true;
      startBtn.innerHTML = "Pause";
      gameIsOver = false;

      // Reset the score
      score = 0;
      scoreDisplayLabel.innerHTML = "0";
    } else {
      // Currently playing, pause
      if (isPlaying) {
        clearInterval(timerId);
        timerId = null;
        isPlaying = false;
        startBtn.innerHTML = "Resume";
      } else {
        // Resume/unpause
        drawTetromino();
        setUpTimerInterval();
        isPlaying = true;
        startBtn.innerHTML = "Pause";
      }
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
    if (currentTetromino === undefined) return;

    currentTetromino.forEach((index) => {
      squaresArray[currentPosition + index].classList.add("tetromino");
      squaresArray[currentPosition + index].classList.add("active");
      squaresArray[currentPosition + index].classList.add(
        currentTetrominoColor
      );
    });
  }

  function undrawTetromino() {
    if (currentTetromino === undefined) return;

    currentTetromino.forEach((index) => {
      squaresArray[currentPosition + index].classList.remove("tetromino");
      squaresArray[currentPosition + index].classList.remove("active");
      squaresArray[currentPosition + index].classList.remove(
        currentTetrominoColor
      );
    });
  }

  function cleanGridOfTetrominos() {
    squaresArray.forEach((square) => {
      square.classList.remove("tetromino");
      square.classList.remove("active");
      square.classList.remove("taken");
      removeColorFromPassedSquare(square);
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

    debugLog("Getting Random Tetromino");

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
    if (timerId === null || timerId === undefined) {
      debugLog("Setting Up Timer");
      timerId = setInterval(moveTetrominoDown, 500);
    }
  }

  function moveTetrominoDown() {
    // Check There is a current Tetromino
    if (checkCurrentTetrominoIsValid() == false) return;

    undrawTetromino();
    currentPosition += width;
    drawTetromino();
    freezeTetromino();
  }

  function moveTetrominoLeft() {
    // Check There is a current Tetromino
    if (checkCurrentTetrominoIsValid() == false) return;

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
    // Check There is a current Tetromino
    if (checkCurrentTetrominoIsValid() == false) return;

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
    // Check There is a current Tetromino
    if (checkCurrentTetrominoIsValid() == false) return;

    undrawTetromino();
    currentRotation++;
    if (currentRotation === currentTetromino.length) {
      currentRotation = 0;
    }
    currentTetromino = tetrominoesArray[currentTetrominoValue][currentRotation];
    drawTetromino();
  }

  function freezeTetromino() {
    // Check There is a current Tetromino
    if (checkCurrentTetrominoIsValid() == false) return;

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

      //debugLog("Freezing Tetromino");

      getRandomTetromino();
      drawTetromino();
      addScore();
      gameOver();
    }
  }

  function checkCurrentTetrominoIsValid() {
    let isValid = true; // default

    if (currentTetromino === undefined || currentTetromino === null)
      isValid = false;
    if (currentTetromino.length <= 0) isValid = false;

    return isValid;
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
      timerId = null;
      isPlaying = false;
      startBtn.innerHTML = "Start New Game";
      gameIsOver = true;

      // Remove the active square
      squaresArray.forEach((square) => {
        square.classList.remove("active");
      });
    }
  }
});
