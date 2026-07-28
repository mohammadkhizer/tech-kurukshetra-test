'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useFetch } from '@/hooks/use-fetch';

const EASE_OUT = { duration: 0.3, ease: 'easeOut' };

type MilestoneStatus = 'Completed' | 'Live' | 'Upcoming';

interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  order?: number;
}

const STATUS_CONFIG: Record<MilestoneStatus, { color: string; bg: string; dot: string; label: string }> = {
  Completed: { color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/30', dot: 'bg-green-400', label: 'COMPLETED' },
  Live:      { color: 'text-[#FF6B00]', bg: 'bg-[#FF6B00]/10 border-[#FF6B00]/30', dot: 'bg-[#FF6B00] animate-pulse', label: 'LIVE NOW' },
  Upcoming:  { color: 'text-[#8A8A8A]', bg: 'bg-white/5 border-white/10', dot: 'bg-[#8A8A8A]', label: 'UPCOMING' },
};

// Fallback data when Firestore is empty
const FALLBACK_MILESTONES: Milestone[] = [
  { id: '1', date: 'AUG 2026', title: 'Registrations Open', description: 'Team and individual registrations go live. Early bird slots limited.', status: 'Completed', order: 1 },
  { id: '2', date: 'OCT 2026', title: 'Abstract Submission', description: 'Submit your project abstract or team declaration for all arenas.', status: 'Completed', order: 2 },
  { id: '3', date: 'NOV 2026', title: 'Shortlisting', description: 'Teams shortlisted based on abstracts. Final confirmations sent via email.', status: 'Live', order: 3 },
  { id: '4', date: 'DEC 2026', title: 'Mentorship Sessions', description: 'Live Q&A sessions with domain experts to prep your team for battle.', status: 'Upcoming', order: 4 },
  { id: '5', date: 'JAN 14, 2027', title: 'Day 1 — Battle Begins', description: 'Opening ceremony, arena briefings, and first-round competitions kick off.', status: 'Upcoming', order: 5 },
  { id: '6', date: 'JAN 15, 2027', title: 'Day 2 — Finals & Awards', description: 'Grand finals, prize distribution, and closing ceremony.', status: 'Upcoming', order: 6 },
];

function MilestoneNode({ milestone, index }: { milestone: Milestone; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const cfg = STATUS_CONFIG[milestone.status] || STATUS_CONFIG.Upcoming;

  return (
    <div ref={ref} className="relative flex flex-col md:flex-row items-start gap-0">
      {/* Vertical spine (mobile) / Horizontal connector (desktop via parent) */}
      <div className="relative flex flex-col items-center mr-6 md:mr-0">
        {/* Connector line above node */}
        {index > 0 && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className="md:hidden w-px h-10 bg-gradient-to-b from-[#FF6B00]/40 to-[#FF6B00]/10 origin-top absolute -top-10"
          />
        )}
        {/* Node dot */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.2 }}
          className={`relative w-4 h-4 rounded-full border-2 z-10 mt-1 flex-shrink-0 ${
            milestone.status === 'Live'
              ? 'border-[#FF6B00] bg-[#FF6B00] shadow-[0_0_12px_rgba(255,107,0,0.8)]'
              : milestone.status === 'Completed'
              ? 'border-green-400 bg-green-400'
              : 'border-[#8A8A8A]/50 bg-[#0A0A0F]'
          }`}
        >
          {milestone.status === 'Live' && (
            <span className="absolute inset-0 rounded-full bg-[#FF6B00] animate-ping opacity-40" />
          )}
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.3, ease: 'easeOut', delay: 0.25 }}
        className={`flex-1 pb-16 border-l-2 pl-8 -ml-2 md:border-l-0 md:pl-0 md:ml-0 ${
          milestone.status === 'Completed' ? 'border-green-400/20' :
          milestone.status === 'Live'      ? 'border-[#FF6B00]/30' :
                                             'border-white/5'
        } md:border-none`}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#8A8A8A]">{milestone.date}</span>
          <span className={`text-[9px] font-black tracking-[0.2em] uppercase px-2 py-0.5 border ${cfg.bg} ${cfg.color}`}>
            {cfg.label}
          </span>
        </div>
        <h3 className={`text-xl sm:text-2xl font-black tracking-tight font-headline mb-2 ${
          milestone.status === 'Live' ? 'text-[#FF6B00]' :
          milestone.status === 'Completed' ? 'text-[#F1F1F1]' :
          'text-[#F1F1F1]/60'
        }`}>
          {milestone.title}
        </h3>
        <p className="text-sm text-[#8A8A8A] leading-relaxed max-w-sm">{milestone.description}</p>
      </motion.div>
    </div>
  );
}

export default function TimelinePage() {
  const { data: rawMilestones, isLoading, error } = useFetch<Milestone[]>('/api/timeline');

  // Fall back to static data when DB is empty or fails
  const milestones: Milestone[] = (!isLoading && (error || !rawMilestones || rawMilestones.length === 0))
    ? FALLBACK_MILESTONES
    : ([...(rawMilestones || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F1F1F1]">
      {/* Header */}
      <section className="pt-20 pb-16 px-4 sm:px-6 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,107,0,0.04),transparent_60%)] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="flex flex-col gap-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...EASE_OUT, delay: 0.1 }}
              className="text-xs text-[#FF6B00] tracking-[0.3em] uppercase"
            >
              ◈ BATTLE ROADMAP
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...EASE_OUT, delay: 0.2 }}
              className="text-5xl sm:text-7xl font-black tracking-tighter font-headline leading-[0.9]"
            >
              TIMELINE<br />
              <span className="text-[#FF6B00]">2026–27</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...EASE_OUT, delay: 0.3 }}
              className="text-[#8A8A8A] text-base max-w-xl"
            >
              Every major milestone from registration to the grand finale — track where we are in the battle plan.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Status Legend */}
      <div className="px-4 sm:px-6 py-4 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center gap-6 flex-wrap">
          {(Object.keys(STATUS_CONFIG) as MilestoneStatus[]).map(s => {
            const cfg = STATUS_CONFIG[s];
            return (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                <span className={`text-[10px] tracking-[0.2em] uppercase font-bold ${cfg.color}`}>{cfg.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="space-y-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-6 animate-pulse">
                  <div className="w-4 h-4 rounded-full bg-white/10 flex-shrink-0 mt-1" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-white/5 w-24" />
                    <div className="h-6 bg-white/10 w-48" />
                    <div className="h-3 bg-white/5 w-full max-w-xs" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
              {milestones.map((m, i) => (
                <MilestoneNode key={m.id} milestone={m} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
