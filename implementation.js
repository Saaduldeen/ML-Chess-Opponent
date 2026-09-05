const initialPosition = [
  ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
  ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
  ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"]
];

const chessboard = document.getElementById("chessboard");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("reset-button");
const capturedByWhiteDisplay = document.getElementById("captured-by-white");
const capturedByBlackDisplay = document.getElementById("captured-by-black");

const whitePieces = "♙♖♘♗♕♔";
let capturedByWhite = [];
let capturedByBlack = [];

let position = copyPosition(initialPosition);
let selectedSquare = null;

function copyPosition(positionToCopy) {
  return positionToCopy.map(function (row) {
    return [...row];
  });
}

function renderBoard() {
  chessboard.innerHTML = "";

  for (let row = 0; row < 8; row++) {
    for (let column = 0; column < 8; column++) {
      const square = document.createElement("button");

      square.type = "button";
      square.classList.add("square");

      const isLightSquare = (row + column) % 2 === 0;
      square.classList.add(isLightSquare ? "light" : "dark");

      square.textContent = position[row][column];

      square.setAttribute(
        "aria-label",
        `Chess square at row ${row + 1}, column ${column + 1}`
      );

      if (
        selectedSquare !== null &&
        selectedSquare.row === row &&
        selectedSquare.column === column
      ) {
        square.classList.add("selected");
      }

      square.addEventListener("click", function () {
        handleSquareClick(row, column);
      });

      chessboard.appendChild(square);
    }
  }
}

function handleSquareClick(row, column) {
  const clickedPiece = position[row][column];

  if (selectedSquare === null) {
    if (clickedPiece === "") {
      statusText.textContent = "Select a piece first.";
      return;
    }

    selectedSquare = {
      row: row,
      column: column
    };

    statusText.textContent = "Now select a destination.";
    renderBoard();
    return;
  }

  const selectedPiece =
    position[selectedSquare.row][selectedSquare.column];

  // Clicking the selected square again cancels the selection.
  if (selectedSquare.row === row && selectedSquare.column === column) {
    selectedSquare = null;
    statusText.textContent = "Selection cleared. Select a piece.";
    renderBoard();
    return;
  }

  // Select a friendly piece instead of capturing it.
  if (clickedPiece !== "" &&
      whitePieces.includes(clickedPiece) === whitePieces.includes(selectedPiece)) {
    selectedSquare = { row: row, column: column };
    statusText.textContent = "Piece selected. Choose a destination.";
    renderBoard();
    return;
  }

  if (clickedPiece !== "") {
    if (whitePieces.includes(selectedPiece)) {
      capturedByWhite.push(clickedPiece);
    } else {
      capturedByBlack.push(clickedPiece);
    }
    renderCapturedPieces();
  }

  position[selectedSquare.row][selectedSquare.column] = "";
  position[row][column] = selectedPiece;

  selectedSquare = null;

  statusText.textContent =
    "Piece moved. Select another piece.";

  renderBoard();
}

resetButton.addEventListener("click", function () {
  position = copyPosition(initialPosition);
  selectedSquare = null;
  capturedByWhite = [];
  capturedByBlack = [];
  renderCapturedPieces();

  statusText.textContent =
    "Board reset. Select a piece.";

  renderBoard();
});

function renderCapturedPieces() {
  renderCapturedList(capturedByWhiteDisplay, capturedByWhite);
  renderCapturedList(capturedByBlackDisplay, capturedByBlack);
}

function renderCapturedList(display, pieces) {
  display.textContent = pieces.length === 0 ? "None yet" : "";

  for (const piece of pieces) {
    const symbol = document.createElement("span");
    symbol.classList.add("captured-piece");
    symbol.textContent = piece;
    display.appendChild(symbol);
  }
}

renderBoard();
