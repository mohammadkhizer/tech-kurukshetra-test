'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Linkedin, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFetch } from '@/hooks/use-fetch';

const EASE_OUT = { duration: 0.3, ease: 'easeOut' };
const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: EASE_OUT },
};

interface Member {
  id: string;
  name: string;
  role: string;
  group?: string;
  linkedinUrl?: string;
  photoUrl?: string;
  order?: number;
}

const ROLE_GROUPS = ['Core Committee', 'Tech Team', 'Design Team', 'Volunteers'];

// Placeholder initials avatar
function Avatar({ name, photoUrl }: { name: string; photoUrl?: string }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  if (photoUrl) {
    return (
      <div className="relative w-full aspect-square overflow-hidden">
        <Image src={photoUrl} alt={name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
      </div>
    );
  }
  return (
    <div className="w-full aspect-square bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center">
      <span className="text-3xl font-black text-[#FF6B00] font-headline">{initials}</span>
    </div>
  );
}

function MemberCard({ member }: { member: Member }) {
  return (
    <motion.div
      variants={FADE_UP}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative border border-white/5 bg-white/[0.02] overflow-hidden"
      style={{ '--glow': '#FF6B00' } as React.CSSProperties}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(255,107,0,0.4)' }}
      />

      <Avatar name={member.name} photoUrl={member.photoUrl} />

      <div className="p-4">
        <h3 className="text-sm font-black tracking-tight font-headline text-[#F1F1F1] truncate">{member.name}</h3>
        <p className="text-[10px] text-[#FF6B00] tracking-[0.1em] uppercase font-semibold mt-0.5 truncate">{member.role}</p>

        {member.linkedinUrl && (
          <a
            href={member.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-[10px] text-[#8A8A8A] hover:text-[#FF6B00] transition-colors tracking-[0.1em] uppercase"
            onClick={e => e.stopPropagation()}
          >
            <Linkedin size={12} />
            LinkedIn
          </a>
        )}
      </div>
    </motion.div>
  );
}

// Skeleton card
function SkeletonCard() {
  return (
    <div className="border border-white/5 bg-white/[0.02] animate-pulse">
      <div className="aspect-square bg-white/5" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-white/10 w-3/4" />
        <div className="h-3 bg-white/5 w-1/2" />
      </div>
    </div>
  );
}

export default function TeamPage() {
  const { data: rawMembers, isLoading, error } = useFetch<Member[]>('/api/team');

  const members: Member[] = useMemo(
    () => ([...(rawMembers || [])].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))),
    [rawMembers]
  );

  const hasData = !error && members.length > 0;

  const grouped = useMemo(() => {
    const map: Record<string, Member[]> = {};
    ROLE_GROUPS.forEach(g => { map[g] = []; });
    members.forEach(m => {
      const g = m.group || 'Volunteers';
      if (!map[g]) map[g] = [];
      map[g].push(m);
    });
    return map;
  }, [members]);

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
            <motion.div variants={FADE_UP} className="text-xs text-[#FF6B00] tracking-[0.3em] uppercase">◈ THE COMMANDERS</motion.div>
            <motion.h1 variants={FADE_UP} className="text-5xl sm:text-7xl font-black tracking-tighter font-headline leading-[0.9]">
              MEET THE<br /><span className="text-[#FF6B00]">TEAM</span>
            </motion.h1>
            <motion.p variants={FADE_UP} className="text-[#8A8A8A] text-base max-w-xl">
              The battle commanders, engineers, and creatives driving TECH KURUKSHETRA 2027.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 space-y-24">
        {isLoading ? (
          <>
            <div>
              <div className="h-6 bg-white/10 w-48 mb-8 animate-pulse" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            </div>
          </>
        ) : !hasData ? (
          <div className="text-center py-24 text-[#8A8A8A]">
            <Users size={32} className="mx-auto mb-4 text-[#FF6B00]/40" />
            <p className="text-sm uppercase tracking-[0.2em]">Team roster coming soon</p>
          </div>
        ) : (
          ROLE_GROUPS.map(group => {
            const groupMembers = grouped[group] || [];
            if (groupMembers.length === 0) return null;
            return (
              <div key={group}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-[#FF6B00]/10" />
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#FF6B00]">{group}</h2>
                  <div className="h-px flex-1 bg-[#FF6B00]/10" />
                </div>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                  variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                >
                  {groupMembers.map(m => <MemberCard key={m.id} member={m} />)}
                </motion.div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
