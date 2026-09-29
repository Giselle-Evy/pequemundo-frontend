import { createContext } from 'react';

type Theme = 'day' | 'night';

export interface ThemeContextData {
  theme: Theme;
  toggleTheme: () => void;
  isNight: boolean;
}

export const ThemeContext = createContext<ThemeContextData | undefined>(undefined);