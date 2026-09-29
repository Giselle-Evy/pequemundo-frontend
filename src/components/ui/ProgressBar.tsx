interface ProgressBarProps {
  percentage: number;
  color?: string;
  height?: number;
}

export default function ProgressBar({
  percentage,
  color = '#81C784',
  height = 20,
}: ProgressBarProps) {
  const safePercentage = Math.max(0, Math.min(100, percentage));

  return (
    <div
      className="w-full rounded-full p-0.5 overflow-hidden"
      style={{
        height,
        backgroundColor: '#FFDBD0',
        boxShadow: 'inset 0 3px 5px rgba(93,64,55,0.2)',
      }}
    >
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${safePercentage}%`,
          backgroundColor: color,
          boxShadow: `0 2px 4px ${color}66, inset 0 2px 3px rgba(255,255,255,0.6)`,
        }}
      />
    </div>
  );
}