import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../../components/layout/AnimatedBackground';
import ChildTopBar from '../../components/layout/ChildTopBar';
import MemoryGame from '../../components/ui/MemoryGame';

export default function MemoryGamePage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen font-nunito flex flex-col relative overflow-x-hidden"
      style={{
        background:
          'linear-gradient(180deg, #70D6FF 0%, #BBE7FE 40%, #FFF3C4 85%, #FEF9E7 100%)',
      }}
    >
      <AnimatedBackground />

      <ChildTopBar backTo="/games" backLabel="Volver a juegos" />

      <main className="flex-1 w-full relative z-10 pt-4 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Título */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">🧠</div>
            <h1 className="text-3xl sm:text-4xl font-black font-baloo text-[#006688]">
              Memorama de Animales
            </h1>
            <p className="text-base font-bold text-[#59413A] mt-2">
              Encuentra todos los pares. ¡No hay prisa, juega tranquilo!
            </p>
          </div>

          <MemoryGame onClose={() => navigate('/games')} />
        </div>
      </main>
    </div>
  );
}