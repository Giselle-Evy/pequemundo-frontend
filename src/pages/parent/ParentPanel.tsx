import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../../components/ui/ThemeToggle';
import SubscriptionCard from '../../components/ui/SubscriptionCard';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { getChildren } from '../../services/children';
import { getChildProgress } from '../../services/progress';
import { AVATAR_OPTIONS } from '../../data/avatars';
import type { Child, ChildProgress } from '../../types';

interface ChildWithProgress {
  child: Child;
  progress: ChildProgress | null;
}

export default function ParentPanel() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isNight } = useTheme();

  const [children, setChildren] = useState<ChildWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const childrenList = await getChildren();
        const withProgress = await Promise.all(
          childrenList.map(async (child) => {
            try {
              const progress = await getChildProgress(child.id);
              return { child, progress };
            } catch {
              return { child, progress: null };
            }
          })
        );
        setChildren(withProgress);
      } catch {
        setError('No pudimos cargar los perfiles.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  function handleAddProfile() {
    navigate('/children/new');
  }

  function handleViewDetail(childId: number) {
    navigate(`/parent/child/${childId}`);
  }

  const totalCompleted = children.reduce((sum, c) => {
    if (!c.progress) return sum;
    return sum + c.progress.subjects.reduce((s, sub) => s + sub.completed, 0);
  }, 0);

  const totalExercises = children.reduce((sum, c) => {
    if (!c.progress) return sum;
    return sum + c.progress.subjects.reduce((s, sub) => s + sub.total, 0);
  }, 0);

  const totalPoints = children.reduce((sum, c) => sum + c.child.total_points, 0);

  const bgPage = isNight ? '#0F0F2E' : '#FFF8F6';
  const bgHeader = isNight ? 'rgba(30, 27, 75, 0.9)' : 'rgba(255, 255, 255, 0.9)';
  const bgCard = isNight ? '#1E1B4B' : '#FFFFFF';
  const textTitle = isNight ? '#FFF9C4' : '#2C160E';
  const textBody = isNight ? '#E0E7FF' : '#59413A';

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgPage }}>
      {/* Header */}
      <header
        className="w-full backdrop-blur-md shadow-sm sticky top-0 z-40"
        style={{ backgroundColor: bgHeader }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-[#FF7043]">PequeMundo</span>
            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C2E8FF] text-[#005370] text-xs font-black uppercase">
              🛡️ Zona Padres
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100">
              <span className="text-sm font-black text-[#2C160E]">{user?.name}</span>
              <span className="text-xs font-bold text-[#286B33]">● Activo</span>
            </div>

            <ThemeToggle />

            <button
              type="button"
              onClick={() => navigate('/children')}
              className="px-4 py-2 rounded-full bg-[#ABF4AC] hover:bg-[#90D792] text-[#003D12] font-black text-sm shadow-md transition flex items-center gap-2"
              title="Volver a los perfiles"
            >
              <span className="text-base">👦</span>
              <span className="hidden sm:inline">Ir a jugar</span>
            </button>

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

      {/* Contenido */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Bienvenida */}
        <section
          className="rounded-[2rem] p-6 sm:p-8 shadow-sm"
          style={{ backgroundColor: isNight ? '#2D1B69' : '#FFF1ED' }}
        >
          <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-[#C2E8FF] text-[#005370] text-xs font-black uppercase mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006688] animate-pulse" />
            <span>
              Familia {user?.name || ''} • {children.length} perfiles activos
            </span>
          </div>
          <h1
            className="text-3xl sm:text-5xl font-black tracking-tight"
            style={{ color: isNight ? '#FFD54F' : '#AC3509' }}
          >
            ¡Hola, {user?.name}! 👋
          </h1>
          <p className="text-base sm:text-lg font-bold mt-2 max-w-2xl" style={{ color: textBody }}>
            Revisa el progreso, los logros y las aventuras de aprendizaje de tus pequeños exploradores.
          </p>
        </section>

        {/* Perfiles */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👦👧</span>
            <h2 className="text-2xl sm:text-3xl font-black" style={{ color: textTitle }}>
              Perfiles de los niños
            </h2>
          </div>

          {loading && (
            <p className="text-center font-bold py-8" style={{ color: textBody }}>
              Cargando perfiles...
            </p>
          )}

          {error && (
            <p className="text-center text-rose-700 font-bold py-8">😕 {error}</p>
          )}

          {!loading && !error && children.length === 0 && (
            <div
              className="rounded-3xl p-8 text-center shadow-sm"
              style={{ backgroundColor: bgCard }}
            >
              <p className="text-lg font-bold mb-4" style={{ color: textBody }}>
                Aún no tienes perfiles infantiles.
              </p>
              <button
                type="button"
                onClick={handleAddProfile}
                className="px-6 py-3 rounded-full bg-[#FF7043] text-white font-black shadow-lg hover:brightness-110 transition"
              >
                ➕ Crear el primer perfil
              </button>
            </div>
          )}

          {!loading && children.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {children.map(({ child, progress }) => {
                const avatar =
                  AVATAR_OPTIONS.find((a) => a.emoji === child.avatar) ||
                  AVATAR_OPTIONS[0];
                const totalCompleted = progress
                  ? progress.subjects.reduce((s, sub) => s + sub.completed, 0)
                  : 0;
                const totalEx = progress
                  ? progress.subjects.reduce((s, sub) => s + sub.total, 0)
                  : 0;
                const overallPercent =
                  totalEx > 0 ? Math.round((totalCompleted / totalEx) * 100) : 0;

                return (
                  <article
                    key={child.id}
                    className="rounded-[2rem] p-6 shadow-sm hover:-translate-y-1 transition"
                    style={{ backgroundColor: bgCard }}
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-20 h-20 rounded-full flex items-center justify-center text-5xl shrink-0"
                          style={{
                            backgroundColor: avatar.bgColor,
                            border: `4px solid ${avatar.borderColor}`,
                          }}
                        >
                          <span role="img" aria-label={avatar.name}>
                            {avatar.emoji}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-2xl font-black" style={{ color: textTitle }}>
                              {child.name}
                            </h3>
                            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-[#FFDBD0] text-[#AC3509]">
                              {child.age} años
                            </span>
                          </div>
                          <p className="text-sm font-bold" style={{ color: textBody }}>
                            Explorador de PequeMundo
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="px-3 py-1 rounded-full bg-[#FFF3C4] text-[#AC3509] font-black flex items-center gap-1.5">
                          ⭐ {child.total_points}
                        </div>
                      </div>
                    </div>

                    {/* Progreso general */}
                    <div
                      className="rounded-2xl p-4 space-y-2 mb-4"
                      style={{ backgroundColor: isNight ? '#2D1B69' : '#FFF8F6' }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold" style={{ color: textBody }}>
                          ✅ {totalCompleted} de {totalEx} ejercicios
                        </span>
                        <span className="text-sm font-black text-[#FF7043]">
                          {overallPercent}%
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-[#FFDBD0] p-0.5 shadow-inner">
                        <div
                          className="h-full rounded-full bg-[#FF7043] transition-all"
                          style={{ width: `${overallPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Progreso por materia */}
                    {progress && (
                      <div className="space-y-3 mb-4">
                        <p
                          className="text-xs font-black uppercase tracking-wider"
                          style={{ color: textBody }}
                        >
                          Progreso por materias
                        </p>
                        {progress.subjects.map((sub) => (
                          <div key={sub.subject_id} className="space-y-1">
                            <div className="flex justify-between items-center text-sm">
                              <span
                                className="font-bold flex items-center gap-1.5"
                                style={{ color: textTitle }}
                              >
                                <span>{sub.icon || '📖'}</span>
                                {sub.subject_name}
                              </span>
                              <span
                                className="font-black"
                                style={{ color: sub.color || '#AC3509' }}
                              >
                                {sub.completed}/{sub.total}
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-[#FFF1ED] p-0.5">
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
                    )}

                    <button
                      type="button"
                      onClick={() => handleViewDetail(child.id)}
                      className="w-full py-3 rounded-full bg-[#FF7043] text-white font-black shadow-lg hover:brightness-110 transition active:translate-y-1"
                    >
                      Ver detalles de {child.name} →
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Botón agregar perfil */}
        <section>
          <button
            type="button"
            onClick={handleAddProfile}
            className="w-full rounded-[2rem] p-6 flex items-center justify-between gap-4 transition text-left"
            style={{ backgroundColor: isNight ? '#2D1B69' : '#FFF1ED' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-[#C2E8FF] flex items-center justify-center text-3xl shadow-md">
                ➕
              </div>
              <div>
                <h3 className="text-xl font-black" style={{ color: textTitle }}>
                  Agregar nuevo perfil infantil
                </h3>
                <p className="text-sm font-bold" style={{ color: textBody }}>
                  ¿Se suma otro explorador a la familia?
                </p>
              </div>
            </div>
            <span className="hidden sm:inline text-sm font-black text-[#006688]">
              Crear perfil →
            </span>
          </button>
        </section>

        {/* Resumen familiar */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📈</span>
            <h2 className="text-2xl sm:text-3xl font-black" style={{ color: textTitle }}>
              Resumen familiar global
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Total ejercicios',
                value: totalCompleted,
                sub: `de ${totalExercises} posibles`,
                color: '#286B33',
              },
              {
                label: 'Puntos ganados',
                value: `${totalPoints} ⭐`,
                sub: 'entre todos los niños',
                color: '#AC3509',
              },
              {
                label: 'Perfiles activos',
                value: children.length,
                sub: 'niños aprendiendo',
                color: '#006688',
              },
              {
                label: 'Materias disponibles',
                value: children[0]?.progress?.subjects.length || 0,
                sub: 'Biología, Español, Geografía',
                color: '#7E57C2',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="rounded-3xl p-6 shadow-sm"
                style={{ backgroundColor: bgCard }}
              >
                <p className="text-xs font-black uppercase mb-2" style={{ color: textBody }}>
                  {card.label}
                </p>
                <p className="text-3xl font-black" style={{ color: card.color }}>
                  {card.value}
                </p>
                <p className="text-xs font-bold mt-1" style={{ color: textBody }}>
                  {card.sub}
                </p>
              </div>
            ))}
          </div>
        </section>
                {/* Suscripción */}
        <section>
          <SubscriptionCard />
        </section>

        {/* Seguridad */}
        <section
          className="rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ backgroundColor: isNight ? '#2D1B69' : 'rgba(194, 232, 255, 0.4)' }}
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">🔒</span>
            <div>
              <p className="font-black" style={{ color: textTitle }}>
                Entorno 100% seguro para niños
              </p>
              <p className="text-sm font-bold" style={{ color: textBody }}>
                Contenido supervisado pedagógicamente
              </p>
            </div>
          </div>
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
          © 2025 PequeMundo • Diseñado con amor para un aprendizaje feliz
        </div>
      </footer>
    </div>
  );
}