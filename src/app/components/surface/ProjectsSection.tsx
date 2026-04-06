import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { projects, Project } from '../../data/portfolio';

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
}

function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const longHoverRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = () => {
    setHovered(true);
    longHoverRef.current = setTimeout(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 150);
    }, 2500);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (longHoverRef.current) clearTimeout(longHoverRef.current);
  };

  const isLarge = index === 0 || index === 3;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative group cursor-pointer ${isLarge ? 'col-span-1 md:col-span-2' : 'col-span-1'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpen(project)}
    >
      <motion.div
        animate={{
          scale: hovered ? 1.02 : 1,
          y: hovered ? -4 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative overflow-hidden rounded-[20px] border border-[#EAEAEA] bg-white"
        style={{
          boxShadow: hovered
            ? `0 20px 60px rgba(0,0,0,0.08), 0 0 0 1px ${project.color}22, 0 0 40px ${project.color}15`
            : '0 2px 20px rgba(0,0,0,0.04)',
        }}
      >
        {/* Image container */}
        <div
          className="relative overflow-hidden"
          style={{ height: isLarge ? 340 : 220 }}
        >
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            animate={{
              scale: hovered ? 1.05 : 1,
              filter: glitching
                ? 'hue-rotate(90deg) saturate(200%) brightness(1.3)'
                : hovered ? 'saturate(110%) brightness(1.02)' : 'saturate(100%)',
            }}
            transition={{ duration: glitching ? 0.05 : 0.6 }}
            loading="lazy"
          />

          {/* Overlay */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${project.color}10 0%, transparent 60%)`,
            }}
          />

          {/* Glow border */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 rounded-t-[20px]"
            style={{ boxShadow: `inset 0 0 30px ${project.color}20` }}
          />

          {/* Category tag */}
          <div
            className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs backdrop-blur-md"
            style={{
              background: 'rgba(255,255,255,0.85)',
              color: '#6B6B6B',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {project.category}
          </div>

          {/* Year */}
          <div
            className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs backdrop-blur-md"
            style={{
              background: 'rgba(255,255,255,0.85)',
              color: '#6B6B6B',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {project.year}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3
                className="text-[20px] text-[#0A0A0A] mb-1 leading-tight"
                style={{ fontWeight: 600 }}
              >
                {project.title}
              </h3>
              <p className="text-sm text-[#6B6B6B] leading-snug">{project.tagline}</p>
            </div>
            <motion.div
              animate={{
                x: hovered ? 0 : -4,
                opacity: hovered ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="shrink-0 w-8 h-8 rounded-full border border-[#EAEAEA] flex items-center justify-center text-[#0A0A0A]"
            >
              →
            </motion.div>
          </div>
        </div>

        {/* Glitch overlay */}
        {glitching && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `${project.color}08`,
              mixBlendMode: 'screen',
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

interface ProjectsSectionProps {
  onOpenProject: (project: Project) => void;
}

export function ProjectsSection({ onOpenProject }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [titleInView, setTitleInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTitleInView(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="work"
      className="px-6 md:px-12 lg:px-20 max-w-[1200px] mx-auto py-24 md:py-32"
    >
      <div ref={sectionRef} className="mb-16">
        <motion.span
          initial={{ opacity: 0 }}
          animate={titleInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-sm text-[#6B6B6B] tracking-[0.15em] uppercase mb-4 block"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          Selected Work
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[clamp(28px,4vw,48px)] text-[#0A0A0A] leading-[1.15]"
          style={{ fontWeight: 600 }}
        >
          Projects that mattered.
        </motion.h2>
      </div>

      {/* Asymmetric grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Row 1: Large (col-span-2) + Small */}
        <div className="md:col-span-2">
          <ProjectCard project={projects[0]} index={0} onOpen={onOpenProject} />
        </div>
        <div className="md:col-span-1">
          <ProjectCard project={projects[1]} index={1} onOpen={onOpenProject} />
        </div>

        {/* Row 2: Small + Small + Large */}
        <div className="md:col-span-1">
          <ProjectCard project={projects[2]} index={2} onOpen={onOpenProject} />
        </div>
        <div className="md:col-span-2">
          <ProjectCard project={projects[3]} index={3} onOpen={onOpenProject} />
        </div>

        {/* Row 3: Full width */}
        <div className="md:col-span-3">
          <ProjectCard project={projects[4]} index={4} onOpen={onOpenProject} />
        </div>
      </div>
    </section>
  );
}
