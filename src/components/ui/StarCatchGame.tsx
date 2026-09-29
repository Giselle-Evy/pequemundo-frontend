import { useEffect, useRef, useState } from 'react';

interface StarCatchGameProps {
  onClose?: () => void;
}

interface Star {
  id: number;
  x: number; // porcentaje 0-100
  y: number; // porcentaje 0-100
  emoji: string;
  size: number;
  caught: boolean;
}

const STAR_EMOJIS = ['⭐', '🌟', '✨', '💫'];
const GAME_DURATION = 60; // segundos

export default function StarCatchGame({ onClose }: StarCatchGameProps) {
  const [stars, setStars] = useState<Star[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready');
  const [bestScore, setBestScore] = useState<number | null>(null);

  const starIdRef = useRef(0);
  const spawnIntervalRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  // Cargar récord
  useEffect(() => {
    const saved = localStorage.getItem('pequemundo_stars_best');
    if (saved) setBestScore(Number(saved));
  }, []);

  // Iniciar juego
  function startGame() {
    setStars([]);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameState('playing');
    starIdRef.current = 0;
  }

  // Loop de spawn de estrellas
  useEffect(() => {
    if (gameState !== 'playing') return;

    spawnIntervalRef.current = window.setInterval(() => {
      setStars((prev) => {
        // Filtrar estrellas que ya se salieron de la pantalla
        const active = prev.filter((s) => !s.caught && s.y < 110);

        // Crear nueva estrella
        const newStar: Star = {
          id: starIdRef.current++,
          x: Math.random() * 85 + 5, // 5% a 90%
          y: -10,
          emoji: STAR_EMOJIS[Math.floor(Math.random() * STAR_EMOJIS.length)],
          size: Math.random() * 20 + 40, // 40-60px
          caught: false,
        };

        return [...active, newStar];
      });
    }, 800);

    return () => {
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
    };
  }, [gameState]);

  // Loop de movimiento de estrellas (caída)
  useEffect(() => {
    if (gameState !== 'playing') return;

    const moveInterval = window.setInterval(() => {
      setStars((prev) =>
        prev.map((s) => (s.caught ? s : { ...s, y: s.y + 1.5 }))
      );
    }, 50);

    return () => clearInterval(moveInterval);
  }, [gameState]);

  // Loop del timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    timerIntervalRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameState('finished');
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [gameState]);

  // Al terminar, guardar récord
  useEffect(() => {
    if (gameState === 'finished') {
      if (bestScore === null || score > bestScore) {
        localStorage.setItem('pequemundo_stars_best', String(score));
        setBestScore(score);
      }
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  function handleCatch(starId: number) {
    if (gameState !== 'playing') return;

    setStars((prev) =>
      prev.map((s) => (s.id === starId ? { ...s, caught: true } : s))
    );
    setScore((s) => s + 1);
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Barra superior */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full bg-white/80 backdrop-blur font-black text-sm shadow-md">
            ⏱️ {timeLeft}s
          </div>
          <div className="px-4 py-2 rounded-full bg-[#FFF3C4] font-black text-sm shadow-md text-[#AC3509]">
            ⭐ {score}
          </div>
          {bestScore !== null && (
            <div className="px-4 py-2 rounded-full bg-[#C2E8FF] font-black text-sm shadow-md text-[#006688]">
              🏆 Récord: {bestScore}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={startGame}
          className="px-4 py-2 rounded-full bg-[#FF7043] text-white font-black text-sm shadow-md hover:brightness-110 transition"
        >
          🔄 {gameState === 'playing' ? 'Reiniciar' : 'Jugar'}
        </button>
      </div>

      {/* Área de juego */}
      <div
        className="relative w-full rounded-[2rem] overflow-hidden"
        style={{
          height: '500px',
          background:
            'linear-gradient(180deg, #1A1B4B 0%, #2D1B69 50%, #4A2C7A 100%)',
          boxShadow: '0 8px 24px rgba(30, 27, 75, 0.4), inset 0 2px 6px rgba(255,255,255,0.1)',
        }}
      >
        {/* Estrellas de fondo */}
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={`bg-${i}`}
            className="absolute rounded-full bg-white/40"
            style={{
              width: '2px',
              height: '2px',
              top: `${(i * 17) % 100}%`,
              left: `${(i * 23) % 100}%`,
            }}
          />
        ))}

        {/* Estado listo */}
        {gameState === 'ready' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <div className="text-7xl mb-4 animate-bounce">⭐</div>
            <h2 className="text-2xl font-black text-white mb-2">
              ¡Atrapa las Estrellas!
            </h2>
            <p className="text-white/80 font-bold mb-6 max-w-xs">
              Toca las estrellas antes de que caigan. ¡Tienes 60 segundos!
            </p>
            <button
              type="button"
              onClick={startGame}
              className="px-8 py-4 rounded-full bg-[#FFD54F] text-[#AC3509] font-black text-lg shadow-lg hover:scale-105 transition"
            >
              🎮 ¡Comenzar!
            </button>
          </div>
        )}

        {/* Estrellas cayendo */}
        {gameState === 'playing' &&
          stars.map((star) => (
            <button
              key={star.id}
              type="button"
              onClick={() => handleCatch(star.id)}
              className="absolute transition-all duration-100"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                fontSize: `${star.size}px`,
                transform: star.caught ? 'scale(1.5)' : 'scale(1)',
                opacity: star.caught ? 0 : 1,
                pointerEvents: star.caught ? 'none' : 'auto',
                filter: 'drop-shadow(0 0 12px rgba(255, 213, 79, 0.8))',
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                padding: 0,
              }}
            >
              {star.emoji}
            </button>
          ))}

        {/* Estado terminado */}
        {gameState === 'finished' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/40 backdrop-blur-sm">
            <div className="text-7xl mb-4">🏆</div>
            <h2 className="text-3xl font-black text-white mb-2">
              ¡Terminaste!
            </h2>
            <p className="text-4xl font-black text-[#FFD54F] mb-4">
              {score} estrellas
            </p>
            {bestScore !== null && score >= bestScore && score > 0 && (
              <p className="text-lg font-black text-white mb-4">
                🎉 ¡Nuevo récord!
              </p>
            )}
            <button
              type="button"
              onClick={startGame}
              className="px-8 py-4 rounded-full bg-[#FFD54F] text-[#AC3509] font-black text-lg shadow-lg hover:scale-105 transition"
            >
              Jugar otra vez
            </button>
          </div>
        )}
      </div>

      {onClose && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-bold text-[#59413A] hover:text-[#AC3509] underline"
          >
            ← Volver a la zona de juegos
          </button>
        </div>
      )}
    </div>
  );
}