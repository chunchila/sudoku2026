"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  type Difficulty,
  type Board,
  type CellPosition,
  DIFFICULTY_CONFIG,
  generatePuzzle,
  checkValue,
  isBoardComplete,
  calculateScore,
  getRelatedCells,
} from "@/lib/sudoku";

type GameState = "menu" | "playing" | "won";

interface CellState {
  value: number;
  isGiven: boolean;
  isError: boolean;
  notes: Set<number>;
}

interface SerializedCell {
  value: number;
  isGiven: boolean;
  isError: boolean;
  notes: number[];
}

interface SavedGame {
  difficulty: Difficulty;
  cells: SerializedCell[][];
  solution: Board;
  elapsed: number;
  mistakes: number;
  hintsLeft: number;
  savedAt: number;
}

const SAVE_KEY = "sudoku-save";

function saveGame(data: SavedGame) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {}
}

function loadGame(): SavedGame | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedGame;
  } catch {
    return null;
  }
}

function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {}
}

function serializeCells(cells: CellState[][]): SerializedCell[][] {
  return cells.map((row) =>
    row.map((c) => ({
      value: c.value,
      isGiven: c.isGiven,
      isError: c.isError,
      notes: Array.from(c.notes),
    }))
  );
}

function deserializeCells(cells: SerializedCell[][]): CellState[][] {
  return cells.map((row) =>
    row.map((c) => ({
      value: c.value,
      isGiven: c.isGiven,
      isError: c.isError,
      notes: new Set(c.notes),
    }))
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

const BACKGROUNDS = [
  { id: "none", label: "None", preview: "bg-background", class: "" },
  { id: "ocean", label: "Ocean", preview: "bg-gradient-to-br from-blue-900 to-indigo-950", class: "bg-theme-ocean" },
  { id: "sunset", label: "Sunset", preview: "bg-gradient-to-br from-orange-900 to-purple-950", class: "bg-theme-sunset" },
  { id: "forest", label: "Forest", preview: "bg-gradient-to-br from-emerald-900 to-teal-950", class: "bg-theme-forest" },
  { id: "aurora", label: "Aurora", preview: "bg-gradient-to-br from-indigo-600 to-pink-600", class: "bg-theme-aurora" },
  { id: "cherry", label: "Cherry", preview: "bg-gradient-to-br from-rose-900 to-purple-950", class: "bg-theme-cherry" },
  { id: "midnight", label: "Midnight", preview: "bg-gradient-to-br from-slate-900 to-indigo-950", class: "bg-theme-midnight" },
] as const;

type BgId = (typeof BACKGROUNDS)[number]["id"];

function useBackground() {
  const [bgId, setBgId] = useState<BgId>("none");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sudoku-bg") as BgId | null;
      if (saved && BACKGROUNDS.some((b) => b.id === saved)) setBgId(saved);
    } catch {}
  }, []);

  const set = (id: BgId) => {
    setBgId(id);
    try { localStorage.setItem("sudoku-bg", id); } catch {}
  };

  return { bgId, setBg: set };
}

