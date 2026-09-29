interface SubscriptionRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  freeUsed?: number;
  freeLimit?: number;
}

export default function SubscriptionRequiredModal({
  isOpen,
  onClose,
  onSubscribe,
  freeUsed = 3,
  freeLimit = 3,
}: SubscriptionRequiredModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full bg-white rounded-[2.5rem] p-8 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-6xl mb-4">🌟</div>

        <h2 className="text-2xl font-black font-baloo text-[#006688] mb-2">
          ¡Se acabaron los ejercicios gratis!
        </h2>

        <p className="text-sm font-bold text-[#59413A] mb-6">
          Ya usaste {freeUsed} de {freeLimit} ejercicios gratis. Activa
          PequeMundo Premium para seguir aprendiendo sin límites.
        </p>

        <div className="bg-[#FFF3C4] rounded-2xl p-4 mb-6 text-left">
          <p className="text-xs font-black text-[#AC3509] uppercase tracking-wider mb-3">
            PequeMundo Premium · $99 MXN / mes
          </p>
          <ul className="space-y-1.5 text-sm font-bold text-[#59413A]">
            <li>✅ Perfiles infantiles ilimitados</li>
            <li>✅ Todos los ejercicios y materias</li>
            <li>✅ Juegos y tienda de avatares</li>
            <li>✅ Sin anuncios</li>
          </ul>
        </div>

        <button
          type="button"
          onClick={onSubscribe}
          className="w-full py-4 rounded-full font-black text-white bg-[#FF7043] hover:brightness-110 active:translate-y-1 transition-all mb-3"
          style={{ boxShadow: '0 4px 0 #AC3509' }}
        >
          ✨ Activar Premium
        </button>

        <button
          type="button"
          onClick={onClose}
          className="text-xs font-bold text-[#59413A] hover:text-[#2C160E]"
        >
          Seguir explorando
        </button>
      </div>
    </div>
  );
}