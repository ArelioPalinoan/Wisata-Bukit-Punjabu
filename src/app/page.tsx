'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { FAQS, TRAVEL_ROUTES, VISITOR_GUIDELINES } from '@/data/initialData';
import { NewsCard } from '@/components/NewsCard';
import { ScrollReveal } from '@/components/ScrollReveal';
import { WeatherWidget } from '@/components/WeatherWidget';
import { GallerySection } from '@/components/GalleryLightbox';
import { ReviewModal } from '@/components/ReviewModal';

import {
  Compass,
  MapPin,
  Ticket,
  Sparkles,
  ArrowRight,
  Coffee,
  Tent,
  CheckCircle2,
  Users,
  ShieldCheck,
  Zap,
  Navigation,
  ChevronDown,
  Star,
  Quote,
  Clock,
  ExternalLink,
  HelpCircle,
  BookOpen,
  ShieldAlert,
  Sunrise,
  Backpack,
  HeartPulse,
  PenSquare,
} from 'lucide-react';


export default function Home() {
  const { newsList, tourismSpots, reviews, user, openAuthModal } = useApp();
  const [openFaqId, setOpenFaqId] = useState<string | null>('f1');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroParallax, setHeroParallax] = useState(0);


  // Subtle parallax on hero bg
  useEffect(() => {
    const onScroll = () => setHeroParallax(window.scrollY * 0.25);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const published = newsList.filter((n) => !n.status || n.status.toLowerCase() === 'published');
  const recentNews = (published.length > 0 ? published : newsList).slice(0, 3);

  const noFocusStyle: React.CSSProperties = {
    outline: 'none',
    boxShadow: 'none',
    WebkitTapHighlightColor: 'transparent',
  };

  return (
    <div className="space-y-28 pb-24">

      {/* ══════════════════════════════════════════════
          HERO SECTION (id="top")
      ══════════════════════════════════════════════ */}
      <section id="top" className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-20" ref={heroRef}>
        {/* Parallax Background & Ambient Light Orbs */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/heroimage.jpg"
            alt="Bukit Punjabu Sidrap Landscape"
            fill
            priority
            className="object-cover brightness-60 dark:brightness-50"
            style={{ transform: `translateY(${heroParallax}px)`, willChange: 'transform' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-black/50" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(16,185,129,0.15) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Glowing Ambient Light Orbs */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none animate-orb-float" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none animate-orb-float animate-delay-300" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white space-y-8 py-12">
          {/* Location Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold backdrop-blur-md animate-fade-in animate-delay-100">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Sparkles className="w-4 h-4 text-emerald-400 animate-float" />
            <span>Desa Buntu Buangin, Kec. Pitu Riase, Kab. Sidrap • 527 mdpl</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight sm:leading-none animate-fade-in animate-delay-200">
            Pesona Alam &amp; Samudera Awan <br />
            <span className="shimmer-text">
              Wisata Bukit Punjabu Sidrap
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-xl text-zinc-300 font-normal leading-relaxed animate-fade-in animate-delay-300">
            Portal informasi, reservasi tiket &amp; media resmi Wisata Bukit Punjabu (Puncak Jambu-Jambu), Desa Buntu Buangin, Kecamatan Pitu Riase, Kabupaten Sidenreng Rappang (Sidrap), Sulawesi Selatan.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 animate-fade-in animate-delay-400">
            <a
              href="#wisata"
              style={{ outline: 'none' }}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-base cursor-pointer hover:shadow-emerald-500/50"
            >
              <Compass className="w-5 h-5 text-emerald-200" />
              Jelajahi Wisata Punjabu
            </a>
            <a
              href="#berita"
              style={{ outline: 'none' }}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold rounded-2xl border border-white/25 backdrop-blur-md transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-base"
            >
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Portal Berita Desa
            </a>
          </div>

          {/* Stats Bar Real Sidrap Data */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto animate-fade-in animate-delay-500">
            {[
              { val: '527 m', label: 'Ketinggian mdpl', color: 'text-emerald-400' },
              { val: '4.9 ★', label: 'Rating Wisatawan', color: 'text-amber-400' },
              { val: '300 Besar', label: 'ADWI Kemenparekraf', color: 'text-teal-400' },
              { val: 'Juara 2', label: 'LPDWN Kemendes', color: 'text-emerald-400' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glow-card p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/70 backdrop-blur-md text-center hover:border-emerald-500/50 hover:bg-zinc-900/90 transition-all duration-300 group"
              >
                <p className={`text-xl sm:text-2xl font-extrabold ${stat.color} group-hover:scale-105 transition-transform duration-300 inline-block`}>
                  {stat.val}
                </p>
                <p className="text-xs text-zinc-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 animate-float opacity-80">
          <span className="text-[10px] text-zinc-400 tracking-widest uppercase font-semibold">Scroll</span>
          <div className="w-4 h-7 rounded-full border-2 border-zinc-400/60 flex items-start justify-center p-1">
            <div className="w-1 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PRAKIRAAN CUACA & AWAN (527 mdpl)
      ══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 relative z-20">
        <ScrollReveal>
          <WeatherWidget />
        </ScrollReveal>
      </section>



      {/* ══════════════════════════════════════════════
          1. PESONA WISATA (id="wisata")
      ══════════════════════════════════════════════ */}
      <section id="wisata" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 scroll-mt-24">
        <ScrollReveal className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Daya Tarik Unggulan Sidrap
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Pesona Khas Bukit Punjabu
          </p>
          <p className="text-zinc-600 dark:text-zinc-400 text-base">
            Objek wisata alam unggulan Desa Buntu Buangin, Kecamatan Pitu Riase, Kabupaten Sidrap yang menyuguhkan samudera awan, gardu pandang, dan camping ground ramah keluarga.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tourismSpots.map((spot, i) => (
            <ScrollReveal
              key={spot.id}
              delay={i * 0.08}
              className="group rounded-3xl bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/60 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-md hover:shadow-2xl hover-lift hover:border-emerald-500/50 transition-all duration-500 overflow-hidden flex flex-col"
            >
              <div className="relative h-60 overflow-hidden">
                <Image
                  src={spot.image}
                  alt={spot.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4 z-10 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                  {spot.badge}
                </div>
                <div className="absolute top-4 right-4 bg-zinc-950/70 backdrop-blur-md text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-400/30 flex items-center gap-1">
                  ★ {spot.rating}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    {spot.category}
                  </span>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                    {spot.title}
                  </h3>
                  <p className="text-zinc-700 dark:text-zinc-300 text-sm mt-2 leading-relaxed font-medium">
                    {spot.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" /> Pitu Riase, Sidrap
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">Buka Setiap Hari</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2. PANDUAN & ATURAN BERKUNJUNG (id="panduan")
      ══════════════════════════════════════════════ */}
      <section id="panduan" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-24">
        <ScrollReveal className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <BookOpen className="w-4 h-4" />
            <span>Panduan &amp; Safety Guide Wisatawan</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Panduan &amp; Etika Berkunjung
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-base">
            Persiapkan kunjungan Anda ke Bukit Punjabu (527 mdpl) agar perjalanan tetap aman, nyaman, dan ramah lingkungan.
          </p>
        </ScrollReveal>

        {/* Guidelines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {VISITOR_GUIDELINES.map((guide, i) => {
            const IconComp =
              guide.iconName === 'Backpack'
                ? Backpack
                : guide.iconName === 'ShieldAlert'
                ? ShieldAlert
                : guide.iconName === 'Sunrise'
                ? Sunrise
                : HeartPulse;

            return (
              <ScrollReveal
                key={guide.id}
                delay={i * 0.08}
                className="rounded-3xl bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800/80 p-6 sm:p-8 shadow-md hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400">
                      <IconComp className="w-6 h-6" />
                    </div>
                    {guide.badge && (
                      <span className={`text-[11px] font-bold text-white px-3 py-1 rounded-full ${guide.badgeColor || 'bg-emerald-600'}`}>
                        {guide.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      {guide.category}
                    </span>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-1">
                      {guide.title}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-2 leading-relaxed">
                      {guide.description}
                    </p>
                  </div>

                  <ul className="space-y-2.5 pt-2">
                    {guide.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                        <span className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>


      {/* ══════════════════════════════════════════════
          3. PORTAL BERITA DESA (id="berita")
      ══════════════════════════════════════════════ */}
      <section id="berita" className="bg-zinc-100/80 dark:bg-zinc-900/40 py-24 border-y border-zinc-200/80 dark:border-zinc-800/60 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Portal Berita Desa Buntu Buangin
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">
                Kabar &amp; Informasi Terkini Sidrap
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-xl">
                Dapatkan pembaharuan berita terkini seputar pengembangan objek wisata, kegiatan Pokdarwis, dan kabar masyarakat Desa Buntu Buangin Kecamatan Pitu Riase.
              </p>
            </div>
            <Link
              href="/berita"
              style={{ outline: 'none' }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-sm font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:scale-105 self-start md:self-auto"
            >
              Lihat Semua Berita
              <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentNews.map((article, i) => (
              <ScrollReveal
                key={article.id}
                delay={i * 0.12}
                className="h-full"
              >
                <NewsCard article={article} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          4. TIKET & LOKASI (id="informasi")
      ══════════════════════════════════════════════ */}
      <section id="informasi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-14 items-center scroll-mt-24">
        <ScrollReveal variant="left" className="lg:col-span-6 space-y-7">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <Ticket className="w-4 h-4" />
            <span>Retribusi Resmi Pokdarwis Punjabu</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white leading-tight">
            Harga Tiket &amp; Jam Operasional Wisata
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
            Tarif retribusi Wisata Bukit Punjabu Desa Buntu Buangin Kecamatan Pitu Riase Kabupaten Sidrap dikelola secara transparan oleh Pokdarwis setempat demi kenyamanan pengunjung.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {[
              { label: 'Tiket Masuk Reguler', price: 'Rp 10.000', sub: '/ orang', desc: 'Termasuk akses gardu pandang & spot foto.', color: 'text-emerald-700 dark:text-emerald-400' },
              { label: 'Tiket Camping Night',  price: 'Rp 20.000', sub: '/ orang', desc: 'Termasuk area tenda, MCK malam & penerangan.', color: 'text-amber-600 dark:text-amber-400' },
            ].map((t) => (
              <div key={t.label} className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/60 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-emerald-500/40 transition-all duration-300">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t.label}</span>
                <p className={`text-2xl font-extrabold ${t.color} mt-1`}>
                  {t.price} <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">{t.sub}</span>
                </p>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-2 font-medium">{t.desc}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            {[
              { bold: 'Lokasi Wisata:', text: 'Desa Buntu Buangin, Kec. Pitu Riase, Kab. Sidrap, Sulawesi Selatan' },
              { bold: 'Jam Masuk Harian:', text: '05.00 - 18.00 WITA (Buka Setiap Hari)' },
              { bold: 'Akses Camping Ground:', text: '24 Jam dengan izin petugas Pokdarwis Punjabu' },
              { bold: 'Tarif Parkir:', text: 'Motor Rp 3.000 | Mobil Rp 5.000' },
            ].map((item) => (
              <div key={item.bold} className="flex items-center gap-3 text-sm text-zinc-800 dark:text-zinc-200 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong className="font-bold text-zinc-900 dark:text-white">{item.bold}</strong> {item.text}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal variant="right" className="lg:col-span-6 bg-gradient-to-br from-emerald-100/90 via-white to-teal-100/80 dark:from-emerald-950/80 dark:via-zinc-900 dark:to-zinc-950 p-8 rounded-3xl border border-emerald-500/40 text-zinc-900 dark:text-white shadow-2xl space-y-6 hover:border-emerald-500/60 transition-colors duration-500">
          <h3 className="text-2xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
            <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Fasilitas Pengunjung Bukit Punjabu
          </h3>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
            Pokdarwis Desa Buntu Buangin menyediakan fasilitas penunjang kenyamanan para wisatawan di puncak bukit:
          </p>

          <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
            {[
              { icon: <Coffee className="w-5 h-5 text-amber-600 dark:text-amber-400" />, label: 'Warung Kuliner Khas Lokal' },
              { icon: <Tent className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />, label: 'Sewa Tenda & Alat Camping' },
              { icon: <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />, label: 'Fasilitas MCK & Sumber Air' },
              { icon: <Zap className="w-5 h-5 text-amber-500 dark:text-yellow-400" />, label: 'Spot Charger & Gazebo Santai' },
            ].map((f) => (
              <div
                key={f.label}
                className="p-4 rounded-xl bg-white/90 dark:bg-zinc-900/80 border border-emerald-500/20 dark:border-zinc-800 hover:border-emerald-500/40 text-zinc-900 dark:text-white flex items-center gap-3 transition-all duration-300 hover:-translate-y-0.5 cursor-default shadow-xs"
              >
                {f.icon}
                <span className="font-bold">{f.label}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ══════════════════════════════════════════════
          5. PANDUAN RUTE & AKSES (id="rute")
      ══════════════════════════════════════════════ */}
      <section id="rute" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-24">
        <ScrollReveal className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <Navigation className="w-4 h-4" />
            <span>Petunjuk Akses Perjalanan</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Panduan Rute ke Bukit Punjabu Sidrap
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-base">
            Informasi estimasi waktu dan kondisi jalan dari kota-kota utama Sulawesi Selatan menuju Desa Buntu Buangin, Kecamatan Pitu Riase.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRAVEL_ROUTES.map((route, i) => (
            <ScrollReveal
              key={route.from}
              delay={i * 0.1}
              className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/60 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-md hover:shadow-xl hover-lift hover:border-emerald-500/40 transition-all duration-300 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Dari {route.from}
                </span>
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">{route.distance}</span>
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {route.duration}
                </span>
              </div>

              <div className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300 font-medium border-t border-zinc-200/80 dark:border-zinc-800 pt-3">
                <p><strong className="font-bold text-zinc-900 dark:text-white">Kondisi Jalan:</strong> {route.roadCondition}</p>
                <p><strong className="font-bold text-zinc-900 dark:text-white">Rekomendasi:</strong> {route.vehicleAdvice}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="text-center">
          <a
            href="https://www.google.com/maps/search/?api=1&query=-3.7381,120.0072"
            target="_blank"
            rel="noopener noreferrer"
            style={noFocusStyle}
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/30 transition-all duration-300 hover:scale-105 text-sm"
          >
            <Navigation className="w-4 h-4" />
            Buka Navigasi Google Maps Langsung
            <ExternalLink className="w-4 h-4" />
          </a>
        </ScrollReveal>
      </section>

      {/* ══════════════════════════════════════════════
          6. GALERI FOTO (id="galeri") - Interactive Component
      ══════════════════════════════════════════════ */}
      <GallerySection />

      {/* ══════════════════════════════════════════════
          7. ULASAN WISATAWAN
      ══════════════════════════════════════════════ */}
      <section className="bg-zinc-100/60 dark:bg-zinc-900/40 py-20 border-y border-zinc-200/80 dark:border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <ScrollReveal className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                Kesan &amp; Pengalaman Pengunjung
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">
                Ulasan Asli Wisatawan
              </h2>
            </div>
            <button
              onClick={() => {
                if (!user) {
                  openAuthModal();
                } else {
                  setIsReviewModalOpen(true);
                }
              }}
              style={noFocusStyle}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition transform hover:-translate-y-0.5 cursor-pointer shrink-0"
            >
              <PenSquare className="w-4 h-4" />
              <span>Tulis Ulasan &amp; Rating</span>
            </button>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev, i) => (
              <ScrollReveal
                key={rev.id}
                delay={i * 0.1}
                className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50/70 via-white to-zinc-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-4 flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500 text-sm">
                      {[...Array(rev.rating)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-emerald-600/30 dark:text-emerald-500/30" />
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 italic leading-relaxed font-medium">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-zinc-200/80 dark:border-zinc-800">
                  <Image src={rev.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.name)}&background=059669&color=fff`} alt={rev.name} width={40} height={40} unoptimized className="w-10 h-10 rounded-full object-cover border border-emerald-500/30" />
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{rev.name}</h4>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">{rev.origin} • {rev.spot}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          8. PERTANYAAN UMUM / FAQ (id="faq")
      ══════════════════════════════════════════════ */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-24">
        <ScrollReveal className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
            <HelpCircle className="w-4 h-4" />
            <span>Pertanyaan Sering Diajukan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">
            FAQ Wisata Bukit Punjabu Sidrap
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">
            Temukan jawaban lengkap atas hal-hal yang sering ditanyakan para calon pengunjung.
          </p>
        </ScrollReveal>

        <ScrollReveal className="space-y-4">
          {FAQS.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-gradient-to-r from-emerald-50/60 via-white to-teal-50/40 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs transition hover:border-emerald-500/40"
              >
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  style={noFocusStyle}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-zinc-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed border-t border-zinc-200/80 dark:border-zinc-800/60 pt-3 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </ScrollReveal>
      </section>

      {/* Review Modal for Logged-In Users */}
      <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} />

    </div>
  );
}


