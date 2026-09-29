import { useEffect, useState } from 'react';

interface WordSearchGameProps {
  onClose?: () => void;
}

interface Cell {
  row: number;
  col: number;
  letter: string;
  wordIds: number[];
}

interface PlacedWord {
  id: number;
  word: string;
  cells: { row: number; col: number }[];
  found: boolean;
  color: string;
}

const WORDS = ['PERRO', 'GATO', 'LEON', 'RANA', 'OSO'];
const COLORS = ['#FF7043', '#286B33', '#006688', '#BA68C8', '#FFB300'];
const GRID_SIZE = 10;

// Direcciones: horizontal, vertical, diagonal
const DIRECTIONS = [
  { dr: 0, dc: 1 }, // →
  { dr: 1, dc: 0 }, // ↓
  { dr: 1, dc: 1 }, // ↘
  { dr: -1, dc: 1 }, // ↗
];

function generateGrid(): { grid: Cell[][]; placedWords: PlacedWord[] } {
  // Crear grid vacío
  const grid: Cell[][] = Array.from({ length: GRID_SIZE }, (_, r) =>
    Array.from({ length: GRID_SIZE }, (_, c) => ({
      row: r,
      col: c,
      letter: '',
      wordIds: [],
    }))
  );

  const placedWords: PlacedWord[] = [];

  WORDS.forEach((word, wordId) => {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
      attempts++;

      const dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const startRow = Math.floor(Math.random() * GRID_SIZE);
      const startCol = Math.floor(Math.random() * GRID_SIZE);

      // Verificar que la palabra quepa
      const endRow = startRow + dir.dr * (word.length - 1);
      const endCol = startCol + dir.dc * (word.length - 1);

      if (endRow < 0 || endRow >= GRID_SIZE || endCol < 0 || endCol >= GRID_SIZE) {
        continue;
      }

      // Verificar que las celdas estén libres o tengan la misma letra
      let canPlace = true;
      const cells: { row: number; col: number }[] = [];

      for (let i = 0; i < word.length; i++) {
        const r = startRow + dir.dr * i;
        const c = startCol + dir.dc * i;
        const cell = grid[r][c];

        if (cell.letter !== '' && cell.letter !== word[i]) {
          canPlace = false;
          break;
        }
        cells.push({ row: r, col: c });
      }

      if (!canPlace) continue;

      // Colocar la palabra
      cells.forEach((cell, i) => {
        grid[cell.row][cell.col].letter = word[i];
        grid[cell.row][cell.col].wordIds.push(wordId);
      });

      placedWords.push({
        id: wordId,
        word,
        cells,
        found: false,
        color: COLORS[wordId % COLORS.length],
      });

      placed = true;
    }
  });

  // Rellenar celdas vacías con letras aleatorias
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c].letter === '') {
        grid[r][c].letter = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return { grid, placedWords };
}

function getCellsBetween(
  start: { row: number; col: number },
  end: { row: number; col: number }
): { row: number; col: number }[] | null {
  const dr = end.row - start.row;
  const dc = end.col - start.col;

  // Solo permitir horizontal, vertical o diagonal (45°)
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) {
    return null;
  }

  const steps = Math.max(Math.abs(dr), Math.abs(dc));
  const stepR = steps === 0 ? 0 : dr / steps;
  const stepC = steps === 0 ? 0 : dc / steps;

  const cells: { row: number; col: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    cells.push({
      row: start.row + stepR * i,
      col: start.col + stepC * i,
    });
  }
  return cells;
}

