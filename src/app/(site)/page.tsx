import { Zap } from 'lucide-react';
import { Countdown } from '@/components/home/countdown';
import { HeroCTA } from '@/components/home/hero-cta';
import { GridCanvasClient } from '@/components/home/grid-canvas-client';
import { StatsSection } from '@/components/home/stats-section';
import { ArenasPreviewClient } from '@/components/home/arenas-preview-client';
import { AboutSectionClient } from '@/components/home/about-section-client';
import { SponsorMarqueeClient } from '@/components/home/sponsor-marquee-client';

function GlitchText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`glitch-text relative ${className ?? ''}`} data-text={text}>
      {text}
    </span>
  );
}

export default function Home() {
  return (
    <div className="bg-[#0A0A0F] text-[#F1F1F1] w-full overflow-x-hidden min-h-screen">
      {/* ═══════════════════════════════════
          1. HERO
      ═══════════════════════════════════ */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 pt-16 pb-12">
        {/* Custom Battlefield / Particle Graphic */}
        <GridCanvasClient />

        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#0A0A0F_100%)] pointer-events-none z-[1]" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto gap-7">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 border border-[#FF6B00]/40 bg-[#FF6B00]/10 px-4 py-1.5 text-[10px] sm:text-xs text-[#FF6B00] tracking-[0.3em] uppercase font-bold shadow-[0_0_15px_rgba(255,107,0,0.15)]">
            <Zap size={12} className="fill-[#FF6B00] animate-pulse" />
            SVGU AHMEDABAD · UCPIT · JAN 2027
          </div>

          {/* Glitch Flicker Main Title */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter font-headline select-none">
            <GlitchText text="TECH" className="text-[#F1F1F1]" />
            <br />
            <GlitchText text="KURUKSHETRA" className="text-[#FF6B00]" />
          </h1>

          {/* Tagline */}
          <p className="text-sm sm:text-base md:text-lg text-[#8A8A8A] tracking-[0.15em] uppercase max-w-lg font-bold">
            The Battlefield for India's Brightest Minds
          </p>

          {/* Live Countdown to Event Date */}
          <div className="my-2">
            <Countdown />
          </div>

          {/* Dual CTA: ENTER THE ARENA / VIEW ARENAS */}
          <div className="w-full mt-2">
            <HeroCTA />
          </div>
        </div>

        {/* Bottom Fade Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0A0A0F] to-transparent pointer-events-none z-[2]" />
      </section>

      {/* ═══════════════════════════════════
          2. ANIMATED COUNT-UP STATS (CREDIBILITY)
          Automatically hidden if data unavailable
      ═══════════════════════════════════ */}
      <StatsSection />

      {/* ═══════════════════════════════════
          3. ARENAS PREVIEW GRID (4 CARDS)
      ═══════════════════════════════════ */}
      <section id="arenas" className="py-20 sm:py-28 px-4 sm:px-6">
        <ArenasPreviewClient />
      </section>

      {/* ═══════════════════════════════════
          4. ABOUT / MISSION (3-COLUMN CARDS)
      ═══════════════════════════════════ */}
      <AboutSectionClient />

      {/* ═══════════════════════════════════
          5. SPONSOR MARQUEE (INFINITE SCROLL)
      ═══════════════════════════════════ */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 mb-10 text-center">
          <div className="text-xs text-[#FF6B00] tracking-[0.3em] uppercase mb-2 font-bold">◈ SPONSORS &amp; PARTNERS</div>
          <h2 className="font-headline text-xl sm:text-2xl font-black tracking-widest text-white uppercase">Backed by the Best</h2>
        </div>
        <SponsorMarqueeClient />
      </section>
    </div>
  );
}
