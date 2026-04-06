import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { thoughtsBranches } from '../../../data/portfolio';

interface ThoughtsNodeProps {
  onBack: () => void;
  onComplete: () => void;
  alreadyCompleted: boolean;
  playerName: string;
}

export function ThoughtsNode({ onBack, onComplete, alreadyCompleted, playerName }: ThoughtsNodeProps) {
  const [currentId, setCurrentId] = useState<string>('root');
  const [history, setHistory] = useState<string[]>([]);
  const [completed, setCompleted] = useState(alreadyCompleted);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [choiceAnimating, setChoiceAnimating] = useState(false);
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = thoughtsBranches.find(b => b.id === currentId);

  const startTyping = useCallback((text: string, onDone?: () => void) => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    setTypedText('');
    setIsTyping(true);
    let i = 0;
    typingIntervalRef.current = setInterval(() => {
      i++;
      setTypedText(text.slice(0, i));
      if (i >= text.length) {
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
        setIsTyping(false);
        onDone?.();
      }
    }, 18);
  }, []);

  // Start typing when currentId changes
  useEffect(() => {
    if (current) {
      startTyping(current.text, () => {
        if (current.choices.length === 0 && !completed) {
          setCompleted(true);
          if (!alreadyCompleted) setTimeout(onComplete, 1000);
        }
      });
    }
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, [currentId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChoice = (nextId: string) => {
    if (isTyping || choiceAnimating) return;
    setChoiceAnimating(true);
    setHistory(h => [...h, currentId]);

    setTimeout(() => {
      setCurrentId(nextId);
      setChoiceAnimating(false);
      const next = thoughtsBranches.find(b => b.id === nextId);
      if (next) {
        startTyping(next.text, () => {
          if (next.choices.length === 0 && !completed) {
            setCompleted(true);
            if (!alreadyCompleted) setTimeout(onComplete, 1000);
          }
        });
      }
    }, 300);
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(h => h.slice(0, -1));
      setCurrentId(prev);
      const node = thoughtsBranches.find(b => b.id === prev);
      if (node) startTyping(node.text);
    } else {
      onBack();
    }
  };

  const handleSkipTyping = () => {
    if (isTyping && current) {
      setTypedText(current.text);
      setIsTyping(false);
    }
  };

  if (!current) return null;

  const progressPercent = Math.min((history.length / 5) * 100, 100);

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ color: '#E5E7EB' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
          style={{ color: '#6EE7FF', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
        >
          ← {history.length > 0 ? 'BACK' : 'BACK TO HUB'}
        </button>
        <div className="flex items-center gap-3">
          {completed && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#34D399' }}>
              ✓ COMPLETE
            </span>
          )}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#6B6B6B', letterSpacing: '0.15em' }}>
            THOUGHTS.NODE
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="h-px mb-6 rounded-full overflow-hidden shrink-0" style={{ background: 'rgba(167,139,250,0.1)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #A78BFA, #F472B6)', width: `${progressPercent}%` }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Depth indicator */}
      <div className="flex items-center gap-1.5 mb-6 shrink-0">
        {Array.from({ length: Math.max(history.length + 1, 1) }).map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full"
            style={{
              width: i === history.length ? '24px' : '8px',
              background: i === history.length ? '#A78BFA' : 'rgba(167,139,250,0.3)',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Speaker label */}
        <div className="flex items-center gap-2 mb-4 shrink-0">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
            style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)' }}
          >
            A
          </div>
          <span style={{ fontSize: '12px', color: '#6B6B6B', fontFamily: 'var(--font-mono)' }}>
            Alex Chen
          </span>
        </div>

        {/* Message bubble */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: choiceAnimating ? 0 : 1, y: choiceAnimating ? -10 : 0 }}
            className="mb-8 shrink-0"
            onClick={handleSkipTyping}
            style={{ cursor: isTyping ? 'pointer' : 'default' }}
          >
            <div
              className="p-5 rounded-[16px] relative"
              style={{
                background: 'rgba(167,139,250,0.08)',
                border: '1px solid rgba(167,139,250,0.2)',
                fontSize: '15px',
                lineHeight: 1.7,
                color: '#E5E7EB',
              }}
            >
              {typedText}
              {isTyping && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  style={{ color: '#A78BFA' }}
                >
                  ▌
                </motion.span>
              )}
            </div>
            {isTyping && (
              <p style={{ fontSize: '10px', color: '#6B6B6B', marginTop: '6px', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
                tap to skip
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Choices */}
        {!isTyping && current.choices.length > 0 && !choiceAnimating && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2 shrink-0"
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                style={{ background: 'rgba(110,231,255,0.15)', border: '1px solid rgba(110,231,255,0.3)', color: '#6EE7FF' }}
              >
                {playerName[0]?.toUpperCase() || 'Y'}
              </div>
              <span style={{ fontSize: '12px', color: '#6B6B6B', fontFamily: 'var(--font-mono)' }}>
                You
              </span>
            </div>

            {current.choices.map((choice, i) => (
              <motion.button
                key={choice.next}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleChoice(choice.next)}
                whileHover={{ scale: 1.01, x: 4 }}
                whileTap={{ scale: 0.99 }}
                className="w-full p-4 rounded-[12px] text-left text-sm transition-all"
                style={{
                  background: 'rgba(110,231,255,0.05)',
                  border: '1px solid rgba(110,231,255,0.2)',
                  color: '#E5E7EB',
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: '#6EE7FF', marginRight: '8px' }}>›</span>
                {choice.label}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* End state */}
        {!isTyping && current.choices.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center mt-8"
          >
            <div className="text-3xl mb-4">💬</div>
            <p style={{ fontSize: '13px', color: '#6B6B6B', textAlign: 'center', marginBottom: '20px' }}>
              End of this thread.
            </p>
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-[12px] text-sm"
              style={{
                background: 'linear-gradient(135deg, #A78BFA18, #F472B618)',
                border: '1px solid rgba(167,139,250,0.3)',
                color: '#A78BFA',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.15em',
                fontWeight: 600,
                fontSize: '12px',
              }}
            >
              RETURN TO HUB
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}