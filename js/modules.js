const tictactoe = (function() {
  let board
  let started
  let moves

  let players = ["O", "X"]
  let currentPlayer
  let winner

  const startGame = function() {
    board = [
      [null, null, null], [null, null, null], [null, null, null]
    ]
    moves = board.length * board[0].length
    currentPlayer = players[0]
    winner = null
    started = true
  }
  const mark = function(row, column) {
    if(!started) {
      return 1
    } else if(board[row][column] !== null) {
      return 2
    }
    board[row][column] = currentPlayer
    moves--

    checkWin()
    if(winner)     return gameOver(3)
    if(moves <= 0) return gameOver()
    currentPlayer = currentPlayer == players[0] ? players[1] : players[0]
  }
  const checkWin = function() {
    let combinations = [
      board[0],     board[1],    board[2],
      [board[0][0], board[1][0], board[2][0]],
      [board[0][1], board[1][1], board[2][1]],
      [board[0][2], board[1][2], board[2][2]],
      [board[0][0], board[1][1], board[2][2]],
      [board[0][2], board[1][1], board[2][0]]
    ]
    combinations.forEach(combination => {
      if(combination.every((v,i) => v === currentPlayer)) winner = true
    })
  }
  const gameOver = function(msg=4) {
    started = false
    return msg
  }
  const debug = function() {
    console.log([board, started, currentPlayer, moves, winner])
  }
  const getCurrentPlayer = function() {
    return currentPlayer
  }

  return {
    startGame,
    mark,
    getCurrentPlayer,
    debug
  }
})()

const dom = (function(doc) {
  let container = doc.querySelector("#current")
  let grid      = doc.querySelector(".grid")
  let turn      = doc.querySelector("#turn")
  let msg

  // Start game
  const beginGame = function(e) {
    resetGrid()
    tictactoe.startGame()
    e.target.remove()
    setCurrentMark()
  }
  const resetGrid = function() {
    let i = 0
    while(i < grid.childElementCount) {
      grid.children[i].textContent = null
      i++
    }
  }
  const setCurrentMark = function() {
    turn.textContent = `"${tictactoe.getCurrentPlayer()}"`
  }

  // Mark cell
  const markCell = function(e) {
    let coord = e.target.dataset.coord.split("")
    let currentMark = tictactoe.getCurrentPlayer()
    let retCode = tictactoe.mark(coord[0], coord[1])
    if(Number.isInteger(retCode)) {
      if(retCode >= 3) {
        e.target.textContent = currentMark
        finishGame()
      }
      return code(retCode)
    }
    e.target.textContent = currentMark
    setCurrentMark()
  }
  const code = function(id) {
    if(doc.querySelector("#current > .msg")) return
    switch(id) {
      case 1:
        msg = "Please start the game"; break
      case 2:
        msg = "That cell is not empty"; break
      case 3:
        msg = `"${tictactoe.getCurrentPlayer()}" won!`; break
      case 4:
        msg = "Game Over"; break
    }
    msg = createMsg(msg)
    showMsg(msg)
    setTimeout(disappearMsg.bind(this, msg), 2000)
  }
  const createMsg = function(msg) {
    let msgDiv = doc.createElement("div")
    msgDiv.classList.add("msg")
    msgDiv.textContent = msg
    return msgDiv
  }
  const showMsg = function(msgObj) {
    toggleTurn()
    container.append(msgObj)
  }
  const disappearMsg = function(msgObj) {
    toggleTurn()
    msgObj.remove()
  }
  const toggleTurn = function() {
    turn.classList.toggle("display-none")
    let startBtn = doc.querySelector("#start")
    if(startBtn) startBtn.classList.toggle("display-none")
  }

  // Finish game
  const finishGame = function() {
    turn.textContent = null
    container.append(createStartBtn())
  }
  const createStartBtn = function() {
    let btn = document.createElement("div")
    btn.classList.add("btn")
    btn.id = "start"
    btn.textContent = "start"
    return btn
  }

  // Change theme
  const changeTheme = function() {
    document.querySelector("body").classList.toggle("dark")
  }

  return {
    beginGame,
    markCell,
    changeTheme
  }
})(document)
