'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Teacher } from '@/types/teacher';
import { useCartesiaSpeech } from '@/hooks/useCartesiaSpeech';

const DETECTION_STEPS = [
  { text: 'ANALYZING TARGET...', duration: 250 },
  { text: 'SCANNING SUBJECT PROFILE...', duration: 220 },
  { text: 'CROSS-REFERENCING DATABASE...', duration: 220 },
  { text: 'MATCH FOUND', duration: 180 },
  { text: 'TEACHER DETECTED', duration: 999999, final: true },
];

interface DetectionOverlayProps {
  teacher: Teacher;
  onComplete: () => void;
}

export default function DetectionOverlay({ teacher, onComplete }: DetectionOverlayProps) {
  const [stepIdx, setStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const { speak, stop } = useCartesiaSpeech();
  const completedRef = useRef(false);

  const handleProceed = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    stop();
    onComplete();
  };

  useEffect(() => {
    let current = 0;
    let progVal = 0;
    let timerId: NodeJS.Timeout | null = null;
    let fallbackTimerId: NodeJS.Timeout | null = null;
    let progInterval: NodeJS.Timeout | null = null;

    const runSteps = () => {
      if (completedRef.current) return;

      if (current >= DETECTION_STEPS.length - 1) {
        setShowFinal(true);
        setProgress(100);

        // Speak the detection announcement
        speak(`Teacher detected. ${teacher.name}`, {
          voiceId: '8e95b430-ecc3-49ab-b943-8313287c1c59',
          audioSrc: `/audio/voices/detect-${teacher.id}.mp3`,
          onEnd: () => {
            setTimeout(() => {
              if (!completedRef.current) {
                completedRef.current = true;
                onComplete();
              }
            }, 200);
          },
        });

        // Safety fallback timer if audio hangs
        fallbackTimerId = setTimeout(() => {
          if (!completedRef.current) {
            completedRef.current = true;
            stop();
            onComplete();
          }
        }, 5500);
        return;
      }

      setStepIdx(current);
      const targetProg = Math.round(((current + 1) / DETECTION_STEPS.length) * 100);

      progInterval = setInterval(() => {
        progVal += 4;
        setProgress((p) => Math.min(p + 4, targetProg));
        if (progVal >= targetProg && progInterval) clearInterval(progInterval);
      }, 15);

      timerId = setTimeout(() => {
        current++;
        runSteps();
      }, DETECTION_STEPS[current].duration);
    };

    runSteps();

    return () => {
      if (timerId) clearTimeout(timerId);
      if (fallbackTimerId) clearTimeout(fallbackTimerId);
      if (progInterval) clearInterval(progInterval);
      stop();
    };
  }, [onComplete, teacher.id, teacher.name, speak, stop]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto px-4 py-12 cursor-pointer select-none"
      style={{
        background: 'radial-gradient(circle at center, rgba(3, 20, 39, 0.75) 0%, rgba(2, 16, 32, 0.94) 100%)',
        backdropFilter: 'blur(4px)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleProceed}
      onTouchStart={handleProceed}
    >
      {/* Scan line */}
      <div className="scan-line" />

      {/* HUD corners (scale down on mobile) */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 w-10 h-10 sm:w-20 sm:h-20 border-l-2 border-t-2 border-green-400/60 pointer-events-none" />
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-20 sm:h-20 border-r-2 border-t-2 border-green-400/60 pointer-events-none" />
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 w-10 h-10 sm:w-20 sm:h-20 border-l-2 border-b-2 border-green-400/60 pointer-events-none" />
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-10 h-10 sm:w-20 sm:h-20 border-r-2 border-b-2 border-green-400/60 pointer-events-none" />

      {/* Reticle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {[1, 0.6, 0.35].map((scale, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-green-400/20"
            style={{ width: `${scale * 340}px`, height: `${scale * 340}px` }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 8 + i * 4, repeat: Infinity, ease: 'linear' }}
          />
        ))}
        <div className="w-2 h-2 rounded-full bg-green-400" style={{ boxShadow: '0 0 12px #00ff9d' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-md w-full my-auto">
        {/* Label */}
        <motion.div
          className="font-mono-hud text-[10px] sm:text-xs text-green-400/50 tracking-[0.3em] sm:tracking-[0.4em] mb-4 sm:mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          LAST DANCE // DETECTION SYSTEM
        </motion.div>

        {/* Steps */}
        <div className="space-y-2 mb-4 sm:mb-8 min-h-[50px] sm:min-h-[70px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIdx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="font-mono-hud text-xs sm:text-sm text-green-400/70 tracking-widest"
            >
              {DETECTION_STEPS[stepIdx]?.text}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-green-900/40 mb-2 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-green-400"
            style={{ boxShadow: '0 0 8px #00ff9d', width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="font-mono-hud text-[10px] sm:text-xs text-green-400/40 mb-6 sm:mb-10">
          {progress}% COMPLETE
        </div>

        {/* TEACHER DETECTED */}
        <AnimatePresence>
          {showFinal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="font-mono-hud text-xs sm:text-sm text-green-400/50 tracking-[0.3em] mb-2">
                ██████████████ 100%
              </div>
              <div
                className="font-orbitron font-black text-2xl sm:text-4xl md:text-5xl text-glow-green tracking-widest leading-tight"
                style={{ letterSpacing: '0.15em' }}
              >
                TEACHER
              </div>
              <div
                className="font-orbitron font-black text-2xl sm:text-4xl md:text-5xl text-glow-green tracking-widest leading-tight"
                style={{ letterSpacing: '0.15em' }}
              >
                DETECTED
              </div>
              <motion.div
                className="mt-3 sm:mt-4 font-orbitron text-base sm:text-xl text-glow-amber tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {teacher.name.toUpperCase()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom tap prompt */}
      <div className="absolute bottom-4 sm:bottom-6 font-mono-hud text-[10px] sm:text-xs text-green-400/70 tracking-widest border border-green-400/30 px-3 sm:px-4 py-1.5 rounded bg-green-950/60 shadow-[0_0_12px_rgba(0,255,157,0.2)]">
        TAP SCREEN TO PROCEED →
      </div>
    </motion.div>
  );
}
