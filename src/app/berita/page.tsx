'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { NewsCard } from '@/components/NewsCard';
import { Search, Filter, Newspaper, Sparkles } from 'lucide-react';

export default function BeritaPage() {
  const { newsList } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Wisata & Event', 'Kegiatan Desa', 'Pembangunan', 'Ekonomi & UMKM'];

  // Filter published news with fallback to all news
  const publishedNews = newsList.filter((n) => !n.status || n.status.toLowerCase() === 'published');
  const activeNews = publishedNews.length > 0 ? publishedNews : newsList;

  const filteredNews = activeNews.filter((item) => {
    const matchesSearch =
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.summary && item.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.tags && Array.isArray(item.tags) && item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredArticle = activeNews.find((item) => item.featured) || activeNews[0];
  const regularNews = (searchQuery || selectedCategory !== 'Semua')
    ? filteredNews
    : filteredNews.filter((item) => item.id !== featuredArticle?.id);

  return (
    <div className="pt-28 pb-20 space-y-12">
      {/* Header Banner */}
      <section className="relative py-12 bg-gradient-to-br from-emerald-950 via-zinc-900 to-zinc-950 border-b border-zinc-800 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Newspaper className="w-4 h-4" />
            <span>Portal Berita & Media Resmi Desa</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Kabar Desa & Wisata Punjabu
          </h1>
          <p className="text-zinc-300 text-sm sm:text-base max-w-2xl">
            Pusat berita terkini, liputan kegiatan desa, agenda acara pariwisata, serta pengumuman penting bagi warga dan pengunjung Wisata Bukit Punjabu.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Cari berita, topik, atau kata kunci..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-700/80 rounded-2xl text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm backdrop-blur-md shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mr-2 shrink-0">
              Kategori:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Menampilkan {filteredNews.length} berita
          </span>
        </div>

        {/* Featured News Hero (If no active search) */}
        {!searchQuery && selectedCategory === 'Semua' && featuredArticle && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
              Berita Utama Hari Ini
            </div>
            <NewsCard article={featuredArticle} featured={true} />
          </div>
        )}

        {/* News Grid */}
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
            {searchQuery || selectedCategory !== 'Semua' ? 'Hasil Pencarian Berita' : 'Berita Lainnya'}
          </h2>

          {filteredNews.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 space-y-3">
              <Newspaper className="w-12 h-12 text-zinc-400 mx-auto" />
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                Tidak ada berita ditemukan
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Coba gunakan kata kunci pencarian yang lain atau pilih kategori berita yang berbeda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {((searchQuery || selectedCategory !== 'Semua' || regularNews.length === 0) ? filteredNews : regularNews).map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
