import { getEmojiForOption } from '../../data/emojis';

interface ExerciseOptionProps {
  letter: string;
  text: string;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}

export default function ExerciseOption({
  letter,
  text,
  selected,
  disabled,
  onSelect,
}: ExerciseOptionProps) {
  const emoji = getEmojiForOption(text);

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={`group relative flex flex-col items-center justify-between p-5 rounded-[2rem] transition-all duration-200 min-h-[240px] ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1'
      } ${selected ? '-translate-y-2' : ''}`}
      style={{
        backgroundColor: selected ? '#C2E8FF80' : '#FFFFFF',
        boxShadow: selected
          ? '0 16px 28px -4px rgba(0,102,136,0.25), inset 0 4px 8px rgba(255,255,255,0.9), 0 6px 0 #006688'
          : '0 12px 24px -6px rgba(93,64,55,0.08), inset 0 4px 6px rgba(255,255,255,0.8), inset 0 -4px 6px rgba(0,0,0,0.05), 0 6px 0 #E0BFB6',
      }}
    >
      {/* Letra y check */}
      <div className="w-full flex justify-between items-center mb-2">
        <span
          className="w-10 h-10 rounded-full flex items-center justify-center font-black text-base"
          style={{
            backgroundColor: selected ? '#FFDBD0' : '#FFF1ED',
            color: selected ? '#852300' : '#59413A',
            boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.7)',
          }}
        >
          {letter}
        </span>
        {selected && <span className="text-xl">✅</span>}
      </div>

      {/* Emoji */}
      <div className="my-auto py-2 flex flex-col items-center justify-center">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-inner transition-transform group-hover:scale-110"
          style={{ backgroundColor: '#FFF1ED' }}
        >
          <span className="select-none" role="img" aria-label={text}>
            {emoji}
          </span>
        </div>
        <span className="mt-3 text-lg font-black text-[#2C160E] text-center leading-tight">
          {text}
        </span>
      </div>
    </button>
  );
}