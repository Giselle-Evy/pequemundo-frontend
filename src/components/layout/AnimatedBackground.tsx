import { useTheme } from '../../hooks/useTheme';

export default function AnimatedBackground() {
  const { isNight } = useTheme();

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 transition-colors duration-1000"
      style={{
        background: isNight
          ? 'linear-gradient(180deg, #1A1B4B 0%, #2D1B69 40%, #4A2C7A 70%, #1E1B4B 100%)'
          : 'linear-gradient(180deg, #70D6FF 0%, #BBE7FE 40%, #FFF3C4 85%, #FEF9E7 100%)',
      }}
    >
      {isNight ? <NightScene /> : <DayScene />}
    </div>
  );
}

// ===== ESCENA DE DÍA =====
function DayScene() {
  return (
    <>
      {/* Sol */}
      <div className="absolute top-8 right-12 w-24 h-24 rounded-full bg-gradient-to-br from-[#FFD54F] to-[#FF8A65] shadow-[0_0_80px_rgba(255,213,79,0.6)]">
        <div className="absolute inset-2 rounded-full bg-[#FFECB3] blur-md opacity-60" />
      </div>

      {/* Nubes */}
      <div className="absolute top-12 left-0 cloud-anim-1 opacity-85">
        <svg className="w-36 h-18 text-white fill-current drop-shadow-md" viewBox="0 0 100 50">
          <path d="M20 40h60a15 15 0 0 0 4-29 20 20 0 0 0-38-6 16 16 0 0 0-26 15 12 12 0 0 0 0 20z" />
        </svg>
      </div>
      <div className="absolute top-24 left-0 cloud-anim-2 opacity-70">
        <svg className="w-48 h-22 text-white fill-current drop-shadow" viewBox="0 0 100 50">
          <path d="M20 40h60a15 15 0 0 0 4-29 20 20 0 0 0-38-6 16 16 0 0 0-26 15 12 12 0 0 0 0 20z" />
        </svg>
      </div>

      {/* Estrellas de día (sutiles) */}
      <div className="absolute top-20 left-10 twinkle-star text-amber-300">
        <span className="text-2xl">✦</span>
      </div>
      <div className="absolute top-[52%] left-6 twinkle-star text-emerald-300" style={{ animationDelay: '1.8s' }}>
        <span className="text-lg">✦</span>
      </div>

      {/* Globos */}
      <div className="absolute left-8 balloon-anim-1">
        <div className="flex flex-col items-center filter drop-shadow-md">
          <div className="w-9 h-11 bg-gradient-to-tr from-[#FF8A65] to-pink-400 rounded-[50%_50%_48%_48%/60%_60%_40%_40%] relative border-2 border-white/60">
            <div className="w-2.5 h-3.5 bg-white/60 rounded-full absolute top-1.5 left-2" />
          </div>
          <div className="w-0.5 h-7 bg-amber-900/40 -mt-0.5" />
        </div>
      </div>

      {/* Pájaros volando (SVG animado) */}
      <Bird top="30%" left="10%" delay="0s" />
      <Bird top="25%" left="40%" delay="1.5s" />
      <Bird top="35%" left="70%" delay="3s" />

      {/* Conejo saltando */}
      <div
        className="absolute bottom-32"
        style={{ animation: 'hop-across 18s linear infinite' }}
      >
        <div style={{ animation: 'hop 0.8s ease-in-out infinite' }}>
          <span className="text-4xl">🐰</span>
        </div>
      </div>

      {/* Colinas verdes */}
      <div className="absolute bottom-0 inset-x-0 h-44 opacity-80">
        <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 600 200">
          <path d="M-20 120 Q120 70 280 110 T620 90 L620 200 L-20 200 Z" fill="#A5D6A7" opacity="0.6" />
          <path d="M-20 140 Q150 90 320 135 T620 120 L620 200 L-20 200 Z" fill="#81C784" opacity="0.85" />
        </svg>
      </div>
    </>
  );
}

