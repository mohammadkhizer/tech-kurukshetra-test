'use client';

import dynamic from 'next/dynamic';
import { LazyViewport } from '@/components/common/lazy-viewport';

function ArenasPreviewSkeleton() {
  return (
    <div className="max-w-6xl mx-auto min-h-[500px]">
      <div className="mb-16 space-y-3 animate-pulse">
        <div className="h-4 w-32 bg-white/10" />
        <div className="h-12 w-64 bg-white/10" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border border-white/5 bg-white/[0.02] p-6 h-80 flex flex-col justify-between">
            <div className="w-10 h-10 bg-white/10 mb-4" />
            <div className="h-6 bg-white/10 w-3/4 mb-2" />
            <div className="h-4 bg-white/5 w-full mb-2" />
            <div className="h-4 bg-white/5 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

const ArenasPreviewDynamic = dynamic(
  () => import('@/components/home/arenas-preview').then((mod) => mod.ArenasPreview),
  {
    ssr: false,
    loading: () => <ArenasPreviewSkeleton />,
  }
);

export function ArenasPreviewClient() {
  return (
    <LazyViewport minHeight="500px" fallback={<ArenasPreviewSkeleton />}>
      <ArenasPreviewDynamic />
    </LazyViewport>
  );
}

