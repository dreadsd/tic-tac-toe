"use strict"

const ticTacBot = (function() {
  let nums = [null, null];
  let winningPos;
  let board;

  // Start operation
  const operate = () => {
    let aiScore = Infinity;
    let aiMove;
    pubSub.publish("request board");
    let free = getFreeSpaces(board);
    free.forEach(space => {
      let clonedBoard = cloneBoard(board);
      clonedBoard[space[0]][space[1]] = "X";
      let score = minimax(clonedBoard, true);
      if (score < aiScore) {
        aiScore = score;
        aiMove = space;
      }
    });
    nums = aiMove;
    pubSub.publish("change bot coords", nums);
  };
  const getFreeSpaces = (board) => {
    let idx = [];
    board.forEach((row, rowi) => {
      row.forEach((col, coli) => {
        if (col == null) idx.push([rowi, coli]);
      });
    });
    return idx;
  };
  const cloneBoard = (board) => {
    let copy = [];
    board.forEach(row => copy.push([...row]));
    return copy;
  };

  // Minimax algorithm
  const minimax = (board, isMaximizing) => {
    let free = getFreeSpaces(board);
    let winner = isWin(board);
    if (winner) {
      return winner == "O" ? 1 : -1;
    } else if (!free.length) {
      return 0;
    }

    if (isMaximizing) {
      let maxValue = -Infinity;
      free.forEach(space => {
        let clonedBoard = cloneBoard(board);
        clonedBoard[space[0]][space[1]] = "O";
        maxValue = Math.max(maxValue, minimax(clonedBoard, false));
      });
      return maxValue;
    } else {
      let minValue = Infinity;
      free.forEach(space => {
        let clonedBoard = cloneBoard(board);
        clonedBoard[space[0]][space[1]] = "X";
        minValue = Math.min(minValue, minimax(clonedBoard, true));
      });
      return minValue;
    }
  };
  const isWin = (board) => {
    let token;
    pubSub.publish("request win pos", board);
    winningPos.forEach(pos => {
      if (pos.every(cell => cell == pos[0]) && pos[0] != null) {
        token = pos[0];
      }
    });
    return token;
  };

  // Events
  const reset = () => nums = [null, null];
  const setBoard = (rBoard) => board = rBoard;
  const setWinPos = (pos) => winningPos = pos;

  pubSub.subscribe("start bot", operate);
  pubSub.subscribe("finish game", reset);
  pubSub.subscribe("get board pos", setBoard);
  pubSub.subscribe("get win pos", setWinPos);
})();
