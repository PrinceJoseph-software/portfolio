import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';

interface HeroSectionProps {
  onSecretPixelClick: () => void;
}

export function HeroSection({ onSecretPixelClick }: HeroSectionProps) {
  const [interactionTime, setInteractionTime] = useState(0);
  const [pixelVisible, setPixelVisible] = useState(false);
  const [triggerReady, setTriggerReady] = useState(false);
  const interactionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isHoveringRef = useRef(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const textSkewX = useTransform(mouseX, [-300, 300], [-2, 2]);
  const textSkewY = useTransform(mouseY, [-200, 200], [-1, 1]);
  const subtitleX = useTransform(mouseX, [-300, 300], [-6, 6]);
  const subtitleY = useTransform(mouseY, [-200, 200], [-3, 3]);

  const startInteractionTimer = useCallback(() => {
    if (interactionTimerRef.current) return;
    interactionTimerRef.current = setInterval(() => {
      setInteractionTime(t => {
        const next = t + 1;
        if (next >= 3 && !pixelVisible) {
          setPixelVisible(true);
        }
        if (next >= 5) {
          setTriggerReady(true);
        }
        return next;
      });
    }, 1000);
  }, [pixelVisible]);

  const stopInteractionTimer = useCallback(() => {
    if (interactionTimerRef.current) {
      clearInterval(interactionTimerRef.current);
      interactionTimerRef.current = null;
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mouseX.set(e.clientX - cx);
    mouseY.set(e.clientY - cy);

    if (!isHoveringRef.current) {
      isHoveringRef.current = true;
      startInteractionTimer();
    }
  }, [mouseX, mouseY, startInteractionTimer]);

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
    mouseX.set(0);
    mouseY.set(0);
    stopInteractionTimer();
  }, [mouseX, mouseY, stopInteractionTimer]);

  // Mobile: track touch for 3 seconds
  const touchStartRef = useRef<number>(0);
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTouchStart = useCallback(() => {
    touchStartRef.current = Date.now();
    touchTimerRef.current = setTimeout(() => {
      setPixelVisible(true);
      setTriggerReady(true);
    }, 3000);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      stopInteractionTimer();
      if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    };
  }, [stopInteractionTimer]);

  const handlePixelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!triggerReady) return;
    onSecretPixelClick();
  };

  const distortionIntensity = Math.min(interactionTime / 5, 1);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-start px-6 md:px-12 lg:px-20 max-w-[1200px] mx-auto overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Ambient glow that appears with interaction */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(110,231,255,0.08) 0%, transparent 70%)',
          left: '50%',
          top: '50%',
          x: '-50%',
          y: '-50%',
        }}
        animate={{ opacity: distortionIntensity }}
        transition={{ duration: 0.5 }}
      />

      <div className="relative z-10">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <span
            className="text-sm text-[#6B6B6B] tracking-[0.15em] uppercase"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Portfolio — 2024
          </span>
        </motion.div>

        {/* Main name */}
        <motion.div
          style={{
            skewX: textSkewX,
            skewY: textSkewY,
          }}
          className="mb-4 overflow-hidden"
        >
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-[clamp(40px,7vw,88px)] text-[#0A0A0A] leading-[1.0] tracking-[-0.02em]"
            style={{ fontWeight: 700 }}
          >
            Nyobah-Joseph.
          </motion.h1>
        </motion.div>

        {/* Identity line */}
        <motion.div
          style={{
            x: subtitleX,
            y: subtitleY,
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-[clamp(18px,3vw,36px)] text-[#6B6B6B] leading-[1.3] mb-6"
            style={{ fontWeight: 400 }}
          >
            Full Stack Developer —<br />
            <span className="text-[#0A0A0A]" style={{ fontWeight: 600 }}>
              design-driven, security-minded.
            </span>
          </motion.p>
        </motion.div>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-base text-[#6B6B6B] max-w-[500px] leading-relaxed mb-12"
        >
          I build intuitive, high-performing digital experiences across web and mobile — combining full-stack development, UI/UX design, and a growing passion for cybersecurity.
        </motion.p>

        {/* CTA arrows */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex items-center gap-2 text-[#6B6B6B] text-sm cursor-default"
        >
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            ↓
          </motion.span>
          <span>Scroll to explore</span>
        </motion.div>
      </div>

      {/* Hidden Secret Pixel */}
      <motion.div
        onClick={handlePixelClick}
        animate={{
          opacity: pixelVisible ? [0.3, 0.9, 0.3] : 0,
          scale: pixelVisible ? [1, 1.5, 1] : 0,
        }}
        transition={{
          duration: 1.5,
          repeat: pixelVisible ? Infinity : 0,
          ease: 'easeInOut'
        }}
        className="absolute cursor-pointer"
        style={{
          right: '12%',
          top: '35%',
          width: 6,
          height: 6,
          backgroundColor: '#6EE7FF',
          borderRadius: 1,
          boxShadow: '0 0 8px rgba(110,231,255,0.8)',
          zIndex: 20,
          pointerEvents: pixelVisible ? 'auto' : 'none',
        }}
        title=""
      />

      {/* Interaction hint (subtle, only after pixel appears) */}
      {pixelVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.5 }}
          className="absolute text-[10px] text-[#6B6B6B]"
          style={{
            right: '12%',
            top: 'calc(35% + 14px)',
            fontFamily: 'var(--font-mono)',
            pointerEvents: 'none'
          }}
        >
          {/* intentionally empty — let curiosity drive */}
        </motion.div>
      )}

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#EAEAEA]" />
    </section>
  );
}