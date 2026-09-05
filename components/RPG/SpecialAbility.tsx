'use client';

import { motion } from 'framer-motion';

interface SpecialAbilityProps {
  name: string;
  description: string;
}

export default function SpecialAbility({ name, description }: SpecialAbilityProps) {
  return (
    <motion.div
      className="p-3 relative overflow-hidden"
      style={{
        background: 'rgba(255,184,0,0.04)',
        border: '1px solid rgba(255,184,0,0.2)',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.5 }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255,184,0,0.3), transparent 70%)',
        }}
      />

      <div className="relative z-10">
        <div className="font-mono-hud text-xs tracking-widest mb-1" style={{ color: 'rgba(255,184,0,0.5)' }}>
          ⚡ SPECIAL ABILITY
        </div>
        <div className="font-orbitron text-sm md:text-base font-bold text-glow-amber tracking-widest mb-1">
          {name}
        </div>
        <div className="font-mono-hud text-xs" style={{ color: 'rgba(255,184,0,0.6)' }}>
          {description}
        </div>
      </div>
    </motion.div>
  );
}
