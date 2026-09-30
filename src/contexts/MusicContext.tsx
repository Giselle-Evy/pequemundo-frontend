import { createContext } from 'react';

export interface MusicContextValue {
  isPlaying: boolean;
  toggle: () => void;
}

export const MusicContext = createContext<MusicContextValue | null>(null);