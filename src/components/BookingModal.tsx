'use client';

import React, { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '@/context/AppContext';
import { showToast } from '@/components/Toast';
import { X, Calendar, Ticket, Tent, Compass, User, Phone, Mail, FileText, CheckCircle2, MessageSquare } from 'lucide-react';

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export const BookingModal: React.FC = () => {
  const { isBookingModalOpen, closeBookingModal, createBooking, user } = useApp();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const [userName, setUserName] = useState(user?.name || '');
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState(user?.email || '');

  useEffect(() => {
    if (isBookingModalOpen && user) {
      queueMicrotask(() => {
        if (user.name) setUserName((prev) => prev || user.name);
        if (user.email) setUserEmail((prev) => prev || user.email);
      });
    }
  }, [isBookingModalOpen, user]);

  const [bookingDate, setBookingDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [ticketQty, setTicketQty] = useState(1);
  const [tentQty, setTentQty] = useState(0);
  const [guideIncluded, setGuideIncluded] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{ id: string; total: number } | null>(null);

  const TICKET_PRICE = 10000;
  const TENT_PRICE = 50000;
  const GUIDE_PRICE = 100000;

  const totalPrice = ticketQty * TICKET_PRICE + tentQty * TENT_PRICE + (guideIncluded ? GUIDE_PRICE : 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userPhone.trim() || !bookingDate) {
      showToast('Form Belum Lengkap', 'Mohon isi nama lengkap, nomor Whatsapp, dan tanggal kunjungan.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createBooking({
        userName: userName.trim(),
        userPhone: userPhone.trim(),
        userEmail: userEmail.trim() || undefined,
        bookingDate,
        ticketQty,
        tentQty,
        guideIncluded,
        totalPrice,
        notes: notes.trim() || undefined,
      });

      if (result) {
        setConfirmedBooking({ id: result.id, total: totalPrice });
        showToast('Reservasi Berhasil!', `Kode Pemesanan Anda: #${result.id.slice(0, 8)}. Data telah tersimpan di sistem.`, 'success');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      showToast('Gagal Memproses Pemesanan', 'Terjadi kesalahan sistem. Silakan coba lagi.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenWhatsAppConfirmation = () => {
    if (!confirmedBooking) return;
    const message = `Halo Pokdarwis Bukit Punjabu! Saya telah melakukan pemesanan tiket online:%0A%0A` +
      `📌 *Kode Booking:* #${confirmedBooking.id.slice(0, 8)}%0A` +
      `👤 *Nama:* ${encodeURIComponent(userName)}%0A` +
      `📱 *No HP:* ${encodeURIComponent(userPhone)}%0A` +
      `📅 *Tanggal Kunjungan:* ${encodeURIComponent(bookingDate)}%0A` +
      `🎟️ *Jumlah Tiket:* ${ticketQty}x (Rp ${ (ticketQty * TICKET_PRICE).toLocaleString('id-ID') })%0A` +
      `⛺ *Tenda Camping:* ${tentQty}x (Rp ${ (tentQty * TENT_PRICE).toLocaleString('id-ID') })%0A` +
      `🧭 *Pemandu Lokal:* ${guideIncluded ? 'Ya (Rp 100.000)' : 'Tidak'}%0A` +
      `💰 *Total Pembayaran:* Rp ${confirmedBooking.total.toLocaleString('id-ID')}%0A%0A` +
      `Mohon konfirmasi pendaftaran tiket kami. Terima kasih!`;

    window.open(`https://wa.me/6282291117360?text=${message}`, '_blank');
  };

  const handleResetAndClose = useCallback(() => {
    setConfirmedBooking(null);
    setUserName('');
    setUserPhone('');
    setUserEmail('');
    setNotes('');
    setTicketQty(1);
    setTentQty(0);
    setGuideIncluded(false);
    closeBookingModal();
  }, [closeBookingModal]);

  useEffect(() => {
    if (!isBookingModalOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleResetAndClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isBookingModalOpen, handleResetAndClose]);

  if (!isBookingModalOpen || !mounted) return null;

  return createPortal(
    <div
      onClick={handleResetAndClose}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-zinc-900 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden my-8 cursor-default"
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-emerald-900/60 to-zinc-900 border-b border-zinc-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Reservasi Tiket & Camping</h2>
              <p className="text-xs text-zinc-400">Puncak Bukit Punjabu Sidrap (527 mdpl)</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Content: Confirmed state vs Form state */}
        {confirmedBooking ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white">Pemesanan Berhasil Disimpan!</h3>
              <p className="text-zinc-400 text-sm mt-1">
                Kode Booking Anda: <span className="text-emerald-400 font-mono font-bold">#{confirmedBooking.id.slice(0, 8)}</span>
              </p>
            </div>

            <div className="p-4 bg-zinc-800/80 rounded-xl text-left border border-zinc-700 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Atas Nama:</span>
                <span className="font-semibold text-white">{userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Tanggal Kunjungan:</span>
                <span className="font-semibold text-white">{bookingDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Tiket Masuk:</span>
                <span className="text-white">{ticketQty} Orang</span>
              </div>
              {tentQty > 0 && (
                <div className="flex justify-between">
                  <span className="text-zinc-400">Sewa Tenda:</span>
                  <span className="text-white">{tentQty} Tenda</span>
                </div>
              )}
              <div className="pt-2 border-t border-zinc-700 flex justify-between font-bold text-base">
                <span className="text-emerald-400">Total Biaya:</span>
                <span className="text-emerald-400">Rp {confirmedBooking.total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleOpenWhatsAppConfirmation}
                className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-900/30"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Konfirmasi via WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="py-3 px-5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Informasi Pengunjung */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Identitas Pemesan</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Nama Lengkap *</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">No. WhatsApp *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                    <input
                      type="tel"
                      required
                      placeholder="0812xxxxxxx"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Email (Opsional)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Tanggal & Pilihan Tiket */}
            <div className="space-y-4 pt-2 border-t border-zinc-800">
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Detail Kunjungan</h3>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Tanggal Kunjungan *</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tiket Masuk */}
                <div className="p-3 bg-zinc-800/60 rounded-xl border border-zinc-700 flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-white font-medium text-sm">
                      <Ticket className="w-4 h-4 text-emerald-400" />
                      <span>Tiket Masuk</span>
                    </div>
                    <span className="text-xs text-zinc-400">Rp 10.000 / orang</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setTicketQty(Math.max(1, ticketQty - 1))}
                      className="w-7 h-7 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-bold"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold text-white text-sm">{ticketQty}</span>
                    <button
                      type="button"
                      onClick={() => setTicketQty(ticketQty + 1)}
                      className="w-7 h-7 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Sewa Tenda */}
                <div className="p-3 bg-zinc-800/60 rounded-xl border border-zinc-700 flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-white font-medium text-sm">
                      <Tent className="w-4 h-4 text-emerald-400" />
                      <span>Sewa Tenda</span>
                    </div>
                    <span className="text-xs text-zinc-400">Rp 50.000 / unit</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setTentQty(Math.max(0, tentQty - 1))}
                      className="w-7 h-7 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-bold"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold text-white text-sm">{tentQty}</span>
                    <button
                      type="button"
                      onClick={() => setTentQty(tentQty + 1)}
                      className="w-7 h-7 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Opsi Pemandu & Catatan */}
              <div className="flex items-center justify-between p-3 bg-zinc-800/60 rounded-xl border border-zinc-700">
                <div className="flex items-center space-x-3">
                  <Compass className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="block text-sm font-medium text-white">Layanan Pemandu Lokal (Pokdarwis)</span>
                    <span className="text-xs text-zinc-400">Rp 100.000 / grup (Jelajah puncak & spot sunrise)</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={guideIncluded}
                  onChange={(e) => setGuideIncluded(e.target.checked)}
                  className="w-5 h-5 text-emerald-500 rounded border-zinc-700 bg-zinc-900 focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Catatan Tambahan (Opsional)</label>
                <div className="relative">
                  <FileText className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                  <textarea
                    rows={2}
                    placeholder="Contoh: Bawa anak kecil, request lokasi camp dekat musholla"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Total Biaya & Tombol Submit */}
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/20 rounded-xl flex items-center justify-between mt-4">
              <div>
                <span className="text-xs text-zinc-400 uppercase tracking-wider block">Total Pembayaran</span>
                <span className="text-2xl font-extrabold text-emerald-400">Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-3 px-6 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-emerald-950 transition-all flex items-center space-x-2"
              >
                <span>{isSubmitting ? 'Memproses...' : 'Pesan Sekarang'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};
