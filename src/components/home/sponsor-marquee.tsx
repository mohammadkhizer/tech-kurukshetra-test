'use client';

import { useState } from 'react';
import { useFetch } from '@/hooks/use-fetch';
import { decodeHtmlEntities } from '@/lib/sanitizer';
import { ExternalLink, ShieldCheck } from 'lucide-react';

function LogoCard({ sponsor }: { sponsor: any }) {
  const [imageError, setImageError] = useState(false);
  const logoUrl = sponsor.logoUrl ? decodeHtmlEntities(sponsor.logoUrl) : null;
  const rawWebsite = (sponsor.websiteUrl || '').trim();
  const websiteUrl = rawWebsite
    ? rawWebsite.startsWith('http://') || rawWebsite.startsWith('https://')
      ? rawWebsite
      : `https://${rawWebsite}`
    : '#';

  const categoryOrTier = sponsor.category || sponsor.tier || 'Official Partner';

  return (
    <a
      href={websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex-shrink-0 flex flex-col justify-between p-4 transition-all duration-300 rounded-lg cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
      style={{
        width: '210px',
        height: '145px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,107,0,0.2)',
        backdropFilter: 'blur(8px)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = 'rgba(255,107,0,0.6)';
        el.style.boxShadow = '0 0 20px rgba(255,107,0,0.25)';
        el.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = 'rgba(255,107,0,0.2)';
        el.style.boxShadow = 'none';
        el.style.transform = 'translateY(0)';
      }}
    >
      {/* Tier Badge & External Link Icon */}
      <div className="w-full flex items-center justify-between gap-1 text-[10px] uppercase font-headline font-bold text-gray-400">
        <span className="tracking-wider text-[#FF6B00] flex items-center gap-1">
          <ShieldCheck size={11} className="text-[#FF6B00]" />
          {categoryOrTier}
        </span>
        <ExternalLink
          size={12}
          className="text-gray-400 group-hover:text-[#FF6B00] transition-colors"
        />
      </div>

      {/* Enlarged Logo Container with Graceful Fallback */}
      <div className="w-full h-14 flex items-center justify-center my-1 relative overflow-hidden px-2">
        {logoUrl && !imageError ? (
          <img
            src={logoUrl}
            alt={sponsor.name}
            onError={() => setImageError(true)}
            className="max-h-12 w-auto max-w-[170px] object-contain transition-all duration-300 grayscale group-hover:grayscale-0 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full border border-[#FF6B00]/30 bg-[#FF6B00]/10 rounded flex items-center justify-center px-2">
            <span className="text-xs font-headline font-black text-[#FF6B00] tracking-widest uppercase text-center truncate">
              {sponsor.name}
            </span>
          </div>
        )}
      </div>

      {/* Sponsor Name Visible Text */}
      <div className="w-full pt-1 border-t border-white/5 text-center">
        <span className="text-xs font-headline font-bold uppercase tracking-wider text-gray-200 group-hover:text-[#FF6B00] transition-colors block truncate">
          {sponsor.name}
        </span>
      </div>
    </a>
  );
}

function MarqueeRow({ sponsors, direction }: { sponsors: any[]; direction: 'left' | 'right' }) {
  const track = [...sponsors, ...sponsors, ...sponsors];

  return (
    <div
      className="overflow-hidden w-full"
      onMouseEnter={(e) => {
        const target = e.currentTarget.firstChild as HTMLElement;
        if (target) target.style.animationPlayState = 'paused';
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget.firstChild as HTMLElement;
        if (target) target.style.animationPlayState = 'running';
      }}
    >
      <div
        className={direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}
        style={{
          display: 'flex',
          width: 'max-content',
          gap: '20px',
          willChange: 'transform',
        }}
      >
        {track.map((sponsor, i) => (
          <LogoCard key={`${sponsor.id ?? sponsor._id ?? sponsor.name}-${i}`} sponsor={sponsor} />
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
      <div className="py-12 text-center text-xs text-[#8A8A8A] tracking-[0.2em] uppercase animate-pulse">
        Loading sponsors & partners...
      </div>
    );
  }

  if (sponsorsList.length === 0) {
    return (
      <div className="relative select-none py-12 text-center">
        <div
          aria-hidden
          style={{ height: '1px', background: 'linear-gradient(to right, transparent, #FF6B00, transparent)', marginBottom: '24px' }}
        />
        <p className="text-xs text-[#8A8A8A] tracking-[0.25em] uppercase">No partners listed yet</p>
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
    <div className="relative select-none w-full max-w-full overflow-hidden">
      <div
        aria-hidden
        style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, #FF6B00, transparent)',
          marginBottom: '28px',
        }}
      />

      <div
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
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
          marginTop: '28px',
        }}
      />
    </div>
  );
}
