'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BOOT_LINES = [
  'INITIALIZING LAST DANCE v1.0.0...',
  'BOOTING TRIBUTE SYSTEM [OK]',
  'LOADING MEMORY ARCHIVES...',
  'CALIBRATING TEACHER DATABASE [OK]',
  'VALIDATING STUDENT RECORDS [OK]',
  'WARMING LOCATION GRID...',
  'MOUNTING OVERLAY CONTROLLERS [OK]',
  'SYNCING FINAL YEAR MEMORIES [OK]',
  'RUNNING ROUTINE CHECK: EMOTIONS READY',
  'RUNNING ROUTINE CHECK: GRATITUDE LOADED',
  'RUNNING ROUTINE CHECK: MEMORIES VERIFIED',
  'SECURE CHANNEL TO VISAKHAPATNAM [OK]',
  'ALL SYSTEMS NOMINAL',
  '>>> LAST DANCE ONLINE <<<',
];

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [lineCount, setLineCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLineCount((prev) => {
        if (prev < BOOT_LINES.length) {
          return prev + 1;
        }
        clearInterval(interval);
        setTimeout(() => {
          setDone(true);
          setTimeout(onComplete, 800);
        }, 600);
        return prev;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  const visibleLines = BOOT_LINES.slice(0, lineCount);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-start justify-center px-4 sm:px-8 md:px-20 py-16 cursor-pointer select-none overflow-y-auto"
      style={{ background: 'var(--bg-dark)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      onClick={onComplete}
      onTouchStart={onComplete}
    >
      {/* Top corner labels with safe padding */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 font-mono-hud text-[10px] sm:text-xs text-green-400/50 tracking-widest">
        LAST DANCE // TRIBUTE OS
      </div>
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 font-mono-hud text-[10px] sm:text-xs text-green-400/70 tracking-widest border border-green-400/30 px-2 sm:px-3 py-0.5 sm:py-1 rounded bg-green-950/40">
        TAP TO SKIP ↵
      </div>

      <div className="w-full max-w-2xl my-auto">
        {/* Logo */}
        <motion.div
          className="mb-4 sm:mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-black tracking-widest text-glow-green">
            LAST DANCE
          </span>
        </motion.div>

        {/* Boot lines */}
        <div className="space-y-1 font-mono-hud text-xs sm:text-sm md:text-base leading-snug">
          {visibleLines.map((line, idx) => {
            const isLast    = idx === BOOT_LINES.length - 1;
            const hasOK     = line.includes('[OK]');
            const lineClass = isLast
              ? 'text-glow-green font-bold mt-3 sm:mt-4 text-sm sm:text-base'
              : hasOK
              ? 'text-green-400/85'
              : 'text-green-400/60';
            const textWithoutOK = line.split('[OK]')[0];

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className={lineClass}
              >
                {hasOK ? (
                  <>
                    <span className="text-green-400/50">{textWithoutOK}</span>
                    <span className="text-glow-green font-bold ml-1">[OK]</span>
                  </>
                ) : (
                  line
                )}
              </motion.div>
            );
          })}

          {/* Blinking cursor */}
          {!done && (
            <motion.span
              className="inline-block w-2 h-3.5 sm:h-4 bg-green-400 ml-1 align-middle"
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
            />
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-6 sm:mt-8 h-1 bg-green-900/40 w-full rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-green-400"
            style={{ boxShadow: '0 0 8px #00ff9d' }}
            initial={{ width: '0%' }}
            animate={{ width: `${(visibleLines.length / BOOT_LINES.length) * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="mt-2 font-mono-hud text-[10px] sm:text-xs text-green-400/50">
          {Math.round((visibleLines.length / BOOT_LINES.length) * 100)}% LOADED
        </div>
      </div>
    </motion.div>
  );
}
