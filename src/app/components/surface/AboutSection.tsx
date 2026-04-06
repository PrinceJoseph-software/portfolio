import { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const principles = [
    { number: '01', title: 'Design it first, then build it', body: 'Every project starts in Figma. Thinking through the interface before writing code prevents costly structural mistakes.' },
    { number: '02', title: 'Build it to last', body: 'Clean architecture and security-first thinking aren\'t premiums — they\'re the baseline. Shortcuts compound into problems.' },
    { number: '03', title: 'Cross-platform by instinct', body: 'Web and mobile are different mediums that teach each other. Working across both makes me a sharper designer and engineer.' },
    { number: '04', title: 'Ship it to learn', body: 'Real-world usage reveals what documentation can\'t. I push projects live early and iterate from actual feedback.' },
  ];

  return (
    <section
      id="about"
      className="px-6 md:px-12 lg:px-20 max-w-[1200px] mx-auto py-24 md:py-32 border-t border-[#EAEAEA]"
    >
      <div ref={sectionRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 mb-24">
          {/* Left: Identity */}
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="text-sm text-[#6B6B6B] tracking-[0.15em] uppercase mb-6 block"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              About
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-[clamp(24px,3.5vw,40px)] text-[#0A0A0A] leading-[1.2] mb-6"
              style={{ fontWeight: 600 }}
            >
              I work where design meets engineering meets security.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base text-[#6B6B6B] leading-relaxed mb-4"
            >
              I'm a versatile tech professional specializing in full-stack development, UI/UX design, and Android development. I combine technical expertise with user-centered thinking to build intuitive, high-performing digital experiences.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-base text-[#6B6B6B] leading-relaxed"
            >
              Trained at NIIT. Currently building across web (React, Supabase), mobile (Kotlin, Jetpack Compose), and actively expanding into cybersecurity — app security and ethical hacking.
            </motion.p>
          </div>

          {/* Right: Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 gap-6"
          >
            {[
              { value: '3+', label: 'Active years building' },
              { value: '5+', label: 'Projects shipped' },
              { value: '3', label: 'Domains mastered' },
              { value: '1', label: 'Clear mission' },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-6 rounded-[16px] border border-[#EAEAEA] bg-[#FAFAFA]"
              >
                <div
                  className="text-[36px] text-[#0A0A0A] leading-none mb-2"
                  style={{ fontWeight: 700 }}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-[#6B6B6B]">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Principles */}
        <div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm text-[#6B6B6B] tracking-[0.15em] uppercase mb-10 block"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Operating Principles
          </motion.span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {principles.map((p, i) => (
              <motion.div
                key={p.number}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                className="p-6 rounded-[16px] border border-[#EAEAEA] hover:border-[#D0D0D0] transition-colors"
              >
                <span
                  className="text-xs text-[#6B6B6B] block mb-3"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {p.number}
                </span>
                <h3
                  className="text-base text-[#0A0A0A] mb-2"
                  style={{ fontWeight: 600 }}
                >
                  {p.title}
                </h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
