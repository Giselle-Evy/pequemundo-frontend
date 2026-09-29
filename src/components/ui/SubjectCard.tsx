import ProgressBar from './ProgressBar';

interface SubjectCardProps {
  icon: string;
  name: string;
  tagline: string;
  description: string;
  completed: number;
  total: number;
  percentage: number;
  color: string;
  bgLight: string;
  onPlay: () => void;
}

export default function SubjectCard({
  icon,
  name,
  tagline,
  description,
  completed,
  total,
  percentage,
  color,
  bgLight,
  onPlay,
}: SubjectCardProps) {
  return (
    <div
      className="bg-white rounded-[2rem] p-6 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1"
      style={{
        boxShadow: `0 16px 28px -6px ${color}30, inset 0 4px 8px rgba(255,255,255,0.9), inset 0 -6px 8px ${color}10`,
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-extrabold px-3 py-1 rounded-full shadow-sm"
            style={{ backgroundColor: bgLight, color }}
          >
            {tagline}
          </span>
          <span className="text-2xl font-black" style={{ color }}>
            {percentage}%
          </span>
        </div>

        <div
          className="w-full h-32 rounded-2xl flex items-center justify-center shadow-inner"
          style={{ backgroundColor: bgLight }}
        >
          <span className="text-7xl select-none" role="img" aria-label={name}>
            {icon}
          </span>
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-[#2C160E]">{name}</h3>
          <p className="text-sm font-bold text-[#59413A] mt-1">{description}</p>
        </div>

        <div className="flex flex-col gap-1">
          <ProgressBar percentage={percentage} color={color} />
          <p className="text-xs font-bold text-[#59413A] text-right">
            {completed} de {total} ejercicios
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onPlay}
        className="mt-4 w-full py-3.5 px-4 rounded-full font-extrabold text-base text-white flex items-center justify-center gap-2 transition-all active:translate-y-1"
        style={{
          backgroundColor: color,
          boxShadow: `0 5px 0 ${color}88, 0 10px 14px ${color}40`,
        }}
      >
        <span>¡Comenzar {name}!</span>
        <span className="text-lg"></span>
      </button>
    </div>
  );
}