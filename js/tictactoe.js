"use strict"

const ticTacToe = (function() {
  let board;
  let started;
  let moves;

  let players = ["O", "X"];
  let currentPlayer;
  let winner;

  const startGame = () => {
    board = [
      [null, null, null], [null, null, null], [null, null, null]
    ];
    moves = board.length * board[0].length;
    currentPlayer = players[0];
    winner = null;
    started = true;
  };
  const mark = (row, column) => {
    if (!started) {
      return 1;
    } else if (board[row][column] !== null) {
      return 2;
    }
    board[row][column] = currentPlayer;
    moves--;

    checkWin();
    if (winner) return gameOver(3);
    if (moves <= 0) return gameOver();
    currentPlayer = currentPlayer == players[0] ? players[1] : players[0];
  };
  const checkWin = () => {
    let combinations = getWinPos(board);
    combinations.forEach(combination => {
      if (combination.every((v,i) => v === currentPlayer)) winner = true;
    });
  };
  const gameOver = (msg=4) => {
    started = false;
    return msg;
  };
  const getCurrentPlayer = () => {
    return currentPlayer;
  };
  const getBoard = () => {
    return board;
  };
  const getWinPos = (b) => {
    return [
      b[0],     b[1],    b[2],
      [b[0][0], b[1][0], b[2][0]],
      [b[0][1], b[1][1], b[2][1]],
      [b[0][2], b[1][2], b[2][2]],
      [b[0][0], b[1][1], b[2][2]],
      [b[0][2], b[1][1], b[2][0]]
    ];
  };
  const debug = () => {
    console.log([board, started, currentPlayer, moves, winner]);
  };

  return {
    startGame,
    mark,
    getCurrentPlayer,
    getBoard,
    getWinPos,
    debug
  };
})();
