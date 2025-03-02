function MakePlayer(name, symbol) {
  return { name, symbol };
}

// gameboard
function GameBoard() {
  const board = ["", "", "", "", "", "", "", "", ""];

  const resetBoard = ["", "", "", "", "", "", "", "", ""];

  const updateBoard = (index, symbol) => {
    if(board[index] === ""){
        board[index] = symbol;
        return true;
    }else{
        return false;
    }
  }

  
}
