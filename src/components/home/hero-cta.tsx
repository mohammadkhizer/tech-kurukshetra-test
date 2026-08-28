'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Compass } from 'lucide-react';

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
      className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-lg mx-auto"
    >


      {/* Secondary CTA: VIEW ARENAS */}
      <Link
        href="/arenas"
        className="group relative inline-flex items-center justify-center gap-2.5 w-full sm:w-auto bg-[#0A0A0F]/90 hover:bg-[#FF6B00]/10 text-[#F1F1F1] hover:text-[#FF6B00] border border-white/20 hover:border-[#FF6B00]/60 font-bold uppercase tracking-[0.2em] text-sm sm:text-base px-8 sm:px-10 py-4 sm:py-5 transition-all duration-200 active:scale-[0.97] backdrop-blur-sm"
      >
        <Compass size={18} className="text-[#FF6B00]/80 group-hover:text-[#FF6B00] transition-colors" />
        VIEW ARENAS
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1 opacity-70 group-hover:opacity-100" />
      </Link>
    </div>
  );
}
