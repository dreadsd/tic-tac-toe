/*

let combinations = [
  [b[0], b[1], b[2]],
  [b[3], b[4], b[5]],
  [b[6], b[7], b[8]],
  [b[0], b[3], b[6]],
  [b[1], b[4], b[7]],
  [b[2], b[5], b[8]]
]

let winner = false
combinations.forEach(combination => {
  if(combination == [token, token, token]) return winner = true
}
*/

const tictactoe = (function() {
  let b

  /*
  const playerProto = {
    win() {
      this.name + "won!"
    }
  }
  const Player = (token, name) => {
    return Object.assign(Object.create(playerProto), {
      token, name
    })
  }
  */

  let players = {}
  let lastPlayer
  let started = false
  let winner

  const createPlayer = function(token, name) {
    let tokens = Object.keys(players)
    if(tokens.length == 2) {
      throw("This is a 2 player game")
    } else if(tokens.length == 1 &&
              token == tokens[0]) {
      throw("Please choose another token")
    }
    players[token] = name
  }
  const listPlayers = function() {
    return players
  }
  const startGame = function() {
    let tokens = Object.keys(players)
    if(tokens.length != 2) throw("This is a 2 player game")
    b = [
      [null, null, null], [null, null, null], [null, null, null]
    ]
    started = true
  }
  const mark = function(token, row, column) {
    if(!started) {
      throw("Please start the game")
    } else if(lastPlayer == token) {
      throw("You can't do that")
    } else if(b[row][column] !== null) {
      throw("That cell is not empty")
    }
    b[row][column] = token
    checkWin(token)

    lastPlayer = token
    return b
  }
  const checkWin = function(token) {
    let combinations = [
      [b[0], b[1], b[2]], [b[3], b[4], b[5]], [b[6], b[7], b[8]],
      [b[0], b[3], b[6]], [b[1], b[4], b[7]], [b[2], b[5], b[8]],
      [b[0], b[4], b[8]], [b[2], b[4], b[6]]
    ]

    let winner = false
    combinations.forEach(combination => {
      if(combination == [token, token, token]) {
        console.log(true)
        return winner = true
      }
    })
    console.log(winner)
    if(winner) win(token)
  }
  const win = function(token) {
    throw(`${players[token]} won!`)
  }

  return {
    createPlayer,
    listPlayers,
    startGame,
    mark,
    winner
  }
})()
