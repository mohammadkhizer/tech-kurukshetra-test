'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';

interface LazyViewportProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  minHeight?: string;
  className?: string;
}

export function LazyViewport({
  children,
  fallback,
  rootMargin = '200px 0px',
  minHeight = '200px',
  className = '',
}: LazyViewportProps) {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isInView) return;

    const element = containerRef.current;
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isInView, rootMargin]);

  return (
    <div ref={containerRef} className={className} style={{ minHeight: !isInView ? minHeight : undefined }}>
      {isInView ? children : (fallback || <div className="animate-pulse bg-white/[0.02] w-full h-full" style={{ minHeight }} />)}
    </div>
  );
}
