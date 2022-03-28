import React, { useState } from 'react'

export function App() {
  type Cell = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | '*' | '_' | ' '
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
      // The space isn't blank
      game.board[row][col] !== ' '
    ) {
      return
    }
    // Generate the URL we need
    const url = `https://sdg-minesweeper-api.herokuapp.com/game/${game.id}`
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
  return (
    <div>
      <h1>
        Minesweeper
        <label htmlFor="difficulty">Choose the difficulty:</label>
        <select name="pets" id="pet-select">
          <option value="">--Please choose an option--</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hamster">Hard</option>
        </select>
      </h1>
      <ul></ul>
    </div>
  )
}
