'use client';

import React from 'react';
import Link from 'next/link';
import { Mountain, MapPin, Mail, Phone, Heart, Globe, Camera, Video } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-zinc-900">
          {/* Brand & Description */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white">
                <Mountain className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Bukit Punjabu
              </span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400">
              Destinasi pariwisata alam unggulan dan portal media informasi resmi Desa Wisata Bukit Punjabu. Menghadirkan pesona samudera awan, kearifan lokal, dan informasi berita desa terupdate.
            </p>
            <div className="flex items-center gap-3 text-zinc-400 pt-2">
              <a href="#" className="p-2.5 rounded-xl bg-zinc-900 hover:bg-emerald-600 hover:text-white transition" title="Instagram">
                <Camera className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-xl bg-zinc-900 hover:bg-emerald-600 hover:text-white transition" title="Website Desa">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-xl bg-zinc-900 hover:bg-emerald-600 hover:text-white transition" title="Youtube Liputan">
                <Video className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide uppercase text-xs text-emerald-400">
              Navigasi Utama
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/#profil-desa" className="hover:text-emerald-400 transition">
                  Profil Desa Buntu Buangin
                </Link>
              </li>
              <li>
                <Link href="/#wisata" className="hover:text-emerald-400 transition">
                  Atraksi & Fasilitas
                </Link>
              </li>
              <li>
                <Link href="/berita" className="hover:text-emerald-400 transition">
                  Portal Berita Desa
                </Link>
              </li>
              <li>
                <Link href="/#galeri" className="hover:text-emerald-400 transition">
                  Galeri Foto & Video
                </Link>
              </li>
              <li>
                <Link href="/#informasi" className="hover:text-emerald-400 transition">
                  Tiket & Petunjuk Rute
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide uppercase text-xs text-emerald-400">
              Kategori Berita
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/berita?cat=Wisata+%26+Event" className="hover:text-emerald-400 transition">
                  Wisata & Event
                </Link>
              </li>
              <li>
                <Link href="/berita?cat=Kegiatan+Desa" className="hover:text-emerald-400 transition">
                  Kegiatan Desa
                </Link>
              </li>
              <li>
                <Link href="/berita?cat=Pembangunan" className="hover:text-emerald-400 transition">
                  Pembangunan Desa
                </Link>
              </li>
              <li>
                <Link href="/#panduan" className="hover:text-emerald-400 transition">
                  Panduan & Aturan Berkunjung
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Location Info */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide uppercase text-xs text-emerald-400">
              Kontak Pengelola
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Kawasan Wisata Bukit Punjabu, Desa Buntu Buangin, Kecamatan Pitu Riase, Kabupaten Sidenreng Rappang (Sidrap), Sulawesi Selatan</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+62 822-9111-7360 (Pokdarwis Punjabu)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>wisata@bukitpunjabu-sidrap.des.id</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Wisata Bukit Punjabu Sidrap &amp; Portal Berita Desa. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Dikembangkan dengan</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>untuk Desa Buntu Buangin, Sidrap</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
