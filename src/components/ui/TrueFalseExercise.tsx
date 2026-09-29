interface TrueFalseExerciseProps {
  onAnswer: (answer: 'true' | 'false') => void;
  disabled: boolean;
  selected: 'true' | 'false' | null;
  color: string;
  bgLight: string;
}

export default function TrueFalseExercise({
  onAnswer,
  disabled,
  selected,
  color,
  bgLight,
}: TrueFalseExerciseProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
      {/* Botón Verdadero */}
      <button
        type="button"
        onClick={() => onAnswer('true')}
        disabled={disabled}
        className={`group flex flex-col items-center justify-center p-8 rounded-[2rem] transition-all ${
          disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1'
        } ${selected === 'true' ? '-translate-y-2 scale-105' : ''}`}
        style={{
          backgroundColor: selected === 'true' ? '#ABF4AC' : '#FFFFFF',
          boxShadow:
            selected === 'true'
              ? '0 16px 28px -4px rgba(40,107,51,0.35), inset 0 4px 8px rgba(255,255,255,0.9), 0 6px 0 #286B33'
              : '0 12px 24px -6px rgba(93,64,55,0.12), inset 0 4px 6px rgba(255,255,255,0.9), 0 6px 0 #E0BFB6',
          border: selected === 'true' ? '3px solid #286B33' : '3px solid transparent',
        }}
      >
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-6xl mb-4"
          style={{
            backgroundColor: selected === 'true' ? '#286B33' : bgLight,
            boxShadow: 'inset 0 3px 6px rgba(255,255,255,0.6)',
          }}
        >
          {selected === 'true' ? '✅' : '👍'}
        </div>
        <span
          className="text-3xl font-black"
          style={{ color: selected === 'true' ? '#003D12' : color }}
        >
          Verdadero
        </span>
        <span className="text-sm font-bold text-[#59413A] mt-1">
          Sí es correcto
        </span>
      </button>

      {/* Botón Falso */}
      <button
        type="button"
        onClick={() => onAnswer('false')}
        disabled={disabled}
        className={`group flex flex-col items-center justify-center p-8 rounded-[2rem] transition-all ${
          disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1'
        } ${selected === 'false' ? '-translate-y-2 scale-105' : ''}`}
        style={{
          backgroundColor: selected === 'false' ? '#FFDBD0' : '#FFFFFF',
          boxShadow:
            selected === 'false'
              ? '0 16px 28px -4px rgba(172,53,9,0.35), inset 0 4px 8px rgba(255,255,255,0.9), 0 6px 0 #AC3509'
              : '0 12px 24px -6px rgba(93,64,55,0.12), inset 0 4px 6px rgba(255,255,255,0.9), 0 6px 0 #E0BFB6',
          border: selected === 'false' ? '3px solid #AC3509' : '3px solid transparent',
        }}
      >
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-6xl mb-4"
          style={{
            backgroundColor: selected === 'false' ? '#AC3509' : '#FFDBD0',
            boxShadow: 'inset 0 3px 6px rgba(255,255,255,0.6)',
          }}
        >
          {selected === 'false' ? '❌' : '👎'}
        </div>
        <span
          className="text-3xl font-black"
          style={{ color: selected === 'false' ? '#641800' : color }}
        >
          Falso
        </span>
        <span className="text-sm font-bold text-[#59413A] mt-1">
          No es correcto
        </span>
      </button>
    </div>
  );
}