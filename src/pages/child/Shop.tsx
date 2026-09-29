import { useEffect, useState } from 'react';
import AnimatedBackground from '../../components/layout/AnimatedBackground';
import ChildTopBar from '../../components/layout/ChildTopBar';
import { useChild } from '../../contexts/ChildContext';
import {
  getStoreItems,
  buyItem,
  equipItem,
  unequipItem,
} from '../../services/store';
import type { StoreItem } from '../../types';

type Category = 'avatar' | 'accessory' | 'frame';

export default function Shop() {
  const { child, setChild } = useChild();

  const [items, setItems] = useState<StoreItem[]>([]);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category>('avatar');
  const [buying, setBuying] = useState<number | null>(null);
  const [equipping, setEquipping] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!child) return;

    async function loadItems() {
      setLoading(true);
      try {
        const data = await getStoreItems(child!.id);
        setItems(data.items);
        setPoints(data.total_points);
      } catch (err) {
        console.error('Error cargando tienda:', err);
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, [child]);

  async function handleBuy(item: StoreItem) {
    if (!child) return;
    if (item.owned) return;
    if (points < item.price) {
      setFeedback({
        type: 'error',
        message:
          '¡No tienes suficientes puntos! Sigue jugando para ganar más. 💪',
      });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setBuying(item.id);
    try {
      const response = await buyItem(child.id, item.id);
      setPoints(response.total_points);
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, owned: true } : i))
      );
      setFeedback({
        type: 'success',
        message: `¡Compraste ${item.icon} ${item.name}! 🎉`,
      });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setFeedback({
        type: 'error',
        message: axiosError.response?.data?.message || 'Error al comprar',
      });
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setBuying(null);
    }
  }

  async function handleEquip(item: StoreItem) {
    if (!child) return;

    setEquipping(item.id);
    try {
      const response = await equipItem(child.id, item.id);
      setChild(response.child);
      setFeedback({
        type: 'success',
        message: `¡Equipaste ${item.icon} ${item.name}! ✨`,
      });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setFeedback({
        type: 'error',
        message: axiosError.response?.data?.message || 'Error al equipar',
      });
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setEquipping(null);
    }
  }

  async function handleUnequip(item: StoreItem) {
    if (!child) return;

    let slot: 'avatar' | 'accessory' | 'accessory2' | 'frame' = 'frame';

    if (item.category === 'avatar') {
      slot = 'avatar';
    } else if (item.category === 'accessory') {
      slot =
        child.equipped_accessory_id === item.id ? 'accessory' : 'accessory2';
    } else if (item.category === 'frame') {
      slot = 'frame';
    }

    setEquipping(item.id);
    try {
      const response = await unequipItem(child.id, slot);
      setChild(response.child);
      setFeedback({
        type: 'success',
        message: `Quitaste ${item.icon} ${item.name} ✅`,
      });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setFeedback({
        type: 'error',
        message: axiosError.response?.data?.message || 'Error al desequipar',
      });
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setEquipping(null);
    }
  }

  function isEquipped(item: StoreItem): boolean {
    if (!child) return false;
    if (item.category === 'avatar') return child.equipped_avatar_id === item.id;
    if (item.category === 'frame') return child.equipped_frame_id === item.id;
    if (item.category === 'accessory') {
      return (
        child.equipped_accessory_id === item.id ||
        child.equipped_accessory_id_2 === item.id
      );
    }
    return false;
  }

  const filteredItems = items.filter((i) => i.category === category);

  const categories: { id: Category; label: string; icon: string }[] = [
    { id: 'avatar', label: 'Animales', icon: '🦊' },
    { id: 'accessory', label: 'Accesorios', icon: '👑' },
    { id: 'frame', label: 'Marcos', icon: '🌈' },
  ];

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
            <div className="text-6xl mb-3">🛍️</div>
            <h1 className="text-3xl sm:text-4xl font-black font-baloo text-[#006688] mb-2">
              Tienda de PequeMundo
            </h1>
            <p className="text-base sm:text-lg font-bold text-[#59413A]">
              Gasta tus puntos en avatares, accesorios y marcos.
            </p>

            {/* Puntos */}
            <div className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFF3C4] shadow-md">
              <span className="text-3xl">⭐</span>
              <span className="text-2xl font-black text-[#AC3509]">
                {points} puntos
              </span>
            </div>
          </section>

          {/* Feedback */}
          {feedback && (
            <div
              className="rounded-2xl p-4 text-center font-black shadow-md transition-all"
              style={{
                backgroundColor:
                  feedback.type === 'success' ? '#ABF4AC' : '#FFDBD0',
                color: feedback.type === 'success' ? '#003D12' : '#AC3509',
              }}
            >
              {feedback.message}
            </div>
          )}

          {/* Tabs de categoría */}
          <div className="flex justify-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`px-5 py-3 rounded-full font-black text-sm transition-all ${
                  category === cat.id
                    ? 'bg-[#FF7043] text-white shadow-lg'
                    : 'bg-white text-[#59413A] hover:bg-[#FFE2DA]'
                }`}
                style={
                  category === cat.id ? { boxShadow: '0 4px 0 #AC3509' } : {}
                }
              >
                <span className="text-lg mr-1">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid de items */}
          {loading && (
            <p className="text-center font-bold text-[#59413A] py-8">
              Cargando tienda...
            </p>
          )}

          {!loading && filteredItems.length > 0 && (
            <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map((item) => {
                const isFree = item.price === 0;
                const canAfford = points >= item.price;
                const isBuying = buying === item.id;
                const isEquipping = equipping === item.id;
                const equipped = isEquipped(item);
                const isOwned = item.owned || isFree;

                return (
                  <div
                    key={item.id}
                    className={`rounded-[2rem] p-5 flex flex-col items-center text-center transition-all ${
                      isOwned
                        ? 'bg-[#ABF4AC]'
                        : canAfford
                          ? 'bg-white hover:-translate-y-1'
                          : 'bg-[#FFE2DA] opacity-70'
                    }`}
                    style={{
                      boxShadow: isOwned
                        ? '0 8px 16px rgba(40,107,51,0.2), inset 0 4px 6px rgba(255,255,255,0.9)'
                        : '0 8px 16px rgba(93,64,55,0.1), inset 0 4px 6px rgba(255,255,255,0.9)',
                    }}
                  >
                    <div className="text-6xl mb-3 select-none">{item.icon}</div>
                    <h3 className="text-sm font-black text-[#2C160E] leading-tight mb-1">
                      {item.name}
                    </h3>

                    {isFree ? (
                      /* ===== AVATAR GRATIS ===== */
                      <>
                        <span className="text-[10px] font-black text-[#003D12] px-2 py-0.5 rounded-full bg-white/70 mb-2">
                          {equipped ? '✅ Equipado' : '🎁 Gratis'}
                        </span>

                        {equipped ? (
                          <button
                            type="button"
                            onClick={() => handleUnequip(item)}
                            disabled={isEquipping}
                            className="w-full py-2 rounded-full font-black text-xs bg-[#FFDBD0] text-[#AC3509] hover:brightness-110 active:translate-y-1 transition-all disabled:opacity-50"
                            style={{ boxShadow: '0 3px 0 #AC3509' }}
                          >
                            {isEquipping ? 'Quitando...' : '❌ Quitar'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleEquip(item)}
                            disabled={isEquipping}
                            className="w-full py-2 rounded-full font-black text-xs bg-[#286B33] text-white hover:brightness-110 active:translate-y-1 transition-all disabled:opacity-50"
                            style={{ boxShadow: '0 3px 0 #003D12' }}
                          >
                            {isEquipping ? 'Equipando...' : '✨ Equipar'}
                          </button>
                        )}
                      </>
                    ) : item.owned ? (
                      /* ===== AVATAR PREMIUM COMPRADO ===== */
                      <>
                        <span className="text-[10px] font-black text-[#003D12] px-2 py-0.5 rounded-full bg-white/70 mb-2">
                          {equipped ? '✅ Equipado' : '✅ Comprado'}
                        </span>

                        {equipped ? (
                          <button
                            type="button"
                            onClick={() => handleUnequip(item)}
                            disabled={isEquipping}
                            className="w-full py-2 rounded-full font-black text-xs bg-[#FFDBD0] text-[#AC3509] hover:brightness-110 active:translate-y-1 transition-all disabled:opacity-50"
                            style={{ boxShadow: '0 3px 0 #AC3509' }}
                          >
                            {isEquipping ? 'Quitando...' : '❌ Quitar'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleEquip(item)}
                            disabled={isEquipping}
                            className="w-full py-2 rounded-full font-black text-xs bg-[#286B33] text-white hover:brightness-110 active:translate-y-1 transition-all disabled:opacity-50"
                            style={{ boxShadow: '0 3px 0 #003D12' }}
                          >
                            {isEquipping ? 'Equipando...' : '✨ Equipar'}
                          </button>
                        )}
                      </>
                    ) : (
                      /* ===== AVATAR PREMIUM NO COMPRADO ===== */
                      <>
                        <span className="text-sm font-black text-[#AC3509] mb-2">
                          ⭐ {item.price} pts
                        </span>
                        <button
                          type="button"
                          onClick={() => handleBuy(item)}
                          disabled={!canAfford || isBuying}
                          className={`w-full py-2 rounded-full font-black text-xs transition-all ${
                            canAfford && !isBuying
                              ? 'bg-[#FF7043] text-white hover:brightness-110 active:translate-y-1'
                              : 'bg-[#FFDBD0] text-[#8D7169] cursor-not-allowed'
                          }`}
                          style={
                            canAfford && !isBuying
                              ? { boxShadow: '0 3px 0 #AC3509' }
                              : {}
                          }
                        >
                          {isBuying ? 'Comprando...' : 'Comprar'}
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
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