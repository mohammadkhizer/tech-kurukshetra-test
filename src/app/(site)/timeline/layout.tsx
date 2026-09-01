import { buildPageMeta } from '@/lib/seo';

export const metadata = buildPageMeta({
  title: 'Event Timeline | TECH KURUKSHETRA 2027',
  description:
    'Track all key milestones for Tech Kurukshetra 2027 — registration deadlines, event dates, and the grand finale schedule.',
  path: '/timeline',
});

export default function TimelineLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
