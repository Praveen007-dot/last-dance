import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen text-center px-6"
      style={{ background: 'var(--bg-dark)' }}
    >
      {/* HUD corners */}
      <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-green-400/30" />
      <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-green-400/30" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-green-400/30" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-green-400/30" />

      <div className="font-mono-hud text-xs text-green-400/30 tracking-widest mb-8">
        LAST DANCE // SYSTEM // ERROR_404
      </div>

      <div className="font-orbitron font-black text-8xl md:text-9xl text-glow-green mb-2">
        404
      </div>

      <div className="font-mono-hud text-sm text-green-400/40 tracking-widest mb-8">
        LOCATION NOT FOUND IN DATABASE
      </div>

      <p className="font-mono-hud text-xs text-green-400/30 max-w-xs mb-10 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist in our tribute archives.
        Return to the main tribute.
      </p>

      <Link
        href="/"
        className="font-orbitron text-xs tracking-[0.3em] px-8 py-3"
        style={{
          background: 'rgba(0,255,157,0.05)',
          border: '1px solid rgba(0,255,157,0.25)',
          color: 'rgba(0,255,157,0.7)',
        }}
      >
        ← RETURN TO TRIBUTE
      </Link>
    </div>
  );
}
