'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { Teacher } from '@/types/teacher';
import { TARGET_LOCATION } from '@/data/teachers';

interface IndiaMapProps {
  teachers: Teacher[];
  discovered: Set<string>;
  onMarkerClick: (teacher: Teacher) => void;
  onReady: () => void;
  focusTrigger?: number;
}

// Helper: build teacher logo marker HTML
function buildMarkerHtml(isDone: boolean) {
  if (isDone) {
    return `
      <div style="width:34px;height:34px;position:relative;display:flex;align-items:center;justify-content:center;cursor:pointer;">
        <svg width="34" height="34" viewBox="0 0 38 38" fill="none" style="filter:drop-shadow(0 2px 6px rgba(0,0,0,0.9));">
          <polygon points="19,2 34,10.5 34,27.5 19,36 4,27.5 4,10.5"
            fill="#16a34a" stroke="#4ade80" stroke-width="2.5" stroke-linejoin="round"/>
          <text x="19" y="25" text-anchor="middle" fill="#ffffff" font-size="15"
            font-family="monospace" font-weight="bold">✓</text>
        </svg>
      </div>`;
  }
  return `
    <div style="width:40px;height:40px;position:relative;display:flex;align-items:center;justify-content:center;cursor:pointer;">
      <!-- Pulsing cyan target reticle ring -->
      <div style="
        position:absolute;inset:-6px;border-radius:50%;
        border:2px dashed #3ca9e8;
        box-shadow:0 0 10px rgba(60,169,232,0.8);
        animation:target-reticle-pulse 2s cubic-bezier(0.4,0,0.6,1) infinite;
        pointer-events:none;
      "></div>
      <!-- Spotlight aura -->
      <div style="
        position:absolute;inset:-3px;border-radius:50%;
        background:radial-gradient(circle,rgba(60,169,232,0.35) 0%,transparent 75%);
        pointer-events:none;
      "></div>
      <!-- Hexagonal Pixel SVG Token with Graduation Cap -->
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none"
        style="filter:drop-shadow(0 3px 6px rgba(0,0,0,0.9));">
        <polygon points="19,2 34,10.5 34,27.5 19,36 4,27.5 4,10.5"
          fill="#ffffff" stroke="#000000" stroke-width="3" stroke-linejoin="round"/>
        <!-- Graduation Cap Board (rhombus) -->
        <polygon points="19,9 28,14 19,19 10,14" fill="#121212"/>
        <!-- Skullcap -->
        <path d="M13 16 V21 Q13 25 19 26.5 Q25 25 25 21 V16"
          fill="#121212" opacity="0.75"/>
        <!-- Tassel -->
        <line x1="27" y1="15" x2="27" y2="21" stroke="#f7941d" stroke-width="2" stroke-linecap="round"/>
        <circle cx="27" cy="22" r="2" fill="#f7941d"/>
      </svg>
    </div>`;
}

function buildTooltipHtml(teacher: Teacher, isDone: boolean) {
  if (isDone) {
    return `
      <div style="background:#021e14;border:1.5px solid #4ade80;color:#fff;
        padding:5px 12px;border-radius:6px;
        box-shadow:0 0 14px rgba(74,222,128,0.6),0 3px 8px rgba(0,0,0,0.9);
        font-family:'Press Start 2P',monospace;font-size:9px;text-align:center;white-space:nowrap;">
        <div style="color:#4ade80;font-size:8px;margin-bottom:2px;">✓ PRISM COLLEGE BLOCK</div>
        <div style="font-size:10px;font-weight:bold;">${teacher.name.toUpperCase()}</div>
        <div style="color:#86efac;font-size:8px;margin-top:2px;">${teacher.subject}</div>
      </div>`;
  }
  return `
    <div style="background:#04162c;border:2px solid #3ca9e8;color:#fff;
      padding:6px 14px;border-radius:6px;
      box-shadow:0 0 16px rgba(60,169,232,0.7),0 3px 8px rgba(0,0,0,0.9);
      font-family:'Press Start 2P',monospace;font-size:9px;text-align:center;white-space:nowrap;">
      <div style="color:#00ff9d;margin-bottom:3px;font-size:8px;">● PRISM COLLEGE BLOCK</div>
      <div style="font-size:10px;font-weight:bold;">${teacher.name.toUpperCase()}</div>
      <div style="color:#3ca9e8;font-size:9px;margin-top:2px;">${teacher.subject}</div>
      <div style="color:#ffb800;font-size:8px;margin-top:3px;">[ CLICK TO IDENTIFY ]</div>
    </div>`;
}

