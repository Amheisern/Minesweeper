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
