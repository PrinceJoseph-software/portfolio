import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { TouchDpad } from './TouchDpad';

interface SpaceShooterProps {
  onBack: () => void;
  onScore: (score: number) => void;
  highScore: number;
}

const W = 360;
const H = 500;
const PLAYER_SPEED = 4;
const BULLET_SPEED = 7;
const ENEMY_W = 32;
const ENEMY_H = 24;
const PLAYER_W = 28;
const PLAYER_H = 28;

let _uid = 0;
const uid = () => ++_uid;

export function SpaceShooter({ onBack, onScore, highScore }: SpaceShooterProps) {
  // Canvas is ALWAYS mounted — we just hide the intro/over overlay on top.
  // This ensures canvasRef.current is never null when the loop runs.
  const canvasRef = useRef<HTMLCanvasElement>(null);

  type Phase = 'intro' | 'playing' | 'over';
  const [phase, setPhase] = useState<Phase>('intro');
  const [uiScore, setUiScore] = useState(0);
  const [uiLives, setUiLives] = useState(3);
  const [uiWave, setUiWave] = useState(1);

  const onScoreRef = useRef(onScore);
  useEffect(() => { onScoreRef.current = onScore; }, [onScore]);

  // All game state in a single ref — zero React overhead in the hot loop
  const g = useRef({
    player: { x: W / 2, y: H - 60 },
    bullets: [] as { id: number; x: number; y: number }[],
    enemies: [] as { id: number; x: number; y: number; hp: number; type: 0 | 1 | 2 }[],
    particles: [] as { id: number; x: number; y: number; vx: number; vy: number; life: number; color: string }[],
    score: 0,
    lives: 3,
    wave: 1,
    bulletCD: 0,
    spawnTimer: 0,
    running: false,
    keys: new Set<string>(),
    tLeft: false,
    tRight: false,
    tShoot: false,
    rafId: 0,
  });

  // ── Loop stored in ref — RAF always calls latest version ──────────────────
  const loopRef = useRef<() => void>(null!);
  loopRef.current = function tick() {
    const s = g.current;
    const canvas = canvasRef.current;
    if (!s.running || !canvas) return;
    const ctx = canvas.getContext('2d')!;

    // Input
    const left  = s.keys.has('ArrowLeft')  || s.keys.has('a') || s.tLeft;
    const right = s.keys.has('ArrowRight') || s.keys.has('d') || s.tRight;
    const shoot = s.keys.has(' ') || s.tShoot;

    if (left  && s.player.x > PLAYER_W / 2)     s.player.x -= PLAYER_SPEED;
    if (right && s.player.x < W - PLAYER_W / 2) s.player.x += PLAYER_SPEED;

    // Fire
    if (shoot && s.bulletCD <= 0) {
      s.bullets.push({ id: uid(), x: s.player.x, y: s.player.y - PLAYER_H / 2 });
      s.bulletCD = 12;
    }
    if (s.bulletCD > 0) s.bulletCD--;

    // Move bullets
    s.bullets.forEach(b => { b.y -= BULLET_SPEED; });
    s.bullets = s.bullets.filter(b => b.y > -10);

    // Spawn enemies
    const interval = Math.max(60 - s.wave * 6, 20);
    s.spawnTimer++;
    if (s.spawnTimer >= interval) {
      const types: Array<0 | 1 | 2> = [0, 1, 2];
      const type = types[Math.floor(Math.random() * types.length)];
      s.enemies.push({
        id: uid(),
        x: Math.random() * (W - ENEMY_W),
        y: -ENEMY_H,
        hp: type === 2 ? 3 : type === 1 ? 2 : 1,
        type,
      });
      s.spawnTimer = 0;
    }

    // Move enemies
    const spd = 1.2 + s.wave * 0.3;
    s.enemies.forEach(e => { e.y += spd; });

    // Inline particle spawner
    const boom = (x: number, y: number, color: string) => {
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 * i) / 8 + Math.random() * 0.5;
        s.particles.push({
          id: uid(), x, y,
          vx: Math.cos(a) * (1 + Math.random() * 3),
          vy: Math.sin(a) * (1 + Math.random() * 3),
          life: 1, color,
        });
      }
    };

    // Bullet × enemy collision
    s.bullets = s.bullets.filter(b => {
      let hit = false;
      s.enemies = s.enemies.filter(e => {
        if (b.x > e.x && b.x < e.x + ENEMY_W && b.y > e.y && b.y < e.y + ENEMY_H) {
          e.hp--;
          hit = true;
          boom(e.x + ENEMY_W / 2, e.y + ENEMY_H / 2, ['#6EE7FF', '#A78BFA', '#F472B6'][e.type]);
          if (e.hp <= 0) {
            s.score += (e.type + 1) * 10;
            setUiScore(s.score);
            const nw = Math.floor(s.score / 200) + 1;
            if (nw > s.wave) { s.wave = nw; setUiWave(nw); }
            return false;
          }
        }
        return true;
      });
      return !hit;
    });

    // Enemies reaching bottom
    s.enemies = s.enemies.filter(e => {
      if (e.y > H) {
        s.lives--;
        setUiLives(s.lives);
        boom(s.player.x, s.player.y, '#EF4444');
        if (s.lives <= 0) {
          s.running = false;
          setPhase('over');
          onScoreRef.current(s.score);
        }
        return false;
      }
      return true;
    });

    // Particles
    s.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.life -= 0.04; p.vx *= 0.96; p.vy *= 0.96; });
    s.particles = s.particles.filter(p => p.life > 0);

    // ── DRAW ────────────────────────────────────────────────────────────────
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(110,231,255,0.05)';
    ctx.lineWidth = 1;
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }

    // Particles
    s.particles.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
    });
    ctx.globalAlpha = 1;

    // Enemies
    const eCols = ['#EF4444', '#F59E0B', '#A78BFA'];
    s.enemies.forEach(e => {
      ctx.shadowColor = eCols[e.type]; ctx.shadowBlur = 8;
      ctx.fillStyle = eCols[e.type];
      ctx.beginPath();
      ctx.moveTo(e.x + ENEMY_W / 2, e.y + ENEMY_H);
      ctx.lineTo(e.x, e.y);
      ctx.lineTo(e.x + ENEMY_W, e.y);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      for (let i = 0; i < e.hp; i++) { ctx.fillStyle = '#fff'; ctx.fillRect(e.x + 4 + i * 8, e.y + 4, 4, 4); }
    });

    // Player
    ctx.shadowColor = '#6EE7FF'; ctx.shadowBlur = 16;
    ctx.fillStyle = '#6EE7FF';
    ctx.beginPath();
    ctx.moveTo(s.player.x, s.player.y - PLAYER_H / 2);
    ctx.lineTo(s.player.x - PLAYER_W / 2, s.player.y + PLAYER_H / 2);
    ctx.lineTo(s.player.x, s.player.y + PLAYER_H / 4);
    ctx.lineTo(s.player.x + PLAYER_W / 2, s.player.y + PLAYER_H / 2);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Bullets
    ctx.fillStyle = '#6EE7FF'; ctx.shadowColor = '#6EE7FF'; ctx.shadowBlur = 8;
    s.bullets.forEach(b => { ctx.fillRect(b.x - 2, b.y - 8, 4, 12); });
    ctx.shadowBlur = 0;

    // Canvas HUD
    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = '#6B6B6B';
    ctx.fillText(`SCORE: ${s.score}`, 12, 20);
    ctx.fillText(`WAVE: ${s.wave}`, W - 72, 20);
    for (let i = 0; i < s.lives; i++) { ctx.fillStyle = '#6EE7FF'; ctx.fillRect(12 + i * 14, 30, 8, 8); }

    s.rafId = requestAnimationFrame(() => loopRef.current());
  };

  // ── Start game ────────────────────────────────────────────────────────────
  const startGame = () => {
    const s = g.current;
    if (s.rafId) { cancelAnimationFrame(s.rafId); s.rafId = 0; }
    s.player = { x: W / 2, y: H - 60 };
    s.bullets = []; s.enemies = []; s.particles = [];
    s.score = 0; s.lives = 3; s.wave = 1;
    s.bulletCD = 0; s.spawnTimer = 0;
    s.keys.clear();
    s.tLeft = false; s.tRight = false; s.tShoot = false;
    setUiScore(0); setUiLives(3); setUiWave(1);
    setPhase('playing');
    s.running = true;
    // Canvas is already in the DOM (always mounted). Start loop immediately.
    s.rafId = requestAnimationFrame(() => loopRef.current());
  };

  // Stop loop when not playing
  useEffect(() => {
    if (phase !== 'playing') {
      g.current.running = false;
    }
  }, [phase]);

  // Keyboard
  useEffect(() => {
    if (phase !== 'playing') return;
    const dn = (e: KeyboardEvent) => { g.current.keys.add(e.key); if (e.key === ' ') e.preventDefault(); };
    const up = (e: KeyboardEvent) => g.current.keys.delete(e.key);
    window.addEventListener('keydown', dn);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', dn); window.removeEventListener('keyup', up); };
  }, [phase]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      g.current.running = false;
      if (g.current.rafId) cancelAnimationFrame(g.current.rafId);
    };
  }, []);

  const handleDpad = (dir: string, pressed: boolean) => {
    if (dir === 'left')  g.current.tLeft  = pressed;
    if (dir === 'right') g.current.tRight = pressed;
    if (dir === 'up')    g.current.tShoot = pressed;
  };

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ color: '#E5E7EB' }}>
      {/* Header — always visible */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <button
          onClick={() => { g.current.running = false; onBack(); }}
          style={{ color: '#6EE7FF', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
          className="transition-opacity hover:opacity-70"
        >
          ← BACK
        </button>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#6B6B6B', letterSpacing: '0.15em' }}>
          VOID.SHOOTER
        </span>
        {highScore > 0 && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#6EE7FF' }}>
            BEST: {highScore}
          </span>
        )}
      </div>

      {/* Canvas is ALWAYS in the DOM — visibility toggled, never unmounted */}
      <div
        className="flex-1 flex flex-col items-center gap-2 overflow-hidden"
        style={{ display: phase === 'playing' ? 'flex' : 'none' }}
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{
            display: 'block',
            borderRadius: '12px',
            border: '1px solid rgba(110,231,255,0.15)',
            maxWidth: '100%',
            maxHeight: '58vh',
          }}
        />
        <div style={{ fontSize: '11px', color: '#4B5563', fontFamily: 'var(--font-mono)' }}>
          ♥ {uiLives} &nbsp;|&nbsp; {uiScore} pts &nbsp;|&nbsp; wave {uiWave}
        </div>
        <TouchDpad onDirection={handleDpad} layout="horizontal" shootButton />
      </div>

      {/* Intro screen — overlaid when phase === 'intro' */}
      {phase === 'intro' && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center text-center"
        >
          <div className="text-5xl mb-4">🚀</div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>VOID.SHOOTER</h2>
          <p style={{ fontSize: '13px', color: '#6B6B6B', marginBottom: '8px', lineHeight: 1.6, maxWidth: '260px' }}>
            Enemies descend from above. Destroy them before they break through.
          </p>
          <p style={{ fontSize: '11px', color: '#6B6B6B', fontFamily: 'var(--font-mono)', marginBottom: '28px' }}>
            ← → to move &nbsp;·&nbsp; Space / ↑ to shoot
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={startGame}
            style={{
              padding: '10px 32px', borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(110,231,255,0.12), rgba(167,139,250,0.12))',
              border: '1px solid rgba(110,231,255,0.3)',
              color: '#6EE7FF', fontFamily: 'var(--font-mono)',
              letterSpacing: '0.15em', fontWeight: 600, cursor: 'pointer',
            }}
          >
            LAUNCH →
          </motion.button>
        </motion.div>
      )}

      {/* Game Over screen */}
      {phase === 'over' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center text-center"
        >
          <div className="text-4xl mb-4">💥</div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '6px', color: '#EF4444' }}>SYSTEM DESTROYED</h2>
          <p style={{ fontSize: '13px', color: '#6B6B6B', marginBottom: '4px' }}>
            Score: <span style={{ color: '#6EE7FF', fontWeight: 700 }}>{uiScore}</span>
          </p>
          {uiScore >= highScore && uiScore > 0 && (
            <p style={{ fontSize: '11px', color: '#34D399', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>★ NEW HIGH SCORE</p>
          )}
          <p style={{ fontSize: '11px', color: '#6B6B6B', marginBottom: '28px', fontFamily: 'var(--font-mono)' }}>
            Best: {Math.max(uiScore, highScore)}
          </p>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={startGame}
              style={{
                padding: '10px 24px', borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(110,231,255,0.12), rgba(167,139,250,0.12))',
                border: '1px solid rgba(110,231,255,0.3)',
                color: '#6EE7FF', fontFamily: 'var(--font-mono)',
                fontSize: '12px', letterSpacing: '0.15em', fontWeight: 600, cursor: 'pointer',
              }}
            >
              RETRY
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={onBack}
              style={{
                padding: '10px 24px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#6B6B6B', fontFamily: 'var(--font-mono)',
                fontSize: '12px', letterSpacing: '0.15em', cursor: 'pointer',
              }}
            >
              VAULT
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
