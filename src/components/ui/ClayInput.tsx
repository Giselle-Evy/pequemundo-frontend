import { forwardRef, useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface ClayInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: ReactNode;
  label?: string;
  rightLabel?: ReactNode;
  hint?: string;
}

const ClayInput = forwardRef<HTMLInputElement, ClayInputProps>(
  ({ icon, label, rightLabel, hint, type = 'text', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const effectiveType = isPassword && showPassword ? 'text' : type;

    return (
      <div className="space-y-1.5">
        {(label || rightLabel) && (
          <div className="flex items-center justify-between">
            {label && (
              <label className="block text-sm sm:text-base font-extrabold text-slate-700 font-fredoka">
                {label}
              </label>
            )}
            {rightLabel}
          </div>
        )}
        <div className="clay-input-wrapper flex items-center px-4 py-3 sm:py-3.5 gap-3">
          <span className="text-2xl select-none" aria-hidden="true">
            {icon}
          </span>
          <input
            ref={ref}
            type={effectiveType}
            className="w-full bg-transparent text-slate-800 font-bold placeholder-slate-400 focus:outline-none text-base sm:text-lg"
            style={{ minHeight: 28 }}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-[#4FC3F7]"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              <span className="text-xl select-none" aria-hidden="true">
                {showPassword ? '🙈' : '👁️'}
              </span>
            </button>
          )}
        </div>
        {hint && <p className="text-xs text-slate-400 px-1">{hint}</p>}
      </div>
    );
  }
);

ClayInput.displayName = 'ClayInput';

export default ClayInput;