import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface GlitchPuzzleProps {
  onBack: () => void;
  onScore: (score: number) => void;
  highScore: number;
}

const SIZE = 3; // 3x3 grid
const TOTAL = SIZE * SIZE;

function shuffle(arr: number[]): number[] {
  const a = [...arr];
  // Solvable shuffle: do random valid moves from solved state
  let blank = TOTAL - 1;
  for (let i = 0; i < 200; i++) {
    const row = Math.floor(blank / SIZE);
    const col = blank % SIZE;
    const moves: number[] = [];
    if (row > 0) moves.push(blank - SIZE);
    if (row < SIZE - 1) moves.push(blank + SIZE);
    if (col > 0) moves.push(blank - 1);
    if (col < SIZE - 1) moves.push(blank + 1);
    const target = moves[Math.floor(Math.random() * moves.length)];
    [a[blank], a[target]] = [a[target], a[blank]];
    blank = target;
  }
  return a;
}

const FRAGMENTS = [
  'INIT SYS',
  'MEMORY',
  'KERNEL',
  'NET LINK',
  'FIREWALL',
  'CIPHER',
  'AUTH KEY',
  'ROOT ACC',
];

// Tile colors
const TILE_COLORS = [
  '#6EE7FF', '#A78BFA', '#34D399',
  '#F59E0B', '#F472B6', '#6EE7FF',
  '#A78BFA', '#34D399',
];