// ===== ESCENA DE NOCHE =====
function NightScene() {
  return (
    <>
      {/* Luna */}
      <div className="absolute top-10 right-16 w-24 h-24 rounded-full bg-gradient-to-br from-[#FFF9C4] to-[#FFD54F] shadow-[0_0_80px_rgba(255,249,196,0.7)]">
        <div className="absolute inset-2 rounded-full bg-[#FFFDE7] blur-md opacity-50" />
        {/* Cráteres */}
        <div className="absolute top-6 left-5 w-3 h-3 rounded-full bg-[#FFD54F] opacity-60" />
        <div className="absolute top-10 right-6 w-4 h-4 rounded-full bg-[#FFD54F] opacity-50" />
        <div className="absolute bottom-6 left-8 w-2 h-2 rounded-full bg-[#FFD54F] opacity-60" />
      </div>

      {/* Estrellas brillantes */}
      {Array.from({ length: 30 }, (_, i) => (
        <div
          key={i}
          className="absolute twinkle-star text-white"
          style={{
            top: `${(i * 13) % 80}%`,
            left: `${(i * 17) % 95}%`,
            animationDelay: `${(i * 0.3) % 3}s`,
          }}
        >
          <span className="text-xs">✨</span>
        </div>
      ))}

      {/* Estrellas fugaces */}
      <div
        className="absolute top-[15%] left-[20%]"
        style={{ animation: 'shooting-star 6s linear infinite' }}
      >
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent" />
      </div>

      {/* Búho en el árbol */}
      <div className="absolute bottom-40 left-[15%]" style={{ animation: 'sway-slow 5s ease-in-out infinite' }}>
        <span className="text-4xl">🦉</span>
      </div>

      {/* Murciélagos volando */}
      <Bat top="25%" left="50%" delay="0s" />
      <Bat top="35%" left="75%" delay="2s" />

      {/* Luciérnagas */}
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: `${30 + (i * 7) % 50}%`,
            left: `${(i * 11) % 90}%`,
            animation: `firefly ${2 + (i % 3)}s ease-in-out infinite`,
            animationDelay: `${(i * 0.4) % 2}s`,
          }}
        >
          <div className="w-2 h-2 rounded-full bg-[#FFF59D] shadow-[0_0_12px_#FFD54F]" />
        </div>
      ))}

      {/* Colinas oscuras */}
      <div className="absolute bottom-0 inset-x-0 h-44 opacity-90">
        <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 600 200">
          <path d="M-20 120 Q120 70 280 110 T620 90 L620 200 L-20 200 Z" fill="#1E3A2F" opacity="0.7" />
          <path d="M-20 140 Q150 90 320 135 T620 120 L620 200 L-20 200 Z" fill="#0F2419" opacity="0.9" />
        </svg>
      </div>
    </>
  );
}

// ===== COMPONENTES AUXILIARES =====
function Bird({ top, left, delay }: { top: string; left: string; delay: string }) {
  return (
    <div
      className="absolute"
      style={{
        top,
        left,
        animation: `bird-fly 12s linear infinite`,
        animationDelay: delay,
      }}
    >
      <svg className="w-6 h-6 text-slate-700 fill-current" viewBox="0 0 24 24">
        <path d="M2 12c2-3 6-3 8 0 2-3 6-3 8 0-2 2-6 2-8 0-2 2-6 2-8 0z" />
      </svg>
    </div>
  );
}

function Bat({ top, left, delay }: { top: string; left: string; delay: string }) {
  return (
    <div
      className="absolute"
      style={{
        top,
        left,
        animation: `bat-fly 10s linear infinite`,
        animationDelay: delay,
      }}
    >
      <svg className="w-7 h-7 text-slate-800 fill-current" viewBox="0 0 24 24">
        <path d="M2 10c2-1 4-1 6 1 1-2 2-2 4-2 2 0 3 0 4 2 2-2 4-2 6-1-1 2-2 4-4 4l-2-1c-1 1-2 2-4 2s-3-1-4-2l-2 1c-2 0-3-2-4-4z" />
      </svg>
    </div>
  );
}