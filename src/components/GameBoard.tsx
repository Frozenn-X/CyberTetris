import React from 'react';
import styles from './GameBoard.module.css';
import { Tetromino } from '../constants/tetrominos';

interface GameBoardProps {
  grid: number[][];
  currentPiece: number[][];
  piecePosition: { x: number; y: number };
  currentTetromino: Tetromino;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  grid, 
  currentPiece, 
  piecePosition, 
  currentTetromino 
}) => {
  const renderCell = (value: number, isCurrentPiece: boolean, color: string = '') => (
    <div
      className={`${styles.cell} ${value ? styles.filled : ''} ${
        isCurrentPiece ? styles.currentPiece : ''
      }`}
      style={isCurrentPiece || value ? { 
        backgroundColor: isCurrentPiece ? currentTetromino.color : '#646cff',
        boxShadow: isCurrentPiece ? `0 0 5px ${currentTetromino.color}, 0 0 10px ${currentTetromino.color}` : undefined
      } : {}}
    />
  );

  const renderRow = (row: number[], rowIndex: number) => {
    return row.map((cell, colIndex) => {
      // Check if this cell is part of the current piece
      let isCurrentPiece = false;
      
      if (
        rowIndex >= piecePosition.y && 
        rowIndex < piecePosition.y + currentPiece.length && 
        colIndex >= piecePosition.x && 
        colIndex < piecePosition.x + currentPiece[0].length
      ) {
        const pieceRowIndex = rowIndex - piecePosition.y;
        const pieceColIndex = colIndex - piecePosition.x;
        
        if (
          pieceRowIndex >= 0 && 
          pieceColIndex >= 0 && 
          pieceRowIndex < currentPiece.length && 
          pieceColIndex < currentPiece[0].length
        ) {
          isCurrentPiece = currentPiece[pieceRowIndex][pieceColIndex] === 1;
        }
      }
      
      return <div key={colIndex} className="cell-container">{renderCell(cell, isCurrentPiece)}</div>;
    });
  };

  return (
    <div className={styles.board}>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {renderRow(row, rowIndex)}
        </div>
      ))}
    </div>
  );
};

export default GameBoard; 