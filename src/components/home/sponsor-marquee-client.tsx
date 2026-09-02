'use client';

import dynamic from 'next/dynamic';
import { LazyViewport } from '@/components/common/lazy-viewport';

function SponsorMarqueeSkeleton() {
  return (
    <div className="relative flex flex-col justify-center gap-5 py-6 animate-pulse overflow-hidden">
      <div className="h-[1px] bg-[#FF6B00]/30 w-full mb-2" />
      {[0, 1].map((row) => (
        <div key={row} className="flex gap-5 overflow-hidden px-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="shrink-0 bg-white/[0.03] border border-[#FF6B00]/10 rounded-lg"
              style={{ width: '210px', height: '145px' }}
            />
          ))}
        </div>
      ))}
      <div className="h-[1px] bg-[#FF6B00]/30 w-full mt-2" />
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

