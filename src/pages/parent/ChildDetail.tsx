import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ThemeToggle from '../../components/ui/ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { getChildHistory } from '../../services/history';
import { getChildAchievements } from '../../services/achievements';
import { getChildProgress } from '../../services/progress';
import { AVATAR_OPTIONS } from '../../data/avatars';
import type {
  ChildHistoryEntry,
  Achievement,
  ChildProgress,
  Child,
} from '../../types';

export default function ChildDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const childId = Number(id);
  const { user, logout } = useAuth();
  const { isNight } = useTheme();

  const [history, setHistory] = useState<ChildHistoryEntry[]>([]);
  const [child, setChild] = useState<Child | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [progress, setProgress] = useState<ChildProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [historyData, achievementsData, progressData] = await Promise.all([
          getChildHistory(childId),
          getChildAchievements(childId),
          getChildProgress(childId),
        ]);
        setChild(historyData.child);
        setHistory(historyData.history);
        setAchievements(achievementsData.achievements);
        setProgress(progressData);
      } catch {
        setError('No pudimos cargar los datos del niño.');
      } finally {
        setLoading(false);
      }
    }
    if (childId) load();
  }, [childId]);

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  // Colores según tema
  const bgPage = isNight ? '#0F0F2E' : '#FFF8F6';
  const bgHeader = isNight ? 'rgba(30, 27, 75, 0.9)' : 'rgba(255, 255, 255, 0.9)';
  const bgCard = isNight ? '#1E1B4B' : '#FFFFFF';
  const bgSubCard = isNight ? '#2D1B69' : '#FFF8F6';
  const bgProgressTrack = isNight ? '#2D1B69' : '#FFF1ED';
  const textTitle = isNight ? '#FFF9C4' : '#2C160E';
  const textBody = isNight ? '#E0E7FF' : '#59413A';
  const textSubtle = isNight ? '#A5B4FC' : '#94A3B8';

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: bgPage }}
      >
        <p className="text-lg font-bold" style={{ color: textBody }}>
          Cargando...
        </p>
      </div>
    );
  }

  if (error || !child) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: bgPage }}
      >
        <div className="text-center">
          <p className="text-lg font-bold text-rose-700 mb-4">
            {error || 'Niño no encontrado'}
          </p>
          <button
            onClick={() => navigate('/parent')}
            className="px-6 py-3 rounded-full bg-[#FF7043] text-white font-bold"
          >
            Volver al panel
          </button>
        </div>
      </div>
    );
  }

  const avatar =
    AVATAR_OPTIONS.find((a) => a.emoji === child.avatar) || AVATAR_OPTIONS[0];
  const earnedAchievements = achievements.filter((a) => a.earned);

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgPage }}>
      {/* Header */}
      <header
        className="w-full backdrop-blur-md shadow-sm sticky top-0 z-40"
        style={{ backgroundColor: bgHeader }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/parent')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition font-bold text-sm"
          >
            ← Volver al panel
          </button>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm font-black" style={{ color: textTitle }}>
              {user?.name}
            </span>
            <ThemeToggle />
            <button
              type="button"
              onClick={handleLogout}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-rose-100 flex items-center justify-center text-xl transition"
              title="Cerrar sesión"
            >
              <img
                alt="icono de salir"
                style={{ width: '20px', height: '20px' }}
                src="/images/salida.png"
              />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Tarjeta hero del niño */}
        <section
          className="rounded-[2rem] p-6 sm:p-8 shadow-sm"
          style={{ backgroundColor: bgCard }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center text-7xl shrink-0"
              style={{
                backgroundColor: avatar.bgColor,
                border: `4px solid ${avatar.borderColor}`,
              }}
            >
              <span role="img" aria-label={avatar.name}>
                {avatar.emoji}
              </span>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-black" style={{ color: textTitle }}>
                {child.name}
              </h1>
              <p className="text-base font-bold mt-1" style={{ color: textBody }}>
                {child.age} años • Explorador de PequeMundo
              </p>
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF3C4] text-[#AC3509] font-black">
                ⭐ {child.total_points} puntos
              </div>
            </div>
          </div>
        </section>

        {/* Progreso por materia */}
        {progress && (
          <section
            className="rounded-[2rem] p-6 sm:p-8 shadow-sm"
            style={{ backgroundColor: bgCard }}
          >
            <h2 className="text-2xl font-black mb-4" style={{ color: textTitle }}>
              📚 Progreso por materia
            </h2>
            <div className="space-y-4">
              {progress.subjects.map((sub) => (
                <div key={sub.subject_id}>
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className="font-bold flex items-center gap-2"
                      style={{ color: textTitle }}
                    >
                      <span className="text-xl">{sub.icon || '📖'}</span>
                      {sub.subject_name}
                    </span>
                    <span
                      className="font-black"
                      style={{ color: sub.color || '#AC3509' }}
                    >
                      {sub.completed}/{sub.total} ({sub.percentage}%)
                    </span>
                  </div>
                  <div
                    className="w-full h-3 rounded-full p-0.5"
                    style={{ backgroundColor: bgProgressTrack }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${sub.percentage}%`,
                        backgroundColor: sub.color || '#AC3509',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Logros ganados */}
        <section
          className="rounded-[2rem] p-6 sm:p-8 shadow-sm"
          style={{ backgroundColor: bgCard }}
        >
          <h2 className="text-2xl font-black mb-4" style={{ color: textTitle }}>
            🏆 Logros ganados ({earnedAchievements.length})
          </h2>
          {earnedAchievements.length === 0 ? (
            <p className="text-sm font-bold italic" style={{ color: textSubtle }}>
              Aún no ha ganado logros. ¡Sigue jugando!
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {earnedAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="rounded-2xl p-4 flex flex-col items-center text-center"
                  style={{
                    background: 'linear-gradient(135deg, #FFD54F, #FF7043)',
                    boxShadow: '0 4px 8px rgba(172,53,9,0.2)',
                  }}
                >
                  <span className="text-4xl mb-2">{achievement.badge_icon}</span>
                  <span className="text-xs font-black text-white">
                    {achievement.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Historial */}
        <section
          className="rounded-[2rem] p-6 sm:p-8 shadow-sm"
          style={{ backgroundColor: bgCard }}
        >
          <h2 className="text-2xl font-black mb-4" style={{ color: textTitle }}>
            📋 Historial de ejercicios ({history.length})
          </h2>
          {history.length === 0 ? (
            <p className="text-sm font-bold italic" style={{ color: textSubtle }}>
              Aún no ha completado ejercicios.
            </p>
          ) : (
            <div className="space-y-2">
              {history.map((entry) => (
                <div
                  key={entry.progress_id}
                  className="flex items-center gap-3 p-3 rounded-2xl"
                  style={{ backgroundColor: bgSubCard }}
                >
                  <span className="text-2xl">{entry.subject_icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-black truncate" style={{ color: textTitle }}>
                      {entry.exercise_title}
                    </p>
                    <p className="text-xs font-bold" style={{ color: textBody }}>
                      {entry.subject_name} •{' '}
                      {new Date(entry.completed_at).toLocaleDateString('es-MX', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className="text-sm font-black text-[#286B33]">
                    +{entry.score} ⭐
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="w-full py-6 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full shadow-sm text-xs font-bold"
          style={{
            backgroundColor: isNight ? 'rgba(30, 27, 75, 0.85)' : 'rgba(255, 255, 255, 0.9)',
            color: textBody,
          }}
        >
          © 2025 PequeMundo • Diseñado con amor
        </div>
      </footer>
    </div>
  );
}