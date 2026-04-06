import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface NavigationProps {
  onSectionClick: (section: string) => void;
}

export function Navigation({ onSectionClick }: NavigationProps) {
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Work', id: 'work' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed top-6 right-6 z-50"
        >
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-white/80 backdrop-blur-xl border border-[#EAEAEA] rounded-2xl px-3 py-2 shadow-sm">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionClick(item.id)}
                className="px-4 py-1.5 text-sm text-[#6B6B6B] hover:text-[#0A0A0A] rounded-xl transition-colors duration-200 hover:bg-[#F5F5F5]"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 bg-white/80 backdrop-blur-xl border border-[#EAEAEA] rounded-xl shadow-sm flex items-center justify-center"
            >
              <div className="flex flex-col gap-1">
                <motion.div
                  animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 5 : 0 }}
                  className="w-4 h-px bg-[#0A0A0A] origin-center"
                />
                <motion.div
                  animate={{ opacity: menuOpen ? 0 : 1 }}
                  className="w-4 h-px bg-[#0A0A0A]"
                />
                <motion.div
                  animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -5 : 0 }}
                  className="w-4 h-px bg-[#0A0A0A] origin-center"
                />
              </div>
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  className="absolute top-12 right-0 bg-white/95 backdrop-blur-xl border border-[#EAEAEA] rounded-2xl shadow-lg overflow-hidden min-w-[140px]"
                >
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { onSectionClick(item.id); setMenuOpen(false); }}
                      className="w-full px-5 py-3 text-sm text-[#6B6B6B] hover:text-[#0A0A0A] hover:bg-[#F5F5F5] text-left transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
