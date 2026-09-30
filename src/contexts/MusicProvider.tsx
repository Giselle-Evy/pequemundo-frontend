import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { MusicContext } from './MusicContext';

const STORAGE_KEY = 'pequemundo_music_muted';

export function MusicProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEY) !== 'muted';
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<number | null>(null);
  const stepRef = useRef(0);

  const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
  const sequence = [0, 2, 3, 4, 3, 2, 1, 0, 2, 4, 5, 4, 2, 0];

  const stopSynth = useCallback(() => {
    if (synthIntervalRef.current !== null) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  }, []);

  const startSynth = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    if (synthIntervalRef.current !== null) return;

    const playNext = () => {
      const c = audioCtxRef.current;
      if (!c) return;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      const freqIndex = sequence[stepRef.current % sequence.length];
      osc.frequency.setValueAtTime(notes[freqIndex], c.currentTime);
      gain.gain.setValueAtTime(0.001, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, c.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + 0.65);
      stepRef.current += 1;
    };

    playNext();
    synthIntervalRef.current = window.setInterval(playNext, 420);
  }, [notes, sequence]);

  useEffect(() => {
    if (audioRef.current) return;

    const audio = new Audio('/audio/welcome.mp3');
    audio.loop = true;
    audio.volume = 0.25;
    audio.preload = 'auto';
    audioRef.current = audio;

    const onError = () => {
      console.warn('No se pudo cargar welcome.mp3, se usará la melodía generada.');
    };
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('error', onError);
      audio.pause();
      audioRef.current = null;
      stopSynth();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playMusic = useCallback(async () => {
    const audio = audioRef.current;
    if (audio) {
      try {
        await audio.play();
        return;
      } catch {
        // falla el mp3 → synth
      }
    }
    startSynth();
  }, [startSynth]);

  const pauseMusic = useCallback(() => {
    audioRef.current?.pause();
    stopSynth();
  }, [stopSynth]);

  const toggle = useCallback(() => {
    setIsPlaying((prev) => {
      const next = !prev;
      queueMicrotask(() => {
        if (next) {
          playMusic();
          localStorage.setItem(STORAGE_KEY, 'on');
        } else {
          pauseMusic();
          localStorage.setItem(STORAGE_KEY, 'muted');
        }
      });
      return next;
    });
  }, [playMusic, pauseMusic]);

  return (
    <MusicContext.Provider value={{ isPlaying, toggle }}>
      {children}
    </MusicContext.Provider>
  );
}