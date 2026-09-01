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
  ArrowLeft,
  Calendar,
  MapPin,
  Tag,
  User,
  Phone,
  Mail,
  ShieldCheck,
  ListChecks,
  Trophy,
  Users,
  Clock,
} from 'lucide-react';
import { useFetch } from '@/hooks/use-fetch';
import { formatTeamSize } from '@/lib/format-helpers';

const EASE_OUT = { duration: 0.3, ease: 'easeOut' };
const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: EASE_OUT },
};


function ArenaDetailSkeleton() {
  return (
    <div className="pt-32 pb-40 px-6 max-w-5xl mx-auto min-h-screen">
      <div className="h-4 w-28 bg-white/10 mb-12 animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ArenaDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { data: rawEvents, isLoading } = useFetch<any>('/api/events');

  const events = Array.isArray(rawEvents)
    ? rawEvents
    : rawEvents?.data && Array.isArray(rawEvents.data)
    ? rawEvents.data
    : [];

  const event = useMemo(() => events.find((e: any) => e.slug === slug || e.id === slug), [events, slug]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date TBD';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <ArenaDetailSkeleton />;
  }

  if (!event) {
    return (
      <div className="pt-32 pb-40 px-6 max-w-5xl mx-auto min-h-screen text-center">
        <h1 className="font-headline text-5xl md:text-6xl tracking-tighter text-red-500 mb-6 uppercase">
          Arena Not Found
        </h1>
        <p className="text-xl text-tk-text-muted font-light leading-relaxed">
          The event you are looking for does not exist or has not been listed yet.
        </p>
        <Button asChild size="lg" className="mt-8 bg-tk-accent hover:bg-tk-accent-dim text-tk-bg px-12 py-8 font-headline tracking-widest text-lg rounded-none w-full md:w-auto">
          <Link href="/arenas">VIEW ALL ARENAS</Link>
        </Button>
      </div>
    );
  }

  const placeholderObj = !event.imageUrl && Array.isArray(PlaceHolderImages) ? PlaceHolderImages.find((i: any) => i.id === event.imgId) : null;
  const imgSrc = event.imageUrl || event.bannerImage || (placeholderObj && typeof placeholderObj === 'object' ? placeholderObj.imageUrl : '') || '';

  const prizeDisplay = event.prizePool || event.prize || 'TBA';
  const venueDisplay = event.venue || event.location || 'Location TBD';
  const teamSizeDisplay = formatTeamSize(event.teamSize);
  const contact = event.coordinatorContact;
  const feeDisplay = event.entryFee !== undefined ? (typeof event.entryFee === 'number' ? `₹${event.entryFee}` : event.entryFee) : event.registrationFee || 'Free';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    url: `https://www.techkurukshetra.in/arenas/${event.slug}`,
    startDate: event.date || event.startTime || '2027-01-20',
    endDate: event.endTime || '2027-01-21',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: venueDisplay,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Chimanbhai Patel Institute Campus, SG Highway',
        addressLocality: 'Ahmedabad',
        postalCode: '380015',
        addressRegion: 'GJ',
        addressCountry: 'IN',
      },
    },
    image: imgSrc ? [imgSrc] : [],
    description: event.longDescription || event.description,
    organizer: {
      '@type': 'Organization',
      name: 'TECH KURUKSHETRA',
      url: 'https://www.techkurukshetra.in',
    },
    offers: {
      '@type': 'Offer',
      price: typeof event.entryFee === 'number' ? String(event.entryFee) : '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `https://www.techkurukshetra.in/register?event=${event.slug}`,
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.techkurukshetra.in' },
      { '@type': 'ListItem', position: 2, name: 'Arenas', item: 'https://www.techkurukshetra.in/arenas' },
      { '@type': 'ListItem', position: 3, name: event.name, item: `https://www.techkurukshetra.in/arenas/${event.slug}` },
    ],
  };

  return (
    <>
      <Script
        id="event-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="pt-32 pb-40 px-6 max-w-5xl mx-auto min-h-screen text-tk-text">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...EASE_OUT, delay: 0.1 }}
        >
          <Link
            href="/arenas"
            className="inline-flex items-center gap-2 text-tk-text-muted hover:text-tk-accent transition-colors mb-12 font-headline text-xs tracking-widest uppercase group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Arenas
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left: Metadata card */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
          >
            {imgSrc && (
              <motion.div
                variants={FADE_UP}
                className="relative aspect-square overflow-hidden border border-tk-border rounded-none shadow-2xl bg-tk-bg-surface"
              >
                <Image
                  src={imgSrc}
                  alt={event.name}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tk-bg via-transparent to-transparent opacity-60" />
              </motion.div>
            )}

            <motion.div variants={FADE_UP} className="p-6 border border-tk-border bg-tk-bg-surface space-y-4">
              <div className="flex items-center gap-3 text-tk-text-muted text-sm">
                <Calendar className="w-4 h-4 text-tk-accent flex-shrink-0" />
                <span className="uppercase tracking-widest font-headline text-[10px]">
                  {formatDate(event.date || event.startTime)}
                </span>
              </div>

              {event.time && (
                <div className="flex items-center gap-3 text-tk-text-muted text-sm">
                  <Clock className="w-4 h-4 text-tk-accent flex-shrink-0" />
                  <span className="uppercase tracking-widest font-headline text-[10px]">{event.time}</span>
                </div>
              )}

              <div className="flex items-center gap-3 text-tk-text-muted text-sm">
                <MapPin className="w-4 h-4 text-tk-accent flex-shrink-0" />
                <span className="uppercase tracking-widest font-headline text-[10px]">{venueDisplay}</span>
              </div>

              <div className="flex items-center gap-3 text-tk-text-muted text-sm">
                <Tag className="w-4 h-4 text-tk-accent flex-shrink-0" />
                <span className="uppercase tracking-widest font-headline text-[10px]">Fee: {feeDisplay}</span>
              </div>

              {teamSizeDisplay && (
                <div className="flex items-center gap-3 text-tk-text-muted text-sm">
                  <Users className="w-4 h-4 text-tk-accent flex-shrink-0" />
                  <span className="uppercase tracking-widest font-headline text-[10px]">
                    Team Size: {teamSizeDisplay}
                  </span>
                </div>
              )}

              {event.difficulty && (
                <div className="flex items-center gap-3 text-tk-text-muted text-sm">
                  <Trophy className="w-4 h-4 text-tk-accent flex-shrink-0" />
                  <span className="uppercase tracking-widest font-headline text-[10px]">
                    Level: {event.difficulty}
                  </span>
                </div>
              )}
            </motion.div>

            {contact && (typeof contact === 'object' ? contact.name : contact) && (
              <motion.div variants={FADE_UP} className="p-6 border border-tk-border bg-tk-bg-surface space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-tk-accent">
                  Arena Coordinator
                </div>
                <div className="flex items-center gap-2 text-sm text-tk-text font-medium">
                  <User className="w-4 h-4 text-tk-accent" />
                  <span>{typeof contact === 'object' ? contact.name : contact}</span>
                </div>
                {typeof contact === 'object' && contact.phone && (
                  <div className="flex items-center gap-2 text-xs text-tk-text-muted">
                    <Phone className="w-3.5 h-3.5 text-tk-text-dim" />
                    <a href={`tel:${contact.phone}`} className="hover:text-tk-accent transition-colors">
                      {contact.phone}
                    </a>
                  </div>
                )}
                {typeof contact === 'object' && contact.email && (
                  <div className="flex items-center gap-2 text-xs text-tk-text-muted">
                    <Mail className="w-3.5 h-3.5 text-tk-text-dim" />
                    <a href={`mailto:${contact.email}`} className="hover:text-tk-accent transition-colors">
                      {contact.email}
                    </a>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Right: details */}
          <motion.div
            className="lg:col-span-3 space-y-10"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
          >
            <motion.div variants={FADE_UP}>
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-tk-accent/20 text-tk-accent border-none rounded-none font-headline text-[10px] tracking-[0.2em] uppercase px-4 py-1">
                  {event.category || (event.isTechnical ? 'TECH' : 'NON-TECH')}
                </Badge>
                {event.type && (
                  <Badge className="bg-white/5 text-tk-text-muted border border-tk-border rounded-none font-headline text-[10px] tracking-[0.2em] uppercase px-3 py-1">
                    {event.type}
                  </Badge>
                )}
              </div>
              <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl tracking-tighter text-tk-text mb-6 uppercase">
                {event.name}
              </h1>

              {/* AEO / GEO Direct Answer Summary Sentence */}
              <p className="text-xs text-tk-text-muted/90 font-mono border-l-2 border-tk-accent/60 pl-3 py-1 bg-tk-accent/5">
                {event.name} is a {event.duration || '24h'} {event.type || 'team'} competition in the {event.category || (event.isTechnical ? 'TECH' : 'NON-TECH')} arena category at Tech Kurukshetra 2027, taking place at {venueDisplay}. Participation is {feeDisplay}.
              </p>
            </motion.div>

            <motion.div variants={FADE_UP} className="space-y-4">
              <h2 className="font-headline text-xl text-tk-accent tracking-widest uppercase flex items-center gap-3">
                <ShieldCheck className="w-5 h-5" /> Mission Overview
              </h2>
              <p className="text-tk-text-muted leading-relaxed">{event.longDescription || event.description}</p>
            </motion.div>

            {event.rules && Array.isArray(event.rules) && event.rules.length > 0 && (
              <motion.div variants={FADE_UP} className="space-y-6">
                <h2 className="font-headline text-xl text-tk-accent tracking-widest uppercase flex items-center gap-3">
                  <ListChecks className="w-5 h-5" /> Rules &amp; Guidelines
                </h2>
                <div className="p-6 border border-tk-border bg-tk-bg-surface rounded-none">
                  <ul className="space-y-4">
                    {event.rules.map((rule: string, idx: number) => (
                      <li key={idx} className="text-sm text-tk-text-muted flex items-start gap-3">
                        <span className="text-tk-accent font-bold mt-0.5">◈</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            <motion.div variants={FADE_UP} className="pt-6">
              <Button
                asChild
                size="lg"
                className="bg-tk-accent hover:bg-tk-accent-dim text-tk-bg px-12 py-8 font-headline tracking-widest text-lg rounded-none w-full md:w-auto font-black uppercase"
              >
                <Link href={`/register?event=${event.slug}`}>INITIALIZE REGISTRATION</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
