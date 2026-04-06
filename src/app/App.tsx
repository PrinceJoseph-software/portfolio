import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { Navigation } from './components/surface/Navigation';
import { HeroSection } from './components/surface/HeroSection';
import { ProjectsSection } from './components/surface/ProjectsSection';
import { AboutSection } from './components/surface/AboutSection';
import { ContactSection } from './components/surface/ContactSection';
import { CaseStudyPanel } from './components/surface/CaseStudyPanel';
import { GlitchTransition } from './components/adventure/GlitchTransition';
import { PlayerSetup } from './components/adventure/PlayerSetup';
import { HubWorld } from './components/adventure/HubWorld';
import { Project } from './data/portfolio';

type AppMode = 'surface' | 'glitch-in' | 'adventure' | 'glitch-out';
type AdventureScreen = 'setup' | 'hub';

interface Player {
  name: string;
  progress: {
    unlockedNodes: string[];
    completedGames: string[];
  };
  gameScores: Record<string, number>;
  _v: number; // schema version
  _c?: number; // basic checksum
}

const STORAGE_KEY = 'portfolio_adventure_player';

// Basic checksum: sum of char codes in name
function computeChecksum(name: string): number {
  return name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

function loadPlayer(): Player | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Validate structure (non-sensitive data only)
    if (
      typeof parsed.name !== 'string' ||
      parsed.name.length > 30 ||
      parsed.name.length < 1 ||
      !Array.isArray(parsed.progress?.unlockedNodes) ||
      !Array.isArray(parsed.progress?.completedGames)
    ) {
      return null;
    }
    // Basic tamper check
    if (parsed._c !== undefined && parsed._c !== computeChecksum(parsed.name)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return {
      name: parsed.name,
      progress: {
        unlockedNodes: parsed.progress.unlockedNodes.filter((n: unknown) => typeof n === 'string'),
        completedGames: parsed.progress.completedGames.filter((n: unknown) => typeof n === 'string'),
      },
      gameScores: typeof parsed.gameScores === 'object' && parsed.gameScores !== null
        ? parsed.gameScores
        : {},
      _v: 2,
      _c: computeChecksum(parsed.name),
    };
  } catch {
    return null;
  }
}

function savePlayer(player: Player) {
  try {
    // Only store non-sensitive progress data
    const safe: Player = {
      name: player.name.slice(0, 30),
      progress: {
        unlockedNodes: player.progress.unlockedNodes.filter(n => typeof n === 'string'),
        completedGames: player.progress.completedGames.filter(n => typeof n === 'string'),
      },
      gameScores: player.gameScores ?? {},
      _v: 2,
      _c: computeChecksum(player.name),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
  } catch {
    // Silent fail — storage errors shouldn't break experience
  }
}

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>('surface');
  const [adventureScreen, setAdventureScreen] = useState<AdventureScreen>('setup');
  const [activeCaseStudy, setActiveCaseStudy] = useState<Project | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [secretTriggerReady, setSecretTriggerReady] = useState(false);

  // Load saved player on mount
  useEffect(() => {
    const saved = loadPlayer();
    if (saved) setPlayer(saved);
  }, []);

  // Scroll to section
  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Secret pixel handler — validates trigger state before entry
  const handleSecretPixelClick = useCallback(() => {
    // State validation: must be in surface mode (prevent direct bypass)
    if (appMode !== 'surface') return;

    // Mark trigger as ready
    setSecretTriggerReady(true);
    setAppMode('glitch-in');
  }, [appMode]);

  // Glitch transition complete
  const handleGlitchComplete = useCallback(() => {
    if (!secretTriggerReady) {
      // Reject if trigger wasn't properly validated
      setAppMode('surface');
      setSecretTriggerReady(false);
      return;
    }

    const existingPlayer = loadPlayer();
    if (existingPlayer) {
      setPlayer(existingPlayer);
      setAdventureScreen('hub');
    } else {
      setAdventureScreen('setup');
    }
    setAppMode('adventure');
  }, [secretTriggerReady]);

  // Player setup complete
  const handlePlayerSetupComplete = useCallback((name: string) => {
    const newPlayer: Player = {
      name,
      progress: { unlockedNodes: [], completedGames: [] },
      gameScores: {},
      _v: 2,
    };
    setPlayer(newPlayer);
    savePlayer(newPlayer);
    setAdventureScreen('hub');
  }, []);

  // Update player progress
  const handleUpdatePlayer = useCallback((updatedPlayer: Player) => {
    setPlayer(updatedPlayer);
    savePlayer(updatedPlayer);
  }, []);

  // Exit adventure mode
  const handleExitAdventure = useCallback(() => {
    setAppMode('glitch-out');
    setTimeout(() => {
      setAppMode('surface');
      setSecretTriggerReady(false);
    }, 600);
  }, []);

  // Surface footer
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* ─── Surface Mode ─── */}
      <AnimatePresence>
        {(appMode === 'surface' || appMode === 'glitch-in') && (
          <motion.div
            key="surface"
            initial={{ opacity: 1 }}
            animate={{ opacity: appMode === 'glitch-in' ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-white"
          >
            <Navigation onSectionClick={scrollToSection} />
            <HeroSection onSecretPixelClick={handleSecretPixelClick} />
            <ProjectsSection onOpenProject={setActiveCaseStudy} />
            <AboutSection />
            <ContactSection />
            <Footer year={currentYear} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Case Study Panel ─── */}
      <CaseStudyPanel
        project={activeCaseStudy}
        onClose={() => setActiveCaseStudy(null)}
      />

      {/* ─── Glitch Transition ─── */}
      <GlitchTransition
        active={appMode === 'glitch-in'}
        onComplete={handleGlitchComplete}
      />

      {/* ─── Glitch Out (exit adventure) ─── */}
      <AnimatePresence>
        {appMode === 'glitch-out' && (
          <motion.div
            key="glitch-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white"
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* ─── Adventure Mode ─── */}
      <AnimatePresence>
        {appMode === 'adventure' && (
          <>
            {adventureScreen === 'setup' && (
              <PlayerSetup
                key="setup"
                onComplete={handlePlayerSetupComplete}
                existingName={player?.name}
              />
            )}
            {adventureScreen === 'hub' && player && (
              <HubWorld
                key="hub"
                player={player}
                onUpdatePlayer={handleUpdatePlayer}
                onExit={handleExitAdventure}
              />
            )}
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function Footer({ year }: { year: number }) {
  return (
    <footer
      className="px-6 md:px-12 lg:px-20 max-w-[1200px] mx-auto py-12 border-t border-[#EAEAEA]"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p
            className="text-sm text-[#0A0A0A] mb-1"
            style={{ fontWeight: 600 }}
          >
            Nyobah-Joseph Prince
          </p>
          <p className="text-xs text-[#6B6B6B]">
            Design-Driven Full Stack Developer — Building things that actually work.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          <a
            href="https://github.com/PrinceJoseph-software"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/nyobah-joseph-prince-462716311"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="mailto:thataveragedev@gmail.com"
            className="text-xs text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors"
          >
            Email
          </a>
          <p
            className="text-xs text-[#6B6B6B]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            © {year}
          </p>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-[#EAEAEA] flex items-center gap-2">
        <div
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: '#6EE7FF' }}
        />
        <p
          className="text-[11px] text-[#BBBBBB]"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          There's more here than meets the eye.
        </p>
      </div>
    </footer>
  );
}
