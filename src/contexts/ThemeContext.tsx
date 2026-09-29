import { useState } from 'react';
import type { ReactNode } from 'react';
import { ThemeContext } from './themeContextValue';

type Theme = 'day' | 'night';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'day';
  const saved = localStorage.getItem('pequemundo_theme');
  if (saved === 'night' || saved === 'day') {
    return saved;
  }
  return 'day';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  function toggleTheme() {
    const newTheme: Theme = theme === 'day' ? 'night' : 'day';
    setTheme(newTheme);
    localStorage.setItem('pequemundo_theme', newTheme);
  }

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, isNight: theme === 'night' }}
    >
      {children}
    </ThemeContext.Provider>
  );
}