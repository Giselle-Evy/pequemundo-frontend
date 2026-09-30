import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedBackground from '../../components/layout/AnimatedBackground';
import SoundToggle from '../../components/ui/SoundToggle';
import ClayLogo from '../../components/ui/ClayLogo';
import PequeMundoWordmark from '../../components/ui/PequeMundoWordmark';
import ClayInput from '../../components/ui/ClayInput';
import ThemeToggle from '../../components/ui/ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';
 import { useBackgroundMusic } from '../../hooks/useBackgroundMusic';
import { useTheme } from '../../hooks/useTheme';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isPlaying, toggle } = useBackgroundMusic();
  const { isNight } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Por favor escribe tu correo y contraseña.');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/children');
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(
        axiosError.response?.data?.message ||
          'Credenciales incorrectas. Intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
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

      {/* Barra superior */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-2 flex items-center justify-between relative z-20">
        <Link
          to="/"
          className="pill-pill px-4 py-2 flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-slate-900 hover:scale-105 active:scale-95 transition"
        >
          <span className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center text-[#4FC3F7] text-base">
            ←
          </span>
          <span className="hidden sm:inline">Volver</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SoundToggle isPlaying={isPlaying} onToggle={toggle} />
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-4 relative z-10 w-full max-w-xl mx-auto">
        {/* Logo */}
        <div className="flex flex-col items-center text-center mb-5 mascot-bounce">
          <ClayLogo />
          <PequeMundoWordmark />
          <span className="inline-block mt-1 px-3 py-0.5 bg-white/85 text-sky-700 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm border border-white">
            Aprende jugando
          </span>
        </div>

        {/* Título */}
        <div className="text-center mb-6 px-4">
          <h1
            className="text-3xl sm:text-4xl font-black font-baloo tracking-tight drop-shadow-sm"
            style={{ color: isNight ? '#FFF9C4' : '#1E3A8A' }}
          >
            ¡Hola de nuevo!
          </h1>
          <p
            className="font-semibold text-base sm:text-lg mt-0.5"
            style={{ color: isNight ? '#E0E7FF' : '#475569' }}
          >
            Inicia sesión para seguir aprendiendo
          </p>
        </div>

        {/* Tarjeta de login */}
        <section className="w-full clay-card p-6 sm:p-9 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-amber-50/60 pointer-events-none" />
          <div className="absolute -bottom-8 -left-6 w-24 h-24 rounded-full bg-sky-50/70 pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10" noValidate>
            <ClayInput
              icon="✉️"
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu.nombre@ejemplo.com"
              autoComplete="email"
              required
            />

            <ClayInput
              icon="🔒"
              label="Contraseña secreta"
              rightLabel={
                <a
                  href="#"
                  className="text-xs sm:text-sm font-extrabold text-[#FF7043] hover:text-[#E64A19] transition underline decoration-dashed underline-offset-4"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              }
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />

            <div className="pt-1 flex items-center justify-between text-xs text-slate-500 font-medium px-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded text-[#4FC3F7] focus:ring-[#4FC3F7] border-slate-300"
                />
                <span>Recordar mi aventurero en este equipo</span>
              </label>
            </div>

            {error && (
              <div className="text-center p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-800 font-bold text-sm">
                🔔 {error}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-3d-coral text-white font-baloo font-extrabold text-xl sm:text-2xl py-3.5 sm:py-4 px-6 rounded-2xl flex items-center justify-center gap-3 cursor-pointer select-none focus:outline-none focus:ring-4 focus:ring-orange-300"
              >
                <span>{loading ? 'Entrando...' : '¡Iniciar sesión!'}</span>
                {!loading && <span className="text-2xl sm:text-3xl">🚀</span>}
              </button>
            </div>
          </form>
        </section>

        <div className="mt-5 text-center">
          <p
            className="font-bold text-base sm:text-lg"
            style={{ color: isNight ? '#E0E7FF' : '#334155' }}
          >
            ¿No tienes cuenta?{' '}
            <Link
              to="/register"
              className="text-sky-400 hover:text-sky-300 underline font-black decoration-2 underline-offset-4 transition ml-1"
            >
              Regístrate gratis
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}