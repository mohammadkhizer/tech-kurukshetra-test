'use client';

import { useEffect, useRef, useState } from 'react';

export function GridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleMouseLeave = () => {
      setMousePos(null);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (container) {
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number | null = null;
    let isVisible = true;
    let isTabActive = !document.hidden;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle system: delicate ambient data dust / floating embers
    const particleCount = Math.min(45, Math.floor(window.innerWidth / 35));
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      maxLife: number;
      color: string;
    }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.15 - Math.random() * 0.35, // gentle upward drift
        size: Math.random() * 1.6 + 0.6,
        life: Math.random() * 250,
        maxLife: 200 + Math.random() * 150,
        color: Math.random() > 0.4 ? 'rgba(255, 140, 50,' : 'rgba(255, 210, 140,',
      });
    }

    const draw = () => {
      if (!isVisible || !isTabActive) {
        rafId = null;
        return;
      }

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.clearRect(0, 0, width, height);

      // Draw subtle ambient particles
      particles.forEach((p) => {
        p.life++;
        if (p.life > p.maxLife) {
          p.x = Math.random() * width;
          p.y = height + 10;
          p.life = 0;
        }
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around horizontally
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        const progress = p.life / p.maxLife;
        const alpha = Math.sin(progress * Math.PI) * 0.55;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${alpha})`;
        ctx.fill();

        // Soft outer glow for slightly larger particles
        if (p.size > 1.3) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${alpha * 0.2})`;
          ctx.fill();
        }
      });

      rafId = requestAnimationFrame(draw);
    };

    const startLoop = () => {
      if (!rafId && isVisible && isTabActive) {
        rafId = requestAnimationFrame(draw);
      }
    };

    const stopLoop = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisible = entry.isIntersecting;
        if (isVisible) startLoop();
        else stopLoop();
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
      if (isTabActive && isVisible) startLoop();
      else stopLoop();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    startLoop();

    return () => {
      stopLoop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Base Smooth Light Grid (Crisp 1px lines with generous smooth radial fade) */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 75% 65% at 50% 45%, #000 25%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 45%, #000 25%, transparent 80%)',
        }}
      />

      {/* 2. Brand warm light grid accent layer (subtle glowing warmth in the center) */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 122, 47, 0.10) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 122, 47, 0.10) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 55% 50% at 50% 40%, #000 15%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 55% 50% at 50% 40%, #000 15%, transparent 70%)',
        }}
      />

      {/* 3. Smooth ambient central light aura behind hero headline */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] h-[450px] sm:h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 122, 47, 0.14) 0%, rgba(255, 90, 20, 0.04) 45%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* 4. Interactive Smooth Mouse Light Spotlight */}
      {mousePos && (
        <div
          className="absolute pointer-events-none transition-opacity duration-300"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            width: '460px',
            height: '460px',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(255, 140, 50, 0.18) 0%, rgba(255, 122, 47, 0.07) 40%, transparent 70%)',
            filter: 'blur(25px)',
          }}
        />
      )}

      {/* 5. Delicate ambient floating particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
