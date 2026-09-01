import { buildPageMeta } from '@/lib/seo';

export const metadata = buildPageMeta({
  title: 'Contact Us | TECH KURUKSHETRA 2027',
  description:
    'Get in touch with the Tech Kurukshetra organizing committee. Reach us for sponsorships, media, technical support, or general inquiries.',
  path: '/contact',
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
