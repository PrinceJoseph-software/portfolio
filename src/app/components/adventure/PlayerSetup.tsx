import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PlayerSetupProps {
  onComplete: (name: string) => void;
  existingName?: string;
}

// Sanitize: no tags, no scripts, limit length
function sanitizeName(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[<>'"]/g, '')
    .slice(0, 30);
}

export function PlayerSetup({ onComplete, existingName }: PlayerSetupProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [phase, setPhase] = useState<'intro' | 'input' | 'ready'>('intro');

  useEffect(() => {
    const timer = setTimeout(() => setPhase('input'), 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = sanitizeName(name.trim());
    if (!sanitized) {
      setError('A name is required to enter.');
      return;
    }
    if (sanitized.length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    setError('');
    setPhase('ready');
    setTimeout(() => onComplete(sanitized), 800);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeName(e.target.value);
    setName(sanitized);
    if (error) setError('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: '#050505' }}
    >
      {/* Ambient grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(110,231,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(110,231,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-6 left-6 w-6 h-6 border-t border-l border-[#6EE7FF]/30" />
      <div className="absolute top-6 right-6 w-6 h-6 border-t border-r border-[#6EE7FF]/30" />
      <div className="absolute bottom-6 left-6 w-6 h-6 border-b border-l border-[#6EE7FF]/30" />
      <div className="absolute bottom-6 right-6 w-6 h-6 border-b border-r border-[#6EE7FF]/30" />

      {/* Status bar */}
      <div className="absolute top-6 left-0 right-0 flex justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#6EE7FF', letterSpacing: '0.2em' }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#6EE7FF' }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          ADVENTURE.SYS — LOADING IDENTITY PROTOCOL
        </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-[420px] px-6">
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: '#6EE7FF',
                  letterSpacing: '0.3em',
                }}
              >
                SYSTEM INITIALIZING...
              </motion.div>
            </motion.div>
          )}

          {(phase === 'input' || phase === 'ready') && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
            >
              {/* Title */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-10 text-center"
              >
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: '#6EE7FF',
                    letterSpacing: '0.25em',
                    marginBottom: '20px',
                  }}
                >
                  IDENTITY REQUIRED
                </p>
                <h1
                  style={{
                    fontSize: '28px',
                    fontWeight: 700,
                    color: '#E5E7EB',
                    lineHeight: 1.2,
                    marginBottom: '12px',
                  }}
                >
                  Who are you?
                </h1>
                <p style={{ fontSize: '14px', color: '#6B6B6B', lineHeight: 1.6 }}>
                  Every explorer needs a name. This is the only data stored about you, and it never leaves your device.
                </p>
              </motion.div>

              {existingName && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6 p-4 rounded-lg border border-[#6EE7FF]/20 bg-[#6EE7FF]/5 text-center"
                >
                  <p style={{ fontSize: '13px', color: '#6B6B6B' }}>
                    Welcome back,{' '}
                    <span style={{ color: '#6EE7FF', fontWeight: 600 }}>{existingName}</span>
                  </p>
                  <button
                    onClick={() => onComplete(existingName)}
                    className="mt-2 text-xs underline"
                    style={{ color: '#6EE7FF', opacity: 0.7 }}
                  >
                    Continue as {existingName}
                  </button>
                </motion.div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="relative mb-3">
                  <motion.input
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    type="text"
                    value={name}
                    onChange={handleChange}
                    placeholder="Enter your name..."
                    maxLength={30}
                    autoFocus
                    className="w-full px-5 py-4 rounded-[14px] text-sm outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${error ? '#EF4444' : 'rgba(110,231,255,0.2)'}`,
                      color: '#E5E7EB',
                      fontFamily: 'var(--font-mono)',
                      caretColor: '#6EE7FF',
                      letterSpacing: '0.05em',
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#6EE7FF';
                      e.target.style.boxShadow = '0 0 0 1px #6EE7FF22, 0 0 20px #6EE7FF08';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = error ? '#EF4444' : 'rgba(110,231,255,0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs mb-4"
                      style={{ color: '#EF4444', fontFamily: 'var(--font-mono)' }}
                    >
                      ✗ {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-[14px] text-sm transition-all mt-2"
                  style={{
                    background: 'linear-gradient(135deg, #6EE7FF18, #A78BFA18)',
                    border: '1px solid rgba(110,231,255,0.3)',
                    color: '#6EE7FF',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.2em',
                    fontWeight: 600,
                  }}
                >
                  {phase === 'ready' ? 'ENTERING...' : 'BEGIN →'}
                </motion.button>
              </form>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 1 }}
                className="text-center mt-6"
                style={{ fontSize: '11px', color: '#6B6B6B', fontFamily: 'var(--font-mono)' }}
              >
                Only your name is stored — in localStorage, never transmitted.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
