import { buildPageMeta } from '@/lib/seo';

export const metadata = buildPageMeta({
  title: 'Register Now | TECH KURUKSHETRA 2027',
  description:
    'Register for free at Tech Kurukshetra 2027. Choose your arena, fill in team details, and secure your spot at UCPIT, Ahmedabad, January 2027.',
  path: '/register',
});

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
