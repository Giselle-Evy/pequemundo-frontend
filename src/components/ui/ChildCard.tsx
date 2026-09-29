import type { Child } from '../../types';
import { AVATAR_OPTIONS } from '../../data/avatars';

interface ChildCardProps {
  child: Child;
  onSelect: (child: Child) => void;
}

const colorSchemes = [
  { bg: 'from-[#FFF1ED] to-[#FFDBD0]', badge: 'bg-[#FFDBD0] text-[#852300]', btn: 'bg-[#FF7043] text-white', shadow: '#AC3509' },
  { bg: 'from-[#ABF4AC] to-[#FFF1ED]', badge: 'bg-white text-[#286B33]', btn: 'bg-[#286B33] text-white', shadow: '#07521D' },
  { bg: 'from-[#C2E8FF] to-[#FFF1ED]', badge: 'bg-white text-[#006688]', btn: 'bg-[#006688] text-white', shadow: '#004D67' },
  { bg: 'from-[#FFF9C4] to-[#FFF1ED]', badge: 'bg-white text-[#AC3509]', btn: 'bg-[#FF7043] text-white', shadow: '#AC3509' },
  { bg: 'from-[#F3E5F5] to-[#FFF1ED]', badge: 'bg-white text-[#7E57C2]', btn: 'bg-[#BA68C8] text-white', shadow: '#6A1B9A' },
];

function getAvatarConfig(emoji: string) {
  return (
    AVATAR_OPTIONS.find((a) => a.emoji === emoji) || {
      emoji: emoji || '🦊',
      name: 'Aventurero',
      bgColor: '#FFE0B2',
      borderColor: '#FB8C00',
    }
  );
}

export default function ChildCard({ child, onSelect }: ChildCardProps) {
  const scheme = colorSchemes[child.id % colorSchemes.length];
  const avatar = getAvatarConfig(child.avatar);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onSelect(child)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(child);
        }
      }}
      className={`group relative flex flex-col justify-between p-5 rounded-[2rem] bg-gradient-to-b ${scheme.bg} shadow-[0_16px_32px_-8px_rgba(93,64,55,0.12),inset_0_3px_5px_rgba(255,255,255,0.9)] hover:-translate-y-2 hover:rotate-1 transition-all duration-300 cursor-pointer`}
    >
      <div className="flex items-center justify-between gap-2 w-full">
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${scheme.badge} flex items-center gap-1 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7)]`}>
          ⭐ {child.total_points} puntos
        </span>
        <span className="text-xs text-[#59413A] font-bold">{child.age} años</span>
      </div>

      <div className="flex flex-col items-center my-4">
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300 shadow-[inset_0_4px_8px_rgba(255,255,255,0.9),0_12px_20px_-4px_rgba(172,53,9,0.2)]"
          style={{
            backgroundColor: avatar.bgColor,
            border: `4px solid ${avatar.borderColor}`,
          }}
        >
          <span className="text-6xl select-none" role="img" aria-label={avatar.name}>
            {avatar.emoji}
          </span>
        </div>
        <span className="text-[10px] font-bold text-[#59413A] mt-1 opacity-70">
          {avatar.name}
        </span>
      </div>

      <div className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-extrabold text-[#2C160E] drop-shadow-sm">
          {child.name}
        </h2>

        <button
          type="button"
          className={`mt-4 w-full py-3 px-4 rounded-full ${scheme.btn} font-extrabold text-sm flex items-center justify-center gap-2 transition-all active:translate-y-1`}
          style={{
            boxShadow: `0 6px 0 ${scheme.shadow}, inset 0 3px 5px rgba(255,255,255,0.5)`,
          }}
        >
          <span>¡Jugar ahora!</span>
        </button>
      </div>
    </article>
  );
}