import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../../components/layout/AnimatedBackground';
import ChildTopBar from '../../components/layout/ChildTopBar';

interface GameCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  bgLight: string;
  path: string;
  available: boolean;
}

const games: GameCard[] = [
  {
    id: 'memory',
    icon: '🧠',
    title: 'Memorama',
    description: 'Encuentra todos los pares de animales.',
    color: '#286B33',
    bgLight: '#ABF4AC',
    path: '/games/memory',
    available: true,
  },
  {
  id: 'wordsearch',
  icon: '🔤',
  title: 'Sopa de Letras',
  description: 'Encuentra las palabras escondidas.',
  color: '#AC3509',
  bgLight: '#FFDBD0',
  path: '/games/wordsearch',
  available: true,
},

  {
  id: 'stars',
  icon: '⭐',
  title: 'Atrapa Estrellas',
  description: 'Atrapa tantas estrellas como puedas.',
  color: '#006688',
  bgLight: '#C2E8FF',
  path: '/games/stars',
  available: true,
},

];

export default function Games() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen font-nunito flex flex-col relative overflow-x-hidden"
      style={{
        background:
          'linear-gradient(180deg, #70D6FF 0%, #BBE7FE 40%, #FFF3C4 85%, #FEF9E7 100%)',
      }}
    >
      <AnimatedBackground />

      <ChildTopBar backTo="/dashboard" backLabel="Volver al Dashboard" />

      <main className="flex-1 w-full relative z-10 pt-4 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Hero */}
          <section className="clay-card p-6 sm:p-8 text-center">
            <div className="text-6xl mb-3">🎮</div>
            <h1 className="text-3xl sm:text-4xl font-black font-baloo text-[#006688] mb-2">
              Zona de Juegos
            </h1>
            <p className="text-base sm:text-lg font-bold text-[#59413A]">
              Juega sin prisa. Aquí no hay puntos, ¡solo diversión!
            </p>
          </section>

          {/* Grid de juegos */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {games.map((game) => (
              <button
                key={game.id}
                type="button"
                disabled={!game.available}
                onClick={() => game.available && navigate(game.path)}
                className={`rounded-[2rem] p-6 flex flex-col items-center text-center transition-all ${
                  game.available
                    ? 'bg-white hover:-translate-y-1 cursor-pointer'
                    : 'bg-[#FFE2DA] opacity-70 cursor-not-allowed'
                }`}
                style={{
                  boxShadow: game.available
                    ? `0 12px 24px -6px ${game.color}30, inset 0 4px 8px rgba(255,255,255,0.9)`
                    : 'inset 0 2px 6px rgba(93,64,55,0.15)',
                }}
              >
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-4"
                  style={{
                    backgroundColor: game.bgLight,
                    boxShadow: game.available
                      ? `0 8px 0 ${game.color}44, inset 0 4px 6px rgba(255,255,255,0.8)`
                      : 'inset 0 2px 4px rgba(93,64,55,0.15)',
                  }}
                >
                  {game.available ? game.icon : '🔒'}
                </div>
                <h2
                  className="text-xl font-black mb-2"
                  style={{ color: game.available ? '#2C160E' : '#8D7169' }}
                >
                  {game.title}
                </h2>
                <p
                  className="text-sm font-bold"
                  style={{ color: game.available ? '#59413A' : '#8D7169' }}
                >
                  {game.description}
                </p>
                <span
                  className="mt-4 text-xs font-black px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: game.available ? game.bgLight : '#FFDBD0',
                    color: game.available ? game.color : '#8D7169',
                  }}
                >
                  {game.available ? '¡Jugar ahora!' : 'Próximamente'}
                </span>
              </button>
            ))}
          </section>

          {/* Mensaje */}
          <section className="clay-card p-5 text-center">
            <p className="text-sm font-bold text-[#59413A]">
              💡 Estos juegos son para relajarte. No dan puntos ni logros, ¡solo diversión!
            </p>
          </section>
        </div>
      </main>

      <footer className="w-full pb-6 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/90 px-4 py-1.5 rounded-full shadow-sm text-xs font-bold text-[#59413A]">
          🔒 Entorno 100% seguro para niños
        </div>
      </footer>
    </div>
  );
}