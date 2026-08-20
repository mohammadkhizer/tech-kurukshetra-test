import Link from 'next/link';
import { ArrowRight, Lightbulb, Users, Trophy, Zap } from 'lucide-react';
import { Countdown } from '@/components/home/countdown';
import { HeroCTA } from '@/components/home/hero-cta';
import { GridCanvasClient } from '@/components/home/grid-canvas-client';
import { ArenasPreviewClient } from '@/components/home/arenas-preview-client';
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
      <section id="about" className="py-24 sm:py-32 px-4 sm:px-6 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,107,0,0.06)_0%,transparent_65%)] pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="text-xs text-[#FF6B00] tracking-[0.3em] uppercase">◈ ABOUT</div>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tighter font-headline leading-[0.95]">
                THE BATTLEFIELD<br />
                <span className="text-[#8A8A8A] font-light italic text-3xl">AWAITS.</span>
              </h2>
              <p className="text-[#8A8A8A] text-sm sm:text-base leading-relaxed mt-4">
                TECH KURUKSHETRA is not a festival — it's a war. A two-day immersive battlefield
                hosted at UCPIT, SVGU Ahmedabad, where India's sharpest technical minds collide
                to compete, build, and leave a mark. Only the bold survive.
              </p>
              <div className="mt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-xs text-[#FF6B00] tracking-[0.2em] uppercase border-b border-[#FF6B00]/40 hover:border-[#FF6B00] pb-0.5 transition-colors"
                >
                  READ THE LEGEND <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Lightbulb, label: 'Innovation', desc: 'Workshops and challenges that push technical boundaries.' },
                { icon: Users, label: 'Collaboration', desc: 'Network with 1,000+ engineers, designers, and mentors.' },
                { icon: Trophy, label: 'Competition', desc: 'High-stakes arenas. Real prizes. Real glory.' },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="group flex flex-col gap-4 border border-white/5 p-6 hover:border-[#FF6B00]/30 transition-colors duration-300"
                >
                  <Icon strokeWidth={1.5} size={28} className="text-[#FF6B00]" />
                  <div className="text-sm font-black uppercase tracking-[0.1em] font-headline">{label}</div>
                  <p className="text-xs text-[#8A8A8A] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
