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
  const mark = (coord) => {
    if (!started) {
      return useCode(1);
    } else if (board[coord[0]][coord[1]] !== null) {
      return useCode(2);
    }
    board[coord[0]][coord[1]] = currentPlayer;
    moves--;

    checkWin();
    if (winner) return useCode(3, true);
    if (moves <= 0) return useCode(4, true);
    currentPlayer = currentPlayer == players[0] ? players[1] : players[0];
    pubSub.publish("change player", currentPlayer);
  };
  const checkWin = () => {
    let combinations = getWinPos(board);
    combinations.forEach(combination => {
      if (combination.every((v,i) => v === currentPlayer)) winner = true;
    });
  };
  const useCode = (msg, isOver=false) => {
    if (isOver) started = false;
    pubSub.publish("change return code", msg)
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

  // Events
  const retrieveBoard = () => {
    pubSub.publish("get board pos", board);
  };
  const retrieveWinPos = (board) => {
    pubSub.publish("get winning pos", getWinPos(board));
  };

  pubSub.subscribe("start game", startGame);
  pubSub.subscribe("mark", mark);
  pubSub.subscribe("request board", retrieveBoard);
  pubSub.subscribe("request win pos", retrieveWinPos);
})();
