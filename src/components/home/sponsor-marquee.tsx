'use client';

import Image from 'next/image';
import { useFetch } from '@/hooks/use-fetch';
import { decodeHtmlEntities } from '@/lib/sanitizer';

/** One logo card with glass-panel styling and hover effects */
function LogoCard({ sponsor }: { sponsor: any }) {
  const logoUrl = sponsor.logoUrl ? decodeHtmlEntities(sponsor.logoUrl) : null;

  return (
    <div
      className="group flex-shrink-0 flex items-center justify-center px-6"
      style={{ height: '80px' }}
    >
      <div
        className="flex items-center justify-center w-full h-full transition-all duration-300 cursor-pointer"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,107,0,0.15)',
          borderRadius: '12px',
          padding: '24px',
          minWidth: '140px',
          boxShadow: '0 0 0 rgba(255,107,0,0)',
          transition: 'transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.transform = 'translateY(-4px)';
          el.style.boxShadow = '0 0 20px rgba(255,107,0,0.25)';
          el.style.borderColor = 'rgba(255,107,0,0.5)';
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.transform = 'translateY(0)';
          el.style.boxShadow = '0 0 0 rgba(255,107,0,0)';
          el.style.borderColor = 'rgba(255,107,0,0.15)';
        }}
      >
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={sponsor.name}
            width={120}
            height={40}
            unoptimized
            className="h-10 w-auto object-contain transition-all duration-300"
            style={{
              filter: 'grayscale(1)',
              opacity: 0.6,
            }}
            onMouseEnter={e => {
              const img = e.currentTarget as HTMLImageElement;
              img.style.filter = 'grayscale(0)';
              img.style.opacity = '1';
            }}
            onMouseLeave={e => {
              const img = e.currentTarget as HTMLImageElement;
              img.style.filter = 'grayscale(1)';
              img.style.opacity = '0.6';
            }}
          />
        ) : (
          <span
            className="text-[10px] font-headline tracking-widest uppercase text-center leading-tight transition-colors duration-300"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            {sponsor.name}
          </span>
        )}
      </div>
    </div>
  );
}

/** A single infinite-scroll row. direction: 'left' | 'right' */
function MarqueeRow({
  sponsors,
  direction,
}: {
  sponsors: any[];
  direction: 'left' | 'right';
}) {
  // Duplicate once for seamless loop — the keyframe translates exactly -50% (left) or returns from -50% (right)
  const track = [...sponsors, ...sponsors];

  return (
    <div
      className="overflow-hidden"
      style={{
        // pause the animation while the user hovers anywhere on the row
        ['--play-state' as any]: 'running',
      }}
      onMouseEnter={e => {
        (e.currentTarget.firstChild as HTMLElement).style.animationPlayState = 'paused';
      }}
      onMouseLeave={e => {
        (e.currentTarget.firstChild as HTMLElement).style.animationPlayState = 'running';
      }}
    >
      <div
        className={direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}
        style={{
          display: 'flex',
          width: 'max-content',
          gap: '16px',
          willChange: 'transform',
        }}
      >
        {track.map((sponsor, i) => (
          <LogoCard key={`${sponsor.id ?? sponsor.name}-${i}`} sponsor={sponsor} />
        ))}
      </div>
    </div>
  );
}

export function SponsorMarquee() {
  const { data: sponsors } = useFetch<any[]>('/api/sponsors');
  if (!sponsors || sponsors.length === 0) return null;

  return (
    <div className="relative select-none">
      {/* ── Amber gradient divider — top ── */}
      <div
        aria-hidden
        style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, #FF6B00, transparent)',
          marginBottom: '32px',
        }}
      />

      {/* ── Two-row marquee with edge-fade mask ── */}
      <div
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <MarqueeRow sponsors={sponsors} direction="left" />
        <MarqueeRow sponsors={sponsors} direction="right" />
      </div>

      {/* ── Amber gradient divider — bottom ── */}
      <div
        aria-hidden
        style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, #FF6B00, transparent)',
          marginTop: '32px',
        }}
      />
    </div>
  );
}
