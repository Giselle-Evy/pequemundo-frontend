import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../../components/layout/AnimatedBackground';
import ChildTopBar from '../../components/layout/ChildTopBar';
import { useChild } from '../../contexts/ChildContext';
import { getChildAchievements } from '../../services/achievements';
import type { Achievement } from '../../types';

export default function Achievements() {
  const navigate = useNavigate();
  const { child } = useChild();

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!child) return;

    async function load() {
      try {
        const data = await getChildAchievements(child!.id);
        setAchievements(data.achievements);
      } catch {
        setError('No pudimos cargar los logros.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [child]);

  const earnedCount = achievements.filter((a) => a.earned).length;
  const totalCount = achievements.length;
  const percentage = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;

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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Hero */}
          <section className="clay-card p-6 sm:p-8 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-3xl sm:text-4xl font-black font-baloo text-[#006688] mb-2">
              Mis Logros y Medallas
            </h1>
            <p className="text-base sm:text-lg font-bold text-[#59413A]">
              ¡Has conseguido {earnedCount} de {totalCount} insignias!
            </p>

            {/* Barra de progreso */}
            <div className="mt-6 max-w-md mx-auto">
              <div className="flex justify-between items-center text-sm font-black text-[#2C160E] mb-2">
                <span>Progreso de logros</span>
                <span>{percentage}%</span>
              </div>
              <div className="w-full h-4 rounded-full bg-[#FFDBD0] p-1 shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FFD54F] to-[#FF7043] transition-all duration-700"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </section>

          {/* Estados */}
          {loading && (
            <div className="clay-card p-8 text-center">
              <p className="font-bold text-[#59413A]">Cargando logros...</p>
            </div>
          )}

          {error && (
            <div className="clay-card p-8 text-center">
              <p className="font-bold text-rose-700">😕 {error}</p>
            </div>
          )}

          {/* Grid de logros */}
          {!loading && !error && (
            <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`rounded-[2rem] p-5 flex flex-col items-center text-center transition-all ${
                    achievement.earned
                      ? 'bg-white hover:-translate-y-1 cursor-pointer'
                      : 'bg-[#FFE2DA]'
                  }`}
                  style={{
                    boxShadow: achievement.earned
                      ? '0 12px 24px rgba(93,64,55,0.12), inset 0 3px 5px rgba(255,255,255,0.9)'
                      : 'inset 0 2px 6px rgba(93,64,55,0.12)',
                  }}
                >
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center text-5xl relative mb-3 ${
                      achievement.earned ? '' : 'grayscale opacity-60'
                    }`}
                    style={{
                      background: achievement.earned
                        ? 'linear-gradient(135deg, #FFD54F, #FF7043)'
                        : '#FFDBD0',
                      boxShadow: achievement.earned
                        ? '0 8px 16px rgba(172,53,9,0.25), inset 0 4px 6px rgba(255,255,255,0.6)'
                        : 'inset 0 2px 4px rgba(93,64,55,0.15)',
                    }}
                  >
                    <span>{achievement.badge_icon}</span>
                    {!achievement.earned && (
                      <span className="absolute inset-0 flex items-center justify-center text-2xl">
                        🔒
                      </span>
                    )}
                  </div>
                  <h3
                    className={`text-sm sm:text-base font-black leading-tight mb-1 ${
                      achievement.earned ? 'text-[#2C160E]' : 'text-[#8D7169]'
                    }`}
                  >
                    {achievement.title}
                  </h3>
                  <p
                    className={`text-[11px] font-bold leading-tight ${
                      achievement.earned ? 'text-[#59413A]' : 'text-[#8D7169]'
                    }`}
                  >
                    {achievement.description}
                  </p>
                  <span
                    className={`mt-3 text-[10px] font-black px-3 py-1 rounded-full ${
                      achievement.earned
                        ? 'bg-[#ABF4AC] text-[#003D12]'
                        : 'bg-[#FFDBD0] text-[#8D7169]'
                    }`}
                  >
                    {achievement.earned ? '¡Conseguida!' : 'Bloqueada'}
                  </span>
                </div>
              ))}
            </section>
          )}

          {/* Botón volver */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 rounded-full bg-white font-black text-[#2C160E] shadow-md hover:shadow-lg transition"
            >
              ← Volver al Dashboard
            </button>
          </div>
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