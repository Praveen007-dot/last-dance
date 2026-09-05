'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Teacher } from '@/types/teacher';
import { teachers } from '@/data/teachers';
import { PRIMARY_FIXED_LOCATION, TRACKER_THEME, FixedLocation, TrackerThemeConfig } from '@/data/trackerConfig';
import TrackerTopBar from './TrackerTopBar';
import TacticalWebRadar from './TacticalWebRadar';
import LocationDossierModal from './LocationDossierModal';

// Load IndiaMap dynamically (Leaflet requires window/DOM)
const IndiaMap = dynamic(() => import('./IndiaMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#03162b] text-cyan-400">
      <div className="w-12 h-12 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin mb-4" />
      <span className="font-pixel text-xs tracking-wider animate-pulse">
        CALIBRATING OPENSTREETMAP SATELLITE...
      </span>
    </div>
  ),
});

interface MapSectionProps {
  discovered: Set<string>;
  onMarkerClick: (teacher: Teacher) => void;
  onMapReady: () => void;
}

export default function MapSection({
  discovered,
  onMarkerClick,
  onMapReady,
}: MapSectionProps) {
  const [currentLocation, setCurrentLocation] = useState<FixedLocation>(PRIMARY_FIXED_LOCATION);
  const [themeConfig, setThemeConfig] = useState<TrackerThemeConfig>(TRACKER_THEME);
  const [selectedLocation, setSelectedLocation] = useState<FixedLocation | null>(null);
  const [focusCounter, setFocusCounter] = useState(0);

  // Center / Zoom in on the fixed location
  const handleCenterTarget = useCallback(() => {
    setFocusCounter((prev) => prev + 1);
  }, []);

  // Toggle theme mode (Spidey vs Tactical)
  const handleToggleTheme = useCallback(() => {
    setThemeConfig((prev) => ({
      ...prev,
      mode: prev.mode === 'spidey' ? 'tactical' : 'spidey',
    }));
  }, []);

  // Update fixed location coordinates
  const handleLocationUpdate = useCallback((newLoc: Partial<FixedLocation>) => {
    setCurrentLocation((prev) => ({
      ...prev,
      ...newLoc,
    }));
  }, []);

  // Trigger tribute or faculty selection
  const handleStartFacultyRecon = useCallback(() => {
    setSelectedLocation(null);
    const nextTeacher = teachers.find((t) => !discovered.has(t.id)) || teachers[0];
    if (nextTeacher) {
      onMarkerClick(nextTeacher);
    }
  }, [discovered, onMarkerClick]);

  return (
    <motion.div
      className="fixed inset-0 z-20 flex flex-col overflow-hidden select-none"
      style={{ background: '#03162b' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* ── 1. TOP RETRO HUD HEADER ── */}
      <TrackerTopBar
        location={currentLocation}
        themeConfig={themeConfig}
        onLocationUpdate={handleLocationUpdate}
        onThemeToggle={handleToggleTheme}
        onCenterTarget={handleCenterTarget}
      />

      {/* ── 2. PREVIOUS LEAFLET MAP WITH USER COORDINATES & AUTO-ZOOM ── */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <IndiaMap
          teachers={teachers}
          discovered={discovered}
          onMarkerClick={onMarkerClick}
          onReady={onMapReady}
          focusTrigger={focusCounter}
        />

        {/* ── 3. BOTTOM-RIGHT SPIDER-WEB TACTICAL RADAR ── */}
        <div className="absolute bottom-10 right-4 md:bottom-12 md:right-8 z-30 pointer-events-auto">
          <TacticalWebRadar
            onPingTarget={handleCenterTarget}
            onToggleView={handleCenterTarget}
          />
        </div>

        {/* ── 4. QUICK TARGET HUD CARD (Bottom-Left) ── */}
        <div
          className="absolute bottom-10 left-4 md:bottom-12 md:left-8 z-30 p-3 rounded pointer-events-auto max-w-xs hidden sm:block"
          style={{
            background: 'rgba(3, 22, 43, 0.9)',
            border: '1.5px solid rgba(60, 169, 232, 0.4)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-cyan-500/20">
            <span className="font-pixel text-[9px] text-cyan-400">FIXED COORDINATES</span>
            <span className="font-silkscreen text-[9px] text-emerald-400">
              ● {currentLocation.status}
            </span>
          </div>

          <p className="font-orbitron text-xs font-bold text-white truncate">
            {currentLocation.name}
          </p>
          <p className="font-mono-hud text-[11px] text-cyan-300/70 truncate">
            {currentLocation.address}
          </p>

          <div className="mt-2 pt-1.5 border-t border-cyan-500/20 flex items-center justify-between">
            <span className="font-mono-hud text-[10px] text-cyan-400/90 font-bold">
              {currentLocation.lat.toFixed(6)}°N, {currentLocation.lng.toFixed(6)}°E
            </span>
            <button
              onClick={() => setSelectedLocation(currentLocation)}
              className="font-pixel text-[9px] text-cyan-300 hover:text-white px-2 py-0.5 rounded bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400/40 cursor-pointer transition-colors"
            >
              DETAILS
            </button>
          </div>
        </div>
      </div>

      {/* ── 5. LOCATION DOSSIER MODAL ── */}
      <AnimatePresence>
        {selectedLocation && (
          <LocationDossierModal
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
            onEnterTribute={handleStartFacultyRecon}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
