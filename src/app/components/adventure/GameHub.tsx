import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SpaceShooter } from './games/SpaceShooter';
import { SnakeGame } from './games/SnakeGame';
import { GlitchPuzzle } from './games/GlitchPuzzle';

interface GameHubProps {
  onBack: () => void;
  gameScores: Record<string, number>;
  onUpdateScore: (gameId: string, score: number) => void;
}

type ActiveGame = 'hub' | 'spaceshooter' | 'snake' | 'glitchpuzzle';

const games = [
  {
    id: 'spaceshooter',
    title: 'VOID.SHOOTER',
    description: 'Defend against incoming threats. How long can you survive?',
    icon: '🚀',
    color: '#6EE7FF',
    controls: 'Arrow Keys / Touch',
    difficulty: 'MEDIUM',
  },
  {
    id: 'snake',
    title: 'DATA.SNAKE',
    description: 'Consume data packets. Grow. Don\'t loop back on yourself.',
    icon: '🐍',
    color: '#34D399',
    controls: 'WASD / D-Pad',
    difficulty: 'EASY',
  },
  {
    id: 'glitchpuzzle',
    title: 'GLITCH.PUZZLE',
    description: 'Reassemble corrupted system fragments. Recover the signal.',
    icon: '🧩',
    color: '#A78BFA',
    controls: 'Click / Tap',
    difficulty: 'HARD',
  },
];

export function GameHub({ onBack, gameScores, onUpdateScore }: GameHubProps) {
  const [activeGame, setActiveGame] = useState<ActiveGame>('hub');
  const [unlockPlayed, setUnlockPlayed] = useState(false);

  const handleGameSelect = (gameId: ActiveGame) => {
    setActiveGame(gameId);
  };

  const handleScoreUpdate = (gameId: string, score: number) => {
    const current = gameScores[gameId] ?? 0;
    if (score > current) {
      onUpdateScore(gameId, score);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ color: '#E5E7EB' }}>
      <AnimatePresence mode="wait">
        {activeGame === 'hub' && (
          <motion.div
            key="gamehub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full overflow-hidden"
            onAnimationComplete={() => setUnlockPlayed(true)}
          >
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
                GAME.VAULT
              </div>
            </div>

            {/* Unlock celebration */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8 shrink-0"
            >
              <motion.div
                animate={unlockPlayed ? {} : {
                  textShadow: ['0 0 8px #6EE7FF', '0 0 20px #6EE7FF', '0 0 8px #6EE7FF'],
                }}
                transition={{ duration: 2, repeat: 2 }}
                style={{ fontSize: '28px', fontWeight: 700, marginBottom: '6px', color: '#E5E7EB' }}
              >
                All nodes explored. ✦
              </motion.div>
              <p style={{ fontSize: '13px', color: '#6B6B6B', lineHeight: 1.6 }}>
                You've unlocked the Game Vault. Three challenges await.
              </p>
            </motion.div>

            {/* Game cards */}
            <div className="flex-1 overflow-auto">
              <div className="space-y-4">
                {games.map((game, i) => {
                  const highScore = gameScores[game.id] ?? 0;
                  return (
                    <motion.button
                      key={game.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.12 }}
                      whileHover={{ x: 6 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleGameSelect(game.id as ActiveGame)}
                      className="w-full p-5 rounded-[16px] text-left relative overflow-hidden"
                      style={{
                        background: `${game.color}06`,
                        border: `1px solid ${game.color}25`,
                      }}
                    >
                      {/* Glow hover layer */}
                      <div
                        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
                        style={{ background: `radial-gradient(circle at 20% 50%, ${game.color}08 0%, transparent 60%)` }}
                      />
                      <div className="relative flex items-center gap-4">
                        <div
                          className="text-2xl w-12 h-12 flex items-center justify-center rounded-[12px] shrink-0"
                          style={{ background: `${game.color}15` }}
                        >
                          {game.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: game.color, letterSpacing: '0.1em' }}>
                              {game.title}
                            </span>
                            <span
                              className="px-2 py-0.5 rounded-full shrink-0"
                              style={{
                                fontSize: '9px',
                                fontFamily: 'var(--font-mono)',
                                background: `${game.color}15`,
                                color: game.color,
                                letterSpacing: '0.1em',
                              }}
                            >
                              {game.difficulty}
                            </span>
                          </div>
                          <p style={{ fontSize: '12px', color: '#6B6B6B', lineHeight: 1.5, marginBottom: '8px' }}>
                            {game.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span style={{ fontSize: '10px', color: '#6B6B6B', fontFamily: 'var(--font-mono)' }}>
                              {game.controls}
                            </span>
                            {highScore > 0 && (
                              <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: game.color }}>
                                BEST: {highScore.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ color: game.color, fontSize: '18px', shrink: '0' }}>→</div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Total scores footer */}
              {Object.keys(gameScores).length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 pt-4"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <p style={{ fontSize: '10px', color: '#6B6B6B', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
                    TOTAL SCORE: {Object.values(gameScores).reduce((a, b) => a + b, 0).toLocaleString()}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {activeGame === 'spaceshooter' && (
          <motion.div
            key="spaceshooter"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <SpaceShooter
              onBack={() => setActiveGame('hub')}
              onScore={(score) => handleScoreUpdate('spaceshooter', score)}
              highScore={gameScores['spaceshooter'] ?? 0}
            />
          </motion.div>
        )}

        {activeGame === 'snake' && (
          <motion.div
            key="snake"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <SnakeGame
              onBack={() => setActiveGame('hub')}
              onScore={(score) => handleScoreUpdate('snake', score)}
              highScore={gameScores['snake'] ?? 0}
            />
          </motion.div>
        )}

        {activeGame === 'glitchpuzzle' && (
          <motion.div
            key="glitchpuzzle"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <GlitchPuzzle
              onBack={() => setActiveGame('hub')}
              onScore={(score) => handleScoreUpdate('glitchpuzzle', score)}
              highScore={gameScores['glitchpuzzle'] ?? 0}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
