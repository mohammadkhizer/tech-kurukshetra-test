import Link from 'next/link';
import { Zap } from 'lucide-react';
import { Countdown } from '@/components/home/countdown';
import { HeroCTA } from '@/components/home/hero-cta';
import { GridCanvasClient } from '@/components/home/grid-canvas-client';
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
    <div className="bg-[#0A0A0F] text-[#F1F1F1] w-full overflow-x-hidden">
      {/* ═══════════════════════════════════
          HERO
      ═══════════════════════════════════ */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6">
        <GridCanvasClient />

        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#0A0A0F_100%)] pointer-events-none z-[1]" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto gap-8">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 border border-[#FF6B00]/30 bg-[#FF6B00]/5 px-4 py-1.5 text-[10px] sm:text-xs text-[#FF6B00] tracking-[0.3em] uppercase">
            <Zap size={12} className="fill-[#FF6B00]" />
            SVGU AHMEDABAD · UCPIT · JAN 2027
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter font-headline">
            <GlitchText text="TECH" className="text-[#F1F1F1]" />
            <br />
            <GlitchText text="KURUKSHETRA" className="text-[#FF6B00]" />
          </h1>

          {/* Tagline */}
          <p className="text-sm sm:text-base md:text-lg text-[#8A8A8A] tracking-[0.15em] uppercase max-w-lg">
            The Battlefield for India's Brightest Minds
          </p>

          {/* Countdown */}
          <div>
            <Countdown />
          </div>

          {/* CTA */}
          <HeroCTA />

          {/* Secondary CTA */}
          <div>
            <Link
              href="/arenas"
              className="text-xs text-[#8A8A8A] hover:text-[#F1F1F1] tracking-[0.2em] uppercase transition-colors border-b border-transparent hover:border-[#8A8A8A] pb-0.5"
            >
              EXPLORE ARENAS →
            </Link>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0F] to-transparent pointer-events-none z-[2]" />
      </section>

      {/* ═══════════════════════════════════
          ARENAS PREVIEW
      ═══════════════════════════════════ */}
      <section id="arenas" className="py-24 sm:py-32 px-4 sm:px-6">
        <ArenasPreviewClient />
      </section>

      {/* ═══════════════════════════════════
          ABOUT
      ═══════════════════════════════════ */}
      <AboutSectionClient />

      {/* ═══════════════════════════════════
          SPONSORS MARQUEE
      ═══════════════════════════════════ */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 mb-10 text-center">
          <div className="text-xs text-[#8A8A8A] tracking-[0.3em] uppercase mb-2">◈ SPONSORS &amp; PARTNERS</div>
          <h2 className="font-headline text-lg tracking-widest text-white/80 uppercase">Backed by the Best</h2>
        </div>
        <SponsorMarqueeClient />
      </section>
    </div>
  );
}
