function beginGame(e) {
  resetGrid()
  tictactoe.startGame()
  e.target.remove()
  setCurMark()
}

function mainTarget() {
  return document.querySelector("#current")
}

function setCurMark() {
  let container = mainTarget()
  let turn = document.createElement("span")
  turn.textContent = `"${tictactoe.getCurrentPlayer()}"`
  container.textContent = null
  container.append(turn)
}

function markCell(e) {
  let coord = e.target.dataset.coord.split("")
  let currentMark = tictactoe.getCurrentPlayer()
  let retValue = tictactoe.mark(coord[0], coord[1])
  if(Number.isInteger(retValue)) {
    if(retValue >= 3) {
      e.target.textContent = currentMark
      finishGame()
    }
    return error(retValue)
  }
  e.target.textContent = currentMark
  setCurMark()
}

function error(id) {
  if(document.querySelector("#current > .msg")) return
  let msg
  switch(id) {
    case 1:
      msg = "Please start the game"
      break
    case 2:
      msg = "That cell is not empty"
      break
    case 3:
      msg = `"${tictactoe.getCurrentPlayer()}" won!`
      break
    case 4:
      msg = "Game Over"
      break
  }
  showMsg(msg)
}

function showMsg(msg) {
  mainTarget().firstElementChild.classList.add("display-none")
  msgDiv = createMsg(msg)
  mainTarget().append(msgDiv)
  setTimeout(disappearMsg.bind(this, msgDiv), 2500)
}

function createMsg(msg) {
  let msgDiv = document.createElement("div")
  msgDiv.classList.add("msg")
  msgDiv.textContent = msg
  return msgDiv
}

function disappearMsg(container) {
  mainTarget().firstElementChild.classList.remove("display-none")
  container.remove()
}

function finishGame() {
  let container = mainTarget()
  container.textContent = null
  container.append(createStartBtn())
}

function createStartBtn() {
  let btn = document.createElement("div")
  btn.classList.add("btn")
  btn.id = "start"
  btn.textContent = "start"
  return btn
}

function resetGrid() {
  let grid = document.querySelector(".grid")
  let i = 0
  while(i < grid.childElementCount) {
    grid.children[i].textContent = null
    i++
  }
}

document.addEventListener("click", (e) => {

  if(!e.target) return

  if(e.target.id == "start") beginGame(e)
  if(e.target.className.includes("cell")) markCell(e)
})
