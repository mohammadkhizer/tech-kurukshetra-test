'use client';

import { useState, useMemo } from 'react';
import { useFetch } from '@/hooks/use-fetch';
import { Megaphone, ArrowRight, Clock, Pin, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { motion } from 'framer-motion';

const EASE_OUT = { duration: 0.3, ease: 'easeOut' };
const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: EASE_OUT },
};

const CATEGORY_TABS = ['All', 'Updates', 'Deadlines', 'General'] as const;
type CategoryTab = typeof CATEGORY_TABS[number];

function getCategory(a: any): 'Update' | 'Deadline' | 'General' {
  if (a.category && ['Update', 'Deadline', 'General'].includes(a.category)) {
    return a.category;
  }
  const text = `${a.title || ''} ${a.content || ''}`.toLowerCase();
  if (text.includes('deadline') || text.includes('urgent') || text.includes('last date') || text.includes('closing') || text.includes('due')) {
    return 'Deadline';
  }
  if (text.includes('update') || text.includes('notice') || text.includes('schedule') || text.includes('patch')) {
    return 'Update';
  }
  return 'General';
}

function getCategoryBorderClass(category: 'Update' | 'Deadline' | 'General') {
  switch (category) {
    case 'Update':
      return 'border-l-4 border-l-tk-accent';
    case 'Deadline':
      return 'border-l-4 border-l-red-600';
    case 'General':
    default:
      return 'border-l-4 border-l-tk-text-muted';
  }
}

function SkeletonAnnouncementCard() {
  return (
    <div className="border border-white/5 border-l-4 border-l-white/20 p-8 bg-black/20 flex flex-col animate-pulse">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3.5 h-3.5 bg-white/10 rounded-full" />
        <div className="h-2.5 bg-white/10 w-36" />
      </div>
      <div className="h-6 bg-white/10 w-3/4 mb-3" />
      <div className="h-3 bg-white/5 w-full mb-2" />
      <div className="h-3 bg-white/5 w-5/6 mb-2" />
      <div className="h-3 bg-white/5 w-4/6 mb-6 flex-1" />
      <div className="h-4 bg-white/10 w-32 mt-auto" />
    </div>
  );
}

