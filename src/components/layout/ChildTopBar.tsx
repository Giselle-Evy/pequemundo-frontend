import { useNavigate } from 'react-router-dom';
import { useChild } from '../../contexts/ChildContext';
import ClayLogo from '../ui/ClayLogo';
import ThemeToggle from '../ui/ThemeToggle';
import ChildAvatar from '../ui/ChildAvatar';

interface ChildTopBarProps {
  backTo?: string;
  backLabel?: string;
}

export default function ChildTopBar({
  backTo = '/dashboard',
  backLabel = 'Volver',
}: ChildTopBarProps) {
  const navigate = useNavigate();
  const { child } = useChild();

  if (!child) return null;

  return (
    <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-2 flex items-center justify-between gap-2 relative z-20">
      {/* Izquierda: botón volver */}
      <button
        type="button"
        onClick={() => navigate(backTo)}
        className="pill-pill px-3 py-2 flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 transition shrink-0"
      >
        <span className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center text-[#4FC3F7] text-base">
          ←
        </span>
        <span className="hidden sm:inline">{backLabel}</span>
      </button>

      {/* Centro: logo (solo mascota, sin texto para que no ocupe espacio) */}
      <div className="flex items-center justify-center shrink-0">
        <div className="w-10 h-10">
          <ClayLogo />
        </div>
      </div>

      {/* Derecha: puntos + toggle + avatar */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="pill-pill px-3 py-1.5 flex items-center gap-1.5">
          <span className="text-lg">⭐</span>
          <span className="text-sm font-black text-[#AC3509]">
            {child.total_points}
          </span>
        </div>

        <ThemeToggle />

        <ChildAvatar child={child} size="sm" />
      </div>
    </header>
  );
}