'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { stopAllVoices } from '@/hooks/useCartesiaSpeech';
import { teachers } from '@/data/teachers';
import { Teacher } from '@/types/teacher';

interface FinalScreenProps {
  onReplay?: () => void;
  onRevisitCards?: () => void;
  onSelectTeacher?: (teacher: Teacher) => void;
}

export default function FinalScreen({ onReplay, onRevisitCards, onSelectTeacher }: FinalScreenProps) {
  const [isPlayingTribute, setIsPlayingTribute] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Stop any previously playing voice
    stopAllVoices();

    const audio = new Audio('/audio/voices/final-tribute.mp3');
    audio.volume = 1;
    audioRef.current = audio;

    audio.onended = () => setIsPlayingTribute(false);
    audio.onerror = () => setIsPlayingTribute(false);

    // Auto-play tribute voice after title animations conclude
    const timer = setTimeout(() => {
      audio
        .play()
        .then(() => setIsPlayingTribute(true))
        .catch(() => {
          // Autoplay policy prevented music, user can press button
        });
    }, 2400);

    return () => {
      clearTimeout(timer);
      audio.pause();
      audioRef.current = null;
      stopAllVoices();
    };
  }, []);

  const toggleTributeSpeech = () => {
    if (!audioRef.current) return;
    if (isPlayingTribute) {
      audioRef.current.pause();
      setIsPlayingTribute(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlayingTribute(true))
        .catch(() => {});
    }
  };

  const handleReplay = () => {
    if (audioRef.current) audioRef.current.pause();
    if (onReplay) onReplay();
    else window.location.reload();
  };

  const handleRevisitAll = () => {
    if (audioRef.current) audioRef.current.pause();
    if (onRevisitCards) {
      onRevisitCards();
    } else if (onSelectTeacher) {
      onSelectTeacher(teachers[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        background: 'radial-gradient(ellipse at center, #031a0e 0%, #010d07 60%, #000 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          backgroundImage:
            'linear-gradient(rgba(0,255,157,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,157,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Corner HUD brackets — fixed to viewport */}
      <div style={{ position: 'fixed', top: 16, left: 16, width: 36, height: 36, borderLeft: '2px solid rgba(0,255,157,0.35)', borderTop: '2px solid rgba(0,255,157,0.35)', zIndex: 1 }} />
      <div style={{ position: 'fixed', top: 16, right: 16, width: 36, height: 36, borderRight: '2px solid rgba(0,255,157,0.35)', borderTop: '2px solid rgba(0,255,157,0.35)', zIndex: 1 }} />
      <div style={{ position: 'fixed', bottom: 36, left: 16, width: 36, height: 36, borderLeft: '2px solid rgba(0,255,157,0.35)', borderBottom: '2px solid rgba(0,255,157,0.35)', zIndex: 1 }} />
      <div style={{ position: 'fixed', bottom: 36, right: 16, width: 36, height: 36, borderRight: '2px solid rgba(0,255,157,0.35)', borderBottom: '2px solid rgba(0,255,157,0.35)', zIndex: 1 }} />

      {/* Scrollable content column */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
          maxWidth: '860px',
          padding: '48px 20px 80px',
          gap: '0px',
        }}
      >
        {/* ── Badge ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '11px',
            letterSpacing: '0.35em',
            color: 'rgba(0,255,157,0.75)',
            border: '1px solid rgba(0,255,157,0.25)',
            background: 'rgba(0,255,157,0.07)',
            padding: '5px 18px',
            borderRadius: '2px',
            marginBottom: '28px',
          }}
        >
          ✓ ALL {teachers.length} TEACHERS DISCOVERED
        </motion.div>

        {/* ── College tag ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '11px',
            letterSpacing: '0.2em',
            color: 'rgba(0,255,157,0.4)',
            marginBottom: '20px',
          }}
        >
          PRISM DEGREE COLLEGE // TEACHERS DAY TRIBUTE
        </motion.p>

        {/* ── Main Heading ── */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.9 }}
          style={{
            fontFamily: "'Orbitron', monospace",
            fontWeight: 900,
            fontSize: 'clamp(1.6rem, 5vw, 3.2rem)',
            lineHeight: 1.25,
            color: '#e0e0e0',
            margin: '0 0 20px',
          }}
        >
          THE REAL LEGENDS
          <br />
          <span
            style={{
              color: '#00ff9d',
              textShadow: '0 0 14px #00ff9d, 0 0 40px rgba(0,255,157,0.25)',
            }}
          >
            WERE NEVER IN THE GAME.
          </span>
        </motion.h1>

        {/* ── Quote ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.7 }}
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '13px',
            color: 'rgba(0,255,157,0.5)',
            lineHeight: 1.8,
            marginBottom: '24px',
          }}
        >
          &quot;You taught us more than what&apos;s written on the board.&quot;
        </motion.p>

        {/* ── THANK YOU ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.9, duration: 0.9, ease: 'easeOut' }}
          style={{
            fontFamily: "'Orbitron', monospace",
            fontWeight: 900,
            fontSize: 'clamp(1.3rem, 4.5vw, 2.8rem)',
            letterSpacing: '0.08em',
            color: '#ffb800',
            textShadow: '0 0 18px #ffb800, 0 0 45px rgba(255,184,0,0.25)',
            marginBottom: '24px',
          }}
        >
          THANK YOU, TEACHERS.
        </motion.div>

        {/* ── Divider ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            width: '100%',
            maxWidth: '280px',
            marginBottom: '24px',
          }}
        >
          <div style={{ height: '1px', flex: 1, background: 'rgba(0,255,157,0.2)' }} />
          <span style={{ color: 'rgba(0,255,157,0.3)', fontSize: '12px' }}>◆</span>
          <div style={{ height: '1px', flex: 1, background: 'rgba(0,255,157,0.2)' }} />
        </motion.div>

        {/* ── LAST DANCE ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.7, duration: 0.9 }}
          style={{ marginBottom: '16px' }}
        >
          <div
            style={{
              fontFamily: "'Orbitron', monospace",
              fontWeight: 900,
              fontSize: 'clamp(2rem, 6vw, 3.8rem)',
              letterSpacing: '0.18em',
              color: '#00ff9d',
              textShadow: '0 0 22px #00ff9d, 0 0 60px rgba(0,255,157,0.2)',
              marginBottom: '12px',
            }}
          >
            LAST DANCE
          </div>
          <p
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '13px',
              color: 'rgba(0,255,157,0.4)',
              lineHeight: 2.1,
              letterSpacing: '0.04em',
            }}
          >
            One last class.
            <br />
            One last bell.
            <br />
            A lifetime of memories.
          </p>
        </motion.div>

        {/* ── MAIN TRIBUTE ACTION BUTTONS ROW ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px', marginBottom: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Revisit All RPG Cards Option */}
          <motion.button
            onClick={handleRevisitAll}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 3.0 }}
            whileHover={{
              background: 'rgba(0,255,157,0.25)',
              borderColor: '#00ff9d',
              color: '#00ff9d',
              boxShadow: '0 0 24px rgba(0,255,157,0.45)',
              scale: 1.04,
            }}
            whileTap={{ scale: 0.97 }}
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.22em',
              padding: '13px 26px',
              cursor: 'pointer',
              background: 'rgba(0,255,157,0.14)',
              border: '2px solid #00ff9d',
              color: '#00ff9d',
              borderRadius: '4px',
              boxShadow: '0 0 16px rgba(0,255,157,0.3)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>🃏</span>
            <span>VISIT RPG CARDS ONCE MORE</span>
          </motion.button>

          {/* Tribute Voice Button */}
          <motion.button
            onClick={toggleTributeSpeech}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2 }}
            whileHover={{
              background: 'rgba(0,255,157,0.18)',
              borderColor: '#00ff9d',
              color: '#00ff9d',
              boxShadow: '0 0 20px rgba(0,255,157,0.3)',
            }}
            whileTap={{ scale: 0.97 }}
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: '11px',
              letterSpacing: '0.22em',
              padding: '13px 22px',
              cursor: 'pointer',
              background: isPlayingTribute ? 'rgba(0,255,157,0.2)' : 'rgba(0,255,157,0.06)',
              border: isPlayingTribute ? '1px solid #00ff9d' : '1px solid rgba(0,255,157,0.35)',
              color: isPlayingTribute ? '#00ff9d' : 'rgba(0,255,157,0.85)',
              borderRadius: '4px',
              boxShadow: isPlayingTribute ? '0 0 16px rgba(0,255,157,0.35)' : 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>{isPlayingTribute ? '⏹' : '🔊'}</span>
            <span>{isPlayingTribute ? 'STOP TRIBUTE' : 'VOICE TRIBUTE'}</span>
          </motion.button>

          {/* Replay Entire Tribute Button */}
          <motion.button
            onClick={handleReplay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.4 }}
            whileHover={{
              background: 'rgba(0,255,157,0.14)',
              borderColor: 'rgba(0,255,157,0.65)',
              color: '#00ff9d',
              boxShadow: '0 0 22px rgba(0,255,157,0.22)',
            }}
            whileTap={{ scale: 0.97 }}
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: '11px',
              letterSpacing: '0.28em',
              padding: '13px 24px',
              cursor: 'pointer',
              background: 'rgba(0,255,157,0.06)',
              border: '1px solid rgba(0,255,157,0.25)',
              color: 'rgba(0,255,157,0.6)',
              borderRadius: '4px',
              transition: 'all 0.2s ease',
            }}
          >
            ↺ REPLAY ALL
          </motion.button>
        </div>

        {/* ── COMPLETE FACULTY ROSTER GALLERY (Click any teacher to inspect their card) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 0.8 }}
          style={{
            width: '100%',
            background: 'rgba(3, 20, 39, 0.7)',
            border: '1px solid rgba(0,255,157,0.2)',
            borderRadius: '6px',
            padding: '20px 16px',
            marginBottom: '40px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid rgba(0,255,157,0.12)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#00ff9d', fontSize: '14px' }}>★</span>
              <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '11px', fontWeight: 800, color: '#e0e0e0', letterSpacing: '0.15em' }}>
                HONOR ROSTER // ALL {teachers.length} FACULTY MEMBERS
              </span>
            </div>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: 'rgba(0,255,157,0.6)', letterSpacing: '0.1em' }}>
              CLICK ANY CARD TO INSPECT
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '12px',
            }}
          >
            {teachers.map((t, idx) => (
              <motion.div
                key={t.id}
                onClick={() => {
                  if (audioRef.current) audioRef.current.pause();
                  if (onSelectTeacher) onSelectTeacher(t);
                }}
                whileHover={{ scale: 1.05, borderColor: '#00ff9d', boxShadow: '0 0 16px rgba(0,255,157,0.3)' }}
                whileTap={{ scale: 0.96 }}
                style={{
                  background: 'rgba(2, 12, 24, 0.85)',
                  border: '1px solid rgba(0,255,157,0.25)',
                  borderRadius: '4px',
                  padding: '10px 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'border-color 0.2s ease',
                }}
              >
                {/* Photo or Avatar */}
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    border: '1.5px solid #00ff9d',
                    overflow: 'hidden',
                    position: 'relative',
                    marginBottom: '8px',
                    background: '#041d33',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {t.photo ? (
                    <Image
                      src={t.photo}
                      alt={t.name}
                      fill
                      unoptimized
                      style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
                    />
                  ) : (
                    <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '16px', fontWeight: 900, color: '#00ff9d' }}>
                      {t.name.split(' ').pop()?.charAt(0) || 'T'}
                    </span>
                  )}
                </div>

                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '9px', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: '3px' }}>
                  {t.name}
                </div>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '8px', color: 'rgba(0,255,157,0.7)', letterSpacing: '0.05em' }}>
                  {t.subject}
                </div>
                <div style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '7px',
                  color: '#ffb800',
                  marginTop: '5px',
                  background: 'rgba(255,184,0,0.1)',
                  padding: '1px 5px',
                  borderRadius: '2px',
                  border: '1px solid rgba(255,184,0,0.25)',
                }}>
                  #{String(idx + 1).padStart(2, '0')} · {t.rank}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Bottom ticker — fixed ── */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '34px',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          background: 'rgba(0,0,0,0.65)',
          borderTop: '1px solid rgba(0,255,157,0.1)',
          zIndex: 9001,
        }}
      >
        <motion.span
          animate={{ x: ['100vw', '-250%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '11px',
            color: 'rgba(0,255,157,0.3)',
            whiteSpace: 'nowrap',
            paddingRight: '120px',
            letterSpacing: '0.15em',
          }}
        >
          LAST DANCE &nbsp;// FINAL YEAR TRIBUTE &nbsp;// TEACHERS DAY &nbsp;//
          PRISM DEGREE COLLEGE — VISAKHAPATNAM &nbsp;// THANK YOU, TEACHERS &nbsp;//
          LAST DANCE &nbsp;// FINAL YEAR TRIBUTE &nbsp;// TEACHERS DAY &nbsp;//
        </motion.span>
      </div>
    </motion.div>
  );
}
