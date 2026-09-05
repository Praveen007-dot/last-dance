'use client';

import { useEffect, useRef } from 'react';

/**
 * Background Audio Controller
 * Plays the Marvel theme music continuously in the background
 * without rendering any visual UI display button on the screen.
 * Volume is reduced (~70% lower default) and smoothly ducks even lower
 * whenever teacher card voiceovers play at 100% volume.
 */
export default function AudioController() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Default theme music volume: 0.25 (reduced ~70-75% from 1.0)
  // When card voiceover plays: ducks down to 0.07 so voice is 100% crisp and clear
  const TARGET_BASE_VOLUME = 0.25;
  const TARGET_DUCKED_VOLUME = 0.07;

  useEffect(() => {
    const audio = new Audio('/audio/marvel_theme.mp3');
    audio.loop = true;
    audio.volume = TARGET_BASE_VOLUME;
    audioRef.current = audio;

    const smoothSetVolume = (targetVol: number) => {
      if (!audioRef.current) return;
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

      fadeIntervalRef.current = setInterval(() => {
        if (!audioRef.current) {
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
          return;
        }
        const current = audioRef.current.volume;
        const diff = targetVol - current;
        if (Math.abs(diff) < 0.02) {
          audioRef.current.volume = targetVol;
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        } else {
          audioRef.current.volume = Math.max(0, Math.min(1, current + Math.sign(diff) * 0.02));
        }
      }, 25);
    };

    // Listen for voiceover active states from useCartesiaSpeech
    const handleVoiceState = (e: Event) => {
      const customEvent = e as CustomEvent<{ isPlaying: boolean }>;
      const isVoicePlaying = customEvent.detail?.isPlaying ?? false;
      smoothSetVolume(isVoicePlaying ? TARGET_DUCKED_VOLUME : TARGET_BASE_VOLUME);
    };

    window.addEventListener('voice-playback-state', handleVoiceState);

    // Fallback if needed
    audio.onerror = () => {
      if (audioRef.current && audioRef.current.src.includes('marvel_theme.mp3')) {
        audioRef.current.src = '/audio/bgm.mp3';
        audioRef.current.load();
        audioRef.current.play().catch(() => {});
      }
    };

    // Attempt autoplay immediately
    const tryPlay = () => {
      if (!audioRef.current) return;
      audioRef.current.play().catch(() => {
        // Autoplay policy prevented immediate playback; wait for first user gesture
      });
    };

    tryPlay();

    // Start playback on first interaction if initial autoplay was blocked by browser
    const handleGesture = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    };

    window.addEventListener('click', handleGesture, { once: true, passive: true });
    window.addEventListener('touchstart', handleGesture, { once: true, passive: true });
    window.addEventListener('keydown', handleGesture, { once: true, passive: true });
    window.addEventListener('pointerdown', handleGesture, { once: true, passive: true });

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      audio.pause();
      audioRef.current = null;
      window.removeEventListener('voice-playback-state', handleVoiceState);
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('pointerdown', handleGesture);
    };
  }, []);

  // No visible UI button ("cut marvel display")
  return null;
}
