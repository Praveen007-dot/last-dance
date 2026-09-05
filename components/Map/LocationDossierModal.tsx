'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FixedLocation } from '@/data/trackerConfig';
import { PixelHexMarker } from './PixelIcons';

interface LocationDossierModalProps {
  location: FixedLocation;
  onClose: () => void;
  onEnterTribute?: () => void;
}

export default function LocationDossierModal({
  location,
  onClose,
  onEnterTribute,
}: LocationDossierModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(2, 13, 25, 0.85)',
        backdropFilter: 'blur(6px)',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg p-6 rounded-lg select-none"
        style={{
          background: '#04172c',
          border: '2px solid #3ca9e8',
          boxShadow: '0 0 30px rgba(60, 169, 232, 0.4), inset 0 0 20px rgba(60, 169, 232, 0.1)',
        }}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/30">
          <div className="flex items-center gap-3">
            <PixelHexMarker type="white" size={32} />
            <div>
              <span className="font-pixel text-[11px] text-cyan-400 tracking-wider block">
                TARGET IDENTIFIED
              </span>
              <span className="font-silkscreen text-[9px] text-white/50">
                {location.codename || 'FIXED TELEMETRY NODE'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white font-pixel text-xs flex items-center justify-center cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Location Content */}
        <div className="py-4 space-y-4">
          <div>
            <h2 className="font-orbitron text-xl font-bold text-white text-glow-blue tracking-wide">
              {location.name}
            </h2>
            <p className="font-mono-hud text-xs text-amber-400 mt-0.5 tracking-wider">
              {location.category || 'ACADEMIC FACILITY // HEADQUARTERS'}
            </p>
          </div>

          {/* Coordinates Block */}
          <div className="grid grid-cols-2 gap-2 p-3 rounded bg-[#021020] border border-cyan-500/20 font-mono-hud text-xs">
            <div>
              <span className="text-cyan-400/60 block text-[10px]">LATITUDE:</span>
              <span className="text-white font-bold text-sm tracking-wider">
                {location.lat.toFixed(6)}° N
              </span>
            </div>
            <div>
              <span className="text-cyan-400/60 block text-[10px]">LONGITUDE:</span>
              <span className="text-white font-bold text-sm tracking-wider">
                {location.lng.toFixed(6)}° E
              </span>
            </div>
          </div>

          {/* Address */}
          <div>
            <span className="font-silkscreen text-[10px] text-cyan-300 block mb-1">
              GROUND ADDRESS:
            </span>
            <p className="font-mono-hud text-xs text-cyan-100/80 leading-relaxed bg-[#021020] p-2.5 rounded border border-cyan-500/20">
              {location.address}
            </p>
          </div>

          {/* Telemetry Stats */}
          {location.stats && (
            <div className="grid grid-cols-2 gap-2 text-xs font-mono-hud">
              <div className="flex justify-between p-2 rounded bg-[#062444]/40 border border-cyan-500/10">
                <span className="text-cyan-400/60">CLEARANCE:</span>
                <span className="text-emerald-400 font-bold">{location.stats.clearance}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#062444]/40 border border-cyan-500/10">
                <span className="text-cyan-400/60">PERSONNEL:</span>
                <span className="text-cyan-300 font-bold">{location.stats.personnel}</span>
              </div>
            </div>
          )}

          {/* Description */}
          <p className="font-mono-hud text-xs text-cyan-300/70 italic border-l-2 border-cyan-400 pl-3 py-1">
            &quot;{location.description}&quot;
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-cyan-500/30 flex gap-3">
          {onEnterTribute && (
            <button
              onClick={onEnterTribute}
              className="flex-1 py-2.5 px-4 font-pixel text-xs bg-cyan-600 hover:bg-cyan-500 text-white rounded cursor-pointer transition-all shadow-[0_0_15px_#3ca9e8]"
            >
              🚀 INITIATE FACULTY SCAN
            </button>
          )}
          <button
            onClick={onClose}
            className="py-2.5 px-5 font-pixel text-xs bg-white/10 hover:bg-white/20 text-white/80 rounded cursor-pointer transition-colors"
          >
            RETURN
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
