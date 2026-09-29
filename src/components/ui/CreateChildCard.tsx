interface CreateChildCardProps {
  onCreate: () => void;
}

export default function CreateChildCard({ onCreate }: CreateChildCardProps) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onCreate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onCreate();
        }
      }}
      className="group relative flex flex-col items-center justify-center text-center p-5 rounded-[2rem] bg-white/80 hover:bg-white shadow-[0_16px_32px_-8px_rgba(93,64,55,0.08),inset_0_3px_5px_rgba(255,255,255,0.9)] hover:-translate-y-2 hover:rotate-1 transition-all duration-300 cursor-pointer min-h-[340px]"
    >
      <div className="w-24 h-24 rounded-full bg-[#58CAFE] text-white flex items-center justify-center shadow-[0_8px_0_#006688,inset_0_4px_6px_rgba(255,255,255,0.6)] group-hover:scale-110 group-active:translate-y-1 transition-all duration-200 mb-4">
        <span className="text-5xl font-black leading-none">+</span>
      </div>
      <h2 className="text-xl font-extrabold text-[#006688]">Agregar perfil</h2>
      <p className="text-sm font-bold text-[#59413A] mt-1">
        Crea un nuevo explorador
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-[#AC3509] bg-[#FFDBD0] px-4 py-1 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.6)]">
        ✨ Nuevo Amigo
      </span>
    </article>
  );
}