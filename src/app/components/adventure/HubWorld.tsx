import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MemoryGame } from './nodes/MemoryGame';
import { SkillsNode } from './nodes/SkillsNode';
import { ThoughtsNode } from './nodes/ThoughtsNode';
import { FutureNode } from './nodes/FutureNode';
import { GameHub } from './GameHub';

interface Player {
  name: string;
  progress: {
    unlockedNodes: string[];
    completedGames: string[];
  };
  gameScores: Record<string, number>;
  _v: number;
  _c?: number;
}

interface HubWorldProps {
  player: Player;
  onUpdatePlayer: (player: Player) => void;
  onExit: () => void;
}

type HubNode = 'hub' | 'memory' | 'skills' | 'thoughts' | 'future' | 'gamehub';

const hubNodes = [
  {
    id: 'memory',
    label: 'Memory',
    description: 'Fragments from the past',
    icon: '🧠',
    color: '#6EE7FF',
    angle: -110,
    distance: 150,
  },
  {
    id: 'skills',
    label: 'Skills',
    description: 'The craft matrix',
    icon: '⚡',
    color: '#A78BFA',
    angle: 70,
    distance: 150,
  },
  {
    id: 'thoughts',
    label: 'Thoughts',
    description: 'Philosophy in dialogue',
    icon: '💬',
    color: '#F472B6',
    angle: 180,
    distance: 150,
  },
  {
    id: 'future',
    label: 'Future',
    description: 'The horizon ahead',
    icon: '🔭',
    color: '#F59E0B',
    angle: -40,
    distance: 150,
  },
];