export function GlitchPuzzle({ onBack, onScore, highScore }: GlitchPuzzleProps) {
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'solved'>('intro');
  const [glitching, setGlitching] = useState<number | null>(null);
  const timerRef = { current: 0 as ReturnType<typeof setInterval> };

  const isSolved = useCallback((t: number[]) => t.every((v, i) => v === i), []);

  const startGame = useCallback(() => {
    const shuffled = shuffle(Array.from({ length: TOTAL }, (_, i) => i));
    setTiles(shuffled);
    setMoves(0);
    setElapsed(0);
    setGameState('playing');
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  const handleTileClick = useCallback((index: number) => {
    if (gameState !== 'playing') return;
    const blankIdx = tiles.indexOf(TOTAL - 1);
    const blankRow = Math.floor(blankIdx / SIZE);
    const blankCol = blankIdx % SIZE;
    const tileRow = Math.floor(index / SIZE);
    const tileCol = index % SIZE;

    // Can only move if adjacent to blank
    const adjacent =
      (Math.abs(blankRow - tileRow) === 1 && blankCol === tileCol) ||
      (Math.abs(blankCol - tileCol) === 1 && blankRow === tileRow);

    if (!adjacent) return;

    // Glitch flash on tile
    setGlitching(index);
    setTimeout(() => setGlitching(null), 120);

    const newTiles = [...tiles];
    [newTiles[blankIdx], newTiles[index]] = [newTiles[index], newTiles[blankIdx]];
    const newMoves = moves + 1;
    setTiles(newTiles);
    setMoves(newMoves);

    if (isSolved(newTiles)) {
      clearInterval(timerRef.current);
      setGameState('solved');
      // Score: base 1000, minus 5 per move, plus 2 per second saved vs par (60s)
      const score = Math.max(100, 1000 - newMoves * 5 + Math.max(0, 60 - elapsed) * 2);
      onScore(score);
    }
  }, [tiles, gameState, moves, elapsed, isSolved, onScore]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ color: '#E5E7EB' }}>
      <div className="flex items-center justify-between mb-4 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 transition-opacity hover:opacity-70"
          style={{ color: '#A78BFA', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
        >
          ← BACK
        </button>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#6B6B6B', letterSpacing: '0.15em' }}>
          GLITCH.PUZZLE
        </div>
        {highScore > 0 && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#A78BFA' }}>
            BEST: {highScore}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <div className="text-4xl mb-4">🧩</div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>GLITCH.PUZZLE</h2>
            <p style={{ fontSize: '13px', color: '#6B6B6B', marginBottom: '8px', lineHeight: 1.6, maxWidth: '260px' }}>
              System fragments are scrambled. Slide the tiles to restore the correct sequence. Fewer moves = higher score.
            </p>
            <p style={{ fontSize: '11px', color: '#6B6B6B', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
              Tap / click a tile adjacent to the blank space to move it.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={startGame}
              className="px-8 py-3 rounded-[12px] mt-4"
              style={{
                background: 'linear-gradient(135deg, #A78BFA18, #F472B618)',
                border: '1px solid rgba(167,139,250,0.3)',
                color: '#A78BFA',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.15em',
                fontWeight: 600,
              }}
            >
              DECRYPT →
            </motion.button>
          </motion.div>
        )}

        {(gameState === 'playing' || gameState === 'solved') && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center gap-4 overflow-hidden"
          >
            {/* Stats */}
            <div className="flex justify-between w-full shrink-0" style={{ maxWidth: '300px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#6B6B6B' }}>
                MOVES: <span style={{ color: '#A78BFA' }}>{moves}</span>
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#6B6B6B' }}>
                TIME: <span style={{ color: '#A78BFA' }}>{formatTime(elapsed)}</span>
              </span>
            </div>

            {/* Grid */}
            <div
              className="grid gap-2 shrink-0"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${SIZE}, 90px)`,
                gridTemplateRows: `repeat(${SIZE}, 90px)`,
              }}
            >
              {tiles.map((val, idx) => {
                const isBlank = val === TOTAL - 1;
                const isSolvedPos = val === idx;
                const isGlitch = glitching === idx;
                return (
                  <motion.button
                    key={val}
                    onClick={() => handleTileClick(idx)}
                    animate={isGlitch ? { x: [0, -4, 4, -2, 2, 0], opacity: [1, 0.5, 1] } : {}}
                    transition={{ duration: 0.12 }}
                    whileHover={!isBlank ? { scale: 1.04 } : {}}
                    whileTap={!isBlank ? { scale: 0.96 } : {}}
                    className="rounded-[12px] flex flex-col items-center justify-center relative overflow-hidden"
                    style={{
                      width: 90,
                      height: 90,
                      background: isBlank
                        ? 'rgba(255,255,255,0.02)'
                        : isSolvedPos
                        ? `${TILE_COLORS[val]}18`
                        : 'rgba(255,255,255,0.06)',
                      border: isBlank
                        ? '1px dashed rgba(255,255,255,0.06)'
                        : `1px solid ${isSolvedPos ? TILE_COLORS[val] + '40' : 'rgba(255,255,255,0.1)'}`,
                      cursor: isBlank ? 'default' : 'pointer',
                      boxShadow: isSolvedPos && !isBlank ? `0 0 12px ${TILE_COLORS[val]}20` : 'none',
                    }}
                  >
                    {!isBlank && (
                      <>
                        <span style={{
                          fontSize: '20px',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          color: isSolvedPos ? TILE_COLORS[val] : '#E5E7EB',
                          letterSpacing: '-0.02em',
                          lineHeight: 1,
                          marginBottom: '4px',
                        }}>
                          {(val + 1).toString().padStart(2, '0')}
                        </span>
                        <span style={{
                          fontSize: '8px',
                          fontFamily: 'var(--font-mono)',
                          color: isSolvedPos ? TILE_COLORS[val] : '#6B6B6B',
                          letterSpacing: '0.1em',
                        }}>
                          {FRAGMENTS[val] || 'DATA'}
                        </span>
                        {isSolvedPos && (
                          <div
                            className="absolute inset-0 rounded-[12px]"
                            style={{ background: `linear-gradient(135deg, ${TILE_COLORS[val]}08, transparent)` }}
                          />
                        )}
                      </>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Solved overlay */}
            <AnimatePresence>
              {gameState === 'solved' && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center text-center"
                >
                  <motion.div
                    animate={{ textShadow: ['0 0 8px #34D399', '0 0 24px #34D399', '0 0 8px #34D399'] }}
                    transition={{ duration: 1.5, repeat: 2 }}
                    style={{ fontSize: '22px', fontWeight: 700, color: '#34D399', marginBottom: '6px' }}
                  >
                    SYSTEM RESTORED ✓
                  </motion.div>
                  <p style={{ fontSize: '12px', color: '#6B6B6B', marginBottom: '16px' }}>
                    {moves} moves · {formatTime(elapsed)}
                  </p>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={startGame}
                      className="px-6 py-2.5 rounded-[10px]"
                      style={{
                        background: 'linear-gradient(135deg, #A78BFA18, #F472B618)',
                        border: '1px solid rgba(167,139,250,0.3)',
                        color: '#A78BFA',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        letterSpacing: '0.12em',
                        fontWeight: 600,
                      }}
                    >
                      RETRY
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={onBack}
                      className="px-6 py-2.5 rounded-[10px]"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: '#6B6B6B',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        letterSpacing: '0.12em',
                      }}
                    >
                      VAULT
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
