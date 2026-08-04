'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { NewsCard } from '@/components/NewsCard';
import {
  Calendar,
  Eye,
  Clock,
  ArrowLeft,
  Share2,
  Tag,
  MessageSquare,
  Send,
  Video,
  Image as ImageIcon,
  CheckCircle,
  Quote,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Bookmark,
} from 'lucide-react';

export default function DetailBeritaPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { newsList, incrementNewsViews, fetchNewsComments, addNewsComment, user } = useApp();
  const [commentText, setCommentText] = useState('');
  const [authorNameInput, setAuthorNameInput] = useState('');
  const [comments, setComments] = useState<Array<{ id: string; author: string; text: string; date: string }>>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const articleIndex = newsList.findIndex((n) => n.id === resolvedParams.id || n.slug === resolvedParams.id);
  const article = articleIndex !== -1 ? newsList[articleIndex] : undefined;

  // Auto increment view count & load real comments on mount
  React.useEffect(() => {
    if (article?.id) {
      incrementNewsViews(article.id);
      fetchNewsComments(article.id).then((data) => setComments(data));
    }
  }, [article?.id, incrementNewsViews, fetchNewsComments]);

  if (!article) {
    return (
      <div className="pt-32 pb-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Berita Tidak Ditemukan</h1>
        <Link href="/berita" className="text-emerald-500 underline font-semibold">
          Kembali ke Portal Berita
        </Link>
      </div>
    );
  }

  const isUnsplashCover = article.coverImage?.includes('images.unsplash.com');

  // Helper for YouTube embed URL conversion
  const getEmbedVideoUrl = (url?: string) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (trimmed.includes('youtube.com/embed/')) return trimmed;
    const match = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return trimmed;
  };

  const embeddedVideoUrl = getEmbedVideoUrl(article.videoUrl);

  // Dynamic Word Count & Read Time Calculation
  const wordCount = (article.content || article.summary || '').split(/\s+/).filter(Boolean).length;
  const calculatedReadTime = `${Math.max(1, Math.ceil(wordCount / 150))} min baca`;
  const displayReadTime = article.readTime || calculatedReadTime;

  // Next & Previous Articles
  const prevArticle = articleIndex > 0 ? newsList[articleIndex - 1] : null;
  const nextArticle = articleIndex < newsList.length - 1 ? newsList[articleIndex + 1] : null;

  // Related articles in same category or recent
  const relatedArticles = newsList
    .filter((n) => n.id !== article.id && (!n.status || n.status.toLowerCase() === 'published'))
    .slice(0, 3);

  // Split content into clean paragraphs
  const paragraphs = article.content
    ? article.content.split(/\n\s*\n/).filter((p) => p.trim().length > 0)
    : [article.summary];

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const author = user?.name || authorNameInput.trim() || 'Pengunjung Desa';
    const newComment = await addNewsComment(article.id, author, commentText.trim());

    if (newComment) {
      setComments((prev) => [newComment, ...prev]);
    }
    setCommentText('');
    setAuthorNameInput('');
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="pt-28 pb-24 space-y-12 animate-fade-in">
      {/* Top Breadcrumb Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link
          href="/berita"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Portal Berita</span>
        </Link>
        <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:inline">
          Sidrap Media Portal • Desa Buntu Buangin
        </span>
      </div>

      {/* Main Article Container */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Header Title & Meta Section */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="bg-emerald-600 text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
              <Tag className="w-3.5 h-3.5" />
              {article.category}
            </span>
            {article.featured && (
              <span className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Hero
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white leading-[1.15] tracking-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
            {/* Author Profile Card */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-extrabold flex items-center justify-center text-base shadow-md border-2 border-white dark:border-zinc-900">
                {article.author.charAt(0)}
              </div>
              <div>
                <p className="font-extrabold text-zinc-900 dark:text-white text-sm">{article.author}</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{article.authorRole}</p>
              </div>
            </div>

            {/* Time & Views Counters */}
            <div className="flex items-center gap-4 sm:gap-6 text-xs font-semibold">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-500" />
                {article.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-zinc-400" />
                {displayReadTime}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-500" />
                {article.views} Pembaca
              </span>
            </div>
          </div>
        </div>

        {/* Hero Cover Image Banner */}
        <div className="space-y-2">
          <div
            onClick={() => setLightboxIndex(-1)}
            className="group relative h-80 sm:h-[420px] w-full rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 cursor-pointer"
          >
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority
              unoptimized={!isUnsplashCover}
              className="object-cover group-hover:scale-105 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white z-10 font-medium">
              <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                📷 Foto Sampul Utama • Klik untuk perbesar
              </span>
              <span className="hidden sm:inline-block bg-emerald-600/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold">
                Dokumentasi Resmi Punjabu
              </span>
            </div>
          </div>
        </div>

        {/* Lead Executive Summary Callout */}
        {article.summary && (
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-emerald-50/80 via-teal-50/40 to-white dark:from-emerald-950/40 dark:via-zinc-900 dark:to-zinc-900 border border-emerald-500/30 shadow-lg space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Quote className="w-24 h-24 text-emerald-500" />
            </div>
            <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <Bookmark className="w-4 h-4" />
              <span>Ringkasan Liputan Utama</span>
            </div>
            <p className="text-base sm:text-lg font-semibold text-zinc-800 dark:text-zinc-100 leading-relaxed italic relative z-10">
              &ldquo;{article.summary}&rdquo;
            </p>
          </div>
        )}

        {/* Article Editorial Content */}
        <div className="space-y-6 text-zinc-800 dark:text-zinc-200 text-base sm:text-lg leading-relaxed font-sans">
          {paragraphs.map((pText, i) => (
            <p
              key={i}
              className={`${
                i === 0
                  ? 'first-letter:float-left first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:text-emerald-600 dark:first-letter:text-emerald-400 first-letter:leading-none'
                  : ''
              } leading-relaxed sm:leading-loose text-zinc-800 dark:text-zinc-200 font-medium`}
            >
              {pText}
            </p>
          ))}
        </div>

        {/* Article Tags Section */}
        {article.tags && article.tags.length > 0 && (
          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block uppercase tracking-wider">
              Kata Kunci &amp; Topik Terkait:
            </span>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/90 text-zinc-700 dark:text-zinc-300 text-xs font-semibold border border-zinc-200 dark:border-zinc-700/80 hover:border-emerald-500 transition cursor-default"
                >
                  #{tag.replace(/^#/, '')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Photo Gallery Media Section */}
        {article.gallery && article.gallery.length > 0 && (
          <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-500" />
                Galeri Foto Liputan ({article.gallery.length} Foto)
              </h3>
              <span className="text-xs text-zinc-500">Klik untuk perbesar foto</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {article.gallery.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative h-44 rounded-2xl overflow-hidden cursor-pointer shadow-md border border-zinc-200 dark:border-zinc-800"
                >
                  <Image
                    src={imgUrl}
                    alt={`Dokumentasi liputan ${idx + 1}`}
                    fill
                    unoptimized={!imgUrl.includes('images.unsplash.com')}
                    className="object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white text-xs font-bold gap-1">
                    <span>Lihat Foto #{idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video Coverage Section */}
        {embeddedVideoUrl && (
          <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
            <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-red-500" />
              Liputan Video Dokumentasi Resmi
            </h3>
            <div className="relative rounded-3xl overflow-hidden aspect-video bg-zinc-950 shadow-2xl border border-zinc-800">
              <iframe
                src={embeddedVideoUrl}
                title={`Video Liputan ${article.title}`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Redaksi Author Signature Box */}
        <div className="p-6 rounded-3xl bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black flex items-center justify-center text-lg shadow-md shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-zinc-900 dark:text-white text-sm">
                Dipublikasikan oleh {article.author}
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {article.authorRole} • Tim Media Informasi Wisata Bukit Punjabu Sidrap
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyLink}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-md shrink-0"
          >
            {copiedLink ? <CheckCircle className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? 'Link Tersalin!' : 'Bagikan Berita'}</span>
          </button>
        </div>

        {/* Previous & Next Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          {prevArticle ? (
            <Link
              href={`/berita/${prevArticle.slug || prevArticle.id}`}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 hover:border-emerald-500 transition space-y-1 text-left group"
            >
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                Artikel Sebelumnya
              </span>
              <p className="text-xs font-extrabold text-zinc-900 dark:text-white line-clamp-1">
                {prevArticle.title}
              </p>
            </Link>
          ) : <div />}

          {nextArticle && (
            <Link
              href={`/berita/${nextArticle.slug || nextArticle.id}`}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 hover:border-emerald-500 transition space-y-1 text-right group"
            >
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                Artikel Selanjutnya
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
              <p className="text-xs font-extrabold text-zinc-900 dark:text-white line-clamp-1">
                {nextArticle.title}
              </p>
            </Link>
          )}
        </div>

        {/* Comments Section */}
        <div className="pt-10 border-t border-zinc-200 dark:border-zinc-800 space-y-6">
          <h3 className="text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-500" />
            Tanggapan &amp; Komentar Pengunjung ({comments.length})
          </h3>

          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="space-y-3">
            {user ? (
              <div className="flex items-center gap-2.5 p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-emerald-500/40"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=059669&color=fff`;
                    }}
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  Mengomentari sebagai <strong className="font-extrabold">{user.name}</strong>
                </span>
              </div>
            ) : (
              <input
                type="text"
                placeholder="Nama Anda (contoh: Rahmat - Makassar)"
                value={authorNameInput}
                onChange={(e) => setAuthorNameInput(e.target.value)}
                className="w-full p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            )}
            <textarea
              rows={3}
              required
              placeholder="Tuliskan tanggapan atau saran Anda mengenai berita liputan ini..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition"
              >
                <Send className="w-3.5 h-3.5" />
                Kirim Komentar
              </button>
            </div>
          </form>

          {/* Comment List */}
          <div className="space-y-4 pt-2">
            {comments.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-900 dark:text-white">{c.author}</span>
                  <span className="text-zinc-400">{c.date}</span>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </article>

      {/* Lightbox Image View Modal with Prev/Next Navigation */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 text-white bg-zinc-800 hover:bg-zinc-700 p-2.5 rounded-full z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {article.gallery && article.gallery.length > 1 && lightboxIndex >= 0 && (
            <>
              <button
                onClick={() =>
                  setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : article.gallery.length - 1))
                }
                className="absolute left-4 text-white bg-zinc-800/80 hover:bg-zinc-700 p-3 rounded-full z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() =>
                  setLightboxIndex((prev) => (prev !== null && prev < article.gallery.length - 1 ? prev + 1 : 0))
                }
                className="absolute right-4 text-white bg-zinc-800/80 hover:bg-zinc-700 p-3 rounded-full z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="relative w-full max-w-5xl h-[85vh]">
            <Image
              src={lightboxIndex === -1 ? article.coverImage : article.gallery[lightboxIndex]}
              alt="Lightbox Preview"
              fill
              unoptimized
              className="rounded-2xl object-contain"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-zinc-900/90 text-white text-xs font-bold px-4 py-2 rounded-full border border-zinc-800">
              {lightboxIndex === -1
                ? 'Foto Sampul Utama'
                : `Foto Galeri ${lightboxIndex + 1} dari ${article.gallery.length}`}
            </div>
          </div>
        </div>
      )}

      {/* Related News Section */}
      {relatedArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-zinc-200 dark:border-zinc-800 space-y-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Berita Liputan Terkait Lainnya
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((item) => (
              <NewsCard key={item.id} article={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
