'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useApp } from '@/context/AppContext';
import { Sparkles, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

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
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['Semua', 'Samudera Awan', 'Camping', 'Gardu Pandang', 'Petualangan', 'Agrowisata'];

  const sourceData: GalleryItem[] = galleryItems && galleryItems.length > 0
    ? galleryItems.map((g) => ({
        id: g.id,
        url: g.imageUrl || (g as unknown as { url?: string }).url || '/images/heroimage.jpg',
        title: g.title,
        desc: g.description || (g as unknown as { desc?: string }).desc || '',
        category: g.category,
      }))
    : GALLERY_DATA;

  const filteredItems = activeCategory === 'Semua'
    ? sourceData
    : sourceData.filter((item) => item.category === activeCategory);

  const handleNext = useCallback(() => {
    if (lightboxIndex === null || filteredItems.length === 0) return;
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredItems.length : 0));
  }, [lightboxIndex, filteredItems.length]);

  const handlePrev = useCallback(() => {
    if (lightboxIndex === null || filteredItems.length === 0) return;
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : 0));
  }, [lightboxIndex, filteredItems.length]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setLightboxIndex(null);
  };


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handleNext, handlePrev]);

  return (
    <section id="galeri" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-24">
      
      {/* Section Header */}
      <ScrollReveal className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
          <Sparkles className="w-4 h-4" />
          <span>Galeri Keindahan Sidrap</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Dokumentasi Bukit Punjabu Sidrap
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
          Potret panorama pesona alam 527 mdpl Desa Buntu Buangin, Kecamatan Pitu Riase, Kabupaten Sidrap.
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}

              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* Grid Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((img, idx) => (
          <ScrollReveal
            key={img.id}
            delay={idx * 0.08}
            className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl hover-lift transition-all duration-300 border border-zinc-200/80 dark:border-zinc-800"
          >
            <div onClick={() => setLightboxIndex(idx)} className="relative w-full h-full">
              <Image
                src={img.url}
                alt={img.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out brightness-90 group-hover:brightness-100"
              />

              {/* Badge Category */}
              <div className="absolute top-4 left-4 z-10 bg-zinc-950/80 backdrop-blur-md text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                {img.category}
              </div>

              {/* Hover overlay with zoom icon */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 text-white z-10">
                <div className="flex justify-end">
                  <div className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-base translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{img.title}</h3>
                  <p className="text-xs text-zinc-300 mt-1 line-clamp-2">{img.desc}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Fullscreen Interactive Lightbox Modal */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-8 animate-scale-in">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white z-10">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-xs font-bold">
                {filteredItems[lightboxIndex].category}
              </span>
              <span className="text-xs text-zinc-400 font-semibold">
                Foto {lightboxIndex + 1} dari {filteredItems.length}
              </span>
            </div>
            <button
              onClick={() => setLightboxIndex(null)}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Image Container */}
          <div className="relative flex-1 my-4 flex items-center justify-center">
            <Image
              src={filteredItems[lightboxIndex].url}
              alt={filteredItems[lightboxIndex].title}
              fill
              className="object-contain max-h-[75vh]"
            />

            {/* Prev / Next buttons */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-6 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-emerald-600 text-white border border-white/20 transition cursor-pointer"
              title="Sebelumnya (Panah Kiri)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-6 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-emerald-600 text-white border border-white/20 transition cursor-pointer"
              title="Selanjutnya (Panah Kanan)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Caption */}
          <div className="text-center text-white space-y-1 max-w-2xl mx-auto z-10">
            <h3 className="text-lg font-bold">{filteredItems[lightboxIndex].title}</h3>
            <p className="text-xs text-zinc-400">{filteredItems[lightboxIndex].desc}</p>
          </div>

        </div>
      )}

    </section>
  );
};
