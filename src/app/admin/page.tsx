'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { NewsArticle } from '@/data/initialData';
import {
  LayoutDashboard,
  Newspaper,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  TrendingUp,
  Users,
  ShieldCheck,
  X,
  FileText,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, login, newsList, addNews, updateNews, deleteNews, stats, supabaseActive } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Semua');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    category: 'Wisata & Event' | 'Kegiatan Desa' | 'Pembangunan' | 'Ekonomi & UMKM' | 'Pengumuman';
    author: string;
    authorRole: string;
    readTime: string;
    summary: string;
    content: string;
    coverImage: string;
    galleryInput: string;
    videoUrl: string;
    status: 'Published' | 'Draft';
    featured: boolean;
    tagsInput: string;
  }>({
    title: '',
    category: 'Wisata & Event',
    author: user?.name || 'Admin Punjabu',
    authorRole: 'Pengelola CMS Desa',
    readTime: '3 menit baca',
    summary: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    galleryInput: '',
    videoUrl: '',
    status: 'Published',
    featured: false,
    tagsInput: 'Wisata, Desa, Punjabu',
  });

  // Filtered News for CMS table
  const filteredNews = newsList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'Semua' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      category: 'Wisata & Event',
      author: user?.name || 'Admin Punjabu',
      authorRole: 'Pengelola CMS Desa',
      readTime: '3 menit baca',
      summary: '',
      content: '',
      coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
      galleryInput: '',
      videoUrl: '',
      status: 'Published',
      featured: false,
      tagsInput: 'Wisata, Desa, Punjabu',
    });
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (article: NewsArticle) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      category: article.category,
      author: article.author,
      authorRole: article.authorRole,
      readTime: article.readTime,
      summary: article.summary,
      content: article.content,
      coverImage: article.coverImage,
      galleryInput: article.gallery ? article.gallery.join(', ') : '',
      videoUrl: article.videoUrl || '',
      status: article.status,
      featured: article.featured,
      tagsInput: article.tags ? article.tags.join(', ') : '',
    });
    setIsModalOpen(true);
  };

  // Form Submit (Add or Edit)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    const galleryArray = formData.galleryInput
      ? formData.galleryInput.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    const tagsArray = formData.tagsInput
      ? formData.tagsInput.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    if (editingArticle) {
      await updateNews(editingArticle.id, {
        title: formData.title,
        category: formData.category,
        author: formData.author,
        authorRole: formData.authorRole,
        readTime: formData.readTime,
        summary: formData.summary,
        content: formData.content,
        coverImage: formData.coverImage,
        gallery: galleryArray,
        videoUrl: formData.videoUrl,
        status: formData.status,
        featured: formData.featured,
        tags: tagsArray,
      });
    } else {
      await addNews({
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
        category: formData.category,
        author: formData.author,
        authorRole: formData.authorRole,
        readTime: formData.readTime,
        featured: formData.featured,
        status: formData.status,
        summary: formData.summary,
        content: formData.content,
        coverImage: formData.coverImage,
        gallery: galleryArray,
        videoUrl: formData.videoUrl,
        tags: tagsArray,
      });
    }

    setIsModalOpen(false);
  };

  // Check Admin Login
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Akses Terbatas Admin
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Anda perlu masuk sebagai **Admin Pengelola** untuk mengakses dashboard pemantauan dan CMS berita desa.
          </p>
          <button
            onClick={() => login('admin.punjabu@desa.id', 'admin', 'Admin Pengelola Punjabu')}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 text-sm transition"
          >
            Masuk Langsung Sebagai Admin Demo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold">
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Sistem CMS Desa</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
            <span className="text-[10px] opacity-80">
              {supabaseActive ? '• Supabase DB Connected' : '• Local Fallback Mode'}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
            Panel Pengelola Wisata & Portal Berita
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Pantau statistik pengunjung dan atur konten artikel berita yang akan dipublikasikan ke portal publik.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/berita"
            className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold rounded-xl transition flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Lihat Portal Publik
          </Link>
          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Buat Berita Baru
          </button>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Total Pengunjung Web</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-zinc-900 dark:text-white">
            {stats.totalVisitors.toLocaleString('id-ID')}
          </p>
          <p className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +14% bulan ini
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Total Berita Terbit</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
              <Newspaper className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-zinc-900 dark:text-white">{newsList.length}</p>
          <p className="text-[11px] text-zinc-400">Artikel aktif di sistem CMS</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Total Pembaca Artikel</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-zinc-900 dark:text-white">
            {newsList.reduce((acc, curr) => acc + curr.views, 0).toLocaleString('id-ID')}
          </p>
          <p className="text-[11px] text-amber-500 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Interaksi publik tinggi
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Inkuiri / Pesan Wisata</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-zinc-900 dark:text-white">{stats.totalInquiries}</p>
          <p className="text-[11px] text-zinc-400">Pertanyaan publik masuk</p>
        </div>
      </div>

      {/* CMS News Management Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Manajemen Artikel Berita CMS
            </h2>
            <p className="text-xs text-zinc-500">
              Kelola, edit, atau buat artikel baru untuk Portal Media Desa Wisata Bukit Punjabu.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Cari berita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none"
            >
              <option value="Semua" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">Semua Kategori</option>
              <option value="Wisata & Event" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">Wisata & Event</option>
              <option value="Kegiatan Desa" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">Kegiatan Desa</option>
              <option value="Pembangunan" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">Pembangunan</option>
              <option value="Ekonomi & UMKM" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">Ekonomi & UMKM</option>
            </select>
          </div>
        </div>

        {/* News Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-300">
            <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 rounded-l-xl">Artikel</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Penulis</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Pembaca</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right rounded-r-xl">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredNews.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition">
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-12 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white line-clamp-1">{item.title}</p>
                        {item.featured && (
                          <span className="text-[10px] text-amber-500 font-bold uppercase">★ Featured</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                    {item.category}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-zinc-800 dark:text-zinc-200">{item.author}</td>
                  <td className="py-3.5 px-4 text-zinc-500">{item.date}</td>
                  <td className="py-3.5 px-4 font-bold">{item.views}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.status === 'Published'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/berita/${item.id}`}
                        target="_blank"
                        className="p-1.5 text-zinc-400 hover:text-emerald-400 transition"
                        title="Lihat Pratinjau"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 text-blue-500 hover:text-blue-400 transition"
                        title="Edit Artikel"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus berita "${item.title}"?`)) {
                            deleteNews(item.id);
                          }
                        }}
                        className="p-1.5 text-red-500 hover:text-red-400 transition"
                        title="Hapus Artikel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Add/Edit News */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-100 dark:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
              {editingArticle ? 'Edit Berita' : 'Tambah Berita Baru'}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1 text-zinc-700 dark:text-zinc-300">Judul Berita</label>
                <input
                  type="text"
                  required
                  placeholder="Judul berita..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1 text-zinc-700 dark:text-zinc-300">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as NewsArticle['category'],
                      })
                    }
                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
                  >
                    <option value="Wisata & Event">Wisata & Event</option>
                    <option value="Kegiatan Desa">Kegiatan Desa</option>
                    <option value="Pembangunan">Pembangunan</option>
                    <option value="Ekonomi & UMKM">Ekonomi & UMKM</option>
                    <option value="Pengumuman">Pengumuman</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-zinc-700 dark:text-zinc-300">Penulis</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-zinc-700 dark:text-zinc-300">URL Gambar Sampul</label>
                <input
                  type="url"
                  required
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-zinc-700 dark:text-zinc-300">Ringkasan Singkat</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ringkasan 1-2 kalimat..."
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-zinc-700 dark:text-zinc-300">Narasi Berita Lengkap</label>
                <textarea
                  rows={8}
                  required
                  placeholder="Tuliskan narasi berita lengkap..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-zinc-700 dark:text-zinc-300">
                  URL Galeri Foto Tambahan (Dipisahkan koma)
                </label>
                <input
                  type="text"
                  placeholder="https://image1.jpg, https://image2.jpg"
                  value={formData.galleryInput}
                  onChange={(e) => setFormData({ ...formData, galleryInput: e.target.value })}
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-zinc-700 dark:text-zinc-300">
                  URL Video Liputan Embed (YouTube / External)
                </label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/embed/..."
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500"
                  />
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">Jadikan Berita Utama (Featured)</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">Status:</span>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as NewsArticle['status'] })}
                    className="p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-700 rounded-lg"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30"
                >
                  Simpan Berita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
