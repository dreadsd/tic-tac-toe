"use strict"

const dom = (function(doc) {
  let container = doc.querySelector("#current");
  let grid = doc.querySelector(".grid");
  let turn = doc.querySelector("#turn");
  let msgCont = doc.querySelector("#msg");
  let autoMode = false;
  let darkMode = false;
  let finished = true;
  let msg;

  // Start game
  const beginGame = (e) => {
    finished = false;
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
    let retCode = ticTacToe.mark(...coord);
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
        let nums = ticTacBot.operate().join("");
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
    ticTacBot.reset();
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
    if (!finished) return activateMsg("You can't do that");
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