export default function IndiaMap({
  teachers,
  discovered,
  onMarkerClick,
  onReady,
  focusTrigger = 0,
}: IndiaMapProps) {
  const mapRef        = useRef<L.Map | null>(null);
  const containerRef  = useRef<HTMLDivElement>(null);
  const markersRef    = useRef<Map<string, L.Marker>>(new Map());

  // Always-fresh refs — prevent stale-closure bugs in Leaflet click handlers
  const discoveredRef    = useRef<Set<string>>(discovered);
  const onMarkerClickRef = useRef(onMarkerClick);
  discoveredRef.current    = discovered;
  onMarkerClickRef.current = onMarkerClick;

  const [currentZoom, setCurrentZoom] = useState(2);
  const [viewState,   setViewState]   = useState<'world' | 'target'>('world');
  const [isFlying,    setIsFlying]    = useState(false);

  // Fly to college campus
  const flyToTarget = useCallback((zoomLevel = 18) => {
    if (!mapRef.current) return;
    setIsFlying(true);
    setViewState('target');
    mapRef.current.flyTo([TARGET_LOCATION.lat, TARGET_LOCATION.lng], zoomLevel, {
      animate: true, duration: 3.5, easeLinearity: 0.22,
    });
    setTimeout(() => setIsFlying(false), 3700);
  }, []);

  // Fly out to global world view
  const flyToWorld = useCallback(() => {
    if (!mapRef.current) return;
    setIsFlying(true);
    setViewState('world');
    mapRef.current.flyTo([22.0, 79.0], 3, {
      animate: true, duration: 3.2, easeLinearity: 0.25,
    });
    setTimeout(() => setIsFlying(false), 3400);
  }, []);

  // ── Init Leaflet map ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [20.5937, 78.9629],
      zoom: 3,
      minZoom: 2,
      maxZoom: 19,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      touchZoom: true,
      dragging: true,
      worldCopyJump: false,
      maxBounds: [[-85, -190], [85, 190]],
      maxBoundsViscosity: 0.8,
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      subdomains: 'abc',
      maxZoom: 19,
      className: 'osm-tactical-tiles',
    }).addTo(map);

    map.on('zoomend', () => {
      const z = map.getZoom();
      setCurrentZoom(Math.round(z));
      setViewState(z >= 10 ? 'target' : 'world');
    });

    onReady();

    // ── Place one Leaflet marker per teacher ─────────────────────────────────
    teachers.forEach((teacher) => {
      const isDone = discoveredRef.current.has(teacher.id);

      const icon = L.divIcon({
        html:        buildMarkerHtml(isDone),
        className:   'pixel-custom-marker',
        iconSize:    isDone ? [34, 34] : [40, 40],
        iconAnchor:  isDone ? [17, 17] : [20, 20],
        tooltipAnchor: [0, -22],
      });

      const marker = L.marker([teacher.location.lat, teacher.location.lng], { icon })
        .addTo(map)
        .bindTooltip(buildTooltipHtml(teacher, isDone), {
          permanent: false,
          direction: 'top',
          className: 'pixel-tooltip',
        });

      marker.on('click', () => {
        if (discoveredRef.current.has(teacher.id)) {
          onMarkerClickRef.current(teacher);
          return;
        }
        const z = map.getZoom();
        if (z < 18) {
          map.flyTo([teacher.location.lat, teacher.location.lng], 19, {
            animate: true, duration: 2.2,
          });
        } else {
          onMarkerClickRef.current(teacher);
        }
      });

      markersRef.current.set(teacher.id, marker);
    });

    // Cinematic auto-zoom on mount: world → PRISM College Block
    const flyTimer = setTimeout(() => {
      map.flyTo([TARGET_LOCATION.lat, TARGET_LOCATION.lng], 19, {
        animate: true, duration: 4.2, easeLinearity: 0.18,
      });
      setTimeout(() => setViewState('target'), 4400);
    }, 1800);

    return () => {
      clearTimeout(flyTimer);
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Refresh marker icons when discovered set changes ─────────────────────
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const teacher = teachers.find((t) => t.id === id);
      if (!teacher) return;
      const isDone = discovered.has(id);
      marker.setIcon(L.divIcon({
        html:       buildMarkerHtml(isDone),
        className:  'pixel-custom-marker',
        iconSize:   isDone ? [34, 34] : [40, 40],
        iconAnchor: isDone ? [17, 17] : [20, 20],
        tooltipAnchor: [0, -22],
      }));
      marker.unbindTooltip();
      marker.bindTooltip(buildTooltipHtml(teacher, isDone), {
        permanent: false,
        direction: 'top',
        className: 'pixel-tooltip',
      });
    });
  }, [discovered, teachers]);

  // External focus trigger (radar / top-bar button)
  useEffect(() => {
    if (focusTrigger > 0) flyToTarget(18);
  }, [focusTrigger, flyToTarget]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-[#03162b]">

      {/* TOP RULER BAR (Responsive text & padding) */}
      <div
        className="absolute top-0 left-0 right-0 h-8 sm:h-9 flex items-center pointer-events-none px-2 sm:px-4"
        style={{
          zIndex: 1000,
          borderBottom: '1.5px solid rgba(60,169,232,0.3)',
          background: 'linear-gradient(to bottom,rgba(2,16,33,0.95),rgba(3,21,41,0.85))',
          backdropFilter: 'blur(4px)',
        }}
      >
        <div className="w-full flex justify-between items-center text-[9px] sm:text-[10px] font-silkscreen text-cyan-400/70">
          <div className="flex items-center gap-1.5 sm:gap-3">
            <span className="tracking-widest hidden xs:inline">|...|</span>
            <span className="text-cyan-300/80">PRISM RECON</span>
            <span className="tracking-widest hidden xs:inline">|...|</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span className="tracking-widest">|...|</span>
            <span className="text-cyan-300 font-bold">INDIA // VISAKHAPATNAM</span>
            <span className="tracking-widest">|...|</span>
            <span className="text-cyan-300 font-bold">DWARAKA NAGAR</span>
            <span className="tracking-widest">|...|</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold animate-pulse">
              {discovered.size}/{teachers.length} FOUND
            </span>
          </div>
        </div>
      </div>

      {/* LEFT RULER (Hidden on mobile to save screen real estate) */}
      <div
        className="hidden sm:flex absolute top-9 left-0 bottom-0 w-8 pointer-events-none flex-col justify-between py-6 px-1.5"
        style={{
          zIndex: 1000,
          borderRight: '1px solid rgba(60,169,232,0.25)',
          background: 'rgba(3,21,41,0.5)',
        }}
      >
        <span className="font-silkscreen text-[9px] text-cyan-400/50">75°N</span>
        <div className="flex flex-col gap-1 font-mono text-[8px] text-cyan-400/20">
          <span>|..</span><span>|..</span><span>|..</span>
        </div>
        <span className="font-silkscreen text-[9px] text-cyan-400/70">EQ 0°</span>
        <div className="flex flex-col gap-1 font-mono text-[8px] text-cyan-400/20">
          <span>|..</span><span>|..</span><span>|..</span>
        </div>
        <span className="font-silkscreen text-[9px] text-cyan-400/50">60°S</span>
      </div>

      {/* LEAFLET MAP CANVAS */}
      <div ref={containerRef} className="w-full h-full" style={{ background: '#03162b' }} />

      {/* ZOOM / PERSPECTIVE BUTTONS — top-right, responsive */}
      <div
        className="absolute top-10 sm:top-12 right-2 sm:right-4 flex flex-col gap-1.5 sm:gap-2 pointer-events-auto"
        style={{ zIndex: 1000 }}
      >
        {/* World Map */}
        <button
          onClick={flyToWorld}
          disabled={isFlying}
          className={[
            'px-2.5 sm:px-3 py-1.5 sm:py-2 rounded font-pixel text-[8px] sm:text-[9px] flex items-center gap-1 sm:gap-1.5',
            'shadow-[0_2px_10px_rgba(0,0,0,0.8)] transition-all duration-200',
            viewState === 'world'
              ? 'bg-cyan-500/30 border-2 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(60,169,232,0.5)]'
              : 'bg-[#041a33]/90 hover:bg-[#072c54] border border-cyan-400/40 text-cyan-300/80 hover:text-white',
            isFlying ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          ].join(' ')}
        >
          <span>🌍</span>
          <span>WORLD</span>
        </button>

        {/* Zoom to Campus */}
        <button
          onClick={() => flyToTarget(18)}
          disabled={isFlying}
          className={[
            'px-2.5 sm:px-3 py-1.5 sm:py-2 rounded font-pixel text-[8px] sm:text-[9px] flex items-center gap-1 sm:gap-1.5',
            'shadow-[0_2px_10px_rgba(0,0,0,0.8)] transition-all duration-200',
            viewState === 'target'
              ? 'bg-emerald-500/30 border-2 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(10,185,129,0.5)]'
              : 'bg-cyan-600/30 hover:bg-cyan-600/60 border border-cyan-400 text-cyan-200 hover:text-white',
            isFlying ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          ].join(' ')}
        >
          <span>🎯</span>
          <span>CAMPUS</span>
        </button>

        {/* + / − incremental zoom */}
        <div className="flex gap-1 mt-0.5">
          <button
            onClick={() => mapRef.current?.zoomIn()}
            className="flex-1 h-7 sm:h-8 rounded bg-[#041a33]/90 hover:bg-[#072c54] border border-cyan-400/40 text-cyan-200 font-pixel text-xs flex items-center justify-center cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.8)] transition-all hover:scale-105 active:scale-95"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => mapRef.current?.zoomOut()}
            className="flex-1 h-7 sm:h-8 rounded bg-[#041a33]/90 hover:bg-[#072c54] border border-cyan-400/40 text-cyan-200 font-pixel text-xs flex items-center justify-center cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.8)] transition-all hover:scale-105 active:scale-95"
            title="Zoom Out"
          >
            −
          </button>
        </div>
      </div>

      {/* BOTTOM TELEMETRY FOOTER (Responsive) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-7 sm:h-8 flex items-center justify-between px-3 sm:px-6 pointer-events-none"
        style={{
          zIndex: 1000,
          borderTop: '1px solid rgba(60,169,232,0.25)',
          background: 'rgba(2,16,32,0.92)',
          backdropFilter: 'blur(3px)',
        }}
      >
        <div className="font-silkscreen text-[8px] sm:text-[9px] text-cyan-400/80 tracking-wider flex items-center gap-1.5 sm:gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden xs:inline">LOCATION:</span>
          <span className="text-white font-bold truncate max-w-[170px] sm:max-w-none">
            {TARGET_LOCATION.name.toUpperCase()}
          </span>
        </div>
        <div className="font-mono text-[10px] text-cyan-300/40 tracking-widest hidden md:block">
          {TARGET_LOCATION.lat.toFixed(6)}° N &nbsp;{TARGET_LOCATION.lng.toFixed(6)}° E
        </div>
        <div className="font-silkscreen text-[8px] sm:text-[9px] text-cyan-400/80">
          ZOOM: {currentZoom}x
        </div>
      </div>
    </div>
  );
}
