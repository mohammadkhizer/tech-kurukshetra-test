import { buildPageMeta } from '@/lib/seo';

export const metadata = buildPageMeta({
  title: 'Event Arenas | TECH KURUKSHETRA 2027',
  description:
    'Explore 12 competitive arenas at Tech Kurukshetra 2027 — hackathon, code sprint, CTF, gaming, and non-tech events. Free entry for all students.',
  path: '/arenas',
});

export default function ArenasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
