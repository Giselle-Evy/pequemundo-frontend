import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AnimatedBackground from '../../components/layout/AnimatedBackground';
import ConfettiLayer from '../../components/ui/ConfettiLayer';
import StatsCard from '../../components/ui/StatsCard';
import ThemeToggle from '../../components/ui/ThemeToggle';
import { useChild } from '../../contexts/ChildContext';
import { useTheme } from '../../hooks/useTheme';
import { getChildProgress } from '../../services/progress';
import type { SubjectProgress } from '../../types';

const subjectVisuals: Record<number, { name: string; icon: string; color: string; bgLight: string }> = {
  1: { name: 'Biología', icon: '🧬', color: '#286B33', bgLight: '#ABF4AC' },
  2: { name: 'Español', icon: '📚', color: '#AC3509', bgLight: '#FFDBD0' },
  3: { name: 'Geografía', icon: '🌎', color: '#006688', bgLight: '#C2E8FF' },
};

export default function SubjectComplete() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const subjectId = Number(id);
  const { child } = useChild();
  const { isNight } = useTheme();

  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!child) return;

    async function load() {
      try {
        const data = await getChildProgress(child!.id);
        const sp = data.subjects.find((s) => s.subject_id === subjectId);
        setSubjectProgress(sp || null);
      } catch (err) {
        console.error('Error cargando progreso:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [child, subjectId]);

  const subject = subjectVisuals[subjectId] || subjectVisuals[1];
  const completed = subjectProgress?.completed || 0;
  const total = subjectProgress?.total || 10;
  const pointsEarned = completed * 10;

  function handleSpeak() {
    if (!('speechSynthesis' in window) || !child) return;

    window.speechSynthesis.cancel();
    const text = `¡Bravo, ${child.name}! Completaste todos los ejercicios de ${subject.name}. Eres una gran exploradora. ¡Sigue así de curiosa!`;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'es-ES';
    utter.pitch = 1.25;
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
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
      <ConfettiLayer />

      {/* Barra superior con botón volver + toggle */}
      <header className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-5 pb-2 flex items-center justify-between relative z-20">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="pill-pill px-3 py-2 flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 transition"
        >
          <span className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center text-[#4FC3F7] text-base">
            ←
          </span>
          <span className="hidden sm:inline">Volver al Dashboard</span>
        </button>
        <ThemeToggle />
      </header>

      <main className="flex-1 w-full relative z-10 pt-2 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          {/* HERO */}
          <section
            className="clay-card p-6 sm:p-10 flex flex-col items-center text-center relative overflow-visible"
            style={{
              background: isNight
                ? 'radial-gradient(circle at 50% 15%, #2D1B69 0%, #1E1B4B 60%, #1A1B4B 100%)'
                : 'radial-gradient(circle at 50% 15%, #ffffff 0%, #fff7f4 60%, #ffede8 100%)',
            }}
          >
            {/* Halo dorado */}
            <div className="relative mb-6 flex items-center justify-center">
              <div
                className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full"
                style={{
                  background:
                    'linear-gradient(to top right, #FFD54F, #FFF59D, #FFFDE7)',
                  filter: 'blur(28px)',
                  animation: 'pulse-halo 3.5s ease-in-out infinite',
                }}
              />

              {/* Trofeo */}
              <div
                className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-2.5 flex items-center justify-center"
                style={{
                  background:
                    'linear-gradient(to bottom, #FFECB3, #FFCA28, #FFA000)',
                  boxShadow:
                    'inset 0 6px 8px rgba(255,255,255,0.9), inset 0 -8px 10px rgba(180,83,9,0.45), 0 18px 30px rgba(217,119,6,0.35)',
                  animation: 'bounce-gentle 3.2s ease-in-out infinite',
                }}
              >
                <div
                  className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden"
                  style={{
                    background:
                      'radial-gradient(circle at 40% 30%, #FFFDE7, #FFECB3, #FFD54F)',
                    boxShadow:
                      'inset 0 4px 8px rgba(180,83,9,0.35), 0 4px 6px rgba(255,255,255,0.9)',
                  }}
                >
                  <span className="text-7xl sm:text-8xl select-none">🏆</span>
                </div>
              </div>

              <div
                className="absolute -bottom-2 text-white rounded-full px-4 py-1 flex items-center gap-1 text-xs font-black"
                style={{
                  background: 'linear-gradient(to top right, #AC3509, #FF7043)',
                  boxShadow: '0 4px 0 #852300, 0 8px 12px rgba(172,53,9,0.3)',
                }}
              >
                🏅 ¡1° Lugar!
              </div>
            </div>

            {/* Título */}
            <div className="flex flex-col items-center gap-2 max-w-xl">
              <h1
                className="text-3xl sm:text-5xl font-black font-baloo"
                style={{ color: isNight ? '#FFD54F' : '#AC3509' }}
              >
                ¡Felicidades, {child?.name || 'aventurero'}!
              </h1>

              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
                style={{
                  backgroundColor: subject.bgLight,
                  color: subject.color,
                }}
              >
                <span className="text-2xl">{subject.icon}</span>
                <span className="text-lg font-black">{subject.name}</span>
              </div>

              <p
                className="text-base sm:text-lg font-bold mt-1"
                style={{ color: isNight ? '#E0E7FF' : subject.color }}
              >
                ¡Completaste toda la materia con éxito!
              </p>
            </div>
          </section>

          {/* Estadísticas */}
          {!loading && (
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatsCard
                icon={<span className="text-3xl">✅</span>}
                value={`${completed}/${total}`}
                label="Ejercicios"
                badge="¡Misión cumplida!"
                accentColor="#006688"
                accentBg="#C2E8FF"
                accentShadow="#75D1FF"
              />
              <StatsCard
                icon={<span className="text-3xl">⭐</span>}
                value={`+${pointsEarned}`}
                label="Puntos ganados"
                badge="¡Brillante!"
                accentColor="#AC3509"
                accentBg="#FFDBD0"
                accentShadow="#FFB59F"
              />
              <StatsCard
                icon={<span className="text-3xl">🏅</span>}
                value="3"
                label="Estrellas"
                badge="Maestro botánico"
                accentColor="#B45309"
                accentBg="#FFF3C4"
                accentShadow="#FCD34D"
              />
            </section>
          )}

          {/* Mensaje motivacional + botón audio */}
          <section
            className="rounded-[2rem] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{
              background: isNight
                ? 'linear-gradient(to right, #2D1B69, #1E1B4B, #2D1B69)'
                : 'linear-gradient(to right, #FFF3C4, #FEF9E7, #FFF3C4)',
              boxShadow: isNight
                ? 'inset 0 3px 6px rgba(255,255,255,0.1), inset 0 -3px 6px rgba(0,0,0,0.3), 0 8px 18px rgba(0,0,0,0.4)'
                : 'inset 0 3px 6px rgba(255,255,255,0.8), inset 0 -3px 6px rgba(93,64,55,0.08), 0 8px 18px rgba(93,64,55,0.09)',
            }}
          >
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div
                className="w-14 h-14 min-w-[52px] rounded-full flex items-center justify-center text-2xl"
                style={{
                  backgroundColor: '#FFCA28',
                  boxShadow: 'inset 0 3px 4px rgba(255,255,255,0.8), 0 4px 0 #D97706',
                }}
              >
                🌿
              </div>
              <div>
                <p
                  className="text-lg font-black"
                  style={{ color: isNight ? '#FFF9C4' : '#2C160E' }}
                >
                  ¡Eres un gran explorador de la naturaleza! 🌿
                </p>
                <p
                  className="text-sm font-bold"
                  style={{ color: isNight ? '#E0E7FF' : '#59413A' }}
                >
                  Aprendiste cómo crecen las plantas y cómo respiran los seres vivos.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSpeak}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-full font-black text-sm transition-all active:translate-y-1 bg-white shrink-0"
              style={{
                boxShadow:
                  'inset 0 4px 6px rgba(255,255,255,0.9), 0 6px 0 #D7C1B9, 0 12px 20px rgba(93,64,55,0.08)',
              }}
            >
              <span className="text-xl">🔊</span>
              <span className="text-[#2C160E]">Escuchar voz</span>
            </button>
          </section>

          {/* Botones de acción */}
          <section className="flex flex-col sm:flex-row items-stretch justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 min-h-[64px] rounded-full py-4 px-6 flex items-center justify-center gap-3 text-white font-black text-lg transition-all active:translate-y-2"
              style={{
                backgroundColor: '#FF7043',
                boxShadow:
                  'inset 0 4px 6px rgba(255,255,255,0.5), 0 8px 0 #B33917, 0 16px 24px rgba(179,57,23,0.35)',
              }}
            >
              <span>¡Elegir otra materia!</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="min-h-[64px] rounded-full py-4 px-6 flex items-center justify-center gap-2 text-white font-black transition-all active:translate-y-1"
              style={{
                backgroundColor: '#67AB6B',
                boxShadow:
                  'inset 0 4px 6px rgba(255,255,255,0.6), 0 6px 0 #1B5E20, 0 12px 20px rgba(27,94,32,0.25)',
              }}
            >
              <span className="text-xl">🏅</span>
              <span>Mi Diploma</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="min-h-[64px] rounded-full py-4 px-6 flex items-center justify-center gap-2 font-black transition-all active:translate-y-1"
              style={{
                backgroundColor: isNight ? '#1E1B4B' : '#FFFFFF',
                color: isNight ? '#FFF9C4' : '#2C160E',
                boxShadow: isNight
                  ? 'inset 0 4px 6px rgba(255,255,255,0.1), 0 6px 0 #0F0F2E, 0 12px 20px rgba(0,0,0,0.3)'
                  : 'inset 0 4px 6px rgba(255,255,255,0.9), 0 6px 0 #D7C1B9, 0 12px 20px rgba(93,64,55,0.08)',
              }}
            >
              <span className="text-xl">🏠</span>
              <span>Inicio</span>
            </button>
          </section>

          {/* Estampa desbloqueada */}
          <section className="flex justify-center">
            <div
              className="rounded-[2rem] p-4 flex items-center gap-4 max-w-lg"
              style={{
                backgroundColor: isNight ? 'rgba(45, 27, 105, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                boxShadow: isNight
                  ? 'inset 0 4px 8px rgba(255,255,255,0.1), 0 14px 28px -6px rgba(0,0,0,0.4)'
                  : 'inset 0 4px 8px rgba(255,255,255,0.85), 0 14px 28px -6px rgba(93,64,55,0.1)',
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{
                  backgroundColor: '#ABF4AC',
                  color: '#003D12',
                  boxShadow: '0 3px 0 #90D792',
                }}
              >
                🌱
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#286B33]">
                  Nuevo álbum
                </p>
                <p
                  className="text-base font-black"
                  style={{ color: isNight ? '#FFF9C4' : '#2C160E' }}
                >
                  ¡Desbloqueaste la Estampa del Brote Sabio! 🌱
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="w-full pb-6 text-center relative z-10">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full shadow-sm text-xs font-bold"
          style={{
            backgroundColor: isNight ? 'rgba(30, 27, 75, 0.85)' : 'rgba(255, 255, 255, 0.9)',
            color: isNight ? '#FFF9C4' : '#59413A',
          }}
        >
          🔒 Entorno 100% seguro para niños
        </div>
      </footer>
    </div>
  );
}