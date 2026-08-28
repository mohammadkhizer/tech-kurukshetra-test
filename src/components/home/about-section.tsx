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
    <section id="about" className="py-24 sm:py-32 px-4 sm:px-6 border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,107,0,0.05)_0%,transparent_65%)] pointer-events-none" />
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Mission Left Overview */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={FADE_UP}
            className="lg:col-span-5 flex flex-col gap-4"
          >
            <div className="text-xs text-[#FF6B00] tracking-[0.3em] uppercase font-bold">◈ MISSION STATEMENT</div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter font-headline leading-[0.95]">
              THE BATTLEFIELD<br />
              <span className="text-[#8A8A8A] font-light italic text-3xl sm:text-4xl">AWAITS.</span>
            </h2>
            <p className="text-[#8A8A8A] text-sm sm:text-base leading-relaxed mt-4">
              TECH KURUKSHETRA is not just an ordinary festival — it is a high-intensity battleground.
              A two-day national technical crucible hosted at UCPIT, SVGU Ahmedabad, where India's sharpest
              engineers, coders, and makers collide to build, compete, and claim arena glory.
            </p>
            <div className="mt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs text-[#FF6B00] tracking-[0.2em] uppercase font-bold border-b border-[#FF6B00]/40 hover:border-[#FF6B00] pb-0.5 transition-colors"
              >
                READ THE LEGEND <ArrowRight size={12} />
              </Link>
            </div>
          </motion.div>

          {/* 3-Column Innovation / Collaboration / Competition Cards */}
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
                className="group flex flex-col justify-between border border-white/10 p-6 hover:border-[#FF6B00]/50 transition-colors duration-300 bg-white/[0.02] hover:bg-white/[0.03] hover:shadow-[0_0_20px_rgba(255,107,0,0.1)]"
              >
                <div>
                  <div className="p-3 bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-[#FF6B00] w-fit mb-5 group-hover:bg-[#FF6B00] group-hover:text-[#0A0A0F] transition-colors duration-200">
                    <Icon strokeWidth={1.5} size={24} />
                  </div>
                  <div className="text-base font-black uppercase tracking-[0.1em] font-headline mb-2 text-white group-hover:text-[#FF6B00] transition-colors">
                    {label}
                  </div>
                  <p className="text-xs text-[#8A8A8A] leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
