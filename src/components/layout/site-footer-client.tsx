'use client';

import dynamic from 'next/dynamic';
import { LazyViewport } from '@/components/common/lazy-viewport';

function FooterSkeleton() {
  return (
    <footer className="pt-20 pb-40 px-6 border-t border-primary/10 mt-20 bg-black/20 min-h-[300px] animate-pulse">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-6 w-36 bg-white/10" />
            <div className="h-4 w-48 bg-white/5" />
            <div className="h-4 w-32 bg-white/5" />
          </div>
        ))}
      </div>
    </footer>
  );
}

const SiteFooterDynamic = dynamic(
  () => import('@/components/layout/site-footer').then((mod) => mod.SiteFooter),
  {
    ssr: false,
    loading: () => <FooterSkeleton />,
  }
);

export function SiteFooterClient() {
  return (
    <LazyViewport minHeight="300px" fallback={<FooterSkeleton />}>
      <SiteFooterDynamic />
    </LazyViewport>
  );
}
