'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SCAN_LINES = [
  { text: 'SATELLITE GLOBAL ORBIT ESTABLISHED...', delay: 0 },
  { text: 'SCANNING GLOBAL GRID...', delay: 1000 },
  { text: 'TARGET REGION LOCATED: ASIA // INDIA', delay: 1800, highlight: true },
  { text: 'DESCENDING ORBIT: ANDHRA PRADESH // VISAKHAPATNAM', delay: 2800, highlight: true },
  { text: 'COORDINATES LOCKED: 17.7304° N, 83.3084° E', delay: 3800 },
  { text: 'TARGET CAMPUS FOUND: DWARAKA NAGAR', delay: 4500 },
  { text: 'PRISM DEGREE & PG COLLEGE', delay: 5200, highlight: true, large: true },
  { text: 'TEACHER BEACONS ONLINE', delay: 6000 },
];

interface ScanOverlayProps {
  onComplete: () => void;
}

export default function ScanOverlay({ onComplete }: ScanOverlayProps) {
  const [visibleIdx, setVisibleIdx] = useState(-1);
  const [done, setDone] = useState(false);

  useEffect(() => {
    SCAN_LINES.forEach((line, idx) => {
      setTimeout(() => {
        setVisibleIdx(idx);
        if (idx === SCAN_LINES.length - 1) {
          setTimeout(() => {
            setDone(true);
            setTimeout(onComplete, 600);
          }, 800);
        }
      }, line.delay);
    });
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center pointer-events-auto cursor-pointer select-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(3, 20, 39, 0.55) 0%, rgba(2, 16, 32, 0.78) 100%)',
            backdropFilter: 'blur(2px)',
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          onClick={onComplete}
          onTouchStart={onComplete}
        >
          {/* Top-right skip hint */}
          <div className="absolute top-6 right-6 font-mono-hud text-xs text-cyan-400/60 tracking-widest border border-cyan-400/30 px-3 py-1 rounded">
            TAP SCREEN TO SKIP
          </div>
          {/* Scan line sweep */}
          <div className="scan-line" />

          {/* HUD corners */}
          <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-cyan-400/60" />
          <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-cyan-400/60" />
          <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-cyan-400/60" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-cyan-400/60" />

          {/* Center target reticle with expanding radar rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-56 h-56 rounded-full border border-cyan-400/20 animate-ping"
              style={{ animationDuration: '3s' }}
            />
            <div
              className="w-44 h-44 rounded-full border border-cyan-400/30"
              style={{ boxShadow: '0 0 30px rgba(60,169,232,0.15)' }}
            />
            <div className="absolute w-28 h-28 rounded-full border border-cyan-400/40" />
            <div className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#00ff9d]" />
          </div>

          {/* Scan lines text */}
          <div className="relative z-10 text-center space-y-2.5 px-6 max-w-xl">
            {SCAN_LINES.map((line, idx) => (
              <AnimatePresence key={idx}>
                {visibleIdx >= idx && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={
                      line.large
                        ? 'font-orbitron text-2xl md:text-4xl font-black text-glow-green mt-3'
                        : line.highlight
                        ? 'font-orbitron text-sm md:text-lg font-bold text-glow-amber'
                        : 'font-mono-hud text-xs md:text-sm text-cyan-300/70'
                    }
                    style={line.large ? { letterSpacing: '0.2em' } : {}}
                  >
                    {line.text}
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </div>

          {/* Status bar bottom */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 font-mono-hud text-xs text-cyan-400/40 tracking-widest">
            TEACHER TRACKER // SATELLITE DETECTION PROCESS
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
