import { useEffect, useRef, useState } from 'react';

export function useBackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<number | null>(null);

  // Notas pentatónicas para la melodía generada
  const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
  const sequence = [0, 2, 3, 4, 3, 2, 1, 0, 2, 4, 5, 4, 2, 0];
  const stepRef = useRef(0);

  useEffect(() => {
    const audio = new Audio('/audio/welcome.mp3');
    audio.loop = true;
    audio.volume = 0.25;
    audio.preload = 'auto';
    audioRef.current = audio;

    audio.addEventListener('error', () => {
      console.warn('No se pudo cargar welcome.mp3, se usará la melodía generada.');
    });

    return () => {
      audio.pause();
      stopSynth();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startSynth() {
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    if (!audioCtxRef.current) return;

    const playNext = () => {
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';

      const freqIndex = sequence[stepRef.current % sequence.length];
      osc.frequency.setValueAtTime(notes[freqIndex], ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.65);
      stepRef.current += 1;
    };

    playNext();
    synthIntervalRef.current = window.setInterval(playNext, 420);
  }

  function stopSynth() {
    if (synthIntervalRef.current !== null) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  }

  async function toggle() {
    if (isPlaying) {
      audioRef.current?.pause();
      stopSynth();
      setIsPlaying(false);
    } else {
      let mp3Ok = false;
      const audio = audioRef.current;
      if (audio) {
        try {
          await audio.play();
          mp3Ok = true;
        } catch {
          mp3Ok = false;
        }
      }
      if (!mp3Ok) {
        startSynth();
      }
      setIsPlaying(true);
    }
  }

  return { isPlaying, toggle };
}