function BackgroundLayer({ bgId }: { bgId: BgId }) {
  const bg = BACKGROUNDS.find((b) => b.id === bgId);
  if (!bg || bg.id === "none") return null;

  return (
    <div className="fixed inset-0 -z-10 transition-all duration-700">
      <div className={`absolute inset-0 ${bg.class}`} />
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
        style={{
          top: "10%",
          left: "15%",
          background: "radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)",
          animation: "bg-float 20s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-3xl"
        style={{
          bottom: "10%",
          right: "10%",
          background: "radial-gradient(circle, rgba(255,255,255,0.1), transparent 70%)",
          animation: "bg-float-reverse 25s ease-in-out infinite",
        }}
      />
    </div>
  );
}

function BackgroundPicker({ bgId, onSelect }: { bgId: BgId; onSelect: (id: BgId) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`p-2.5 rounded-xl border text-foreground transition-all active:scale-95 cursor-pointer ${
          bgId !== "none"
            ? "bg-accent/15 border-accent/40 hover:bg-accent/25"
            : "bg-card border-card-border hover:bg-cell-hover"
        }`}
        aria-label="Change background"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-card border border-card-border rounded-2xl p-3 shadow-xl animate-scale-in z-50 w-52">
          <p className="text-xs text-muted font-medium mb-2 px-1">Background</p>
          <div className="grid grid-cols-4 gap-2">
            {BACKGROUNDS.map((bg) => (
              <button
                key={bg.id}
                onClick={() => { onSelect(bg.id); setOpen(false); }}
                className={`group relative w-10 h-10 rounded-xl border-2 transition-all cursor-pointer overflow-hidden ${
                  bgId === bg.id
                    ? "border-accent scale-110 shadow-md"
                    : "border-card-border hover:border-muted hover:scale-105"
                }`}
                aria-label={bg.label}
                title={bg.label}
              >
                {bg.id === "none" ? (
                  <div className="w-full h-full bg-background flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
                  </div>
                ) : (
                  <div className={`w-full h-full ${bg.preview}`} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("sudoku-theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      className="p-2.5 rounded-xl bg-card border border-card-border text-foreground hover:bg-cell-hover transition-all active:scale-95 cursor-pointer"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
      )}
    </button>
  );
}

function ConfettiEffect() {
  const colors = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899", "#8b5cf6"];
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        >
          <div
            style={{
              width: `${8 + Math.random() * 8}px`,
              height: `${8 + Math.random() * 8}px`,
              backgroundColor: colors[Math.floor(Math.random() * colors.length)],
              borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            }}
          />
        </div>
      ))}
    </div>
  );
}

function SettingsBar({ bgId, onBgSelect }: { bgId: BgId; onBgSelect: (id: BgId) => void }) {
  return (
    <div className="flex items-center gap-2">
      <BackgroundPicker bgId={bgId} onSelect={onBgSelect} />
      <ThemeToggle />
    </div>
  );
}

function DifficultySelector({
  onSelect,
  onContinue,
  savedGame,
  bgId,
  onBgSelect,
}: {
  onSelect: (d: Difficulty) => void;
  onContinue: () => void;
  savedGame: SavedGame | null;
  bgId: BgId;
  onBgSelect: (id: BgId) => void;
}) {
  const difficulties: Difficulty[] = ["easy", "medium", "hard", "expert"];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fade-in">
      <div className="fixed top-4 right-4 z-10">
        <SettingsBar bgId={bgId} onBgSelect={onBgSelect} />
      </div>
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-3">
          <span className="bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
            Sudoku
          </span>
        </h1>
        <p className="text-muted text-lg">Choose your challenge</p>
      </div>

      {savedGame && (
        <button
          onClick={onContinue}
          className="w-full max-w-lg mb-6 group relative overflow-hidden rounded-2xl bg-accent/10 border-2 border-accent/40 p-5 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-accent cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><polygon points="6 3 20 12 6 21 6 3"/></svg>
              <div>
                <span className="font-semibold text-lg text-accent">Continue Game</span>
                <div className="flex items-center gap-3 text-sm text-muted mt-0.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: DIFFICULTY_CONFIG[savedGame.difficulty].color }} />
                    {DIFFICULTY_CONFIG[savedGame.difficulty].label}
                  </span>
                  <span className="font-mono">{formatTime(savedGame.elapsed)}</span>
                  <span>{savedGame.mistakes} mistake{savedGame.mistakes !== 1 ? "s" : ""}</span>
                </div>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted group-hover:text-accent transition-colors"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </button>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
        {difficulties.map((d) => {
          const config = DIFFICULTY_CONFIG[d];
          return (
            <button
              key={d}
              onClick={() => onSelect(d)}
              className="group relative overflow-hidden rounded-2xl bg-card border border-card-border p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-accent/50 cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -translate-y-8 translate-x-8 transition-transform group-hover:scale-150" style={{ backgroundColor: config.color }} />
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span className="font-semibold text-lg">{config.label}</span>
              </div>
              <div className="text-muted text-sm space-y-1">
                <p>{81 - config.clues} cells to fill</p>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium text-foreground">
                    {config.points}
                  </span>
                  <span>base pts</span>
                  <span className="text-xs">+</span>
                  <span className="font-mono font-medium text-foreground">
                    {config.timeBonus}
                  </span>
                  <span>time bonus</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GameBoard({
  cells,
  selectedCell,
  onCellClick,
}: {
  cells: CellState[][];
  selectedCell: CellPosition | null;
  onCellClick: (row: number, col: number) => void;
}) {
  const relatedCells = selectedCell
    ? getRelatedCells(selectedCell.row, selectedCell.col)
    : [];
  const selectedValue =
    selectedCell ? cells[selectedCell.row][selectedCell.col].value : 0;

  function getCellClasses(row: number, col: number): string {
    const cell = cells[row][col];
    const isSelected =
      selectedCell?.row === row && selectedCell?.col === col;
    const isRelated = relatedCells.some((p) => p.row === row && p.col === col);
    const hasSameValue =
      selectedValue > 0 && cell.value === selectedValue && !isSelected;

    let bg = "bg-card";
    if (isSelected) bg = "bg-cell-selected";
    else if (cell.isError) bg = "bg-cell-error";
    else if (hasSameValue) bg = "bg-cell-same-value";
    else if (isRelated) bg = "bg-cell-related";

    const borders: string[] = [];
    if (col % 3 === 0 && col > 0) borders.push("border-l-2 border-l-grid-border");
    if (row % 3 === 0 && row > 0) borders.push("border-t-2 border-t-grid-border");

    return `${bg} ${borders.join(" ")} ${!isSelected ? "hover:bg-cell-hover" : ""} transition-colors duration-100`;
  }

  return (
    <div className="animate-scale-in">
      <div
        className="grid grid-cols-9 border-2 border-grid-border rounded-xl overflow-hidden shadow-lg"
        style={{ width: "min(90vw, 450px)", height: "min(90vw, 450px)" }}
      >
        {cells.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => onCellClick(r, c)}
              className={`relative border border-card-border/50 flex items-center justify-center cursor-pointer select-none ${getCellClasses(r, c)}`}
              aria-label={`Row ${r + 1}, Column ${c + 1}${cell.value ? `, Value ${cell.value}` : ", Empty"}`}
            >
              {cell.value > 0 ? (
                <span
                  className={`text-lg sm:text-xl font-semibold ${
                    cell.isGiven
                      ? "text-cell-given"
                      : cell.isError
                        ? "text-error"
                        : "text-cell-filled"
                  }`}
                >
                  {cell.value}
                </span>
              ) : cell.notes.size > 0 ? (
                <div className="grid grid-cols-3 gap-0 w-full h-full p-0.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <span
                      key={n}
                      className="text-[8px] sm:text-[10px] text-muted flex items-center justify-center leading-none"
                    >
                      {cell.notes.has(n) ? n : ""}
                    </span>
                  ))}
                </div>
              ) : null}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function NumberPad({
  onNumber,
  onErase,
  onHint,
  notesMode,
  onToggleNotes,
  hintsLeft,
  numberCounts,
}: {
  onNumber: (n: number) => void;
  onErase: () => void;
  onHint: () => void;
  notesMode: boolean;
  onToggleNotes: () => void;
  hintsLeft: number;
  numberCounts: Record<number, number>;
}) {
  return (
    <div className="flex flex-col gap-3 w-full max-w-md animate-fade-in">
      <div className="grid grid-cols-9 gap-1.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
          const remaining = 9 - (numberCounts[n] || 0);
          const isComplete = remaining <= 0;
          return (
            <button
              key={n}
              onClick={() => onNumber(n)}
              disabled={isComplete}
              className={`relative aspect-square rounded-xl font-bold text-xl transition-all duration-200 cursor-pointer
                ${isComplete
                  ? "bg-card-border/50 text-muted/30 cursor-not-allowed"
                  : "bg-card border border-card-border hover:bg-accent hover:text-white hover:border-accent active:scale-95 text-foreground shadow-sm"
                }`}
            >
              {n}
              {!isComplete && (
                <span className="absolute bottom-0.5 right-1.5 text-[9px] text-muted font-normal">
                  {remaining}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onErase}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-card border border-card-border text-foreground font-medium transition-all hover:bg-error/10 hover:border-error/50 hover:text-error active:scale-95 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/><path d="m12 9 6 6"/><path d="m18 9-6 6"/></svg>
          Erase
        </button>
        <button
          onClick={onToggleNotes}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-medium transition-all active:scale-95 cursor-pointer ${
            notesMode
              ? "bg-accent text-white border-accent"
              : "bg-card border-card-border text-foreground hover:bg-accent/10 hover:border-accent/50"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>
          Notes
        </button>
        <button
          onClick={onHint}
          disabled={hintsLeft <= 0}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-medium transition-all active:scale-95 cursor-pointer ${
            hintsLeft <= 0
              ? "bg-card-border/50 text-muted/50 border-transparent cursor-not-allowed"
              : "bg-card border-card-border text-foreground hover:bg-warning/10 hover:border-warning/50 hover:text-warning"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
          Hint ({hintsLeft})
        </button>
      </div>
    </div>
  );
}

function WinScreen({
  score,
  difficulty,
  elapsed,
  mistakes,
  onNewGame,
  onMenu,
}: {
  score: number;
  difficulty: Difficulty;
  elapsed: number;
  mistakes: number;
  onNewGame: () => void;
  onMenu: () => void;
}) {
  const config = DIFFICULTY_CONFIG[difficulty];
  return (
    <>
      <ConfettiEffect />
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-40 p-6 animate-fade-in">
        <div className="bg-card border border-card-border rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-scale-in">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-1">Puzzle Complete!</h2>
          <p className="text-muted mb-6">{config.label} difficulty</p>

          <div className="bg-background rounded-2xl p-6 mb-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted">Score</span>
              <span className="text-3xl font-bold text-accent">{score}</span>
            </div>
            <div className="h-px bg-card-border" />
            <div className="flex justify-between items-center">
              <span className="text-muted">Time</span>
              <span className="font-mono font-semibold">{formatTime(elapsed)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">Mistakes</span>
              <span className={`font-semibold ${mistakes > 0 ? "text-error" : "text-success"}`}>
                {mistakes}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">Base Points</span>
              <span className="font-semibold">{config.points}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">Time Bonus</span>
              <span className="font-semibold text-success">
                +{Math.max(0, score - config.points + mistakes * 25)}
              </span>
            </div>
            {mistakes > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-muted">Mistake Penalty</span>
                <span className="font-semibold text-error">-{mistakes * 25}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onMenu}
              className="py-3 rounded-xl border border-card-border text-foreground font-medium hover:bg-cell-hover transition-all active:scale-95 cursor-pointer"
            >
              Menu
            </button>
            <button
              onClick={onNewGame}
              className="py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent-light transition-all active:scale-95 cursor-pointer"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [cells, setCells] = useState<CellState[][]>([]);
  const [solution, setSolution] = useState<Board>([]);
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [notesMode, setNotesMode] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [savedSnapshot, setSavedSnapshot] = useState<SavedGame | null>(null);
  const { bgId, setBg } = useBackground();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRestoringRef = useRef(false);

  useEffect(() => {
    setSavedSnapshot(loadGame());
  }, []);

  const startGame = useCallback((d: Difficulty) => {
    clearSave();
    setSavedSnapshot(null);
    setDifficulty(d);
    const { puzzle, solution: sol } = generatePuzzle(d);
    setSolution(sol);
    setCells(
      puzzle.map((row) =>
        row.map((val) => ({
          value: val,
          isGiven: val !== 0,
          isError: false,
          notes: new Set<number>(),
        }))
      )
    );
    setSelectedCell(null);
    setElapsed(0);
    setMistakes(0);
    setHintsLeft(3);
    setNotesMode(false);
    setScore(0);
    setIsPaused(false);
    setGameState("playing");
  }, []);

  const resumeGame = useCallback(() => {
    const saved = loadGame();
    if (!saved) return;
    isRestoringRef.current = true;
    setDifficulty(saved.difficulty);
    setSolution(saved.solution);
    setCells(deserializeCells(saved.cells));
    setElapsed(saved.elapsed);
    setMistakes(saved.mistakes);
    setHintsLeft(saved.hintsLeft);
    setSelectedCell(null);
    setNotesMode(false);
    setScore(0);
    setIsPaused(false);
    setGameState("playing");
    requestAnimationFrame(() => { isRestoringRef.current = false; });
  }, []);

  useEffect(() => {
    if (gameState === "playing" && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsed((e) => e + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, isPaused]);

  useEffect(() => {
    if (gameState !== "playing" || cells.length === 0 || isRestoringRef.current) return;
    saveGame({
      difficulty,
      cells: serializeCells(cells),
      solution,
      elapsed,
      mistakes,
      hintsLeft,
      savedAt: Date.now(),
    });
  }, [gameState, cells, elapsed, mistakes, hintsLeft, difficulty, solution]);

  const numberCounts: Record<number, number> = {};
  if (cells.length > 0) {
    for (const row of cells) {
      for (const cell of row) {
        if (cell.value > 0) {
          numberCounts[cell.value] = (numberCounts[cell.value] || 0) + 1;
        }
      }
    }
  }

  const handleCellClick = useCallback((row: number, col: number) => {
    setSelectedCell({ row, col });
  }, []);

  const handleNumber = useCallback(
    (num: number) => {
      if (!selectedCell || gameState !== "playing") return;
      const { row, col } = selectedCell;

      setCells((prev) => {
        if (prev[row][col].isGiven) return prev;

        const next = prev.map((r) => r.map((c) => ({ ...c, notes: new Set(c.notes) })));

        if (notesMode) {
          if (next[row][col].value > 0) return prev;
          const notes = next[row][col].notes;
          if (notes.has(num)) notes.delete(num);
          else notes.add(num);
          return next;
        }

        const isCorrect = checkValue(solution, row, col, num);
        next[row][col].value = num;
        next[row][col].notes = new Set();
        next[row][col].isError = !isCorrect;

        if (!isCorrect) {
          setMistakes((m) => m + 1);
        } else {
          for (const r of next) {
            for (const c of r) {
              c.notes.delete(num);
            }
          }
        }

        const board = next.map((r) => r.map((c) => c.value));
        if (isBoardComplete(board)) {
          const allCorrect = next.every((r) => r.every((c) => !c.isError));
          if (allCorrect) {
            setTimeout(() => {
              clearSave();
              setSavedSnapshot(null);
              setScore(
                calculateScore(
                  difficulty,
                  elapsed,
                  isCorrect ? mistakes : mistakes + 1
                )
              );
              setGameState("won");
            }, 300);
          }
        }

        return next;
      });
    },
    [selectedCell, gameState, notesMode, solution, difficulty, elapsed, mistakes]
  );

  const handleErase = useCallback(() => {
    if (!selectedCell || gameState !== "playing") return;
    const { row, col } = selectedCell;
    setCells((prev) => {
      if (prev[row][col].isGiven) return prev;
      const next = prev.map((r) => r.map((c) => ({ ...c, notes: new Set(c.notes) })));
      next[row][col].value = 0;
      next[row][col].isError = false;
      next[row][col].notes = new Set();
      return next;
    });
  }, [selectedCell, gameState]);

  const handleHint = useCallback(() => {
    if (hintsLeft <= 0 || gameState !== "playing") return;

    const emptyCells: CellPosition[] = [];
    cells.forEach((row, r) =>
      row.forEach((cell, c) => {
        if (!cell.isGiven && cell.value !== solution[r][c]) {
          emptyCells.push({ row: r, col: c });
        }
      })
    );

    if (emptyCells.length === 0) return;
    const target = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    setCells((prev) => {
      const next = prev.map((r) => r.map((c) => ({ ...c, notes: new Set(c.notes) })));
      next[target.row][target.col].value = solution[target.row][target.col];
      next[target.row][target.col].isError = false;
      next[target.row][target.col].notes = new Set();

      const board = next.map((r) => r.map((c) => c.value));
      if (isBoardComplete(board)) {
        const allCorrect = next.every((r) => r.every((c) => !c.isError));
        if (allCorrect) {
          setTimeout(() => {
            clearSave();
            setSavedSnapshot(null);
            setScore(calculateScore(difficulty, elapsed, mistakes));
            setGameState("won");
          }, 300);
        }
      }

      return next;
    });
    setHintsLeft((h) => h - 1);
    setSelectedCell(target);
  }, [hintsLeft, gameState, cells, solution, difficulty, elapsed, mistakes]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (gameState !== "playing") return;

      if (e.key >= "1" && e.key <= "9") {
        handleNumber(parseInt(e.key));
      } else if (e.key === "Backspace" || e.key === "Delete") {
        handleErase();
      } else if (e.key === "n" || e.key === "N") {
        setNotesMode((m) => !m);
      } else if (selectedCell) {
        const { row, col } = selectedCell;
        if (e.key === "ArrowUp" && row > 0) setSelectedCell({ row: row - 1, col });
        if (e.key === "ArrowDown" && row < 8) setSelectedCell({ row: row + 1, col });
        if (e.key === "ArrowLeft" && col > 0) setSelectedCell({ row, col: col - 1 });
        if (e.key === "ArrowRight" && col < 8) setSelectedCell({ row, col: col + 1 });
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, handleNumber, handleErase, selectedCell]);

  if (gameState === "menu") {
    return (
      <>
        <BackgroundLayer bgId={bgId} />
        <DifficultySelector onSelect={startGame} onContinue={resumeGame} savedGame={savedSnapshot} bgId={bgId} onBgSelect={setBg} />
      </>
    );
  }

  const config = DIFFICULTY_CONFIG[difficulty];

  return (
    <>
    <BackgroundLayer bgId={bgId} />
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-6">
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 animate-fade-in">
        <button
          onClick={() => setGameState("menu")}
          className="flex items-center gap-2 text-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Menu
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            <span className="font-medium text-sm">{config.label}</span>
          </div>
          <SettingsBar bgId={bgId} onBgSelect={setBg} />
        </div>
      </div>

      {/* Stats Bar */}
      <div className="w-full max-w-md grid grid-cols-3 gap-3 mb-5 animate-fade-in">
        <div className="bg-card border border-card-border rounded-xl px-4 py-3 text-center">
          <div className="text-xs text-muted mb-1">Time</div>
          <div className="font-mono font-semibold text-lg">{formatTime(elapsed)}</div>
        </div>
        <div className="bg-card border border-card-border rounded-xl px-4 py-3 text-center">
          <div className="text-xs text-muted mb-1">Mistakes</div>
          <div className={`font-semibold text-lg ${mistakes > 0 ? "text-error" : ""}`}>
            {mistakes}
          </div>
        </div>
        <div className="bg-card border border-card-border rounded-xl px-4 py-3 text-center">
          <div className="text-xs text-muted mb-1">Points</div>
          <div className="font-semibold text-lg text-accent">
            {config.points}
            <span className="text-xs text-muted font-normal ml-0.5">+</span>
          </div>
        </div>
      </div>

      {/* Board */}
      <GameBoard
        cells={cells}
        selectedCell={selectedCell}
        onCellClick={handleCellClick}
      />

      {/* Number Pad */}
      <div className="mt-5 w-full flex justify-center">
        <NumberPad
          onNumber={handleNumber}
          onErase={handleErase}
          onHint={handleHint}
          notesMode={notesMode}
          onToggleNotes={() => setNotesMode((m) => !m)}
          hintsLeft={hintsLeft}
          numberCounts={numberCounts}
        />
      </div>

      {/* Keyboard Shortcut Hint */}
      <div className="mt-4 text-xs text-muted text-center hidden sm:block">
        Use <kbd className="px-1.5 py-0.5 rounded bg-card border border-card-border font-mono text-[10px]">1-9</kbd> to fill · <kbd className="px-1.5 py-0.5 rounded bg-card border border-card-border font-mono text-[10px]">N</kbd> notes · <kbd className="px-1.5 py-0.5 rounded bg-card border border-card-border font-mono text-[10px]">←↑↓→</kbd> navigate · <kbd className="px-1.5 py-0.5 rounded bg-card border border-card-border font-mono text-[10px]">⌫</kbd> erase
      </div>

      {/* Win Screen */}
      {gameState === "won" && (
        <WinScreen
          score={score}
          difficulty={difficulty}
          elapsed={elapsed}
          mistakes={mistakes}
          onNewGame={() => startGame(difficulty)}
          onMenu={() => setGameState("menu")}
        />
      )}
    </div>
    </>
  );
}
