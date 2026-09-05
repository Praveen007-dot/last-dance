import React from 'react';

/**
 * Pixel-art Hamburger Menu Button (Orange rounded-rectangle with black border & 3 orange bars)
 */
export function PixelMenuButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative group p-1.5 focus:outline-none cursor-pointer transition-transform hover:scale-105 active:scale-95"
      aria-label="Toggle Menu"
    >
      <svg
        width="46"
        height="38"
        viewBox="0 0 46 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
      >
        {/* Outer Orange Border */}
        <rect x="0" y="0" width="46" height="38" rx="8" fill="#f7941d" />
        {/* Inner Black Cavity */}
        <rect x="4" y="4" width="38" height="30" rx="5" fill="#080808" />
        {/* 3 Pixel Orange Bars */}
        <rect x="9" y="10" width="28" height="3.5" rx="1.5" fill="#f7941d" />
        <rect x="9" y="17.25" width="28" height="3.5" rx="1.5" fill="#f7941d" />
        <rect x="9" y="24.5" width="28" height="3.5" rx="1.5" fill="#f7941d" />
      </svg>
    </button>
  );
}

/**
 * Pixel-art Square Button — Teacher Graduation Cap / Academic Icon
 * Replaces the old Spider glyph with a pixel-art mortarboard cap.
 */
