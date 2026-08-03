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
} from 'lucide-react';

export default function DetailBeritaPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { newsList, incrementNewsViews, fetchNewsComments, addNewsComment, user } = useApp();
  const [commentText, setCommentText] = useState('');
  const [authorNameInput, setAuthorNameInput] = useState('');
  const [comments, setComments] = useState<Array<{ id: string; author: string; text: string; date: string }>>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const article = newsList.find((n) => n.id === resolvedParams.id || n.slug === resolvedParams.id) || newsList[0];

  // Auto increment view count & load real comments on mount
  React.useEffect(() => {
    if (article?.id) {
      incrementNewsViews(article.id);
      fetchNewsComments(article.id).then((data) => setComments(data));
    }
  }, [article?.id]);

  if (!article) {
    return (
      <div className="pt-32 pb-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Berita Tidak Ditemukan</h1>
        <Link href="/berita" className="text-emerald-500 underline">
          Kembali ke Portal Berita
        </Link>
      </div>
    );
  }

  const isUnsplashCover = article.coverImage?.includes('images.unsplash.com');

  // Dynamic Word Count & Read Time Calculation
  const wordCount = (article.content || article.summary || '').split(/\s+/).filter(Boolean).length;
  const calculatedReadTime = `${Math.max(1, Math.ceil(wordCount / 150))} min baca`;
  const displayReadTime = article.readTime || calculatedReadTime;

  // Related articles in same category or recent
  const relatedArticles = newsList
    .filter((n) => n.id !== article.id && (!n.status || n.status.toLowerCase() === 'published'))
    .slice(0, 3);

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
    <div className="pt-28 pb-20 space-y-12">
      {/* Back Button Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link
          href="/berita"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Berita
        </Link>
      </div>

      {/* Main Article Container */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header Metadata */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow">
              <Tag className="w-3.5 h-3.5" />
              {article.category}
            </span>
            {article.featured && (
              <span className="bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs font-bold px-3 py-1 rounded-full">
                Featured
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
            {/* Author Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow">
                {article.author.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-zinc-900 dark:text-white text-sm">{article.author}</p>
                <p className="text-[11px] text-zinc-500">{article.authorRole}</p>
              </div>
            </div>

            {/* Time & Views */}
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-emerald-500" />
                {article.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-zinc-400" />
                {displayReadTime}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4 text-zinc-400" />
                {article.views} Pembaca
              </span>
            </div>
          </div>
        </div>

        {/* Hero Cover Image */}
        <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            priority
            unoptimized={!isUnsplashCover}
            className="object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-zinc-900/80 backdrop-blur-xs text-xs text-zinc-300 text-center italic z-10">
            Foto Sampul: Dokumentasi Wisata Bukit Punjabu
          </div>
        </div>

        {/* Narrative Article Content */}
        <div className="prose dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200 text-base leading-relaxed space-y-6 whitespace-pre-line font-serif sm:font-sans">
          {article.content}
        </div>

        {/* Photo Gallery Media Section */}
        {article.gallery && article.gallery.length > 0 && (
          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-emerald-500" />
              Galeri Foto Liputan
            </h3>
            <p className="text-xs text-zinc-500">Klik gambar untuk melihat tampilan penuh resolusi tinggi.</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {article.gallery.map((imgUrl, i) => (
                <div
                  key={i}
                  onClick={() => setLightboxImage(imgUrl)}
                  className="group relative h-40 rounded-2xl overflow-hidden cursor-pointer shadow-md border border-zinc-200 dark:border-zinc-800"
                >
                  <Image
                    src={imgUrl}
                    alt={`Dokumentasi ${i + 1}`}
                    fill
                    unoptimized={!imgUrl.includes('images.unsplash.com')}
                    className="object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold">
                    Perbesar
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video Coverage Section */}
        {article.videoUrl && (
          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-red-500" />
              Liputan Video Dokumentasi
            </h3>
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-zinc-950 shadow-xl border border-zinc-800">
              <iframe
                src={article.videoUrl}
                title="Video Liputan"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Social Share Bar */}
        <div className="p-6 rounded-2xl bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-emerald-500" />
            Bagikan Berita Ini:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow"
            >
              {copiedLink ? <CheckCircle className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4" />}
              {copiedLink ? 'Link Tersalin!' : 'Salin Tautan'}
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 space-y-6">
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-500" />
            Tanggapan Pengunjung ({comments.length})
          </h3>

          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="space-y-3">
            {!user && (
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
              placeholder="Tuliskan pendapat atau kesan Anda mengenai berita ini..."
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

      {/* Lightbox Image View */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative w-full max-w-4xl h-[85vh]">
            <Image
              src={lightboxImage}
              alt="Large preview"
              fill
              unoptimized={!lightboxImage.includes('images.unsplash.com')}
              className="rounded-2xl object-contain"
            />
          </div>
        </div>
      )}

      {/* Related News Section */}
      {relatedArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-zinc-200 dark:border-zinc-800 space-y-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Berita Terkait Lainnya
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
