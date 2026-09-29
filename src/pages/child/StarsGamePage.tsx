import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../../components/layout/AnimatedBackground';
import ChildTopBar from '../../components/layout/ChildTopBar';
import StarCatchGame from '../../components/ui/StarCatchGame';

export default function StarsGamePage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen font-nunito flex flex-col relative overflow-x-hidden"
      style={{
        background:
          'linear-gradient(180deg, #1A1B4B 0%, #2D1B69 40%, #4A2C7A 70%, #1E1B4B 100%)',
      }}
    >
      <AnimatedBackground />

      <ChildTopBar backTo="/games" backLabel="Volver a juegos" />

      <main className="flex-1 w-full relative z-10 pt-4 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Título */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">⭐</div>
            <h1 className="text-3xl sm:text-4xl font-black font-baloo text-[#FFD54F]">
              Atrapa Estrellas
            </h1>
            <p className="text-base font-bold text-[#E0E7FF] mt-2">
              Toca las estrellas antes de que caigan. ¡Tienes 60 segundos!
            </p>
          </div>

          <StarCatchGame onClose={() => navigate('/games')} />
        </div>
      </main>
    </div>
  );
}