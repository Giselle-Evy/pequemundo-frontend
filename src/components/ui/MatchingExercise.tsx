import type { ExercisePair } from '../../types';
import { useMemo, useState } from 'react';

interface MatchingExerciseProps {
  pairs: ExercisePair[];
  onComplete: (isCorrect: boolean) => void;
  disabled: boolean;
  result: boolean | null;
  color: string;
  bgLight: string;
}

interface Match {
  leftId: number;
  rightId: number;
}

export default function MatchingExercise({
  pairs,
  onComplete,
  disabled,
  result,
  color,
  bgLight,
}: MatchingExerciseProps) {
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);

  // Columnas
  const leftItems = pairs;
 // Mezclar la columna derecha para que no coincida con la izquierda
const rightItems = useMemo(() => {
  const shuffled = [...pairs];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}, [pairs]);

  function handleLeftClick(pairId: number) {
    if (disabled || result !== null) return;
    // Si ya está emparejado, no hacer nada
    if (matches.some((m) => m.leftId === pairId)) return;
    setSelectedLeft(pairId);
  }

  function handleRightClick(pairId: number) {
    if (disabled || result !== null) return;
    if (selectedLeft === null) return;
    // Si ya está emparejado, no hacer nada
    if (matches.some((m) => m.rightId === pairId)) return;

    const newMatch = { leftId: selectedLeft, rightId: pairId };
    const newMatches = [...matches, newMatch];
    setMatches(newMatches);
    setSelectedLeft(null);

    // Si ya emparejó todo, verificar
    if (newMatches.length === pairs.length) {
      const isCorrect = newMatches.every((m) => m.leftId === m.rightId);
      onComplete(isCorrect);
    }
  }

  function handleClear() {
    setMatches([]);
    setSelectedLeft(null);
  }

  function getMatchForLeft(pairId: number): number | undefined {
    return matches.find((m) => m.leftId === pairId)?.rightId;
  }

  function getMatchForRight(pairId: number): number | undefined {
    return matches.find((m) => m.rightId === pairId)?.leftId;
  }


  return (
    <div className="space-y-6">
      {/* Instrucción */}
      <p className="text-center text-sm font-bold text-[#59413A]">
        {selectedLeft !== null
          ? '👉 Ahora toca la característica correcta'
          : '👈 Toca un animal para empezar'}
      </p>

      {/* Columnas */}
      <div className="grid grid-cols-2 gap-4 sm:gap-8">
        {/* Columna izquierda */}
        <div className="space-y-3">
          {leftItems.map((pair) => {
            const matchedRight = getMatchForLeft(pair.id);
            const isSelected = selectedLeft === pair.id;
            const isMatched = matchedRight !== undefined;
           

            return (
              <button
                key={pair.id}
                type="button"
                onClick={() => handleLeftClick(pair.id)}
                disabled={disabled || isMatched}
                className={`w-full p-3 sm:p-4 rounded-2xl text-left transition-all flex items-center gap-3 ${
                  disabled || isMatched ? 'cursor-not-allowed' : 'cursor-pointer hover:-translate-y-0.5'
                }`}
                style={{
                  backgroundColor: isSelected ? bgLight : isMatched ? '#E8F5E9' : 'white',
                  border: `3px solid ${
                    isSelected ? color : isMatched ? '#81C784' : '#FFDBD0'
                  }`,
                  boxShadow: isSelected
                    ? `0 8px 16px ${color}44`
                    : '0 4px 8px rgba(93,64,55,0.08)',
                  transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                }}
              >
             
                <span
                  className="text-sm sm:text-base font-black truncate"
                  style={{ color: isMatched ? '#286B33' : '#2C160E' }}
                >
                  {pair.left_text}
                </span>
                {isMatched && <span className="ml-auto text-lg">✓</span>}
              </button>
            );
          })}
        </div>

        {/* Columna derecha */}
        <div className="space-y-3">
          {rightItems.map((pair) => {
            const matchedLeft = getMatchForRight(pair.id);
            const isMatched = matchedLeft !== undefined;
           

            return (
              <button
                key={pair.id}
                type="button"
                onClick={() => handleRightClick(pair.id)}
                disabled={disabled || isMatched || selectedLeft === null}
                className={`w-full p-3 sm:p-4 rounded-2xl text-left transition-all flex items-center gap-3 ${
                  disabled || isMatched || selectedLeft === null
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer hover:-translate-y-0.5'
                }`}
                style={{
                  backgroundColor: isMatched ? '#E8F5E9' : 'white',
                  border: `3px solid ${isMatched ? '#81C784' : '#FFDBD0'}`,
                  boxShadow: '0 4px 8px rgba(93,64,55,0.08)',
                  opacity: selectedLeft === null && !isMatched ? 0.5 : 1,
                }}
              >
               
                <span
                  className="text-sm sm:text-base font-black truncate"
                  style={{ color: isMatched ? '#286B33' : '#2C160E' }}
                >
                  {pair.right_text}
                </span>
                {isMatched && <span className="ml-auto text-lg">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Indicador de progreso */}
      <div className="text-center">
        <p className="text-sm font-bold text-[#59413A]">
          Emparejados: <span className="text-[#286B33] font-black">{matches.length}</span> de{' '}
          <span className="font-black">{pairs.length}</span>
        </p>
      </div>

      {/* Botón limpiar */}
      {!result && matches.length > 0 && (
        <div className="text-center">
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="text-sm font-bold text-[#59413A] hover:text-[#AC3509] px-4 py-2 rounded-full hover:bg-[#FFE2DA] transition"
          >
            Limpiar emparejamientos
          </button>
        </div>
      )}

      {/* Feedback */}
      {result !== null && (
        <div
          className="p-4 rounded-2xl text-center"
          style={{
            backgroundColor: result ? '#ABF4AC' : '#FFDBD0',
            color: result ? '#003D12' : '#AC3509',
          }}
        >
          <p className="font-black text-lg">
            {result ? '¡Excelente! Emparejaste todo bien 🎉' : '¡Casi! Algunos pares no coinciden 💪'}
          </p>
        </div>
      )}
    </div>
  );
}