interface AchievementPopupProps {
  isOpen: boolean;
  onClose: () => void;
  icon: string;
  title: string;
  description: string;
}

export default function AchievementPopup({
  isOpen,
  onClose,
  icon,
  title,
  description,
}: AchievementPopupProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full bg-gradient-to-br from-[#FFF3C4] via-white to-[#ABF4AC] rounded-[2.5rem] p-8 text-center shadow-[0_24px_48px_-12px_rgba(93,64,55,0.3)]"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'achievement-pop 0.5s ease-out' }}
      >
        {/* Confeti */}
        <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none">
          <div className="absolute top-2 left-4 text-2xl animate-bounce">✨</div>
          <div className="absolute top-8 right-6 text-2xl animate-pulse">⭐</div>
          <div className="absolute bottom-4 left-8 text-2xl animate-bounce">🎉</div>
          <div className="absolute bottom-8 right-4 text-2xl animate-pulse">🌟</div>
        </div>

        {/* Ícono */}
        <div
          className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#FFD54F] to-[#FF8A65] flex items-center justify-center text-6xl shadow-lg mb-4"
          style={{ animation: 'bounce 1.5s infinite' }}
        >
          <span>{icon}</span>
        </div>

        {/* Texto */}
        <p className="text-sm font-black uppercase tracking-wider text-[#AC3509] mb-2">
          ¡Nuevo logro desbloqueado!
        </p>
        <h2 className="text-3xl font-black font-baloo text-[#2C160E] mb-3">
          {title}
        </h2>
        <p className="text-base font-bold text-[#59413A] mb-6">
          {description}
        </p>

        {/* Botón */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-4 rounded-full bg-[#FF7043] text-white font-black text-lg shadow-[0_8px_0_#AC3509] active:translate-y-1 active:shadow-[0_4px_0_#AC3509] transition-all"
        >
          ¡Genial! 🎉
        </button>
      </div>
    </div>
  );
}