export default function AnnouncementsPage() {
  const [activeTab, setActiveTab] = useState<CategoryTab>('All');
  const { data: rawAnnouncements, isLoading } = useFetch<any[]>('/api/announcements');

  const announcements = useMemo(() => {
    if (!rawAnnouncements) return [];
    return [...rawAnnouncements];
  }, [rawAnnouncements]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Helper to compute hours left for deadlines under 48h
  const getDeadlineCountdown = (announcement: any) => {
    const deadlineTime = announcement.deadlineDate
      ? new Date(announcement.deadlineDate).getTime()
      : new Date(announcement.timestamp).getTime() + 48 * 60 * 60 * 1000;

    const diff = deadlineTime - Date.now();
    if (diff > 0 && diff <= 48 * 60 * 60 * 1000) {
      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      return `${hrs}h ${mins}m left`;
    }
    return null;
  };

  // Process, filter, and auto-pin deadline tagged posts to top
  const processedAnnouncements = useMemo(() => {
    let list = announcements.map(a => {
      const cat = getCategory(a);
      const createdTime = new Date(a.timestamp).getTime();
      const isNew = !isNaN(createdTime) && Date.now() - createdTime < 24 * 60 * 60 * 1000;
      const isPinned = a.isPinned || cat === 'Deadline';
      const countdown = cat === 'Deadline' ? getDeadlineCountdown(a) : null;
      return { ...a, category: cat, isNew, isPinned, countdown };
    });

    // Filter by Tab
    if (activeTab === 'Updates') {
      list = list.filter(a => a.category === 'Update');
    } else if (activeTab === 'Deadlines') {
      list = list.filter(a => a.category === 'Deadline');
    } else if (activeTab === 'General') {
      list = list.filter(a => a.category === 'General');
    }

    // Auto-pin Deadline / Pinned posts to top
    return list.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [announcements, activeTab]);

  return (
    <div className="pt-32 pb-40 px-6 max-w-6xl mx-auto min-h-screen">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="text-center mb-12"
      >
        <motion.h1
          variants={FADE_UP}
          className="font-headline text-5xl md:text-6xl mb-4 tracking-tighter uppercase text-tk-text"
        >
          Mission <span className="text-tk-accent">Briefings</span>
        </motion.h1>
        <motion.p
          variants={FADE_UP}
          className="text-tk-text-muted text-lg uppercase tracking-widest font-light max-w-xl mx-auto"
        >
          Official Intelligence, Protocol Updates &amp; Deadlines
        </motion.p>
      </motion.div>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
        {CATEGORY_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 text-xs font-headline tracking-[0.2em] uppercase transition-all duration-200 border ${
              activeTab === tab
                ? 'bg-tk-accent border-tk-accent text-tk-bg font-bold shadow-[0_0_15px_var(--tk-accent-glow)]'
                : 'bg-tk-bg-surface border-tk-border text-tk-text-muted hover:text-tk-text hover:border-tk-border-accent'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => <SkeletonAnnouncementCard key={i} />)}
        </div>
      ) : processedAnnouncements.length > 0 ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {processedAnnouncements.map((announcement) => {
            const borderClass = getCategoryBorderClass(announcement.category);

            return (
              <motion.div key={announcement.id || announcement.title} variants={FADE_UP}>
                <Link href={`/announcements/${announcement.id}`} className="group block h-full">
                  <Card
                    className={`glass-panel ${borderClass} border-tk-border hover:border-tk-border-accent p-8 rounded-none bg-tk-bg-surface h-full flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[var(--tk-accent-glow)] relative overflow-hidden`}
                  >
                    {/* Top Badges Row: Category + Pinned + NEW Pill */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2 text-[10px] font-headline tracking-[0.2em] uppercase">
                        {announcement.category === 'Deadline' ? (
                          <span className="flex items-center gap-1 text-[#C81E1E] font-bold bg-[#C81E1E]/10 border border-[#C81E1E]/30 px-2 py-0.5">
                            <AlertCircle className="w-3 h-3" /> URGENT DEADLINE
                          </span>
                        ) : announcement.category === 'Update' ? (
                          <span className="flex items-center gap-1 text-tk-accent font-bold bg-tk-accent/10 border border-tk-border-accent px-2 py-0.5">
                            <Megaphone className="w-3 h-3" /> SYSTEM UPDATE
                          </span>
                        ) : (
                          <span className="text-tk-text-muted font-bold bg-white/5 border border-tk-border px-2 py-0.5">
                            GENERAL
                          </span>
                        )}

                        {announcement.isPinned && (
                          <span className="flex items-center gap-1 text-tk-accent text-[9px] font-bold tracking-widest">
                            <Pin className="w-3 h-3 rotate-45" /> PINNED
                          </span>
                        )}
                      </div>

                      {/* NEW Pill (under 24h old) */}
                      {announcement.isNew && (
                        <span className="bg-tk-accent text-tk-bg font-headline font-black text-[9px] px-2 py-0.5 uppercase tracking-wider rounded-sm shadow-md animate-pulse">
                          NEW
                        </span>
                      )}
                    </div>

                    <div className="flex-grow">
                      <div className="text-[10px] text-[#8A8A8A] tracking-[0.15em] uppercase mb-2">
                        {formatDate(announcement.timestamp)}
                      </div>

                      <h2 className="text-2xl font-headline mb-4 text-white tracking-tight uppercase group-hover:text-[#FF6B00] transition-colors">
                        {announcement.title}
                      </h2>

                      <p className="text-[#8A8A8A] font-light leading-relaxed text-sm line-clamp-3">
                        {announcement.content}
                      </p>
                    </div>

                    {/* Footer Row: Countdown chip (if <48h) + Read Briefing CTA */}
                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                      {announcement.countdown ? (
                        <div className="flex items-center gap-1.5 bg-[#C81E1E]/10 border border-[#C81E1E]/30 px-2.5 py-1 text-[10px] text-[#C81E1E] font-bold tracking-wider uppercase animate-pulse">
                          <Clock className="w-3 h-3" />
                          <span>ENDS IN {announcement.countdown}</span>
                        </div>
                      ) : (
                        <span />
                      )}

                      <div className="text-xs font-headline text-tk-accent tracking-[0.2em] uppercase flex items-center group-hover:gap-2 transition-all">
                        Read Briefing
                        <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="text-center py-20 glass-panel border-white/10 rounded-none bg-black/40">
          <p className="text-[#8A8A8A] uppercase tracking-[0.2em] text-xs">No announcements match the selected filter.</p>
        </div>
      )}
    </div>
  );
}
