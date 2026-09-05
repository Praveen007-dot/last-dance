'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Teacher } from '@/types/teacher';
import { teachers } from '@/data/teachers';
import { useCartesiaSpeech, stopAllVoices } from '@/hooks/useCartesiaSpeech';

interface RPGCardProps {
  teacher: Teacher;
  discovered: Set<string>;
  onNext: () => void;
  onPrev?: () => void;
  onClose?: () => void;
}

/* ── rarity helper ── */
function getRarity(t: Teacher): 'legendary' | 'danger' | 'common' {
  if (t.stats.knowledge >= 95 && t.stats.classControl >= 90) return 'legendary';
  if (t.stats.anger >= 60) return 'danger';
  return 'common';
}

/* ── accent colours per rarity ── */
const ACCENT = {
  legendary: {
    primary:   '#ffb800',
    border:    'rgba(255,184,0,0.45)',
    glow:      'rgba(255,184,0,0.25)',
    dimText:   'rgba(255,184,0,0.45)',
    bg:        'rgba(255,184,0,0.07)',
    barFill:   'linear-gradient(90deg,#ffb800,#fff176)',
    badgeBg:   'rgba(255,184,0,0.1)',
  },
  danger: {
    primary:   '#ff3b3b',
    border:    'rgba(255,59,59,0.45)',
    glow:      'rgba(255,59,59,0.25)',
    dimText:   'rgba(255,59,59,0.45)',
    bg:        'rgba(255,59,59,0.07)',
    barFill:   'linear-gradient(90deg,#ff3b3b,#ff9393)',
    badgeBg:   'rgba(255,59,59,0.1)',
  },
  common: {
    primary:   '#00ff9d',
    border:    'rgba(0,255,157,0.35)',
    glow:      'rgba(0,255,157,0.18)',
    dimText:   'rgba(0,255,157,0.45)',
    bg:        'rgba(0,255,157,0.06)',
    barFill:   'linear-gradient(90deg,#00ff9d,#00c8ff)',
    badgeBg:   'rgba(0,255,157,0.08)',
  },
};

/* ── stat bar colour ── */
function statColor(stat: string) {
  if (stat === 'anger')        return { bar: '#ff3b3b', glow: '#ff3b3b' };
  if (stat === 'classControl') return { bar: '#ffb800', glow: '#ffb800' };
  return { bar: '#00ff9d', glow: '#00ff9d' };
}

/* ── initials fallback ── */
function lastInitial(name: string) {
  const parts = name.trim().split(' ');
  return parts[parts.length - 1].charAt(0).toUpperCase();
}

/* ── power score (1-10) ── */
function getPower(t: Teacher) {
  return Math.round((t.stats.knowledge + t.stats.classControl) / 20);
}

