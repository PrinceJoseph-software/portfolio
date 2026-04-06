import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface GlitchTransitionProps {
  active: boolean;
  onComplete: () => void;
}

export function GlitchTransition({ active, onComplete }: GlitchTransitionProps) {
  const [phase, setPhase] = useState<'idle' | 'glitch' | 'dark'>('idle');

  useEffect(() => {
    if (!active) {
      setPhase('idle');
      return;
    }

    setPhase('glitch');

    const t1 = setTimeout(() => setPhase('dark'), 1600);
    const t2 = setTimeout(() => onComplete(), 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [active, onComplete]);

  const glitchRects = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 90}%`,
    height: `${2 + Math.random() * 20}px`,
    delay: Math.random() * 0.4,
    duration: 0.08 + Math.random() * 0.12,
    color: i % 3 === 0 ? '#6EE7FF' : i % 3 === 1 ? '#A78BFA' : '#FFFFFF',
  }));

  return (
    <AnimatePresence>
      {(phase === 'glitch' || phase === 'dark') && (
        <motion.div
          key="glitch"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] overflow-hidden"
          style={{ background: phase === 'dark' ? '#050505' : 'transparent' }}
        >
          {phase === 'glitch' && (
            <>
              {/* Scan lines */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
                  backgroundSize: '100% 4px',
                }}
                animate={{ backgroundPositionY: ['0px', '4px'] }}
                transition={{ duration: 0.05, repeat: Infinity }}
              />

              {/* White flash base */}
              <motion.div
                className="absolute inset-0"
                style={{ background: '#FFFFFF' }}
                animate={{ opacity: [1, 0.3, 1, 0.1, 0.9, 0, 1, 0] }}
                transition={{ duration: 0.4, times: [0, 0.1, 0.2, 0.4, 0.5, 0.7, 0.8, 1] }}
              />

              {/* RGB shift layers */}
              <motion.div
                className="absolute inset-0 mix-blend-screen"
                style={{ background: 'rgba(110,231,255,0.5)' }}
                animate={{ x: [-4, 6, -2, 4, 0], opacity: [0, 1, 0.5, 1, 0] }}
                transition={{ duration: 0.6, times: [0, 0.2, 0.4, 0.7, 1] }}
              />
              <motion.div
                className="absolute inset-0 mix-blend-screen"
                style={{ background: 'rgba(167,139,250,0.5)' }}
                animate={{ x: [6, -4, 2, -6, 0], opacity: [0, 1, 0.5, 1, 0] }}
                transition={{ duration: 0.6, times: [0, 0.2, 0.4, 0.7, 1], delay: 0.05 }}
              />

              {/* Glitch rectangles */}
              {glitchRects.map(rect => (
                <motion.div
                  key={rect.id}
                  className="absolute left-0 right-0 pointer-events-none"
                  style={{
                    top: rect.top,
                    height: rect.height,
                    background: rect.color,
                    opacity: 0,
                    mixBlendMode: 'screen',
                  }}
                  animate={{ opacity: [0, 0.8, 0, 0.6, 0], x: [-8, 12, -4, 8, 0] }}
                  transition={{
                    duration: rect.duration,
                    delay: rect.delay,
                    repeat: 3,
                    repeatType: 'reverse',
                  }}
                />
              ))}

              {/* Text artifact */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  animate={{
                    opacity: [0, 1, 0, 1, 0],
                    x: [-2, 4, -2, 0],
                    filter: ['blur(0px)', 'blur(2px)', 'blur(0px)']
                  }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-[#6EE7FF]"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    letterSpacing: '0.3em',
                  }}
                >
                  ACCESSING HIDDEN LAYER...
                </motion.div>
              </div>
            </>
          )}

          {/* Dark overlay that stays */}
          <motion.div
            className="absolute inset-0"
            style={{ background: '#050505' }}
            animate={{ opacity: phase === 'dark' ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
