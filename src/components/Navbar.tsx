'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Mountain, Sun, Moon, LogIn, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';

type NavLink = {
  name: string;
  href: string;
  sectionId: string;
};

// Streamlined, clean, spacious nav structure
const navLinks: NavLink[] = [
  { name: 'Beranda', href: '/', sectionId: 'top' },
  { name: 'Wisata', href: '/#wisata', sectionId: 'wisata' },
  { name: 'UMKM', href: '/#umkm', sectionId: 'umkm' },
  { name: 'Berita', href: '/#berita', sectionId: 'berita' },
  { name: 'Informasi', href: '/#informasi', sectionId: 'informasi' },
  { name: 'Galeri', href: '/#galeri', sectionId: 'galeri' },
  { name: 'FAQ', href: '/#faq', sectionId: 'faq' },
];

export const Navbar: React.FC = () => {
  const { theme, toggleTheme, user, logout, openAuthModal, mounted } = useApp();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('top');

  // ── Scrolled header state ───────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Scroll-Spy: track active section ────────────────────────
  useEffect(() => {
    if (pathname !== '/') return;

    const sectionIds = ['wisata', 'umkm', 'berita', 'informasi', 'rute', 'galeri', 'faq'];

    const update = () => {
      const threshold = window.scrollY + 180;
      let current = 'top';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && threshold >= el.offsetTop - 120) {
          // Map sub-sections back to main nav items for active highlight
          if (id === 'rute') {
            current = 'informasi';
          } else {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [pathname]);

  const isActive = (link: NavLink): boolean => {
    if (link.name === 'Berita' && pathname.startsWith('/berita')) return true;
    if (pathname === '/') return activeSection === link.sectionId;
    return false;
  };

  const handleNavClick = (link: NavLink) => {
    if (pathname === '/' || link.href.startsWith('/#')) {
      setActiveSection(link.sectionId);
    }
    setMobileMenuOpen(false);
  };

  const noFocus: React.CSSProperties = {
    outline: 'none',
    outlineWidth: 0,
    boxShadow: 'none',
    WebkitTapHighlightColor: 'transparent',
  };

  const isSolidHeader = scrolled || pathname !== '/';

  return (
    <header
      style={{ willChange: 'background-color, padding' }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out ${
        isSolidHeader
          ? 'bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/60 py-3 shadow-xs'
          : 'bg-gradient-to-b from-black/80 via-black/30 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* ── Brand ─────────────────────────────── */}
        <Link
          href="/"
          onClick={() => handleNavClick(navLinks[0])}
          style={noFocus}
          className="flex items-center gap-2.5 group outline-none focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-300">
            <Mountain className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span
              className={`font-extrabold text-base sm:text-lg tracking-tight transition-colors duration-300 group-hover:text-emerald-500 ${
                isSolidHeader ? 'text-zinc-900 dark:text-white' : 'text-white'
              }`}
            >
              Bukit Punjabu
            </span>
            <span className="text-[9px] tracking-widest uppercase font-bold text-emerald-600 dark:text-emerald-400 leading-none">
              Desa Buntu Buangin
            </span>
          </div>
        </Link>

        {/* ── Desktop Nav Links (Clean, Spacious Layout) ──────────────────────── */}
        <nav className="hidden md:flex items-center gap-3 lg:gap-5 xl:gap-6">
          {navLinks.map((link) => {
            const active = isActive(link);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => handleNavClick(link)}
                style={noFocus}
                className={`relative py-1 text-xs sm:text-sm font-semibold select-none outline-none focus:outline-none transition-colors duration-300 ease-out ${
                  active
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                    : isSolidHeader
                    ? 'text-zinc-700 hover:text-emerald-600 dark:text-zinc-300 dark:hover:text-emerald-400'
                    : 'text-zinc-200 hover:text-white'
                }`}
              >
                {link.name}
                <span
                  style={{
                    transformOrigin: 'center',
                    transition: 'transform 0.3s ease, opacity 0.3s ease',
                    transform: active ? 'scaleX(1)' : 'scaleX(0)',
                    opacity: active ? 1 : 0,
                  }}
                  className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                    isSolidHeader ? 'bg-emerald-600 dark:bg-emerald-400' : 'bg-emerald-400'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* ── Right Actions ──────────────────────── */}
        <div className="hidden md:flex items-center gap-3">
          {/* Quick Booking Button (Nonaktif Sementara) */}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={noFocus}
            className={`p-2 rounded-xl outline-none focus:outline-none transition-colors duration-300 ${
              isSolidHeader
                ? 'text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                : 'text-zinc-200 hover:text-white hover:bg-white/10'
            }`}
            title={mounted ? (theme === 'dark' ? 'Mode Terang' : 'Mode Gelap') : 'Beralih Mode Tampilan'}
            aria-label="Beralih Mode Tampilan"
          >
            {mounted ? (
              theme === 'dark'
                ? <Sun className="w-4 h-4 text-amber-400" />
                : <Moon className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            ) : (
              <div className="w-4 h-4" />
            )}
          </button>

          {/* User / Auth */}
          {mounted && user ? (
            <div className="flex items-center gap-2">
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  style={noFocus}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs rounded-xl transition"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Admin
                </Link>
              )}
              <div className={`flex items-center gap-2 pl-2 border-l ${isSolidHeader ? 'border-zinc-200 dark:border-zinc-800' : 'border-white/20'}`}>
                {user.avatar ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-emerald-500/40 shadow-xs shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=059669&color=fff`;
                    }}
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className={`text-xs font-semibold max-w-[130px] sm:max-w-[160px] truncate ${isSolidHeader ? 'text-zinc-800 dark:text-zinc-200' : 'text-white'}`}>
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  style={noFocus}
                  className={`p-1.5 rounded-lg transition ${
                    isSolidHeader
                      ? 'text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
                      : 'text-zinc-300 hover:text-red-400 hover:bg-white/10'
                  }`}
                  title="Keluar"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              style={noFocus}
              className={`flex items-center gap-1.5 px-3.5 py-2 font-semibold text-xs rounded-xl transition border cursor-pointer ${
                isSolidHeader
                  ? 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 border-transparent shadow-sm'
                  : 'bg-zinc-800/80 hover:bg-zinc-700 text-white border-white/10'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-zinc-300" />
              Masuk
            </button>
          )}
        </div>

        {/* ── Mobile Controls ────────────────────── */}
        <div className="flex md:hidden items-center gap-2">

          <button
            onClick={toggleTheme}
            style={noFocus}
            title={mounted ? (theme === 'dark' ? 'Mode Terang' : 'Mode Gelap') : 'Beralih Mode Tampilan'}
            aria-label="Beralih Mode Tampilan"
            className={`p-2 rounded-xl outline-none focus:outline-none ${
              isSolidHeader
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                : 'bg-black/40 text-white border border-white/20'
            }`}
          >
            {mounted ? (
              theme === 'dark'
                ? <Sun className="w-4 h-4 text-amber-400" />
                : <Moon className="w-4 h-4" />
            ) : (
              <div className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={noFocus}
            className={`p-2 rounded-xl outline-none focus:outline-none ${
              isSolidHeader
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                : 'bg-black/40 text-white border border-white/20'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ─────────────────────────── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-4 pt-3 pb-6 space-y-2 mt-3 shadow-xl animate-fade-in">
          {navLinks.map((link) => {
            const active = isActive(link);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => handleNavClick(link)}
                style={noFocus}
                className={`block px-4 py-2.5 text-sm font-semibold rounded-xl transition ${
                  active
                    ? 'bg-emerald-600 text-white'
                    : 'text-zinc-800 dark:text-zinc-200 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2">

            {mounted && user ? (
              <div className="flex items-center justify-between p-3 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80">
                <div className="flex items-center gap-3">
                  {user.avatar ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border border-emerald-500/50 shadow-xs shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=059669&color=fff`;
                      }}
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 capitalize truncate">
                      {user.role === 'admin' ? 'Administrator' : 'Pengunjung'} {user.email ? `• ${user.email}` : ''}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition"
                      title="Dashboard Admin"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-xs font-bold transition"
                    title="Keluar"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); openAuthModal(); }}
                style={noFocus}
                className="w-full py-2.5 bg-zinc-800 text-white font-semibold rounded-xl flex items-center justify-center gap-2 text-xs"
              >
                <LogIn className="w-4 h-4" />
                Masuk / Daftar
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
