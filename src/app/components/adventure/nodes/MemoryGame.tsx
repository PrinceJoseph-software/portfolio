import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { memoryCards, MemoryCard } from '../../../data/portfolio';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface MemoryGameProps {
  onComplete: () => void;
  onBack: () => void;
  playerName: string;
  alreadyCompleted: boolean;
}

export function MemoryGame({ onComplete, onBack, playerName, alreadyCompleted }: MemoryGameProps) {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(alreadyCompleted);
  const [showIntro, setShowIntro] = useState(!alreadyCompleted);

  useEffect(() => {
    setCards(shuffle(memoryCards));
  }, []);

  const startGame = () => {
    setShowIntro(false);
    setCards(shuffle(memoryCards));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = useCallback((cardId: string, pairId: string) => {
    if (disabled) return;
    if (flipped.includes(cardId)) return;
    if (matched.includes(pairId)) return;

    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setDisabled(true);

      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // Match!
        const newMatched = [...matched, firstCard.pairId];
        setMatched(newMatched);
        setFlipped([]);
        setDisabled(false);

        if (newMatched.length === memoryCards.length / 2) {
          setTimeout(() => {
            setGameWon(true);
            if (!alreadyCompleted) {
              setTimeout(onComplete, 1500);
            }
          }, 600);
        }
      } else {
        // No match
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 900);
      }
    }
  }, [disabled, flipped, matched, cards, alreadyCompleted, onComplete]);

  const totalPairs = memoryCards.length / 2;
  const progress = (matched.length / totalPairs) * 100;

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ color: '#E5E7EB' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
          style={{ color: '#6EE7FF', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
        >
          ← BACK TO HUB
        </button>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#6B6B6B', letterSpacing: '0.15em' }}>
          MEMORY.NODE
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showIntro && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="flex flex-col items-center justify-center flex-1 text-center"
          >
            <div className="text-4xl mb-6">🧠</div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Memory Archive</h2>
            <p style={{ fontSize: '14px', color: '#6B6B6B', maxWidth: '340px', lineHeight: 1.6, marginBottom: '32px' }}>
              {totalPairs} fragments from my past are scattered across this grid. Find the matching pairs to unlock each memory.
            </p>
            <motion.button
              onClick={startGame}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 rounded-[12px] text-sm"
              style={{
                background: 'linear-gradient(135deg, #6EE7FF18, #A78BFA18)',
                border: '1px solid rgba(110,231,255,0.3)',
                color: '#6EE7FF',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.15em',
                fontWeight: 600,
              }}
            >
              BEGIN SCAN
            </motion.button>
          </motion.div>
        )}

        {!showIntro && !gameWon && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col flex-1 overflow-hidden"
          >
            {/* Stats */}
            <div className="flex items-center justify-between mb-4 shrink-0">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#6B6B6B' }}>
                MOVES: <span style={{ color: '#6EE7FF' }}>{moves}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#6B6B6B' }}>
                FOUND: <span style={{ color: '#6EE7FF' }}>{matched.length}/{totalPairs}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-px mb-6 rounded-full overflow-hidden shrink-0" style={{ background: 'rgba(110,231,255,0.1)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #6EE7FF, #A78BFA)', width: `${progress}%` }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Card grid */}
            <div className="grid grid-cols-4 gap-2 md:gap-3 flex-1 content-center overflow-auto">
              {cards.map((card) => {
                const isFlipped = flipped.includes(card.id);
                const isMatched = matched.includes(card.pairId);
                const isActive = isFlipped || isMatched;

                return (
                  <motion.button
                    key={card.id}
                    onClick={() => handleCardClick(card.id, card.pairId)}
                    className="relative aspect-square rounded-[12px] overflow-hidden cursor-pointer"
                    whileHover={!isActive ? { scale: 1.04 } : {}}
                    whileTap={!isActive ? { scale: 0.96 } : {}}
                    disabled={isMatched || disabled || isFlipped}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Back face */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center rounded-[12px]"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(110,231,255,0.15)',
                        backfaceVisibility: 'hidden',
                      }}
                      initial={{ rotateY: 0 }}
                      animate={{ rotateY: isActive ? -180 : 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <div style={{ fontSize: '18px', opacity: 0.3 }}>?</div>
                    </motion.div>

                    {/* Front face */}
                    <motion.div
                      className="absolute inset-0 flex flex-col items-center justify-center rounded-[12px] p-2"
                      style={{
                        background: isMatched
                          ? 'rgba(110,231,255,0.12)'
                          : 'rgba(167,139,250,0.12)',
                        border: isMatched
                          ? '1px solid rgba(110,231,255,0.4)'
                          : '1px solid rgba(167,139,250,0.4)',
                        backfaceVisibility: 'hidden',
                      }}
                      initial={{ rotateY: 180 }}
                      animate={{ rotateY: isActive ? 0 : 180 }}
                      transition={{ duration: 0.35 }}
                    >
                      <div style={{ fontSize: '20px', marginBottom: '4px' }}>{card.emoji}</div>
                      <div
                        style={{
                          fontSize: '9px',
                          color: isMatched ? '#6EE7FF' : '#A78BFA',
                          textAlign: 'center',
                          lineHeight: 1.3,
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {card.content}
                      </div>
                    </motion.div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {gameWon && (
          <motion.div
            key="won"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center flex-1 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.6, repeat: 2 }}
              className="text-5xl mb-6"
            >
              ✨
            </motion.div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
              Archive Unlocked
            </h2>
            <p style={{ fontSize: '14px', color: '#6B6B6B', marginBottom: '8px' }}>
              {alreadyCompleted
                ? 'You\'ve already explored this archive.'
                : `Completed in ${moves} moves, ${playerName}.`}
            </p>
            <p style={{ fontSize: '13px', color: '#6B6B6B', maxWidth: '320px', lineHeight: 1.6, marginBottom: '32px' }}>
              These aren't just stories — they're the reason I build the way I do.
            </p>
            <div className="flex gap-3">
              <motion.button
                onClick={startGame}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-[12px] text-sm"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(110,231,255,0.2)',
                  color: '#6B6B6B',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  letterSpacing: '0.15em',
                }}
              >
                PLAY AGAIN
              </motion.button>
              <motion.button
                onClick={onBack}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-[12px] text-sm"
                style={{
                  background: 'linear-gradient(135deg, #6EE7FF18, #A78BFA18)',
                  border: '1px solid rgba(110,231,255,0.3)',
                  color: '#6EE7FF',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  letterSpacing: '0.15em',
                  fontWeight: 600,
                }}
              >
                RETURN TO HUB
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}