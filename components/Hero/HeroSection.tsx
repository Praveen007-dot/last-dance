'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ParticleField from './ParticleField';
import { stopAllVoices } from '@/hooks/useCartesiaSpeech';

interface HeroSectionProps {
  onEnter: () => void;
}

export default function HeroSection({ onEnter }: HeroSectionProps) {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const audio = new Audio('/audio/voices/landing-intro.mp3');
    audio.volume = 1;
    audioRef.current = audio;

    audio.onplay = () => {
      setIsPlayingVoice(true);
      window.dispatchEvent(new CustomEvent('voice-playback-state', { detail: { isPlaying: true } }));
    };

    audio.onended = () => {
      setIsPlayingVoice(false);
      window.dispatchEvent(new CustomEvent('voice-playback-state', { detail: { isPlaying: false } }));
    };

    audio.onpause = () => {
      setIsPlayingVoice(false);
      window.dispatchEvent(new CustomEvent('voice-playback-state', { detail: { isPlaying: false } }));
    };

    audio.onerror = () => {
      if (audioRef.current && audioRef.current.src.includes('landing-intro.mp3')) {
        audioRef.current.src = '/audio/voices/landing-welcome.mp3';
        audioRef.current.load();
      } else {
        setIsPlayingVoice(false);
        window.dispatchEvent(new CustomEvent('voice-playback-state', { detail: { isPlaying: false } }));
      }
    };

    // Auto-attempt playback after hero entrance animation
    const timer = setTimeout(() => {
      if (!hasStartedRef.current && audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            hasStartedRef.current = true;
            setIsPlayingVoice(true);
          })
          .catch(() => {
            // Autoplay blocked by browser policy until user gesture
          });
      }
    }, 1200);

    const handleGesture = () => {
      if (!hasStartedRef.current && audioRef.current) {
        const promise = audioRef.current.play();
        if (promise !== undefined) {
          promise
            .then(() => {
              hasStartedRef.current = true;
              setIsPlayingVoice(true);
            })
            .catch(() => {});
        }
      }
    };

    window.addEventListener('click', handleGesture, { once: true, passive: true });
    window.addEventListener('touchstart', handleGesture, { once: true, passive: true });
    window.addEventListener('keydown', handleGesture, { once: true, passive: true });
    window.addEventListener('pointerdown', handleGesture, { once: true, passive: true });

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      stopAllVoices();
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('pointerdown', handleGesture);
    };
  }, []);

  const handleEnter = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    stopAllVoices();
    window.dispatchEvent(new CustomEvent('voice-playback-state', { detail: { isPlaying: false } }));
    onEnter();
  };

  const toggleVoice = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlayingVoice) {
      audioRef.current.pause();
      setIsPlayingVoice(false);
    } else {
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => {
          hasStartedRef.current = true;
          setIsPlayingVoice(true);
        })
        .catch(() => {});
    }
  };

  return (
    <motion.section
      className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-y-auto overflow-x-hidden py-14 px-4"
      style={{ background: 'var(--bg-dark)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <ParticleField />

      {/* HUD corner decorations (fixed or absolute) */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-8 h-8 sm:w-12 sm:h-12 border-l-2 border-t-2 border-green-400/30 pointer-events-none" />
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-12 sm:h-12 border-r-2 border-t-2 border-green-400/30 pointer-events-none" />
      <div className="absolute bottom-10 left-3 sm:bottom-12 sm:left-4 w-8 h-8 sm:w-12 sm:h-12 border-l-2 border-b-2 border-green-400/30 pointer-events-none" />
      <div className="absolute bottom-10 right-3 sm:bottom-12 sm:right-4 w-8 h-8 sm:w-12 sm:h-12 border-r-2 border-b-2 border-green-400/30 pointer-events-none" />

      {/* Top status bar */}
      <motion.div
        className="absolute top-4 sm:top-6 left-0 right-0 flex justify-between items-center px-4 sm:px-8 font-mono-hud text-[10px] sm:text-xs text-green-400/50 tracking-wider pointer-events-none"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span>TRIBUTE SYSTEM ONLINE</span>
        <span className="hidden xs:inline">FINAL YEAR // 2024–25</span>
      </motion.div>

      {/* Main content - perfectly centered and scaled with clamp */}
      <div className="relative z-10 text-center px-3 sm:px-6 max-w-4xl mx-auto my-auto flex flex-col items-center">
        {/* Pre-title */}
        <motion.div
          className="font-mono-hud text-[10px] sm:text-xs md:text-sm tracking-[0.25em] sm:tracking-[0.4em] text-green-400/60 mb-3 sm:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          STUDENT TRIBUTE // PRISM DEGREE COLLEGE
        </motion.div>

        {/* LAST DANCE - fluid responsive sizing */}
        <motion.h1
          className="font-orbitron font-black tracking-widest leading-none mb-2 sm:mb-4"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
        >
          <span
            className="block text-glow-green"
            style={{
              fontSize: 'clamp(2.5rem, 11vw, 7.5rem)',
              letterSpacing: '0.12em',
              lineHeight: 1.05,
            }}
          >
            LAST DANCE
          </span>
        </motion.h1>

        {/* Divider */}
        <motion.div
          className="flex items-center justify-center gap-3 sm:gap-4 my-3 sm:my-5 w-full max-w-xs sm:max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <div className="h-px flex-1 bg-green-400/30" />
          <span className="font-mono-hud text-xs text-green-400/40 tracking-widest">◆</span>
          <div className="h-px flex-1 bg-green-400/30" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="font-orbitron text-xs sm:text-sm md:text-base tracking-[0.15em] sm:tracking-[0.2em] text-green-400/80 mb-2 sm:mb-3 px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          Our Final Year. Their Last Bell. Our Tribute.
        </motion.p>

        {/* Supporting quote */}
        <motion.p
          className="font-mono-hud text-[11px] sm:text-xs md:text-sm text-green-400/50 max-w-md mx-auto leading-relaxed mb-4 sm:mb-6 px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          &quot;Before we leave these classrooms,
          <br />
          there&apos;s one last story we need to tell.&quot;
        </motion.p>

        {/* Voiceover control badge */}
        <motion.div
          className="mb-5 sm:mb-7 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9, duration: 0.8 }}
        >
          <motion.button
            onClick={toggleVoice}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 text-[11px] sm:text-xs font-mono-hud transition-all cursor-pointer rounded-full border"
            style={{
              background: isPlayingVoice ? 'rgba(0, 255, 157, 0.18)' : 'rgba(3, 19, 38, 0.85)',
              borderColor: isPlayingVoice ? '#00ff9d' : 'rgba(0, 255, 157, 0.35)',
              color: isPlayingVoice ? '#00ff9d' : 'rgba(0, 255, 157, 0.8)',
              boxShadow: isPlayingVoice ? '0 0 16px rgba(0, 255, 157, 0.35)' : 'none',
              backdropFilter: 'blur(8px)',
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            aria-label="Toggle intro narration"
          >
            <span className="text-xs sm:text-sm">{isPlayingVoice ? '⏹' : '🔊'}</span>
            <span className="tracking-wider">
              {isPlayingVoice ? 'INTRO: PLAYING' : '🔊 PLAY INTRO VOICE'}
            </span>
          </motion.button>
        </motion.div>

        {/* CTA Button */}
        <div>
          <motion.button
            onClick={handleEnter}
            className="relative group font-orbitron text-xs sm:text-sm md:text-base tracking-[0.2em] sm:tracking-[0.25em] px-6 sm:px-10 py-3 sm:py-4 border-hud corner-cut cursor-pointer"
            style={{
              background: 'rgba(0, 255, 157, 0.08)',
              border: '1.5px solid #00ff9d',
              color: 'var(--hud-green)',
              boxShadow: '0 0 20px rgba(0,255,157,0.25)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            whileHover={{ scale: 1.04, backgroundColor: 'rgba(0,255,157,0.18)' }}
            whileTap={{ scale: 0.97 }}
            aria-label="Enter the tribute experience"
          >
            <span className="relative z-10 font-bold">ENTER THE TRIBUTE →</span>
          </motion.button>
        </div>

        {/* Scroll / click hint */}
        <motion.p
          className="mt-4 sm:mt-6 font-mono-hud text-[10px] sm:text-xs text-green-400/30 tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          [ CLICK TO BEGIN ]
        </motion.p>
      </div>

      {/* Bottom ticker */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-7 sm:h-8 border-t border-green-400/10 flex items-center overflow-hidden"
        style={{ background: 'rgba(0,0,0,0.5)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      >
        <motion.span
          className="font-mono-hud text-[10px] sm:text-xs text-green-400/35 whitespace-nowrap px-4 tracking-wider"
          animate={{ x: ['100vw', '-200%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        >
          FINAL YEAR TRIBUTE // TEACHERS DAY // PRISM DEGREE COLLEGE VISAKHAPATNAM //
          DEDICATED TO THE LEGENDS WHO SHAPED US // LAST DANCE MEMORIAL // &nbsp;
        </motion.span>
      </motion.div>
    </motion.section>
  );
}
