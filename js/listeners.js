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
  container.textContent = `"${tictactoe.getCurrentPlayer()}"`
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
  alert(msg)
}

function finishGame() {
  let container = mainTarget()
  container.textContent = null
  let btn = document.createElement("div")
  btn.classList.add("btn")
  btn.id = "start"
  btn.textContent = "start"
  container.append(btn)
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
