import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { futureGoals } from '../../../data/portfolio';

interface FutureNodeProps {
  onBack: () => void;
  onComplete: () => void;
  alreadyCompleted: boolean;
  playerName: string;
}

export function FutureNode({ onBack, onComplete, alreadyCompleted, playerName }: FutureNodeProps) {
  const [revealed, setRevealed] = useState<string[]>(alreadyCompleted ? futureGoals.map(g => g.id) : []);
  const [activeGoal, setActiveGoal] = useState<string | null>(null);
  const [completed, setCompleted] = useState(alreadyCompleted);

  const handleReveal = (goalId: string) => {
    setActiveGoal(goalId);
    if (!revealed.includes(goalId)) {
      const newRevealed = [...revealed, goalId];
      setRevealed(newRevealed);

      if (newRevealed.length >= futureGoals.length && !completed) {
        setCompleted(true);
        if (!alreadyCompleted) setTimeout(onComplete, 800);
      }
    }
  };

  const statusConfig = {
    'in-progress': { label: 'IN PROGRESS', color: '#6EE7FF' },
    'planned': { label: 'PLANNED', color: '#A78BFA' },
    'started': { label: 'STARTED', color: '#34D399' },
  };

  const activeData = futureGoals.find(g => g.id === activeGoal);

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ color: '#E5E7EB' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <button
          onClick={activeGoal ? () => setActiveGoal(null) : onBack}
          className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
          style={{ color: '#6EE7FF', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
        >
          ← {activeGoal ? 'BACK' : 'BACK TO HUB'}
        </button>
        <div className="flex items-center gap-3">
          {completed && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#34D399' }}>
              ✓ COMPLETE
            </span>
          )}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#6B6B6B', letterSpacing: '0.15em' }}>
            FUTURE.NODE
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#6B6B6B' }}>
          GOALS REVEALED: <span style={{ color: '#F59E0B' }}>{revealed.length}/{futureGoals.length}</span>
        </span>
      </div>
      <div className="h-px mb-6 rounded-full overflow-hidden shrink-0" style={{ background: 'rgba(245,158,11,0.1)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #F59E0B, #6EE7FF)', width: `${(revealed.length / futureGoals.length) * 100}%` }}
          animate={{ width: `${(revealed.length / futureGoals.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <AnimatePresence mode="wait">
        {/* Goal list */}
        {!activeGoal && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-auto"
          >
            <div className="mb-6">
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
                The Horizon
              </h2>
              <p style={{ fontSize: '13px', color: '#6B6B6B', lineHeight: 1.6 }}>
                What I'm building toward. Click each goal to reveal it.
              </p>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div
                className="absolute left-[18px] top-6 bottom-6 w-px"
                style={{ background: 'rgba(245,158,11,0.15)' }}
              />

              <div className="space-y-3">
                {futureGoals.map((goal, i) => {
                  const isRevealed = revealed.includes(goal.id);
                  const status = statusConfig[goal.status as keyof typeof statusConfig];

                  return (
                    <motion.button
                      key={goal.id}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => handleReveal(goal.id)}
                      whileHover={{ x: 4 }}
                      className="w-full flex items-start gap-4 text-left"
                    >
                      {/* Timeline dot */}
                      <div className="relative shrink-0 mt-1">
                        <motion.div
                          className="w-9 h-9 rounded-full flex items-center justify-center"
                          style={{
                            background: isRevealed ? `${goal.color}18` : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${isRevealed ? goal.color + '40' : 'rgba(255,255,255,0.08)'}`,
                          }}
                          animate={isRevealed ? { boxShadow: `0 0 12px ${goal.color}20` } : {}}
                        >
                          {isRevealed ? (
                            <span style={{ fontSize: '14px' }}>
                              {i === 0 ? '🔨' : i === 1 ? '🎓' : i === 2 ? '🚀' : '✍️'}
                            </span>
                          ) : (
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ background: 'rgba(255,255,255,0.2)' }}
                            />
                          )}
                        </motion.div>
                      </div>

                      {/* Content */}
                      <div
                        className="flex-1 p-4 rounded-[14px]"
                        style={{
                          background: isRevealed ? `${goal.color}06` : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${isRevealed ? goal.color + '25' : 'rgba(255,255,255,0.06)'}`,
                        }}
                      >
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <span
                            style={{
                              fontSize: '11px',
                              fontFamily: 'var(--font-mono)',
                              color: '#6B6B6B',
                            }}
                          >
                            {goal.year}
                          </span>
                          {isRevealed && status && (
                            <span
                              style={{
                                fontSize: '10px',
                                fontFamily: 'var(--font-mono)',
                                color: status.color,
                                letterSpacing: '0.1em',
                              }}
                            >
                              {status.label}
                            </span>
                          )}
                        </div>

                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: '14px',
                            color: isRevealed ? '#E5E7EB' : '#6B6B6B',
                            marginBottom: '4px',
                            filter: isRevealed ? 'none' : 'blur(5px)',
                            userSelect: 'none',
                          }}
                        >
                          {goal.title}
                        </div>
                        {isRevealed && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <p style={{ fontSize: '12px', color: '#6B6B6B', lineHeight: 1.5 }}>
                              {goal.description.slice(0, 60)}...{' '}
                              <span
                                style={{ color: goal.color, cursor: 'pointer' }}
                                onClick={(e) => { e.stopPropagation(); handleReveal(goal.id); setActiveGoal(goal.id); }}
                              >
                                read more
                              </span>
                            </p>
                          </motion.div>
                        )}
                        {!isRevealed && (
                          <p style={{ fontSize: '11px', color: '#6B6B6B', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
                            LOCKED — click to reveal
                          </p>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Complete CTA */}
            {completed && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-5 rounded-[16px] text-center"
                style={{
                  background: 'rgba(245,158,11,0.06)',
                  border: '1px solid rgba(245,158,11,0.2)',
                }}
              >
                <div className="text-2xl mb-3">🔭</div>
                <p style={{ fontSize: '14px', color: '#E5E7EB', fontWeight: 600, marginBottom: '6px' }}>
                  Now you know where I'm headed.
                </p>
                <p style={{ fontSize: '12px', color: '#6B6B6B' }}>
                  The best is still being built.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Detail view */}
        {activeGoal && activeData && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="flex-1 overflow-auto flex flex-col"
          >
            <div
              className="p-6 rounded-[20px] flex-1"
              style={{
                background: `${activeData.color}06`,
                border: `1px solid ${activeData.color}20`,
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: `${activeData.color}18` }}
                >
                  {futureGoals.indexOf(activeData) === 0 ? '🔨'
                    : futureGoals.indexOf(activeData) === 1 ? '🎓'
                    : futureGoals.indexOf(activeData) === 2 ? '🚀' : '✍️'}
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#6B6B6B' }}>
                    {activeData.year}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '18px', color: '#E5E7EB' }}>
                    {activeData.title}
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '15px', color: '#E5E7EB', lineHeight: 1.8, marginBottom: '20px' }}>
                {activeData.description}
              </p>

              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  background: `${activeData.color}12`,
                  border: `1px solid ${activeData.color}30`,
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: activeData.color,
                  letterSpacing: '0.1em',
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: activeData.color }}
                />
                {statusConfig[activeData.status as keyof typeof statusConfig]?.label}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
