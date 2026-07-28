'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Code2, Bot, Gamepad2, Brain, Lightbulb, Users, Trophy, Zap } from 'lucide-react';

/* ─────────────────────────────────────────────
   ANIMATION CONSTANTS
───────────────────────────────────────────── */
const EASE_OUT = { duration: 0.3, ease: 'easeOut' };
const STAGGER_PARENT = { transition: { staggerChildren: 0.08 } };
const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: EASE_OUT },
};

/* ─────────────────────────────────────────────
   GRID CANVAS BACKGROUND
───────────────────────────────────────────── */
function GridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        life: Math.random() * 200,
        maxLife: 200 + Math.random() * 100,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = 'rgba(255, 107, 0, 0.04)';
      ctx.lineWidth = 1;
      const gSize = 60;
      for (let x = 0; x < canvas.width; x += gSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Particles
      particles.forEach(p => {
        p.life++;
        if (p.life > p.maxLife) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
          p.life = 0;
        }
        p.x += p.vx; p.y += p.vy;
        const alpha = Math.sin((p.life / p.maxLife) * Math.PI) * 0.6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 107, 0, ${alpha})`;
        ctx.fill();
      });

      // Scan line
      const t = Date.now() * 0.001;
      const scanY = (Math.sin(t * 0.3) * 0.5 + 0.5) * canvas.height;
      const grad = ctx.createLinearGradient(0, scanY - 80, 0, scanY + 80);
      grad.addColorStop(0, 'rgba(255,107,0,0)');
      grad.addColorStop(0.5, 'rgba(255,107,0,0.03)');
      grad.addColorStop(1, 'rgba(255,107,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 80, canvas.width, 160);

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ─────────────────────────────────────────────
   GLITCH TEXT
───────────────────────────────────────────── */
function GlitchText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`glitch-text relative ${className ?? ''}`} data-text={text}>
      {text}
    </span>
  );
}

/* ─────────────────────────────────────────────
   COUNTDOWN TIMER
───────────────────────────────────────────── */
const EVENT_DATE = new Date('2027-01-15T09:00:00+05:30');

function Countdown() {
  const calc = useCallback(() => {
    const diff = Math.max(0, EVENT_DATE.getTime() - Date.now());
    return {
      days: Math.floor(diff / 86400000),
      hrs: Math.floor((diff % 86400000) / 3600000),
      mins: Math.floor((diff % 3600000) / 60000),
      secs: Math.floor((diff % 60000) / 1000),
    };
  }, []);

  // null = not yet mounted (prevents SSR/client mismatch)
  const [time, setTime] = useState<ReturnType<typeof calc> | null>(null);

  useEffect(() => {
    setTime(calc());
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, [calc]);

  const units = [
    { label: 'DAYS', value: time?.days ?? 0 },
    { label: 'HRS',  value: time?.hrs  ?? 0 },
    { label: 'MINS', value: time?.mins  ?? 0 },
    { label: 'SECS', value: time?.secs  ?? 0 },
  ];

  // Render skeleton boxes before mount to avoid layout shift
  if (!time) {
    return (
      <div className="flex items-center gap-3 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 sm:gap-4">
            <div className="bg-[#0A0A0F] border border-[#FF6B00]/30 px-3 sm:px-5 py-2 sm:py-3 min-w-[56px] sm:min-w-[72px] h-[56px] sm:h-[72px]" />
            {i < 3 && <span className="text-2xl sm:text-3xl text-[#FF6B00]/50 mb-4 select-none">:</span>}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {units.map(({ label, value }, i) => (
        <div key={label} className="flex items-center gap-3 sm:gap-4">
          <div className="flex flex-col items-center">
            <div className="bg-[#0A0A0F] border border-[#FF6B00]/30 px-3 sm:px-5 py-2 sm:py-3 min-w-[56px] sm:min-w-[72px] text-center">
              <span className="text-2xl sm:text-4xl font-black text-[#FF6B00] font-headline tabular-nums">
                {String(value).padStart(2, '0')}
              </span>
              <div className="text-[9px] sm:text-[10px] text-[#8A8A8A] tracking-[0.2em] mt-1">{label}</div>
            </div>
          </div>
          {i < units.length - 1 && (
            <span className="text-2xl sm:text-3xl font-black text-[#FF6B00]/50 mb-4 select-none">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   ANIMATED COUNT-UP
───────────────────────────────────────────── */
function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setDisplay(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>;
}

/* ─────────────────────────────────────────────
   ARENAS DATA
───────────────────────────────────────────── */
const ARENAS = [
  {
    icon: Code2,
    title: 'Hackathon',
    tagline: 'Build & Conquer',
    desc: '24-hour team sprint to build real-world solutions from scratch.',
    color: '#FF6B00',
    href: '/arenas',
  },
  {
    icon: Bot,
    title: 'Robotics',
    tagline: 'Metal & Code',
    desc: 'Design, build, and battle autonomous machines on the arena floor.',
    color: '#C81E1E',
    href: '/arenas',
  },
  {
    icon: Gamepad2,
    title: 'Esports',
    tagline: 'Frag or Be Fragged',
    desc: 'High-stakes gaming tournaments across multiple titles.',
    color: '#FF6B00',
    href: '/arenas',
  },
  {
    icon: Brain,
    title: 'Logic Quiz',
    tagline: 'Think. Fast. Win.',
    desc: 'Lightning-round aptitude and technical knowledge battles.',
    color: '#C81E1E',
    href: '/arenas',
  },
];

/* ─────────────────────────────────────────────
   SPONSORS (mark as placeholder — real logos needed)
───────────────────────────────────────────── */
const SPONSOR_PLACEHOLDERS = [
  'SPONSOR A', 'SPONSOR B', 'SPONSOR C', 'SPONSOR D', 'SPONSOR E',
  'SPONSOR F', 'SPONSOR G', 'SPONSOR H',
];

function SponsorMarquee() {
  const track = [...SPONSOR_PLACEHOLDERS, ...SPONSOR_PLACEHOLDERS];
  return (
    <div className="relative overflow-hidden select-none">
      <div className="flex gap-16 w-max animate-[marquee_30s_linear_infinite]">
        {track.map((name, i) => (
          <div
            key={i}
            className="flex items-center justify-center px-6 py-3 border border-white/5 min-w-[140px] text-[#8A8A8A] hover:text-[#F1F1F1] hover:border-[#FF6B00]/40 text-xs tracking-[0.25em] font-semibold uppercase transition-colors duration-300 cursor-pointer"
          >
            {/* PLACEHOLDER — replace with real <Image> logo */}
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function Home() {
  const heroData = null;
  const counterData = null;

  // CTA magnetic hover
  const mx = useMotionValue(0); const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 20 });
  const sy = useSpring(my, { stiffness: 200, damping: 20 });
  const ctaRef = useRef<HTMLDivElement>(null);
  const handleCTAMove = (e: React.MouseEvent) => {
    const rect = ctaRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left - rect.width / 2);
    my.set(e.clientY - rect.top - rect.height / 2);
  };
  const resetCTA = () => { mx.set(0); my.set(0); };

  // Stats from Firestore (only shown when real data is present)
  const statsConfig = [
    { label: 'Participants', key: 'participants', suffix: '+' },
    { label: 'Prize Pool', key: 'prizePool', prefix: '₹', suffix: '' },
    { label: 'Events', key: 'competitions', suffix: '+' },
  ];

  return (
    <div className="bg-[#0A0A0F] text-[#F1F1F1] w-full overflow-x-hidden">

      {/* ═══════════════════════════════════
          HERO
      ═══════════════════════════════════ */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6">
        <GridCanvas />

        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#0A0A0F_100%)] pointer-events-none z-[1]" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto gap-8">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...EASE_OUT, delay: 0.2 }}
            className="inline-flex items-center gap-2 border border-[#FF6B00]/30 bg-[#FF6B00]/5 px-4 py-1.5 text-[10px] sm:text-xs text-[#FF6B00] tracking-[0.3em] uppercase"
          >
            <Zap size={12} className="fill-[#FF6B00]" />
            SVGU AHMEDABAD · UCPIT · JAN 2027
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...EASE_OUT, delay: 0.35 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter font-headline"
          >
            <GlitchText text="TECH" className="text-[#F1F1F1]" />
            <br />
            <GlitchText text="KURUKSHETRA" className="text-[#FF6B00]" />
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...EASE_OUT, delay: 0.5 }}
            className="text-sm sm:text-base md:text-lg text-[#8A8A8A] tracking-[0.15em] uppercase max-w-lg"
          >
            {(heroData as any)?.subHeadline || 'The Battlefield for India\'s Brightest Minds'}
          </motion.p>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...EASE_OUT, delay: 0.65 }}
          >
            <Countdown />
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...EASE_OUT, delay: 0.8 }}
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
          </motion.div>

          {/* Secondary CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...EASE_OUT, delay: 1 }}
          >
            <Link
              href="/arenas"
              className="text-xs text-[#8A8A8A] hover:text-[#F1F1F1] tracking-[0.2em] uppercase transition-colors border-b border-transparent hover:border-[#8A8A8A] pb-0.5"
            >
              EXPLORE ARENAS →
            </Link>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0F] to-transparent pointer-events-none z-[2]" />
      </section>

      {/* ═══════════════════════════════════
          STATS STRIP (only when real data exists)
      ═══════════════════════════════════ */}
      {counterData && (
        <section className="border-y border-white/5 py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={{
                visible: { transition: { staggerChildren: 0.08 } },
              }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-6 text-center"
            >
              {statsConfig.map(({ label, key, suffix, prefix }) => {
                const raw = (counterData as any)?.[key];
                if (!raw) return null;
                const num = parseInt(String(raw).replace(/\D/g, ''), 10);
                if (!num) return null;
                return (
                  <motion.div key={key} variants={FADE_UP} className="flex flex-col gap-2">
                    <div className="text-4xl sm:text-5xl md:text-6xl font-black text-[#FF6B00] font-headline">
                      {prefix}<CountUp target={num} suffix={suffix} />
                    </div>
                    <div className="text-xs text-[#8A8A8A] uppercase tracking-[0.25em]">{label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════
          ARENAS PREVIEW
      ═══════════════════════════════════ */}
      <section id="arenas" className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="mb-16 flex flex-col gap-3"
          >
            <motion.div variants={FADE_UP} className="text-xs text-[#FF6B00] tracking-[0.3em] uppercase">
              ◈ BATTLEGROUNDS
            </motion.div>
            <motion.h2 variants={FADE_UP} className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter font-headline leading-[0.95]">
              CHOOSE YOUR<br />
              <span className="text-[#FF6B00]">ARENA</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {ARENAS.map(({ icon: Icon, title, tagline, desc, color, href }) => (
              <motion.div
                key={title}
                variants={FADE_UP}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative border border-white/5 bg-white/[0.02] p-6 cursor-pointer overflow-hidden"
                style={{ '--card-color': color } as React.CSSProperties}
              >
                {/* Glow edge on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 0 1px ${color}80`,
                    background: `radial-gradient(circle at top left, ${color}0a, transparent 60%)`,
                  }}
                />
                <div className="mb-6">
                  <Icon size={28} style={{ color }} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-black tracking-tight font-headline mb-1">{title}</h3>
                <div className="text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color }}>{tagline}</div>
                <p className="text-sm text-[#8A8A8A] leading-relaxed">{desc}</p>
                <Link
                  href={href}
                  className="mt-6 inline-flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase transition-colors"
                  style={{ color }}
                >
                  View Arena <ArrowRight size={12} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          ABOUT
      ═══════════════════════════════════ */}
      <section id="about" className="py-24 sm:py-32 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
              className="lg:col-span-5 flex flex-col gap-4"
            >
              <motion.div variants={FADE_UP} className="text-xs text-[#FF6B00] tracking-[0.3em] uppercase">◈ ABOUT</motion.div>
              <motion.h2 variants={FADE_UP} className="text-4xl sm:text-5xl font-black tracking-tighter font-headline leading-[0.95]">
                THE BATTLEFIELD<br />
                <span className="text-[#8A8A8A] font-light italic text-3xl">AWAITS.</span>
              </motion.h2>
              <motion.p variants={FADE_UP} className="text-[#8A8A8A] text-sm sm:text-base leading-relaxed mt-4">
                TECH KURUKSHETRA is not a festival — it's a war. A two-day immersive battlefield
                hosted at UCPIT, SVGU Ahmedabad, where India's sharpest technical minds collide
                to compete, build, and leave a mark. Only the bold survive.
              </motion.p>
              <motion.div variants={FADE_UP} className="mt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-xs text-[#FF6B00] tracking-[0.2em] uppercase border-b border-[#FF6B00]/40 hover:border-[#FF6B00] pb-0.5 transition-colors"
                >
                  READ THE LEGEND <ArrowRight size={12} />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
              className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {[
                { icon: Lightbulb, label: 'Innovation', desc: 'Workshops and challenges that push technical boundaries.' },
                { icon: Users, label: 'Collaboration', desc: 'Network with 1,000+ engineers, designers, and mentors.' },
                { icon: Trophy, label: 'Competition', desc: 'High-stakes arenas. Real prizes. Real glory.' },
              ].map(({ icon: Icon, label, desc }) => (
                <motion.div
                  key={label}
                  variants={FADE_UP}
                  className="group flex flex-col gap-4 border border-white/5 p-6 hover:border-[#FF6B00]/30 transition-colors duration-300"
                >
                  <Icon strokeWidth={1.5} size={28} className="text-[#FF6B00]" />
                  <div className="text-sm font-black uppercase tracking-[0.1em] font-headline">{label}</div>
                  <p className="text-xs text-[#8A8A8A] leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          SPONSORS MARQUEE
      ═══════════════════════════════════ */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 mb-10 flex flex-col gap-2">
          <div className="text-xs text-[#8A8A8A] tracking-[0.3em] uppercase">◈ SPONSORS & PARTNERS</div>
          <div className="text-[10px] text-white/20 italic">
            {/* Placeholder notice for developers */}
            [ PLACEHOLDER — Replace with real sponsor logos via &lt;Image&gt; components ]
          </div>
        </div>
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0A0A0F] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0A0A0F] to-transparent z-10 pointer-events-none" />
          <SponsorMarquee />
        </div>
      </section>

      {/* ═══════════════════════════════════
          FOOTER CTA BAND
      ═══════════════════════════════════ */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 border-t border-white/5">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8"
        >
          <motion.h2 variants={FADE_UP} className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter font-headline leading-[0.9]">
            YOUR BATTLE<br />
            <span className="text-[#C81E1E]">BEGINS NOW.</span>
          </motion.h2>
          <motion.p variants={FADE_UP} className="text-[#8A8A8A] max-w-md text-sm sm:text-base">
            Registration is open. Slots are limited. The arena doesn't wait.
          </motion.p>
          <motion.div variants={FADE_UP}>
            <Link
              href="/register"
              className="group inline-flex items-center gap-3 border-2 border-[#C81E1E] bg-[#C81E1E] hover:bg-transparent text-white font-black uppercase tracking-[0.2em] text-sm px-10 py-5 transition-all duration-200
                shadow-[0_0_0_0_rgba(200,30,30,0.4)]
                hover:shadow-[0_0_30px_8px_rgba(200,30,30,0.2)]
                active:scale-[0.97]"
            >
              REGISTER NOW <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════
          FOOTER
      ═══════════════════════════════════ */}
      <footer className="border-t border-white/5 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <div className="text-xl font-black text-[#FF6B00] font-headline tracking-tight">TK·2027</div>
            <p className="text-[11px] text-[#8A8A8A] leading-relaxed max-w-[200px]">
              The ultimate technology battleground. UCPIT · SVGU · Ahmedabad.
            </p>
          </div>
          {[
            {
              label: 'COMPETE',
              links: [
                { name: 'Arenas', href: '/arenas' },
                { name: 'Timeline', href: '/timeline' },
                { name: 'Register', href: '/register' },
              ],
            },
            {
              label: 'DISCOVER',
              links: [
                { name: 'Announcements', href: '/announcements' },
                { name: 'Team', href: '/team' },
                { name: 'Contact', href: '/contact' },
              ],
            },
            {
              label: 'FOLLOW',
              links: [
                { name: 'Instagram', href: '#' },
                { name: 'LinkedIn', href: '#' },
                { name: 'Twitter / X', href: '#' },
              ],
            },
          ].map(({ label, links }) => (
            <div key={label} className="flex flex-col gap-3">
              <div className="text-[9px] text-[#FF6B00] tracking-[0.3em] uppercase font-bold">{label}</div>
              {links.map(({ name, href }) => (
                <Link key={name} href={href} className="text-xs text-[#8A8A8A] hover:text-[#F1F1F1] transition-colors">
                  {name}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[10px] text-white/20 tracking-widest uppercase">
            © 2027 TECH KURUKSHETRA · UCPIT · SVGU AHMEDABAD
          </div>
          <div className="text-[10px] text-white/20 tracking-widest uppercase">
            BATTLE. BUILD. CONQUER.
          </div>
        </div>
      </footer>

    </div>
  );
}
