'use client';

import React, { useState, useEffect, useCallback, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useApp } from '@/context/AppContext';
import { Sparkles, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  desc: string;
  category: string;
}

const GALLERY_DATA: GalleryItem[] = [
  {
    id: 'g1',
    url: '/images/heroimage.jpg',
    title: 'Puncak Utama & Lautan Awan 527 mdpl',
    desc: 'Pesona fajar menyingsing di atas hamparan samudera awan putih perbukitan Pitu Riase.',
    category: 'Samudera Awan',
  },
  {
    id: 'g2',
    url: '/images/topview.jpg',
    title: 'Panorama Udara Bentang Alam Punjabu',
    desc: 'Pemandangan dari udara menyajikan lanskap perbukitan hijau Dusun Jambu-jambu Desa Buntu Buangin.',
    category: 'Gardu Pandang',
  },
  {
    id: 'g3',
    url: '/images/sideview.jpg',
    title: 'Suasana Camping Ground & Kebun Cengkih',
    desc: 'Pengalaman berkemah sejuk ramah keluarga di tengah hamparan perkebunan cengkih warga.',
    category: 'Camping',
  },
  {
    id: 'g4',
    url: '/images/gazeboview.png',
    title: 'Gazebo & Saung Pandang Panoramik',
    desc: 'Fasilitas saung gazebo tempat bersantai bagi pengunjung menikmati pemandangan alam Sidrap.',
    category: 'Gardu Pandang',
  },
  {
    id: 'g5',
    url: '/images/boneview.png',
    title: 'Panorama Latimojong & Teluk Bone',
    desc: 'Cakrawala luas memandang deretan Pegunungan Latimojong hingga kilau pesona laut Teluk Bone.',
    category: 'Samudera Awan',
  },
  {
    id: 'g6',
    url: '/images/trailview.png',
    title: 'Jalur Petualangan Off-Road 3 km',
    desc: 'Trek menantang melintasi perbukitan favorit pecinta motor trail, jeep 4x4, dan penjelajah alam.',
    category: 'Petualangan',
  },
  {
    id: 'g7',
    url: '/images/kebunview.png',
    title: 'Agrowisata Kebun Cengkih & Aren',
    desc: 'Lanskap perkebunan cengkih dan nira aren organik yang asri di Dusun Jambu-jambu Desa Buntu Buangin.',
    category: 'Agrowisata',
  },
  {
    id: 'g8',
    url: '/images/farview.png',
    title: 'Lanskap Cakrawala Jauh Perbukitan',
    desc: 'Pemandangan spektakuler sudut pandang jauh membentang sepanjang pegunungan Pitu Riase Sidrap.',
    category: 'Gardu Pandang',
  },
];

