import type { ReactNode } from 'react';

interface StatsCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  badge: string;
  accentColor: string;
  accentBg: string;
  accentShadow: string;
}

export default function StatsCard({
  icon,
  value,
  label,
  badge,
  accentColor,
  accentBg,
  accentShadow,
}: StatsCardProps) {
  return (
    <div
      className="bg-white rounded-[2rem] p-6 flex flex-col items-center text-center relative overflow-hidden"
      style={{
        boxShadow: `inset 0 4px 8px rgba(255,255,255,0.85), inset 0 -4px 6px rgba(93,64,55,0.06), 0 14px 28px -6px rgba(93,64,55,0.1)`,
      }}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
        style={{
          backgroundColor: accentBg,
          color: accentColor,
          boxShadow: `inset 0 3px 5px rgba(255,255,255,0.9), 0 6px 0 ${accentShadow}`,
        }}
      >
        {icon}
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-black" style={{ color: accentColor }}>
          {value}
        </span>
      </div>
      <span className="text-lg font-extrabold text-[#2C160E] mt-1">{label}</span>

      <div
        className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
        style={{ backgroundColor: accentBg, color: accentColor }}
      >
        {badge}
      </div>
    </div>
  );
}