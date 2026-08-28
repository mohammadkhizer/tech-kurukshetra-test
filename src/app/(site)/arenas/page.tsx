'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { CircleHelp, ArrowRight, Trophy, Zap, ChevronDown, X, Users, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFetch } from '@/hooks/use-fetch';

const EASE_OUT = { duration: 0.3, ease: 'easeOut' };
const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: EASE_OUT },
};

const FILTER_TABS = ['All', 'Coding', 'Hardware', 'Gaming', 'Non-Technical'] as const;
type Filter = typeof FILTER_TABS[number];

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: 'text-[#FF6B00] border-[#FF6B00]/40 bg-[#FF6B00]/10',
  Intermediate: 'text-[#FF6B00] border-[#FF6B00]/40 bg-[#FF6B00]/10',
  Advanced: 'text-[#FF6B00] border-[#FF6B00]/40 bg-[#FF6B00]/10',
  Pro: 'text-[#FF6B00] border-[#FF6B00]/40 bg-[#FF6B00]/10',
  Expert: 'text-[#FF6B00] border-[#FF6B00]/40 bg-[#FF6B00]/10',
};

interface Arena {
  id: string;
  slug: string;
  name: string;
  hook?: string;
  description: string;
  iconName?: string;
  prize?: string;
  difficulty?: string;
  category?: string;
  isTechnical?: boolean;
  type?: string;
  rules?: string[];
  eligibility?: string;
  teamSize?: string;
  duration?: string;
  sponsorLogo?: string;
  sponsorName?: string;
}

function SkeletonCard() {
  return (
    <div className="border border-white/5 bg-white/[0.02] p-6 animate-pulse">
      <div className="w-10 h-10 bg-white/10 mb-4" />
      <div className="h-5 bg-white/10 w-3/4 mb-3" />
      <div className="h-3 bg-white/5 w-full mb-2" />
      <div className="h-3 bg-white/5 w-2/3 mb-6" />
      <div className="flex gap-2">
        <div className="h-5 w-16 bg-white/5" />
        <div className="h-5 w-20 bg-white/5" />
      </div>
    </div>
  );
}

