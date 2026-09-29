interface SuccessFeedbackProps {
  childName: string;
  pointsEarned: number;
  correctAnswer: string;
  onNext: () => void;
  isLastExercise: boolean;
}

export default function SuccessFeedback({
  childName,
  pointsEarned,
  correctAnswer,
  onNext,
  isLastExercise,
}: SuccessFeedbackProps) {
  return (
    <div
      className="w-full rounded-[2rem] p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6"
      style={{
        background:
          'linear-gradient(to right, #ABF4AC, #FFFFFF, #ABF4AC)',
        boxShadow:
          '0 24px 36px -8px rgba(40,107,51,0.18), inset 0 4px 8px rgba(255,255,255,0.9)',
      }}
    >
      <div className="flex items-center gap-5 flex-col lg:flex-row text-center lg:text-left">
        <div
          className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-4xl shrink-0 animate-bounce"
          style={{
            boxShadow: '0 8px 16px rgba(40,107,51,0.2), inset 0 3px 5px rgba(255,255,255,0.9)',
          }}
        >
          🏆
        </div>
        <div>
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#286B33] text-white text-xs font-black mb-2"
            style={{ boxShadow: '0 2px 0 #07521D' }}
          >
            ⭐ ¡+{pointsEarned} puntos!
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#003D12]">
            ¡Excelente trabajo, {childName}! 🎉
          </h2>
          <p className="text-sm font-bold text-[#2C160E] mt-2 max-w-xl">
            ¡Exacto! El <strong className="text-[#286B33]">{correctAnswer}</strong> es la
            respuesta correcta.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="w-full lg:w-auto min-h-[56px] px-8 py-3 rounded-full font-black text-lg flex items-center justify-center gap-2 transition-all active:translate-y-1"
        style={{
          backgroundColor: '#286B33',
          color: 'white',
          boxShadow: '0 6px 0 #07521D, inset 0 3px 4px rgba(255,255,255,0.4)',
        }}
      >
        <span>{isLastExercise ? '¡Terminar materia!' : '¡Siguiente reto!'}</span>
        
      </button>
    </div>
  );
}