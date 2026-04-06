import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../../data/portfolio';

interface CaseStudyPanelProps {
  project: Project | null;
  onClose: () => void;
}

export function CaseStudyPanel({ project, onClose }: CaseStudyPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
      scrollRef.current?.scrollTo({ top: 0 });
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [project]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.94, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-4 md:inset-8 z-50 bg-white rounded-[24px] overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Scrollable content */}
            <div ref={scrollRef} className="overflow-y-auto flex-1">
              {/* Hero image */}
              <div className="relative h-[280px] md:h-[420px] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.95) 100%)`
                  }}
                />
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-[#0A0A0A] hover:bg-white transition-colors shadow-sm"
                  aria-label="Close"
                >
                  ✕
                </button>

                {/* Category + year */}
                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                  <span
                    className="px-3 py-1 rounded-full text-xs bg-white/90 text-[#6B6B6B] backdrop-blur-sm"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {project.category}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-xs bg-white/90 text-[#6B6B6B] backdrop-blur-sm"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {project.year}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 md:px-12 lg:px-20 pb-16 max-w-[800px] mx-auto">
                {/* Title */}
                <div className="mb-12 pt-2">
                  <h1
                    className="text-[clamp(32px,5vw,56px)] text-[#0A0A0A] leading-tight mb-3"
                    style={{ fontWeight: 700 }}
                  >
                    {project.title}
                  </h1>
                  <p className="text-xl text-[#6B6B6B]" style={{ fontWeight: 400 }}>
                    {project.tagline}
                  </p>
                </div>

                {/* Section: Problem */}
                <CaseStudySection label="Problem" color={project.color}>
                  <p className="text-base text-[#0A0A0A] leading-relaxed">{project.problem}</p>
                </CaseStudySection>

                {/* Section: Approach */}
                <CaseStudySection label="Approach" color={project.color}>
                  <p className="text-base text-[#0A0A0A] leading-relaxed">{project.approach}</p>
                </CaseStudySection>

                {/* Section: Key Decisions */}
                <CaseStudySection label="Key Decisions" color={project.color}>
                  <ul className="space-y-4">
                    {project.decisions.map((d, i) => (
                      <li key={i} className="flex gap-4">
                        <span
                          className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] mt-0.5"
                          style={{ background: `${project.color}20`, color: project.color, fontFamily: 'var(--font-mono)' }}
                        >
                          {i + 1}
                        </span>
                        <p className="text-base text-[#0A0A0A] leading-relaxed">{d}</p>
                      </li>
                    ))}
                  </ul>
                </CaseStudySection>

                {/* Section: Outcome */}
                <CaseStudySection label="Outcome" color={project.color}>
                  <p
                    className="text-lg text-[#0A0A0A] leading-relaxed"
                    style={{ fontWeight: 500 }}
                  >
                    {project.outcome}
                  </p>
                </CaseStudySection>

                {/* Links */}
                <div className="flex gap-3 pt-4">
                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      className="px-6 py-3 rounded-xl text-sm text-white transition-opacity hover:opacity-90"
                      style={{ background: project.color === '#6EE7FF' ? '#0A0A0A' : project.color, fontWeight: 500 }}
                    >
                      View Demo →
                    </a>
                  )}
                  {project.links.code && (
                    <a
                      href={project.links.code}
                      className="px-6 py-3 rounded-xl text-sm border border-[#EAEAEA] text-[#0A0A0A] hover:bg-[#F5F5F5] transition-colors"
                      style={{ fontWeight: 500 }}
                    >
                      Source Code ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface CaseStudySectionProps {
  label: string;
  color: string;
  children: React.ReactNode;
}

function CaseStudySection({ label, color, children }: CaseStudySectionProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-5 rounded-full" style={{ background: color }} />
        <span
          className="text-xs text-[#6B6B6B] tracking-[0.15em] uppercase"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}
