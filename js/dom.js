"use strict"

const dom = (function(doc) {
  let container = doc.querySelector("#current");
  let grid = doc.querySelector(".grid");
  let turn = doc.querySelector("#turn");
  let msgCont = doc.querySelector("#msg");

  let autoMode = false;
  let darkMode = false;

  let finished = true;
  let currentPlayer = "O";

  let botCoords = [null, null];
  let returnCode;
  let msg;
  let preferences;

  // Start game
  const beginGame = (target) => {
    finished = false;
    _resetGrid();
    target.remove();
    _setCurrentMark();
    pubSub.publish("start game")
  };
  const _resetGrid = () => {
    for (let i = 0; i < grid.childElementCount; i++) {
      grid.children[i].textContent = null;
    }
  };
  const _setCurrentMark = () => {
    turn.textContent = `"${currentPlayer}"`;
  };

  // Mark cell
  const markCell = (target) => {
    let coord = target.dataset.coord.split("");
    let currentMark = currentPlayer;
    pubSub.publish("mark", coord);
    if (Number.isInteger(returnCode)) {
      if (returnCode >= 3) target.textContent = currentMark;
      return _code();
    }
    target.textContent = currentMark;
    if (autoMode) return _operateBot(coord)
    _setCurrentMark();
  };
  const _code = () => {
    switch (returnCode) {
      case 1:
        msg = "Please start the game"; break;
      case 2:
        msg = "That cell is not empty"; break;
      case 3:
        msg = `"${currentPlayer}" won!`; break;
      case 4:
        msg = "Game Over"; break;
    }
    if (returnCode >= 3) _finishGame();
    returnCode = null;
    _activateMsg(msg);
  };
  const _operateBot = (coord) => {
    if (!(coord[0] == botCoords[0] && coord[1] == botCoords[1])) {
      pubSub.publish("start bot");
      return markCell(doc.querySelector(`[data-coord="${botCoords.join("")}"]`));
    }
  }
  const _activateMsg = (msg) => {
    let strtBtn = doc.querySelector("#current > .btn");
    let disappeared = [];

    let elements = [strtBtn, turn];
    elements.forEach(element => {
      if (!element) return;
      element.classList.add("display-none");
      disappeared.push(element);
    });

    msgCont.textContent = msg;
    setTimeout(_disappearMsg.bind(this, disappeared), 2000);
  };
  const _disappearMsg = (elements) => {
    msgCont.textContent = null;
    elements.forEach(element => element.classList.remove("display-none"));
  };

  // Finish game
  const _finishGame = () => {
    _resetProperties();
    turn.textContent = null;
    container.append(_createStartBtn());
    pubSub.publish("finish game");
  };
  const _resetProperties = () => {
    finished = true;
    currentPlayer = "O";
    botCoords = [null, null];
  }
  const _createStartBtn = () => {
    let btn = doc.createElement("div");
    btn.classList.add("btn");
    btn.id = "start";
    btn.tabIndex = 0;
    btn.textContent = "start";
    return btn;
  };

  // Change theme
  const changeTheme = () => {
    if (autoMode) _swapAutoTheme();
    doc.body.classList.toggle("dark");
    darkMode = !darkMode;
    pubSub.publish("set dark mode", darkMode);
  };
  const _swapAutoTheme = () => {
    let [rClass, aClass] = darkMode ? ["dark", "light"] : ["light", "dark"];
    doc.body.classList.remove("robot-" + rClass);
    doc.body.classList.add("robot-" + aClass);
  };

  // Automatic mode
  const automaticMode = () => {
    if (!finished) return _activateMsg("You can't do that");
    doc.body.classList.toggle("robot-" + (darkMode ? "dark" : "light"));
    autoMode = !autoMode;
    _activateMsg("Automatic mode: " + (autoMode ? "ON" : "OFF"))
    pubSub.publish("set auto mode", autoMode);
  };

  // DOM storage
  const restoreProfile = () => {
    pubSub.publish("request pref keys");
    if (preferences.includes("dark")) dom.changeTheme();
    if (preferences.includes("auto")) dom.automaticMode();
  };

  // Events
  const _setCurrPlayer = (token) => currentPlayer = token;
  const _setRetCode = (code) => returnCode = code;
  const _setBotCoords = (coords) => botCoords = coords;
  const _setPreferences = (keys) => preferences = keys;

  pubSub.subscribe("change player", _setCurrPlayer);
  pubSub.subscribe("change return code", _setRetCode);
  pubSub.subscribe("change bot coords", _setBotCoords);
  pubSub.subscribe("get preferences", _setPreferences);

  return {
    beginGame,
    markCell,
    changeTheme,
    automaticMode,
    restoreProfile
  };
})(document);
