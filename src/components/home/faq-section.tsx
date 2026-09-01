'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQ_ITEMS } from '@/lib/seo';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section
      id="faq"
      className="py-20 sm:py-28 px-4 sm:px-6 bg-tk-bg relative overflow-hidden"
      style={{ borderTop: '1px solid var(--tk-border)' }}
    >
      <div className="max-w-4xl mx-auto w-full relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div
            className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase font-bold mb-3"
            style={{ color: 'var(--tk-accent)' }}
          >
            <HelpCircle size={14} />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-headline text-tk-text uppercase">
            EVERYTHING YOU NEED TO KNOW
          </h2>
          <p className="text-tk-text-muted text-sm sm:text-base mt-3 max-w-xl mx-auto">
            Direct answers regarding event dates, venue, registration, eligibility, and arena details for Tech Kurukshetra 2027.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map(({ question, answer }, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={question}
                className="border transition-colors duration-200"
                style={{
                  borderColor: isOpen ? 'var(--tk-border-accent)' : 'var(--tk-border)',
                  background: isOpen ? 'var(--tk-bg-surface)' : 'var(--tk-bg)',
                }}
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-headline text-sm sm:text-base font-bold text-tk-text uppercase tracking-wide cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3">
                    <span style={{ color: 'var(--tk-accent)' }} className="text-xs font-mono">
                      0{index + 1}.
                    </span>
                    {question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 text-tk-accent' : 'text-tk-text-muted'
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-tk-text-muted leading-relaxed font-light border-t border-tk-border/50 mt-1">
                        <p>{answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
