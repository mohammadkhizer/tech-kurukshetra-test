import { buildPageMeta } from '@/lib/seo';

export const metadata = buildPageMeta({
  title: 'Announcements | TECH KURUKSHETRA 2027',
  description:
    'Official announcements, schedule updates, and deadline alerts for Tech Kurukshetra 2027.',
  path: '/announcements',
});

export default function AnnouncementsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
