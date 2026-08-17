'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function HeroCTA() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 20 });
  const sy = useSpring(my, { stiffness: 200, damping: 20 });
  const ctaRef = useRef<HTMLDivElement>(null);

  const handleCTAMove = (e: React.MouseEvent) => {
    const rect = ctaRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left - rect.width / 2);
    my.set(e.clientY - rect.top - rect.height / 2);
  };

  const resetCTA = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      ref={ctaRef}
      onMouseMove={handleCTAMove}
      onMouseLeave={resetCTA}
      className="relative"
    >
      <motion.div style={{ x: sx, y: sy }}>
        <Link
          href="/register"
          className="group relative inline-flex items-center gap-3 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-[#0A0A0F] font-black uppercase tracking-[0.2em] text-sm sm:text-base px-8 sm:px-12 py-4 sm:py-5 transition-all duration-200
            shadow-[0_0_0_0_rgba(255,107,0,0.4)]
            hover:shadow-[0_0_30px_8px_rgba(255,107,0,0.25)]
            active:scale-[0.97]"
        >
          ENTER THE ARENA
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </div>
  );
}