export const GallerySection: React.FC = () => {
  const { galleryItems } = useApp();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const sourceData: GalleryItem[] = galleryItems && galleryItems.length > 0
    ? galleryItems.map((g) => ({
        id: g.id,
        url: g.imageUrl || (g as unknown as { url?: string }).url || '/images/heroimage.jpg',
        title: g.title,
        desc: g.description || (g as unknown as { desc?: string }).desc || '',
        category: g.category,
      }))
    : GALLERY_DATA;

  const handleNext = useCallback(() => {
    if (lightboxIndex === null || sourceData.length === 0) return;
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % sourceData.length : 0));
  }, [lightboxIndex, sourceData.length]);

  const handlePrev = useCallback(() => {
    if (lightboxIndex === null || sourceData.length === 0) return;
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + sourceData.length) % sourceData.length : 0));
  }, [lightboxIndex, sourceData.length]);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const scrollAmount = direction === 'left' ? -350 : 350;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  useEffect(() => {
    if (lightboxIndex === null) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxIndex, handleNext, handlePrev]);

  return (
    <section id="galeri" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
      
      {/* Section Header */}
      <ScrollReveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Galeri Keindahan Sidrap</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Dokumentasi Bukit Punjabu Sidrap
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
            Potret panorama pesona alam 527 mdpl Desa Buntu Buangin, Kecamatan Pitu Riase, Kabupaten Sidrap.
          </p>
        </div>

        {/* Slider Arrow Navigation Controls in Header */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => scrollSlider('left')}
            className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 active:scale-95 transition-all shadow-xs cursor-pointer"
            title="Geser Kiri"
            aria-label="Geser Kiri"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollSlider('right')}
            className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 active:scale-95 transition-all shadow-xs cursor-pointer"
            title="Geser Kanan"
            aria-label="Geser Kanan"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </ScrollReveal>

      {/* ── SMOOTH SLIDER (Horizontal Snap Reel) ── */}
      <div className="relative group/slider">
        {/* Floating Side Arrow Left (On hover on large screens) */}
        <button
          onClick={() => scrollSlider('left')}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-zinc-950/80 hover:bg-emerald-600 text-white border border-white/20 shadow-2xl transition-all duration-300 opacity-0 group-hover/slider:opacity-100 cursor-pointer hidden md:flex items-center justify-center hover:scale-110 active:scale-95"
          title="Geser Kiri"
          aria-label="Geser Kiri"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scroll Container */}
        <div
          ref={sliderRef}
          className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-3 px-1 scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {sourceData.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => setLightboxIndex(idx)}
              className="group relative w-72 sm:w-88 shrink-0 h-56 sm:h-64 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl hover-lift border border-zinc-200/80 dark:border-zinc-800/80 snap-start transition-all duration-300"
            >
              <Image
                src={img.url}
                alt={img.title}
                fill
                sizes="(max-width: 640px) 280px, 350px"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out brightness-95 group-hover:brightness-100"
              />
              
              {/* Category Badge */}
              <div className="absolute top-3.5 left-3.5 z-10 bg-zinc-950/80 backdrop-blur-md text-emerald-400 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-500/30 shadow-xs">
                {img.category}
              </div>

              {/* Hover Caption & Zoom Icon Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 text-white z-10">
                <div className="flex justify-end">
                  <div className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-base leading-snug line-clamp-1 group-hover:text-emerald-300 transition-colors">{img.title}</h3>
                  <p className="text-xs text-zinc-300 mt-1 line-clamp-2 leading-relaxed">{img.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Side Arrow Right (On hover on large screens) */}
        <button
          onClick={() => scrollSlider('right')}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-zinc-950/80 hover:bg-emerald-600 text-white border border-white/20 shadow-2xl transition-all duration-300 opacity-0 group-hover/slider:opacity-100 cursor-pointer hidden md:flex items-center justify-center hover:scale-110 active:scale-95"
          title="Geser Kanan"
          aria-label="Geser Kanan"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Fullscreen Interactive Lightbox Modal (Portal to document.body) */}
      {mounted && lightboxIndex !== null && sourceData[lightboxIndex] && createPortal(
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex flex-col justify-between items-center p-4 sm:p-6 overflow-y-auto animate-fade-in select-none cursor-pointer"
        >
          {/* Floating Top-Right Close Button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[110] p-3 rounded-full bg-zinc-800/90 hover:bg-emerald-600 text-white shadow-2xl transition-all border border-white/20 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95"
            title="Tutup Preview (Esc)"
            aria-label="Tutup Preview"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Top Bar */}
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-5xl flex items-center justify-between text-white z-20 pt-2 pb-3 cursor-default">
            <div className="flex items-center gap-3 bg-zinc-900/90 px-4 py-2 rounded-full border border-zinc-800 text-xs font-semibold shadow-lg">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold">
                {sourceData[lightboxIndex].category}
              </span>
              <span className="text-zinc-300">
                Foto {lightboxIndex + 1} dari {sourceData.length}
              </span>
            </div>
          </div>

          {/* Main Image Container */}
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-auto py-2 cursor-default">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sourceData[lightboxIndex].url}
              alt={sourceData[lightboxIndex].title}
              className="max-h-[75vh] sm:max-h-[80vh] max-w-full w-auto h-auto object-contain rounded-2xl shadow-2xl border border-zinc-800/80 transition-all duration-300"
            />

            {/* Prev / Next buttons */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/70 hover:bg-emerald-600 text-white border border-white/20 transition cursor-pointer shadow-2xl z-20 hover:scale-110 active:scale-95"
              title="Sebelumnya (Panah Kiri)"
              aria-label="Sebelumnya"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/70 hover:bg-emerald-600 text-white border border-white/20 transition cursor-pointer shadow-2xl z-20 hover:scale-110 active:scale-95"
              title="Selanjutnya (Panah Kanan)"
              aria-label="Selanjutnya"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Caption */}
          <div onClick={(e) => e.stopPropagation()} className="text-center text-white space-y-1 max-w-2xl mx-auto z-20 cursor-default py-2">
            <h3 className="text-base sm:text-lg font-bold">{sourceData[lightboxIndex].title}</h3>
            <p className="text-xs text-zinc-400">{sourceData[lightboxIndex].desc}</p>
            <p className="text-[11px] text-zinc-500 pt-1">
              Tekan <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-300 font-mono">Esc</kbd> atau klik area luar untuk menutup
            </p>
          </div>

        </div>,
        document.body
      )}

    </section>
  );
};
