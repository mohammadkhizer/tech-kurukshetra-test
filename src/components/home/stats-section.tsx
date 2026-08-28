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
      // Ease out cubic
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
      className="group relative border border-white/10 hover:border-[#FF6B00]/40 bg-white/[0.02] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,107,0,0.12)]"
    >
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="p-3 bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-[#FF6B00]">
          <IconComponent size={24} strokeWidth={1.5} />
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-[#FF6B00]/80 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-ping" />
          <span>VERIFIED DATA</span>
        </div>
      </div>

      <div>
        <div className="text-3xl sm:text-4xl md:text-5xl font-black font-headline tracking-tight text-[#F1F1F1] group-hover:text-[#FF6B00] transition-colors tabular-nums">
          {formatNumber(currentVal)}
          {item.suffix}
        </div>
        <div className="text-xs text-[#8A8A8A] tracking-[0.2em] uppercase font-bold mt-2">
          {item.label}
        </div>
      </div>
    </div>
  );
}

export function StatsSection() {
  const { data: res, isLoading, error } = useFetch<any>('/api/stats');

  // Condition: Hide section if data is unavailable
  if (error || (!isLoading && (!res || !res.success || !res.data || !Array.isArray(res.data) || res.data.length === 0))) {
    return null;
  }

  const items = res?.data ?? [];

  return (
    <section className="py-12 px-4 sm:px-6 relative z-10 max-w-6xl mx-auto">
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 border border-white/5 bg-white/[0.02]" />
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
