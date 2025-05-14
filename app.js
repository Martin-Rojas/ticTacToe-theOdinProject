function MakePlayer(name, symbol) {
  return { name, symbol };
}

const playerElOne = document.getElementById("player1-name");
const playerElTwo = document.getElementById("player2-name");
let cells = document.querySelectorAll(".cell");
const resetEl = document.getElementById("reset");
const newGameBtn = document.getElementById("newGame");
const gameResultEl = document.getElementById("game-result");
const form = document.getElementById("form");
const gameBoardEL = document.getElementById("game-board");

const displayGameResult = (result, playerName = "") => {
  if (result === "tie") {
    gameResultEl.innerText = `It's a tie!`;
  } else {
    gameResultEl.innerText = `${playerName} wins!`;
  }
};

function GameBoard() {
  let board = ["", "", "", "", "", "", "", "", ""];

  const resetBoard = () => {
    cells.forEach((cell) => {
      cell.innerText = "";
      cell.style.pointerEvents = "auto";
    });
    board = ["", "", "", "", "", "", "", "", ""];
  };

  const updateBoard = (index, symbol) => {
    if (board[index] === "") {
      board[index] = symbol;
      return true;
    } else {
      return false;
    }
  };

  const getBoard = () => board;

  const checkWinner = () => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return board.includes("") ? null : "tie";
  };

  return { resetBoard, updateBoard, getBoard, checkWinner };
}

let game = null; // Global reference

gameBoardEL.classList.add("hidden");

function startGame(playerXName, playerOName) {
  gameBoardEL.classList.remove("hidden");
  form.classList.add("hidden");

  document.querySelectorAll(".cell").forEach((cell) => {
    const newCell = cell.cloneNode(true);
    cell.parentNode.replaceChild(newCell, cell);
  });

  cells = document.querySelectorAll(".cell");

  game = GameController(playerXName, playerOName);
  game.resetGame();

  cells.forEach((cell) => {
    cell.addEventListener("click", function () {
      const index = parseInt(this.getAttribute("data-index"), 10);
      game.playTurn(index);
    });
  });

  playerElOne.innerText = `Player: ${playerXName}  Symbol: X`;
  playerElTwo.innerText = `Player: ${playerOName}  Symbol: O`;
  playerElOne.style.display = "block";
  playerElTwo.style.display = "block";
}

function GameController(playerName1, playerName2) {
  const player1 = MakePlayer(playerName1, "X");
  const player2 = MakePlayer(playerName2, "O");
  const board = GameBoard();

  let currentPlayer = player1;

  const playTurn = (index) => {
    if (board.updateBoard(index, currentPlayer.symbol)) {
      cells[index].innerText = currentPlayer.symbol;
      cells[index].style.pointerEvents = "none";

      const winner = board.checkWinner();
      if (winner) {
        cells.forEach((element) => {
          element.style.pointerEvents = "none";
        });
        displayGameResult(winner, currentPlayer.name);
      } else {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
      }
    } else {
      console.log("Invalid move! Try again.");
    }
  };

  const resetGame = () => {
    board.resetBoard();
    currentPlayer = player1;
    gameResultEl.innerText = "";
  };

  const newGame = () => {
    gameBoardEL.classList.add("hidden");
    playerElOne.style.display = "none";
    playerElTwo.style.display = "none";
    form.classList.remove("hidden");
    document.getElementById("player1").value = "";
    document.getElementById("player2").value = "";
  };

  return { playTurn, resetGame, newGame };
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const playerXName = document.getElementById("player1").value;
  const playerOName = document.getElementById("player2").value;
  startGame(playerXName, playerOName);
});

resetEl.addEventListener("click", () => {
  if (game) game.resetGame();
});

newGameBtn.addEventListener("click", () => {
  if (game) game.newGame();
});
