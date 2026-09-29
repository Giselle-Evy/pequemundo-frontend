import type { Child } from '../../types';

interface ChildAvatarProps {
  child: Child;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showFrame?: boolean;
}

const sizeMap = {
  sm: {
    container: 'w-10 h-10',
    emoji: 'text-2xl',
    accessory: 'text-xs',
    frameEmoji: 'text-[10px]',
    acc1Pos: { top: '-8px', left: '50%', transform: 'translateX(-50%)' },
    acc2Pos: { bottom: '-6px', right: '-6px' },
  },
  md: {
    container: 'w-16 h-16',
    emoji: 'text-4xl',
    accessory: 'text-base',
    frameEmoji: 'text-xs',
    acc1Pos: { top: '-12px', left: '50%', transform: 'translateX(-50%)' },
    acc2Pos: { bottom: '-8px', right: '-8px' },
  },
  lg: {
    container: 'w-24 h-24',
    emoji: 'text-6xl',
    accessory: 'text-2xl',
    frameEmoji: 'text-sm',
    acc1Pos: { top: '-18px', left: '50%', transform: 'translateX(-50%)' },
    acc2Pos: { bottom: '-10px', right: '-10px' },
  },
  xl: {
    container: 'w-32 h-32',
    emoji: 'text-7xl',
    accessory: 'text-3xl',
    frameEmoji: 'text-base',
    acc1Pos: { top: '-24px', left: '50%', transform: 'translateX(-50%)' },
    acc2Pos: { bottom: '-14px', right: '-14px' },
  },
};

const frameColors: Record<string, string> = {
  '🌟': '#FFD54F',
  '💖': '#EC407A',
  '⚡': '#FFC107',
  '🌈': '#BA68C8',
};

export default function ChildAvatar({
  child,
  size = 'md',
  showFrame = true,
}: ChildAvatarProps) {
  const s = sizeMap[size];

  const avatarEmoji = child.avatar || '🦊';
  const equippedAccessory = child.equipped_accessory?.icon;
  const equippedAccessory2 = child.equipped_accessory2?.icon;
  const equippedFrame = child.equipped_frame?.icon;

  const frameColor = equippedFrame
    ? frameColors[equippedFrame] || '#FFD54F'
    : null;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      {/* Marco (anillo) */}
      {showFrame && frameColor && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            inset: '-4px',
            border: `3px solid ${frameColor}`,
            boxShadow: `0 0 12px ${frameColor}66`,
            borderRadius: '9999px',
          }}
        />
      )}

      {/* Avatar base */}
      <div
        className={`${s.container} rounded-full flex items-center justify-center relative`}
        style={{
          backgroundColor: '#FFF1ED',
          border: frameColor ? `3px solid ${frameColor}` : '3px solid #FFDBD0',
        }}
      >
        <span className={`${s.emoji} select-none leading-none`}>
          {avatarEmoji}
        </span>
      </div>

      {/* Accesorio 1 (arriba, tipo sombrero) */}
      {equippedAccessory && (
        <span
          className={`absolute ${s.accessory} select-none z-10 pointer-events-none`}
          style={{
            ...s.acc1Pos,
            filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))',
          }}
        >
          {equippedAccessory}
        </span>
      )}

      {/* Accesorio 2 (abajo a la derecha) */}
      {equippedAccessory2 && (
        <span
          className={`absolute ${s.accessory} select-none z-10 pointer-events-none`}
          style={{
            ...s.acc2Pos,
            filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))',
          }}
        >
          {equippedAccessory2}
        </span>
      )}

      {/* Emoji del marco en la esquina */}
      {showFrame && equippedFrame && (
        <span
          className={`absolute -top-2 -right-2 ${s.frameEmoji} select-none z-20 pointer-events-none`}
          style={{ filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.35))' }}
        >
          {equippedFrame}
        </span>
      )}
    </div>
  );
}