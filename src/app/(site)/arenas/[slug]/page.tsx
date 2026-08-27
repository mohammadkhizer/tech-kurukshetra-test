'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Script from 'next/script';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  CircleHelp,
  ArrowLeft,
  Calendar,
  MapPin,
  Tag,
  User,
  Phone,
  ShieldCheck,
  ListChecks,
} from 'lucide-react';
import { useFetch } from '@/hooks/use-fetch';

const EASE_OUT = { duration: 0.3, ease: 'easeOut' };
const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: EASE_OUT },
};

/* ─── Shape-matched skeleton that mirrors the real two-column layout ─── */
function ArenaDetailSkeleton() {
  return (
    <div className="pt-32 pb-40 px-6 max-w-5xl mx-auto min-h-screen">
      <div className="h-4 w-28 bg-white/10 mb-12 animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8 animate-pulse">
          <div className="aspect-square bg-white/5" />
          <div className="p-6 border border-white/5 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-4 h-4 bg-white/10 rounded-sm" />
                <div className="h-3 bg-white/5 w-40" />
              </div>
            ))}
          </div>
        </div>
        {/* Right column */}
        <div className="lg:col-span-3 space-y-10 animate-pulse">
          <div>
            <div className="h-5 w-20 bg-white/10 mb-4" />
            <div className="h-12 bg-white/10 w-3/4 mb-3" />
            <div className="h-12 bg-white/5 w-1/2" />
          </div>
          <div className="space-y-4">
            <div className="h-5 bg-white/10 w-32" />
            <div className="h-3 bg-white/5 w-full" />
            <div className="h-3 bg-white/5 w-5/6" />
            <div className="h-3 bg-white/5 w-4/6" />
          </div>
          <div className="space-y-4">
            <div className="h-5 bg-white/10 w-40" />
            <div className="p-6 border border-white/5 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-3 bg-white/5 w-full" />
              ))}
            </div>
          </div>
          <div className="pt-8">
            <div className="h-14 bg-white/10 w-full md:w-72" />
          </div>
        </div>
      </div>
    </div>
  );
}

import { DEFAULT_EVENTS } from '@/lib/events-data';

export default function ArenaDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { data: events, isLoading } = useFetch<any[]>('/api/events');
  const allEvents = useMemo(() => (events && events.length > 0 ? events : DEFAULT_EVENTS), [events]);
  const event = useMemo(() => allEvents.find((e: any) => e.slug === slug), [allEvents, slug]);
  const festivalDay = null;
  const festivalDayLoading = false;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading || festivalDayLoading) {
    return <ArenaDetailSkeleton />;
  }

  if (!event) {
    return (
      <div className="pt-32 pb-40 px-6 max-w-5xl mx-auto min-h-screen text-center">
        <h1 className="font-headline text-5xl md:text-6xl tracking-tighter text-destructive mb-6 uppercase">
          Arena Not Found
        </h1>
        <p className="text-xl text-muted-foreground font-light leading-relaxed">
          The event you are looking for does not exist or has been moved.
        </p>
        <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/80 px-12 py-8 font-headline tracking-widest text-lg rounded-none w-full md:w-auto">
          <Link href="/arenas">VIEW ALL ARENAS</Link>
        </Button>
      </div>
    );
  }

  const img = !event.imageUrl && Array.isArray(PlaceHolderImages) ? PlaceHolderImages.find(i => i.id === event.imgId) : null;
  const imgSrc = event.imageUrl || (img && typeof img === 'object' ? img.imageUrl : '') || '';
  const Icon = CircleHelp;

  const eventStartDate = festivalDay && typeof festivalDay === 'object' && (festivalDay as any).date
    ? new Date((festivalDay as any).date).toISOString().split('T')[0]
    : '2027-01-16';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    startDate: event.startTime || eventStartDate,
    endDate: event.endTime || eventStartDate,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: event.location || 'UCPIT SVGU Campus',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Chimanbhai Patel Institute Campus, SG Highway, Near Prahlad Nagar',
        addressLocality: 'Ahmedabad',
        postalCode: '380015',
        addressRegion: 'GJ',
        addressCountry: 'IN',
      },
    },
    image: [imgSrc],
    description: event.longDescription,
    organizer: {
      '@type': 'Organization',
      name: 'TECH KURUKSHETRA',
      url: 'https://www.techkurukshetra.com',
    },
  };

  return (
    <>
      <Script
        id="event-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="pt-32 pb-40 px-6 max-w-5xl mx-auto min-h-screen">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...EASE_OUT, delay: 0.1 }}
        >
          <Link
            href="/arenas"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-12 font-headline text-xs tracking-widest uppercase group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Arenas
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left: image + meta */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
          >
            <motion.div
              variants={FADE_UP}
              className="relative aspect-square overflow-hidden glass-panel border-primary/20 rounded-none shadow-2xl"
            >
              <Image
                src={imgSrc}
                alt={event.name}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
            </motion.div>

            <motion.div variants={FADE_UP} className="glass-panel p-6 border-primary/10 rounded-none space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="uppercase tracking-widest font-headline text-[10px]">
                  {festivalDay && typeof festivalDay === 'object' ? formatDate((festivalDay as any).date) : 'JAN 16, 2027'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="uppercase tracking-widest font-headline text-[10px]">{event.location || 'Location TBD'}</span>
              </div>
              {event.registrationFee && (
                <div className="flex items-center gap-3 text-muted-foreground text-sm">
                  <Tag className="w-4 h-4 text-primary" />
                  <span className="uppercase tracking-widest font-headline text-[10px]">{event.registrationFee}</span>
                </div>
              )}
              {event.eventHead && (
                <div className="flex items-center gap-3 text-muted-foreground text-sm">
                  <User className="w-4 h-4 text-primary" />
                  <span className="uppercase tracking-widest font-headline text-[10px]">{event.eventHead}</span>
                </div>
              )}
              {event.organiserContact && (
                <div className="flex items-center gap-3 text-muted-foreground text-sm">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="uppercase tracking-widest font-headline text-[10px]">{event.organiserContact}</span>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Right: content */}
          <motion.div
            className="lg:col-span-3 space-y-10"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
          >
            <motion.div variants={FADE_UP}>
              <Badge className={`bg-primary/20 ${event.color} border-none rounded-none font-headline text-[10px] tracking-[0.2em] uppercase mb-4 px-4 py-1`}>
                {event.type}
              </Badge>
              <h1 className="font-headline text-5xl md:text-6xl tracking-tighter text-white mb-6 uppercase">
                {event.name}
              </h1>
            </motion.div>

            <motion.div variants={FADE_UP} className="space-y-6">
              <h2 className="font-headline text-xl text-primary tracking-widest uppercase flex items-center gap-3">
                <ShieldCheck className="w-5 h-5" /> The Protocol
              </h2>
              <p className="text-muted-foreground leading-relaxed">{event.longDescription}</p>
            </motion.div>

            <motion.div variants={FADE_UP} className="space-y-6">
              <h2 className="font-headline text-xl text-accent tracking-widest uppercase flex items-center gap-3">
                <ListChecks className="w-5 h-5" /> Entry Constraints
              </h2>
              <div className="glass-panel p-6 border-white/5 bg-white/5 rounded-none">
                <ul className="space-y-4">
                  {event.rules.map((rule: string, idx: number) => (
                    <li key={idx} className="text-sm text-muted-foreground">
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div variants={FADE_UP} className="pt-8">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/80 px-12 py-8 font-headline tracking-widest text-lg rounded-none w-full md:w-auto accent-glow">
                <Link href="/register">INITIALIZE REGISTRATION</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
