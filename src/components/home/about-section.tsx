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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,107,0,0.06)_0%,transparent_65%)] pointer-events-none" />
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={FADE_UP}
            className="lg:col-span-5 flex flex-col gap-4"
          >
            <div className="text-xs text-[#FF6B00] tracking-[0.3em] uppercase">◈ ABOUT</div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter font-headline leading-[0.95]">
              THE BATTLEFIELD<br />
              <span className="text-[#8A8A8A] font-light italic text-3xl">AWAITS.</span>
            </h2>
            <p className="text-[#8A8A8A] text-sm sm:text-base leading-relaxed mt-4">
              TECH KURUKSHETRA is not a festival — it's a war. A two-day immersive battlefield
              hosted at UCPIT, SVGU Ahmedabad, where India's sharpest technical minds collide
              to compete, build, and leave a mark. Only the bold survive.
            </p>
            <div className="mt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs text-[#FF6B00] tracking-[0.2em] uppercase border-b border-[#FF6B00]/40 hover:border-[#FF6B00] pb-0.5 transition-colors"
              >
                READ THE LEGEND <ArrowRight size={12} />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {[
              { icon: Lightbulb, label: 'Innovation', desc: 'Workshops and challenges that push technical boundaries.' },
              { icon: Users, label: 'Collaboration', desc: 'Network with 1,000+ engineers, designers, and mentors.' },
              { icon: Trophy, label: 'Competition', desc: 'High-stakes arenas. Real prizes. Real glory.' },
            ].map(({ icon: Icon, label, desc }) => (
              <motion.div
                key={label}
                variants={FADE_UP}
                className="group flex flex-col gap-4 border border-white/5 p-6 hover:border-[#FF6B00]/30 transition-colors duration-300 bg-white/[0.01]"
              >
                <Icon strokeWidth={1.5} size={28} className="text-[#FF6B00]" />
                <div className="text-sm font-black uppercase tracking-[0.1em] font-headline">{label}</div>
                <p className="text-xs text-[#8A8A8A] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
