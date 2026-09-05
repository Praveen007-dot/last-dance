'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackType?: 'map' | 'teacher' | 'default';
}

interface State {
  hasError: boolean;
  error?: Error;
}

const FALLBACK_MESSAGES: Record<string, { title: string; body: string }> = {
  map: {
    title: 'LOCATION SYSTEM OFFLINE',
    body: 'The map could not be initialized. Please check your connection and reload.',
  },
  teacher: {
    title: 'TEACHER DATABASE UNAVAILABLE',
    body: 'Teacher data could not be loaded. Please refresh the page.',
  },
  default: {
    title: 'SYSTEM ERROR',
    body: 'An unexpected error occurred in the tribute system.',
  },
};

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const type = this.props.fallbackType ?? 'default';
    const msg = FALLBACK_MESSAGES[type];

    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen text-center px-6"
        style={{ background: 'var(--bg-dark)' }}
      >
        {/* HUD corners */}
        <div className="absolute top-4 left-4 w-10 h-10 border-l-2 border-t-2 border-red-500/40" />
        <div className="absolute top-4 right-4 w-10 h-10 border-r-2 border-t-2 border-red-500/40" />
        <div className="absolute bottom-4 left-4 w-10 h-10 border-l-2 border-b-2 border-red-500/40" />
        <div className="absolute bottom-4 right-4 w-10 h-10 border-r-2 border-b-2 border-red-500/40" />

        <div className="font-mono-hud text-xs text-red-500/40 tracking-widest mb-6">
          ⚠ LAST DANCE // ERROR STATE
        </div>

        <h1 className="font-orbitron font-black text-2xl md:text-3xl text-glow-red mb-4 tracking-widest">
          {msg.title}
        </h1>

        <p className="font-mono-hud text-sm text-green-400/40 max-w-md mb-8 leading-relaxed">
          {msg.body}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="font-orbitron text-xs tracking-[0.3em] px-6 py-3 cursor-pointer"
          style={{
            background: 'rgba(255,59,59,0.08)',
            border: '1px solid rgba(255,59,59,0.3)',
            color: 'rgba(255,59,59,0.7)',
          }}
        >
          ↺ RELOAD SYSTEM
        </button>

        {process.env.NODE_ENV === 'development' && this.state.error && (
          <pre className="mt-8 text-left text-xs text-red-500/30 font-mono-hud max-w-2xl overflow-auto p-4 border border-red-500/10">
            {this.state.error.message}
          </pre>
        )}
      </div>
    );
  }
}
