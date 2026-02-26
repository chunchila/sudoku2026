export type Difficulty = "easy" | "medium" | "hard" | "expert";
export type Board = number[][];
export type CellPosition = { row: number; col: number };

export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { clues: number; label: string; points: number; timeBonus: number; timeLimitSec: number; color: string }
> = {
  easy: { clues: 45, label: "Easy", points: 100, timeBonus: 200, timeLimitSec: 300, color: "#22c55e" },
  medium: { clues: 35, label: "Medium", points: 250, timeBonus: 500, timeLimitSec: 600, color: "#3b82f6" },
  hard: { clues: 28, label: "Hard", points: 500, timeBonus: 1000, timeLimitSec: 900, color: "#f59e0b" },
  expert: { clues: 22, label: "Expert", points: 1000, timeBonus: 2000, timeLimitSec: 1200, color: "#ef4444" },
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function isValid(board: Board, row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if (board[i][j] === num) return false;
    }
  }
  return true;
}

function solve(board: Board): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of nums) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solve(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function countSolutions(board: Board, limit: number): number {
  let count = 0;
  function solveCount(b: Board): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (b[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(b, row, col, num)) {
              b[row][col] = num;
              if (solveCount(b)) return true;
              b[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    count++;
    return count >= limit;
  }
  const copy = board.map((r) => [...r]);
  solveCount(copy);
  return count;
}

export function generatePuzzle(difficulty: Difficulty): { puzzle: Board; solution: Board } {
  const board: Board = Array.from({ length: 9 }, () => Array(9).fill(0));
  solve(board);
  const solution = board.map((r) => [...r]);

  const { clues } = DIFFICULTY_CONFIG[difficulty];
  const cellsToRemove = 81 - clues;
  const positions = shuffle(
    Array.from({ length: 81 }, (_, i) => ({ row: Math.floor(i / 9), col: i % 9 }))
  );

  let removed = 0;
  for (const { row, col } of positions) {
    if (removed >= cellsToRemove) break;
    const backup = board[row][col];
    board[row][col] = 0;
    if (countSolutions(board, 2) === 1) {
      removed++;
    } else {
      board[row][col] = backup;
    }
  }

  return { puzzle: board, solution };
}

export function checkValue(solution: Board, row: number, col: number, value: number): boolean {
  return solution[row][col] === value;
}

export function isBoardComplete(board: Board): boolean {
  return board.every((row) => row.every((cell) => cell !== 0));
}

export function calculateScore(difficulty: Difficulty, elapsedSec: number, mistakes: number): number {
  const config = DIFFICULTY_CONFIG[difficulty];
  const base = config.points;
  const timeFraction = Math.max(0, 1 - elapsedSec / config.timeLimitSec);
  const timeBonus = Math.round(config.timeBonus * timeFraction);
  const mistakePenalty = mistakes * 25;
  return Math.max(0, base + timeBonus - mistakePenalty);
}

export function getRelatedCells(row: number, col: number): CellPosition[] {
  const cells: CellPosition[] = [];
  for (let i = 0; i < 9; i++) {
    if (i !== col) cells.push({ row, col: i });
    if (i !== row) cells.push({ row: i, col });
  }
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (r !== row || c !== col) {
        if (!cells.some((p) => p.row === r && p.col === c)) {
          cells.push({ row: r, col: c });
        }
      }
    }
  }
  return cells;
}
