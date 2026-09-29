import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../components/layout/AnimatedBackground';
import SoundToggle from '../components/ui/SoundToggle';
import ClayLogo from '../components/ui/ClayLogo';
import PequeMundoWordmark from '../components/ui/PequeMundoWordmark';
import ThemeToggle from '../components/ui/ThemeToggle';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { useTheme } from '../hooks/useTheme';

interface SubjectCard {
  icon: string;
  name: string;
  bgFrom: string;
  bgVia: string;
  bgTo: string;
  borderBottom: string;
  textColor: string;
  rotate: string;
}

const subjectCards: SubjectCard[] = [
  {
    icon: '🧬',
    name: 'Biología',
    bgFrom: '#E8F5E9',
    bgVia: '#C8E6C9',
    bgTo: '#A5D6A7',
    borderBottom: '#81C784',
    textColor: '#064E3B',
    rotate: '-2deg',
  },
  {
    icon: '📚',
    name: 'Español',
    bgFrom: '#FFF8E1',
    bgVia: '#FFECB3',
    bgTo: '#FFE082',
    borderBottom: '#FFCA28',
    textColor: '#78350F',
    rotate: '0deg',
  },
  {
    icon: '🌎',
    name: 'Geografía',
    bgFrom: '#E1F5FE',
    bgVia: '#B3E5FC',
    bgTo: '#81D4FA',
    borderBottom: '#4FC3F7',
    textColor: '#082F49',
    rotate: '2deg',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { isPlaying, toggle } = useBackgroundMusic();
  const { isNight } = useTheme();

  return (
    <div
      className="font-nunito text-slate-800 min-h-screen flex flex-col overflow-x-hidden relative"
      style={{
        background: isNight
          ? 'linear-gradient(180deg, #1A1B4B 0%, #2D1B69 40%, #4A2C7A 70%, #1E1B4B 100%)'
          : 'linear-gradient(180deg, #70D6FF 0%, #BBE7FE 40%, #FFF3C4 85%, #FEF9E7 100%)',
      }}
    >
      <AnimatedBackground />

      <main className="relative z-10 max-w-md mx-auto w-full min-h-screen px-4 sm:px-5 py-4 flex flex-col justify-between items-center text-center">
        {/* Barra superior */}
        <header className="w-full flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-[0_4px_12px_rgba(40,116,166,0.15)] border-2 border-white/80">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-full text-xs shadow-sm">
              🌟
            </span>
            <span className="font-fredoka font-bold text-xs tracking-wider uppercase text-sky-800">
              Edades 5 a 11
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SoundToggle isPlaying={isPlaying} onToggle={toggle} />
          </div>
        </header>

        {/* Logo y wordmark */}
        <div className="mt-2 mb-1 flex flex-col items-center">
          <ClayLogo />
          <PequeMundoWordmark />
          <span className="font-fredoka font-bold text-xs tracking-wider uppercase text-sky-800 bg-white/85 px-4 py-1 rounded-full shadow-[0_3px_8px_rgba(40,116,166,0.14)] border border-sky-100 mt-1">
            Aprende jugando
          </span>
        </div>

        {/* Ilustración hero */}
        <div className="w-full my-2.5 flex justify-center">
          <div className="relative w-full max-w-[370px] group">
            {/* Destellos de esquina */}
            <div className="absolute -top-2.5 -left-2.5 z-20 w-8 h-8 text-amber-300 twinkle-star filter drop-shadow">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l2.4 7.2h7.6l-6.2 4.5 2.4 7.3-6.2-4.5-6.2 4.5 2.4-7.3-6.2-4.5h7.6z" />
              </svg>
            </div>
            <div
              className="absolute -top-2.5 -right-2.5 z-20 w-8 h-8 text-amber-300 twinkle-star filter drop-shadow"
              style={{ animationDelay: '1.4s' }}
            >
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l2.4 7.2h7.6l-6.2 4.5 2.4 7.3-6.2-4.5-6.2 4.5 2.4-7.3-6.2-4.5h7.6z" />
              </svg>
            </div>
            <div
              className="absolute -bottom-2 -left-2 z-20 w-6 h-6 text-pink-300 twinkle-star filter drop-shadow"
              style={{ animationDelay: '0.8s' }}
            >
              <svg fill="currentColor" viewBox="0 0 24 24">
                <polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9" />
              </svg>
            </div>
            <div
              className="absolute -bottom-2 -right-2 z-20 w-6 h-6 text-emerald-300 twinkle-star filter drop-shadow"
              style={{ animationDelay: '2.1s' }}
            >
              <svg fill="currentColor" viewBox="0 0 24 24">
                <polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9" />
              </svg>
            </div>

            {/* Marco */}
            <div className="relative bg-gradient-to-b from-white/95 via-white/90 to-sky-50/95 p-3 sm:p-3.5 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(56,134,189,0.28),0_0_0_1px_rgba(255,255,255,0.8)_inset,0_8px_24px_-4px_rgba(0,0,0,0.08)] border-4 border-white backdrop-blur-md transition-all duration-300 hover:scale-[1.015] overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-white/70 to-transparent rounded-full pointer-events-none z-10" />
              <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-inner border-2 border-white/60 bg-sky-100">
                <img
                  alt="Niños explorando y aprendiendo con PequeMundo"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                  src="/images/hero-welcome.png"
                />
              </div>
              <div className="mt-2 flex items-center justify-center gap-1.5 text-sky-800/80 font-fredoka text-[11px] font-semibold">
                <span>✨ ¡Descubre, juega y sueña despierto! ✨</span>
              </div>
            </div>
          </div>
        </div>

        {/* Título */}
        <div className="mt-1 mb-2 px-3">
          <h1
            className="text-2xl sm:text-3xl font-extrabold font-baloo leading-tight"
            style={{ color: isNight ? '#FFF9C4' : '#1E293B' }}
          >
            ¡Bienvenido a{' '}
            <span className="text-[#FF5722]">PequeMundo</span>!
          </h1>
          <p
            className="text-sm font-bold mt-1 max-w-[310px] mx-auto leading-snug"
            style={{ color: isNight ? '#E0E7FF' : '#475569' }}
          >
            Aprende jugando con Biología, Español y Geografía
          </p>
        </div>

        {/* Tarjetas de materias */}
        <div className="w-full flex items-center justify-center gap-2.5 sm:gap-3 my-2">
          {subjectCards.map((card) => (
            <button
              key={card.name}
              type="button"
              className="flex-1 max-w-[104px] rounded-3xl p-2.5 border-2 border-white/90 flex flex-col items-center transform transition-all duration-200 hover:-translate-y-1.5 active:translate-y-0.5 focus:outline-none"
              style={{
                background: `linear-gradient(to bottom, ${card.bgFrom}, ${card.bgVia}, ${card.bgTo})`,
                borderBottomColor: card.borderBottom,
                borderBottomWidth: '4px',
                boxShadow:
                  '0 8px 18px -4px rgba(38,98,143,0.16), 0 3px 0 rgba(0,0,0,0.06), inset 0 2px 3px rgba(255,255,255,0.9)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = `translateY(-6px) rotate(${card.rotate})`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) rotate(0deg)';
              }}
            >
              <div className="w-11 h-11 rounded-2xl bg-white/90 shadow-sm flex items-center justify-center text-2xl mb-1.5">
                {card.icon}
              </div>
              <span
                className="font-fredoka font-bold text-xs leading-tight"
                style={{ color: card.textColor }}
              >
                {card.name}
              </span>
            </button>
          ))}
        </div>

        {/* Acciones principales */}
        <div className="w-full flex flex-col gap-3 mt-2 mb-2">
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="cta-bounce-pro w-full bg-gradient-to-b from-[#FF7A50] via-[#FF6233] to-[#E64A19] hover:from-[#FF8A65] hover:to-[#F4511E] active:translate-y-1 text-white font-fredoka font-extrabold text-2xl tracking-wide py-3.5 px-6 rounded-full border-t-2 border-white/40 transition-all duration-150 flex items-center justify-center gap-2.5 focus:outline-none focus:ring-4 focus:ring-[#FF8A65]/40"
            style={{
              boxShadow:
                '0 10px 24px -4px rgba(255,112,67,0.45), inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -4px 0 #D84315',
              borderBottom: '5px solid #B71C1C',
            }}
          >
            <span className="text-amber-200 text-xl">✨</span>
            <span className="drop-shadow-md">¡Comenzar!</span>
            <svg className="w-6 h-6 fill-current drop-shadow animate-pulse" viewBox="0 0 24 24">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full bg-white/95 hover:bg-white active:translate-y-0.5 text-sky-700 font-fredoka font-bold text-base py-3 px-6 rounded-full shadow-[0_6px_16px_rgba(40,116,166,0.15)] border-2 border-sky-300 hover:border-sky-400 transition-all duration-150 flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-[#4FC3F7]/30"
          >
            <svg className="w-5 h-5 fill-current text-sky-500" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
            <span>Ya tengo cuenta</span>
          </button>
        </div>

        {/* Pie de página */}
        <footer className="w-full pb-1 text-center">
          <div className="inline-flex items-center justify-center gap-2 bg-white/75 backdrop-blur-sm px-4 py-1 rounded-full shadow-sm border border-sky-100/80 text-[11px] font-fredoka font-bold text-sky-900/80">
            <span className="inline-block text-amber-500">🔒</span>
            <span>Entorno 100% seguro para niños</span>
          </div>
        </footer>
      </main>
    </div>
  );
}