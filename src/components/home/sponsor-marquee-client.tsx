'use client';

import dynamic from 'next/dynamic';

const SponsorMarquee = dynamic(
  () => import('@/components/home/sponsor-marquee').then((mod) => mod.SponsorMarquee),
  { ssr: false }
);

export function SponsorMarqueeClient() {
  return <SponsorMarquee />;
}
