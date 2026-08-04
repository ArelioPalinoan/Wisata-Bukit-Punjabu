'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { NewsArticle, TourismSpot, UMKMProduct, BookingRecord } from '@/data/initialData';
import { showToast } from '@/components/Toast';
import {
  Newspaper,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Users,
  ShieldCheck,
  X,
  Compass,
  ShoppingBag,
  Ticket,
  CheckCircle2,
  XCircle,
  Star,
  MessageSquare,
  Phone,
  Grid,
  List,
  RefreshCw,
  DollarSign,
  ArrowUpRight,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const {
    user,
    login,
    newsList,
    addNews,
    updateNews,
    deleteNews,
    tourismSpots,
    addTourismSpot,
    updateTourismSpot,
    deleteTourismSpot,
    umkmProducts,
    addUmkmProduct,
    updateUmkmProduct,
    deleteUmkmProduct,
    reviews,
    bookings,
    updateBookingStatus,
    stats,
    supabaseActive,
    refreshAllData,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'news' | 'wisata' | 'umkm' | 'bookings' | 'reviews'>('news');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ----------------------------------------------------
  // NEWS MODAL & FORM STATE
  // ----------------------------------------------------
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [newsFormData, setNewsFormData] = useState({
    title: '',
    category: 'Wisata & Event' as NewsArticle['category'],
    author: user?.name || 'Admin Punjabu',
    authorRole: 'Pengelola CMS Desa',
    readTime: '3 menit baca',
    summary: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    galleryInput: '',
    videoUrl: '',
    status: 'Published' as NewsArticle['status'],
    featured: false,
    tagsInput: 'Wisata, Desa, Punjabu',
  });

  // ----------------------------------------------------
  // WISATA MODAL & FORM STATE
  // ----------------------------------------------------
  const [isSpotModalOpen, setIsSpotModalOpen] = useState(false);
  const [editingSpot, setEditingSpot] = useState<TourismSpot | null>(null);
  const [spotFormData, setSpotFormData] = useState({
    title: '',
    category: 'Pemandangan Alam',
    description: '',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    badge: 'Populer',
    rating: 4.9,
  });

  // ----------------------------------------------------
  // UMKM MODAL & FORM STATE
  // ----------------------------------------------------
  const [isUmkmModalOpen, setIsUmkmModalOpen] = useState(false);
  const [editingUmkm, setEditingUmkm] = useState<UMKMProduct | null>(null);
  const [umkmFormData, setUmkmFormData] = useState({
    name: '',
    price: 20000,
    priceUnit: 'kemasan 250g',
    category: 'Camilan Tradisional',
    seller: 'UMKM Desa Buntu Buangin',
    description: '',
    image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=800&auto=format&fit=crop',
    badge: 'Khas Ikonik',
  });

  // Lock body scroll and ESC key handler when any admin modal is open
  const isAnyAdminModalOpen = isNewsModalOpen || isSpotModalOpen || isUmkmModalOpen;
  React.useEffect(() => {
    if (!isAnyAdminModalOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsNewsModalOpen(false);
        setIsSpotModalOpen(false);
        setIsUmkmModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAnyAdminModalOpen]);

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    await refreshAllData();
    showToast('Data Disinkronkan', 'Seluruh data terbaru dari Supabase telah diperbarui.', 'success');
    setIsRefreshing(false);
  };

  // Login Prompter for non-admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-zinc-950">
        <div className="max-w-md w-full p-8 rounded-3xl bg-zinc-900/90 border border-emerald-500/30 backdrop-blur-xl shadow-2xl text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto border border-emerald-500/30 shadow-inner">
            <ShieldCheck className="w-10 h-10 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Portal CMS Admin Punjabu</h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-2 leading-relaxed">
              Silakan masuk dengan akun Administrator untuk mengelola konten portal wisata, produk UMKM, dan reservasi tiket.
            </p>
          </div>
          <button
            onClick={() => login('admin@punjabu.desa.id', 'admin', 'Admin Pengelola Punjabu')}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-950/50 transition-all transform hover:scale-[1.02] active:scale-95"
          >
            Masuk Sebagai Administrator
          </button>
        </div>
      </div>
    );
  }

  // Calculate quick analytics
  const totalRevenue = bookings.reduce((acc, b) => (b.status === 'Confirmed' ? acc + b.totalPrice : acc), 0);
  const pendingBookings = bookings.filter((b) => b.status === 'Pending').length;
  const avgRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '5.0';

  // ==========================================
  // HANDLERS NEWS
  // ==========================================
  const handleOpenNewsModal = (article?: NewsArticle) => {
    if (article) {
      setEditingNews(article);
      setNewsFormData({
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
    } else {
      setEditingNews(null);
      setNewsFormData({
        title: '',
        category: 'Wisata & Event',
        author: user.name || 'Admin Punjabu',
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
    }
    setIsNewsModalOpen(true);
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    const gallery = newsFormData.galleryInput
      ? newsFormData.galleryInput.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
      : [];
    const tags = newsFormData.tagsInput
      ? newsFormData.tagsInput.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
      : [];

    let formattedVideoUrl = newsFormData.videoUrl.trim();
    if (formattedVideoUrl) {
      const ytMatch = formattedVideoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/);
      if (ytMatch && ytMatch[1]) {
        formattedVideoUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
      }
    }

    if (editingNews) {
      await updateNews(editingNews.id, {
        title: newsFormData.title,
        category: newsFormData.category,
        author: newsFormData.author || 'Tim Media Desa',
        authorRole: newsFormData.authorRole || 'Pengelola CMS Desa',
        readTime: newsFormData.readTime || '3 min baca',
        summary: newsFormData.summary,
        content: newsFormData.content,
        coverImage: newsFormData.coverImage,
        gallery,
        videoUrl: formattedVideoUrl || undefined,
        status: newsFormData.status,
        featured: newsFormData.featured,
        tags,
      });
      showToast('Berita Diperbarui', 'Perubahan artikel berita tersimpan di Supabase.', 'success');
    } else {
      await addNews({
        title: newsFormData.title,
        slug: '',
        category: newsFormData.category,
        author: newsFormData.author || 'Tim Media Desa',
        authorRole: newsFormData.authorRole || 'Pengelola CMS Desa',
        readTime: newsFormData.readTime || '3 min baca',
        summary: newsFormData.summary,
        content: newsFormData.content,
        coverImage: newsFormData.coverImage,
        gallery,
        videoUrl: formattedVideoUrl || undefined,
        status: newsFormData.status,
        featured: newsFormData.featured,
        tags,
      });
      showToast('Berita Ditambahkan', 'Artikel berita baru berhasil diterbitkan.', 'success');
    }
    setIsNewsModalOpen(false);
  };

  // ==========================================
  // HANDLERS WISATA
  // ==========================================
  const handleOpenSpotModal = (spot?: TourismSpot) => {
    if (spot) {
      setEditingSpot(spot);
      setSpotFormData({
        title: spot.title,
        category: spot.category,
        description: spot.description,
        image: spot.image,
        badge: spot.badge,
        rating: spot.rating,
      });
    } else {
      setEditingSpot(null);
      setSpotFormData({
        title: '',
        category: 'Pemandangan Alam Sidrap',
        description: '',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
        badge: 'Terfavorit Sidrap',
        rating: 4.9,
      });
    }
    setIsSpotModalOpen(true);
  };

  const handleSaveSpot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSpot) {
      await updateTourismSpot(editingSpot.id, spotFormData);
      showToast('Destinasi Diperbarui', 'Spot wisata tersimpan di Supabase.', 'success');
    } else {
      await addTourismSpot(spotFormData);
      showToast('Destinasi Ditambahkan', 'Spot wisata baru berhasil dipublikasikan.', 'success');
    }
    setIsSpotModalOpen(false);
  };

  // ==========================================
  // HANDLERS UMKM
  // ==========================================
  const handleOpenUmkmModal = (prod?: UMKMProduct) => {
    if (prod) {
      setEditingUmkm(prod);
      setUmkmFormData({
        name: prod.name,
        price: prod.price,
        priceUnit: prod.priceUnit,
        category: prod.category,
        seller: prod.seller,
        description: prod.description,
        image: prod.image,
        badge: prod.badge || '',
      });
    } else {
      setEditingUmkm(null);
      setUmkmFormData({
        name: '',
        price: 20000,
        priceUnit: 'kemasan 250g',
        category: 'Camilan Tradisional',
        seller: 'UMKM Desa Buntu Buangin',
        description: '',
        image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=800&auto=format&fit=crop',
        badge: 'Khas Ikonik',
      });
    }
    setIsUmkmModalOpen(true);
  };

  const handleSaveUmkm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUmkm) {
      await updateUmkmProduct(editingUmkm.id, umkmFormData);
      showToast('Produk Diperbarui', 'Data produk UMKM tersimpan di Supabase.', 'success');
    } else {
      await addUmkmProduct(umkmFormData);
      showToast('Produk Ditambahkan', 'Produk UMKM baru berhasil dipublikasikan.', 'success');
    }
    setIsUmkmModalOpen(false);
  };

  const handleOpenWhatsAppGuest = (b: BookingRecord) => {
    const message = `Halo Kak ${b.userName}, kami dari Pengelola Wisata Bukit Punjabu Sidrap mengonfirmasi pemesanan tiket Anda (#${b.id.slice(0, 8)}) untuk tanggal ${b.bookingDate}. Apakah ada yang ingin ditanyakan?`;
    window.open(`https://wa.me/${b.userPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* ══════════════════════════════════════════════
          1. HEADER GLASSMORPHISM BANNER
      ══════════════════════════════════════════════ */}
      <div className="relative overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-emerald-950/90 via-zinc-900 to-zinc-950 border border-emerald-500/30 rounded-3xl shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30 flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{supabaseActive ? 'Supabase Live Connection' : 'Local Dynamic Sync'}</span>
              </span>
              <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-full border border-zinc-700 flex items-center gap-2">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-5 h-5 rounded-full object-cover border border-emerald-500/40"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=059669&color=fff`;
                    }}
                  />
                ) : null}
                <span>Pengelola: {user.name}</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Dashboard CMS Admin Punjabu
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Kelola berita desa, kustomisasi destinasi wisata, atur katalog UMKM, serta tinjau reservasi tiket pengunjung Bukit Punjabu (527 mdpl).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRefreshData}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-2xl border border-zinc-700 transition active:scale-95 shadow-md"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isRefreshing ? 'Sinkronisasi...' : 'Refresh Data'}</span>
            </button>

            <Link
              href="/"
              className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-emerald-950 transition active:scale-95"
            >
              <span>Lihat Website Utama</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          2. ANALYTICS KPI CARDS (OVERALL VILLAGE STATS)
      ══════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Monthly Web Visits (Auto-Reset) */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md hover:border-emerald-500/40 transition-all group">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
            <span>Kunjungan Bulan Ini</span>
            <Users className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{stats.monthlyWebVisits.toLocaleString('id-ID')}</p>
          <span className="text-[11px] text-emerald-400 font-medium mt-1 block">
            Reset Awal Bulan • {stats.totalWebVisits.toLocaleString('id-ID')} Total All-Time
          </span>
        </div>

        {/* Card 2: News Count */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md hover:border-teal-500/40 transition-all group">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
            <span>Berita &amp; Liputan</span>
            <Newspaper className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{stats.totalNews}</p>
          <span className="text-[11px] text-teal-400 font-medium mt-1 block">Artikel Terbit</span>
        </div>

        {/* Card 3: Active Attractions */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md hover:border-amber-500/40 transition-all group">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
            <span>Attraksi Wisata</span>
            <Compass className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{stats.activeAttractions}</p>
          <span className="text-[11px] text-amber-400 font-medium mt-1 block">Spot Ikonik Sidrap</span>
        </div>

        {/* Card 4: Total Inquiries & Bookings */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md hover:border-purple-500/40 transition-all group">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
            <span>Inquiry &amp; Reservasi</span>
            <Ticket className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{stats.totalInquiries}</p>
          <span className="text-[11px] text-purple-400 font-medium mt-1 block">
            {pendingBookings > 0 ? `${pendingBookings} Menunggu Konfirmasi` : 'Semua Terkonfirmasi'}
          </span>
        </div>

        {/* Card 5: Revenue & Rating */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md hover:border-emerald-400/40 transition-all group col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
            <span>Omset Reservasi</span>
            <DollarSign className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">Rp {totalRevenue.toLocaleString('id-ID')}</p>
          <span className="text-[11px] text-amber-400 font-medium mt-1 block">Rating: ★ {avgRating} ({reviews.length} ulasan)</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          3. TAB CONTROL & FILTER BAR
      ══════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('news')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer shrink-0 ${
              activeTab === 'news'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>Berita Desa ({newsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wisata')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer shrink-0 ${
              activeTab === 'wisata'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Spot Wisata ({tourismSpots.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('umkm')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer shrink-0 ${
              activeTab === 'umkm'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Produk UMKM ({umkmProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer shrink-0 ${
              activeTab === 'bookings'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Reservasi ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer shrink-0 ${
              activeTab === 'reviews'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ulasan ({reviews.length})</span>
          </button>
        </div>

        {/* Search Bar & View Mode Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-500" />
            <input
              type="text"
              placeholder="Cari data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-zinc-500 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {(activeTab === 'wisata' || activeTab === 'umkm') && (
            <div className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                title="Tampilan Grid"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition ${viewMode === 'table' ? 'bg-emerald-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                title="Tampilan Tabel"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Action Create Buttons */}
          {activeTab === 'news' && (
            <button
              onClick={() => handleOpenNewsModal()}
              className="flex items-center space-x-1.5 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Berita</span>
            </button>
          )}

          {activeTab === 'wisata' && (
            <button
              onClick={() => handleOpenSpotModal()}
              className="flex items-center space-x-1.5 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Wisata</span>
            </button>
          )}

          {activeTab === 'umkm' && (
            <button
              onClick={() => handleOpenUmkmModal()}
              className="flex items-center space-x-1.5 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah UMKM</span>
            </button>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          4. TAB CONTENTS
      ══════════════════════════════════════════════ */}

      {/* TAB 1: BERITA DESA */}
      {activeTab === 'news' && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-950/80 text-xs text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="py-4 px-6">Berita &amp; Sampul</th>
                  <th className="py-4 px-6">Kategori</th>
                  <th className="py-4 px-6">Penulis</th>
                  <th className="py-4 px-6">Tanggal</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {newsList
                  .filter((n) => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.category.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-800/40 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-zinc-700">
                            <Image src={item.coverImage} alt={item.title} fill className="object-cover" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">{item.title}</h4>
                            <span className="text-xs text-zinc-500 block">{item.readTime} • {item.views} pembaca</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs text-emerald-400 font-semibold">{item.category}</td>
                      <td className="py-4 px-6 text-xs text-zinc-400">{item.author}</td>
                      <td className="py-4 px-6 text-xs text-zinc-400">{item.date}</td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`px-3 py-1 text-[10px] font-extrabold rounded-full ${
                            item.status === 'Published'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/berita/${item.slug || item.id}`}
                            target="_blank"
                            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition"
                            title="Pratinjau Artikel"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleOpenNewsModal(item)}
                            className="p-2 bg-zinc-800 hover:bg-emerald-600/30 text-emerald-400 rounded-xl transition"
                            title="Edit Artikel"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Hapus artikel ini secara permanen dari Supabase?')) {
                                deleteNews(item.id);
                                showToast('Berita Dihapus', 'Artikel dihapus dari database.', 'info');
                              }
                            }}
                            className="p-2 bg-zinc-800 hover:bg-rose-600/30 text-rose-400 rounded-xl transition"
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
      )}

      {/* TAB 2: DESTINASI WISATA */}
      {activeTab === 'wisata' && (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tourismSpots
                .filter((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((spot) => (
                  <div key={spot.id} className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col justify-between p-5 space-y-4 shadow-xl hover:border-emerald-500/40 transition-all">
                    <div className="space-y-3">
                      <div className="relative h-44 rounded-2xl overflow-hidden">
                        <Image src={spot.image} alt={spot.title} fill className="object-cover" />
                        <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                          {spot.badge}
                        </span>
                        <span className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-md text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                          ★ {spot.rating}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">{spot.category}</span>
                      <h3 className="font-bold text-white text-lg">{spot.title}</h3>
                      <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">{spot.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                      <span className="text-xs text-zinc-500 font-medium">Wisata Sidrap</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenSpotModal(spot)}
                          className="p-2 bg-zinc-800 hover:bg-emerald-600/30 text-emerald-400 rounded-xl transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Hapus destinasi wisata ini?')) {
                              deleteTourismSpot(spot.id);
                              showToast('Destinasi Dihapus', 'Spot wisata dihapus.', 'info');
                            }
                          }}
                          className="p-2 bg-zinc-800 hover:bg-rose-600/30 text-rose-400 rounded-xl transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-zinc-950/80 text-xs text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                  <tr>
                    <th className="py-4 px-6">Nama Destinasi</th>
                    <th className="py-4 px-6">Kategori</th>
                    <th className="py-4 px-6">Badge Label</th>
                    <th className="py-4 px-6 text-center">Rating</th>
                    <th className="py-4 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {tourismSpots
                    .filter((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((spot) => (
                      <tr key={spot.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-zinc-700">
                              <Image src={spot.image} alt={spot.title} fill className="object-cover" />
                            </div>
                            <span className="font-bold text-white">{spot.title}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-xs text-emerald-400 font-semibold">{spot.category}</td>
                        <td className="py-4 px-6 text-xs text-zinc-300">{spot.badge}</td>
                        <td className="py-4 px-6 text-center font-bold text-amber-400">★ {spot.rating}</td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleOpenSpotModal(spot)}
                              className="p-2 bg-zinc-800 hover:bg-emerald-600/30 text-emerald-400 rounded-xl transition"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Hapus spot ini?')) {
                                  deleteTourismSpot(spot.id);
                                  showToast('Wisata Dihapus', 'Data dihapus.', 'info');
                                }
                              }}
                              className="p-2 bg-zinc-800 hover:bg-rose-600/30 text-rose-400 rounded-xl transition"
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
          )}
        </>
      )}

      {/* TAB 3: PRODUK UMKM */}
      {activeTab === 'umkm' && (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {umkmProducts
                .filter((u) => u.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((prod) => (
                  <div key={prod.id} className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col justify-between p-4 space-y-3 shadow-xl hover:border-emerald-500/40 transition-all">
                    <div>
                      <div className="relative h-40 rounded-2xl overflow-hidden">
                        <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                        {prod.badge && (
                          <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                            {prod.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mt-3">{prod.category}</span>
                      <h4 className="font-bold text-white text-base mt-0.5">{prod.name}</h4>
                      <p className="text-sm font-extrabold text-emerald-400 mt-1">Rp {prod.price.toLocaleString('id-ID')} <span className="text-[10px] font-normal text-zinc-400">/ {prod.priceUnit}</span></p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                      <span className="text-[10px] text-zinc-500 font-medium truncate max-w-[120px]">{prod.seller}</span>
                      <div className="flex space-x-1.5">
                        <button
                          onClick={() => handleOpenUmkmModal(prod)}
                          className="p-1.5 bg-zinc-800 hover:bg-emerald-600/30 text-emerald-400 rounded-lg transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Hapus produk UMKM ini?')) {
                              deleteUmkmProduct(prod.id);
                              showToast('Produk Dihapus', 'Produk UMKM dihapus.', 'info');
                            }
                          }}
                          className="p-1.5 bg-zinc-800 hover:bg-rose-600/30 text-rose-400 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-zinc-950/80 text-xs text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                  <tr>
                    <th className="py-4 px-6">Nama Produk UMKM</th>
                    <th className="py-4 px-6">Kategori</th>
                    <th className="py-4 px-6">Penjual / Kelompok</th>
                    <th className="py-4 px-6">Harga (Rp)</th>
                    <th className="py-4 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {umkmProducts
                    .filter((u) => u.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((prod) => (
                      <tr key={prod.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-zinc-700">
                              <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                            </div>
                            <span className="font-bold text-white">{prod.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-xs text-emerald-400 font-semibold">{prod.category}</td>
                        <td className="py-4 px-6 text-xs text-zinc-300">{prod.seller}</td>
                        <td className="py-4 px-6 font-bold text-emerald-400">Rp {prod.price.toLocaleString('id-ID')}</td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleOpenUmkmModal(prod)}
                              className="p-2 bg-zinc-800 hover:bg-emerald-600/30 text-emerald-400 rounded-xl transition"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Hapus produk UMKM ini?')) {
                                  deleteUmkmProduct(prod.id);
                                  showToast('Produk Dihapus', 'Data dihapus.', 'info');
                                }
                              }}
                              className="p-2 bg-zinc-800 hover:bg-rose-600/30 text-rose-400 rounded-xl transition"
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
          )}
        </>
      )}

      {/* TAB 4: RESERVASI TIKET */}
      {activeTab === 'bookings' && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
          {bookings.length === 0 ? (
            <div className="p-16 text-center text-zinc-500 space-y-3">
              <Ticket className="w-12 h-12 mx-auto text-zinc-600" />
              <p className="text-sm font-semibold">Belum ada reservasi masuk dari pengunjung.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-zinc-950/80 text-xs text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                  <tr>
                    <th className="py-4 px-6">ID Kode</th>
                    <th className="py-4 px-6">Pemesan</th>
                    <th className="py-4 px-6">No. WhatsApp</th>
                    <th className="py-4 px-6">Tgl Kunjungan</th>
                    <th className="py-4 px-6">Detail Pesanan</th>
                    <th className="py-4 px-6">Total Biaya</th>
                    <th className="py-4 px-6 text-center">Status</th>
                    <th className="py-4 px-6 text-right">Aksi Kelola</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs text-emerald-400 font-bold">#{b.id.slice(0, 8)}</td>
                      <td className="py-4 px-6 font-semibold text-white">{b.userName}</td>
                      <td className="py-4 px-6 text-xs text-zinc-300">
                        <button
                          onClick={() => handleOpenWhatsAppGuest(b)}
                          className="flex items-center space-x-1 hover:text-emerald-400 underline font-medium"
                          title="Hubungi via WhatsApp"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{b.userPhone}</span>
                        </button>
                      </td>
                      <td className="py-4 px-6 text-xs text-zinc-300">{b.bookingDate}</td>
                      <td className="py-4 px-6 text-xs space-y-0.5">
                        <div>🎟️ {b.ticketQty} Tiket</div>
                        {b.tentQty > 0 && <div>⛺ {b.tentQty} Tenda</div>}
                        {b.guideIncluded && <div className="text-emerald-400 font-semibold">🧭 Pemandu Pokdarwis</div>}
                      </td>
                      <td className="py-4 px-6 font-extrabold text-emerald-400">Rp {b.totalPrice.toLocaleString('id-ID')}</td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`px-3 py-1 text-[10px] font-extrabold rounded-full ${
                            b.status === 'Confirmed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : b.status === 'Pending'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => {
                              updateBookingStatus(b.id, 'Confirmed');
                              showToast('Reservasi Dikonfirmasi', `Status pemesanan #${b.id.slice(0,8)} diubah menjadi Confirmed.`, 'success');
                            }}
                            className="p-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg transition"
                            title="Setujui Reservasi"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              updateBookingStatus(b.id, 'Cancelled');
                              showToast('Reservasi Dibatalkan', `Status pemesanan #${b.id.slice(0,8)} dibatalkan.`, 'info');
                            }}
                            className="p-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white rounded-lg transition"
                            title="Batalkan Reservasi"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: ULASAN WISATAWAN */}
      {activeTab === 'reviews' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 space-y-4 flex flex-col justify-between shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-500">{rev.date}</span>
                </div>
                <p className="text-xs text-zinc-300 italic leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                <div className="flex items-center space-x-2.5">
                  <Image src={rev.avatar} alt={rev.name} width={32} height={32} unoptimized className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <h5 className="text-xs font-bold text-white">{rev.name}</h5>
                    <span className="text-[10px] text-zinc-500">{rev.origin} • {rev.spot}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════
          5. MODALS WITH LIVE IMAGE PREVIEW
      ══════════════════════════════════════════════ */}

      {/* MODAL BERITA */}
      {isNewsModalOpen && (
        <div
          onClick={() => setIsNewsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-3xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl cursor-default"
          >
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
              <div>
                <h3 className="font-bold text-white text-lg">{editingNews ? 'Edit Artikel Berita' : 'Tambah Berita Baru'}</h3>
                <p className="text-[11px] text-zinc-400">Isi data artikel, foto utama, foto galeri liputan, serta embed video liputan.</p>
              </div>
              <button onClick={() => setIsNewsModalOpen(false)} className="text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNews} className="space-y-4 text-xs">
              {/* Judul Berita */}
              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Judul Berita Utama *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pesona Lautan Awan Puncak Punjabu 850 mdpl"
                  value={newsFormData.title}
                  onChange={(e) => setNewsFormData({ ...newsFormData, title: e.target.value })}
                  className="w-full p-3 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                />
              </div>

              {/* Grid Metadata 1: Kategori, Status, Featured */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Kategori Berita</label>
                  <select
                    value={newsFormData.category}
                    onChange={(e) => setNewsFormData({ ...newsFormData, category: e.target.value as NewsArticle['category'] })}
                    className="w-full p-3 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white focus:outline-none"
                  >
                    <option value="Wisata & Event">Wisata &amp; Event</option>
                    <option value="Kegiatan Desa">Kegiatan Desa</option>
                    <option value="Pembangunan">Pembangunan</option>
                    <option value="Ekonomi & UMKM">Ekonomi &amp; UMKM</option>
                    <option value="Pengumuman">Pengumuman</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Status Publikasi</label>
                  <select
                    value={newsFormData.status}
                    onChange={(e) => setNewsFormData({ ...newsFormData, status: e.target.value as NewsArticle['status'] })}
                    className="w-full p-3 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white focus:outline-none"
                  >
                    <option value="Published">Published (Tayang)</option>
                    <option value="Draft">Draft (Konsep)</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-zinc-300 font-semibold select-none">
                    <input
                      type="checkbox"
                      checked={newsFormData.featured}
                      onChange={(e) => setNewsFormData({ ...newsFormData, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-zinc-800 border-zinc-700"
                    />
                    <span>Tampilkan sbg Featured (Hero)</span>
                  </label>
                </div>
              </div>

              {/* Grid Metadata 2: Author, Role, Read Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Nama Penulis / Redaksi</label>
                  <input
                    type="text"
                    placeholder="Tim Redaksi Desa"
                    value={newsFormData.author}
                    onChange={(e) => setNewsFormData({ ...newsFormData, author: e.target.value })}
                    className="w-full p-3 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Jabatan Penulis</label>
                  <input
                    type="text"
                    placeholder="Pengelola Pokdarwis"
                    value={newsFormData.authorRole}
                    onChange={(e) => setNewsFormData({ ...newsFormData, authorRole: e.target.value })}
                    className="w-full p-3 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Estimasi Waktu Baca</label>
                  <input
                    type="text"
                    placeholder="3 min baca"
                    value={newsFormData.readTime}
                    onChange={(e) => setNewsFormData({ ...newsFormData, readTime: e.target.value })}
                    className="w-full p-3 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Ringkasan Singkat (Snippet Header) *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Ringkasan 1-2 kalimat untuk kartu berita dan Google SEO snippet..."
                  value={newsFormData.summary}
                  onChange={(e) => setNewsFormData({ ...newsFormData, summary: e.target.value })}
                  className="w-full p-3 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white focus:outline-none"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Isi Lengkap Artikel Berita *</label>
                <textarea
                  required
                  rows={7}
                  placeholder="Tuliskan isi berita lengkap di sini..."
                  value={newsFormData.content}
                  onChange={(e) => setNewsFormData({ ...newsFormData, content: e.target.value })}
                  className="w-full p-3 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white focus:outline-none font-sans leading-relaxed text-sm"
                />
              </div>

              {/* Cover Image URL */}
              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">URL Foto Sampul Utama (Cover Image)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={newsFormData.coverImage}
                  onChange={(e) => setNewsFormData({ ...newsFormData, coverImage: e.target.value })}
                  className="w-full p-3 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white focus:outline-none font-mono"
                />
                {newsFormData.coverImage && (
                  <div className="mt-2 relative h-36 w-full rounded-2xl overflow-hidden border border-zinc-700">
                    <Image src={newsFormData.coverImage} alt="Pratinjau Sampul" fill className="object-cover" />
                    <span className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-xs text-emerald-400 text-[10px] px-2.5 py-1 rounded-lg font-mono border border-emerald-500/30">
                      Live Preview Sampul Utama
                    </span>
                  </div>
                )}
              </div>

              {/* Additional Photos / Gallery Section */}
              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-emerald-400 font-bold flex items-center gap-1.5">
                    📷 Galeri Foto Liputan Tambahan
                  </label>
                  <span className="text-[10px] text-zinc-500">Pisahkan tiap URL dengan koma atau baris baru</span>
                </div>
                <textarea
                  rows={3}
                  placeholder="Paste URL foto liputan tambahan di sini...&#10;Contoh:&#10;https://images.unsplash.com/photo-1&#10;https://images.unsplash.com/photo-2"
                  value={newsFormData.galleryInput}
                  onChange={(e) => setNewsFormData({ ...newsFormData, galleryInput: e.target.value })}
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none font-mono text-xs"
                />
                {/* Live Preview Gallery Thumbnails */}
                {newsFormData.galleryInput.trim() && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-semibold text-zinc-400 block">Pratinjau Foto Galeri:</span>
                    <div className="grid grid-cols-4 gap-2">
                      {newsFormData.galleryInput
                        .split(/[\n,]+/)
                        .map((url) => url.trim())
                        .filter((url) => url.startsWith('http'))
                        .map((url, idx) => (
                          <div key={idx} className="relative h-20 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900">
                            <Image src={url} alt={`Preview ${idx + 1}`} fill className="object-cover" />
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Video Documentation URL */}
              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-rose-400 font-bold flex items-center gap-1.5">
                    🎥 Link Video Dokumentasi Liputan (YouTube / MP4)
                  </label>
                  <span className="text-[10px] text-zinc-500">Link YouTube biasa otomatis di-convert ke embed</span>
                </div>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                  value={newsFormData.videoUrl}
                  onChange={(e) => setNewsFormData({ ...newsFormData, videoUrl: e.target.value })}
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none font-mono text-xs"
                />
                {/* Live Preview Video Embed */}
                {newsFormData.videoUrl.trim() && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-semibold text-zinc-400 block">Pratinjau Player Video:</span>
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-zinc-800">
                      <iframe
                        src={
                          newsFormData.videoUrl.includes('youtube.com/watch?v=')
                            ? newsFormData.videoUrl.replace('watch?v=', 'embed/')
                            : newsFormData.videoUrl.includes('youtu.be/')
                            ? newsFormData.videoUrl.replace('youtu.be/', 'youtube.com/embed/')
                            : newsFormData.videoUrl
                        }
                        title="Preview Video Embed"
                        className="w-full h-full border-0"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Tags Input */}
              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Tags / Topik Berita</label>
                <input
                  type="text"
                  placeholder="Wisata, Sidrap, Punjabu, Lautan Awan"
                  value={newsFormData.tagsInput}
                  onChange={(e) => setNewsFormData({ ...newsFormData, tagsInput: e.target.value })}
                  className="w-full p-3 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white focus:outline-none"
                />
                <span className="text-[10px] text-zinc-500 block mt-1">Pisahkan kata kunci dengan koma</span>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-950 transition active:scale-95"
                >
                  Simpan Berita &amp; Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL WISATA */}
      {isSpotModalOpen && (
        <div
          onClick={() => setIsSpotModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl cursor-default"
          >
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
              <h3 className="font-bold text-white text-lg">{editingSpot ? 'Edit Spot Wisata' : 'Tambah Spot Wisata'}</h3>
              <button onClick={() => setIsSpotModalOpen(false)} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveSpot} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Nama Destinasi *</label>
                <input
                  type="text"
                  required
                  value={spotFormData.title}
                  onChange={(e) => setSpotFormData({ ...spotFormData, title: e.target.value })}
                  className="w-full p-3 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Kategori</label>
                  <input
                    type="text"
                    value={spotFormData.category}
                    onChange={(e) => setSpotFormData({ ...spotFormData, category: e.target.value })}
                    className="w-full p-3 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Badge Label</label>
                  <input
                    type="text"
                    value={spotFormData.badge}
                    onChange={(e) => setSpotFormData({ ...spotFormData, badge: e.target.value })}
                    className="w-full p-3 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Deskripsi Wisata *</label>
                <textarea
                  required
                  rows={3}
                  value={spotFormData.description}
                  onChange={(e) => setSpotFormData({ ...spotFormData, description: e.target.value })}
                  className="w-full p-3 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">URL Foto Destinasi</label>
                <input
                  type="text"
                  value={spotFormData.image}
                  onChange={(e) => setSpotFormData({ ...spotFormData, image: e.target.value })}
                  className="w-full p-3 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white focus:outline-none"
                />
                {spotFormData.image && (
                  <div className="mt-2 relative h-28 w-full rounded-xl overflow-hidden border border-zinc-700">
                    <Image src={spotFormData.image} alt="Pratinjau" fill className="object-cover" />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-zinc-800">
                <button type="button" onClick={() => setIsSpotModalOpen(false)} className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl">Batal</button>
                <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg">Simpan Wisata</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL UMKM */}
      {isUmkmModalOpen && (
        <div
          onClick={() => setIsUmkmModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl cursor-default"
          >
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
              <h3 className="font-bold text-white text-lg">{editingUmkm ? 'Edit Produk UMKM' : 'Tambah Produk UMKM'}</h3>
              <button onClick={() => setIsUmkmModalOpen(false)} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveUmkm} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Nama Produk *</label>
                <input
                  type="text"
                  required
                  value={umkmFormData.name}
                  onChange={(e) => setUmkmFormData({ ...umkmFormData, name: e.target.value })}
                  className="w-full p-3 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Harga (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={umkmFormData.price}
                    onChange={(e) => setUmkmFormData({ ...umkmFormData, price: Number(e.target.value) })}
                    className="w-full p-3 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Satuan Kemasan</label>
                  <input
                    type="text"
                    value={umkmFormData.priceUnit}
                    onChange={(e) => setUmkmFormData({ ...umkmFormData, priceUnit: e.target.value })}
                    className="w-full p-3 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Penjual / Kelompok UMKM</label>
                <input
                  type="text"
                  value={umkmFormData.seller}
                  onChange={(e) => setUmkmFormData({ ...umkmFormData, seller: e.target.value })}
                  className="w-full p-3 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Deskripsi Produk *</label>
                <textarea
                  required
                  rows={2}
                  value={umkmFormData.description}
                  onChange={(e) => setUmkmFormData({ ...umkmFormData, description: e.target.value })}
                  className="w-full p-3 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">URL Foto Produk</label>
                <input
                  type="text"
                  value={umkmFormData.image}
                  onChange={(e) => setUmkmFormData({ ...umkmFormData, image: e.target.value })}
                  className="w-full p-3 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white focus:outline-none"
                />
                {umkmFormData.image && (
                  <div className="mt-2 relative h-28 w-full rounded-xl overflow-hidden border border-zinc-700">
                    <Image src={umkmFormData.image} alt="Pratinjau" fill className="object-cover" />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-zinc-800">
                <button type="button" onClick={() => setIsUmkmModalOpen(false)} className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl">Batal</button>
                <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg">Simpan Produk</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
