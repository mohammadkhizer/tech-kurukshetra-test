'use client';

import dynamic from 'next/dynamic';
import { LazyViewport } from '@/components/common/lazy-viewport';

function SponsorMarqueeSkeleton() {
  return (
    <div className="relative min-h-[200px] flex flex-col justify-center gap-4 py-4 animate-pulse">
      <div className="h-[1px] bg-[#FF6B00]/30 w-full mb-4" />
      <div className="flex gap-4 overflow-hidden px-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-20 min-w-[140px] bg-white/[0.03] border border-[#FF6B00]/10 rounded-xl shrink-0" />
        ))}
      </div>
      <div className="h-[1px] bg-[#FF6B00]/30 w-full mt-4" />
    </div>
  );
}

const SponsorMarqueeDynamic = dynamic(
  () => import('@/components/home/sponsor-marquee').then((mod) => mod.SponsorMarquee),
  {
    ssr: false,
    loading: () => <SponsorMarqueeSkeleton />,
  }
);

export function SponsorMarqueeClient() {
  return (
    <LazyViewport minHeight="200px" fallback={<SponsorMarqueeSkeleton />}>
      <SponsorMarqueeDynamic />
    </LazyViewport>
  );
}

