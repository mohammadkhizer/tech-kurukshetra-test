'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { CircleHelp, ArrowRight, Trophy, Zap, X, Users, Clock, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFetch } from '@/hooks/use-fetch';

const EASE_OUT = { duration: 0.3, ease: 'easeOut' };
const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: EASE_OUT },
};

const FILTER_TABS = ['All', 'TECH', 'NON-TECH', 'Solo', 'Team'] as const;
type Filter = typeof FILTER_TABS[number];

interface TeamSizeObj {
  min: number;
  max: number;
}

interface Arena {
  id: string;
  slug: string;
  name: string;
  hook?: string;
  description: string;
  iconName?: string;
  prize?: string;
  prizePool?: string;
  difficulty?: string;
  category?: 'TECH' | 'NON-TECH';
  isTechnical?: boolean;
  type?: 'solo' | 'team';
  rules?: string[];
  eligibility?: string;
  teamSize?: string | TeamSizeObj;
  duration?: string;
  sponsorLogo?: string;
  sponsorName?: string;
  entryFee?: number | string;
  venue?: string;
  time?: string;
  date?: string;
  coordinatorContact?: { name: string; phone: string; email: string };
}

function formatTeamSize(ts: any): string {
  if (!ts) return '1';
  if (typeof ts === 'object' && ts.min !== undefined && ts.max !== undefined) {
    return ts.min === ts.max ? `${ts.min}` : `${ts.min}-${ts.max}`;
  }
  return String(ts);
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
  const prizeDisplay = arena.prizePool || arena.prize || 'TBA';
  const teamSizeDisplay = formatTeamSize(arena.teamSize);

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
          className="absolute top-4 right-4 text-tk-text-muted hover:text-tk-text transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div
            className="p-3"
            style={{
              background: 'var(--tk-accent-subtle)',
              border: '1px solid var(--tk-border-accent)',
              color: 'var(--tk-accent)',
            }}
          >
            <Icon size={28} strokeWidth={1.5} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[9px] font-headline font-black tracking-widest uppercase px-2 py-0.5"
                style={{
                  background: arena.category === 'NON-TECH' ? 'rgba(255,255,255,0.06)' : 'var(--tk-accent-subtle)',
                  color: arena.category === 'NON-TECH' ? 'var(--tk-text-muted)' : 'var(--tk-accent)',
                  border: '1px solid var(--tk-border)',
                }}
              >
                {arena.category || (arena.isTechnical ? 'TECH' : 'NON-TECH')}
              </span>
              {arena.type && (
                <span className="text-[9px] font-headline tracking-widest uppercase text-tk-text-muted">
                  • {arena.type.toUpperCase()}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black tracking-tight font-headline text-tk-text">{arena.name}</h2>
          </div>
        </div>

        <p className="text-tk-text-muted text-sm leading-relaxed mb-6">{arena.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border border-white/5 p-3 bg-tk-bg">
            <div className="text-[9px] text-tk-text-muted tracking-[0.2em] uppercase mb-1">Prize Pool</div>
            <div className="font-black text-lg font-headline" style={{ color: 'var(--tk-accent)' }}>
              {prizeDisplay}
            </div>
          </div>
          <div className="border border-white/5 p-3 bg-tk-bg">
            <div className="text-[9px] text-tk-text-muted tracking-[0.2em] uppercase mb-1">Team Size</div>
            <div className="text-tk-text font-black text-lg font-headline">{teamSizeDisplay}</div>
          </div>
        </div>

        {arena.venue && (
          <div className="mb-4">
            <div className="text-[9px] text-tk-text-muted tracking-[0.2em] uppercase mb-1">Venue</div>
            <p className="text-sm text-tk-text font-medium">{arena.venue}</p>
          </div>
        )}

        {arena.rules && arena.rules.length > 0 && (
          <div className="mb-6">
            <div className="text-[9px] text-tk-text-muted tracking-[0.2em] uppercase mb-3 border-b border-white/5 pb-2">
              Rules &amp; Guidelines
            </div>
            <ul className="space-y-2">
              {arena.rules.map((r, i) => (
                <li key={i} className="text-xs text-tk-text-muted flex items-start gap-2 leading-relaxed">
                  <span style={{ color: 'var(--tk-accent)' }} className="mt-0.5 flex-shrink-0">◈</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link
          href={`/arenas/${arena.slug || arena.id}`}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] px-6 py-3 transition-all duration-200 w-full justify-center"
          style={{
            background: 'var(--tk-accent)',
            color: 'var(--tk-bg)',
          }}
        >
          VIEW ARENA DETAILS <ArrowRight size={14} />
        </Link>
      </motion.div>
    </motion.div>
  );
}

function ArenaCard({ arena, onClick }: { arena: Arena; onClick: () => void }) {
  const Icon = (LucideIcons as any)[arena.iconName || ''] || CircleHelp;
  const prizeDisplay = arena.prizePool || arena.prize || 'TBA';
  const teamSizeDisplay = formatTeamSize(arena.teamSize);
  const categoryTag = arena.category || (arena.isTechnical ? 'TECH' : 'NON-TECH');

  return (
    <motion.div
      variants={FADE_UP}
      whileHover={{ scale: 1.02, y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
      className="group relative p-6 cursor-pointer overflow-hidden flex flex-col justify-between transition-all duration-200 ease-out"
      style={{ border: '1px solid var(--tk-border)', background: 'var(--tk-bg-surface)' }}
      onClick={onClick}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'var(--tk-border-accent)';
        el.style.boxShadow = '0 0 28px var(--tk-accent-glow)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'var(--tk-border)';
        el.style.boxShadow = 'none';
      }}
    >
      <div>
        {/* Top Row: Icon + Category Badge */}
        <div className="flex items-start justify-between gap-2 mb-5">
          <div
            className="p-2.5"
            style={{
              background: 'var(--tk-accent-subtle)',
              border: '1px solid var(--tk-border-accent)',
              color: 'var(--tk-accent)',
            }}
          >
            <Icon size={24} strokeWidth={1.5} />
          </div>

          <div
            className="px-2.5 py-0.5 text-[10px] font-headline font-bold tracking-widest uppercase rounded-sm"
            style={{
              border: '1px solid var(--tk-border-accent)',
              background: categoryTag === 'TECH' ? 'var(--tk-accent-subtle)' : 'rgba(255,255,255,0.04)',
              color: categoryTag === 'TECH' ? 'var(--tk-accent)' : 'var(--tk-text-muted)',
            }}
          >
            {categoryTag}
          </div>
        </div>

        <h3 className="text-xl font-black tracking-tight font-headline text-tk-text group-hover:text-tk-accent transition-colors mb-1.5">
          {arena.name}
        </h3>

        {arena.hook && (
          <p className="text-[10px] tracking-[0.15em] uppercase mb-3 font-semibold" style={{ color: 'var(--tk-accent)' }}>
            {arena.hook}
          </p>
        )}

        <p className="text-xs text-tk-text-muted leading-relaxed line-clamp-2 mb-6">
          {arena.description}
        </p>
      </div>

      <div>
        {/* Footer Stats Row (Prize / Team Size / Duration) */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 mb-4">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1 text-tk-text-muted text-[9px] uppercase tracking-wider font-semibold">
              <Trophy size={11} style={{ color: 'var(--tk-accent)' }} />
              <span>Prize</span>
            </div>
            <span className="text-xs font-headline font-bold text-tk-text mt-0.5 truncate">{prizeDisplay}</span>
          </div>

          <div className="flex flex-col items-start border-l border-white/5 pl-2">
            <div className="flex items-center gap-1 text-tk-text-muted text-[9px] uppercase tracking-wider font-semibold">
              <Users size={11} style={{ color: 'var(--tk-accent)' }} />
              <span>Team</span>
            </div>
            <span className="text-xs font-headline font-bold text-tk-text mt-0.5 truncate">{teamSizeDisplay}</span>
          </div>

          <div className="flex flex-col items-start border-l border-white/5 pl-2">
            <div className="flex items-center gap-1 text-tk-text-muted text-[9px] uppercase tracking-wider font-semibold">
              <Clock size={11} style={{ color: 'var(--tk-accent)' }} />
              <span>Duration</span>
            </div>
            <span className="text-xs font-headline font-bold text-tk-text mt-0.5 truncate">{arena.duration || '24h'}</span>
          </div>
        </div>

        <Link
          href={`/arenas/${arena.slug || arena.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1.5 text-[11px] font-headline font-bold tracking-[0.15em] uppercase group-hover:gap-3 transition-all duration-200"
          style={{ color: 'var(--tk-accent)' }}
        >
          VIEW ARENA <ArrowRight size={12} />
        </Link>
      </div>
    </motion.div>
  );
}

export default function ArenasPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [selectedArena, setSelectedArena] = useState<Arena | null>(null);

  const { data: rawEvents, isLoading } = useFetch<Arena[]>('/api/events');

  // Handle both array responses and { success: true, data: [...] } format
  const events: Arena[] = useMemo(() => {
    if (Array.isArray(rawEvents)) return rawEvents;
    if (rawEvents && Array.isArray((rawEvents as any).data)) return (rawEvents as any).data;
    return [];
  }, [rawEvents]);

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return events;
    if (activeFilter === 'TECH') return events.filter((e) => e.category === 'TECH' || e.isTechnical === true);
    if (activeFilter === 'NON-TECH') return events.filter((e) => e.category === 'NON-TECH' || e.isTechnical === false);
    if (activeFilter === 'Solo')
      return events.filter((e) => e.type === 'solo' || (typeof e.teamSize === 'object' && e.teamSize.max === 1));
    if (activeFilter === 'Team')
      return events.filter((e) => e.type === 'team' || (typeof e.teamSize === 'object' && e.teamSize.max > 1));
    return events;
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
            <motion.div variants={FADE_UP} className="text-xs tracking-[0.3em] uppercase font-bold" style={{ color: 'var(--tk-accent)' }}>
              ◈ CHOOSE YOUR BATTLEFIELD
            </motion.div>
            <motion.h1 variants={FADE_UP} className="text-5xl sm:text-7xl font-black tracking-tighter font-headline leading-[0.9] text-tk-text">
              FESTIVAL<br />
              <span style={{ color: 'var(--tk-accent)' }}>ARENAS</span>
            </motion.h1>
            <motion.p variants={FADE_UP} className="text-tk-text-muted text-base max-w-xl">
              Explore 12 competitive arenas across Tech and Non-Tech tracks — pick your battle, check the rules, and register your team.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs (All / TECH / NON-TECH / Solo / Team) */}
      <div className="sticky top-14 z-30 backdrop-blur-md" style={{ background: 'rgba(17,17,17,0.90)', borderBottom: '1px solid var(--tk-border)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex gap-0 overflow-x-auto no-scrollbar">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`relative px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-colors duration-200 border-b-2 ${
                  activeFilter === tab
                    ? 'border-b-2'
                    : 'text-tk-text-muted hover:text-tk-text border-transparent'
                }`}
                style={
                  activeFilter === tab
                    ? { color: 'var(--tk-accent)', borderColor: 'var(--tk-accent)' }
                    : {}
                }
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
            <div className="text-center py-24 text-tk-text-muted">
              <Zap size={32} className="mx-auto mb-4 opacity-40" style={{ color: 'var(--tk-accent)' }} />
              <p className="text-sm uppercase tracking-[0.2em]">No arenas match the selected filter.</p>
            </div>
          ) : (
            <motion.div
              key={activeFilter}
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((arena) => (
                <ArenaCard key={arena.id || arena.slug} arena={arena} onClick={() => setSelectedArena(arena)} />
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
