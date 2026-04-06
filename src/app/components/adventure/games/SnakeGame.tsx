import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TouchDpad } from './TouchDpad';

interface SnakeGameProps {
  onBack: () => void;
  onScore: (score: number) => void;
  highScore: number;
}

const COLS = 20;
const ROWS = 20;
const CELL = 18;
const CANVAS_W = COLS * CELL;
const CANVAS_H = ROWS * CELL;

type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Pt = { x: number; y: number };

const rand = (max: number) => Math.floor(Math.random() * max);
const ptEq = (a: Pt, b: Pt) => a.x === b.x && a.y === b.y;

const SPEED_MS = [200, 165, 135, 110, 90, 75];

export function SnakeGame({ onBack, onScore, highScore }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    snake: [{ x: 10, y: 10 }] as Pt[],
    dir: 'RIGHT' as Dir,
    nextDir: 'RIGHT' as Dir,
    food: { x: 5, y: 5 } as Pt,
    score: 0,
    running: false,
    timerId: 0 as ReturnType<typeof setTimeout>,
    touchDir: null as Dir | null,
  });
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'over'>('intro');
  const [score, setScore] = useState(0);

  const placeFood = useCallback((snake: Pt[]) => {
    let food: Pt;
    do {
      food = { x: rand(COLS), y: rand(ROWS) };
    } while (snake.some(p => ptEq(p, food)));
    return food;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const s = stateRef.current;

    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Grid dots
    ctx.fillStyle = 'rgba(110,231,255,0.04)';
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2);
      }
    }

    // Food
    const fx = s.food.x * CELL + CELL / 2;
    const fy = s.food.y * CELL + CELL / 2;
    ctx.shadowColor = '#34D399';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#34D399';
    ctx.beginPath();
    ctx.arc(fx, fy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    s.snake.forEach((seg, i) => {
      const x = seg.x * CELL + 1;
      const y = seg.y * CELL + 1;
      const size = CELL - 2;
      const isHead = i === 0;
      const ratio = i / s.snake.length;
      const r = Math.round(110 * (1 - ratio * 0.5));
      const g = Math.round(231 * (1 - ratio * 0.2));
      const b = 255;
      ctx.fillStyle = isHead ? '#6EE7FF' : `rgb(${r},${g},${b})`;
      ctx.shadowColor = '#6EE7FF';
      ctx.shadowBlur = isHead ? 10 : 0;
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, isHead ? 5 : 3);
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  }, []);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (!s.running) return;

    s.dir = s.nextDir;
    const head = s.snake[0];
    const next: Pt = { x: head.x, y: head.y };

    if (s.dir === 'UP') next.y--;
    if (s.dir === 'DOWN') next.y++;
    if (s.dir === 'LEFT') next.x--;
    if (s.dir === 'RIGHT') next.x++;

    // Wall collision
    if (next.x < 0 || next.x >= COLS || next.y < 0 || next.y >= ROWS) {
      s.running = false;
      setGameState('over');
      onScore(s.score);
      draw();
      return;
    }

    // Self collision
    if (s.snake.some(seg => ptEq(seg, next))) {
      s.running = false;
      setGameState('over');
      onScore(s.score);
      draw();
      return;
    }

    const ate = ptEq(next, s.food);
    if (ate) {
      s.score += 10;
      setScore(s.score);
      s.food = placeFood([next, ...s.snake]);
      s.snake = [next, ...s.snake];
    } else {
      s.snake = [next, ...s.snake.slice(0, -1)];
    }

    draw();

    const speedTier = Math.min(Math.floor(s.score / 50), SPEED_MS.length - 1);
    s.timerId = setTimeout(tick, SPEED_MS[speedTier]);
  }, [draw, placeFood, onScore]);

  const startGame = useCallback(() => {
    const s = stateRef.current;
    clearTimeout(s.timerId);
    s.snake = [{ x: 10, y: 10 }];
    s.dir = 'RIGHT';
    s.nextDir = 'RIGHT';
    s.food = placeFood([{ x: 10, y: 10 }]);
    s.score = 0;
    s.running = true;
    setScore(0);
    setGameState('playing');
    s.timerId = setTimeout(tick, SPEED_MS[0]);
    draw();
  }, [tick, draw, placeFood]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const opposite: Record<Dir, Dir> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
    const dirMap: Record<string, Dir> = {
      ArrowUp: 'UP', w: 'UP', W: 'UP',
      ArrowDown: 'DOWN', s: 'DOWN', S: 'DOWN',
      ArrowLeft: 'LEFT', a: 'LEFT', A: 'LEFT',
      ArrowRight: 'RIGHT', d: 'RIGHT', D: 'RIGHT',
    };
    const handleKey = (e: KeyboardEvent) => {
      const newDir = dirMap[e.key];
      if (newDir && newDir !== opposite[stateRef.current.dir]) {
        stateRef.current.nextDir = newDir;
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState]);

  useEffect(() => {
    return () => {
      stateRef.current.running = false;
      clearTimeout(stateRef.current.timerId);
    };
  }, []);

  const handleDpad = useCallback((dir: string, pressed: boolean) => {
    if (!pressed) return;
    const opposite: Record<Dir, Dir> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
    const map: Record<string, Dir> = { up: 'UP', down: 'DOWN', left: 'LEFT', right: 'RIGHT' };
    const newDir = map[dir];
    if (newDir && newDir !== opposite[stateRef.current.dir]) {
      stateRef.current.nextDir = newDir;
    }
  }, []);

  const speedLabel = Math.min(Math.floor(score / 50) + 1, SPEED_MS.length);

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ color: '#E5E7EB' }}>
      <div className="flex items-center justify-between mb-4 shrink-0">
        <button
          onClick={() => { stateRef.current.running = false; clearTimeout(stateRef.current.timerId); onBack(); }}
          className="flex items-center gap-2 transition-opacity hover:opacity-70"
          style={{ color: '#34D399', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
        >
          ← BACK
        </button>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#6B6B6B', letterSpacing: '0.15em' }}>
          DATA.SNAKE
        </div>
        {highScore > 0 && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#34D399' }}>
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
            <div className="text-4xl mb-4">🐍</div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>DATA.SNAKE</h2>
            <p style={{ fontSize: '13px', color: '#6B6B6B', marginBottom: '8px', lineHeight: 1.6, maxWidth: '260px' }}>
              Consume data packets. Every 50 points increases speed. Don't bite yourself.
            </p>
            <p style={{ fontSize: '11px', color: '#6B6B6B', fontFamily: 'var(--font-mono)', marginBottom: '28px' }}>
              WASD / Arrow keys / D-Pad to navigate
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={startGame}
              className="px-8 py-3 rounded-[12px]"
              style={{
                background: 'linear-gradient(135deg, #34D39918, #6EE7FF18)',
                border: '1px solid rgba(52,211,153,0.3)',
                color: '#34D399',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.15em',
                fontWeight: 600,
              }}
            >
              INITIALIZE →
            </motion.button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center gap-2 overflow-hidden"
          >
            <div className="flex justify-between w-full shrink-0" style={{ maxWidth: CANVAS_W + 'px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#6B6B6B' }}>
                SCORE: <span style={{ color: '#34D399' }}>{score}</span>
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#6B6B6B' }}>
                SPD: <span style={{ color: '#34D399' }}>{speedLabel}</span>
              </span>
            </div>
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              className="rounded-[10px]"
              style={{
                border: '1px solid rgba(52,211,153,0.15)',
                maxWidth: '100%',
                maxHeight: '50vh',
              }}
            />
            <TouchDpad onDirection={handleDpad} layout="cross" />
          </motion.div>
        )}

        {gameState === 'over' && (
          <motion.div
            key="over"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <div className="text-4xl mb-4">💀</div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '6px', color: '#EF4444' }}>CONNECTION LOST</h2>
            <p style={{ fontSize: '13px', color: '#6B6B6B', marginBottom: '4px' }}>Score: <span style={{ color: '#34D399', fontWeight: 700 }}>{score}</span></p>
            {score >= highScore && score > 0 && (
              <p style={{ fontSize: '11px', color: '#34D399', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>★ NEW HIGH SCORE</p>
            )}
            <p style={{ fontSize: '11px', color: '#6B6B6B', marginBottom: '28px', fontFamily: 'var(--font-mono)' }}>Best: {Math.max(score, highScore)}</p>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startGame}
                className="px-6 py-3 rounded-[12px]"
                style={{
                  background: 'linear-gradient(135deg, #34D39918, #6EE7FF18)',
                  border: '1px solid rgba(52,211,153,0.3)',
                  color: '#34D399',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  letterSpacing: '0.15em',
                  fontWeight: 600,
                }}
              >
                RETRY
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBack}
                className="px-6 py-3 rounded-[12px]"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#6B6B6B',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  letterSpacing: '0.15em',
                }}
              >
                VAULT
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
