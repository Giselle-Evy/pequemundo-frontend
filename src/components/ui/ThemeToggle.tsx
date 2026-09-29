import { useTheme } from '../../hooks/useTheme';

export default function ThemeToggle() {
  const { isNight, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="px-3 py-2 flex items-center gap-2 text-xs sm:text-sm font-bold rounded-full transition-all shrink-0"
      style={{
        backgroundColor: isNight
          ? 'rgba(30, 27, 75, 0.85)'
          : 'rgba(255, 255, 255, 0.85)',
        color: isNight ? '#FFF9C4' : '#2C160E',
        backdropFilter: 'blur(8px)',
        border: isNight
          ? '2px solid rgba(255, 249, 196, 0.3)'
          : '2px solid rgba(255, 255, 255, 0.9)',
        boxShadow: isNight
          ? '0 4px 12px rgba(0, 0, 0, 0.3)'
          : '0 4px 12px rgba(93, 64, 55, 0.1)',
      }}
      title={isNight ? 'Cambiar a día' : 'Cambiar a noche'}
    >
      <span
        className="text-base transition-transform"
        style={{
          transform: isNight ? 'rotate(180deg)' : 'rotate(0)',
          display: 'inline-block',
        }}
      >
        {isNight ? '🌙' : '☀️'}
      </span>
      <span className="hidden sm:inline">
        {isNight ? 'Noche' : 'Día'}
      </span>
    </button>
  );
}