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
    let combinations = [
      board[0],     board[1],    board[2],
      [board[0][0], board[1][0], board[2][0]],
      [board[0][1], board[1][1], board[2][1]],
      [board[0][2], board[1][2], board[2][2]],
      [board[0][0], board[1][1], board[2][2]],
      [board[0][2], board[1][1], board[2][0]]
    ];
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
  const debug = () => {
    console.log([board, started, currentPlayer, moves, winner]);
  };

  return {
    startGame,
    mark,
    getCurrentPlayer,
    getBoard,
    debug
  };
})();

const ticTacBot = (function() {
  let numbers = [null, null];

  const randomize = () => {
    let empty = false;
    let autoRow, autoCol;
    let board = ticTacToe.getBoard();
    while (empty == false) {
      autoRow = Math.floor(Math.random() * board.length);
      autoCol = Math.floor(Math.random() * board[0].length);
      if (board[autoRow][autoCol] == null) empty = true;
    }
    numbers = [autoRow, autoCol];
    return numbers;
  };
  const getNums = () => {
    return numbers;
  };

  return {
    randomize,
    getNums
  };
})();

const storage = (function(doc) {
  const storePref = (attr, val) => {
    localStorage.setItem(attr, val);
  };
  const retPref = () => {
    let pref = [];
    let keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (localStorage.getItem(key) == "true") pref.push(key);
    });
    return pref;
  };

  return {
    storePref,
    retPref
  };
})(document);

const dom = (function(doc) {
  let container = doc.querySelector("#current");
  let grid = doc.querySelector(".grid");
  let turn = doc.querySelector("#turn");
  let msgCont = doc.querySelector("#msg");
  let autoMode = false;
  let darkMode = false;
  let finished;
  let msg;

  // Start game
  const beginGame = (e) => {
    resetGrid();
    ticTacToe.startGame();
    e.target.remove();
    setCurrentMark();
  };
  const resetGrid = () => {
    let i = 0;
    while (i < grid.childElementCount) {
      grid.children[i].textContent = null;
      i++;
    }
  };
  const setCurrentMark = () => {
    turn.textContent = `"${ticTacToe.getCurrentPlayer()}"`;
  };

  // Mark cell
  const markCell = (target) => {
    let coord = target.dataset.coord.split("");
    let currentMark = ticTacToe.getCurrentPlayer();
    let retCode = ticTacToe.mark(coord[0], coord[1]);
    if (Number.isInteger(retCode)) {
      if (retCode >= 3) {
        target.textContent = currentMark;
        finished = true;
        finishGame();
      }
      return code(retCode);
    }
    target.textContent = currentMark;
    if (autoMode) {
      let botCoords = ticTacBot.getNums();
      if (!(coord[0] == botCoords[0] && coord[1] == botCoords[1])) {
        let nums = ticTacBot.randomize().join("");
        return markCell(doc.querySelector(`[data-coord="${nums}"]`));
      }
    }
    setCurrentMark();
  };
  const code = (id) => {
    switch (id) {
      case 1:
        msg = "Please start the game"; break;
      case 2:
        msg = "That cell is not empty"; break;
      case 3:
        msg = `"${ticTacToe.getCurrentPlayer()}" won!`; break;
      case 4:
        msg = "Game Over"; break;
    }
    activateMsg(msg);
  };

  const activateMsg = (msg) => {
    let strtBtn = doc.querySelector("#current > .btn");
    let disappeared = [];

    let elements = [strtBtn, turn];
    elements.forEach(element => {
      if (!element) return;
      element.classList.add("display-none");
      disappeared.push(element);
    });

    msgCont.textContent = msg;
    setTimeout(disappearMsg.bind(this, disappeared), 2000);
  };

  const disappearMsg = (elements) => {
    msgCont.textContent = null;
    elements.forEach(element => element.classList.remove("display-none"));
  };

  // Finish game
  const finishGame = () => {
    turn.textContent = null;
    container.append(createStartBtn());
  };
  const createStartBtn = () => {
    let btn = doc.createElement("div");
    btn.classList.add("btn");
    btn.id = "start";
    btn.tabIndex = 0;
    btn.textContent = "start";
    return btn;
  };

  // Change theme
  const changeTheme = () => {
    let body = doc.querySelector("body");
    if (autoMode) {
      let [rClass, aClass] = darkMode ? ["dark", "light"] : ["light", "dark"];
      body.classList.remove("robot-" + rClass);
      body.classList.add("robot-" + aClass);
    }
    body.classList.toggle("dark");
    darkMode = !darkMode;
    storage.storePref("dark", darkMode)
  };

  // Automatic mode
  const automaticMode = () => {
    let toggledClass = darkMode ? "dark" : "light";
    doc.querySelector("body").classList.toggle("robot-" + toggledClass);
    autoMode = !autoMode;
    storage.storePref("auto", autoMode);
    activateMsg("Automatic mode: " + (autoMode ? "ON" : "OFF"))
  };

  // DOM storage
  const restoreProfile = () => {
    let keys = storage.retPref();
    if (keys.includes("dark")) dom.changeTheme();
    if (keys.includes("auto")) dom.automaticMode();
  };

  return {
    beginGame,
    markCell,
    changeTheme,
    automaticMode,
    restoreProfile
  };
})(document);
