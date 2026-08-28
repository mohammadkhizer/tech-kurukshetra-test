'use client';

import Image from 'next/image';
import { useFetch } from '@/hooks/use-fetch';
import { decodeHtmlEntities } from '@/lib/sanitizer';

function LogoCard({ sponsor }: { sponsor: any }) {
  const logoUrl = sponsor.logoUrl ? decodeHtmlEntities(sponsor.logoUrl) : null;

  return (
    <div className="group flex-shrink-0 flex items-center justify-center px-4" style={{ height: '80px' }}>
      <div
        className="flex items-center justify-center w-full h-full transition-all duration-300 cursor-pointer"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,107,0,0.15)',
          borderRadius: '8px',
          padding: '16px 24px',
          minWidth: '150px',
          transition: 'transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.transform = 'translateY(-3px)';
          el.style.boxShadow = '0 0 20px rgba(255,107,0,0.25)';
          el.style.borderColor = 'rgba(255,107,0,0.5)';
        }}
        onMouseLeave={(e) => {
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
            loading="lazy"
            unoptimized
            className="h-8 sm:h-9 w-auto object-contain transition-all duration-300"
            style={{
              filter: 'grayscale(1) brightness(1.2)',
              opacity: 0.7,
            }}
            onMouseEnter={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              img.style.filter = 'grayscale(0) brightness(1)';
              img.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              img.style.filter = 'grayscale(1) brightness(1.2)';
              img.style.opacity = '0.7';
            }}
          />
        ) : (
          <span
            className="text-xs font-headline tracking-widest uppercase text-center leading-tight transition-colors duration-300 font-bold"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            {sponsor.name}
          </span>
        )}
      </div>
    </div>
  );
}

function MarqueeRow({ sponsors, direction }: { sponsors: any[]; direction: 'left' | 'right' }) {
  const track = [...sponsors, ...sponsors, ...sponsors];

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={(e) => {
        (e.currentTarget.firstChild as HTMLElement).style.animationPlayState = 'paused';
      }}
      onMouseLeave={(e) => {
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
  const { data: rawData, isLoading } = useFetch<any>('/api/sponsors');

  const sponsorsList = Array.isArray(rawData)
    ? rawData
    : rawData?.data && Array.isArray(rawData.data)
    ? rawData.data
    : [];

  if (isLoading) {
    return (
      <div className="py-8 text-center text-xs text-[#8A8A8A] tracking-[0.2em] uppercase animate-pulse">
        Loading sponsors...
      </div>
    );
  }

  // Marked TODO: Empty state when database has no sponsors added via admin CMS
  if (sponsorsList.length === 0) {
    return (
      <div className="relative select-none py-8 text-center">
        <div
          aria-hidden
          style={{ height: '1px', background: 'linear-gradient(to right, transparent, #FF6B00, transparent)', marginBottom: '24px' }}
        />
        {/* TODO: Add sponsors via the admin dashboard CMS (/admin/dashboard) */}
        <p className="text-xs text-[#8A8A8A] tracking-[0.25em] uppercase">Sponsors managed via Admin CMS</p>
        <div
          aria-hidden
          style={{ height: '1px', background: 'linear-gradient(to right, transparent, #FF6B00, transparent)', marginTop: '24px' }}
        />
      </div>
    );
  }

  const half = Math.ceil(sponsorsList.length / 2);
  const row1 = sponsorsList.slice(0, half);
  const row2 = sponsorsList.slice(half).length > 0 ? sponsorsList.slice(half) : sponsorsList;

  return (
    <div className="relative select-none">
      <div
        aria-hidden
        style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, #FF6B00, transparent)',
          marginBottom: '32px',
        }}
      />

      <div
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <MarqueeRow sponsors={row1} direction="left" />
        <MarqueeRow sponsors={row2} direction="right" />
      </div>

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
