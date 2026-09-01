'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { ArrowRight, CircleHelp, Trophy, Users, Clock } from 'lucide-react';
import { useFetch } from '@/hooks/use-fetch';
import { formatTeamSize } from '@/lib/format-helpers';

function SkeletonArenaCard() {
  return (
    <div className="border border-white/5 bg-white/[0.02] p-6 flex flex-col justify-between animate-pulse h-[320px]">
      <div>
        <div className="w-10 h-10 bg-white/10 mb-6" />
        <div className="h-5 bg-white/10 w-3/4 mb-2" />
        <div className="h-3 bg-white/5 w-1/3 mb-4" />
        <div className="h-3 bg-white/5 w-full mb-2" />
        <div className="h-3 bg-white/5 w-5/6" />
      </div>
      <div className="h-4 bg-white/5 w-24" />
    </div>
  );
}

const EASE_OUT = { duration: 0.3, ease: 'easeOut' };
const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: EASE_OUT },
};

export function ArenasPreview() {
  const { data: rawEvents, isLoading: eventsLoading } = useFetch<any>('/api/events');

  const events = Array.isArray(rawEvents)
    ? rawEvents
    : rawEvents?.data && Array.isArray(rawEvents.data)
    ? rawEvents.data
    : [];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="mb-12 flex flex-col gap-3"
      >
        <motion.div variants={FADE_UP} className="text-xs text-[#FF6B00] tracking-[0.3em] uppercase font-bold">
          ◈ BATTLEGROUNDS
        </motion.div>
        <motion.h2 variants={FADE_UP} className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter font-headline leading-[0.95]">
          CHOOSE YOUR<br />
          <span className="text-[#FF6B00]">ARENA</span>
        </motion.h2>
      </motion.div>

      {eventsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonArenaCard key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        /* TODO: Add events/arenas via the admin dashboard CMS (/admin/dashboard) */
        <div className="text-center py-16 text-[#8A8A8A] border border-white/5 bg-white/[0.01]">
          <p className="text-xs uppercase tracking-[0.25em]">Arenas managed via Admin CMS — check back soon.</p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {events.slice(0, 4).map((event: any) => {
            const Icon = (LucideIcons as any)[event.iconName || ''] || CircleHelp;
            return (
              <motion.div
                key={event.id || event.slug}
                variants={FADE_UP}
                whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
                className="group relative p-6 cursor-pointer overflow-hidden flex flex-col justify-between transition-all duration-300 ease-out"
                style={{
                  border: '1px solid var(--tk-border)',
                  background: 'var(--tk-bg-surface)',
                }}
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
                {/* Hover glow applied via onMouseEnter above — no always-visible gradient */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-5">
                    <div
                      className="p-3 transition-colors duration-200"
                      style={{
                        background: 'var(--tk-accent-subtle)',
                        border: '1px solid var(--tk-border-accent)',
                        color: 'var(--tk-accent)',
                      }}
                    >
                      <Icon size={24} strokeWidth={1.5} />
                    </div>
                    <div
                      className="px-2.5 py-0.5 text-[10px] font-headline font-bold tracking-widest uppercase"
                      style={{
                        border: '1px solid var(--tk-border-accent)',
                        background: 'var(--tk-accent-subtle)',
                        color: 'var(--tk-accent)',
                      }}
                    >
                      {event.type || event.difficulty || 'Battle'}
                    </div>
                  </div>

                  <h3 className="text-xl font-black tracking-tight font-headline mb-1 text-tk-text group-hover:text-tk-accent transition-colors">
                    {event.name}
                  </h3>
                  {event.hook && (
                    <div className="text-[10px] tracking-[0.15em] uppercase mb-3 text-[#FF6B00]/90 font-bold">{event.hook}</div>
                  )}
                  <p className="text-xs text-[#8A8A8A] leading-relaxed line-clamp-3 mb-6">{event.description}</p>
                </div>

                <div>
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 mb-4">
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-1 text-[#8A8A8A] text-[9px] uppercase tracking-wider font-semibold">
                        <Trophy size={11} className="text-[#FF6B00]" />
                        <span>Prize</span>
                      </div>
                      <span className="text-xs font-headline font-bold text-[#F1F1F1] mt-0.5 truncate">{event.prize || 'TBA'}</span>
                    </div>

                    <div className="flex flex-col items-start border-l border-white/5 pl-2">
                      <div className="flex items-center gap-1 text-[#8A8A8A] text-[9px] uppercase tracking-wider font-semibold">
                        <Users size={11} className="text-[#FF6B00]" />
                        <span>Team</span>
                      </div>
                      <span className="text-xs font-headline font-bold text-[#F1F1F1] mt-0.5 truncate">{formatTeamSize(event.teamSize)}</span>
                    </div>

                    <div className="flex flex-col items-start border-l border-white/5 pl-2">
                      <div className="flex items-center gap-1 text-[#8A8A8A] text-[9px] uppercase tracking-wider font-semibold">
                        <Clock size={11} className="text-[#FF6B00]" />
                        <span>Time</span>
                      </div>
                      <span className="text-xs font-headline font-bold text-[#F1F1F1] mt-0.5 truncate">{event.duration || '24h'}</span>
                    </div>
                  </div>

                  {event.sponsorName && (
                    <div className="flex items-center gap-1.5 text-[9px] text-[#8A8A8A] tracking-wider uppercase mb-3 font-mono">
                      <span>POWERED BY</span>
                      <span className="text-[#FF6B00] font-bold">{event.sponsorName}</span>
                    </div>
                  )}

                  <Link
                    href={`/arenas/${event.slug || event.id}`}
                    className="inline-flex items-center min-h-[44px] py-2 gap-2 text-[11px] font-headline tracking-[0.15em] uppercase text-[#FF6B00] group-hover:gap-3 transition-all duration-200 font-bold"
                  >
                    VIEW ARENA <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
