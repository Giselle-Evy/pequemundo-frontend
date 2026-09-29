import { useState } from 'react';

interface FillBlankExerciseProps {
  question: string;
  onSubmit: (answer: string) => void;
  disabled: boolean;
  color: string;
  bgLight: string;
}

export default function FillBlankExercise({
  question,
  onSubmit,
  disabled,
  color,
  bgLight,
}: FillBlankExerciseProps) {
  const [answer, setAnswer] = useState('');

  // Separar la pregunta por el ___
  const parts = question.split('___');

  function handleSubmit() {
    if (!answer.trim() || disabled) return;
    onSubmit(answer.trim());
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Frase con espacio en blanco */}
      <div
        className="rounded-[2rem] p-6 sm:p-8 mb-6 text-center"
        style={{ backgroundColor: bgLight }}
      >
        <p className="text-2xl sm:text-3xl font-black text-[#2C160E] leading-relaxed flex flex-wrap items-center justify-center gap-3">
          <span>{parts[0]}</span>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="escribe aquí"
            autoComplete="off"
            autoFocus
            maxLength={30}
            className="inline-block px-4 py-2 rounded-2xl font-black text-center text-2xl sm:text-3xl border-4 focus:outline-none transition-all"
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: color,
              color: '#2C160E',
              boxShadow: `0 4px 0 ${color}66, inset 0 2px 4px rgba(0,0,0,0.05)`,
              minWidth: '180px',
              maxWidth: '300px',
            }}
          />
          <span>{parts[1] || ''}</span>
        </p>
      </div>

      {/* Botón comprobar */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!answer.trim() || disabled}
          className="w-full sm:w-auto min-w-[280px] min-h-[64px] px-8 py-4 rounded-full font-black text-lg flex items-center justify-center gap-3 transition-all active:translate-y-1.5 disabled:opacity-50 disabled:pointer-events-none"
          style={{
            backgroundColor: '#FF7043',
            color: 'white',
            boxShadow:
              '0 8px 0 #AC3509, inset 0 4px 6px rgba(255,255,255,0.6)',
          }}
        >
          <span>¡Comprobar respuesta!</span>
          <span className="text-xl">✨</span>
        </button>
      </div>

      <p className="text-center text-xs font-bold text-[#59413A] mt-3 opacity-70">
        💡 Presiona Enter para comprobar rápido
      </p>
    </div>
  );
}