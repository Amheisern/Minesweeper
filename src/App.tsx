import React, { useState, MouseEvent } from 'react'

export function App() {
  type Cell = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | '*' | '_' | ' ' | 'F'
  type Row = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell]
  type Game = {
    board: [Row, Row, Row, Row, Row, Row, Row, Row]
    id: null | number
    state: null | 'new' | 'playing' | 'won' | 'lost'
    mines: 9
  }
  const [game, setGame] = useState<Game>({
    board: [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
    id: null,
    state: null,
    mines: 9,
  })
  async function handleClickCell(row: number, col: number) {
    if (
      // No game id
      game.id === null ||
      // A winner exists
      game.state === 'won' ||
      game.state === 'lost' ||
      // The space isn't blank
      game.board[row][col] !== ' '
    ) {
      return
    }
    // Generate the URL we need
    const url = `https://minesweeper-api.herokuapp.com/games/${game.id}/check`
    // Make an object to send as JSON
    const body = { row: row, col: col }
    // Make a POST request to make a move
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (response.ok) {
      // Get the response as JSON
      const newGameState = (await response.json()) as Game
      // Make that the new state!
      setGame(newGameState)
    }
  }
  async function flag(row: number, col: number, event: MouseEvent) {
    event?.preventDefault()
    // console.log(game.board[row][col])
    if (
      // No game id
      game.id === null ||
      // A winner exists
      game.state === 'won' ||
      // The space isn't blank
      game.board[row][col] !== ' '
    ) {
      return
    }
    // if (game.board[row][col] === 'F') {
    //   game.board[row][col] = ' '
    // }
    // console.log(event)

    // Generate the URL we need
    const url = `https://minesweeper-api.herokuapp.com/games/${game.id}/flag`
    // Make an object to send as JSON
    const body = { row: row, col: col }
    // Make a POST request to make a move
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (response.ok) {
      // Get the response as JSON
      const newGameState = (await response.json()) as Game
      // Make that the new state!
      setGame(newGameState)
    }
  }
  async function handleNewGame() {
    // Make a POST request to ask for a new game
    const response = await fetch(
      'https://minesweeper-api.herokuapp.com/games',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      }
    )
    if (response.ok) {
      console.log('hello')
      // Get the response as JSON
      const newGameState = (await response.json()) as Game
      // Make that the new state!
      setGame(newGameState)
    }
  }
  function changeCell(cell: string | number) {
    switch (cell) {
      case '*':
        return '💣'
      case 'F':
        return '🚩'
      case '@':
        return '✨'
      case '🚩':
        return ' '
      default:
        return cell
    }
  }
  const header = game.state ? `${game.state}!` : 'Welcome to Minesweeper!'
  return (
    <div>
      <h1>
        {header} {game.id} {game.mines}
        <button onClick={handleNewGame}>New</button>
        <label htmlFor="difficulty">Choose the difficulty:</label>
        <select name="pain" id="difficulty-select">
          <option value="">--Please choose an option--</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hamster">Hard</option>
        </select>
      </h1>
      <ul>
        {game.board.map((row, rowIndex) =>
          row.map((col, colIndex) => (
            <button
              key={colIndex}
              onContextMenu={(event) => flag(rowIndex, colIndex, event)}
              onClick={() => handleClickCell(rowIndex, colIndex)}
            >
              {changeCell(col)}
            </button>
          ))
        )}
      </ul>
    </div>
  )
}
