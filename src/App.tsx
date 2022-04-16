import React, { useState, MouseEvent, useEffect } from 'react'
import { Header } from './components/Header'

export function App() {
  type GameDifficulty = 0 | 1 | 2
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
  const [difficulty, setDifficulty] = useState<GameDifficulty>(0)

  useEffect(function () {
    async function loadExistingGame() {
      const existingGameId = localStorage.getItem('game')
      const newGameDifficulty = localStorage.getItem('difficulty')
      console.log('existingGameId', existingGameId)
      if (existingGameId && newGameDifficulty) {
        const response = await fetch(
          `https://minesweeper-api.herokuapp.com/games/${existingGameId}`
        )
        if (response.ok) {
          const game = await response.json()

          setGame(game)
          setDifficulty(parseInt(newGameDifficulty) as GameDifficulty)
        }
      }
    }
    loadExistingGame()
  }, [])

  async function newGame(newGameDifficulty: 0 | 1 | 2) {
    const gameDifficulty = { difficulty: newGameDifficulty }
    // Make a POST request to ask for a new game
    const response = await fetch(
      'https://minesweeper-api.herokuapp.com/games',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(gameDifficulty),
      }
    )
    if (response.ok) {
      console.log('hello')
      // Get the response as JSON
      // const newDifficulty = await response.json()
      const newGameState = (await response.json()) as Game
      // Make that the new state!
      setDifficulty(newGameDifficulty)
      setGame(newGameState)
      localStorage.setItem('game', JSON.stringify(newGameState.id))
      localStorage.setItem('difficulty', JSON.stringify(newGameDifficulty))
    }
  }

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
    const body = { id: game.id, row, col }
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
    const body = { row, col }
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
  const header = game.state ? `${game.state}!` : 'Welcome to My Minesweeper!'
  return (
    <div>
      {/* {if (newGameState){
         <Header game={newGameState} />
      } */}
      <Header header={header} />
      <h1>
        {/* {header}  */}
        {game.id} {game.mines}
        <button onClick={() => newGame(0)}>Easy</button>
        <button onClick={() => newGame(1)}>Medium</button>
        <button onClick={() => newGame(2)}>Hard</button>
      </h1>
      <section className={`difficulty-${difficulty}`}>
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
      </section>
    </div>
  )
}
