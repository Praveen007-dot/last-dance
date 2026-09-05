'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface StatBarProps {
  label: string;
  value: number;
  color?: 'green' | 'amber' | 'red';
  delay?: number;
}

const COLOR_MAP = {
  green: { bar: '#00ff9d', glow: '#00ff9d', text: '#00ff9d' },
  amber: { bar: '#ffb800', glow: '#ffb800', text: '#ffb800' },
  red:   { bar: '#ff3b3b', glow: '#ff3b3b', text: '#ff3b3b' },
};

export default function StatBar({ label, value, color = 'green', delay = 0 }: StatBarProps) {
  const colors = COLOR_MAP[color];
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="flex items-center gap-3">
      {/* Label */}
      <span
        className="font-mono-hud text-xs tracking-widest w-28 shrink-0"
        style={{ color: 'rgba(0,255,157,0.5)' }}
      >
        {label}
      </span>

      {/* Bar track */}
      <div
        className="flex-1 h-2 rounded-sm overflow-hidden"
        style={{ background: 'rgba(0,255,157,0.08)' }}
      >
        <motion.div
          className="h-full rounded-sm"
          style={{
            background: colors.bar,
            boxShadow: `0 0 6px ${colors.glow}`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 1, delay, ease: 'easeOut' }}
        />
      </div>

      {/* Number */}
      <motion.span
        className="font-orbitron text-sm font-bold w-8 text-right shrink-0"
        style={{ color: colors.text }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.8 }}
      >
        {clampedValue}
      </motion.span>
    </div>
  );
}
