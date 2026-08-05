'use client';

import React, { useState } from 'react';
import { VILLAGE_PROFILE_DATA } from '@/data/initialData';
import { ScrollReveal } from '@/components/ScrollReveal';
import {
  Building2,
  MapPin,
  Award,
  Trees,
  Coffee,
  Sparkles,
  ShieldCheck,
  Users,
  Compass,
  Layers,
  CheckCircle2,
  Flame,
  Cookie,
  Navigation,
} from 'lucide-react';

export const VillageProfileSection: React.FC = () => {
  const profile = VILLAGE_PROFILE_DATA;
  const [activeTab, setActiveTab] = useState<'dusun' | 'komoditas' | 'prestasi' | 'batas'>('dusun');

  const getCommodityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cookie':
        return <Cookie className="w-5 h-5 text-amber-500" />;
      case 'Trees':
        return <Trees className="w-5 h-5 text-emerald-500" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-rose-500" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-teal-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <section id="profil-desa" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header Section */}
      <ScrollReveal className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
          <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Profil Resmi Pemerintahan &amp; Geografi Desa</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Mengenal Desa Buntu Buangin
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed">
          Desa agrowisata dan pelestari budaya lokal di Kecamatan Pitu Riase, Kabupaten Sidrap. Terkenal dengan pesona Puncak Jambu-Jambu (Bukit Punjabu) 527 mdpl, kebun cengkih, dan camilan ikonik Gula Tappo.
        </p>
      </ScrollReveal>

      {/* Quick Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: 'Wilayah Administrasi',
            val: 'Kec. Pitu Riase',
            sub: 'Kab. Sidenreng Rappang (Sidrap)',
            icon: <MapPin className="w-6 h-6 text-emerald-500" />,
          },
          {
            title: 'Kepala Desa Sahrul Ramadana',
            val: 'Pelayanan Publik',
            sub: 'Senin - Jumat (08.00 - 16.00 WITA)',
            icon: <Users className="w-6 h-6 text-teal-500" />,
          },
          {
            title: 'Ketinggian Geografis',
            val: '500 - 700 mdpl',
            sub: 'Puncak Punjabu 527 mdpl',
            icon: <Compass className="w-6 h-6 text-amber-500" />,
          },
          {
            title: 'Prestasi Desa Wisata',
            val: 'ADWI & LPDWN',
            sub: 'Juara 2 Nasional Promosi Desa 2022',
            icon: <Award className="w-6 h-6 text-emerald-400" />,
          },
        ].map((item, i) => (
          <ScrollReveal
            key={item.title}
            delay={i * 0.08}
            className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/60 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800/80 shadow-md hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 space-y-3"
          >
            <div className="p-3 w-fit rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15">
              {item.icon}
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                {item.title}
              </span>
              <p className="text-xl font-extrabold text-zinc-900 dark:text-white mt-0.5">
                {item.val}
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 font-medium">
                {item.sub}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Main Interactive Tab Container */}
      <ScrollReveal className="rounded-3xl bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-10 shadow-lg space-y-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-6">
          {[
            { id: 'dusun', label: 'Wilayah Dusun', icon: <Layers className="w-4 h-4" /> },
            { id: 'komoditas', label: 'Komoditas Unggulan', icon: <Trees className="w-4 h-4" /> },
            { id: 'prestasi', label: 'Prestasi Nasional', icon: <Award className="w-4 h-4" /> },
            { id: 'batas', label: 'Batas Geografis', icon: <MapPin className="w-4 h-4" /> },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{ outline: 'none' }}
                className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105'
                    : 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Dusun */}
        {activeTab === 'dusun' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            {profile.dusuns.map((dusun) => (
              <div
                key={dusun.name}
                className="p-6 rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 shadow-sm hover:shadow-md transition-all duration-300 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      {dusun.code}
                    </span>
                    <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                    {dusun.name}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                    {dusun.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Fasilitas &amp; Ciri Khas:</span>
                  <ul className="space-y-1.5">
                    {dusun.facilities.map((fac, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{fac}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Komoditas */}
        {activeTab === 'komoditas' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            {profile.commodities.map((item) => (
              <div
                key={item.name}
                className="p-6 rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 shadow-sm hover:shadow-md transition-all duration-300 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15">
                    {getCommodityIcon(item.icon)}
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    {item.name}
                  </h3>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Prestasi */}
        {activeTab === 'prestasi' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {profile.achievements.map((ach) => (
              <div
                key={ach.title}
                className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900/90 border border-emerald-500/30 dark:border-emerald-500/20 shadow-md space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    Tahun {ach.year}
                  </span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Award className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">
                    {ach.title}
                  </h3>
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                    Penyelenggara: {ach.organizer}
                  </p>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  {ach.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Batas Geografis */}
        {activeTab === 'batas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Navigation className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Batas Wilayah Desa Buntu Buangin
              </h3>
              <div className="space-y-3 text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300">
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">Sebelah Utara:</span>
                  <span>{profile.borders.north}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">Sebelah Timur:</span>
                  <span>{profile.borders.east}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">Sebelah Selatan:</span>
                  <span>{profile.borders.south}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">Sebelah Barat:</span>
                  <span>{profile.borders.west}</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  Kantor &amp; Pelayanan Desa Buntu Buangin
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed font-medium">
                  Pelayanan administratif surat-menyurat, perizinan kegiatan warga, dan koordinasi kelompok tani &amp; Pokdarwis dilayani di Kantor Desa Buntu Buangin (Dusun I Jambu-Jambu).
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs font-semibold">
                <p className="text-zinc-700 dark:text-zinc-300">
                  📍 <strong>Alamat Kantor:</strong> {profile.officeAddress}
                </p>
                <p className="text-zinc-700 dark:text-zinc-300">
                  ⏰ <strong>Jam Operasional:</strong> {profile.officeHours}
                </p>
              </div>
            </div>
          </div>
        )}
      </ScrollReveal>
    </section>
  );
};
