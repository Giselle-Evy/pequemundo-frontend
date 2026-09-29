import type { Exercise } from '../../types';
import { getExerciseThemeEmoji } from '../../data/emojis';

export type ExerciseStatus = 'completed' | 'current' | 'locked';

interface ExerciseCardProps {
  exercise: Exercise;
  number: number;
  status: ExerciseStatus;
  onPlay: () => void;
  color: string;
  bgLight: string;
}

export default function ExerciseCard({
  exercise,
  number,
  status,
  onPlay,
  color,
  bgLight,
}: ExerciseCardProps) {
  // === ESTADO COMPLETADO ===
  if (status === 'completed') {
    return (
      <div
        className="flex flex-col justify-between rounded-[2rem] p-5 transition-transform hover:-translate-y-1"
        style={{
          backgroundColor: bgLight,
          boxShadow: `0 10px 20px -4px ${color}30, inset 0 4px 6px rgba(255,255,255,0.9), inset 0 -4px 6px rgba(0,0,0,0.04)`,
        }}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-black text-lg"
              style={{ color, boxShadow: `0 3px 0 ${color}66` }}
            >
              {number}
            </span>
            <div
              className="flex items-center gap-1 bg-white px-2 py-1 rounded-full text-xs font-bold"
              style={{ color, boxShadow: `0 2px 0 ${color}66` }}
            >
              <span>✅</span>
              <span>Hecho</span>
            </div>
          </div>

          <div
            className="w-full h-28 rounded-2xl bg-white/70 flex items-center justify-center shadow-inner"
            style={{ border: `2px solid ${color}20` }}
          >
            <span className="text-5xl select-none">
            {getExerciseThemeEmoji(exercise.title || '', exercise.question || '')}
          </span>
          </div>

          <h3 className="text-base font-extrabold text-[#2C160E] line-clamp-2 leading-tight">
            {exercise.title || exercise.question}
          </h3>
        </div>

        <div className="pt-4 space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex">
              <span className="text-amber-500 text-base">⭐⭐⭐</span>
            </div>
            <span className="text-xs font-bold text-[#59413A]">
              +{exercise.points_reward} pts
            </span>
          </div>
          <button
            type="button"
            onClick={onPlay}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-full font-extrabold text-sm transition-all active:translate-y-1"
            style={{
              backgroundColor: 'white',
              color,
              boxShadow: `0 4px 0 ${color}66, inset 0 2px 4px rgba(255,255,255,0.9)`,
            }}
          >
      
            <span>Repetir reto</span>
          </button>
        </div>
      </div>
    );
  }

  // === ESTADO ACTUAL (DESTACADO) ===
  if (status === 'current') {
    return (
      <div
        className="relative flex flex-col justify-between bg-white rounded-[2rem] p-6 transition-all hover:scale-[1.02]"
        style={{
          boxShadow: `0 20px 40px -8px ${color}50, 0 8px 16px rgba(255,112,67,0.2), inset 0 4px 8px rgba(255,255,255,1)`,
          border: `3px solid ${color}`,
        }}
      >
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-black flex items-center gap-2 animate-pulse"
          style={{
            backgroundColor: '#FF7043',
            boxShadow: '0 4px 0 #AC3509, 0 8px 16px rgba(172,53,9,0.3)',
          }}
        >
         ¡EMPIEZA AQUÍ!
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xl text-white"
                style={{ backgroundColor: color, boxShadow: `0 4px 0 ${color}88` }}
              >
                {number}
              </span>
              <div>
                <span
                  className="text-[10px] font-black uppercase tracking-wider"
                  style={{ color }}
                >
                  Tu siguiente desafío
                </span>
                <h3 className="text-lg sm:text-xl font-black text-[#2C160E] leading-tight">
                  {exercise.title || exercise.question}
                </h3>
              </div>
            </div>
          </div>

          <div
            className="w-full h-32 rounded-2xl flex items-center justify-center shadow-inner"
            style={{ backgroundColor: bgLight, border: `2px solid ${color}30` }}
          >
            <span className="text-6xl select-none">⭐</span>
          </div>

          {exercise.instructions && (
            <p className="text-sm font-bold text-[#59413A]">
              {exercise.instructions}
            </p>
          )}
        </div>

        <div className="pt-4 space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#59413A]">Recompensa</span>
            <span className="text-sm font-black" style={{ color }}>
              +{exercise.points_reward} pts
            </span>
          </div>
          <button
            type="button"
            onClick={onPlay}
            className="w-full h-14 flex items-center justify-center gap-3 rounded-full font-black text-lg text-white transition-all active:translate-y-2"
            style={{
              backgroundColor: '#FF7043',
              boxShadow: '0 8px 0 #AC3509, 0 16px 24px rgba(172,53,9,0.25), inset 0 3px 6px rgba(255,255,255,0.7)',
            }}
          >
            <span>¡JUGAR AHORA!</span>
          </button>
        </div>
      </div>
    );
  }

  // === ESTADO BLOQUEADO ===
  return (
    <div
      className="flex flex-col justify-between rounded-[2rem] p-5 opacity-70"
      style={{
        backgroundColor: '#FFE2DA',
        boxShadow: 'inset 0 2px 4px rgba(93,64,55,0.08)',
      }}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="w-10 h-10 rounded-full bg-[#FFDBD0] flex items-center justify-center font-black text-lg text-[#8D7169]">
            {number}
          </span>
          <div className="flex items-center gap-1 bg-[#FFE2DA] px-2 py-1 rounded-full text-xs font-bold text-[#8D7169]">
            <span>🔒</span>
            <span>Bloqueado</span>
          </div>
        </div>

        <div className="w-full h-24 rounded-2xl bg-[#FFF1ED] flex flex-col items-center justify-center text-center p-3 shadow-inner">
          <span className="text-3xl opacity-70">🔒</span>
          <span className="text-[11px] font-bold text-[#8D7169] mt-1">
            Completa el ejercicio {number - 1}
          </span>
        </div>

        <h3 className="text-sm font-extrabold text-[#59413A]/80 line-clamp-2 leading-tight">
          {exercise.title || exercise.question}
        </h3>
      </div>

      <div className="pt-4">
        <button
          type="button"
          disabled
          className="w-full h-12 flex items-center justify-center gap-2 bg-[#FFDBD0] text-[#8D7169] font-bold text-sm rounded-full cursor-not-allowed"
          style={{ boxShadow: '0 3px 0 #E0BFB6' }}
        >
          <span>🔒</span>
          <span>Bloqueado</span>
        </button>
      </div>
    </div>
  );
}