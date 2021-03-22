const tictactoe = (function() {
  let board
  let started
  let over

  let players = {}
  let lastPlayer
  let winner

  const createPlayer = function(token, name) {
    if(over) restartGame(true)
    let tokens = Object.keys(players)
    if(tokens.length == 2) {
      throw("This is a 2 player game")
    } else if(token == tokens[0]) {
      throw("Please choose another token")
    }
    players[token] = name
  }
  const listPlayers = function() {
    return players
  }
  const restartGame = function(reset_players=false) {
    console.log("Restarting game...")
    if(reset_players) players = {}
    board      = null
    started    = null
    over       = null
    lastPlayer = null
    winner     = null
  }
  const startGame = function() {
    if(over) restartGame()
    let tokens = Object.keys(players)
    if(tokens.length != 2) throw("This is a 2 player game")
    board = [
      [null, null, null], [null, null, null], [null, null, null]
    ]
    started = true
  }
  const mark = function(token, row, column) {
    if(!started || over) {
      throw("Please start the game")
    } else if(lastPlayer == token) {
      throw("You can't do that")
    } else if(board[row][column] !== null) {
      throw("That cell is not empty")
    }
    board[row][column] = token
    lastPlayer = token

    checkWin(token)
    return board
  }
  const checkWin = function(token) {
    let combinations = [
      board[0],     board[1],    board[2],
      [board[0][0], board[1][0], board[2][0]],
      [board[0][1], board[1][1], board[2][1]],
      [board[0][2], board[1][2], board[2][2]],
      [board[0][0], board[1][1], board[2][2]],
      [board[0][2], board[1][1], board[2][0]]
    ]
    combinations.forEach(combination => {
      if(combination.every((v,i) => v === token)) {
        over   = true
        winner = true
      }
    })
    if(winner) win(token)
  }
  const win = function(token) {
    throw(`${players[token]} won!`)
  }
  const debug = function() {
    console.log([board, started, over, lastPlayer, winner])
  }

  return {
    createPlayer,
    listPlayers,
    startGame,
    mark,
    debug
  }
})()
