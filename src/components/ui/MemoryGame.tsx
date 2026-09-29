import { useEffect, useMemo, useState } from 'react';

interface MemoryGameProps {
  onClose?: () => void;
}

interface Card {
  id: number;
  emoji: string;
  matched: boolean;
}

const EMOJI_POOL = [
  '🐶', '🐱', '🐭', '🐹',
  '🐰', '🦊', '🐻', '🐼',
  '🐨', '🐯', '🦁', '🐮',
];

export default function MemoryGame({ onClose }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  // Inicializar el juego
  useEffect(() => {
    startNewGame();
  }, []);

  function startNewGame() {
    // Tomar 8 emojis al azar
    const shuffled = [...EMOJI_POOL].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 8);

    // Duplicar cada uno y mezclar
    const deck: Card[] = [];
    selected.forEach((emoji, idx) => {
      deck.push({ id: idx * 2, emoji, matched: false });
      deck.push({ id: idx * 2 + 1, emoji, matched: false });
    });
    deck.sort(() => Math.random() - 0.5);

    setCards(deck);
    setFlipped([]);
    setMoves(0);
    setMatches(0);
    setGameWon(false);
  }

  function handleCardClick(card: Card) {
    // Ignorar si:
    // - la carta ya está emparejada
    // - la carta ya está volteada
    // - ya hay 2 cartas volteadas
    if (card.matched) return;
    if (flipped.includes(card.id)) return;
    if (flipped.length === 2) return;

    const newFlipped = [...flipped, card.id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);

      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // ¡Match!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, matched: true } : c
            )
          );
          setMatches((m) => m + 1);
          setFlipped([]);
        }, 500);
      } else {
        // No es match
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  }

  // Detectar victoria
  useEffect(() => {
    if (matches === 8 && cards.length > 0) {
      setGameWon(true);
    }
  }, [matches, cards.length]);

  const bestScore = useMemo(() => {
    const saved = localStorage.getItem('pequemundo_memory_best');
    return saved ? Number(saved) : null;
  }, []);

  useEffect(() => {
    if (gameWon) {
      const saved = localStorage.getItem('pequemundo_memory_best');
      const currentBest = saved ? Number(saved) : Infinity;
      if (moves < currentBest) {
        localStorage.setItem('pequemundo_memory_best', String(moves));
      }
    }
  }, [gameWon, moves]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Barra superior */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full bg-white/80 backdrop-blur font-black text-sm shadow-md">
            🎯 Movimientos: {moves}
          </div>
          <div className="px-4 py-2 rounded-full bg-white/80 backdrop-blur font-black text-sm shadow-md">
            ✅ Pares: {matches}/8
          </div>
          {bestScore !== null && (
            <div className="px-4 py-2 rounded-full bg-[#FFF3C4] font-black text-sm shadow-md text-[#AC3509]">
              🏆 Récord: {bestScore}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={startNewGame}
          className="px-4 py-2 rounded-full bg-[#FF7043] text-white font-black text-sm shadow-md hover:brightness-110 transition"
        >
          🔄 Reiniciar
        </button>
      </div>

      {/* Grid del memorama */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id) || card.matched;

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCardClick(card)}
              disabled={card.matched}
              className="aspect-square rounded-2xl flex items-center justify-center text-4xl sm:text-5xl transition-all duration-300 relative overflow-hidden"
              style={{
                backgroundColor: card.matched
                  ? '#ABF4AC'
                  : isFlipped
                  ? '#FFFFFF'
                  : '#FF7043',
                boxShadow: card.matched
                  ? '0 4px 0 #90D792, inset 0 2px 4px rgba(255,255,255,0.8)'
                  : isFlipped
                  ? '0 4px 0 #E0BFB6, inset 0 2px 4px rgba(255,255,255,0.9)'
                  : '0 6px 0 #AC3509, inset 0 3px 6px rgba(255,255,255,0.4)',
                transform: isFlipped ? 'scale(1.02)' : 'scale(1)',
                cursor: card.matched ? 'default' : 'pointer',
              }}
            >
              {isFlipped ? (
                <span className="select-none">{card.emoji}</span>
              ) : (
                <span className="text-white text-3xl select-none">?</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mensaje de victoria */}
      {gameWon && (
        <div
          className="mt-6 p-6 rounded-[2rem] text-center"
          style={{
            background: 'linear-gradient(135deg, #FFD54F, #FF7043)',
            boxShadow: '0 8px 16px rgba(172,53,9,0.3)',
          }}
        >
          <div className="text-5xl mb-2">🎉</div>
          <p className="text-2xl font-black text-white mb-1">
            ¡Lo lograste!
          </p>
          <p className="text-sm font-bold text-white/90">
            Terminaste en {moves} movimientos
            {bestScore !== null && moves <= bestScore && ' • ¡Nuevo récord!'}
          </p>
          <button
            type="button"
            onClick={startNewGame}
            className="mt-4 px-6 py-3 rounded-full bg-white text-[#AC3509] font-black shadow-lg hover:scale-105 transition"
          >
            Jugar otra vez
          </button>
        </div>
      )}

      {onClose && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-bold text-white/80 hover:text-white underline"
          >
            ← Volver a la zona de juegos
          </button>
        </div>
      )}
    </div>
  );
}