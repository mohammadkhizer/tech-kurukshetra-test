'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy, Users, Swords, Building2 } from 'lucide-react';
import { useFetch } from '@/hooks/use-fetch';

const ICON_MAP: Record<string, any> = {
  Trophy,
  Users,
  Swords,
  Building2,
};

function CountUpItem({ item }: { item: any }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [currentVal, setCurrentVal] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const target = item.targetValue || 0;
    const duration = 2000;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCurrentVal(Math.floor(easeProgress * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, item.targetValue]);

  const IconComponent = ICON_MAP[item.iconName] || Trophy;

  const formatNumber = (num: number) => {
    if (item.prefix === '₹' && targetVal >= 100000) {
      const lakhs = (num / 100000).toFixed(2);
      return `₹${lakhs}L`;
    }
    return `${item.prefix || ''}${num.toLocaleString()}`;
  };

  const targetVal = item.targetValue || 0;

  return (
    <div
      ref={ref}
      className="group relative p-6 sm:p-8 flex flex-col justify-between transition-all duration-300"
      style={{
        border: '1px solid var(--tk-border)',
        background: 'var(--tk-bg)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--tk-border-accent)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 24px var(--tk-accent-glow)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--tk-border)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      <div className="flex items-center justify-between gap-4 mb-4">
        <div
          className="p-3"
          style={{
            background: 'var(--tk-accent-subtle)',
            border: '1px solid var(--tk-border-accent)',
            color: 'var(--tk-accent)',
          }}
        >
          <IconComponent size={24} strokeWidth={1.5} />
        </div>
        <div
          className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase"
          style={{ color: 'rgba(255,122,47,0.80)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ background: 'var(--tk-accent)' }} />
          <span>VERIFIED DATA</span>
        </div>
      </div>

      <div>
        <div
          className="text-3xl sm:text-4xl md:text-5xl font-black font-headline tracking-tight transition-colors tabular-nums text-tk-text group-hover:text-tk-accent"
        >
          {formatNumber(currentVal)}
          {item.suffix}
        </div>
        <div className="text-xs text-tk-text-muted tracking-[0.2em] uppercase font-bold mt-2">
          {item.label}
        </div>
      </div>
    </div>
  );
}

export function StatsSection() {
  const { data: res, isLoading, error } = useFetch<any>('/api/stats');

  if (error || (!isLoading && (!res || !res.success || !res.data || !Array.isArray(res.data) || res.data.length === 0))) {
    return null;
  }

  const items = res?.data ?? [];

  return (
    <section className="py-12 px-4 sm:px-6 relative z-10 max-w-6xl mx-auto">
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36" style={{ border: '1px solid var(--tk-border)', background: 'var(--tk-bg)' }} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {items.map((item: any) => (
            <CountUpItem key={item.id || item.label} item={item} />
          ))}
        </motion.div>
      )}
    </section>
  );
}
