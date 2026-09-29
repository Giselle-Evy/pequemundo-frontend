import { getEmojiForOption } from '../../data/emojis';

interface RetryFeedbackProps {
  explanation: string;
  onRetry: () => void;
}

export default function RetryFeedback({
  explanation,
  onRetry,
}: RetryFeedbackProps) {
  return (
    <div
      className="w-full rounded-[2rem] p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6"
      style={{
        background: 'linear-gradient(to right, #FFE2DA, #FFFFFF, #FFE2DA)',
        boxShadow: '0 20px 30px -6px rgba(172,53,9,0.14), inset 0 4px 8px rgba(255,255,255,0.9)',
      }}
    >
      <div className="flex items-center gap-5 flex-col lg:flex-row text-center lg:text-left">
        <div
          className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl shrink-0"
          style={{ boxShadow: '0 6px 12px rgba(172,53,9,0.15)' }}
        >
          🌱
        </div>
        <div>
          <h3 className="text-2xl font-black text-[#AC3509]">
            ¡Estuviste muy cerquita! 💪
          </h3>
          <p className="text-sm font-bold text-[#59413A] mt-2 max-w-xl">
            {explanation}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="w-full lg:w-auto min-h-[52px] px-6 py-3 rounded-full font-black text-base flex items-center justify-center gap-2 transition-all active:translate-y-1"
        style={{
          backgroundColor: '#FFDBD0',
          color: '#AC3509',
          boxShadow: '0 4px 0 #E0BFB6, inset 0 2px 4px rgba(255,255,255,0.8)',
        }}
      >
        <span>Intentar de nuevo</span>
      </button>
    </div>
  );
}