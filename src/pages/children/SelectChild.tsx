import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../../components/layout/AnimatedBackground';
import SoundToggle from '../../components/ui/SoundToggle';
import ClayLogo from '../../components/ui/ClayLogo';
import ChildCard from '../../components/ui/ChildCard';
import CreateChildCard from '../../components/ui/CreateChildCard';
import ThemeToggle from '../../components/ui/ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';
import { useChild } from '../../contexts/ChildContext';
import { useBackgroundMusic } from '../../hooks/useBackgroundMusic';
import { useTheme } from '../../hooks/useTheme';
import { getChildren } from '../../services/children';
import type { Child } from '../../types';

export default function SelectChild() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { setChild } = useChild();
  const { isPlaying, toggle } = useBackgroundMusic();
  const { isNight } = useTheme();

  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getChildren();
        setChildren(data);
      } catch {
        setError('No pudimos cargar tus perfiles. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!loading && !error && children.length === 0) {
      navigate('/children/new', { replace: true });
    }
  }, [loading, error, children, navigate]);

  function handleSelect(child: Child) {
    setChild(child);
    navigate('/dashboard');
  }

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div
      className="min-h-screen font-nunito flex flex-col relative overflow-x-hidden"
      style={{
        background: isNight
          ? 'linear-gradient(180deg, #1A1B4B 0%, #2D1B69 40%, #4A2C7A 70%, #1E1B4B 100%)'
          : 'linear-gradient(180deg, #70D6FF 0%, #BBE7FE 40%, #FFF3C4 85%, #FEF9E7 100%)',
      }}
    >
      <AnimatedBackground />

      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-2 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3 pill-pill px-3 py-1.5">
          <div className="w-6 h-8 flex items-center justify-center">
            <ClayLogo />
          </div>
          <span className="font-fredoka font-black text-lg text-[#FF7043]">
            PequeMundo
          </span>
          <span className="hidden sm:inline-block bg-[#C2E8FF] text-[#005370] text-[10px] font-bold px-2 py-0.5 rounded-full">
            Edades 5 a 11
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SoundToggle isPlaying={isPlaying} onToggle={toggle} />
          <button
            type="button"
            onClick={() => navigate('/parent')}
            className="pill-pill px-3 py-2 flex items-center gap-2 text-xs sm:text-sm font-bold text-[#286B33] hover:text-[#003D12] transition"
          >
            <span className="text-base">🛡️</span>
            <span className="hidden sm:inline">Zona Padres</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="pill-pill px-3 py-2 flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-rose-600 transition"
          >
            <img alt="icono de salir" style={{ width: '20px', height: '20px' }} src="/images/salida.png" />
            
          </button>
        </div>
      </header>

      <main className="flex-1 w-full relative z-10 pt-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <section className="w-full flex flex-col items-center text-center py-4">
            <div className="inline-flex items-center gap-2 bg-white/90 px-4 py-1.5 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_8px_16px_rgba(93,64,55,0.08)] mb-4 animate-bounce">
              <span className="text-lg">✨</span>
              <span className="font-fredoka font-extrabold text-xs uppercase tracking-wide text-[#AC3509]">
                ¡El viaje comienza aquí!
              </span>
              <span className="text-lg">✨</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-baloo text-[#006688] drop-shadow-sm tracking-tight">
              ¿Quién va a jugar hoy?
            </h1>
            <p className="text-base sm:text-lg font-bold text-[#59413A] max-w-xl mt-2">
              {user?.name ? `Hola ${user.name}, ` : ''}
              elige un perfil para comenzar la aventura.
            </p>
          </section>

          {loading && (
            <div className="text-center py-12">
              <p className="text-lg font-bold text-[#59413A]">
                Cargando tus aventureros...
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-lg font-bold text-rose-700">{error}</p>
            </div>
          )}

          {!loading && !error && children.length > 0 && (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
              {children.map((child) => (
                <ChildCard key={child.id} child={child} onSelect={handleSelect} />
              ))}
              <CreateChildCard onCreate={() => navigate('/children/new')} />
            </section>
          )}
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