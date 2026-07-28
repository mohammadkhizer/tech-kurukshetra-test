'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const EASE_OUT = { duration: 0.3, ease: 'easeOut' };

interface Section {
  id: string;
  title: string;
}

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: Section[];
  children: ReactNode;
}

export function LegalLayout({ title, subtitle, lastUpdated, sections, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F1F1F1]">
      {/* Header */}
      <section className="pt-20 pb-12 px-4 sm:px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={EASE_OUT}
            className="flex flex-col gap-3"
          >
            <div className="text-xs text-[#FF6B00] tracking-[0.3em] uppercase">◈ LEGAL</div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter font-headline leading-[0.9]">{title}</h1>
            <p className="text-[#8A8A8A] text-sm">{subtitle}</p>
            <div className="text-[10px] text-[#8A8A8A]/60 uppercase tracking-[0.2em] mt-1">Last updated: {lastUpdated}</div>
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Jump Nav (sidebar on desktop, horizontal on mobile) */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-20 flex flex-col gap-1">
              <div className="text-[9px] text-[#8A8A8A] uppercase tracking-[0.3em] mb-3 font-bold">ON THIS PAGE</div>
              <nav className="flex flex-row lg:flex-col gap-2 flex-wrap overflow-x-auto">
                {sections.map(s => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="text-xs text-[#8A8A8A] hover:text-[#FF6B00] transition-colors duration-200 tracking-wide whitespace-nowrap lg:whitespace-normal py-1 border-b border-transparent hover:border-[#FF6B00]/40 lg:border-b-0 lg:border-l-2 lg:border-l-transparent lg:hover:border-l-[#FF6B00] lg:pl-3"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <motion.main
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...EASE_OUT, delay: 0.15 }}
            className="lg:col-span-9 prose-legal"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  );
}
