'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FixedLocation } from '@/data/trackerConfig';
import { PixelHexMarker } from './PixelIcons';

interface ExactThemeWorldMapProps {
  location: FixedLocation;
  onMarkerClick?: (location: FixedLocation) => void;
  focusCounter?: number;
}

// Convert GPS (lat, lng) to map viewBox coordinates [0..1200, 0..620]
// Visakhapatnam (17.73° N, 83.31° E) maps to: x ~ 878, y ~ 248
function latLngToMapCoords(lat: number, lng: number): { x: number; y: number; xPct: number; yPct: number } {
  const x = ((lng + 180) / 360) * 1200;
  const clampedLat = Math.max(-75, Math.min(75, lat));
  const y = ((75 - clampedLat) / 150) * 620;
  return {
    x,
    y,
    xPct: (x / 1200) * 100,
    yPct: (y / 620) * 100,
  };
}

export default function ExactThemeWorldMap({
  location,
  onMarkerClick,
  focusCounter = 0,
}: ExactThemeWorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [manualZoom, setManualZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const targetCoords = latLngToMapCoords(location.lat, location.lng);

  // Automatic zoom in to target location
  const handleZoomInToTarget = useCallback(() => {
    setIsZoomed(true);
    setManualZoom(4.5);
    // Pan so target is centered
    // target is at (targetCoords.xPct %, targetCoords.yPct %)
    // to center it in viewport: offset = (50 - targetCoords.xPct) * factor
    const offsetX = (50 - targetCoords.xPct) * 11;
    const offsetY = (50 - targetCoords.yPct) * 6;
    setPanOffset({ x: offsetX, y: offsetY });
  }, [targetCoords.xPct, targetCoords.yPct]);

  // Zoom back out to full world map
  const handleZoomOutToWorld = useCallback(() => {
    setIsZoomed(false);
    setManualZoom(1);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  // Listen to focusCounter changes from top bar / radar
  React.useEffect(() => {
    if (focusCounter > 0) {
      handleZoomInToTarget();
    }
  }, [focusCounter, handleZoomInToTarget]);

  // Drag pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.88;
    setManualZoom((prev) => {
      const next = Math.max(1, Math.min(7, prev * factor));
      if (next <= 1.2) {
        setIsZoomed(false);
        setPanOffset({ x: 0, y: 0 });
      } else {
        setIsZoomed(true);
      }
      return next;
    });
  };

  // When clicking on the icon: automatic zoom in!
  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isZoomed) {
      // IF JUST ON ICON: ZOOM IN AUTOMATICALLY!
      handleZoomInToTarget();
    } else {
      // If already zoomed in, trigger the dossier modal
      onMarkerClick?.(location);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className={`relative w-full h-full overflow-hidden select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{
        background: '#03172e',
      }}
    >
      {/* ── TOP MEASUREMENT RULER BAR (Matching screenshot exactly) ── */}
      <div
        className="absolute top-0 left-0 right-0 h-9 z-20 flex items-center pointer-events-none px-4"
        style={{
          borderBottom: '1.5px solid rgba(60, 169, 232, 0.3)',
          background: 'linear-gradient(to bottom, rgba(2, 16, 33, 0.95), rgba(3, 21, 41, 0.85))',
          backdropFilter: 'blur(4px)',
        }}
      >
        <div className="w-full flex justify-between items-center text-[10px] font-silkscreen text-cyan-400/60">
          <div className="flex items-center gap-3">
            <span className="tracking-widest">|...|...|...|</span>
            <span className="text-cyan-300/80">PACIFIC</span>
            <span className="tracking-widest">|...|...|</span>
          </div>

          <div className="flex items-center gap-4 hidden sm:flex">
            <span className="tracking-widest">|...|...|</span>
            <span className="text-cyan-300 font-bold">NORTH AMERICA</span>
            <span className="tracking-widest">|...|...|</span>
            <span className="text-cyan-300 font-bold">EUROPE</span>
            <span className="tracking-widest">|...|...|</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-cyan-300 font-bold">ASIA</span>
            <span className="tracking-widest">|...|...|...|</span>
            <span className="text-cyan-300/80">PACIFIC</span>
          </div>
        </div>
      </div>

      {/* ── LEFT VERTICAL RULER TICKS (Matching screenshot) ── */}
      <div
        className="absolute top-9 left-0 bottom-0 w-8 z-20 pointer-events-none flex flex-col justify-between py-6 px-1.5"
        style={{
          borderRight: '1px solid rgba(60, 169, 232, 0.25)',
          background: 'rgba(3, 21, 41, 0.5)',
        }}
      >
        <span className="font-silkscreen text-[9px] text-cyan-400/50">75°N</span>
        <div className="flex flex-col gap-1 font-mono text-[8px] text-cyan-400/20">
          <span>|..</span>
          <span>|..</span>
          <span>|..</span>
        </div>
        <span className="font-silkscreen text-[9px] text-cyan-400/70">EQ 0°</span>
        <div className="flex flex-col gap-1 font-mono text-[8px] text-cyan-400/20">
          <span>|..</span>
          <span>|..</span>
          <span>|..</span>
        </div>
        <span className="font-silkscreen text-[9px] text-cyan-400/50">60°S</span>
      </div>

      {/* ── MAP CANVAS CONTAINER (SMOOTH ZOOM & PAN) ── */}
      <motion.div
        animate={{
          scale: manualZoom,
          x: panOffset.x,
          y: panOffset.y,
        }}
        transition={{
          duration: 1.4,
          ease: [0.16, 1, 0.3, 1], // buttery smooth cinematic easing
        }}
        className="w-full h-full relative"
        style={{ transformOrigin: '50% 50%' }}
      >
        {/* SVG THEME WORLD MAP (Zero API keys, 100% exact theme from screenshot) */}
        <svg
          viewBox="0 0 1200 620"
          className="w-full h-full absolute inset-0 object-contain"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="spidey-tactical-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(60, 169, 232, 0.08)" strokeWidth="1" />
            </pattern>

            {/* Continent gradient fill */}
            <linearGradient id="spidey-land-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#082848" />
              <stop offset="100%" stopColor="#051c35" />
            </linearGradient>

            {/* Cyan glowing border filter */}
            <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#3ca9e8" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Deep Navy Ocean Background */}
          <rect width="1200" height="620" fill="#03172e" />
          <rect width="1200" height="620" fill="url(#spidey-tactical-grid)" />

          {/* ── TACTICAL LATITUDE LINES (Matching screenshot) ── */}
          {/* Arctic Circle 66.5° N */}
          <line x1="0" y1="95" x2="1200" y2="95" stroke="rgba(60, 169, 232, 0.2)" strokeDasharray="4,4" strokeWidth="1" />
          {/* Tropic of Cancer 23.5° N */}
          <line x1="0" y1="210" x2="1200" y2="210" stroke="rgba(60, 169, 232, 0.3)" strokeDasharray="6,4" strokeWidth="1.2" />
          {/* Equator 0° (Prominent dashed line across entire map) */}
          <line x1="0" y1="310" x2="1200" y2="310" stroke="#3ca9e8" strokeDasharray="8,6" strokeWidth="1.5" opacity="0.65" />
          {/* Tropic of Capricorn 23.5° S */}
          <line x1="0" y1="410" x2="1200" y2="410" stroke="rgba(60, 169, 232, 0.3)" strokeDasharray="6,4" strokeWidth="1.2" />

          {/* ── DOTTED LONGITUDE LINES (Every 30 degrees) ── */}
          {[100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100].map((x) => (
            <line
              key={x}
              x1={x}
              y1="40"
              x2={x}
              y2="590"
              stroke="rgba(60, 169, 232, 0.18)"
              strokeDasharray="2,6"
              strokeWidth="1"
            />
          ))}

          {/* ── CONTINENT PATHS (High-precision stylized tactical silhouettes) ── */}

          {/* NORTH AMERICA */}
          <g fill="url(#spidey-land-grad)" stroke="#0e4f82" strokeWidth="2" strokeLinejoin="round">
            {/* Mainland NA & Alaska */}
            <path d="M 95 90 L 140 80 L 190 75 L 250 85 L 285 70 L 320 80 L 340 115 L 370 120 L 360 160 L 330 185 L 325 210 L 305 220 L 290 260 L 275 285 L 255 315 L 245 330 L 235 320 L 230 290 L 210 270 L 185 240 L 155 240 L 130 215 L 115 170 L 85 140 L 80 115 Z" />
            {/* Greenland */}
            <path d="M 370 45 L 430 45 L 445 80 L 415 125 L 375 110 L 360 70 Z" />
            {/* Canadian Archipelago & Hudson Bay */}
            <path d="M 230 45 L 280 40 L 320 55 L 290 75 Z" />
            {/* Caribbean Islands */}
            <path d="M 285 305 L 320 310 L 330 325 L 295 320 Z" />
          </g>

          {/* SOUTH AMERICA */}
          <g fill="url(#spidey-land-grad)" stroke="#0e4f82" strokeWidth="2" strokeLinejoin="round">
            <path d="M 255 325 L 300 320 L 350 340 L 390 380 L 395 420 L 365 470 L 340 520 L 315 565 L 295 560 L 290 515 L 270 440 L 260 380 L 245 350 Z" />
            {/* Falklands */}
            <circle cx="330" cy="570" r="3" />
          </g>

          {/* EUROPE & BRITISH ISLES */}
          <g fill="url(#spidey-land-grad)" stroke="#0e4f82" strokeWidth="2" strokeLinejoin="round">
            {/* Scandinavia */}
            <path d="M 570 65 L 615 65 L 630 105 L 600 145 L 575 140 L 565 100 Z" />
            {/* British Isles */}
            <path d="M 505 110 L 530 105 L 535 135 L 515 150 L 495 135 Z" />
            <path d="M 485 125 L 500 120 L 495 145 L 480 140 Z" />
            {/* Mainland Europe */}
            <path d="M 525 155 L 585 145 L 640 140 L 660 170 L 635 200 L 610 195 L 590 230 L 575 220 L 550 225 L 530 205 L 515 170 Z" />
            {/* Iberia (Spain/Portugal) */}
            <path d="M 485 200 L 535 195 L 530 240 L 485 240 Z" />
            {/* Italy */}
            <path d="M 575 195 L 595 210 L 600 245 L 585 245 Z" />
          </g>

          {/* AFRICA */}
          <g fill="url(#spidey-land-grad)" stroke="#0e4f82" strokeWidth="2" strokeLinejoin="round">
            <path d="M 485 245 L 570 245 L 645 255 L 690 290 L 705 340 L 675 390 L 655 440 L 630 500 L 590 515 L 565 480 L 545 420 L 525 350 L 475 310 L 470 270 Z" />
            {/* Madagascar */}
            <path d="M 695 430 L 715 440 L 705 490 L 685 480 Z" />
          </g>

          {/* ASIA */}
          <g fill="url(#spidey-land-grad)" stroke="#0e4f82" strokeWidth="2" strokeLinejoin="round">
            {/* Russia / North Asia */}
            <path d="M 645 135 L 750 100 L 880 85 L 1000 80 L 1080 105 L 1110 135 L 1070 180 L 1020 185 L 980 160 L 920 170 L 870 175 L 820 195 L 760 190 L 700 175 L 660 160 Z" />
            {/* Middle East & Arabian Peninsula */}
            <path d="M 645 255 L 715 250 L 730 300 L 690 325 L 660 295 Z" />
            {/* Central Asia & China */}
            <path d="M 760 190 L 860 180 L 950 190 L 1010 230 L 980 280 L 930 285 L 880 270 L 830 260 L 780 250 Z" />
            {/* INDIA (Where PRISM College is located!) */}
            <path d="M 780 250 L 840 250 L 875 285 L 850 355 L 815 375 L 780 320 L 765 275 Z" />
            {/* Sri Lanka */}
            <circle cx="835" cy="385" r="5" />
            {/* Southeast Asia */}
            <path d="M 910 280 L 960 280 L 970 335 L 930 360 L 910 320 Z" />
            {/* Japan */}
            <path d="M 1045 200 L 1070 205 L 1060 250 L 1035 240 Z" />
            {/* Indonesia & Philippines */}
            <path d="M 930 375 L 990 380 L 980 400 L 925 390 Z" />
            <path d="M 1000 370 L 1050 375 L 1030 415 L 990 410 Z" />
            <path d="M 990 300 L 1015 305 L 1010 340 L 985 335 Z" />
          </g>

          {/* AUSTRALIA & NEW ZEALAND */}
          <g fill="url(#spidey-land-grad)" stroke="#0e4f82" strokeWidth="2" strokeLinejoin="round">
            {/* Australia */}
            <path d="M 985 440 L 1070 435 L 1100 480 L 1075 540 L 1010 545 L 965 500 L 960 460 Z" />
            {/* New Zealand */}
            <path d="M 1120 520 L 1135 525 L 1125 565 L 1110 550 Z" />
            <path d="M 1105 565 L 1120 570 L 1115 595 L 1095 585 Z" />
          </g>

          {/* ── CONTINENT LABELS (Pixel art font matching screenshot) ── */}
          <text x="210" y="195" fill="rgba(60, 169, 232, 0.55)" className="font-silkscreen text-[12px] font-bold tracking-widest pointer-events-none">
            NORTH AMERICA
          </text>
          <text x="310" y="420" fill="rgba(60, 169, 232, 0.55)" className="font-silkscreen text-[12px] font-bold tracking-widest pointer-events-none">
            SOUTH AMERICA
          </text>
          <text x="545" y="340" fill="rgba(60, 169, 232, 0.55)" className="font-silkscreen text-[12px] font-bold tracking-widest pointer-events-none">
            AFRICA
          </text>
          <text x="860" y="150" fill="rgba(60, 169, 232, 0.55)" className="font-silkscreen text-[13px] font-bold tracking-widest pointer-events-none">
            ASIA
          </text>
          <text x="1010" y="495" fill="rgba(60, 169, 232, 0.55)" className="font-silkscreen text-[12px] font-bold tracking-widest pointer-events-none">
            OCEANIA
          </text>

          {/* Ocean Watermark Text */}
          <text x="400" y="290" fill="rgba(60, 169, 232, 0.25)" className="font-mono-hud text-[12px] tracking-widest pointer-events-none">
            Atlantic Ocean
          </text>
          <text x="120" y="430" fill="rgba(60, 169, 232, 0.25)" className="font-mono-hud text-[12px] tracking-widest pointer-events-none">
            Pacific Ocean
          </text>
          <text x="730" y="460" fill="rgba(60, 169, 232, 0.25)" className="font-mono-hud text-[12px] tracking-widest pointer-events-none">
            Indian Ocean
          </text>

          {/* ── HIGH ZOOM CAMPUS SECTOR OVERLAY (Revealed when zoomed in) ── */}
          {isZoomed && (
            <g opacity="0.95">
              {/* Tactical Sector Boundary Circle */}
              <circle
                cx={targetCoords.x}
                cy={targetCoords.y}
                r="35"
                fill="rgba(6, 32, 60, 0.75)"
                stroke="#3ca9e8"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />
              {/* Campus Streets and Building Footprints in Dwaraka Nagar */}
              <line
                x1={targetCoords.x - 30}
                y1={targetCoords.y}
                x2={targetCoords.x + 30}
                y2={targetCoords.y}
                stroke="#3ca9e8"
                strokeWidth="1"
                opacity="0.8"
              />
              <line
                x1={targetCoords.x}
                y1={targetCoords.y - 30}
                x2={targetCoords.x}
                y2={targetCoords.y + 30}
                stroke="#3ca9e8"
                strokeWidth="1"
                opacity="0.8"
              />
              {/* Main Campus Wing Blocks */}
              <rect
                x={targetCoords.x - 12}
                y={targetCoords.y - 10}
                width="24"
                height="20"
                rx="2"
                fill="#0e3d68"
                stroke="#00ff9d"
                strokeWidth="1"
              />
              <text
                x={targetCoords.x}
                y={targetCoords.y + 22}
                textAnchor="middle"
                fill="#00ff9d"
                className="font-pixel text-[4px] tracking-wider"
              >
                PRISM CAMPUS
              </text>
            </g>
          )}
        </svg>

        {/* ── THE EXCLUSIVE FIXED LOCATION ICON (CLICK TO ZOOM IN AUTOMATICALLY) ── */}
        <div
          onClick={handleIconClick}
          className="absolute z-30 transition-transform duration-300 hover:scale-125 active:scale-95 cursor-pointer"
          style={{
            left: `${targetCoords.xPct}%`,
            top: `${targetCoords.yPct}%`,
            transform: 'translate(-50%, -50%)',
          }}
          title={isZoomed ? 'Click to inspect location details' : 'Click marker to zoom in automatically!'}
        >
          {/* Spotlight aura */}
          <div className="absolute -inset-6 rounded-full bg-cyan-400/20 filter blur-sm pointer-events-none animate-pulse" />

          {/* Hexagonal Marker Icon */}
          <PixelHexMarker type="white" size={isZoomed ? 36 : 46} isSelected={true} />

          {/* Tactical Tooltip Tag */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none z-40">
            <div
              className="px-2.5 py-1 rounded flex flex-col items-center gap-0.5"
              style={{
                background: '#04162c',
                border: '1.5px solid #3ca9e8',
                boxShadow: '0 0 16px rgba(60, 169, 232, 0.6), 0 3px 8px rgba(0,0,0,0.9)',
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-pixel text-[8px] text-white tracking-wider">
                  {location.name.toUpperCase()}
                </span>
              </div>
              <span className="font-mono-hud text-[9px] text-cyan-300 font-bold tracking-widest">
                {location.lat.toFixed(4)}° N, {location.lng.toFixed(4)}° E
              </span>
              {!isZoomed && (
                <span className="font-silkscreen text-[7px] text-amber-400 tracking-wider">
                  [ CLICK ICON TO ZOOM IN ]
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── QUICK PERSPECTIVE ZOOM BUTTONS (Top-Right HUD) ── */}
      <div className="absolute top-12 right-4 z-20 flex flex-col gap-2 select-none pointer-events-auto">
        {/* World Map View Button */}
        <button
          onClick={handleZoomOutToWorld}
          className={`px-3 py-2 rounded font-pixel text-[9px] flex items-center gap-1.5 cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.8)] transition-all ${
            !isZoomed
              ? 'bg-cyan-500/30 border-2 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(60,169,232,0.5)]'
              : 'bg-[#041a33]/90 hover:bg-[#072c54] border border-cyan-400/40 text-cyan-300/80 hover:text-white'
          }`}
          title="Zoom out to Full Tactical World Map"
        >
          <span>🌍</span>
          <span>WORLD MAP</span>
        </button>

        {/* Zoom In to Target Button */}
        <button
          onClick={handleZoomInToTarget}
          className={`px-3 py-2 rounded font-pixel text-[9px] flex items-center gap-1.5 cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.8)] transition-all ${
            isZoomed
              ? 'bg-emerald-500/30 border-2 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
              : 'bg-cyan-600/30 hover:bg-cyan-600/60 border border-cyan-400 text-cyan-200 hover:text-white'
          }`}
          title="Zoom in automatically to target campus"
        >
          <span>🎯</span>
          <span>ZOOM TARGET</span>
        </button>

        {/* Incremental Zoom Buttons */}
        <div className="flex gap-1.5 mt-1">
          <button
            onClick={() => setManualZoom((prev) => Math.min(7, prev * 1.3))}
            className="flex-1 h-8 rounded bg-[#041a33]/90 hover:bg-[#072c54] border border-cyan-400/40 text-cyan-200 font-pixel text-xs flex items-center justify-center cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.8)] transition-all hover:scale-105 active:scale-95"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => {
              setManualZoom((prev) => {
                const next = Math.max(1, prev / 1.3);
                if (next <= 1.2) {
                  setIsZoomed(false);
                  setPanOffset({ x: 0, y: 0 });
                }
                return next;
              });
            }}
            className="flex-1 h-8 rounded bg-[#041a33]/90 hover:bg-[#072c54] border border-cyan-400/40 text-cyan-200 font-pixel text-xs flex items-center justify-center cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.8)] transition-all hover:scale-105 active:scale-95"
            title="Zoom Out"
          >
            −
          </button>
        </div>
      </div>

      {/* ── BOTTOM HUD TELEMETRY FOOTER ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-8 z-20 flex items-center justify-between px-6 pointer-events-none"
        style={{
          borderTop: '1px solid rgba(60, 169, 232, 0.25)',
          background: 'rgba(2, 16, 32, 0.92)',
          backdropFilter: 'blur(3px)',
        }}
      >
        <div className="font-silkscreen text-[9px] text-cyan-400/80 tracking-wider flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>TACTICAL RADAR:</span>
          <span className="text-white font-bold">1 TARGET FIXED [PRISM CAMPUS]</span>
        </div>
        <div className="font-mono-hud text-[11px] text-cyan-300/50 tracking-widest hidden md:block">
          ZERO-API STANDALONE ENGINE // CLICK ICON TO ZOOM IN
        </div>
        <div className="font-silkscreen text-[9px] text-cyan-400/80">
          VIEW: <span className="text-cyan-300 font-bold">{isZoomed ? 'CAMPUS LOCK' : 'GLOBAL WORLD'}</span> [{Math.round(manualZoom * 100)}%]
        </div>
      </div>
    </div>
  );
}
