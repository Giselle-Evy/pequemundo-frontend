interface ConfettiLayerProps {
  colors?: string[];
}

const defaultColors = ['#4FC3F7', '#FF7043', '#FFD54F', '#81C784', '#BA68C8'];

export default function ConfettiLayer({ colors = defaultColors }: ConfettiLayerProps) {
  const pieces = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden z-20"
    >
      {pieces.map((i) => {
        const left = (i * 4.2) % 100;
        const delay = (i * 0.37) % 5;
        const duration = 4 + (i % 3);
        const color = colors[i % colors.length];
        const size = 10 + (i % 4) * 4;
        const isStar = i % 3 === 0;
        const isCircle = i % 3 === 1;

        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${left}%`,
              top: '-32px',
              animation: `confetti-fall ${duration}s linear infinite ${delay}s, confetti-sway ${
                2.4 + (i % 4) * 0.3
              }s ease-in-out infinite`,
            }}
          >
            {isStar ? (
              <span style={{ fontSize: size + 8, color }}>⭐</span>
            ) : isCircle ? (
              <div
                style={{
                  width: size,
                  height: size,
                  backgroundColor: color,
                  borderRadius: '50%',
                  boxShadow: `0 3px 0 ${color}88`,
                }}
              />
            ) : (
              <div
                style={{
                  width: size - 4,
                  height: size + 6,
                  backgroundColor: color,
                  borderRadius: '6px',
                  boxShadow: `0 2px 0 ${color}88`,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}