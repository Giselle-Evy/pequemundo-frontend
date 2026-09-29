import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../../components/layout/AnimatedBackground';
import ChildTopBar from '../../components/layout/ChildTopBar';
import { useChild } from '../../contexts/ChildContext';
import { getGlobalRanking, getFamilyRanking } from '../../services/rankings';
import type { RankingEntry } from '../../types';

type TabType = 'family' | 'global';

export default function Ranking() {
  const navigate = useNavigate();
  const { child } = useChild();

  const [tab, setTab] = useState<TabType>('family');
  const [family, setFamily] = useState<RankingEntry[]>([]);
  const [global, setGlobal] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [familyData, globalData] = await Promise.all([
          getFamilyRanking(),
          getGlobalRanking(),
        ]);
        setFamily(familyData);
        setGlobal(globalData);
      } catch (err) {
        console.error('Error cargando ranking:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const currentData = tab === 'family' ? family : global;

  // Medallas para el top 3
  const medals = ['🥇', '🥈', '🥉'];

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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Hero */}
          <section className="clay-card p-6 sm:p-8 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-3xl sm:text-4xl font-black font-baloo text-[#006688] mb-2">
              Ranking de Exploradores
            </h1>
            <p className="text-base sm:text-lg font-bold text-[#59413A]">
              ¡Mira quiénes son los que más puntos han ganado!
            </p>
          </section>

          {/* Tabs */}
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => setTab('family')}
              className={`px-6 py-3 rounded-full font-black text-sm transition-all ${
                tab === 'family'
                  ? 'bg-[#FF7043] text-white shadow-lg'
                  : 'bg-white text-[#59413A] hover:bg-[#FFE2DA]'
              }`}
              style={
                tab === 'family'
                  ? { boxShadow: '0 4px 0 #AC3509' }
                  : {}
              }
            >
              👨‍👩‍👧 Mi familia
            </button>
            <button
              type="button"
              onClick={() => setTab('global')}
              className={`px-6 py-3 rounded-full font-black text-sm transition-all ${
                tab === 'global'
                  ? 'bg-[#006688] text-white shadow-lg'
                  : 'bg-white text-[#59413A] hover:bg-[#C2E8FF]'
              }`}
              style={
                tab === 'global'
                  ? { boxShadow: '0 4px 0 #005370' }
                  : {}
              }
            >
              🌎 Global
            </button>
          </div>

          {/* Lista de ranking */}
          {loading && (
            <div className="clay-card p-8 text-center">
              <p className="font-bold text-[#59413A]">Cargando ranking...</p>
            </div>
          )}

          {!loading && currentData.length === 0 && (
            <div className="clay-card p-8 text-center">
              <p className="font-bold text-[#59413A]">
                Aún no hay exploradores en este ranking.
              </p>
            </div>
          )}

          {!loading && currentData.length > 0 && (
            <div className="space-y-3">
              {currentData.map((entry, index) => {
                const isCurrentChild = child?.id === entry.child_id;
                const isTop3 = index < 3;

                return (
                  <div
                    key={entry.child_id}
                    className={`rounded-[2rem] p-4 sm:p-5 flex items-center gap-4 transition-all ${
                      isCurrentChild
                        ? 'bg-gradient-to-r from-[#FFF3C4] to-[#FFDBD0] ring-4 ring-[#FFD54F]'
                        : 'bg-white'
                    }`}
                    style={{
                      boxShadow: isCurrentChild
                        ? '0 12px 24px rgba(255,112,67,0.25), inset 0 3px 5px rgba(255,255,255,0.9)'
                        : '0 8px 16px rgba(93,64,55,0.08), inset 0 3px 5px rgba(255,255,255,0.9)',
                    }}
                  >
                    {/* Posición */}
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl shrink-0 ${
                        isTop3 ? 'text-3xl' : 'text-[#59413A]'
                      }`}
                      style={{
                        background: isTop3
                          ? 'linear-gradient(135deg, #FFD54F, #FF8A65)'
                          : '#FFF1ED',
                        boxShadow: isTop3
                          ? '0 6px 12px rgba(172,53,9,0.2)'
                          : 'inset 0 2px 4px rgba(93,64,55,0.1)',
                      }}
                    >
                      {isTop3 ? medals[index] : entry.position}
                    </div>

                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full bg-[#FFF1ED] flex items-center justify-center text-3xl shrink-0 shadow-inner">
                      {entry.avatar}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-black text-[#2C160E] truncate">
                        {entry.name}
                        {isCurrentChild && (
                          <span className="ml-2 text-xs font-black px-2 py-0.5 rounded-full bg-[#ABF4AC] text-[#003D12]">
                            ¡Tú!
                          </span>
                        )}
                      </p>
                      <p className="text-sm font-bold text-[#59413A]">
                        Posición #{entry.position}
                      </p>
                    </div>

                    {/* Puntos */}
                    <div className="text-right">
                      <p className="text-2xl font-black text-[#AC3509]">
                        {entry.total_points}
                      </p>
                      <p className="text-[10px] font-black uppercase text-[#59413A]">
                        puntos
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
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