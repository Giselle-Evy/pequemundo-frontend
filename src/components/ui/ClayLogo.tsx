export default function ClayLogo() {
  return (
    <div className="mascot-bounce relative w-16 h-16 sm:w-20 sm:h-20 mb-1.5 flex items-center justify-center">
      <div className="halo-pulse absolute inset-0 bg-amber-300/60 rounded-full blur-lg" />
      <svg
        className="w-full h-full relative z-10"
        viewBox="0 0 100 100"
        style={{ filter: 'drop-shadow(0 8px 14px rgba(2,136,209,0.35))' }}
      >
        <defs>
          <radialGradient cx="35%" cy="35%" id="globeGrad" r="65%">
            <stop offset="0%" stopColor="#81D4FA" />
            <stop offset="55%" stopColor="#29B6F6" />
            <stop offset="100%" stopColor="#0288D1" />
          </radialGradient>
          <linearGradient id="continentGrad" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#A5D6A7" />
            <stop offset="100%" stopColor="#66BB6A" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" fill="url(#globeGrad)" r="44" stroke="#FFFFFF" strokeWidth="3.5" />
        <path d="M22 36c4-7 11-9 17-5 6 3 10 9 9 14-2 5-7 7-11 5-4-3-9-7-15-14z" fill="url(#continentGrad)" opacity="0.95" />
        <path d="M60 23c6-2 15 2 18 7 3 5 2 10-2 13-4 3-11 2-14-3-3-4-4-14-2-17z" fill="url(#continentGrad)" opacity="0.95" />
        <path d="M46 66c4-4 13-5 19-1 6 4 9 10 7 15-2 5-10 6-16 3-4-2-8-9-10-17z" fill="url(#continentGrad)" opacity="0.95" />
        <path d="M24 24 C32 15, 68 15, 76 24 C68 19, 32 19, 24 24 Z" fill="#FFFFFF" opacity="0.6" />
        <ellipse cx="38" cy="48" fill="#1E293B" rx="4.5" ry="6.5" />
        <ellipse cx="62" cy="48" fill="#1E293B" rx="4.5" ry="6.5" />
        <circle cx="39.5" cy="45.5" fill="#FFFFFF" r="2.2" />
        <circle cx="63.5" cy="45.5" fill="#FFFFFF" r="2.2" />
        <circle cx="36.5" cy="50" fill="#FFFFFF" r="1.1" />
        <circle cx="60.5" cy="50" fill="#FFFFFF" r="1.1" />
        <ellipse cx="29" cy="55" fill="#FF8A65" opacity="0.85" rx="5" ry="3.2" />
        <ellipse cx="71" cy="55" fill="#FF8A65" opacity="0.85" rx="5" ry="3.2" />
        <path d="M41 55 Q50 67 59 55" fill="none" stroke="#1E293B" strokeLinecap="round" strokeWidth="3.8" />
        <path d="M46 62 Q50 67 54 62 Z" fill="#FF5252" />
      </svg>
    </div>
  );
}