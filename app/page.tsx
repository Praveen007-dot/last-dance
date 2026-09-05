'use client';

import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTeacherFlow } from '@/hooks/useTeacherFlow';
import { preloadAllVoices } from '@/hooks/useCartesiaSpeech';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import BootSequence from '@/components/Boot/BootSequence';
import HeroSection from '@/components/Hero/HeroSection';
import ScanOverlay from '@/components/Map/ScanOverlay';
import MapSection from '@/components/Map/MapSection';
import DetectionOverlay from '@/components/Detection/DetectionOverlay';
import RPGCard from '@/components/RPG/RPGCard';
import FinalScreen from '@/components/FinalTribute/FinalScreen';
import AudioController from '@/components/Audio/AudioController';

export default function HomePage() {
  const {
    phase,
    setPhase,
    activeTeacher,
    discovered,
    enterTribute,
    onMapReady,
    selectTeacher,
    openTeacherCard,
    onDetectionComplete,
    nextTeacher,
    prevTeacher,
    revisitAllCards,
    returnToComplete,
  } = useTeacherFlow();

  useEffect(() => {
    preloadAllVoices();
    const handleGesture = () => preloadAllVoices();
    window.addEventListener('click', handleGesture, { once: true });
    window.addEventListener('touchstart', handleGesture, { once: true });
    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };
  }, []);

  return (
    <main
      className="relative w-full min-h-screen overflow-hidden"
      style={{ background: 'var(--bg-dark)' }}
    >
      {/* ── 1. BOOT SEQUENCE ── */}
      <AnimatePresence mode="wait">
        {phase === 'boot' && (
          <BootSequence key="boot" onComplete={() => setPhase('hero')} />
        )}
      </AnimatePresence>

      {/* ── 2. HERO LANDING ── */}
      <AnimatePresence mode="wait">
        {phase === 'hero' && (
          <HeroSection key="hero" onEnter={enterTribute} />
        )}
      </AnimatePresence>

      {/* ── 3. SCAN OVERLAY (sits above map) ── */}
      <AnimatePresence>
        {phase === 'scanning' && (
          <ScanOverlay key="scan" onComplete={onMapReady} />
        )}
      </AnimatePresence>

      {/* ── 4. MAP (persists through detection + card phases) ── */}
      {(phase === 'scanning' ||
        phase === 'map' ||
        phase === 'detecting' ||
        phase === 'card' ||
        phase === 'transitioning') && (
        <ErrorBoundary fallbackType="map">
          <MapSection
            discovered={discovered}
            onMarkerClick={selectTeacher}
            onMapReady={() => {}}
          />
        </ErrorBoundary>
      )}

      {/* ── 5. DETECTION OVERLAY ── */}
      <AnimatePresence>
        {phase === 'detecting' && activeTeacher && (
          <DetectionOverlay
            key={`detect-${activeTeacher.id}`}
            teacher={activeTeacher}
            onComplete={onDetectionComplete}
          />
        )}
      </AnimatePresence>

      {/* ── 6. RPG CARD ── */}
      <AnimatePresence>
        {phase === 'card' && activeTeacher && (
          <ErrorBoundary fallbackType="teacher">
            <RPGCard
              key={`card-${activeTeacher.id}`}
              teacher={activeTeacher}
              discovered={discovered}
              onNext={nextTeacher}
              onPrev={prevTeacher}
              onClose={returnToComplete}
            />
          </ErrorBoundary>
        )}
      </AnimatePresence>

      {/* ── 7. FINAL TRIBUTE ── */}
      <AnimatePresence>
        {phase === 'complete' && (
          <FinalScreen
            key="final"
            onReplay={() => window.location.reload()}
            onRevisitCards={revisitAllCards}
            onSelectTeacher={openTeacherCard}
          />
        )}
      </AnimatePresence>

      {/* ── BACKGROUND THEME MUSIC (NO UI DISPLAY) ── */}
      <AudioController />
    </main>
  );
}
