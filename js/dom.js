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
  const beginGame = (e) => {
    finished = false;
    resetGrid();
    pubSub.publish("start game");
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
    turn.textContent = `"${currentPlayer}"`;
  };

  // Mark cell
  const markCell = (target) => {
    let coord = target.dataset.coord.split("");
    let currentMark = currentPlayer;
    pubSub.publish("mark", coord);
    if (Number.isInteger(returnCode)) {
      if (returnCode >= 3) {
        target.textContent = currentMark;
        finishGame();
      }
      return code();
    }
    target.textContent = currentMark;
    if (autoMode) {
      if (!(coord[0] == botCoords[0] && coord[1] == botCoords[1])) {
        pubSub.publish("start bot");
        return markCell(doc.querySelector(`[data-coord="${botCoords.join("")}"]`));
      }
    }
    setCurrentMark();
  };
  const code = () => {
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
    returnCode = null;
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
    finished = true;
    currentPlayer = "O";
    botCoords = [null, null]
    pubSub.publish("finish game");
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
    pubSub.publish("set dark mode", darkMode);
  };

  // Automatic mode
  const automaticMode = () => {
    if (!finished) return activateMsg("You can't do that");
    let toggledClass = darkMode ? "dark" : "light";
    doc.querySelector("body").classList.toggle("robot-" + toggledClass);
    autoMode = !autoMode;
    pubSub.publish("set auto mode", autoMode);
    activateMsg("Automatic mode: " + (autoMode ? "ON" : "OFF"))
  };

  // DOM storage
  const restoreProfile = () => {
    pubSub.publish("request pref keys");
    if (preferences.includes("dark")) dom.changeTheme();
    if (preferences.includes("auto")) dom.automaticMode();
  };


  // Events
  const setCurrPlayer = (token) => {
    currentPlayer = token;
  };
  const setRetCode = (code) => {
    returnCode = code;
  };
  const setBotCoords = (coords) => {
    botCoords = coords;
  };
  const setPreferences = (keys) => {
    preferences = keys;
  };

  pubSub.subscribe("change player", setCurrPlayer);
  pubSub.subscribe("change return code", setRetCode);
  pubSub.subscribe("change bot coords", setBotCoords);
  pubSub.subscribe("get preferences", setPreferences);

  return {
    beginGame,
    markCell,
    changeTheme,
    automaticMode,
    restoreProfile
  };
})(document);
