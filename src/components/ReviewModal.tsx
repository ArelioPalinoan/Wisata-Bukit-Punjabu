'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '@/context/AppContext';
import { X, Star, Send, MapPin, Sparkles, UserCheck } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SPOT_OPTIONS = [
  'Puncak Punjabu (527 mdpl)',
  'Spot Sunrise & Awan',
  'Area Camping Ground',
  'Spot Foto Hati Estetik',
  'Kebun Cengkih & Wisata Alam',
  'Kedai Kopi & Gula Tappo',
  'Wisata Punjabu Secara Keseluruhan',
];

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose }) => {
  const { user, addReview, mounted } = useApp();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [spot, setSpot] = useState<string>(SPOT_OPTIONS[0]);
  const [origin, setOrigin] = useState<string>('Makassar');
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim() || submitting) return;

    setSubmitting(true);
    try {
      await addReview({
        name: user.name,
        origin: origin.trim() || 'Wisatawan',
        rating,
        comment: comment.trim(),
        avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=059669&color=fff`,
        spot,
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setComment('');
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const noFocusStyle: React.CSSProperties = {
    outline: 'none',
    boxShadow: 'none',
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-zinc-900 dark:text-white">Beri Ulasan &amp; Rating</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Bagikan pengalaman seru Anda di Bukit Punjabu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={noFocusStyle}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-3 animate-fade-in">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
              <Sparkles className="w-8 h-8 animate-bounce" />
            </div>
            <h4 className="text-xl font-extrabold text-zinc-900 dark:text-white">Ulasan Berhasil Dikirim!</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Terima kasih telah memberikan ulasan untuk Wisata Bukit Punjabu.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Logged in User Profile Info Badge */}
            {user && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                {user.avatar ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=059669&color=fff`;
                    }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                    {user.name}
                    <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                  </h4>
                  <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 font-medium">
                    Mengulas sebagai pengguna terverifikasi
                  </p>
                </div>
              </div>
            )}

            {/* Star Rating Picker */}
            <div className="space-y-2 text-center py-2 bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Pilih Rating Bintang
              </label>
              <div className="flex items-center justify-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = star <= (hoverRating || rating);
                  return (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      style={noFocusStyle}
                      className="p-1 transition-transform hover:scale-125 cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          isActive
                            ? 'fill-amber-400 text-amber-400 drop-shadow-md'
                            : 'text-zinc-300 dark:text-zinc-700'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="inline-block text-xs font-bold text-amber-500 pt-1">
                {rating === 5 && 'Sangat Bagus (5/5)'}
                {rating === 4 && 'Bagus (4/5)'}
                {rating === 3 && 'Cukup (3/5)'}
                {rating === 2 && 'Kurang (2/5)'}
                {rating === 1 && 'Sangat Kurang (1/5)'}
              </span>
            </div>

            {/* Spot / Lokasi */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                Spot / Fasilitas Yang Diulas
              </label>
              <select
                value={spot}
                onChange={(e) => setSpot(e.target.value)}
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs sm:text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-pointer"
              >
                {SPOT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Kota / Asal Pengunjung */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Kota / Kota Asal Anda
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Makassar, Sidrap, Pinrang..."
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            {/* Ulasan Teks */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Pesan Ulasan &amp; Kesan Anda
              </label>
              <textarea
                rows={3}
                required
                placeholder="Ceritakan pengalaman Anda saat berkunjung ke Bukit Punjabu..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                style={noFocusStyle}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Mengirim Ulasan...' : 'Kirim Ulasan & Rating'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};
