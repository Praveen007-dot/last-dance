'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FixedLocation } from '@/data/trackerConfig';

interface LeafletTrackerMapProps {
  location: FixedLocation;
  onMarkerClick?: (location: FixedLocation) => void;
  focusCounter?: number;
}

// Global Tactical Continent & Ocean Labels matching the Spidey Tracker screenshot
const TACTICAL_WORLD_LABELS = [
  { name: 'NORTH AMERICA', coords: [48, -102] as [number, number], isOcean: false },
  { name: 'SOUTH AMERICA', coords: [-15, -60] as [number, number], isOcean: false },
  { name: 'EUROPE', coords: [55, 18] as [number, number], isOcean: false },
  { name: 'AFRICA', coords: [4, 21] as [number, number], isOcean: false },
  { name: 'ASIA', coords: [50, 86] as [number, number], isOcean: false },
  { name: 'OCEANIA', coords: [-25, 134] as [number, number], isOcean: false },
  { name: 'Atlantic Ocean', coords: [22, -38] as [number, number], isOcean: true },
  { name: 'Pacific Ocean', coords: [8, -145] as [number, number], isOcean: true },
  { name: 'Indian Ocean', coords: [-16, 76] as [number, number], isOcean: true },
];

export default function LeafletTrackerMap({
  location,
  onMarkerClick,
  focusCounter = 0,
}: LeafletTrackerMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const labelLayerRef = useRef<L.LayerGroup | null>(null);
  const gridLayerRef = useRef<L.LayerGroup | null>(null);

  const [currentZoom, setCurrentZoom] = useState<number>(3);
  const [viewState, setViewState] = useState<'world' | 'target'>('world');
  const [isFlying, setIsFlying] = useState(false);

  // Center on World or Target
  const flyToWorld = useCallback(() => {
    if (!mapRef.current) return;
    setIsFlying(true);
    setViewState('world');
    // Fit full world bounds (Pacific to Pacific)
    mapRef.current.fitBounds(
      [
        [-55, -170],
        [72, 190],
      ],
      {
        animate: true,
        duration: 2.8,
      }
    );
    setTimeout(() => setIsFlying(false), 2900);
  }, []);

  const flyToTarget = useCallback(() => {
    if (!mapRef.current) return;
    setIsFlying(true);
    setViewState('target');
    mapRef.current.flyTo([location.lat, location.lng], 18, {
      animate: true,
      duration: 3.5,
      easeLinearity: 0.25,
    });
    setTimeout(() => setIsFlying(false), 3600);
  }, [location.lat, location.lng]);

  // Initial map setup
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(containerRef.current, {
      center: [20, 15],
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
      maxBounds: [
        [-85, -200],
        [85, 200],
      ],
      maxBoundsViscosity: 0.8,
    });
    mapRef.current = map;

    // Fit initial world view to show the complete world map
    map.fitBounds(
      [
        [-55, -170],
        [72, 190],
      ],
      {
        animate: false,
      }
    );

    // CartoDB Dark Matter base tiles
    const tileLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        subdomains: 'abcd',
        maxZoom: 19,
        className: 'spidey-map-tiles',
      }
    ).addTo(map);

    // ── TACTICAL GEOGRAPHIC GRID LAYER ──
    const gridGroup = L.layerGroup().addTo(map);
    gridLayerRef.current = gridGroup;

    // Equator 0° Line (Dashed cyan)
    L.polyline(
      [
        [0, -180],
        [0, 180],
      ],
      {
        color: '#3ca9e8',
        weight: 1.8,
        dashArray: '8, 6',
        opacity: 0.6,
      }
    ).addTo(gridGroup);

    // Tropic of Cancer 23.4368° N
    L.polyline(
      [
        [23.4368, -180],
        [23.4368, 180],
      ],
      {
        color: '#3ca9e8',
        weight: 1,
        dashArray: '6, 4',
        opacity: 0.35,
      }
    ).addTo(gridGroup);

    // Tropic of Capricorn 23.4368° S
    L.polyline(
      [
        [-23.4368, -180],
        [-23.4368, 180],
      ],
      {
        color: '#3ca9e8',
        weight: 1,
        dashArray: '6, 4',
        opacity: 0.35,
      }
    ).addTo(gridGroup);

    // Dotted Longitude Lines every 30 degrees
    for (let lng = -150; lng <= 150; lng += 30) {
      L.polyline(
        [
          [-80, lng],
          [80, lng],
        ],
        {
          color: '#3ca9e8',
          weight: 1,
          dashArray: '2, 6',
          opacity: 0.22,
        }
      ).addTo(gridGroup);
    }

    // ── TACTICAL LABELS LAYER (Continents & Oceans) ──
    const labelGroup = L.layerGroup().addTo(map);
    labelLayerRef.current = labelGroup;

    TACTICAL_WORLD_LABELS.forEach((item) => {
      const labelHtml = item.isOcean
        ? `<div style="
            font-family:'Share Tech Mono',monospace;
            font-size:11px;
            letter-spacing:0.18em;
            color:rgba(60,169,232,0.45);
            white-space:nowrap;
            pointer-events:none;
            transform:translate(-50%, -50%);
          ">${item.name}</div>`
        : `<div style="
            font-family:'Silkscreen',monospace;
            font-size:11px;
            font-weight:bold;
            letter-spacing:0.2em;
            color:rgba(60,169,232,0.65);
            text-shadow:0 0 8px rgba(60,169,232,0.5), 0 2px 4px #000;
            white-space:nowrap;
            pointer-events:none;
            transform:translate(-50%, -50%);
          ">${item.name}</div>`;

      const labelIcon = L.divIcon({
        html: labelHtml,
        className: 'tactical-map-label',
        iconSize: [140, 20],
        iconAnchor: [70, 10],
      });

      L.marker(item.coords, { icon: labelIcon, interactive: false }).addTo(labelGroup);
    });

    // ── THE EXCLUSIVE FIXED LOCATION MARKER ──
    const markerHtml = `
      <div class="relative flex items-center justify-center select-none" style="width:60px;height:60px;cursor:pointer;">
        <!-- Large animated pulsing target reticle ring -->
        <div style="
          position:absolute;inset:-12px;border-radius:50%;
          border:2.5px dashed #3ca9e8;
          box-shadow:0 0 20px rgba(60,169,232,0.9);
          animation:target-reticle-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          pointer-events:none;
        "></div>

        <!-- Radar beacon spotlight aura -->
        <div style="
          position:absolute;inset:-6px;border-radius:50%;
          background:radial-gradient(circle, rgba(60,169,232,0.45) 0%, transparent 75%);
          pointer-events:none;
        "></div>

        <!-- Hexagonal Pixel SVG Token (Matching screenshot) -->
        <svg width="48" height="48" viewBox="0 0 38 38" fill="none" style="filter:drop-shadow(0 4px 8px rgba(0,0,0,0.95));">
          <polygon
            points="19,2 34,10.5 34,27.5 19,36 4,27.5 4,10.5"
            fill="#ffffff"
            stroke="#000000"
            stroke-width="3.5"
            stroke-linejoin="round"
          />
          <g fill="#121212">
            <circle cx="19" cy="19" r="4.5" />
            <circle cx="19" cy="13" r="2.5" />
            <path d="M16 16L11 13M16 18L9 18M16 20L10 24" stroke="#121212" stroke-width="2" stroke-linecap="round" />
            <path d="M22 16L27 13M22 18L29 18M22 20L28 24" stroke="#121212" stroke-width="2" stroke-linecap="round" />
          </g>
        </svg>
      </div>
    `;

    const markerIcon = L.divIcon({
      html: markerHtml,
      className: 'pixel-custom-marker',
      iconSize: [60, 60],
      iconAnchor: [30, 30],
      tooltipAnchor: [0, -32],
    });

    const marker = L.marker([location.lat, location.lng], { icon: markerIcon })
      .addTo(map)
      .bindTooltip(
        `<div style="
          background:#04162c;
          border:2px solid #3ca9e8;
          color:#ffffff;
          padding:6px 14px;
          border-radius:6px;
          box-shadow:0 0 20px rgba(60,169,232,0.7), 0 4px 10px rgba(0,0,0,0.8);
          font-family:'Press Start 2P', monospace;
          font-size:9px;
          letter-spacing:0.08em;
          text-align:center;
          white-space:nowrap;
        ">
          <div style="color:#00ff9d;margin-bottom:3px;font-size:8px;">● TARGET LOCKED</div>
          <div style="color:#ffffff;font-size:10px;font-weight:bold;">${location.name.toUpperCase()}</div>
          <div style="color:#3ca9e8;font-family:'Share Tech Mono',monospace;font-size:11px;margin-top:2px;letter-spacing:0.12em;">
            ${location.lat.toFixed(4)}° N, ${location.lng.toFixed(4)}° E
          </div>
        </div>`,
        { permanent: true, direction: 'top', className: 'pixel-tooltip' }
      );

    marker.on('click', () => {
      onMarkerClick?.(location);
    });
    markerRef.current = marker;

    // Track zoom changes to hide continent labels at street level
    map.on('zoomend', () => {
      const z = map.getZoom();
      setCurrentZoom(z);
      if (z >= 9) {
        if (map.hasLayer(labelGroup)) map.removeLayer(labelGroup);
        if (map.hasLayer(gridGroup)) map.removeLayer(gridGroup);
        setViewState('target');
      } else {
        if (!map.hasLayer(labelGroup)) map.addLayer(labelGroup);
        if (!map.hasLayer(gridGroup)) map.addLayer(gridGroup);
        if (z <= 4) setViewState('world');
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync marker position
  useEffect(() => {
    if (!markerRef.current) return;
    markerRef.current.setLatLng([location.lat, location.lng]);
  }, [location.lat, location.lng]);

  // Handle focusCounter triggers (from radar or top bar)
  useEffect(() => {
    if (focusCounter > 0) {
      flyToTarget();
    }
  }, [focusCounter, flyToTarget]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#03162b]">
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

      {/* ── LEAFLET MAP CONTAINER ── */}
      <div ref={containerRef} className="w-full h-full" style={{ background: '#03162b' }} />

      {/* ── QUICK CINEMATIC PERSPECTIVE CONTROLS (Top-Right HUD) ── */}
      <div className="absolute top-12 right-4 z-20 flex flex-col gap-2 select-none pointer-events-auto">
        {/* World Map View Button */}
        <button
          onClick={flyToWorld}
          disabled={isFlying}
          className={`px-3 py-2 rounded font-pixel text-[9px] flex items-center gap-1.5 cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.8)] transition-all ${
            viewState === 'world'
              ? 'bg-cyan-500/30 border-2 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(60,169,232,0.5)]'
              : 'bg-[#041a33]/90 hover:bg-[#072c54] border border-cyan-400/40 text-cyan-300/80 hover:text-white'
          }`}
          title="Zoom out to Full Tactical World Map"
        >
          <span>🌍</span>
          <span>WORLD MAP</span>
        </button>

        {/* Target Zoom Button */}
        <button
          onClick={flyToTarget}
          disabled={isFlying}
          className={`px-3 py-2 rounded font-pixel text-[9px] flex items-center gap-1.5 cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.8)] transition-all ${
            viewState === 'target'
              ? 'bg-emerald-500/30 border-2 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
              : 'bg-cyan-600/30 hover:bg-cyan-600/60 border border-cyan-400 text-cyan-200 hover:text-white'
          }`}
          title="Cinematic Zoom to Target Campus"
        >
          <span>🎯</span>
          <span>ZOOM TARGET</span>
        </button>

        {/* Incremental Zoom Buttons */}
        <div className="flex gap-1.5 mt-1">
          <button
            onClick={() => mapRef.current?.zoomIn()}
            className="flex-1 h-8 rounded bg-[#041a33]/90 hover:bg-[#072c54] border border-cyan-400/40 text-cyan-200 font-pixel text-xs flex items-center justify-center cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.8)] transition-all hover:scale-105 active:scale-95"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => mapRef.current?.zoomOut()}
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
          <span>TACTICAL SATELLITE:</span>
          <span className="text-white font-bold">1 TARGET FIXED & LOCKED</span>
        </div>
        <div className="font-mono-hud text-[11px] text-cyan-300/50 tracking-widest hidden md:block">
          SECTOR: {location.region.toUpperCase()} // EXCLUSIVE TELEMETRY
        </div>
        <div className="font-silkscreen text-[9px] text-cyan-400/80">
          VIEW: <span className="text-cyan-300 font-bold">{viewState.toUpperCase()}</span> [
          {currentZoom}x]
        </div>
      </div>
    </div>
  );
}
