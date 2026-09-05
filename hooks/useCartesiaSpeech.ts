'use client';

import { useState, useCallback } from 'react';

// In-memory cache for synthesized audio Blobs
const audioCache = new Map<string, string>();
const preloadedAudioElements = new Map<string, HTMLAudioElement>();

export function preloadAllVoices() {
  if (typeof window === 'undefined') return;
  const files = [
    '/audio/voices/landing-intro.mp3',
    '/audio/voices/final-tribute.mp3',
    ...Array.from({ length: 7 }, (_, i) => `/audio/voices/detect-teacher-${String(i + 1).padStart(2, '0')}.mp3`),
    ...Array.from({ length: 7 }, (_, i) => `/audio/voices/profile-teacher-${String(i + 1).padStart(2, '0')}.mp3`),
  ];

  files.forEach((src) => {
    if (!preloadedAudioElements.has(src)) {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = src;
      audio.load();
      preloadedAudioElements.set(src, audio);
    }
  });
}

// Global singleton for currently playing voice audio
let globalActiveAudio: HTMLAudioElement | null = null;
let currentPlayGeneration = 0;

function notifyVoiceActive(isActive: boolean) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('voice-playback-state', { detail: { isPlaying: isActive } })
    );
  }
}

export function stopAllVoices() {
  currentPlayGeneration++;
  if (globalActiveAudio) {
    try {
      const audio = globalActiveAudio;
      globalActiveAudio = null;
      audio.pause();
      audio.currentTime = 0;
    } catch {}
  }
  notifyVoiceActive(false);
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

// Built-in browser speech synthesis fallback
function speakWithBrowserTTS(
  text: string,
  onEnd?: () => void,
  onError?: () => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onError?.();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 0.95;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('David') ||
            v.name.includes('Mark') ||
            v.name.includes('Guy'))
      ) || voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      onEnd?.();
    };

    utterance.onerror = (e) => {
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('[Browser SpeechSynthesis error]:', e);
      }
      onError?.();
    };

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('[Browser SpeechSynthesis failure]:', e);
    onError?.();
  }
}

export function useCartesiaSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const stop = useCallback(() => {
    stopAllVoices();
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  const speak = useCallback(
    async (
      text: string,
      options?: { voiceId?: string; language?: string; audioSrc?: string; onEnd?: () => void }
    ) => {
      stopAllVoices();
      const thisGeneration = ++currentPlayGeneration;
      setIsLoading(true);

      const fallbackToWebSpeech = () => {
        if (thisGeneration !== currentPlayGeneration) return;
        setIsLoading(false);
        setIsPlaying(true);
        speakWithBrowserTTS(
          text,
          () => {
            if (thisGeneration === currentPlayGeneration) {
              setIsPlaying(false);
              options?.onEnd?.();
            }
          },
          () => {
            if (thisGeneration === currentPlayGeneration) {
              setIsPlaying(false);
              options?.onEnd?.();
            }
          }
        );
      };

      try {
        let audioUrl = options?.audioSrc;
        let audio: HTMLAudioElement;

        if (audioUrl && preloadedAudioElements.has(audioUrl)) {
          audio = preloadedAudioElements.get(audioUrl)!;
          audio.currentTime = 0;
        } else if (audioUrl) {
          audio = new Audio(audioUrl);
          preloadedAudioElements.set(audioUrl, audio);
        } else {
          const voiceId =
            options?.voiceId ||
            process.env.NEXT_PUBLIC_CARTESIA_VOICE_ID ||
            '8e95b430-ecc3-49ab-b943-8313287c1c59';
          const language = options?.language || 'en';
          const cacheKey = `${voiceId}_${language}_${text.trim()}`;

          audioUrl = audioCache.get(cacheKey);

          if (!audioUrl) {
            const res = await fetch('/api/tts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                transcript: text,
                voiceId,
                language,
              }),
            });

            if (!res.ok) {
              throw new Error(`Cartesia TTS failed with status ${res.status}`);
            }

            const blob = await res.blob();
            audioUrl = URL.createObjectURL(blob);
            audioCache.set(cacheKey, audioUrl);
          }

          audio = new Audio(audioUrl);
        }

        if (thisGeneration !== currentPlayGeneration) return;

        audio.volume = 1.0; // Voiceover at 100% volume
        globalActiveAudio = audio;

        audio.onplay = () => {
          if (thisGeneration !== currentPlayGeneration) return;
          setIsLoading(false);
          setIsPlaying(true);
          notifyVoiceActive(true);
        };

        audio.onpause = () => {
          if (globalActiveAudio === audio) {
            notifyVoiceActive(false);
          }
        };

        audio.onended = () => {
          if (thisGeneration !== currentPlayGeneration) return;
          setIsPlaying(false);
          if (globalActiveAudio === audio) {
            globalActiveAudio = null;
          }
          notifyVoiceActive(false);
          options?.onEnd?.();
        };

        audio.onerror = () => {
          if (thisGeneration !== currentPlayGeneration) return;
          if (globalActiveAudio === audio) {
            globalActiveAudio = null;
          }
          notifyVoiceActive(false);
          fallbackToWebSpeech();
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            // Ignore AbortError when user moved to next screen or stopped voice
            if (err?.name === 'AbortError') {
              return;
            }
            console.warn('[Cartesia Speech] Audio element play error, falling back to Web Speech:', err);
            if (thisGeneration === currentPlayGeneration) {
              if (globalActiveAudio === audio) {
                globalActiveAudio = null;
              }
              fallbackToWebSpeech();
            }
          });
        }
      } catch (err) {
        if (thisGeneration !== currentPlayGeneration) return;
        console.warn('[Cartesia Speech] Playback error, switching to Web Speech:', err);
        if (globalActiveAudio) {
          globalActiveAudio = null;
        }
        fallbackToWebSpeech();
      }
    },
    []
  );

  return {
    speak,
    stop,
    isPlaying,
    isLoading,
  };
}
