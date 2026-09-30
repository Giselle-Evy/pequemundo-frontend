import { useContext } from 'react';
import { MusicContext } from '../contexts/MusicContext';

export function useBackgroundMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) {
    throw new Error('useBackgroundMusic debe usarse dentro de <MusicProvider>');
  }
  return ctx;
}