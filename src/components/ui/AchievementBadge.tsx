interface AchievementBadgeProps {
  icon: string;
  title: string;
  description: string;
  earned: boolean;
}

export default function AchievementBadge({
  icon,
  title,
  description,
  earned,
}: AchievementBadgeProps) {
  return (
    <div
      className={`rounded-2xl p-4 flex flex-col items-center text-center gap-2 transition-transform duration-150 ${
        earned ? 'hover:scale-105' : 'opacity-60'
      }`}
      style={{
        backgroundColor: earned ? '#FFF1ED' : '#FFE2DA',
        boxShadow: earned
          ? '0 6px 12px rgba(93,64,55,0.08), inset 0 2px 4px rgba(255,255,255,0.8)'
          : 'inset 0 2px 6px rgba(93,64,55,0.15)',
        border: earned ? '2px solid #FFDBD0' : '2px dashed #E0BFB6',
      }}
      title={description}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-3xl relative"
        style={{
          background: earned
            ? 'linear-gradient(to top right, #FF7043, #58CAFE)'
            : '#FFDBD0',
          boxShadow: earned
            ? '0 6px 10px rgba(172,53,9,0.25), inset 0 3px 5px rgba(255,255,255,0.8)'
            : 'inset 0 2px 4px rgba(93,64,55,0.15)',
        }}
      >
        <span className={earned ? '' : 'grayscale opacity-60'}>{icon}</span>
        {!earned && (
          <span className="absolute inset-0 flex items-center justify-center text-xl">
            🔒
          </span>
        )}
      </div>
      <span className="text-sm font-extrabold text-[#2C160E] leading-tight">
        {title}
      </span>
      <span
        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
          earned ? 'bg-[#FFDBD0] text-[#AC3509]' : 'bg-[#FFE2DA] text-[#8D7169]'
        }`}
      >
        {earned ? '¡Conseguida!' : 'Bloqueada'}
      </span>
    </div>
  );
}