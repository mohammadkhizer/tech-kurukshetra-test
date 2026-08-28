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

    // Particle system simulating tactical data dust & energetic embers
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

    const particleCount = Math.min(60, Math.floor(window.innerWidth / 25));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5 - 0.1, // subtle upward drift
        size: Math.random() * 2 + 0.8,
        life: Math.random() * 250,
        maxLife: 200 + Math.random() * 150,
        color: Math.random() > 0.3 ? 'rgba(255, 107, 0,' : 'rgba(200, 30, 30,',
      });
    }

    const draw = () => {
      if (!isVisible || !isTabActive) {
        rafId = null;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;

      // Perspective cyber grid lines
      ctx.strokeStyle = 'rgba(255, 107, 0, 0.05)';
      ctx.lineWidth = 1;
      const gSize = 64;

      for (let x = 0; x < width; x += gSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += gSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw active particles
      particles.forEach((p) => {
        p.life++;
        if (p.life > p.maxLife) {
          p.x = Math.random() * width;
          p.y = Math.random() * height;
          p.life = 0;
        }
        p.x += p.vx;
        p.y += p.vy;

        const alpha = Math.sin((p.life / p.maxLife) * Math.PI) * 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${alpha})`;
        ctx.fill();

        // Glow ring around larger particles
        if (p.size > 1.8) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${alpha * 0.25})`;
          ctx.fill();
        }
      });

      // Animated laser scanning line
      const t = Date.now() * 0.0008;
      const scanY = (Math.sin(t) * 0.5 + 0.5) * height;
      const grad = ctx.createLinearGradient(0, scanY - 90, 0, scanY + 90);
      grad.addColorStop(0, 'rgba(255,107,0,0)');
      grad.addColorStop(0.5, 'rgba(255,107,0,0.04)');
      grad.addColorStop(1, 'rgba(255,107,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 90, width, 180);

      // Bright laser beam line
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.strokeStyle = 'rgba(255, 107, 0, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

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
        if (isVisible) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

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
