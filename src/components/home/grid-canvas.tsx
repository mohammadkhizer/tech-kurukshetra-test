'use client';

import { useEffect, useRef } from 'react';

export function GridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number | null = null;
    let isVisible = true;
    let isTabActive = !document.hidden;

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
      if (!isVisible || !isTabActive) {
        rafId = null;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = 'rgba(255, 107, 0, 0.04)';
      ctx.lineWidth = 1;
      const gSize = 60;
      for (let x = 0; x < canvas.width; x += gSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Particles
      particles.forEach((p) => {
        p.life++;
        if (p.life > p.maxLife) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
          p.life = 0;
        }
        p.x += p.vx;
        p.y += p.vy;
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

    // IntersectionObserver to pause loop when canvas is scrolled off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // Tab visibility change listener
    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
      if (isTabActive && isVisible) {
        startLoop();
      } else {
        stopLoop();
      }
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

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}
