function MakePlayer(name, symbol) {
  return { name, symbol };
}

const playerElOne = document.getElementById(`player1`);
const playerElTwo = document.getElementById(`player2`);
const cells = document.querySelectorAll(".cell");
const resetEl = document.getElementById("reset");
const gameResultEl = document.getElementById("game-result");

const displayGameResult = (result, playerName = "") => {
  // Select the parent element where the new element will be added
  const gameBoardEle = document.getElementById(`game-board`);
  // Create a new paragraph element
  const gameResultEl = document.createElement(`h2`);
  // Add text content to the paragraph
  if (result === `tie`) {
    gameResultEl.innerHTML = `${result}`;
  } else {
    gameResultEl.innerHTML = `${playerName} ${result}!`;
  }

  // Append the paragraph to the parent element
  gameBoardEle.append(gameResultEl);
};

// gameboard
function GameBoard() {
  let board = ["", "", "", "", "", "", "", "", ""];

  // Function to reset the board
  const resetBoard = () => {
    cells.forEach((cell) => (cell.innerText = "")); // Clear UI
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

  // Function to get the current state of the board
  const getBoard = () => board;

  // Function to check for a winner
  const checkWinner = () => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]; // Return the symbol of the winner
      }
    }

    return board.includes("") ? null : "tie"; // Return "tie" if board is full
  };

  return { resetBoard, updateBoard, getBoard, checkWinner };
}

// Factory function for managing the game flow
function GameController() {
  const player1 = MakePlayer("Player 1", "X");
  const player2 = MakePlayer("Player 2", "O");
  const board = GameBoard();

  playerElOne.innerText = `Player: ${player1.name}  Symbol: ${player1.symbol}`;
  playerElTwo.innerText = `Player: ${player2.name}  Symbol: ${player2.symbol}`;

  let currentPlayer = player1;

  // Function to play a turn
  const playTurn = (index) => {
    if (board.updateBoard(index, currentPlayer.symbol)) {
      cells[index].innerText = currentPlayer.symbol; // Update UI
      const winner = board.checkWinner();
      if (winner) {
        if (winner === "tie") {
          cells.forEach((element) => {
            element.style.display = "none";
          });

          gameResultEl.innerText = `it's a tie!`;
        } else {
          cells.forEach((element) => {
            element.style.display = "none";
          });
          gameResultEl.innerText = `${currentPlayer.name} wins!!`;
          board.resetBoard();
        }
        board.resetBoard(); // Reset the board after a game
      } else {
        // Switch to the other player
        currentPlayer = currentPlayer === player1 ? player2 : player1;
      }
    } else {
      console.log("Invalid move! Try again.");
    }
  };

  // Function to start a new game
  const newGame = () => {
    board.resetBoard();
    currentPlayer = player1; // Reset to player 1
    cells.forEach((element) => {
      element.style.display = "block";
    });
    gameResultEl.innerText = ``;
  };

  return { playTurn, newGame };
}

// Start game
let game = GameController();
game.newGame();

// Add event listeners to each cell
cells.forEach((cell) => {
  cell.addEventListener("click", function () {
    const index = this.getAttribute("data-index");
    game.playTurn(index);
  });
});

resetEl.addEventListener("click", () => {
  game.newGame();
});
