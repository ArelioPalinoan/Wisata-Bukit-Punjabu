'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  X, Ticket, Tent, Calendar, Users, Check,
  MessageSquare, ShieldCheck, Plus, Minus,
} from 'lucide-react';

export const BookingModal: React.FC = () => {
  const { isBookingModalOpen, closeBookingModal } = useApp();

  const [bookingType, setBookingType] = useState<'harian' | 'camping'>('camping');
  const [visitorCount, setVisitorCount] = useState(2);
  const [visitDate, setVisitDate] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Add-on rentals
  const [rentTenda, setRentTenda] = useState(1);
  const [rentSleepingBag, setRentSleepingBag] = useState(2);
  const [rentMatras, setRentMatras] = useState(2);

  // Safely initialize date & reset state on client side using queueMicrotask
  // to avoid React 19 / Next.js set-state-in-effect linter errors
  useEffect(() => {
    if (isBookingModalOpen) {
      queueMicrotask(() => {
        setBookingType('camping');
        setVisitorCount(2);
        setName('');
        setPhone('');
        setRentTenda(1);
        setRentSleepingBag(2);
        setRentMatras(2);

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setVisitDate(tomorrow.toISOString().split('T')[0]);
      });
    }
  }, [isBookingModalOpen]);

  if (!isBookingModalOpen) return null;

  // --- Price calculation ---
  const pricePerPerson = bookingType === 'harian' ? 10000 : 20000;
  const totalTiket = visitorCount * pricePerPerson;
  const totalSewa =
    bookingType === 'camping'
      ? rentTenda * 60000 + rentSleepingBag * 15000 + rentMatras * 10000
      : 0;
  const grandTotal = totalTiket + totalSewa;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Async save to Supabase if configured
    try {
      const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
      if (isSupabaseConfigured() && supabase) {
        await supabase.from('bookings').insert([
          {
            user_name: name || 'Pengunjung',
            user_phone: phone || '-',
            booking_date: visitDate || new Date().toISOString().split('T')[0],
            ticket_qty: visitorCount,
            tent_qty: rentTenda,
            total_price: grandTotal,
            notes: `Type: ${bookingType}, SB: ${rentSleepingBag}, Matras: ${rentMatras}`,
            status: 'Pending',
          },
        ]);
      }
    } catch (err) {
      console.warn('Could not save booking to Supabase:', err);
    }

    const fmt = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(grandTotal);

    let detail = `• Jenis Tiket: ${bookingType === 'harian' ? 'Tiket Masuk Harian (Rp 10.000)' : 'Tiket Camping Night (Rp 20.000)'}\n`;
    detail += `• Jumlah Pengunjung: ${visitorCount} orang\n`;
    detail += `• Tanggal Kunjungan: ${visitDate}\n`;

    if (bookingType === 'camping' && (rentTenda > 0 || rentSleepingBag > 0 || rentMatras > 0)) {
      detail += `\n*Perlengkapan Tambahan:*\n`;
      if (rentTenda > 0) detail += `  - Tenda Dome (4p): ${rentTenda} unit\n`;
      if (rentSleepingBag > 0) detail += `  - Sleeping Bag: ${rentSleepingBag} pcs\n`;
      if (rentMatras > 0) detail += `  - Matras Camping: ${rentMatras} pcs\n`;
    }

    const msg =
      `Halo Pokdarwis Bukit Punjabu Sidrap! 👋\nSaya ingin melakukan reservasi tiket wisata:\n\n` +
      `*Data Pemesan:*\n• Nama: ${name || 'Pengunjung'}\n• No HP: ${phone || '-'}\n\n` +
      `*Rincian Reservasi:*\n${detail}\n*Total Estimasi Biaya:* ${fmt}\n\n` +
      `Mohon informasi konfirmasi ketersediaan tempat dan cara pembayarannya. Terima kasih!`;

    window.open(`https://wa.me/6285255558910?text=${encodeURIComponent(msg)}`, '_blank');
    closeBookingModal();
  };

  const noFocus: React.CSSProperties = {
    outline: 'none',
    boxShadow: 'none',
    WebkitTapHighlightColor: 'transparent',
  };

  const rentalItems = [
    { name: 'Tenda Dome (Kapasitas 4 orang)', price: 60000, unit: 'tenda/malam', val: rentTenda, set: setRentTenda },
    { name: 'Sleeping Bag Warm', price: 15000, unit: 'pcs/malam', val: rentSleepingBag, set: setRentSleepingBag },
    { name: 'Matras Outdoor Waterproof', price: 10000, unit: 'pcs/malam', val: rentMatras, set: setRentMatras },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={closeBookingModal}
    >
      <div
        className="relative w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-scale-in max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Reservasi Tiket &amp; Camping</h2>
              <p className="text-xs text-emerald-100">Wisata Bukit Punjabu Desa Buntu Buangin • Sidrap</p>
            </div>
          </div>
          <button onClick={closeBookingModal} style={noFocus} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5 text-zinc-900 dark:text-white">

          {/* Booking Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              Pilih Jenis Kunjungan
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { type: 'harian' as const, label: 'Masuk Harian', price: 'Rp 10.000 / orang', Icon: Ticket },
                  { type: 'camping' as const, label: 'Camping Night',  price: 'Rp 20.000 / orang', Icon: Tent  },
                ] as const
              ).map(({ type, label, price, Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setBookingType(type)}
                  style={noFocus}
                  className={`p-4 rounded-2xl border text-left transition-colors flex items-center justify-between ${
                    bookingType === type
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/40 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 text-sm">
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </div>
                    <span className="text-xs text-zinc-400 mt-1 block">{price}</span>
                  </div>
                  {bookingType === type && <Check className="w-5 h-5 text-emerald-500 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                Tanggal Kunjungan
              </label>
              <input
                type="date"
                required
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                style={noFocus}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-sm transition-colors focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-500" />
                Jumlah Pengunjung
              </label>
              <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700">
                <span className="text-sm font-bold">{visitorCount} Orang</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setVisitorCount(Math.max(1, visitorCount - 1))} style={noFocus} className="p-1 rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-emerald-500 hover:text-white transition-colors">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => setVisitorCount(visitorCount + 1)} style={noFocus} className="p-1 rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-emerald-500 hover:text-white transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Nama Pemesan</label>
              <input type="text" placeholder="Contoh: Ahmad Hidayat" value={name} onChange={(e) => setName(e.target.value)} style={noFocus} className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">No. WhatsApp</label>
              <input type="tel" placeholder="0812xxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} style={noFocus} className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-sm" />
            </div>
          </div>

          {/* Add-on rentals (camping only) */}
          {bookingType === 'camping' && (
            <div className="p-4 rounded-2xl bg-zinc-100/80 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 space-y-3">
              <span className="block text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Sewa Perlengkapan Camping (Opsional)
              </span>
              {rentalItems.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs py-1.5 border-b border-zinc-200/60 dark:border-zinc-700/40 last:border-none">
                  <div>
                    <span className="font-semibold block text-zinc-800 dark:text-zinc-200">{item.name}</span>
                    <span className="text-zinc-500">Rp {item.price.toLocaleString('id-ID')} / {item.unit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => item.set(Math.max(0, item.val - 1))} style={noFocus} className="p-1 rounded-md bg-zinc-200 dark:bg-zinc-700 hover:bg-emerald-500 hover:text-white transition-colors">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold w-4 text-center">{item.val}</span>
                    <button type="button" onClick={() => item.set(item.val + 1)} style={noFocus} className="p-1 rounded-md bg-zinc-200 dark:bg-zinc-700 hover:bg-emerald-500 hover:text-white transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Price Summary */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 block font-medium">Total Estimasi Pembayaran:</span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                Rp {grandTotal.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="text-right text-[11px] text-zinc-400">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold justify-end">
                <ShieldCheck className="w-3.5 h-3.5" /> Resmi Pokdarwis
              </span>
              <span>Bayar di lokasi / transfer WA</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            style={noFocus}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 transition-colors flex items-center justify-center gap-2 text-base cursor-pointer active:scale-95"
          >
            <MessageSquare className="w-5 h-5" />
            Lanjut Reservasi via WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
};
