function beginGame(e) {
  tictactoe.startGame()
  e.target.remove()
  setCurMark()
}

function setCurMark() {
  let container = document.querySelector("#current")
  container.textContent = `"${tictactoe.getCurrentPlayer()}"`
}

function markCell(e) {
  let coord = e.target.dataset.coord.split("")
  let currentMark = tictactoe.getCurrentPlayer()
  tictactoe.mark(coord[0], coord[1])
  e.target.textContent = currentMark
  setCurMark()
}

document.addEventListener("click", (e) => {

  if(!e.target) return

  if(e.target.id == "start") beginGame(e)
  if(e.target.className.includes("cell")) markCell(e)
})
