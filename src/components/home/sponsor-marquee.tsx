'use client';

import Image from 'next/image';
import { useFetch } from '@/hooks/use-fetch';

export function SponsorMarquee() {
  const { data: sponsors } = useFetch<any[]>('/api/sponsors');
  if (!sponsors || sponsors.length === 0) return null;
  const track = [...sponsors, ...sponsors];

  return (
    <div className="relative overflow-hidden select-none">
      <div className="flex gap-16 w-max animate-[marquee_30s_linear_infinite]">
        {track.map((sponsor, i) => (
          <div
            key={`${sponsor.id || i}-${i}`}
            className="flex items-center justify-center px-6 py-3 border border-white/5 min-w-[140px] text-[#8A8A8A] hover:text-[#F1F1F1] hover:border-[#FF6B00]/40 text-xs tracking-[0.25em] font-semibold uppercase transition-colors duration-300 cursor-pointer"
          >
            {sponsor.logoUrl ? (
              <Image
                src={sponsor.logoUrl}
                alt={sponsor.name}
                width={120}
                height={32}
                unoptimized
                className="h-8 w-auto object-contain"
              />
            ) : (
              <span>{sponsor.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
