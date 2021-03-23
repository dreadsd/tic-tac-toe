const tictactoe = (function() {
  let board
  let started
  let over

  let players = ["O", "X"]
  let currentPlayer = players[0]
  let winner

  const restartGame = function() {
    console.log("Restarting game...")
    board      = null
    started    = null
    over       = null
    winner     = null
  }
  const startGame = function() {
    if(over) restartGame()
    board = [
      [null, null, null], [null, null, null], [null, null, null]
    ]
    started = true
  }
  const mark = function(row, column) {
    if(!started || over) {
      throw("Please start the game")
    } else if(board[row][column] !== null) {
      throw("That cell is not empty")
    }
    board[row][column] = currentPlayer

    checkWin()
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
        over   = true
        winner = true
      }
    })
    if(winner) win()
  }
  const win = function() {
    throw(`"${currentPlayer}" won!`)
  }
  const debug = function() {
    console.log([board, started, over, currentPlayer, winner])
  }

  return {
    startGame,
    mark,
    currentPlayer,
    debug
  }
})()
