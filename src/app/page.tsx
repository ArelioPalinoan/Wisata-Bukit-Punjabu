'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { TOURISM_SPOTS, UMKM_PRODUCTS, FAQS, VISITOR_REVIEWS, TRAVEL_ROUTES } from '@/data/initialData';
import { NewsCard } from '@/components/NewsCard';
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
  ShoppingBag,
  Navigation,
  ChevronDown,
  Star,
  Quote,
  Clock,
  PhoneCall,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';

/** Attach IntersectionObserver to trigger .visible on .reveal / .reveal-left / .reveal-right elements. */
function useRevealOnScroll(newsLength: number) {
  useEffect(() => {
    const scanAndObserve = () => {
      const els = document.querySelectorAll('.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible)');
      if (!els.length) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.02 }
      );
      els.forEach((el) => observer.observe(el));
    };

    scanAndObserve();
    const timer = setTimeout(scanAndObserve, 80);
    return () => clearTimeout(timer);
  }, [newsLength]);
}

export default function Home() {
  const { newsList } = useApp();
  const [activeMediaModal, setActiveMediaModal] = useState<string | null>(null);
  const [openFaqId, setOpenFaqId] = useState<string | null>('f1');
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroParallax, setHeroParallax] = useState(0);
  useRevealOnScroll(newsList.length);

  // Subtle parallax on hero bg
  useEffect(() => {
    const onScroll = () => setHeroParallax(window.scrollY * 0.25);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const published = newsList.filter((n) => !n.status || n.status.toLowerCase() === 'published');
  const recentNews = (published.length > 0 ? published : newsList).slice(0, 3);

  const galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
      title: 'Sunrise Samudera Awan Sidrap',
      desc: 'Pesona fajar menyingsing di atas hamparan awan putih perbukitan Pitu Riase.',
    },
    {
      url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop',
      title: 'Suasana Camping Buntu Buangin',
      desc: 'Pengalaman berkemah sejuk ramah keluarga di lokasi Camping Ground Punjabu.',
    },
    {
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
      title: 'Gardu Pandang Skywalk 360°',
      desc: 'Sudut swafoto favorit wisatawan dengan panorama pegunungan Sidrap.',
    },
    {
      url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1200&auto=format&fit=crop',
      title: 'Kopi Khas Punjabu Sidrap',
      desc: 'Cita rasa Kopi Robusta & Arabika hasil petik merah warga Desa Buntu Buangin.',
    },
  ];

  const handleOrderUmkm = (productName: string, price: number) => {
    const text = encodeURIComponent(`Halo UMKM Desa Buntu Buangin Sidrap! 👋\nSaya ingin memesan produk: *${productName}* (Rp ${price.toLocaleString('id-ID')}).\nMohon informasi pemesanan & ketersediaannya. Terima kasih!`);
    window.open(`https://wa.me/6285255558910?text=${text}`, '_blank');
  };

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
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-20" ref={heroRef}>
        {/* Parallax Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1920&auto=format&fit=crop"
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
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white space-y-8 py-16">
          {/* Location Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold backdrop-blur-md animate-fade-in animate-delay-100">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-float" />
            <span>Desa Buntu Buangin, Kec. Pitu Riase, Kab. Sidrap • 850 mdpl</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight sm:leading-none animate-fade-in animate-delay-200">
            Pesona Alam &amp; Samudera Awan <br />
            <span className="shimmer-text">
              Wisata Bukit Punjabu Sidrap
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-xl text-zinc-300 font-normal leading-relaxed animate-fade-in animate-delay-300">
            Portal informasi, reservasi tiket &amp; media resmi Wisata Bukit Punjabu, Desa Buntu Buangin, Kecamatan Pitu Riase, Kabupaten Sidenreng Rappang (Sidrap), Sulawesi Selatan.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 animate-fade-in animate-delay-400">
            <a
              href="#wisata"
              style={{ outline: 'none' }}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-base cursor-pointer"
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
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto animate-fade-in animate-delay-500">
            {[
              { val: '850 m', label: 'Ketinggian mdpl', color: 'text-emerald-400' },
              { val: '4.9 ★', label: 'Rating Wisatawan', color: 'text-amber-400' },
              { val: '18.4K+', label: 'Pengunjung / Tahun', color: 'text-teal-400' },
              { val: 'Pokdarwis', label: 'Desa Buntu Buangin', color: 'text-emerald-400' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/70 backdrop-blur-md text-center hover:border-emerald-500/40 hover:bg-zinc-900/80 transition-all duration-300 group"
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
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-float">
          <span className="text-xs text-zinc-400 tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-8 rounded-full border-2 border-zinc-400/60 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          1. PESONA WISATA (id="wisata")
      ══════════════════════════════════════════════ */}
      <section id="wisata" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 scroll-mt-24">
        <div className="text-center space-y-4 max-w-3xl mx-auto reveal">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Daya Tarik Unggulan Sidrap
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Pesona Khas Bukit Punjabu
          </p>
          <p className="text-zinc-600 dark:text-zinc-400 text-base">
            Objek wisata alam unggulan Desa Buntu Buangin, Kecamatan Pitu Riase, Kabupaten Sidrap yang menyuguhkan samudera awan, gardu pandang, dan camping ground ramah keluarga.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TOURISM_SPOTS.map((spot, i) => (
            <div
              key={spot.id}
              className={`reveal group rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-md hover:shadow-2xl hover-lift transition-all duration-500 overflow-hidden flex flex-col`}
              style={{ animationDelay: `${i * 0.08}s` }}
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
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {spot.category}
                  </span>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-1 group-hover:text-emerald-500 transition-colors duration-300">
                    {spot.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-2 leading-relaxed">
                    {spot.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Pitu Riase, Sidrap
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Buka Setiap Hari</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2. PRODUK UMKM LOKAL (id="umkm")
      ══════════════════════════════════════════════ */}
      <section id="umkm" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 scroll-mt-24">
        <div className="text-center space-y-4 max-w-3xl mx-auto reveal">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <ShoppingBag className="w-4 h-4" />
            <span>Ekonomi &amp; Produk Desa Buntu Buangin</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Katalog Oleh-Oleh Khas Sidrap
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-base">
            Dukung perekonomian warga lokal Desa Buntu Buangin dengan membeli olahan kopi organik, madu murni hutan, dan produk buatan tangan petani Sidrap.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {UMKM_PRODUCTS.map((prod, i) => (
            <div
              key={prod.id}
              className="reveal rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-md hover:shadow-xl hover-lift transition-all duration-300 overflow-hidden flex flex-col justify-between"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={prod.image}
                    alt={prod.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {prod.badge && (
                    <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
                      {prod.badge}
                    </span>
                  )}
                </div>
                <div className="p-5 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {prod.category}
                  </span>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white leading-snug">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
                    {prod.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 space-y-3">
                <div className="flex items-baseline justify-between border-t border-zinc-100 dark:border-zinc-800/80 pt-3">
                  <span className="text-xs text-zinc-400">Harga:</span>
                  <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                    Rp {prod.price.toLocaleString('id-ID')}
                  </span>
                </div>
                <button
                  onClick={() => handleOrderUmkm(prod.name, prod.price)}
                  style={noFocusStyle}
                  className="w-full py-2.5 bg-emerald-600/90 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  Pesan via WA UMKM
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          3. PORTAL BERITA DESA (id="berita")
      ══════════════════════════════════════════════ */}
      <section id="berita" className="bg-zinc-100/80 dark:bg-zinc-900/40 py-24 border-y border-zinc-200/80 dark:border-zinc-800/60 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 reveal">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentNews.map((article) => (
              <div key={article.id} className="h-full">
                <NewsCard article={article} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          4. TIKET & LOKASI (id="informasi")
      ══════════════════════════════════════════════ */}
      <section id="informasi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-14 items-center scroll-mt-24">
        <div className="lg:col-span-6 space-y-7 reveal-left">
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
              { label: 'Tiket Masuk Reguler', price: 'Rp 10.000', sub: '/ orang', desc: 'Termasuk akses gardu pandang & spot foto.', color: 'text-emerald-600 dark:text-emerald-400' },
              { label: 'Tiket Camping Night',  price: 'Rp 20.000', sub: '/ orang', desc: 'Termasuk area tenda, MCK malam & penerangan.', color: 'text-amber-500' },
            ].map((t) => (
              <div key={t.label} className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{t.label}</span>
                <p className={`text-2xl font-extrabold ${t.color} mt-1`}>
                  {t.price} <span className="text-xs font-normal text-zinc-400">{t.sub}</span>
                </p>
                <p className="text-[11px] text-zinc-400 mt-2">{t.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold flex items-center gap-2">
              <Ticket className="w-4 h-4 shrink-0 text-amber-500" />
              <span>Layanan Reservasi Tiket Online Ditutup Sementara oleh Pengelola Wisata Punjabu.</span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            {[
              { bold: 'Lokasi Wisata:', text: 'Desa Buntu Buangin, Kec. Pitu Riase, Kab. Sidrap, Sulawesi Selatan' },
              { bold: 'Jam Masuk Harian:', text: '05.00 - 18.00 WITA (Buka Setiap Hari)' },
              { bold: 'Akses Camping Ground:', text: '24 Jam dengan izin petugas Pokdarwis Punjabu' },
              { bold: 'Tarif Parkir:', text: 'Motor Rp 3.000 | Mobil Rp 5.000' },
            ].map((item) => (
              <div key={item.bold} className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span><strong>{item.bold}</strong> {item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 bg-gradient-to-br from-emerald-900/50 via-zinc-900 to-zinc-950 p-8 rounded-3xl border border-emerald-500/30 text-white shadow-2xl space-y-6 reveal-right hover:border-emerald-500/50 transition-colors duration-500">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            Fasilitas Pengunjung Bukit Punjabu
          </h3>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Pokdarwis Desa Buntu Buangin menyediakan fasilitas penunjang kenyamanan para wisatawan di puncak bukit:
          </p>

          <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
            {[
              { icon: <Coffee className="w-5 h-5 text-amber-400" />, label: 'Kedai Kopi Punjabu Sidrap' },
              { icon: <Tent className="w-5 h-5 text-emerald-400" />, label: 'Sewa Tenda & Alat Camping' },
              { icon: <Users className="w-5 h-5 text-teal-400" />, label: 'Fasilitas MCK & Sumber Air' },
              { icon: <Zap className="w-5 h-5 text-yellow-400" />, label: 'Spot Charger & Gazebo Santai' },
            ].map((f) => (
              <div
                key={f.label}
                className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/30 hover:bg-zinc-800/60 flex items-center gap-3 transition-all duration-300 hover:-translate-y-0.5 cursor-default"
              >
                {f.icon}
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          5. PANDUAN RUTE & AKSES (id="rute")
      ══════════════════════════════════════════════ */}
      <section id="rute" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-24">
        <div className="text-center space-y-4 max-w-3xl mx-auto reveal">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRAVEL_ROUTES.map((route, i) => (
            <div
              key={route.from}
              className="reveal p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-md hover:shadow-xl hover-lift transition-all duration-300 space-y-4"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Dari {route.from}
                </span>
                <MapPin className="w-4 h-4 text-emerald-500" />
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">{route.distance}</span>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {route.duration}
                </span>
              </div>

              <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-3">
                <p><strong>Kondisi Jalan:</strong> {route.roadCondition}</p>
                <p><strong>Rekomendasi:</strong> {route.vehicleAdvice}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center reveal">
          <a
            href="https://maps.google.com/?q=Bukit+Punjabu+Desa+Buntu+Buangin+Sidrap"
            target="_blank"
            rel="noopener noreferrer"
            style={noFocusStyle}
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/30 transition-all duration-300 hover:scale-105 text-sm"
          >
            <Navigation className="w-4 h-4" />
            Buka Navigasi Google Maps Langsung
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          6. GALERI FOTO (id="galeri")
      ══════════════════════════════════════════════ */}
      <section id="galeri" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-24">
        <div className="text-center space-y-3 reveal">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Galeri Keindahan Sidrap
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">
            Dokumentasi Bukit Punjabu Sidrap
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-xl mx-auto">
            Potret keindahan panorama pesona alam Desa Buntu Buangin Kecamatan Pitu Riase Kabupaten Sidrap.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setActiveMediaModal(img.url)}
              style={{ transitionDelay: `${idx * 0.08}s` }}
              className="reveal group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl hover-lift"
            >
              <Image
                src={img.url}
                alt={img.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-600 ease-out brightness-90 group-hover:brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350 flex flex-col justify-end p-4 text-white z-10">
                <span className="font-bold text-sm translate-y-2 group-hover:translate-y-0 transition-transform duration-350">{img.title}</span>
                <span className="text-xs text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{img.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {activeMediaModal && (
          <div
            onClick={() => setActiveMediaModal(null)}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-pointer animate-scale-in"
          >
            <div className="relative max-w-5xl w-full h-[85vh]">
              <Image
                src={activeMediaModal}
                alt="Preview"
                fill
                className="rounded-3xl object-contain shadow-2xl"
              />
              <p className="absolute bottom-2 left-0 right-0 text-center text-zinc-400 text-xs tracking-wider z-10">Klik di mana saja untuk menutup</p>
            </div>
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════════
          7. ULASAN WISATAWAN
      ══════════════════════════════════════════════ */}
      <section className="bg-zinc-100/60 dark:bg-zinc-900/40 py-20 border-y border-zinc-200/80 dark:border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 reveal">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Kesan &amp; Pengalaman Pengunjung
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">
              Ulasan Asli Wisatawan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VISITOR_REVIEWS.map((rev, i) => (
              <div
                key={rev.id}
                className="reveal p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-md space-y-4 flex flex-col justify-between"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400 text-sm">
                      {[...Array(rev.rating)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-emerald-500/30" />
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 italic leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <Image src={rev.avatar} alt={rev.name} width={40} height={40} unoptimized className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{rev.name}</h4>
                    <p className="text-[11px] text-zinc-400">{rev.origin} • {rev.spot}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          8. PERTANYAAN UMUM / FAQ (id="faq")
      ══════════════════════════════════════════════ */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-24">
        <div className="text-center space-y-3 reveal">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <HelpCircle className="w-4 h-4" />
            <span>Pertanyaan Sering Diajukan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">
            FAQ Wisata Bukit Punjabu Sidrap
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            Temukan jawaban lengkap atas hal-hal yang sering ditanyakan para calon pengunjung.
          </p>
        </div>

        <div className="space-y-4 reveal">
          {FAQS.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-sm transition"
              >
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  style={noFocusStyle}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-zinc-900 dark:text-white hover:text-emerald-500 transition cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-emerald-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/60 pt-3 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
