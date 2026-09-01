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
    <div className="bg-tk-bg text-tk-text w-full overflow-x-hidden min-h-screen">
      {/* ═══════════════════════════════════
          1. HERO
          Gradient rule: ONE radial glow behind headline only.
          Low opacity (0.22) → premium, not loud.
      ═══════════════════════════════════ */}
      <section
        className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 pt-16 pb-12"
        style={{ background: 'var(--tk-grad-hero)' }}
      >
        {/* Particle canvas */}
        <GridCanvasClient />

        {/* Vignette — pulls gradient back to bg at edges */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{ background: 'radial-gradient(ellipse at center, transparent 30%, var(--tk-bg) 85%)' }}
        />

        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto gap-6 sm:gap-7 w-full px-2 sm:px-0">
          {/* Eyebrow chip */}
          <div
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 border px-2.5 sm:px-4 py-1.5 text-[9px] sm:text-xs tracking-[0.15em] sm:tracking-[0.3em] uppercase font-bold max-w-full text-center flex-wrap"
            style={{
              borderColor: 'var(--tk-accent-border)',
              background: 'var(--tk-accent-subtle)',
              color: 'var(--tk-accent)',
              boxShadow: '0 0 14px var(--tk-accent-glow)',
            }}
          >
            <Zap size={12} style={{ fill: 'var(--tk-accent)' }} className="animate-pulse flex-shrink-0" />
            <span>SVGU AHMEDABAD · UCPIT · JAN 2027</span>
          </div>

          {/* Main title */}
          <h1 className="text-3xl min-[390px]:text-4xl min-[430px]:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter font-headline select-none max-w-full break-words">
            <GlitchText text="TECH" className="text-tk-text" />
            <br />
            <GlitchText text="KURUKSHETRA" className="text-tk-accent" />
          </h1>

          {/* Tagline */}
          <p className="text-xs sm:text-base md:text-lg text-tk-text-muted tracking-[0.12em] sm:tracking-[0.15em] uppercase max-w-lg font-bold">
            The Battlefield for India's Brightest Minds
          </p>

          {/* Countdown */}
          <div className="my-2 max-w-full flex justify-center">
            <Countdown />
          </div>

          {/* CTAs */}
          <div className="w-full mt-2 flex justify-center">
            <HeroCTA />
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-[2]"
          style={{ background: 'linear-gradient(to top, var(--tk-bg), transparent)' }}
        />
      </section>

      {/* 1px gradient divider */}
      <div className="tk-divider" />

      {/* ═══════════════════════════════════
          2. STATS — solid surface bg, no gradient
      ═══════════════════════════════════ */}
      <div className="bg-tk-bg-surface">
        <StatsSection />
      </div>

      {/* 1px gradient divider */}
      <div className="tk-divider" />

      {/* ═══════════════════════════════════
          3. ARENAS PREVIEW — solid bg, hover-only card glow
      ═══════════════════════════════════ */}
      <section id="arenas" className="py-20 sm:py-28 px-4 sm:px-6 bg-tk-bg">
        <ArenasPreviewClient />
      </section>

      {/* 1px gradient divider */}
      <div className="tk-divider" />

      {/* ═══════════════════════════════════
          4. ABOUT / MISSION
      ═══════════════════════════════════ */}
      <AboutSectionClient />

      {/* 1px gradient divider */}
      <div className="tk-divider" />

      {/* ═══════════════════════════════════
          5. SPONSOR MARQUEE — surface bg
      ═══════════════════════════════════ */}
      <section className="py-20 bg-tk-bg-surface">
        <div className="max-w-6xl mx-auto px-6 mb-10 text-center">
          <div className="text-xs tracking-[0.3em] uppercase mb-2 font-bold" style={{ color: 'var(--tk-accent)' }}>
            ◈ SPONSORS &amp; PARTNERS
          </div>
          <h2 className="font-headline text-xl sm:text-2xl font-black tracking-widest text-tk-text uppercase">
            Backed by the Best
          </h2>
        </div>
        <SponsorMarqueeClient />
      </section>
    </div>
  );
}
