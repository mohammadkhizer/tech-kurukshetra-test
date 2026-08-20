'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CircleHelp, Trophy, Users, Clock } from 'lucide-react';
import { useFetch } from '@/hooks/use-fetch';

function SkeletonArenaCard() {
  return (
    <div className="border border-white/5 bg-white/[0.02] p-6 flex flex-col animate-pulse">
      <div className="w-10 h-10 bg-white/10 mb-6" />
      <div className="h-5 bg-white/10 w-3/4 mb-2" />
      <div className="h-3 bg-white/5 w-1/3 mb-4" />
      <div className="h-3 bg-white/5 w-full mb-2 flex-1" />
      <div className="h-3 bg-white/5 w-5/6 mb-6" />
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
  const { data: events, isLoading: eventsLoading } = useFetch<any[]>('/api/events');

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="mb-16 flex flex-col gap-3"
      >
        <motion.div variants={FADE_UP} className="text-xs text-[#FF6B00] tracking-[0.3em] uppercase">
          ◈ BATTLEGROUNDS
        </motion.div>
        <motion.h2 variants={FADE_UP} className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter font-headline leading-[0.95]">
          CHOOSE YOUR<br />
          <span className="text-[#FF6B00]">ARENA</span>
        </motion.h2>
      </motion.div>

      {eventsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonArenaCard key={i} />)}
        </div>
      ) : !events || events.length === 0 ? (
        <div className="text-center py-12 text-[#8A8A8A]">
          <p className="text-xs uppercase tracking-[0.2em]">No arenas currently listed. Check back soon!</p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {events.slice(0, 4).map((event: any) => {
            return (
              <motion.div
                key={event.id || event.slug}
                variants={FADE_UP}
                whileHover={{ scale: 1.02, y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
                className="group relative border border-white/10 group-hover:border-[#FF6B00]/50 bg-white/[0.02] p-6 cursor-pointer overflow-hidden flex flex-col justify-between transition-all duration-200 ease-out"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    boxShadow: 'inset 0 0 0 1px rgba(255,107,0,0.5)',
                    background: 'radial-gradient(circle at top left, rgba(255,107,0,0.08), transparent 60%)',
                  }}
                />
                <div>
                  <div className="flex items-start justify-between gap-2 mb-5">
                    <div className="p-2.5 bg-[#FF6B00]/10 border border-[#FF6B00]/20">
                      <CircleHelp size={24} className="text-[#FF6B00]" strokeWidth={1.5} />
                    </div>
                    <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/10 text-[#FF6B00] px-2.5 py-0.5 text-[10px] font-headline font-bold tracking-widest uppercase rounded-sm">
                      {event.difficulty || 'Intermediate'}
                    </div>
                  </div>

                  <h3 className="text-xl font-black tracking-tight font-headline mb-1 text-white group-hover:text-[#FF6B00] transition-colors">
                    {event.name}
                  </h3>
                  {event.hook && (
                    <div className="text-[10px] tracking-[0.15em] uppercase mb-3 text-[#FF6B00]/90 font-semibold">{event.hook}</div>
                  )}
                  <p className="text-xs text-[#8A8A8A] leading-relaxed line-clamp-2 mb-6">{event.description}</p>
                </div>

                <div>
                  {/* Footer Stats Row (Prize / Team Size / Duration) */}
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
                      <span className="text-xs font-headline font-bold text-[#F1F1F1] mt-0.5 truncate">{event.teamSize || '1-4'}</span>
                    </div>

                    <div className="flex flex-col items-start border-l border-white/5 pl-2">
                      <div className="flex items-center gap-1 text-[#8A8A8A] text-[9px] uppercase tracking-wider font-semibold">
                        <Clock size={11} className="text-[#FF6B00]" />
                        <span>Duration</span>
                      </div>
                      <span className="text-xs font-headline font-bold text-[#F1F1F1] mt-0.5 truncate">{event.duration || '24h'}</span>
                    </div>
                  </div>

                  {(event.sponsorName || event.sponsorLogo) && (
                    <div className="flex items-center gap-1.5 text-[9px] text-[#8A8A8A] tracking-wider uppercase mb-3">
                      <span>Powered by</span>
                      {event.sponsorLogo ? (
                        <img src={event.sponsorLogo} alt={event.sponsorName || 'Sponsor'} className="h-3.5 w-auto object-contain max-w-[80px]" />
                      ) : (
                        <span className="text-[#FF6B00] font-bold">{event.sponsorName}</span>
                      )}
                    </div>
                  )}

                  <Link
                    href={`/arenas/${event.slug}`}
                    className="inline-flex items-center gap-1.5 text-[11px] font-headline tracking-[0.15em] uppercase text-[#FF6B00] group-hover:gap-3 transition-all duration-200 font-bold"
                  >
                    View Arena <ArrowRight size={12} />
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
