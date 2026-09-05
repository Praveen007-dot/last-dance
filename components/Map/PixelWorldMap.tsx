'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PixelHexMarker } from './PixelIcons';
import { FixedLocation } from '@/data/trackerConfig';

interface PixelWorldMapProps {
  location: FixedLocation;
  onMarkerClick?: (location: FixedLocation) => void;
  focusTrigger?: number;
}

// Coordinate projection helper: converts GPS lat/lng to map percentage [0, 100]
function projectLatLng(lat: number, lng: number): { x: number; y: number } {
  // Equirectangular projection with Mercator visual padding
  const x = ((lng + 180) / 360) * 100;
  // Clamped latitude projection
  const clampedLat = Math.max(-75, Math.min(75, lat));
  const y = ((75 - clampedLat) / 150) * 100;
  return { x, y };
}

export default function PixelWorldMap({
  location,
  onMarkerClick,
  focusTrigger = 0,
}: PixelWorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom & Pan transform state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(true);

  // Projected coordinates for the user's fixed location
  const markerPos = useMemo(
    () => projectLatLng(location.lat, location.lng),
    [location.lat, location.lng]
  );

  // Auto-focus or center onto target location when requested
  useEffect(() => {
    if (focusTrigger > 0) {
      // Zoom in towards the fixed target location
      setZoom(1.8);
      // Pan offset to center the marker (coordinates [0-100] -> offset in viewport)
      const targetOffsetX = (50 - markerPos.x) * 8;
      const targetOffsetY = (50 - markerPos.y) * 5;
      setPan({ x: targetOffsetX, y: targetOffsetY });
    }
  }, [focusTrigger, markerPos]);

  // Pan event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag with left click
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.88;
    setZoom((prev) => Math.max(1, Math.min(3.5, prev * zoomFactor)));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(3.5, prev * 1.3));
  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(1, prev / 1.3);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
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
        background: 'radial-gradient(circle at 50% 50%, #051d38 0%, #03152a 70%, #020d1c 100%)',
      }}
    >
      {/* ── TOP MEASUREMENT RULER BAR (Matching screenshot exactly) ── */}
      <div
        className="absolute top-0 left-0 right-0 h-9 z-20 flex items-center pointer-events-none px-4"
        style={{
          borderBottom: '1px solid rgba(60, 169, 232, 0.25)',
          background: 'rgba(3, 21, 41, 0.75)',
        }}
      >
        <div className="w-full flex justify-between items-center text-[10px] font-silkscreen text-cyan-400/50">
          <div className="flex items-center gap-3">
            <span className="tracking-widest">|...|...|...|</span>
            <span className="text-cyan-300/80">PACIFIC</span>
            <span className="tracking-widest">|...|...|</span>
          </div>

          <div className="flex items-center gap-4">
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
          borderRight: '1px solid rgba(60, 169, 232, 0.2)',
          background: 'rgba(3, 21, 41, 0.4)',
        }}
      >
        <span className="font-silkscreen text-[9px] text-cyan-400/40">75°N</span>
        <div className="flex flex-col gap-1 font-mono text-[8px] text-cyan-400/20">
          <span>|..</span>
          <span>|..</span>
          <span>|..</span>
        </div>
        <span className="font-silkscreen text-[9px] text-cyan-400/60">EQ 0°</span>
        <div className="flex flex-col gap-1 font-mono text-[8px] text-cyan-400/20">
          <span>|..</span>
          <span>|..</span>
          <span>|..</span>
        </div>
        <span className="font-silkscreen text-[9px] text-cyan-400/40">60°S</span>
      </div>

      {/* ── MAP CANVAS (Zoom & Pan Container) ── */}
      <div
        className="w-full h-full relative transition-transform duration-100 ease-out"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '50% 50%',
        }}
      >
        {/* SVG World Map Continents & Retro Grid Lines */}
        <svg
          viewBox="0 0 1200 650"
          className="w-full h-full absolute inset-0 object-contain"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Pixel Grid Pattern */}
            <pattern
              id="retro-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(60, 169, 232, 0.07)"
                strokeWidth="1"
              />
            </pattern>

            {/* Continent Fill Gradient */}
            <linearGradient id="continent-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#082b4e" />
              <stop offset="100%" stopColor="#051c36" />
            </linearGradient>
          </defs>

          {/* Background Grid Pattern */}
          <rect width="1200" height="650" fill="url(#retro-grid)" />

          {/* ── LATITUDE GRID LINES (Equator, Tropics, Poles) ── */}
          {/* Arctic Circle 66.5° N */}
          <line
            x1="0"
            y1="110"
            x2="1200"
            y2="110"
            stroke="rgba(60, 169, 232, 0.18)"
            strokeDasharray="4,4"
            strokeWidth="1"
          />
          {/* Tropic of Cancer 23.5° N */}
          <line
            x1="0"
            y1="230"
            x2="1200"
            y2="230"
            stroke="rgba(60, 169, 232, 0.22)"
            strokeDasharray="6,4"
            strokeWidth="1"
          />
          {/* Equator 0° */}
          <line
            x1="0"
            y1="340"
            x2="1200"
            y2="340"
            stroke="rgba(60, 169, 232, 0.35)"
            strokeDasharray="8,6"
            strokeWidth="1.2"
          />
          {/* Tropic of Capricorn 23.5° S */}
          <line
            x1="0"
            y1="450"
            x2="1200"
            y2="450"
            stroke="rgba(60, 169, 232, 0.22)"
            strokeDasharray="6,4"
            strokeWidth="1"
          />

          {/* ── LONGITUDE GRID LINES (Dotted) ── */}
          {[150, 300, 450, 600, 750, 900, 1050].map((xCoord) => (
            <line
              key={xCoord}
              x1={xCoord}
              y1="40"
              x2={xCoord}
              y2="630"
              stroke="rgba(60, 169, 232, 0.12)"
              strokeDasharray="3,6"
              strokeWidth="1"
            />
          ))}

          {/* ── PIXELATED CONTINENT SILHOUETTES (Equirectangular) ── */}

          {/* NORTH AMERICA */}
          <path
            d="M 120 70 L 260 70 L 320 110 L 350 140 L 340 180 L 300 200 L 290 260 L 250 280 L 240 320 L 220 320 L 210 270 L 180 250 L 150 240 L 130 190 L 100 160 L 90 120 Z
               M 270 80 L 310 90 L 310 130 L 280 130 Z
               M 350 90 L 390 90 L 410 140 L 380 150 Z"
            fill="url(#continent-grad)"
            stroke="#0e4f82"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* SOUTH AMERICA */}
          <path
            d="M 270 340 L 350 350 L 380 400 L 360 470 L 330 520 L 310 560 L 290 530 L 280 460 L 260 400 L 260 360 Z"
            fill="url(#continent-grad)"
            stroke="#0e4f82"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* EUROPE */}
          <path
            d="M 520 130 L 590 110 L 640 130 L 630 190 L 590 220 L 540 220 L 510 180 L 510 150 Z
               M 490 140 L 520 140 L 510 170 L 480 160 Z
               M 550 80 L 580 90 L 570 120 L 540 110 Z"
            fill="url(#continent-grad)"
            stroke="#0e4f82"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* AFRICA */}
          <path
            d="M 520 240 L 630 240 L 680 280 L 670 370 L 640 440 L 610 500 L 570 480 L 540 400 L 500 320 L 500 270 Z
               M 670 420 L 690 430 L 680 480 L 660 460 Z"
            fill="url(#continent-grad)"
            stroke="#0e4f82"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* ASIA */}
          <path
            d="M 640 110 L 800 90 L 980 100 L 1040 140 L 1020 220 L 960 260 L 910 240 L 860 300 L 820 280 L 800 340 L 760 340 L 740 280 L 680 260 L 640 200 Z
               M 770 340 L 830 330 L 810 420 L 770 380 Z
               M 980 200 L 1010 210 L 1000 270 L 970 250 Z"
            fill="url(#continent-grad)"
            stroke="#0e4f82"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* AUSTRALIA / OCEANIA */}
          <path
            d="M 920 440 L 1020 440 L 1040 500 L 1000 550 L 940 540 L 910 480 Z
               M 1030 540 L 1060 550 L 1040 580 Z"
            fill="url(#continent-grad)"
            stroke="#0e4f82"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* ── CONTINENT & OCEAN LABELS (Pixel Typography matching screenshot) ── */}
          <text x="210" y="210" fill="rgba(60, 169, 232, 0.45)" className="font-silkscreen text-[11px] tracking-widest font-bold">
            NORTH AMERICA
          </text>
          <text x="300" y="430" fill="rgba(60, 169, 232, 0.45)" className="font-silkscreen text-[11px] tracking-widest font-bold">
            SOUTH AMERICA
          </text>
          <text x="560" y="340" fill="rgba(60, 169, 232, 0.45)" className="font-silkscreen text-[11px] tracking-widest font-bold">
            AFRICA
          </text>
          <text x="820" y="160" fill="rgba(60, 169, 232, 0.45)" className="font-silkscreen text-[12px] tracking-widest font-bold">
            ASIA
          </text>
          <text x="940" y="490" fill="rgba(60, 169, 232, 0.45)" className="font-silkscreen text-[11px] tracking-widest font-bold">
            OCEANIA
          </text>

          {/* Ocean Watermark Text */}
          <text x="400" y="300" fill="rgba(60, 169, 232, 0.22)" className="font-mono-hud text-[11px] tracking-widest">
            Atlantic Ocean
          </text>
          <text x="140" y="440" fill="rgba(60, 169, 232, 0.22)" className="font-mono-hud text-[11px] tracking-widest">
            Pacific Ocean
          </text>
          <text x="730" y="480" fill="rgba(60, 169, 232, 0.22)" className="font-mono-hud text-[11px] tracking-widest">
            Indian Ocean
          </text>
        </svg>

        {/* ── ONLY USER FIXED LOCATION MARKER ── */}
        {/* We accurately map the coordinates to the map viewport */}
        <div
          className="absolute z-30"
          style={{
            left: `${markerPos.x}%`,
            top: `${markerPos.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Target Spotlight / Beacon Aura */}
          <div className="absolute -inset-8 rounded-full bg-cyan-400/10 filter blur-md pointer-events-none animate-pulse" />

          {/* The Iconic White Hexagonal Marker */}
          <div
            onClick={() => onMarkerClick?.(location)}
            onMouseEnter={() => setShowTooltip(true)}
            className="cursor-pointer transition-transform hover:scale-115 active:scale-95"
            title={`${location.name} - Click for details`}
          >
            <PixelHexMarker type="white" size={42} isSelected={true} />
          </div>

          {/* Tactical Target Tag Callout (Permanent or hoverable) */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto z-40"
              >
                <div
                  className="px-2.5 py-1.5 rounded flex flex-col items-center gap-0.5"
                  style={{
                    background: '#04162c',
                    border: '1.5px solid #3ca9e8',
                    boxShadow: '0 0 12px rgba(60, 169, 232, 0.5), 0 2px 6px rgba(0,0,0,0.8)',
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-pixel text-[9px] text-white tracking-wider">
                      {location.name.toUpperCase()}
                    </span>
                  </div>
                  <span className="font-mono-hud text-[10px] text-cyan-300 font-bold tracking-widest">
                    {location.lat.toFixed(4)}° N, {location.lng.toFixed(4)}° E
                  </span>
                </div>
                {/* Tooltip beak */}
                <div className="w-2 h-2 rotate-45 bg-[#04162c] border-l border-t border-[#3ca9e8] mx-auto -mt-1" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── MAP ZOOM & RESET CONTROLS (Top-right overlay under top bar) ── */}
      <div className="absolute top-12 right-4 z-20 flex flex-col gap-1.5 select-none">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 rounded bg-[#041a33]/90 hover:bg-[#072c54] border border-cyan-400/40 text-cyan-200 font-pixel text-xs flex items-center justify-center cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.7)] transition-all"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 rounded bg-[#041a33]/90 hover:bg-[#072c54] border border-cyan-400/40 text-cyan-200 font-pixel text-xs flex items-center justify-center cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.7)] transition-all"
          title="Zoom Out"
        >
          −
        </button>
        <button
          onClick={handleResetView}
          className="w-8 h-8 rounded bg-[#041a33]/90 hover:bg-[#072c54] border border-cyan-400/40 text-cyan-200 font-silkscreen text-[9px] flex items-center justify-center cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.7)] transition-all"
          title="Reset World View"
        >
          FIT
        </button>
      </div>

      {/* ── BOTTOM TELEMETRY FOOTER BAR ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-8 z-20 flex items-center justify-between px-6 pointer-events-none"
        style={{
          borderTop: '1px solid rgba(60, 169, 232, 0.2)',
          background: 'rgba(2, 16, 32, 0.85)',
        }}
      >
        <div className="font-silkscreen text-[9px] text-cyan-400/60 tracking-wider">
          TACTICAL RADAR: <span className="text-emerald-400 font-bold">1 TARGET ACTIVE</span>
        </div>
        <div className="font-mono-hud text-[11px] text-cyan-300/40 tracking-widest hidden md:block">
          GLOBAL MERCATOR GRID // EXCLUSIVE FIXED TARGET DISPLAY
        </div>
        <div className="font-silkscreen text-[9px] text-cyan-400/60">
          ZOOM: {Math.round(zoom * 100)}%
        </div>
      </div>
    </div>
  );
}
