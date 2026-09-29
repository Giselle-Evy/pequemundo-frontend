const letters: { char: string; color: string }[] = [
  { char: 'P', color: '#FF5722' },
  { char: 'e', color: '#FFB300' },
  { char: 'q', color: '#43A047' },
  { char: 'u', color: '#039BE5' },
  { char: 'e', color: '#8E24AA' },
  { char: 'M', color: '#FF5722' },
  { char: 'u', color: '#43A047' },
  { char: 'n', color: '#FFB300' },
  { char: 'd', color: '#0288D1' },
  { char: 'o', color: '#E91E63' },
];

export default function PequeMundoWordmark() {
  return (
    <div className="flex items-center justify-center text-3xl sm:text-4xl font-extrabold font-fredoka tracking-tight leading-none select-none py-1">
      {letters.map((letter, index) => (
        <span
          key={index}
          className="clay-letter"
          style={{
            color: letter.color,
            marginLeft: letter.char === 'M' ? '0.375rem' : undefined,
          }}
        >
          {letter.char}
        </span>
      ))}
    </div>
  );
}