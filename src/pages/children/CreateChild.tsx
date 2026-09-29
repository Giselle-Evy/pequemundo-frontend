import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../../components/layout/AnimatedBackground';
import SoundToggle from '../../components/ui/SoundToggle';
import ClayLogo from '../../components/ui/ClayLogo';
import ThemeToggle from '../../components/ui/ThemeToggle';
import { useChild } from '../../contexts/ChildContext';
import { useBackgroundMusic } from '../../hooks/useBackgroundMusic';
import { useTheme } from '../../hooks/useTheme';
import { createChild } from '../../services/children';
import { AVATAR_OPTIONS } from '../../data/avatars';
import type { Child } from '../../types';

export default function CreateChild() {
  const navigate = useNavigate();
  const { setChild } = useChild();
  const { isPlaying, toggle } = useBackgroundMusic();
  const { isNight } = useTheme();

  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(7);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0].emoji);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Escribe tu nombre de aventurero.');
      return;
    }
    if (name.trim().length < 2) {
      setError('El nombre debe tener al menos 2 letras.');
      return;
    }
    if (age < 5 || age > 11) {
      setError('La edad debe ser entre 5 y 11 años.');
      return;
    }

    setLoading(true);
    try {
      const newChild: Child = await createChild({
        name: name.trim(),
        age,
        avatar: selectedAvatar,
      });
      setChild(newChild);
      navigate('/dashboard');
    } catch (err: unknown) {
      const axiosError = err as {
        response?: { data?: { message?: string; errors?: Record<string, string[]> } };
      };
      const data = axiosError.response?.data;
      let message = 'No pudimos crear tu perfil. Intenta de nuevo.';
      if (data?.errors) {
        const firstError = Object.values(data.errors)[0];
        if (firstError && firstError.length > 0) message = firstError[0];
      } else if (data?.message) {
        message = data.message;
      }
      setError(message);
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

      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-2 flex items-center justify-between relative z-20">
        <button
          type="button"
          onClick={() => navigate('/children')}
          className="pill-pill px-3 py-2 flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-slate-900 transition"
        >
          <span className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center text-[#4FC3F7] text-base">
            ←
          </span>
          <span className="hidden sm:inline">Volver</span>
        </button>

        <div className="flex items-center gap-3 pill-pill px-3 py-1.5">
          <div className="w-8 h-8">
            <ClayLogo />
          </div>
          <span className="hidden md:inline font-fredoka font-black text-base text-[#FF7043]">
            PequeMundo
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SoundToggle isPlaying={isPlaying} onToggle={toggle} />
        </div>
      </header>

      <main className="flex-1 w-full relative z-10 pt-4 pb-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <section className="w-full flex flex-col items-center text-center py-4">
            <div className="inline-flex items-center gap-2 bg-white/90 px-4 py-1.5 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_8px_16px_rgba(93,64,55,0.08)] mb-4">
              <span className="text-lg">🎨</span>
              <span className="font-fredoka font-extrabold text-xs uppercase tracking-wide text-[#AC3509]">
                Tu personaje te espera
              </span>
              <span className="text-lg">✨</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black font-baloo text-[#006688] drop-shadow-sm tracking-tight">
              ¡Crea tu aventurero!
            </h1>
            <p className="text-base sm:text-lg font-bold text-[#59413A] max-w-xl mt-2">
              Elige tu nombre, tu edad y tu avatar para empezar la aventura.
            </p>
          </section>

          <form
            onSubmit={handleSubmit}
            className="clay-card p-6 sm:p-8 space-y-6 mt-4"
          >
            <div className="space-y-1.5">
              <label className="block text-sm sm:text-base font-extrabold text-slate-700 font-fredoka">
                ¿Cómo te llamas?
              </label>
              <div className="clay-input-wrapper flex items-center px-4 py-3 gap-3">
                <span className="text-2xl select-none" aria-hidden="true">
                  ✏️
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Sofía"
                  autoComplete="off"
                  maxLength={30}
                  className="w-full bg-transparent text-slate-800 font-bold placeholder-slate-400 focus:outline-none text-base sm:text-lg"
                  style={{ minHeight: 28 }}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm sm:text-base font-extrabold text-slate-700 font-fredoka">
                ¿Cuántos años tienes?
              </label>
              <div className="flex flex-wrap gap-2">
                {[5, 6, 7, 8, 9, 10, 11].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAge(value)}
                    className={`w-12 h-12 rounded-full font-extrabold text-lg transition-all ${
                      age === value
                        ? 'bg-[#FF7043] text-white shadow-[0_4px_0_#AC3509] scale-110'
                        : 'bg-white/90 text-[#59413A] shadow-[0_3px_0_#E0BFB6] hover:scale-105'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm sm:text-base font-extrabold text-slate-700 font-fredoka">
                Elige tu avatar
              </label>
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {AVATAR_OPTIONS.map((avatar) => {
                  const isSelected = selectedAvatar === avatar.emoji;
                  return (
                    <button
                      key={avatar.emoji}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar.emoji)}
                      aria-label={avatar.name}
                      title={avatar.name}
                      className={`aspect-square rounded-full flex items-center justify-center text-3xl sm:text-4xl transition-all ${
                        isSelected
                          ? 'scale-110 shadow-[0_6px_0_rgba(0,0,0,0.15)] ring-4 ring-[#FF7043]'
                          : 'hover:scale-105 shadow-[0_3px_0_rgba(0,0,0,0.08)]'
                      }`}
                      style={{
                        backgroundColor: avatar.bgColor,
                        border: `3px solid ${avatar.borderColor}`,
                      }}
                    >
                      <span className="select-none" role="img" aria-label={avatar.name}>
                        {avatar.emoji}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-slate-500 font-bold text-center pt-1">
                Tu elegido: {AVATAR_OPTIONS.find((a) => a.emoji === selectedAvatar)?.name}
              </p>
            </div>

            {error && (
              <div className="text-center p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-800 font-bold text-sm">
                🔔 {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-3d-coral text-white font-baloo font-extrabold text-xl sm:text-2xl py-3.5 sm:py-4 px-6 rounded-2xl flex items-center justify-center gap-3 cursor-pointer select-none focus:outline-none focus:ring-4 focus:ring-orange-300"
            >
              <span>{loading ? 'Creando...' : '¡Comenzar aventura!'}</span>
              {!loading && <span className="text-2xl sm:text-3xl">🚀</span>}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}