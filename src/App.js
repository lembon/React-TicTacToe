import { useState } from 'react';

function Square({ value, onSquareClick, winning }) {
  
  return (
    <button
      className={ !winning ? "square" : "square winning-square"}
      onClick={onSquareClick}
    >
      { value }
    </button>
  )
}

function Board({ xIsNext, squares, onPlay }) {

  const [winner, winnerSquares] = calculateWinner(squares);
  function handleClick(i) {
    if (squares[i] || winner) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares)
  }


  let status;
  if (winner) {
    status = 'Ganador: ' + winner;
  } else if (squares.every((element) => { return element !== null })) {
    status = 'Empate';
  } else {
    status = 'Siguiente jugador: ' + (xIsNext ? 'X' : 'O');
  }

  const rows = [];
  for (let i=0; i<3 ;i++) {
    rows.push(
      <div className="board-row">
        {
          [0, 1, 2].map((square) => {
            const squareId = i*3+square
            return <Square
                      value={squares[squareId]}
                      onSquareClick={() => handleClick(squareId)}
                      winning={winnerSquares?.includes(squareId)}
                   />
          })
        }

      </div>
    )

  }
  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [orderAsc, setOrderAsc] = useState(true)

  function handlePlay (nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((status, move, moves) => {

    const findPosition = () => {
      for (let i=0; i < status.length; i++) {
        if (status[i] && (move === 0 || !moves[move-1][i])) { 
          return [ Math.floor(i / 3), i % 3 ]
        }
      }
    }
    const position = findPosition()

    let description;
    if (move > 0) {
      description = 'Ir al movimiento #' + move;
    } else {
      description = 'Ir al inicio del juego';
    }
    return (
      <li key={move}>
        <>
        { move === moves.length - 1 ?
          <span>Estás en el movimiento {move}</span>
          :
          <button onClick={() => jumpTo(move)}>{description}</button>  
        }
        { position &&
           <span>{ '   -> (' + position + ')'}</span>  
        }
        </>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
      <button onClick={() => {setOrderAsc(!orderAsc)}} > {orderAsc ? 'Asc' : 'Desc'} </button>
      <ol>{orderAsc ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], [a, b, c]];
    }
  }
  return [null, null];
}