export default function WordSearchGame({ onClose }: WordSearchGameProps) {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
  const [selectedStart, setSelectedStart] = useState<{ row: number; col: number } | null>(null);
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([]);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  function startNewGame() {
    const { grid: newGrid, placedWords: newWords } = generateGrid();
    setGrid(newGrid);
    setPlacedWords(newWords);
    setSelectedStart(null);
    setSelectedCells([]);
    setGameWon(false);
  }

  function handleCellClick(row: number, col: number) {
    if (gameWon) return;

    if (!selectedStart) {
      // Primer clic
      setSelectedStart({ row, col });
      setSelectedCells([{ row, col }]);
      return;
    }

    // Segundo clic: verificar la palabra
    const path = getCellsBetween(selectedStart, { row, col });

    if (!path || path.length < 2) {
      // Reiniciar selección
      setSelectedStart({ row, col });
      setSelectedCells([{ row, col }]);
      return;
    }

    // Buscar la palabra formada en la lista
    const wordText = path.map((c) => grid[c.row][c.col].letter).join('');
    const wordTextReversed = wordText.split('').reverse().join('');

    // Buscar la palabra en placedWords (en cualquier dirección)
    const foundWord = placedWords.find((w) => {
      if (w.found) return false;
      // Comparar celdas en orden
      const wCells = w.cells;
      if (wCells.length !== path.length) return false;

      // Comparar normal
      const matchesNormal = wCells.every(
        (c, i) => c.row === path[i].row && c.col === path[i].col
      );
      if (matchesNormal) return true;

      // Comparar al revés
      const matchesReverse = wCells.every(
        (c, i) => c.row === path[path.length - 1 - i].row && c.col === path[path.length - 1 - i].col
      );
      return matchesReverse;
    });

    if (foundWord && (foundWord.word === wordText || foundWord.word === wordTextReversed)) {
      // ¡Encontrada!
      const updated = placedWords.map((w) =>
        w.id === foundWord.id ? { ...w, found: true } : w
      );
      setPlacedWords(updated);

      // Verificar victoria
      if (updated.every((w) => w.found)) {
        setGameWon(true);
      }

      setSelectedStart(null);
      setSelectedCells([]);
    } else {
      // No es palabra → selección no válida
      setSelectedStart(null);
      setSelectedCells([]);
    }
  }

  // Verifica si una celda debe resaltarse
  function getCellColor(row: number, col: number): string | null {
    const foundWord = placedWords.find(
      (w) => w.found && w.cells.some((c) => c.row === row && c.col === col)
    );
    return foundWord ? foundWord.color : null;
  }

  // Verifica si una celda está seleccionada actualmente
  function isSelected(row: number, col: number): boolean {
    return selectedCells.some((c) => c.row === row && c.col === col);
  }

  const foundCount = placedWords.filter((w) => w.found).length;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Barra superior */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full bg-white/80 backdrop-blur font-black text-sm shadow-md">
            ✅ {foundCount}/{placedWords.length}
          </div>
          <button
            type="button"
            onClick={startNewGame}
            className="px-4 py-2 rounded-full bg-[#FF7043] text-white font-black text-sm shadow-md hover:brightness-110 transition"
          >
            🔄 Reiniciar
          </button>
        </div>
      </div>

      {/* Instrucción */}
      <p className="text-center text-sm font-bold text-[#59413A] mb-4">
        {selectedStart
          ? '👉 Ahora toca la última letra de la palabra'
          : '👈 Toca la primera letra de una palabra'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Grid de letras */}
        <div className="sm:col-span-2">
          <div
            className="grid gap-1 p-3 rounded-[2rem] bg-white/90 backdrop-blur shadow-lg mx-auto"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
              maxWidth: '500px',
            }}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const foundColor = getCellColor(r, c);
                const selected = isSelected(r, c);

                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    onClick={() => handleCellClick(r, c)}
                    className="aspect-square rounded-lg flex items-center justify-center font-black text-sm sm:text-base transition-all"
                    style={{
                      backgroundColor: foundColor
                        ? foundColor
                        : selected
                        ? '#FFD54F'
                        : '#F1F5F9',
                      color: foundColor ? 'white' : '#1E293B',
                      boxShadow: foundColor
                        ? `0 2px 0 ${foundColor}88`
                        : selected
                        ? '0 2px 0 #D97706'
                        : '0 1px 2px rgba(0,0,0,0.05)',
                      transform: selected ? 'scale(1.05)' : 'scale(1)',
                    }}
                  >
                    {cell.letter}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Lista de palabras */}
        <div className="sm:col-span-1">
          <div className="bg-white/90 backdrop-blur rounded-[2rem] p-5 shadow-lg">
            <h3 className="text-sm font-black text-[#59413A] uppercase tracking-wider mb-3">
              Palabras a encontrar
            </h3>
            <div className="space-y-2">
              {placedWords.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center gap-2 text-sm font-black transition-all"
                  style={{
                    color: w.found ? w.color : '#59413A',
                    textDecoration: w.found ? 'line-through' : 'none',
                    opacity: w.found ? 0.6 : 1,
                  }}
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: w.found ? w.color : '#E2E8F0',
                    }}
                  />
                  {w.word}
                  {w.found && <span className="ml-auto">✅</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje de victoria */}
      {gameWon && (
        <div
          className="mt-6 p-6 rounded-[2rem] text-center"
          style={{
            background: 'linear-gradient(135deg, #FFD54F, #FF7043)',
            boxShadow: '0 8px 16px rgba(172,53,9,0.3)',
          }}
        >
          <div className="text-5xl mb-2">🎉</div>
          <p className="text-2xl font-black text-white mb-1">
            ¡Encontraste todas las palabras!
          </p>
          <button
            type="button"
            onClick={startNewGame}
            className="mt-4 px-6 py-3 rounded-full bg-white text-[#AC3509] font-black shadow-lg hover:scale-105 transition"
          >
            Jugar otra vez
          </button>
        </div>
      )}

      {onClose && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-bold text-[#59413A] hover:text-[#AC3509] underline"
          >
            ← Volver a la zona de juegos
          </button>
        </div>
      )}
    </div>
  );
}