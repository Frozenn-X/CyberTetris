import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { startGame, pauseGame, resumeGame, endGame } from '../store/slices/gameSlice';
import { useGameLogic } from '../hooks/useGameLogic';
import GameBoard from './GameBoard';
import styles from './Game.module.css';

const NextPiecePreview: React.FC<{ shape: number[][], color: string }> = ({ shape, color }) => {
  // Create a grid that's the size of the piece
  const grid = Array(shape.length).fill(null).map(() => Array(shape[0].length).fill(0));
  
  return (
    <div className={styles.nextPiece}>
      <div className={styles.nextPieceTitle}>Next</div>
      <div style={{ 
        display: 'grid', 
        gridTemplateRows: `repeat(${shape.length}, 1fr)`,
        gap: '0' 
      }}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} style={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${shape[0].length}, 1fr)`,
            gap: '0' 
          }}>
            {row.map((_, colIndex) => (
              <div
                key={colIndex}
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: shape[rowIndex][colIndex] ? color : 'rgba(10, 10, 22, 0.9)',
                  border: shape[rowIndex][colIndex] 
                    ? `1px solid rgba(255, 255, 255, 0.5)` 
                    : '1px solid rgba(0, 255, 255, 0.05)',
                  boxShadow: shape[rowIndex][colIndex] ? `0 0 5px ${color}` : 'none',
                  borderRadius: '0'
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const Game: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    isPlaying, 
    isPaused, 
    score, 
    level, 
    grid, 
    currentPiece, 
    piecePosition, 
    currentTetromino, 
    nextTetromino,
    finalScore,
    finalLevel
  } = useSelector(
    (state: RootState) => state.game
  );
  const { moveLeft, moveRight, rotate, moveDown, forceEndGame } = useGameLogic();

  const handleStart = () => {
    dispatch(startGame());
  };

  const handlePause = () => {
    dispatch(pauseGame());
  };

  const handleResume = () => {
    dispatch(resumeGame());
  };

  const handleEnd = () => {
    forceEndGame();
  };

  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (isPaused) return;

      switch (event.key) {
        case 'ArrowLeft':
          moveLeft();
          break;
        case 'ArrowRight':
          moveRight();
          break;
        case 'ArrowDown':
          moveDown();
          break;
        case 'ArrowUp':
          rotate();
          break;
        case ' ':
          // Space to drop piece instantly
          event.preventDefault();
          let dropCount = 0;
          while (!isPaused && dropCount < 20) {
            moveDown();
            dropCount++;  // safety to prevent infinite loop
          }
          break;
        default:
          break;
      }
    };

    // Prevent scrolling when arrow keys are pressed
    const preventArrowScroll = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keydown', preventArrowScroll);
    
    // Disable scrolling
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keydown', preventArrowScroll);
      
      // Re-enable scrolling
      document.body.style.overflow = '';
    };
  }, [isPlaying, isPaused, moveLeft, moveRight, moveDown, rotate]);

  return (
    <div className={styles.game}>
      
      <div className={styles.gameContainer}>
        <GameBoard
          grid={grid}
          currentPiece={currentPiece}
          piecePosition={piecePosition}
          currentTetromino={currentTetromino}
        />
        
        <div className={styles.sidePanel}>
          <div className={styles.gameInfo}>
            <div>Score: {score}</div>
            <div>Level: {level}</div>
          </div>
          
          {nextTetromino && isPlaying && !isPaused && (
            <NextPiecePreview 
              shape={nextTetromino.shape} 
              color={nextTetromino.color} 
            />
          )}
          
          <div className={styles.instructions}>
            <h3>Game Rules</h3>
            <p>Use arrow keys to move and rotate pieces</p>
            <p>↑ : Rotate</p>
            <p>← → : Move horizontally</p>
            <p>↓ : Move down</p>
            <p>Space : Drop instantly</p>
            <p>Clear lines to score points</p>
            <p>Game over when pieces reach the top</p>
          </div>
          
          <div className={styles.gameControls}>
            {!isPlaying ? (
              <button onClick={handleStart}>Start Game</button>
            ) : (
              <>
                {isPaused ? (
                  <button onClick={handleResume}>Resume</button>
                ) : (
                  <button onClick={handlePause}>Pause</button>
                )}
                <button onClick={handleEnd}>End Game</button>
              </>
            )}
          </div>
        </div>
      </div>

      {isPaused && isPlaying && (
        <div className={styles.gameStatus}>
          <h2>Game Paused</h2>
          <button onClick={handleResume}>Resume</button>
        </div>
      )}

      {!isPlaying && (finalScore !== undefined && finalScore >= 0) && (
        <div className={styles.gameStatus}>
          <h2 className={styles.gameOver}>Game Over</h2>
          {finalScore === 0 ? (
            <p className={styles.zeroScoreMessage}>Oops, something wrong?</p>
          ) : (
            <>
              <p>Final Score: {finalScore}</p>
              <p>Level Reached: {finalLevel}</p>
            </>
          )}
          <button onClick={handleStart}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default Game; 