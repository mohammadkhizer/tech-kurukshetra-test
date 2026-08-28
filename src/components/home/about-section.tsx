'use client';

import Link from 'next/link';
import { ArrowRight, Lightbulb, Users, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const EASE_OUT = { duration: 0.3, ease: 'easeOut' };
const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: EASE_OUT },
};

export function AboutSection() {
  return (
    <section
      id="about"
      className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden bg-tk-bg-surface"
      style={{ borderTop: '1px solid var(--tk-border)' }}
    >
      {/* Single subtle orange radial — top-right corner only (one accent touch, not full bg) */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top right, rgba(255,122,47,0.10) 0%, transparent 65%)',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Mission Left */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={FADE_UP}
            className="lg:col-span-5 flex flex-col gap-4"
          >
            <div className="text-xs tracking-[0.3em] uppercase font-bold" style={{ color: 'var(--tk-accent)' }}>
              ◈ MISSION STATEMENT
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter font-headline leading-[0.95] text-tk-text">
              THE BATTLEFIELD<br />
              <span className="font-light italic text-3xl sm:text-4xl text-tk-text-muted">AWAITS.</span>
            </h2>
            <p className="text-tk-text-muted text-sm sm:text-base leading-relaxed mt-4">
              TECH KURUKSHETRA is not just an ordinary festival — it is a high-intensity battleground.
              A two-day national technical crucible hosted at UCPIT, SVGU Ahmedabad, where India's sharpest
              engineers, coders, and makers collide to build, compete, and claim arena glory.
            </p>
            <div className="mt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-bold pb-0.5 transition-colors"
                style={{
                  color: 'var(--tk-accent)',
                  borderBottom: '1px solid var(--tk-accent-border)',
                }}
              >
                READ THE LEGEND <ArrowRight size={12} />
              </Link>
            </div>
          </motion.div>

          {/* 3-Column Cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
          >
            {[
              {
                icon: Lightbulb,
                label: 'Innovation',
                desc: 'Hands-on hardware labs, AI challenges, and live coding tracks that push engineering limits.',
              },
              {
                icon: Users,
                label: 'Collaboration',
                desc: 'Forge elite teams with 1,000+ engineers, designers, and industry mentors nationwide.',
              },
              {
                icon: Trophy,
                label: 'Competition',
                desc: 'High-stakes battle arenas with custom LAN servers, real prize pools, and glory.',
              },
            ].map(({ icon: Icon, label, desc }) => (
              <motion.div
                key={label}
                variants={FADE_UP}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group flex flex-col justify-between p-6 transition-all duration-300"
                style={{
                  border: '1px solid var(--tk-border)',
                  background: 'var(--tk-bg)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--tk-border-accent)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 20px var(--tk-accent-glow)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--tk-border)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
              >
                <div>
                  <div
                    className="p-3 w-fit mb-5 transition-colors duration-200"
                    style={{
                      background: 'var(--tk-accent-subtle)',
                      border: '1px solid var(--tk-border-accent)',
                      color: 'var(--tk-accent)',
                    }}
                  >
                    <Icon strokeWidth={1.5} size={24} />
                  </div>
                  <div className="text-base font-black uppercase tracking-[0.1em] font-headline mb-2 text-tk-text">
                    {label}
                  </div>
                  <p className="text-xs text-tk-text-muted leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
