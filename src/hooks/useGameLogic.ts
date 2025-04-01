import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  movePiece,
  rotatePiece,
  updateGrid,
  spawnNewPiece,
  updateScore,
  updateLevel,
  endGame,
} from '../store/slices/gameSlice';

const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;
const BASE_SPEED = 1000; // Base speed in milliseconds
const MIN_SPEED = 100;   // Minimum speed in milliseconds

// Level thresholds - player will level up when reaching these scores
const LEVEL_THRESHOLDS = [
  0,      // Level 1 starts at 0 points
  1000,   // Level 2 starts at 1000 points 
  3000,   // Level 3 starts at 3000 points
  6000,   // Level 4
  10000,  // Level 5
  15000,  // Level 6
  21000,  // Level 7
  28000,  // Level 8
  36000,  // Level 9
  45000,  // Level 10
];

export const useGameLogic = () => {
  const dispatch = useDispatch();
  const { isPlaying, isPaused, grid, currentPiece, piecePosition, level, score, currentTetromino, nextTetromino } = useSelector(
    (state: RootState) => state.game
  );
  
  // Calculate game speed based on score instead of level
  const calculateGameSpeed = useCallback(() => {
    // Score-based speed (faster as score increases)
    // Reduce delay by 40ms for every 250 points - more responsive speed changes
    const speedReduction = Math.floor(score / 250) * 40;
    return Math.max(MIN_SPEED, BASE_SPEED - speedReduction);
  }, [score]);

  // Check if player should level up based on score
  const checkLevelUp = useCallback(() => {
    if (!isPlaying) return;
    
    // Find the appropriate level for the current score
    let newLevel = 1;
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (score >= LEVEL_THRESHOLDS[i]) {
        newLevel = i + 1;
        break;
      }
    }
    
    // If calculated level is higher than current level, update it
    if (newLevel > level) {
      dispatch(updateLevel(newLevel));
    }
  }, [dispatch, isPlaying, level, score]);

  const checkCollision = useCallback(
    (newPosition: { x: number; y: number }, piece: number[][]) => {
      // Make sure piece is defined and has rows
      if (!piece || piece.length === 0) {
        return false;
      }

      for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
          // Only check filled cells (value of 1)
          if (piece[y][x] !== 0) {
            const newX = x + newPosition.x;
            const newY = y + newPosition.y;

            // Check boundaries
            if (
              newX < 0 || // Left wall
              newX >= GRID_WIDTH || // Right wall
              newY >= GRID_HEIGHT || // Bottom wall
              newY < 0 // Top (allow pieces to start off-screen)
            ) {
              return true; // Collision detected
            }

            // Check collision with existing blocks in grid
            // Only check if newY is within grid (allow pieces to start off-screen)
            if (newY >= 0 && grid[newY] && grid[newY][newX] !== 0) {
              return true; // Collision detected
            }
          }
        }
      }
      return false; // No collision
    },
    [grid]
  );

  const mergePieceToGrid = useCallback(() => {
    // Create a deep copy of the grid
    const newGrid = grid.map(row => [...row]);
    
    // Make sure we have valid piece data
    if (!currentPiece || currentPiece.length === 0) {
      return newGrid;
    }

    // Merge the current piece into the grid
    for (let y = 0; y < currentPiece.length; y++) {
      for (let x = 0; x < currentPiece[y].length; x++) {
        if (currentPiece[y][x] !== 0) {
          const gridY = y + piecePosition.y;
          const gridX = x + piecePosition.x;
          
          // Only add cells that are within the grid
          if (gridY >= 0 && gridY < GRID_HEIGHT && gridX >= 0 && gridX < GRID_WIDTH) {
            newGrid[gridY][gridX] = 1;
          }
        }
      }
    }
    
    return newGrid;
  }, [grid, currentPiece, piecePosition]);

  const clearLines = useCallback((grid: number[][]) => {
    let linesCleared = 0;
    
    // Filter out completed rows
    const newGrid = grid.filter(row => {
      const isLineFull = row.every(cell => cell !== 0);
      if (isLineFull) {
        linesCleared++;
        return false;
      }
      return true;
    });

    // Add new empty rows at the top
    while (newGrid.length < GRID_HEIGHT) {
      newGrid.unshift(Array(GRID_WIDTH).fill(0));
    }

    // Calculate points based on number of lines cleared
    if (linesCleared > 0) {
      // Dynamic scoring based on level:
      // Base score is 60 points per line
      // Each level increases point value by ~7% (level 2 = 64, level 3 = 68, etc.)
      const basePointsPerLine = 60;
      const levelMultiplier = 1 + ((level - 1) * 0.07);
      
      // Calculate total points (rounded to integer)
      const points = Math.round(linesCleared * basePointsPerLine * levelMultiplier);
      
      dispatch(updateScore(points));
      
      // Check if player should level up
      checkLevelUp();
    }

    return newGrid;
  }, [dispatch, level, checkLevelUp]);

  // Check if game is over
  const checkGameOver = useCallback(() => {
    // Game is over if there's a collision at the top of the board
    if (!nextTetromino || !nextTetromino.shape) return false;
    
    const newPosition = { x: 3, y: 0 };
    return checkCollision(newPosition, nextTetromino.shape);
  }, [checkCollision, nextTetromino]);

  const moveDown = useCallback(() => {
    if (!isPlaying || isPaused) return;
    
    const newPosition = { ...piecePosition, y: piecePosition.y + 1 };
    
    if (!checkCollision(newPosition, currentPiece)) {
      // Move piece down
      dispatch(movePiece(newPosition));
    } else {
      // If we can't move down, merge piece to grid
      const newGrid = mergePieceToGrid();
      const clearedGrid = clearLines(newGrid);
      dispatch(updateGrid(clearedGrid));
      
      // Spawn a new piece
      dispatch(spawnNewPiece());
      
      // Check if game over
      const gameOver = checkGameOver();
      if (gameOver) {
        dispatch(endGame());
      }
    }
  }, [
    isPlaying, 
    isPaused, 
    piecePosition, 
    currentPiece, 
    checkCollision, 
    dispatch, 
    mergePieceToGrid, 
    clearLines,
    checkGameOver
  ]);

  const moveLeft = useCallback(() => {
    if (!isPlaying || isPaused) return;
    
    const newPosition = { ...piecePosition, x: piecePosition.x - 1 };
    if (!checkCollision(newPosition, currentPiece)) {
      dispatch(movePiece(newPosition));
    }
  }, [isPlaying, isPaused, checkCollision, currentPiece, dispatch, piecePosition]);

  const moveRight = useCallback(() => {
    if (!isPlaying || isPaused) return;
    
    const newPosition = { ...piecePosition, x: piecePosition.x + 1 };
    if (!checkCollision(newPosition, currentPiece)) {
      dispatch(movePiece(newPosition));
    }
  }, [isPlaying, isPaused, checkCollision, currentPiece, dispatch, piecePosition]);

  const rotate = useCallback(() => {
    if (!isPlaying || isPaused) return;
    
    // Handle rotation
    const rotatedPiece = currentPiece[0].map((_, i) =>
      currentPiece.map((row) => row[i]).reverse()
    );
    
    // Check if the rotation is valid
    if (!checkCollision(piecePosition, rotatedPiece)) {
      dispatch(rotatePiece(rotatedPiece));
    } 
    // Wall kicks logic - try to push the piece away from the wall if rotation fails
    else {
      // Try moving right
      const rightKick = { ...piecePosition, x: piecePosition.x + 1 };
      if (!checkCollision(rightKick, rotatedPiece)) {
        dispatch(movePiece(rightKick));
        dispatch(rotatePiece(rotatedPiece));
        return;
      }
      
      // Try moving left
      const leftKick = { ...piecePosition, x: piecePosition.x - 1 };
      if (!checkCollision(leftKick, rotatedPiece)) {
        dispatch(movePiece(leftKick));
        dispatch(rotatePiece(rotatedPiece));
        return;
      }
      
      // Try moving up (for I piece mostly)
      const upKick = { ...piecePosition, y: piecePosition.y - 1 };
      if (!checkCollision(upKick, rotatedPiece)) {
        dispatch(movePiece(upKick));
        dispatch(rotatePiece(rotatedPiece));
        return;
      }
    }
  }, [isPlaying, isPaused, currentPiece, piecePosition, dispatch, checkCollision]);

  // Function to explicitly end the game (for UI button)
  const forceEndGame = useCallback(() => {
    dispatch(endGame());
  }, [dispatch]);

  // Set up game loop
  useEffect(() => {
    if (!isPlaying || isPaused) return;

    // Check if score has increased enough for level up
    checkLevelUp();
    
    const gameSpeed = calculateGameSpeed();
    const gameLoop = setInterval(() => {
      moveDown();
    }, gameSpeed);

    return () => {
      clearInterval(gameLoop);
    };
  }, [
    isPlaying,
    isPaused,
    moveDown,
    score,
    calculateGameSpeed,
    checkLevelUp
  ]);

  return {
    moveLeft,
    moveRight,
    moveDown,
    rotate,
    forceEndGame,
  };
}; 