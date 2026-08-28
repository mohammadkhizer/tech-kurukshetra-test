'use client';

import dynamic from 'next/dynamic';
import { LazyViewport } from '@/components/common/lazy-viewport';

function AboutSkeleton() {
  return (
    <section className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 border-t border-white/5 min-h-[450px] w-full">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center animate-pulse">
        <div className="lg:col-span-5 xl:col-span-4 space-y-4 w-full">
          <div className="h-4 w-20 bg-white/10" />
          <div className="h-10 w-3/4 bg-white/10" />
          <div className="h-20 w-full bg-white/5" />
        </div>
        <div className="lg:col-span-7 xl:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-white/5 p-6 h-48 bg-white/[0.01]" />
          ))}
        </div>
      </div>
    </section>
  );
}

const AboutSectionDynamic = dynamic(
  () => import('@/components/home/about-section').then((mod) => mod.AboutSection),
  {
    ssr: false,
    loading: () => <AboutSkeleton />,
  }
);

export function AboutSectionClient() {
  return (
    <LazyViewport minHeight="450px" fallback={<AboutSkeleton />}>
      <AboutSectionDynamic />
    </LazyViewport>
  );
}
