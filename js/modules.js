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
      throw("Please start the game")
    } else if(board[row][column] !== null) {
      throw("That cell is not empty")
    }
    board[row][column] = currentPlayer
    moves--

    checkWin()
    if(moves <= 0) return gameOver()
    currentPlayer = currentPlayer == players[0] ? players[1] : players[0]
    return board
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
      if(combination.every((v,i) => v === currentPlayer)) {
        winner = true
      }
    })
    if(winner) gameOver(`"${currentPlayer}" won!`)
  }
  const gameOver = function(msg="Game Over") {
    started = false
    throw(msg)
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
