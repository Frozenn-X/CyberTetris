import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TETROMINOS, Tetromino } from '../../constants/tetrominos';

interface GameState {
  score: number;
  level: number;
  isPlaying: boolean;
  isPaused: boolean;
  grid: number[][];
  currentPiece: number[][];
  piecePosition: { x: number; y: number };
  currentTetromino: Tetromino;
  nextTetromino: Tetromino;
  finalScore: number | undefined;
  finalLevel: number | undefined;
}

// Creates a 20x10 grid filled with zeros
const createEmptyGrid = () => Array(20).fill(null).map(() => Array(10).fill(0));

const getRandomTetromino = () => {
  const pieces = Object.keys(TETROMINOS);
  return TETROMINOS[pieces[Math.floor(Math.random() * pieces.length)]];
};

const initialRandomTetromino = getRandomTetromino();

const initialState: GameState = {
  score: 0,
  level: 1,
  isPlaying: false,
  isPaused: false,
  grid: createEmptyGrid(),
  currentPiece: [],
  piecePosition: { x: 3, y: 0 },
  currentTetromino: initialRandomTetromino,
  nextTetromino: getRandomTetromino(),
  finalScore: undefined,
  finalLevel: undefined,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame: (state) => {
      state.isPlaying = true;
      state.isPaused = false;
      state.grid = createEmptyGrid();
      state.score = 0;
      state.level = 1;
      state.finalScore = undefined;
      state.finalLevel = undefined;
      // Initialize with a random tetromino
      state.currentTetromino = state.nextTetromino;
      state.currentPiece = state.currentTetromino.shape;
      state.piecePosition = { x: 3, y: 0 };
      state.nextTetromino = getRandomTetromino();
    },
    pauseGame: (state) => {
      state.isPaused = true;
    },
    resumeGame: (state) => {
      state.isPaused = false;
    },
    endGame: (state) => {
      // Save final score and level
      state.finalScore = state.score;
      state.finalLevel = state.level;
      
      // Reset game state
      state.isPlaying = false;
      state.isPaused = false;
    },
    updateScore: (state, action: PayloadAction<number>) => {
      state.score += action.payload;
    },
    updateLevel: (state, action: PayloadAction<number>) => {
      state.level = action.payload;
    },
    movePiece: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.piecePosition = action.payload;
    },
    rotatePiece: (state, action: PayloadAction<number[][]>) => {
      state.currentPiece = action.payload;
    },
    updateGrid: (state, action: PayloadAction<number[][]>) => {
      state.grid = action.payload;
    },
    spawnNewPiece: (state) => {
      // Set the next tetromino as current
      state.currentTetromino = state.nextTetromino;
      state.currentPiece = state.nextTetromino.shape;
      state.piecePosition = { x: 3, y: 0 };
      // Generate a new next tetromino
      state.nextTetromino = getRandomTetromino();
    },
  },
});

export const {
  startGame,
  pauseGame,
  resumeGame,
  endGame,
  updateScore,
  updateLevel,
  movePiece,
  rotatePiece,
  updateGrid,
  spawnNewPiece,
} = gameSlice.actions;

export default gameSlice.reducer; 