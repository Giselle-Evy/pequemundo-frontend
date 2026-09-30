import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../../components/layout/AnimatedBackground';
import SubjectCard from '../../components/ui/SubjectCard';
import AchievementBadge from '../../components/ui/AchievementBadge';
import SoundToggle from '../../components/ui/SoundToggle';
import ProgressBar from '../../components/ui/ProgressBar';
import { useChild } from '../../contexts/ChildContext';
import { getChildProgress } from '../../services/progress';
import { getChildAchievements } from '../../services/achievements';
import ChildAvatar from '../../components/ui/ChildAvatar';
import type { ChildProgress, Achievement } from '../../types';
import ThemeToggle from '../../components/ui/ThemeToggle';
import { useTheme } from '../../hooks/useTheme';
 import { useBackgroundMusic } from '../../hooks/useBackgroundMusic';

export default function Dashboard() {
  const navigate = useNavigate();
  const { child, clearChild } = useChild();
  const { isNight } = useTheme();
  const { isPlaying, toggle } = useBackgroundMusic();

  const [progress, setProgress] = useState<ChildProgress | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!child) return;

    async function load() {
      try {
        const [progressData, achievementsData] = await Promise.all([
          getChildProgress(child!.id),
          getChildAchievements(child!.id),
        ]);
        setProgress(progressData);
        setAchievements(achievementsData.achievements);
      } catch (err) {
        console.error('Error cargando dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [child]);

  if (!child) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-100">
        <div className="text-center">
          <p className="text-lg font-bold mb-4">No hay un perfil seleccionado.</p>
          <button
            onClick={() => navigate('/children')}
            className="px-6 py-3 rounded-full bg-[#FF7043] text-white font-bold"
          >
            Elegir perfil
          </button>
        </div>
      </div>
    );
  }

  const earnedCount = achievements.filter((a) => a.earned).length;

  function handleChangeChild() {
    clearChild();
    navigate('/children');
  }

  function handlePlaySubject(subjectId: number) {
    navigate(`/subjects/${subjectId}`);
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

      {/* Header */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-2 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3 pill-pill px-3 py-1.5">
          <ChildAvatar child={child} size="sm" />
          <div className="flex flex-col">
            <span className="font-fredoka font-black text-base text-[#2C160E] leading-none">
              {child.name}
            </span>
            <span className="text-[10px] font-bold text-[#59413A]">
              {child.age} años
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SoundToggle isPlaying={isPlaying} onToggle={toggle} />
          <button
            type="button"
            onClick={() => navigate('/parent')}
            className="pill-pill px-3 py-2 flex items-center gap-2 text-xs sm:text-sm font-bold text-[#286B33] hover:text-[#003D12] transition"
            title="Zona Padres"
          >
            <span className="text-base">🛡️</span>
            <span className="hidden sm:inline">Zona Padres</span>
          </button>
          <button
            type="button"
            onClick={handleChangeChild}
            className="pill-pill px-3 py-2 flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-rose-600 transition"
          >
            <img
              alt="icono de salir"
              style={{ width: '20px', height: '20px' }}
              src="/images/cambiar.png"
            />
            <span className="hidden sm:inline">Cambiar perfil</span>
          </button>
        </div>
      </header>

      {/* Contenido */}
      <main className="flex-1 w-full relative z-10 pt-4 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Hero card */}
          <section className="clay-card p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {/* Avatar + saludo */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <ChildAvatar child={child} size="xl" />
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-black font-baloo text-[#006688]">
                      ¡Hola, {child.name}! 👋
                    </h1>
                    <p className="text-sm font-bold text-[#59413A] mt-1">
                      ¿Lista para una nueva aventura hoy?
                    </p>
                  </div>
                </div>

                {/* Barra de progreso general */}
                <div className="bg-white/70 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#AC3509]">
                      Progreso total
                    </span>
                    <span className="text-sm font-extrabold text-[#AC3509]">
                      {progress
                        ? `${progress.subjects.reduce((s, x) => s + x.completed, 0)} / ${progress.subjects.reduce((s, x) => s + x.total, 0)}`
                        : '0 / 0'}{' '}
                      ejercicios
                    </span>
                  </div>
                  <ProgressBar
                    percentage={
                      progress && progress.subjects.length > 0
                        ? Math.round(
                            (progress.subjects.reduce((s, x) => s + x.completed, 0) /
                              progress.subjects.reduce((s, x) => s + x.total, 0)) *
                              100
                          )
                        : 0
                    }
                    color="#FF7043"
                    height={24}
                  />
                </div>
              </div>

              {/* Puntos + botón */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center gap-3 bg-[#FFF9C4] rounded-full px-6 py-3 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)]">
                  <span className="text-3xl">⭐</span>
                  <span className="text-2xl font-black text-[#AC3509]">
                    {child.total_points} puntos
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const firstPending = progress?.subjects.find(
                      (s) => s.completed < s.total
                    );
                    if (firstPending) handlePlaySubject(firstPending.subject_id);
                  }}
                  disabled={loading}
                  className="w-full btn-3d-coral text-white font-baloo font-extrabold text-xl py-4 px-6 rounded-2xl flex items-center justify-center gap-3 cursor-pointer focus:outline-none focus:ring-4 focus:ring-orange-300"
                >
                  <span>{loading ? 'Cargando...' : '¡Continuar aprendiendo!'}</span>
                </button>
              </div>
            </div>
          </section>

          {/* Materias */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📖</span>
              <h2 className="text-2xl sm:text-3xl font-black font-baloo text-[#2C160E]">
                Mis materias favoritas
              </h2>
            </div>

            {loading && (
              <p className="text-center text-[#59413A] font-bold py-8">
                Cargando tus materias...
              </p>
            )}

            {!loading && progress && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {progress.subjects.map((subject) => (
                  <SubjectCard
                    key={subject.subject_id}
                    icon={subject.icon || '📖'}
                    name={subject.subject_name}
                    tagline="Materia"
                    description="Aprende jugando."
                    completed={subject.completed}
                    total={subject.total}
                    percentage={subject.percentage}
                    color={subject.color || '#AC3509'}
                    bgLight={`${subject.color || '#AC3509'}33`}
                    onPlay={() => handlePlaySubject(subject.subject_id)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Accesos rápidos */}
          <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="clay-card p-5 flex items-center gap-4 hover:-translate-y-1 transition text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFD54F] to-[#FF8A65] flex items-center justify-center text-3xl shrink-0 shadow-md">
                🛍️
              </div>
              <div>
                <p className="text-lg font-black text-[#2C160E]">Tienda</p>
                <p className="text-xs font-bold text-[#59413A]">
                  Gasta tus puntos aquí
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => navigate('/achievements')}
              className="clay-card p-5 flex items-center gap-4 hover:-translate-y-1 transition text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFD54F] to-[#FF8A65] flex items-center justify-center text-3xl shrink-0 shadow-md">
                🏆
              </div>
              <div>
                <p className="text-lg font-black text-[#2C160E]">Mis logros</p>
                <p className="text-xs font-bold text-[#59413A]">
                  {earnedCount} de {achievements.length} conseguidos
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate('/ranking')}
              className="clay-card p-5 flex items-center gap-4 hover:-translate-y-1 transition text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C2E8FF] to-[#006688] flex items-center justify-center text-3xl shrink-0 shadow-md">
                🏅
              </div>
              <div>
                <p className="text-lg font-black text-[#2C160E]">Ranking</p>
                <p className="text-xs font-bold text-[#59413A]">
                  ¡Mira quién va ganando!
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate('/parent')}
              className="clay-card p-5 flex items-center gap-4 hover:-translate-y-1 transition text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ABF4AC] to-[#286B33] flex items-center justify-center text-3xl shrink-0 shadow-md">
                🛡️
              </div>
              <div>
                <p className="text-lg font-black text-[#2C160E]">
                  Zona Padres
                </p>
                <p className="text-xs font-bold text-[#59413A]">
                  Para papá y mamá
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate('/games')}
              className="clay-card p-5 flex items-center gap-4 hover:-translate-y-1 transition text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFD54F] to-[#FF8A65] flex items-center justify-center text-3xl shrink-0 shadow-md">
                🎮
              </div>
              <div>
                <p className="text-lg font-black text-[#2C160E]">
                  Zona de Juegos
                </p>
                <p className="text-xs font-bold text-[#59413A]">
                  ¡Diviértete sin parar!
                </p>
              </div>
            </button>
          </section>

          {/* Logros */}
          <section className="clay-card p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black font-baloo text-[#2C160E]">
                    Mis logros
                  </h2>
                  <p className="text-sm font-bold text-[#59413A]">
                    {earnedCount} de {achievements.length} insignias conseguidas
                  </p>
                </div>
              </div>
            </div>

            {!loading && achievements.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {achievements.map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    icon={achievement.badge_icon}
                    title={achievement.title}
                    description={achievement.description}
                    earned={achievement.earned}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="w-full pb-6 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/90 px-4 py-1.5 rounded-full shadow-sm text-xs font-bold text-[#59413A]">
          🔒 Entorno 100% seguro para niños.
        </div>
      </footer>
    </div>
  );
}