export function HubWorld({ player, onUpdatePlayer, onExit }: HubWorldProps) {
  const [activeNode, setActiveNode] = useState<HubNode>('hub');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const completedCount = player.progress.completedGames.length;
  const totalNodes = hubNodes.length;

  const handleNodeComplete = (nodeId: string) => {
    const newCompleted = player.progress.completedGames.includes(nodeId)
      ? player.progress.completedGames
      : [...player.progress.completedGames, nodeId];

    const updated: Player = {
      ...player,
      progress: {
        ...player.progress,
        completedGames: newCompleted,
      },
    };
    onUpdatePlayer(updated);
  };

  const handleUpdateScore = (gameId: string, score: number) => {
    const current = player.gameScores?.[gameId] ?? 0;
    if (score > current) {
      const updated: Player = {
        ...player,
        gameScores: { ...player.gameScores, [gameId]: score },
      };
      onUpdatePlayer(updated);
    }
  };

  const handleExit = () => {
    setShowExitConfirm(false);
    onExit();
  };

  // Pulse animation for hub
  const allComplete = completedCount >= totalNodes;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden flex flex-col"
      style={{ background: '#050505' }}
    >
      {/* Ambient grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(110,231,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(110,231,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Header bar */}
      <div
        className="relative z-10 flex items-center justify-between px-6 py-4 shrink-0"
        style={{ borderBottom: '1px solid rgba(110,231,255,0.08)' }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full"
            style={{ background: '#6EE7FF' }}
          />
          <span
            style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#6EE7FF', letterSpacing: '0.2em' }}
          >
            ADVENTURE.MODE — {player.name.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#6B6B6B' }}>
            {completedCount}/{totalNodes} NODES
          </span>
          <button
            onClick={() => setShowExitConfirm(true)}
            className="text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: '#6B6B6B', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}
          >
            EXIT ✕
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeNode === 'hub' && (
            <motion.div
              key="hub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* Connection lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
                <defs>
                  <radialGradient id="lineGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#6EE7FF" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#6EE7FF" stopOpacity="0.0" />
                  </radialGradient>
                </defs>
              </svg>

              {/* Hub map container — 420x420, centre at 210,210 */}
              <div className="relative" style={{ width: 420, height: 420 }}>
                {/* Connection lines */}
                {hubNodes.map(node => {
                  const rad = (node.angle * Math.PI) / 180;
                  const x2 = 210 + node.distance * Math.cos(rad);
                  const y2 = 210 + node.distance * Math.sin(rad);
                  const isComplete = player.progress.completedGames.includes(node.id);
                  return (
                    <svg
                      key={node.id}
                      className="absolute inset-0 pointer-events-none"
                      style={{ width: 420, height: 420 }}
                    >
                      <line
                        x1="210" y1="210"
                        x2={x2} y2={y2}
                        stroke={isComplete ? node.color : 'rgba(255,255,255,0.06)'}
                        strokeWidth="1"
                        strokeDasharray={isComplete ? 'none' : '4 4'}
                      />
                      {isComplete && (
                        <motion.circle
                          cx="210" cy="210" r="4"
                          fill={node.color}
                          animate={{
                            cx: [210, x2, 210],
                            cy: [210, y2, 210],
                          }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: Math.random() * 2 }}
                        />
                      )}
                    </svg>
                  );
                })}

                {/* Surrounding nodes */}
                {hubNodes.map(node => {
                  const rad = (node.angle * Math.PI) / 180;
                  const x = 210 + node.distance * Math.cos(rad) - 44;
                  const y = 210 + node.distance * Math.sin(rad) - 44;
                  const isComplete = player.progress.completedGames.includes(node.id);
                  const isHovered = hoveredNode === node.id;

                  return (
                    <motion.button
                      key={node.id}
                      className="absolute flex flex-col items-center justify-center rounded-full cursor-pointer"
                      style={{
                        left: x,
                        top: y,
                        width: 88,
                        height: 88,
                        background: isComplete
                          ? `${node.color}15`
                          : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${isComplete ? node.color + '40' : 'rgba(255,255,255,0.08)'}`,
                        boxShadow: isHovered
                          ? `0 0 24px ${node.color}30, 0 0 0 1px ${node.color}20`
                          : isComplete
                          ? `0 0 12px ${node.color}15`
                          : 'none',
                      }}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      onHoverStart={() => setHoveredNode(node.id)}
                      onHoverEnd={() => setHoveredNode(null)}
                      onClick={() => setActiveNode(node.id as HubNode)}
                      animate={isComplete ? { opacity: [1, 0.8, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                    >
                      <div style={{ fontSize: '20px', marginBottom: '4px' }}>{node.icon}</div>
                      <div
                        style={{
                          fontSize: '10px',
                          fontFamily: 'var(--font-mono)',
                          color: isComplete ? node.color : '#6B6B6B',
                          letterSpacing: '0.1em',
                          fontWeight: 600,
                        }}
                      >
                        {node.label.toUpperCase()}
                      </div>
                      {isComplete && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ background: node.color, fontSize: '8px' }}
                        >
                          ✓
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}

                {/* Central player node */}
                <div
                  className="absolute flex flex-col items-center justify-center rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 80,
                    height: 80,
                    background: 'rgba(110,231,255,0.08)',
                    border: '1px solid rgba(110,231,255,0.25)',
                  }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ border: '1px solid rgba(110,231,255,0.15)' }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#6EE7FF', letterSpacing: '0.1em' }}>
                    {player.name.slice(0, 3).toUpperCase()}
                  </div>
                  <div style={{ fontSize: '8px', color: '#6B6B6B', fontFamily: 'var(--font-mono)' }}>
                    YOU
                  </div>
                </div>
              </div>

              {/* Tooltip */}
              <AnimatePresence>
                {hoveredNode && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <div style={{ fontSize: '13px', color: '#E5E7EB', textAlign: 'center' }}>
                      {hubNodes.find(n => n.id === hoveredNode)?.description}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* All complete message → unlock GameHub */}
              {allComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-6 left-0 right-0 flex justify-center"
                >
                  <motion.button
                    onClick={() => setActiveNode('gamehub')}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    animate={{ boxShadow: ['0 0 0px #6EE7FF00', '0 0 20px #6EE7FF30', '0 0 0px #6EE7FF00'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="px-5 py-3 rounded-xl text-sm text-center"
                    style={{
                      background: 'rgba(110,231,255,0.1)',
                      border: '1px solid rgba(110,231,255,0.3)',
                      color: '#6EE7FF',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      letterSpacing: '0.1em',
                      fontWeight: 600,
                    }}
                  >
                    ALL NODES EXPLORED ✦ ENTER GAME VAULT →
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Node screens */}
          {activeNode !== 'hub' && (
            <motion.div
              key={activeNode}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 p-6 md:p-10 overflow-auto"
            >
              {activeNode === 'memory' && (
                <MemoryGame
                  onComplete={() => handleNodeComplete('memory')}
                  onBack={() => setActiveNode('hub')}
                  playerName={player.name}
                  alreadyCompleted={player.progress.completedGames.includes('memory')}
                />
              )}
              {activeNode === 'skills' && (
                <SkillsNode
                  onComplete={() => handleNodeComplete('skills')}
                  onBack={() => setActiveNode('hub')}
                  alreadyCompleted={player.progress.completedGames.includes('skills')}
                />
              )}
              {activeNode === 'thoughts' && (
                <ThoughtsNode
                  onComplete={() => handleNodeComplete('thoughts')}
                  onBack={() => setActiveNode('hub')}
                  alreadyCompleted={player.progress.completedGames.includes('thoughts')}
                  playerName={player.name}
                />
              )}
              {activeNode === 'future' && (
                <FutureNode
                  onComplete={() => handleNodeComplete('future')}
                  onBack={() => setActiveNode('hub')}
                  alreadyCompleted={player.progress.completedGames.includes('future')}
                  playerName={player.name}
                />
              )}
              {activeNode === 'gamehub' && (
                <GameHub
                  onBack={() => setActiveNode('hub')}
                  gameScores={player.gameScores ?? {}}
                  onUpdateScore={handleUpdateScore}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Exit confirm */}
      <AnimatePresence>
        {showExitConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              onClick={() => setShowExitConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="fixed z-[61] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] p-6 rounded-[20px]"
              style={{ background: '#0E0E0E', border: '1px solid rgba(110,231,255,0.15)' }}
            >
              <h3 style={{ fontWeight: 600, fontSize: '16px', color: '#E5E7EB', marginBottom: '8px' }}>
                Leave Adventure Mode?
              </h3>
              <p style={{ fontSize: '13px', color: '#6B6B6B', marginBottom: '20px', lineHeight: 1.5 }}>
                Your progress is saved. You can return anytime by finding the hidden pixel again.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#6B6B6B',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                  }}
                >
                  STAY
                </button>
                <button
                  onClick={handleExit}
                  className="flex-1 py-2.5 rounded-xl text-sm"
                  style={{
                    background: 'rgba(110,231,255,0.1)',
                    border: '1px solid rgba(110,231,255,0.25)',
                    color: '#6EE7FF',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  EXIT →
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
