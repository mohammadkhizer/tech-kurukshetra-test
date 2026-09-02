'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { name: 'About', path: '/#about' },
  { name: 'Arenas', path: '/arenas' },
  { name: 'Timeline', path: '/timeline' },
  { name: 'Announcements', path: '/announcements' },
  { name: 'Contact', path: '/contact' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-40 w-full border-b bg-[var(--tk-bg)]/80 backdrop-blur-xl"
        style={{ borderColor: 'var(--tk-border)' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-black tracking-tighter text-base font-headline hover:opacity-80 transition-opacity"
            style={{ color: 'var(--tk-accent)' }}
          >
            TK·<span className="text-tk-text">2027</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors duration-200 ${isActive
                      ? 'text-tk-accent font-bold border-b border-tk-accent pb-0.5'
                      : 'text-tk-text-muted hover:text-tk-text'
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <Link
              href="/register"
              className={`border text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 transition-all duration-200 active:scale-95 ${pathname === '/register'
                  ? 'bg-[var(--tk-accent)] text-[var(--tk-bg)] border-[var(--tk-accent)]'
                  : 'border-[var(--tk-accent)] text-[var(--tk-accent)] hover:bg-[var(--tk-accent)] hover:text-[var(--tk-bg)]'
                }`}
            >
              REGISTER
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-[#8A8A8A] hover:text-[#F1F1F1] transition-colors p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-14 left-0 right-0 z-30 border-b flex flex-col py-6 px-6 gap-5"
          style={{ background: 'var(--tk-bg)', borderColor: 'var(--tk-border)' }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setOpen(false)}
                className={`text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${isActive ? 'text-tk-accent font-bold' : 'text-tk-text-muted hover:text-tk-text'
                  }`}
              >
                {item.name}
              </Link>
            );
          })}
          <Link
            href="/register"
            onClick={() => setOpen(false)}
            className="border text-xs font-black uppercase tracking-[0.2em] px-5 py-3 text-center mt-2"
            style={{
              borderColor: 'var(--tk-accent)',
              color: pathname === '/register' ? 'var(--tk-bg)' : 'var(--tk-accent)',
              backgroundColor: pathname === '/register' ? 'var(--tk-accent)' : 'transparent',
            }}
          >
            REGISTER NOW
          </Link>
        </motion.div>
      )}
    </>
  );
}
