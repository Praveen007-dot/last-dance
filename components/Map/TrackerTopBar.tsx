'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PixelMenuButton, PixelPillBadge, PixelSquareButton } from './PixelIcons';
import { FixedLocation, TrackerThemeConfig } from '@/data/trackerConfig';

interface TrackerTopBarProps {
  location: FixedLocation;
  themeConfig: TrackerThemeConfig;
  onLocationUpdate?: (newLoc: Partial<FixedLocation>) => void;
  onThemeToggle?: () => void;
  onCenterTarget?: () => void;
}

export default function TrackerTopBar({
  location,
  themeConfig,
  onLocationUpdate,
  onThemeToggle,
  onCenterTarget,
}: TrackerTopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form states for live coordinate editing
  const [nameInput, setNameInput] = useState(location.name);
  const [latInput, setLatInput] = useState(location.lat.toString());
  const [lngInput, setLngInput] = useState(location.lng.toString());
  const [addressInput, setAddressInput] = useState(location.address);

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (!isNaN(lat) && !isNaN(lng)) {
      onLocationUpdate?.({
        name: nameInput,
        lat,
        lng,
        address: addressInput,
      });
      setIsEditing(false);
    }
  };

  return (
    <>
      {/* Top Header Bar */}
      <header className="relative z-30 w-full px-3 md:px-6 py-2.5 flex items-center justify-between select-none bg-gradient-to-b from-[#021122]/95 via-[#031932]/85 to-transparent">
        {/* Left: Pixel Hamburger Button */}
        <div className="flex items-center gap-3">
          <PixelMenuButton onClick={() => setMenuOpen(!menuOpen)} />
          <div className="hidden sm:flex flex-col font-silkscreen text-[9px] text-cyan-400/40 leading-tight">
            <span>TACTICAL GRID</span>
            <span className="text-white/30">SYS.42 // RECON</span>
          </div>
        </div>

        {/* Center: Double-Bordered Pill Badge */}
        <div className="flex items-center justify-center">
          <PixelPillBadge
            titleLeft="TEACHER"
            titleRight="TRACKER"
            isSpideyMode={false}
            onClick={onCenterTarget}
          />
        </div>

        {/* Right: Retro Pixel Square Button */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right font-silkscreen text-[9px] text-cyan-400/50 leading-tight">
            <span className="text-cyan-400">1 TARGET FIXED</span>
            <span className="text-white/40">{location.country}</span>
          </div>
          <PixelSquareButton
            onClick={() => {
              onCenterTarget?.();
            }}
            active={true}
          />
        </div>
      </header>

      {/* Slide-out Menu / Telemetry Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-0 left-0 bottom-0 w-80 md:w-96 z-40 p-5 flex flex-col justify-between overflow-y-auto"
            style={{
              background: 'rgba(3, 20, 39, 0.96)',
              borderRight: '2px solid rgba(60, 169, 232, 0.4)',
              boxShadow: '10px 0 30px rgba(0,0,0,0.8)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-pixel text-[11px] text-cyan-400 tracking-wider">
                    TARGET CONTROL
                  </span>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="font-pixel text-xs text-white/50 hover:text-white px-2 py-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* HUD Style Switcher */}
              <div className="mb-5 p-3 rounded bg-[#062444]/60 border border-cyan-500/20">
                <div className="flex items-center justify-between">
                  <span className="font-silkscreen text-xs text-cyan-200">HUD STYLE:</span>
                  <button
                    onClick={onCenterTarget}
                    className="font-pixel text-[10px] px-2.5 py-1 rounded bg-[#0e4b7b] text-cyan-300 border border-cyan-400 hover:bg-cyan-600/40 cursor-pointer"
                  >
                    🎯 FOCUS TARGET
                  </button>
                </div>
                <p className="font-mono-hud text-[11px] text-cyan-300/60 mt-1">
                  Tactical recon mode — PRISM Degree College, Visakhapatnam.
                </p>
              </div>

              {/* Fixed Target Location Info */}
              <div className="mb-5 p-4 rounded bg-[#041a33] border border-cyan-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-pixel text-[10px] text-amber-400">FIXED LOCATION</span>
                  <span className="font-mono-hud text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    {location.status}
                  </span>
                </div>

                {!isEditing ? (
                  <div className="space-y-2">
                    <h3 className="font-orbitron font-bold text-sm text-white text-glow-blue">
                      {location.name}
                    </h3>
                    <p className="font-mono-hud text-xs text-cyan-300/80 leading-relaxed">
                      {location.address}
                    </p>
                    <div className="font-mono-hud text-[11px] text-cyan-400/90 pt-2 border-t border-cyan-500/20">
                      <div>LAT: <span className="text-white font-bold">{location.lat.toFixed(6)}</span></div>
                      <div>LNG: <span className="text-white font-bold">{location.lng.toFixed(6)}</span></div>
                    </div>

                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-3 w-full py-1.5 font-pixel text-[10px] bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400 text-cyan-200 rounded cursor-pointer transition-colors"
                    >
                      ✏️ EDIT FIXED COORDINATES
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSaveLocation} className="space-y-3 pt-1">
                    <div>
                      <label className="font-silkscreen text-[10px] text-cyan-300 block mb-1">
                        Location Name
                      </label>
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="w-full bg-[#031326] border border-cyan-500/50 rounded px-2 py-1 font-mono-hud text-xs text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-silkscreen text-[10px] text-cyan-300 block mb-1">
                          Latitude
                        </label>
                        <input
                          type="text"
                          value={latInput}
                          onChange={(e) => setLatInput(e.target.value)}
                          className="w-full bg-[#031326] border border-cyan-500/50 rounded px-2 py-1 font-mono-hud text-xs text-white focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-silkscreen text-[10px] text-cyan-300 block mb-1">
                          Longitude
                        </label>
                        <input
                          type="text"
                          value={lngInput}
                          onChange={(e) => setLngInput(e.target.value)}
                          className="w-full bg-[#031326] border border-cyan-500/50 rounded px-2 py-1 font-mono-hud text-xs text-white focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-silkscreen text-[10px] text-cyan-300 block mb-1">
                        Address / Details
                      </label>
                      <textarea
                        rows={2}
                        value={addressInput}
                        onChange={(e) => setAddressInput(e.target.value)}
                        className="w-full bg-[#031326] border border-cyan-500/50 rounded px-2 py-1 font-mono-hud text-xs text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        className="flex-1 py-1 font-pixel text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white rounded cursor-pointer"
                      >
                        SAVE
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="py-1 px-3 font-pixel text-[10px] bg-white/10 hover:bg-white/20 text-white/70 rounded cursor-pointer"
                      >
                        CANCEL
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Status & Signal Telemetry */}
              <div className="space-y-2 text-xs font-mono-hud text-cyan-300/60 p-3 rounded bg-[#03162b] border border-cyan-500/10">
                <div className="flex justify-between">
                  <span>SIGNAL INTEGRITY:</span>
                  <span className="text-emerald-400 font-bold">{location.signalStrength}%</span>
                </div>
                <div className="flex justify-between">
                  <span>ENCRYPTION:</span>
                  <span className="text-cyan-300">QUANTUM 4096</span>
                </div>
                <div className="flex justify-between">
                  <span>WORLD PINS:</span>
                  <span className="text-amber-300 font-bold">1 FIXED EXCLUSIVE</span>
                </div>
              </div>
            </div>

            {/* Bottom button to center */}
            <div className="pt-4 border-t border-cyan-500/20">
              <button
                onClick={() => {
                  onCenterTarget?.();
                  setMenuOpen(false);
                }}
                className="w-full py-2.5 font-pixel text-xs bg-cyan-600 hover:bg-cyan-500 text-white rounded cursor-pointer shadow-[0_0_12px_#3ca9e8] transition-all"
              >
                🎯 FOCUS FIXED TARGET
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