export function PixelSquareButton({
  onClick,
  active = false,
}: {
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative group p-1 focus:outline-none cursor-pointer transition-transform hover:scale-105 active:scale-95 ${
        active ? 'ring-2 ring-cyan-400' : ''
      }`}
      aria-label="Tracker Focus Target"
    >
      <svg
        width="38"
        height="38"
        viewBox="0 0 38 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
      >
        {/* Black Outer Pixel Border */}
        <rect x="0" y="0" width="38" height="38" rx="6" fill="#000000" />
        {/* Dark navy face */}
        <rect x="3" y="3" width="32" height="32" rx="4" fill="#04182b" />

        {/* ── Pixel-art Graduation Cap (Mortarboard) ── */}
        {/* Board top face (rhombus/diamond) */}
        <polygon points="19,7 29,12 19,17 9,12" fill="#00ff9d" stroke="#003322" strokeWidth="1" />
        {/* Skullcap underneath */}
        <path
          d="M12 14 V20 Q12 25 19 27 Q26 25 26 20 V14"
          fill="#0a3320"
          stroke="#00ff9d"
          strokeWidth="1.5"
        />
        {/* Tassel cord from right corner */}
        <line x1="27" y1="13" x2="27" y2="20" stroke="#f7941d" strokeWidth="2" strokeLinecap="round" />
        <circle cx="27" cy="21" r="2" fill="#f7941d" />
        {/* Cyan tracker crosshair ticks around cap */}
        <line x1="4" y1="12" x2="7" y2="12" stroke="#3ca9e8" strokeWidth="1" />
        <line x1="31" y1="12" x2="34" y2="12" stroke="#3ca9e8" strokeWidth="1" />
      </svg>
    </button>
  );
}

/**
 * Center Pill Badge (Double-bordered retro capsule with TEACHER + cap emblem + TRACKER)
 */
export function PixelPillBadge({
  titleLeft = 'TEACHER',
  titleRight = 'TRACKER',
  isSpideyMode = false,
  onClick,
}: {
  titleLeft?: string;
  titleRight?: string;
  isSpideyMode?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="inline-flex items-center gap-1.5 md:gap-3 px-3 md:px-5 py-1.5 md:py-2 select-none cursor-pointer transition-transform hover:scale-102"
      style={{
        background: '#04182b',
        border: '3px solid #3ca9e8',
        borderRadius: '9999px',
        boxShadow: '0 0 0 2px #000, 0 0 12px rgba(60, 169, 232, 0.4)',
      }}
      title="Teacher Tracker Status"
    >
      {/* Title Left in white pixel font */}
      <span
        className="font-pixel text-xs md:text-sm text-white tracking-widest"
        style={{
          textShadow: '0 2px 0 #000, 0 0 6px rgba(255,255,255,0.4)',
        }}
      >
        {titleLeft}
      </span>

      {/* Center Emblem: Always Teacher Graduation Cap */}
      <div className="relative w-6 h-6 md:w-7 md:h-7 flex items-center justify-center">
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          {/* Dark circular frame */}
          <circle cx="13" cy="13" r="11" fill="#04203b" stroke="#3ca9e8" strokeWidth="1.5" />
          {/* Academic Cap Rhombus / Board */}
          <polygon points="13,5 21,9 13,13 5,9" fill="#00ff9d" stroke="#003322" strokeWidth="1" />
          {/* Skullcap underneath */}
          <path
            d="M8 11V15C8 17.5 10.5 19 13 19C15.5 19 18 17.5 18 15V11"
            fill="#063321"
            stroke="#00ff9d"
            strokeWidth="1.2"
          />
          {/* Tassel */}
          <line x1="19" y1="10" x2="19" y2="15" stroke="#f7941d" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="19" cy="16.5" r="1.5" fill="#f7941d" />
        </svg>
      </div>

      {/* Title Right in cyan pixel font */}
      <span
        className="font-pixel text-xs md:text-sm tracking-widest"
        style={{
          color: '#3ca9e8',
          textShadow: '0 2px 0 #000, 0 0 8px rgba(60, 169, 232, 0.6)',
        }}
      >
        {titleRight}
      </span>
    </div>
  );
}

/**
 * Hexagonal Pixel Marker Icon — Teacher-themed
 * - 'white': Silver/white hex with pixel graduation cap (fixed target location)
 * - 'star' : Sky-blue hex with 5-pointed star (highlighted teacher)
 * - 'coral': Red/coral hex with pixel apple (teacher symbol)
 * - 'teal' : Emerald/teal hex with pixel open book
 */
export function PixelHexMarker({
  type = 'white',
  size = 38,
  isSelected = false,
}: {
  type?: 'white' | 'star' | 'coral' | 'teal';
  size?: number;
  isSelected?: boolean;
}) {
  const colors = {
    white: { fill: '#ffffff', stroke: '#000000', icon: '#121212', ring: '#3ca9e8' },
    star:  { fill: '#60a5fa', stroke: '#000000', icon: '#000000', ring: '#93c5fd' },
    coral: { fill: '#f87171', stroke: '#000000', icon: '#000000', ring: '#fca5a5' },
    teal:  { fill: '#34d399', stroke: '#000000', icon: '#000000', ring: '#6ee7b7' },
  }[type];

  return (
    <div
      className="relative flex items-center justify-center cursor-pointer select-none group"
      style={{ width: size, height: size }}
    >
      {/* Target Reticle / Pulse Ring for primary active location */}
      {(type === 'white' || isSelected) && (
        <div
          className="absolute -inset-3 rounded-full pointer-events-none animate-target-reticle"
          style={{
            border: `2px dashed ${colors.ring}`,
            boxShadow: `0 0 16px ${colors.ring}`,
          }}
        />
      )}

      {/* Hexagonal Pixel SVG Token */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 38 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] transition-transform group-hover:scale-110"
      >
        {/* Hexagon Path */}
        <polygon
          points="19,2 34,10.5 34,27.5 19,36 4,27.5 4,10.5"
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {type === 'star' ? (
          /* 5-pointed black star */
          <polygon
            points="19,8 22,15 29,15 23,20 25,27 19,23 13,27 15,20 9,15 16,15"
            fill={colors.icon}
          />
        ) : type === 'coral' ? (
          /* Teacher Apple icon */
          <g>
            {/* Apple body */}
            <ellipse cx="19" cy="21" rx="7" ry="8" fill={colors.icon} />
            {/* Apple indent top */}
            <ellipse cx="19" cy="14" rx="3.5" ry="3" fill={colors.fill} />
            {/* Apple stem */}
            <rect x="18" y="8" width="2" height="4" rx="1" fill={colors.icon} />
            {/* Leaf */}
            <ellipse cx="21" cy="10" rx="3" ry="1.5" fill={colors.icon} transform="rotate(-30 21 10)" />
            {/* Apple shine */}
            <ellipse cx="15.5" cy="18" rx="1.5" ry="2" fill={colors.fill} opacity="0.5" />
          </g>
        ) : type === 'teal' ? (
          /* Open Book icon */
          <g>
            {/* Left page */}
            <path
              d="M7 13 Q7 10 11 10 L19 12 L19 28 Q15 26 11 27 Q7 28 7 25 Z"
              fill={colors.fill}
              opacity="0.85"
            />
            {/* Right page */}
            <path
              d="M31 13 Q31 10 27 10 L19 12 L19 28 Q23 26 27 27 Q31 28 31 25 Z"
              fill={colors.fill}
              opacity="0.65"
            />
            {/* Center spine */}
            <line x1="19" y1="12" x2="19" y2="28" stroke={colors.icon} strokeWidth="1.5" />
            {/* Left page lines */}
            <line x1="10" y1="16" x2="17" y2="15" stroke={colors.icon} strokeWidth="1" opacity="0.6" />
            <line x1="10" y1="19" x2="17" y2="18" stroke={colors.icon} strokeWidth="1" opacity="0.6" />
            <line x1="10" y1="22" x2="17" y2="21" stroke={colors.icon} strokeWidth="1" opacity="0.6" />
            {/* Right page lines */}
            <line x1="28" y1="16" x2="21" y2="15" stroke={colors.icon} strokeWidth="1" opacity="0.6" />
            <line x1="28" y1="19" x2="21" y2="18" stroke={colors.icon} strokeWidth="1" opacity="0.6" />
            <line x1="28" y1="22" x2="21" y2="21" stroke={colors.icon} strokeWidth="1" opacity="0.6" />
          </g>
        ) : (
          /* white — Graduation Cap icon */
          <g>
            {/* Board (rhombus) */}
            <polygon points="19,9 28,14 19,19 10,14" fill={colors.icon} />
            {/* Skullcap */}
            <path
              d="M13 16 V21 Q13 25 19 26.5 Q25 25 25 21 V16"
              fill={colors.icon}
              opacity="0.75"
            />
            {/* Tassel */}
            <line x1="27" y1="15" x2="27" y2="21" stroke="#f7941d" strokeWidth="2" strokeLinecap="round" />
            <circle cx="27" cy="22" r="2" fill="#f7941d" />
          </g>
        )}
      </svg>
    </div>
  );
}