export default function RPGCard({ teacher, discovered, onNext, onPrev, onClose }: RPGCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [backImgError, setBackImgError] = useState(false);
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');
  const { isPlaying, isLoading, speak, stop } = useCartesiaSpeech();

  const playVoiceDossier = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isPlaying) {
      stop();
    } else {
      speak(`Faculty Dossier: ${teacher.name}`, {
        voiceId: '8e95b430-ecc3-49ab-b943-8313287c1c59',
        audioSrc: `/audio/voices/profile-${teacher.id}.mp3`,
      });
    }
  };

  useEffect(() => {
    setFlipped(false);
    setImgError(false);
    setBackImgError(false);

    // Auto-play the teacher dossier voiceover on card reveal with zero latency
    const timer = setTimeout(() => {
      speak(`Faculty Dossier: ${teacher.name}`, {
        voiceId: '8e95b430-ecc3-49ab-b943-8313287c1c59',
        audioSrc: `/audio/voices/profile-${teacher.id}.mp3`,
      });
    }, 120);

    return () => {
      clearTimeout(timer);
      stop();
    };
  }, [teacher.id, speak, stop, teacher.name]);
  const isLast = discovered.size + 1 >= teachers.length;
  const rarity  = getRarity(teacher);
  const accent  = ACCENT[rarity];
  const power   = getPower(teacher);
  const init    = lastInitial(teacher.name);
  const cardNum = String(teachers.findIndex(t => t.id === teacher.id) + 1).padStart(2, '0');

  const stats: { label: string; key: keyof typeof teacher.stats }[] = [
    { label: 'KNOWLEDGE',  key: 'knowledge' },
    { label: 'PATIENCE',   key: 'patience' },
    { label: 'HUMOUR',     key: 'humour' },
    { label: 'ANGER',      key: 'anger' },
    { label: 'CLASS CTRL', key: 'classControl' },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden"
      style={{ background: 'rgba(2,8,16,0.95)', backdropFilter: 'blur(10px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* ── CARD WRAPPER (3-D flip container) ── */}
      <motion.div
        className="w-full max-w-[340px] sm:max-w-[360px]"
        style={{ perspective: 1200 }}
        initial={{ scale: 0.82, y: 30, rotateX: 8 }}
        animate={{ scale: 1,    y: 0,  rotateX: 0 }}
        exit={{ scale: 0.88, y: -20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        {/* Flip inner */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 'min(80dvh, 540px)',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.65s cubic-bezier(.4,0,.2,1)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            cursor: 'pointer',
          }}
          onClick={() => setFlipped(f => !f)}
        >

          {/* ═══════════════════════════════ FRONT ═══════════════════════════════ */}
          <div
            style={{
              position: 'absolute', inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              background: '#061e38',
              border: `1.5px solid ${accent.border}`,
              boxShadow: `0 0 0 1px ${accent.border}, 0 0 40px ${accent.glow}, 0 24px 60px rgba(0,0,0,0.7)`,
              clipPath: 'polygon(0 14px,14px 0,calc(100% - 14px) 0,100% 14px,100% calc(100% - 14px),calc(100% - 14px) 100%,14px 100%,0 calc(100% - 14px))',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Corner brackets */}
            {[
              { top:6,  left:6,  borderTop:`2px solid ${accent.primary}`, borderLeft:`2px solid ${accent.primary}` },
              { top:6,  right:6, borderTop:`2px solid ${accent.primary}`, borderRight:`2px solid ${accent.primary}` },
              { bottom:6, left:6,  borderBottom:`2px solid ${accent.primary}`, borderLeft:`2px solid ${accent.primary}` },
              { bottom:6, right:6, borderBottom:`2px solid ${accent.primary}`, borderRight:`2px solid ${accent.primary}` },
            ].map((s,i) => (
              <div key={i} style={{ position:'absolute', width:18, height:18, zIndex:20, ...s }} />
            ))}

            {/* Top strip */}
            <div style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'6px 14px',
              background:'rgba(0,255,157,0.03)',
              borderBottom:`1px solid rgba(0,255,157,0.08)`,
              flexShrink: 0,
            }}>
              <button
                onClick={playVoiceDossier}
                title="Play / Pause Voice Dossier"
                style={{
                  display:'flex', alignItems:'center', gap:5,
                  fontFamily:'Share Tech Mono,monospace', fontSize:'0.44rem', letterSpacing:'0.12em',
                  color: isPlaying ? '#00ff9d' : accent.primary,
                  background: isPlaying ? 'rgba(0,255,157,0.15)' : 'rgba(3,19,38,0.85)',
                  border: `1px solid ${isPlaying ? '#00ff9d' : accent.border}`,
                  padding: '2px 8px',
                  cursor: 'pointer',
                  borderRadius: 2,
                  boxShadow: isPlaying ? '0 0 8px rgba(0,255,157,0.4)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{isPlaying ? '🔊' : '🔈'}</span>
                <span>{isPlaying ? 'DOSSIER PLAYING' : 'VOICE DOSSIER'}</span>
              </button>
              <span style={{ fontFamily:'Share Tech Mono,monospace', fontSize:'0.42rem', letterSpacing:'0.2em', color:accent.dimText, border:`1px solid ${accent.border}`, padding:'1px 7px' }}>
                {cardNum}/{teachers.length}
              </span>
            </div>

            {/* ── PHOTO AREA (Auto-fit with ambient glow backdrop) ── */}
            <div style={{
              position:'relative',
              width:'100%',
              flex:'1 1 290px',
              minHeight: 260,
              maxHeight: 330,
              overflow:'hidden',
              background:'#031326',
            }}>
              {/* Ambient blurred backdrop for seamless edge blend */}
              {teacher.photo && !imgError && (
                <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
                  <Image
                    src={teacher.photo}
                    alt=""
                    fill
                    unoptimized
                    style={{
                      objectFit:'cover',
                      filter:'blur(24px) brightness(0.38) saturate(1.3)',
                      transform:'scale(1.25)',
                    }}
                  />
                  <div style={{ position:'absolute', inset:0, background:'rgba(3,19,38,0.35)' }} />
                </div>
              )}

              {/* Main portrait photo - auto-fitted without face cropping */}
              {teacher.photo && !imgError ? (
                <Image
                  src={teacher.photo}
                  alt={teacher.name}
                  fill
                  unoptimized
                  priority
                  style={{
                    objectFit: fitMode,
                    objectPosition: fitMode === 'cover' ? 'center 18%' : 'center center',
                    zIndex: 2,
                  }}
                  onError={() => setImgError(true)}
                />
              ) : null}

              {/* Fallback letter only if photo fails or no photo provided */}
              {(!teacher.photo || imgError) && (
                <div style={{
                  position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:'Orbitron,monospace', fontSize:'6rem', fontWeight:900,
                  color: accent.primary, opacity:0.5,
                  textShadow: `0 0 40px ${accent.primary}`,
                  zIndex: 3,
                }}>
                  {init}
                </div>
              )}

              {/* Gradient fade at bottom to merge into dark panel */}
              <div style={{
                position:'absolute', bottom:0, left:0, right:0, height:32, zIndex:4,
                background: `linear-gradient(to bottom, transparent 0%, rgba(6,30,56,0.85) 75%, rgba(6,30,56,1) 100%)`,
                pointerEvents: 'none',
              }} />

              {/* Cinematic scan line */}
              <motion.div
                style={{
                  position:'absolute', left:0, right:0, height:2, zIndex:5,
                  background: `linear-gradient(to bottom, transparent, ${accent.primary}, transparent)`,
                  boxShadow: `0 0 8px ${accent.primary}`,
                  opacity: 0.35,
                  pointerEvents: 'none',
                }}
                animate={{ top: ['-2px','100%'] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
              />

              {/* Power hex (top-left) - compact and non-intrusive */}
              <div style={{
                position:'absolute', top:8, left:10, zIndex:15,
                width:38, height:38,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:'Orbitron,monospace', fontSize:'1rem', fontWeight:900,
                color: accent.primary,
                background:'rgba(3,19,38,0.92)',
                border:`1.5px solid ${accent.border}`,
                clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
                boxShadow:`0 0 10px ${accent.glow}`,
              }}>
                {power}
              </div>

              {/* Fit toggle & Type badge (top-right) */}
              <div style={{ position:'absolute', top:8, right:10, zIndex:15, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:3 }}>
                <div style={{ display:'flex', alignItems:'center', gap:3 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFitMode(m => m === 'contain' ? 'cover' : 'contain');
                    }}
                    title="Toggle auto-fit / full fill"
                    style={{
                      fontFamily:'Share Tech Mono,monospace', fontSize:'0.44rem', letterSpacing:'0.08em',
                      color: accent.primary, background:'rgba(3,19,38,0.9)', border:`1px solid ${accent.border}`,
                      padding:'2px 5px', cursor:'pointer',
                    }}
                  >
                    {fitMode === 'contain' ? '⛶ AUTO-FIT' : '⊡ FILL'}
                  </button>
                  <div style={{
                    fontFamily:'Orbitron,monospace', fontSize:'0.46rem', letterSpacing:'0.16em',
                    color: accent.primary, border:`1px solid ${accent.border}`,
                    padding:'2px 6px', background:'rgba(3,19,38,0.9)',
                  }}>
                    {teacher.subject.split(' ')[0].toUpperCase()}
                  </div>
                </div>
                <div style={{
                  fontFamily:'Share Tech Mono,monospace', fontSize:'0.6rem',
                  color: accent.primary, border:`1px solid ${accent.border}`,
                  padding:'2px 6px', background:'rgba(3,19,38,0.9)',
                }}>
                  {teacher.moodEmoji}
                </div>
              </div>

              {/* TEACHER DETECTED ribbon */}
              <motion.div
                style={{
                  position:'absolute', bottom:0, left:0, right:0, zIndex:10,
                  textAlign:'center', padding:'3px 0',
                  background:`linear-gradient(90deg,transparent,${accent.bg},transparent)`,
                  borderTop:`1px solid ${accent.border}`,
                  fontFamily:'Orbitron,monospace', fontSize:'0.45rem', letterSpacing:'0.35em',
                  color: accent.primary,
                  textShadow:`0 0 10px ${accent.primary}`,
                }}
                initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.35 }}
              >
                ◆ TEACHER DETECTED ◆
              </motion.div>
            </div>

            {/* ── INFO PANEL ── */}
            <div style={{ padding:'8px 14px 4px', display:'flex', flexDirection:'column', gap:4, flex:'0 0 auto' }}>
              {/* Name + subject & rank in single clean row */}
              <motion.div initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.3 }}>
                <div style={{
                  fontFamily:'Orbitron,monospace', fontWeight:900, fontSize:'0.92rem',
                  letterSpacing:'0.04em', textTransform:'uppercase', lineHeight:1.15,
                  color: accent.primary,
                  textShadow:`0 0 12px ${accent.glow}`,
                }}>
                  {teacher.name.toUpperCase()}
                </div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:2 }}>
                  <span style={{ fontFamily:'Share Tech Mono,monospace', fontSize:'0.52rem', letterSpacing:'0.2em', color: accent.dimText }}>
                    {teacher.subject.toUpperCase()}
                  </span>
                  <span style={{
                    fontFamily:'Share Tech Mono,monospace', fontSize:'0.44rem', letterSpacing:'0.1em',
                    background:'rgba(255,184,0,0.08)', border:'1px solid rgba(255,184,0,0.3)',
                    color:'#ffb800', padding:'1px 6px',
                  }}>
                    {teacher.rank}
                  </span>
                </div>
              </motion.div>

              {/* Mini stat bars (3 key stats) */}
              <motion.div
                style={{ display:'flex', gap:4, margin:'2px 0' }}
                initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.45 }}
              >
                {(['knowledge','patience','classControl'] as const).map((k) => {
                  const c = statColor(k);
                  const labels: Record<string, string> = { knowledge:'KNOW', patience:'PAT', classControl:'CTRL' };
                  return (
                    <div key={k} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:1 }}>
                      <span style={{ fontFamily:'Share Tech Mono,monospace', fontSize:'0.36rem', letterSpacing:'0.1em', color:'rgba(0,255,157,0.3)' }}>{labels[k]}</span>
                      <div style={{ width:'100%', height:3, background:'rgba(0,255,157,0.08)', borderRadius:1, overflow:'hidden' }}>
                        <motion.div
                          style={{ height:'100%', background:c.bar, boxShadow:`0 0 4px ${c.glow}` }}
                          initial={{ width:0 }} animate={{ width:`${teacher.stats[k]}%` }}
                          transition={{ duration:1, delay:0.6, ease:'easeOut' }}
                        />
                      </div>
                      <span style={{ fontFamily:'Orbitron,monospace', fontSize:'0.42rem', fontWeight:700, color:c.bar }}>{teacher.stats[k]}</span>
                    </div>
                  );
                })}
              </motion.div>

              {/* Special ability */}
              <motion.div
                style={{
                  background: accent.bg, border:`1px solid ${accent.border}`,
                  borderLeft:`2px solid ${accent.primary}`, padding:'4px 8px',
                  fontFamily:'Share Tech Mono,monospace', fontSize:'0.5rem', lineHeight:1.42,
                  color: accent.dimText,
                }}
                initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.55 }}
              >
                <span style={{ color: accent.primary, fontWeight:700 }}>⚡ {teacher.specialAbility}</span>
                {' — '}{teacher.specialAbilityDesc}
              </motion.div>
            </div>

            {/* Bottom bar */}
            <div style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'0 48px 0 12px', height:30,
              background:'rgba(3,19,38,0.95)', borderTop:`1px solid rgba(0,255,157,0.1)`,
              flexShrink:0,
            }}>
              <span style={{ fontFamily:'Share Tech Mono,monospace', fontSize:'0.42rem', letterSpacing:'0.15em', color:'#ffb800', transform:'rotate(180deg)', writingMode:'horizontal-tb' }}>
                {teacher.id.toUpperCase()}
              </span>
              <span style={{ fontFamily:'Share Tech Mono,monospace', fontSize:'0.4rem', letterSpacing:'0.18em', color:'rgba(0,255,157,0.22)' }}>
                PRISM · VIZAG
              </span>
            </div>
            {/* Power badge over bottom bar */}
            <div style={{
              position:'absolute', bottom:6, right:10, zIndex:20,
              width:36, height:36,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'Orbitron,monospace', fontSize:'1.15rem', fontWeight:900,
              color: accent.primary,
              background: accent.badgeBg, border:`1.5px solid ${accent.border}`,
              boxShadow:`0 0 8px ${accent.glow}`,
            }}>
              {power}
            </div>

            {/* Hint */}
            <div style={{
              position:'absolute', bottom:36, left:'50%', transform:'translateX(-50%)',
              fontFamily:'Share Tech Mono,monospace', fontSize:'0.38rem', letterSpacing:'0.2em',
              color:'rgba(0,255,157,0.2)', whiteSpace:'nowrap', zIndex:10,
            }}>
              CLICK CARD TO INSPECT
            </div>
          </div>

          {/* ═══════════════════════════════ BACK ═══════════════════════════════ */}
          <div
            style={{
              position:'absolute', inset:0,
              backfaceVisibility:'hidden',
              WebkitBackfaceVisibility:'hidden',
              transform:'rotateY(180deg)',
              background:'#061e38',
              border:`1.5px solid ${accent.border}`,
              boxShadow:`0 0 0 1px ${accent.border}, 0 0 40px ${accent.glow}`,
              clipPath:'polygon(0 14px,14px 0,calc(100% - 14px) 0,100% 14px,100% calc(100% - 14px),calc(100% - 14px) 100%,14px 100%,0 calc(100% - 14px))',
              display:'flex', flexDirection:'column',
              overflow:'hidden',
            }}
          >
            {/* Corner brackets */}
            {[
              { top:6,  left:6,  borderTop:`2px solid ${accent.primary}`, borderLeft:`2px solid ${accent.primary}` },
              { top:6,  right:6, borderTop:`2px solid ${accent.primary}`, borderRight:`2px solid ${accent.primary}` },
              { bottom:6, left:6,  borderBottom:`2px solid ${accent.primary}`, borderLeft:`2px solid ${accent.primary}` },
              { bottom:6, right:6, borderBottom:`2px solid ${accent.primary}`, borderRight:`2px solid ${accent.primary}` },
            ].map((s,i) => (
              <div key={i} style={{ position:'absolute', width:18, height:18, zIndex:20, ...s }} />
            ))}

            {/* Back header */}
            <div style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'8px 14px',
              background:`rgba(0,255,157,0.03)`,
              borderBottom:`1px solid rgba(0,255,157,0.1)`,
              flexShrink:0,
            }}>
              <span style={{ fontFamily:'Orbitron,monospace', fontSize:'0.7rem', fontWeight:900, letterSpacing:'0.2em', color:'var(--hud-green)', textShadow:'0 0 10px #00ff9d' }}>
                LAST DANCE
              </span>
              <button
                onClick={playVoiceDossier}
                title="Play / Pause Voice Dossier"
                style={{
                  display:'flex', alignItems:'center', gap:5,
                  fontFamily:'Share Tech Mono,monospace', fontSize:'0.44rem', letterSpacing:'0.12em',
                  color: isPlaying ? '#00ff9d' : accent.primary,
                  background: isPlaying ? 'rgba(0,255,157,0.15)' : 'rgba(3,19,38,0.85)',
                  border: `1px solid ${isPlaying ? '#00ff9d' : accent.border}`,
                  padding: '2px 8px',
                  cursor: 'pointer',
                  borderRadius: 2,
                  boxShadow: isPlaying ? '0 0 8px rgba(0,255,157,0.4)' : 'none',
                }}
              >
                <span>{isPlaying ? '🔊' : '🔈'}</span>
                <span>{isPlaying ? 'DOSSIER PLAYING' : 'PLAY VOICE'}</span>
              </button>
            </div>

            {/* Photo + Name row */}
            <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px 8px', flexShrink:0 }}>
              <div style={{
                position:'relative', width:68, height:68, flexShrink:0, overflow:'hidden',
                border:`2px solid ${accent.border}`,
                boxShadow:`0 0 14px ${accent.glow}`,
              }}>
                {teacher.photo && !backImgError ? (
                  <Image
                    src={teacher.photo}
                    alt={teacher.name}
                    fill
                    unoptimized
                    style={{ objectFit:'cover', objectPosition:'center 18%' }}
                    onError={() => setBackImgError(true)}
                  />
                ) : null}
                {(!teacher.photo || backImgError) && (
                  <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Orbitron,monospace', fontSize:'1.8rem', fontWeight:900, color:accent.primary, background:'rgba(0,255,157,0.04)' }}>
                    {init}
                  </div>
                )}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:'Orbitron,monospace', fontWeight:900, fontSize:'0.75rem', color:accent.primary, letterSpacing:'0.04em', textTransform:'uppercase', lineHeight:1.2 }}>
                  {teacher.name.toUpperCase()}
                </div>
                <div style={{ fontFamily:'Share Tech Mono,monospace', fontSize:'0.5rem', letterSpacing:'0.2em', color:accent.dimText, marginTop:2 }}>
                  {teacher.subject.toUpperCase()}
                </div>
                <div style={{ display:'inline-block', marginTop:5, fontFamily:'Share Tech Mono,monospace', fontSize:'0.44rem', letterSpacing:'0.1em', background:'rgba(255,184,0,0.08)', border:'1px solid rgba(255,184,0,0.3)', color:'#ffb800', padding:'2px 8px' }}>
                  {teacher.rank}
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{
              padding:'0 14px 10px',
              fontFamily:'Share Tech Mono,monospace', fontSize:'0.5rem', lineHeight:1.65,
              color:'rgba(0,255,157,0.35)',
              borderBottom:`1px solid rgba(0,255,157,0.07)`,
              flexShrink:0,
            }}>
              &ldquo;{teacher.description}&rdquo;
            </div>

            {/* Full stat bars */}
            <div style={{ padding:'8px 14px', flex:1, overflowY:'auto' }}>
              <div style={{ fontFamily:'Share Tech Mono,monospace', fontSize:'0.44rem', letterSpacing:'0.25em', color:'rgba(0,255,157,0.28)', marginBottom:8 }}>
                // ATTRIBUTES
              </div>
              {stats.map(({ label, key }, i) => {
                const c = statColor(key);
                const val = teacher.stats[key];
                return (
                  <div key={key} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:7 }}>
                    <span style={{ fontFamily:'Share Tech Mono,monospace', fontSize:'0.46rem', letterSpacing:'0.1em', color:'rgba(0,255,157,0.4)', width:68, flexShrink:0 }}>
                      {label}
                    </span>
                    <div style={{ flex:1, height:5, background:'rgba(0,255,157,0.07)', borderRadius:2, overflow:'hidden' }}>
                      <motion.div
                        style={{ height:'100%', background:c.bar, boxShadow:`0 0 6px ${c.glow}`, borderRadius:2 }}
                        initial={{ width:0 }} animate={{ width:`${val}%` }}
                        transition={{ duration:1, delay: 0.1 + i * 0.12, ease:'easeOut' }}
                      />
                    </div>
                    <motion.span
                      style={{ fontFamily:'Orbitron,monospace', fontSize:'0.6rem', fontWeight:700, color:c.bar, width:24, textAlign:'right', flexShrink:0 }}
                      initial={{ opacity:0 }} animate={{ opacity:1 }}
                      transition={{ delay: 0.9 + i * 0.12 }}
                    >
                      {val}
                    </motion.span>
                  </div>
                );
              })}
            </div>

            {/* Mood + Special ability */}
            <div style={{ padding:'0 14px 8px', display:'flex', flexDirection:'column', gap:6, flexShrink:0 }}>
              {/* Mood */}
              <div style={{
                display:'flex', alignItems:'center', gap:8, padding:'6px 10px',
                background:'rgba(0,255,157,0.04)', border:'1px solid rgba(0,255,157,0.12)',
              }}>
                <span style={{ fontSize:'1.2rem', lineHeight:1 }}>{teacher.moodEmoji}</span>
                <div>
                  <div style={{ fontFamily:'Orbitron,monospace', fontSize:'0.5rem', fontWeight:700, letterSpacing:'0.15em', color:'#ffb800' }}>
                    MOOD: {teacher.mood}
                  </div>
                  <div style={{ fontFamily:'Share Tech Mono,monospace', fontSize:'0.48rem', color:'rgba(0,255,157,0.45)', marginTop:1 }}>
                    &ldquo;{teacher.moodDescription}&rdquo;
                  </div>
                </div>
              </div>
              {/* Special ability */}
              <div style={{
                padding:'6px 10px', position:'relative', overflow:'hidden',
                background:'rgba(255,184,0,0.04)', border:'1px solid rgba(255,184,0,0.2)',
                borderLeft:`2px solid #ffb800`,
              }}>
                <div style={{ fontFamily:'Share Tech Mono,monospace', fontSize:'0.44rem', letterSpacing:'0.2em', color:'rgba(255,184,0,0.5)', marginBottom:2 }}>
                  ⚡ SPECIAL ABILITY
                </div>
                <div style={{ fontFamily:'Orbitron,monospace', fontSize:'0.58rem', fontWeight:700, letterSpacing:'0.1em', color:'#ffb800', marginBottom:2 }}>
                  {teacher.specialAbility}
                </div>
                <div style={{ fontFamily:'Share Tech Mono,monospace', fontSize:'0.5rem', color:'rgba(255,184,0,0.55)' }}>
                  {teacher.specialAbilityDesc}
                </div>
              </div>
            </div>

            {/* Back hint */}
            <div style={{
              borderTop:`1px solid rgba(0,255,157,0.08)`, padding:'6px',
              textAlign:'center', fontFamily:'Share Tech Mono,monospace', fontSize:'0.42rem',
              letterSpacing:'0.22em', color:'rgba(0,255,157,0.22)', flexShrink:0,
            }}>
              // CLICK TO RETURN //
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── BOTTOM ACTIONS BAR (outside card so it doesn't trigger flip) ── */}
      <motion.div
        className="fixed bottom-3 sm:bottom-6 left-0 right-0 z-50 flex items-center justify-center gap-2 sm:gap-3 px-3 pointer-events-auto"
        initial={{ opacity:0, y:16 }}
        animate={{ opacity:1, y:0 }}
        transition={{ delay:0.3 }}
      >
        {onPrev && (
          <button
            onClick={(e) => { e.stopPropagation(); stopAllVoices(); onPrev(); }}
            className="px-3 py-2 font-orbitron text-[9px] sm:text-xs tracking-wider bg-[#061e38]/90 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/40 rounded transition-all cursor-pointer"
            aria-label="Previous teacher"
          >
            ← PREV
          </button>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); stopAllVoices(); onNext(); }}
          className="px-4 sm:px-6 py-2 font-orbitron text-[10px] sm:text-xs tracking-widest bg-emerald-500/10 text-[#00ff9d] border border-[#00ff9d]/50 hover:bg-[#00ff9d]/20 rounded shadow-[0_0_12px_rgba(0,255,157,0.3)] transition-all cursor-pointer"
          style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
          aria-label={isLast ? 'View final tribute' : 'Go to next teacher'}
        >
          {isLast ? '★ FINAL TRIBUTE' : 'NEXT TEACHER →'}
        </button>

        {onClose && (
          <button
            onClick={(e) => { e.stopPropagation(); stopAllVoices(); onClose(); }}
            className="px-3 py-2 font-orbitron text-[9px] sm:text-xs tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/40 hover:bg-amber-500/20 rounded transition-all cursor-pointer"
            title="Return to Memorial Wall"
          >
            MEMORIAL
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
