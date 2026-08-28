'use client';

import { useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, Clock, Calendar } from 'lucide-react';
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
  Live: { color: 'text-tk-accent', bg: 'bg-tk-accent/10 border-tk-border-accent', dot: 'bg-tk-accent', label: 'CURRENT / NEXT' },
  Upcoming: { color: 'text-tk-text-muted', bg: 'bg-white/5 border-tk-border', dot: 'bg-tk-text-muted', label: 'UPCOMING' },
};

function MilestoneNode({ milestone, index }: { milestone: Milestone; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const cfg = STATUS_CONFIG[milestone.status] || STATUS_CONFIG.Upcoming;
  const isCompleted = milestone.status === 'Completed';
  const isCurrent = milestone.status === 'Live';

  return (
    <div
      ref={ref}
      className={`relative flex flex-col md:flex-row items-start gap-0 transition-opacity duration-300 ${
        isCompleted ? 'opacity-40' : 'opacity-100'
      }`}
    >
      {/* Vertical spine */}
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
          className={`relative w-5 h-5 rounded-full border-2 z-10 mt-1 flex items-center justify-center flex-shrink-0 ${
            isCompleted
              ? 'border-green-400 bg-green-400'
              : isCurrent
              ? 'border-[#FF6B00] bg-[#FF6B00] shadow-[0_0_15px_rgba(255,107,0,0.8)]'
              : 'border-[#8A8A8A]/50 bg-[#8A8A8A] opacity-60'
          }`}
        >
          {isCompleted && <Check size={12} className="text-[#0A0A0F]" strokeWidth={3} />}

          {isCurrent && (
            <span
              className="absolute -inset-1 rounded-full bg-[#FF6B00]/50 animate-ping pointer-events-none"
              style={{ animationDuration: '2s' }}
            />
          )}
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.3, ease: 'easeOut', delay: 0.25 }}
        className={`flex-1 pb-16 border-l-2 pl-8 -ml-2.5 md:border-l-0 md:pl-0 md:ml-0 ${
          isCompleted
            ? 'border-green-400/20'
            : isCurrent
            ? 'border-[#FF6B00]/40'
            : 'border-white/5'
        } md:border-none`}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#8A8A8A]">{milestone.date}</span>
          <span className={`text-[9px] font-black tracking-[0.2em] uppercase px-2 py-0.5 border ${cfg.bg} ${cfg.color}`}>
            {cfg.label}
          </span>
        </div>
        <h3
          className={`text-xl sm:text-2xl font-black tracking-tight font-headline mb-2 ${
            isCurrent ? 'text-[#FF6B00]' : isCompleted ? 'text-[#F1F1F1]/70' : 'text-[#F1F1F1]'
          }`}
        >
          {milestone.title}
        </h3>
        <p className="text-sm text-[#8A8A8A] leading-relaxed max-w-sm">{milestone.description}</p>
      </motion.div>
    </div>
  );
}

export default function TimelinePage() {
  const { data: rawMilestones, isLoading } = useFetch<Milestone[]>('/api/timeline');
  const milestones: Milestone[] = useMemo(() => {
    return [...(rawMilestones || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [rawMilestones]);

  // Next Milestone calculation for sticky mini-badge
  const nextMilestoneInfo = useMemo(() => {
    if (!milestones.length) return null;
    const next = milestones.find(m => m.status === 'Live' || m.status === 'Upcoming');
    if (!next) return null;

    const targetTime = new Date(next.date).getTime();
    if (isNaN(targetTime)) {
      return { title: next.title, text: 'Next milestone approaching' };
    }

    const diffMs = targetTime - Date.now();
    if (diffMs <= 0) return null; // already passed

    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const timeStr = days === 1 ? '1 day' : `${days} days`;
    return { title: next.title, text: `Next: ${next.title} in ${timeStr}` };
  }, [milestones]);

  return (
    <div className="min-h-screen bg-tk-bg text-tk-text">
      {/* Header */}
      <section className="pt-20 pb-16 px-4 sm:px-6 relative overflow-hidden" style={{ borderBottom: '1px solid var(--tk-border)' }}>
        <div
          className="absolute top-0 left-0 w-[600px] h-[300px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top left, rgba(255,122,47,0.10) 0%, transparent 65%)' }}
        />
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
              <span className="text-[#FF6B00]">2027</span>
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

      {/* Sticky Top Mini-Badge */}
      {nextMilestoneInfo && (
        <div className="sticky top-16 z-30 py-3 px-4 bg-[#0A0A0F]/90 backdrop-blur-md border-b border-[#FF6B00]/20 flex justify-center shadow-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-[#FF6B00] text-xs font-headline font-bold uppercase tracking-widest rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
            <span>{nextMilestoneInfo.text}</span>
          </div>
        </div>
      )}

      {/* Status Legend */}
      <div className="px-4 sm:px-6 py-4 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center gap-6 flex-wrap">
          {(Object.keys(STATUS_CONFIG) as MilestoneStatus[]).map(s => {
            const cfg = STATUS_CONFIG[s];
            return (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
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
                  <div className="w-5 h-5 rounded-full bg-white/10 flex-shrink-0 mt-1" />
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
