'use client';

import { useFetch } from '@/hooks/use-fetch';
import { Megaphone, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { motion } from 'framer-motion';

const EASE_OUT = { duration: 0.3, ease: 'easeOut' };
const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: EASE_OUT },
};

function SkeletonAnnouncementCard() {
  return (
    <div className="border border-primary/10 p-8 bg-black/20 flex flex-col animate-pulse">
      {/* Date/icon row */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3.5 h-3.5 bg-white/10 rounded-full" />
        <div className="h-2.5 bg-white/10 w-36" />
      </div>
      {/* Title */}
      <div className="h-6 bg-white/10 w-3/4 mb-3" />
      {/* Content lines */}
      <div className="h-3 bg-white/5 w-full mb-2" />
      <div className="h-3 bg-white/5 w-5/6 mb-2" />
      <div className="h-3 bg-white/5 w-4/6 mb-6 flex-1" />
      {/* CTA */}
      <div className="h-4 bg-white/10 w-32 mt-auto" />
    </div>
  );
}

export default function AnnouncementsPage() {
  const { data: announcements, isLoading } = useFetch<any[]>('/api/announcements');

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="pt-32 pb-40 px-6 max-w-6xl mx-auto min-h-screen">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="text-center mb-16"
      >
        <motion.h1
          variants={FADE_UP}
          className="font-headline text-5xl md:text-6xl mb-4 tracking-tighter uppercase"
        >
          Mission <span className="text-primary">Briefings</span>
        </motion.h1>
        <motion.p
          variants={FADE_UP}
          className="text-muted-foreground text-lg uppercase tracking-widest font-light"
        >
          Latest Updates &amp; Announcements
        </motion.p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => <SkeletonAnnouncementCard key={i} />)}
        </div>
      ) : announcements && announcements.length > 0 ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {announcements.map((announcement) => (
            <motion.div key={announcement.id} variants={FADE_UP}>
              <Link href={`/announcements/${announcement.id}`} className="group block h-full">
                <Card className="glass-panel border-primary/10 hover:border-primary/40 p-8 rounded-none bg-black/20 h-full flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 text-accent text-[10px] font-headline tracking-[0.2em] uppercase mb-4">
                      <Megaphone className="w-3.5 h-3.5" />
                      <span>{formatDate(announcement.timestamp)}</span>
                    </div>
                    <h2 className="text-2xl font-headline mb-4 text-white tracking-tight uppercase group-hover:text-primary transition-colors">
                      {announcement.title}
                    </h2>
                    <p className="text-muted-foreground font-light leading-relaxed text-sm line-clamp-3">
                      {announcement.content}
                    </p>
                  </div>
                  <div className="mt-6 text-xs font-headline text-primary tracking-[0.2em] uppercase flex items-center">
                    Read Briefing
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 glass-panel border-primary/20 rounded-none bg-black/40">
          <p className="text-muted-foreground">No announcements have been posted yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