function ArenaModal({ arena, onClose }: { arena: Arena; onClose: () => void }) {
  const Icon = (LucideIcons as any)[arena.iconName || ''] || CircleHelp;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[var(--tk-bg)]/90 backdrop-blur-md" />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={EASE_OUT}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto bg-tk-bg-surface"
        style={{ border: '1px solid var(--tk-border-accent)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8A8A8A] hover:text-[#F1F1F1] transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-[#FF6B00]/10 border border-[#FF6B00]/20">
            <Icon size={28} className="text-[#FF6B00]" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight font-headline text-[#F1F1F1]">{arena.name}</h2>
            {arena.type && (
              <span className="text-xs tracking-[0.2em] uppercase text-[#FF6B00]">{arena.type}</span>
            )}
          </div>
        </div>

        <p className="text-[#8A8A8A] text-sm leading-relaxed mb-6">{arena.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {arena.prize && (
            <div className="border border-white/5 p-3">
              <div className="text-[9px] text-[#8A8A8A] tracking-[0.2em] uppercase mb-1">Prize Pool</div>
              <div className="text-[#FF6B00] font-black text-lg font-headline">{arena.prize}</div>
            </div>
          )}
          {arena.teamSize && (
            <div className="border border-white/5 p-3">
              <div className="text-[9px] text-[#8A8A8A] tracking-[0.2em] uppercase mb-1">Team Size</div>
              <div className="text-[#F1F1F1] font-black text-lg font-headline">{arena.teamSize}</div>
            </div>
          )}
        </div>

        {arena.eligibility && (
          <div className="mb-6">
            <div className="text-[9px] text-[#8A8A8A] tracking-[0.2em] uppercase mb-3 border-b border-white/5 pb-2">Eligibility</div>
            <p className="text-sm text-[#F1F1F1]/80">{arena.eligibility}</p>
          </div>
        )}

        {arena.rules && arena.rules.length > 0 && (
          <div className="mb-6">
            <div className="text-[9px] text-[#8A8A8A] tracking-[0.2em] uppercase mb-3 border-b border-white/5 pb-2">Rules</div>
            <ul className="space-y-2">
              {arena.rules.map((r, i) => (
                <li key={i} className="text-sm text-[#F1F1F1]/80 flex items-start gap-2">
                  <span className="text-[#FF6B00] mt-0.5 flex-shrink-0">◈</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link
          href={`/arenas/${arena.slug}`}
          className="inline-flex items-center gap-2 border border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-[#0A0A0F] text-xs font-black uppercase tracking-[0.2em] px-6 py-3 transition-all duration-200 w-full justify-center"
        >
          FULL DETAILS <ArrowRight size={14} />
        </Link>
      </motion.div>
    </motion.div>
  );
}

function ArenaCard({ arena, onClick }: { arena: Arena; onClick: () => void }) {
  const Icon = (LucideIcons as any)[arena.iconName || ''] || CircleHelp;

  return (
    <motion.div
      variants={FADE_UP}
      whileHover={{ scale: 1.02, y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
      className="group relative p-6 cursor-pointer overflow-hidden flex flex-col justify-between transition-all duration-200 ease-out"
      style={{ border: '1px solid var(--tk-border)', background: 'var(--tk-bg-surface)' }}
      onClick={onClick}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'var(--tk-border-accent)';
        el.style.boxShadow = '0 0 28px var(--tk-accent-glow)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'var(--tk-border)';
        el.style.boxShadow = 'none';
      }}
    >
        {/* Hover glow managed via onMouseEnter above — no always-visible gradient */}

      <div>
        {/* Top Row: Icon + Top-Right Difficulty Badge */}
        <div className="flex items-start justify-between gap-2 mb-5">
          <div className="p-2.5 bg-[#FF6B00]/10 border border-[#FF6B00]/20">
            <Icon size={24} className="text-[#FF6B00]" strokeWidth={1.5} />
          </div>

          <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/10 text-[#FF6B00] px-2.5 py-0.5 text-[10px] font-headline font-bold tracking-widest uppercase rounded-sm">
            {arena.difficulty || 'Intermediate'}
          </div>
        </div>

        <h3 className="text-xl font-black tracking-tight font-headline text-[#F1F1F1] group-hover:text-[#FF6B00] transition-colors mb-1.5">
          {arena.name}
        </h3>

        {arena.hook && (
          <p className="text-[10px] text-[#FF6B00]/90 tracking-[0.15em] uppercase mb-3 font-semibold">{arena.hook}</p>
        )}

        <p className="text-xs text-[#8A8A8A] leading-relaxed line-clamp-2 mb-6">
          {arena.description}
        </p>
      </div>

      <div>
        {/* Footer Stats Row (Prize / Team Size / Duration) */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 mb-4">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1 text-[#8A8A8A] text-[9px] uppercase tracking-wider font-semibold">
              <Trophy size={11} className="text-[#FF6B00]" />
              <span>Prize</span>
            </div>
            <span className="text-xs font-headline font-bold text-[#F1F1F1] mt-0.5 truncate">{arena.prize || 'TBA'}</span>
          </div>

          <div className="flex flex-col items-start border-l border-white/5 pl-2">
            <div className="flex items-center gap-1 text-[#8A8A8A] text-[9px] uppercase tracking-wider font-semibold">
              <Users size={11} className="text-[#FF6B00]" />
              <span>Team</span>
            </div>
            <span className="text-xs font-headline font-bold text-[#F1F1F1] mt-0.5 truncate">{arena.teamSize || '1-4'}</span>
          </div>

          <div className="flex flex-col items-start border-l border-white/5 pl-2">
            <div className="flex items-center gap-1 text-[#8A8A8A] text-[9px] uppercase tracking-wider font-semibold">
              <Clock size={11} className="text-[#FF6B00]" />
              <span>Duration</span>
            </div>
            <span className="text-xs font-headline font-bold text-[#F1F1F1] mt-0.5 truncate">{arena.duration || '24h'}</span>
          </div>
        </div>

        {/* Optional Bottom-Left Co-Branded Sponsor Slot */}
        {(arena.sponsorName || arena.sponsorLogo) && (
          <div className="flex items-center gap-1.5 text-[9px] text-[#8A8A8A] tracking-wider uppercase mb-3">
            <span>Powered by</span>
            {arena.sponsorLogo ? (
              <img src={arena.sponsorLogo} alt={arena.sponsorName || 'Sponsor'} className="h-3.5 w-auto object-contain max-w-[80px]" />
            ) : (
              <span className="text-[#FF6B00] font-bold">{arena.sponsorName}</span>
            )}
          </div>
        )}

        <button className="flex items-center gap-1.5 text-[11px] font-headline font-bold tracking-[0.15em] uppercase text-[#FF6B00] group-hover:gap-3 transition-all duration-200">
          VIEW DETAILS <ArrowRight size={12} />
        </button>
      </div>
    </motion.div>
  );
}

// TODO: All event data is fetched from /api/events (MongoDB).
// No static fallback — if the API returns empty, show the empty state below.

export default function ArenasPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [selectedArena, setSelectedArena] = useState<Arena | null>(null);

  const { data: rawEvents, isLoading } = useFetch<Arena[]>('/api/events');
  const events: Arena[] = useMemo(() => (rawEvents && rawEvents.length > 0 ? rawEvents : []), [rawEvents]);

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return events;
    if (activeFilter === 'Non-Technical') return events.filter(e => !e.isTechnical);
    const map: Record<string, string[]> = {
      Coding: ['hackathon', 'coding', 'logic', 'quiz', 'technical'],
      Hardware: ['robotics', 'hardware', 'circuit'],
      Gaming: ['esports', 'gaming', 'game'],
    };
    const keywords = map[activeFilter] || [];
    return events.filter(e =>
      keywords.some(k =>
        e.name?.toLowerCase().includes(k) ||
        e.type?.toLowerCase().includes(k) ||
        e.category?.toLowerCase().includes(k)
      )
    );
  }, [events, activeFilter]);

  return (
    <div className="min-h-screen bg-tk-bg text-tk-text">
      {/* Page Header */}
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
            <motion.div variants={FADE_UP} className="text-xs text-[#FF6B00] tracking-[0.3em] uppercase">
              ◈ CHOOSE YOUR BATTLEFIELD
            </motion.div>
            <motion.h1 variants={FADE_UP} className="text-5xl sm:text-7xl font-black tracking-tighter font-headline leading-[0.9]">
              FESTIVAL<br />
              <span className="text-[#FF6B00]">ARENAS</span>
            </motion.h1>
            <motion.p variants={FADE_UP} className="text-[#8A8A8A] text-base max-w-xl">
              From deep technical dives to mind-bending logic challenges — pick your arena, read the rules, and enter the fight.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="sticky top-14 z-30 backdrop-blur-md" style={{ background: 'rgba(17,17,17,0.90)', borderBottom: '1px solid var(--tk-border)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex gap-0 overflow-x-auto no-scrollbar">
            {FILTER_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`relative px-5 py-4 text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-colors duration-200 border-b-2 ${
                  activeFilter === tab
                    ? 'text-[#FF6B00] border-[#FF6B00]'
                    : 'text-[#8A8A8A] hover:text-[#F1F1F1] border-transparent'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 text-[#8A8A8A]">
              <Zap size={32} className="mx-auto mb-4 text-[#FF6B00]/40" />
              <p className="text-sm uppercase tracking-[0.2em]">No arenas in this category yet</p>
            </div>
          ) : (
            <motion.div
              key={activeFilter}
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filtered.map((arena) => (
                <ArenaCard key={arena.id} arena={arena} onClick={() => setSelectedArena(arena)} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedArena && (
          <ArenaModal arena={selectedArena} onClose={() => setSelectedArena(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
