'use client';

import dynamic from 'next/dynamic';

const GridCanvas = dynamic(
  () => import('@/components/home/grid-canvas').then((mod) => mod.GridCanvas),
  { ssr: false }
);

export function GridCanvasClient() {
  return <GridCanvas />;
}
