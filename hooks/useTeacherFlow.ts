'use client';

import { useState, useCallback } from 'react';
import { FlowPhase, Teacher } from '@/types/teacher';
import { teachers } from '@/data/teachers';

export function useTeacherFlow() {
  const [phase, setPhase] = useState<FlowPhase>('boot');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [discovered, setDiscovered] = useState<Set<string>>(new Set());
  const [activeTeacher, setActiveTeacher] = useState<Teacher | null>(null);

  const enterTribute = useCallback(() => {
    setPhase('scanning');
  }, []);

  const onMapReady = useCallback(() => {
    setPhase('map');
  }, []);

  const selectTeacher = useCallback((teacher: Teacher) => {
    setActiveTeacher(teacher);
    setPhase('detecting');
  }, []);

  // Direct inspect from map or gallery without radar scan delay
  const openTeacherCard = useCallback((teacher: Teacher) => {
    const idx = teachers.findIndex((t) => t.id === teacher.id);
    if (idx >= 0) setCurrentIndex(idx);
    setActiveTeacher(teacher);
    setPhase('card');
  }, []);

  const onDetectionComplete = useCallback(() => {
    setPhase('card');
  }, []);

  const nextTeacher = useCallback(() => {
    if (!activeTeacher) return;
    const newDiscovered = new Set(discovered);
    newDiscovered.add(activeTeacher.id);
    setDiscovered(newDiscovered);

    // Check if revisiting cards after all cards are already discovered
    if (discovered.size >= teachers.length) {
      const currentIdx = teachers.findIndex((t) => t.id === activeTeacher.id);
      const nextIdx = currentIdx + 1;

      if (nextIdx < teachers.length) {
        // Move to the next teacher card in sequence
        setCurrentIndex(nextIdx);
        setActiveTeacher(teachers[nextIdx]);
        setPhase('card');
      } else {
        // We reached the end of the 10 cards, return to the Final Tribute memorial
        setActiveTeacher(null);
        setPhase('complete');
      }
      return;
    }

    // Normal first-time discovery flow:
    if (newDiscovered.size >= teachers.length) {
      setActiveTeacher(null);
      setPhase('complete');
      return;
    }

    // Find next undiscovered teacher
    const nextIdx = teachers.findIndex((t) => !newDiscovered.has(t.id));
    setCurrentIndex(nextIdx >= 0 ? nextIdx : 0);
    setActiveTeacher(null);
    setPhase('transitioning');

    // Short pause then back to map
    setTimeout(() => {
      setPhase('map');
    }, 800);
  }, [activeTeacher, discovered]);

  const prevTeacher = useCallback(() => {
    if (!activeTeacher) return;
    const currentIdx = teachers.findIndex((t) => t.id === activeTeacher.id);
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIndex(prevIdx);
      setActiveTeacher(teachers[prevIdx]);
      setPhase('card');
    }
  }, [activeTeacher]);

  const revisitAllCards = useCallback(() => {
    // Open the first teacher card for browsing all cards sequentially
    setCurrentIndex(0);
    setActiveTeacher(teachers[0]);
    setPhase('card');
  }, []);

  const returnToMap = useCallback(() => {
    setActiveTeacher(null);
    setPhase('map');
  }, []);

  const returnToComplete = useCallback(() => {
    setActiveTeacher(null);
    setPhase('complete');
  }, []);

  const skipToHero = useCallback(() => {
    setPhase('hero');
  }, []);

  return {
    phase,
    setPhase,
    currentIndex,
    activeTeacher,
    discovered,
    teachers,
    enterTribute,
    onMapReady,
    selectTeacher,
    openTeacherCard,
    onDetectionComplete,
    nextTeacher,
    prevTeacher,
    revisitAllCards,
    returnToMap,
    returnToComplete,
    skipToHero,
  };
}
