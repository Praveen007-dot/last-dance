'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TacticalWebRadarProps {
  onPingTarget?: () => void;
  onToggleView?: () => void;
  targetBearing?: number; // bearing in degrees from center
}

export default function TacticalWebRadar({
  onPingTarget,
  onToggleView,
  targetBearing = 45,
}: TacticalWebRadarProps) {
  const [activeMode, setActiveMode] = useState<'radar' | 'globe'>('radar');

  return (
    <div className="relative flex flex-col items-end pointer-events-auto select-none">
      {/* Radar Container (scaled for mobile 96px, desktop 140px) */}
      <div
        className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.8)]"
        style={{
          background: 'radial-gradient(circle, rgba(6,32,58,0.92) 0%, rgba(3,21,41,0.98) 80%)',
          border: '1.5px solid rgba(60, 169, 232, 0.4)',
          boxShadow: '0 0 16px rgba(60, 169, 232, 0.25), inset 0 0 12px rgba(60, 169, 232, 0.2)',
        }}
      >
        {/* SVG Spider-Web Grid */}
        <svg
          viewBox="0 0 140 140"
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Radial Spokes (8 directions) */}
          <line x1="70" y1="10" x2="70" y2="130" stroke="rgba(60, 169, 232, 0.3)" strokeWidth="1" />
          <line x1="10" y1="70" x2="130" y2="70" stroke="rgba(60, 169, 232, 0.3)" strokeWidth="1" />
          <line x1="28" y1="28" x2="112" y2="112" stroke="rgba(60, 169, 232, 0.25)" strokeWidth="1" />
          <line x1="112" y1="28" x2="28" y2="112" stroke="rgba(60, 169, 232, 0.25)" strokeWidth="1" />

          {/* Concentric Octagonal Web Rings */}
          <polygon
            points="70,12 111,29 128,70 111,111 70,128 29,111 12,70 29,29"
            fill="none"
            stroke="rgba(60, 169, 232, 0.45)"
            strokeWidth="1.2"
          />
          <polygon
            points="70,30 98,42 110,70 98,98 70,110 42,98 30,70 42,42"
            fill="none"
            stroke="rgba(60, 169, 232, 0.35)"
            strokeWidth="1"
          />
          <polygon
            points="70,48 85,54 92,70 85,86 70,92 55,86 48,70 55,54"
            fill="none"
            stroke="rgba(60, 169, 232, 0.25)"
            strokeWidth="0.8"
          />

          {/* Center target dot */}
          <circle cx="70" cy="70" r="3" fill="#3ca9e8" />
          <circle cx="70" cy="70" r="1.5" fill="#ffffff" />

          {/* Rotating Radar Sweep Line with Gradient */}
          <g className="origin-[70px_70px] animate-[spin_4s_linear_infinite]">
            <line
              x1="70"
              y1="70"
              x2="70"
              y2="10"
              stroke="#3ca9e8"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>

          {/* Target Bearing Marker Dot (Pulse Ring) */}
          <circle
            cx="88"
            cy="52"
            r="4"
            fill="#3ca9e8"
            className="animate-ping origin-[88px_52px]"
          />
          <circle
            cx="88"
            cy="52"
            r="3.5"
            fill="#38bdf8"
            stroke="#ffffff"
            strokeWidth="1"
          />
          {/* Secondary telemetry blips */}
          <circle cx="62" cy="38" r="2.5" fill="#f87171" className="animate-pulse" />
          <circle cx="94" cy="58" r="2.5" fill="#f87171" className="animate-pulse" />
          <circle cx="106" cy="80" r="2" fill="#60a5fa" />
          <circle cx="100" cy="98" r="2" fill="#34d399" />
        </svg>

        {/* Small Mode Icons at bottom right of radar */}
        <div className="absolute -bottom-1 -right-1 flex gap-1 z-10">
          {/* Globe View Button */}
          <button
            onClick={() => {
              setActiveMode('globe');
              onToggleView?.();
            }}
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center cursor-pointer transition-all border ${
              activeMode === 'globe'
                ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 shadow-[0_0_8px_#3ca9e8]'
                : 'bg-[#061e38] border-cyan-500/40 text-cyan-400/70 hover:text-cyan-200'
            }`}
            title="Toggle Global View"
            aria-label="Toggle Global View"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </button>

          {/* Lock Target Button */}
          <button
            onClick={() => {
              setActiveMode('radar');
              onPingTarget?.();
            }}
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center cursor-pointer transition-all border ${
              activeMode === 'radar'
                ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 shadow-[0_0_8px_#3ca9e8]'
                : 'bg-[#061e38] border-cyan-500/40 text-cyan-400/70 hover:text-cyan-200'
            }`}
            title="Lock Fixed Target Location"
            aria-label="Lock Fixed Target Location"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="3" />
              <line x1="12" y1="1" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="1" y1="12" x2="5" y2="12" />
              <line x1="19" y1="12" x2="23" y2="12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Target Coordinates Tag under radar (hidden on very small phones) */}
      <div className="mt-1 text-right hidden xs:block">
        <span className="font-silkscreen text-[8px] sm:text-[9px] tracking-wider text-cyan-400/70 block">
          LOCK: 17.73° N, 83.31° E
        </span>
      </div>
    </div>
  );
}
