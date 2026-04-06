import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { skillCategories } from '../../../data/portfolio';

interface SkillsNodeProps {
  onBack: () => void;
  onComplete: () => void;
  alreadyCompleted: boolean;
}

export function SkillsNode({ onBack, onComplete, alreadyCompleted }: SkillsNodeProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [unlockedSkills, setUnlockedSkills] = useState<string[]>([]);
  const [completed, setCompleted] = useState(alreadyCompleted);

  const totalSkills = skillCategories.reduce((sum, cat) => sum + cat.skills.length, 0);

  const handleSkillClick = (skillId: string) => {
    if (unlockedSkills.includes(skillId)) return;
    const newUnlocked = [...unlockedSkills, skillId];
    setUnlockedSkills(newUnlocked);

    if (newUnlocked.length >= totalSkills && !completed) {
      setTimeout(() => {
        setCompleted(true);
        if (!alreadyCompleted) onComplete();
      }, 600);
    }
  };

  const activeData = skillCategories.find(c => c.id === activeCategory);

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ color: '#E5E7EB' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <button
          onClick={activeCategory ? () => setActiveCategory(null) : onBack}
          className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
          style={{ color: '#6EE7FF', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
        >
          ← {activeCategory ? 'BACK' : 'BACK TO HUB'}
        </button>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#6B6B6B', letterSpacing: '0.15em' }}>
          SKILLS.NODE
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#6B6B6B' }}>
          SKILLS UNLOCKED: <span style={{ color: '#A78BFA' }}>{unlockedSkills.length}/{totalSkills}</span>
        </span>
        {completed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#34D399' }}
          >
            ✓ COMPLETE
          </motion.span>
        )}
      </div>
      <div className="h-px mb-6 rounded-full overflow-hidden shrink-0" style={{ background: 'rgba(167,139,250,0.1)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #A78BFA, #6EE7FF)' }}
          animate={{ width: `${(unlockedSkills.length / totalSkills) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <AnimatePresence mode="wait">
        {/* Category selector */}
        {!activeCategory && (
          <motion.div
            key="categories"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex-1 overflow-auto"
          >
            <div className="mb-6">
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Skill Matrix</h2>
              <p style={{ fontSize: '13px', color: '#6B6B6B', lineHeight: 1.6 }}>
                Select a domain to explore. Click individual skills to unlock them.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {skillCategories.map((cat, i) => {
                const catUnlocked = cat.skills.filter(s => unlockedSkills.includes(s.id)).length;
                const catProgress = (catUnlocked / cat.skills.length) * 100;

                return (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveCategory(cat.id)}
                    className="p-5 rounded-[16px] text-left relative overflow-hidden"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: `1px solid ${cat.color}30`,
                    }}
                  >
                    {/* Glow */}
                    <div
                      className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(circle at 30% 50%, ${cat.color}08 0%, transparent 70%)`,
                      }}
                    />

                    <div className="relative">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center mb-4 text-sm"
                        style={{ background: `${cat.color}18`, color: cat.color }}
                      >
                        {cat.id === 'design' ? '✦' : cat.id === 'frontend' ? '⟨⟩' : '⚙'}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px', color: '#E5E7EB' }}>
                        {cat.label}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6B6B6B', marginBottom: '12px' }}>
                        {cat.skills.length} skills
                      </div>

                      {/* Mini progress */}
                      <div className="h-0.5 rounded-full overflow-hidden" style={{ background: `${cat.color}15` }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: cat.color, width: `${catProgress}%` }}
                          animate={{ width: `${catProgress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div style={{ fontSize: '10px', color: '#6B6B6B', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                        {catUnlocked}/{cat.skills.length} unlocked
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Skill list */}
        {activeCategory && activeData && (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 overflow-auto"
          >
            <div className="mb-6">
              <h2
                style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px', color: activeData.color }}
              >
                {activeData.label}
              </h2>
              <p style={{ fontSize: '13px', color: '#6B6B6B' }}>
                Click a skill to reveal proficiency level.
              </p>
            </div>

            <div className="space-y-3">
              {activeData.skills.map((skill, i) => {
                const isUnlocked = unlockedSkills.includes(skill.id);
                return (
                  <motion.button
                    key={skill.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => handleSkillClick(skill.id)}
                    whileHover={!isUnlocked ? { scale: 1.01 } : {}}
                    className="w-full p-4 rounded-[12px] text-left relative overflow-hidden"
                    style={{
                      background: isUnlocked ? `${activeData.color}08` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isUnlocked ? `${activeData.color}35` : 'rgba(255,255,255,0.07)'}`,
                      cursor: isUnlocked ? 'default' : 'pointer',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '14px', color: isUnlocked ? '#E5E7EB' : '#6B6B6B' }}>
                          {skill.name}
                        </div>
                        {isUnlocked && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2"
                          >
                            {/* Bar */}
                            <div className="flex items-center gap-3">
                              <div
                                className="h-1.5 rounded-full overflow-hidden"
                                style={{ width: '140px', background: `${activeData.color}15` }}
                              >
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ background: activeData.color }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${skill.level}%` }}
                                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                                />
                              </div>
                              <span
                                style={{
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '11px',
                                  color: activeData.color,
                                }}
                              >
                                {skill.level}%
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {!isUnlocked && (
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#6B6B6B',
                            fontFamily: 'var(--font-mono)',
                            letterSpacing: '0.1em',
                          }}
                        >
                          LOCKED
                        </div>
                      )}
                      {isUnlocked && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{ color: activeData.color, fontSize: '16px' }}
                        >
                          ✓
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
