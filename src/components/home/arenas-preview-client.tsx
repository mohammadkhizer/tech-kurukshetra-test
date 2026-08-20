'use client';

import dynamic from 'next/dynamic';

const ArenasPreview = dynamic(
  () => import('@/components/home/arenas-preview').then((mod) => mod.ArenasPreview),
  { ssr: false }
);

export function ArenasPreviewClient() {
  return <ArenasPreview />;
}
