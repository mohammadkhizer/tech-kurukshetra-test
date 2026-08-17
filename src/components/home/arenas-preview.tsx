'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CircleHelp } from 'lucide-react';
import { useFetch } from '@/hooks/use-fetch';

function SkeletonArenaCard() {
  return (
    <div className="border border-white/5 bg-white/[0.02] p-6 flex flex-col animate-pulse">
      {/* Icon placeholder */}
      <div className="w-10 h-10 bg-white/10 mb-6" />
      {/* Title */}
      <div className="h-5 bg-white/10 w-3/4 mb-2" />
      {/* Hook tag */}
      <div className="h-3 bg-white/5 w-1/3 mb-4" />
      {/* Description lines */}
      <div className="h-3 bg-white/5 w-full mb-2 flex-1" />
      <div className="h-3 bg-white/5 w-5/6 mb-6" />
      {/* CTA */}
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
            const color = event.isTechnical === false ? '#C81E1E' : '#FF6B00';
            return (
              <motion.div
                key={event.id || event.slug}
                variants={FADE_UP}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative border border-white/5 bg-white/[0.02] p-6 cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 0 1px ${color}80`,
                    background: `radial-gradient(circle at top left, ${color}0a, transparent 60%)`,
                  }}
                />
                <div>
                  <div className="mb-6">
                    <CircleHelp size={28} style={{ color }} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-black tracking-tight font-headline mb-1 text-white">{event.name}</h3>
                  {event.hook && (
                    <div className="text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color }}>{event.hook}</div>
                  )}
                  <p className="text-sm text-[#8A8A8A] leading-relaxed line-clamp-3 mb-4">{event.description}</p>
                </div>
                <Link
                  href={`/arenas/${event.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase transition-colors font-bold mt-4"
                  style={{ color }}
                >
                  View Arena <ArrowRight size={12} />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
