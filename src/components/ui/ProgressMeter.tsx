interface ProgressMeterProps {
  current: number;
  total: number;
  color?: string;
}

export default function ProgressMeter({
  current,
  total,
  color = '#81C784',
}: ProgressMeterProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="flex items-center gap-3 w-full">
      <div
        className="relative flex-1 h-7 rounded-full p-1"
        style={{
          backgroundColor: '#FFE9E3',
          boxShadow: 'inset 0 3px 6px rgba(93,64,55,0.12)',
        }}
      >
        <div
          className="relative h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-0.5"
          style={{
            width: `${Math.max(percentage, 8)}%`,
            background: `linear-gradient(to right, ${color}cc, ${color})`,
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.7)',
          }}
        >
          <div
            className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0"
            style={{
              marginRight: '-8px',
              boxShadow: `0 2px 4px ${color}88`,
            }}
          >
            <span className="text-[10px] leading-none select-none">⭐</span>
          </div>
        </div>
      </div>
      <span className="text-xs font-black text-[#59413A] min-w-[3ch] text-right">
        {percentage}%
      </span>
    </div>
  );
}