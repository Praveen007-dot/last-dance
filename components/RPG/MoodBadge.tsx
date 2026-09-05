'use client';

import { motion } from 'framer-motion';

interface MoodBadgeProps {
  emoji: string;
  mood: string;
  description: string;
}

export default function MoodBadge({ emoji, mood, description }: MoodBadgeProps) {
  return (
    <motion.div
      className="flex items-start gap-3 p-3"
      style={{
        background: 'rgba(0,255,157,0.04)',
        border: '1px solid rgba(0,255,157,0.15)',
      }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.4 }}
    >
      <span className="text-2xl leading-none">{emoji}</span>
      <div>
        <div className="font-orbitron text-xs font-bold tracking-widest text-glow-amber">
          MOOD: {mood}
        </div>
        <div
          className="font-mono-hud text-xs mt-0.5"
          style={{ color: 'rgba(0,255,157,0.5)' }}
        >
          &quot;{description}&quot;
        </div>
      </div>
    </motion.div>
  );
}
