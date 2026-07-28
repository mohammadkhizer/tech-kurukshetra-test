'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/check')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          router.replace('/admin/dashboard');
        } else {
          router.replace('/admin/auth');
        }
      })
      .catch(() => {
        router.replace('/admin/auth');
      });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F]">
      <Loader2 className="w-12 h-12 text-[#FF6B00] animate-spin" />
    </div>
  );
}
