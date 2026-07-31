# 🏔️ Wisata Bukit Punjabu - Portal Ekowisata & Informasi Desa Buntu Buangin

[![Next.js](https://img.shields.io/badge/Next.js-16.2.12-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database_%26_Auth-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![KKN Project](https://img.shields.io/badge/KKN-Semester_7-emerald?style=for-the-badge)](https://github.com)

**Wisata Bukit Punjabu** adalah platform web resmi ekowisata dan portal informasi digital terpadu untuk **Desa Buntu Buangin**, Kecamatan Pitu Riase, Kabupaten Sidenreng Rappang (Sidrap), Sulawesi Selatan. Portal ini dikembangkan sebagai bagian dari Program Kerja Kuliah Kerja Nyata (KKN) Semester 7 untuk mempromosikan keindahan alam "Samudera Awan Punjabu" (850 mdpl), memperluas pasar UMKM lokal, memfasilitasi reservasi tiket/camping, serta menyediakan sistem manajemen berita desa terpadu.

---

## 🌟 Fitur Utama

### 🏕️ 1. Landing Page Ekowisata & Destinasi Unggulan
- **Samudera Awan & Sunrise**: Informasi lengkap puncak Bukit Punjabu di ketinggian 850 mdpl.
- **Spot Foto & Aktivitas Outdoor**: Menampilkan spot foto alam, camping ground, kebun kopi & aren, hingga wisata air terjun.
- **Ulasan Pengunjung & Rating**: Testimoni riil dari pengunjung yang dikemas secara modern.
- **FAQ Interaktif**: Pertanyaan umum seputar aksesibilitas, fasilitas camping, tiket, dan aturan keamanan area wisata dengan pencarian & kategori.

### 🎟️ 2. Sistem Booking Tiket & Sewa Alat Camping (WhatsApp & Supabase Sync)
- **Reservasi Online**: Form pemesanan tiket masuk, sewa tenda dome, alat camping, hingga jasa guide lokal.
- **Kalkulator Biaya Otomatis**: Estimasi harga diperbarui secara *real-time* sesuai kuantitas dan pilihan paket.
- **Sinkronisasi Supabase & Direct WhatsApp**: Pemesanan otomatis tersimpan di database Supabase `bookings` dan terhubung langsung ke WhatsApp pengelola Pokdarwis.

### 🛒 3. Marketplace & Showcase Produk UMKM Desa
- Promosi produk khas Desa Buntu Buangin seperti **Kopi Arabika/Robusta Punjabu**, **Gula Merah Aren Murni**, **Madu Hutan**, dan **Kerajinan Tangan**.
- Penjualan langsung melalui kontak WhatsApp petani/pengrajin lokal.

### 📰 4. Portal Berita & Publikasi Informasi Desa
- **Daftar Berita Dinamis**: Kategori berita (*Wisata & Event*, *Kegiatan Desa*, *Pembangunan*, *Ekonomi & UMKM*, *Pengumuman*).
- **Fitur Pencarian & Filter**: Pencarian berita interaktif berdasarkan judul, isi, maupun tag.
- **Detail Artikel Lengkap**: Menampilkan waktu baca, jumlah pembaca (*views*), galeri foto pendukung, embed video YouTube, serta rekomendasi artikel terkait.

### 🛠️ 5. Dashboard Admin CMS (Content Management System)
- **Manajemen Artikel Berita**: Fitur CRUD (Create, Read, Update, Delete) berita desa langsung terhubung ke database Supabase.
- **Status Publikasi**: Pengaturan status artikel (*Published* / *Draft*).
- **Indikator Koneksi Database**: Pemantauan status koneksi `• Supabase DB Connected` secara *real-time*.

### 🔐 6. Sistem Autentikasi & Otorisasi Dual-Role (Supabase Auth & OAuth)
- **Supabase Auth Integration**: Mendukung login Email/Password dan Google OAuth (`loginWithGoogle`).
- **Role-Based Access Control**: Membedakan hak akses akun sebagai `admin` (akses penuh ke `/admin`) atau `visitor`.
- **Hybrid Persistent State**: Sinkronisasi otomatis antara Supabase Auth dan LocalStorage.

### 🌓 7. Dual Theme Mode (Dark Mode & Light Mode)
- Navigasi dan antarmuka mendukung mode gelap (*Dark Mode*) dan terang (*Light Mode*) dengan gradasi visual yang nyaman dipandang.

---

## 🛠️ Stack Teknologi Terpasang

| Kategori | Teknologi / Library | Versi | Deskripsi |
| :--- | :--- | :--- | :--- |
| **Core Framework** | [Next.js](https://nextjs.org/) (App Router) | `16.2.12` | Framework React modern dengan Turbopack & React Compiler |
| **UI Engine** | [React](https://react.dev/) | `19.2.4` | Library antarmuka berbasis komponen modern |
| **Type Safety** | [TypeScript](https://www.typescriptlang.org/) | `5.0+` | Type-safety untuk kode Javascript yang aman & terpelihara |
| **Styling & Layout** | [Tailwind CSS](https://tailwindcss.com/) & PostCSS | `v4.0` | Utility-first CSS framework dengan dark mode & responsive design |
| **Database & Cloud Backend** | [Supabase Database](https://supabase.com/) | PostgreSQL | Database cloud terpusat untuk menyimpan berita, booking, & umkm |
| **Autentikasi & Security** | [Supabase Auth](https://supabase.com/auth) | `@supabase/supabase-js` | Autentikasi Email/Password & Google OAuth dengan RLS Policies |
| **Icon Set** | [Lucide React](https://lucide.dev/) | `^1.28.0` | Koleksi ikon SVG modern dan ringan |
| **State Management** | React Context API | React Native Hooks | Pengelolaan state global theme, auth, news, & stats |
| **Reservasi Gateway** | WhatsApp API | `wa.me` | Integrasi pemesanan langsung ke pengelola Pokdarwis |

---

## 📁 Struktur Direktori Proyek

```text
wisatabukitpunjabu/
├── public/                  # Asset statis (favicon, gambar, ilustrasi)
├── src/
│   ├── app/                 # Next.js App Router Pages
│   │   ├── admin/           # Dashboard Admin CMS (/admin)
│   │   │   └── page.tsx
│   │   ├── berita/          # Portal & Detail Berita (/berita)
│   │   │   ├── [id]/        # Halaman Detail Berita (/berita/[id])
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css      # Styling global & Tailwind import
│   │   ├── layout.tsx       # Root Layout (Nav, Footer, AppProvider)
│   │   └── page.tsx         # Landing Page Utama Wisata Punjabu
│   ├── components/          # Komponen UI Reusable
│   │   ├── AuthModal.tsx    # Modal Login (Email & Google OAuth)
│   │   ├── BookingModal.tsx # Modal Reservasi Tiket & Sewa Alat
│   │   ├── Footer.tsx       # Komponen Footer Portal
│   │   ├── Navbar.tsx       # Navigasi Atas Responsif & Theme Switcher
│   │   └── NewsCard.tsx     # Kartu Tampilan Berita
│   ├── context/
│   │   └── AppContext.tsx   # Global Context (Auth, Theme, Supabase Sync)
│   ├── data/
│   │   └── initialData.ts   # Mock Master Data (Wisata, UMKM, Berita, FAQ, Rute)
│   └── lib/
│       └── supabase.ts      # Supabase Client Helper & Fallback Checker
├── .env.example             # Templat variabel lingkungan Supabase
├── .env.local               # Konfigurasi kunci API Supabase lokal
├── next.config.ts           # Konfigurasi Next.js (allowedDevOrigins & React Compiler)
├── package.json             # Dependensi & script proyek
├── supabase_schema.sql      # Skrip DDL SQL (Tabel, RLS Policies, Seed Data)
├── tsconfig.json            # Konfigurasi TypeScript compiler
└── README.md                # Dokumentasi lengkap proyek ini
```

---

## 🚀 Panduan Instalasi & Penggunaan

### Prasyarat System
Pastikan komputer Anda telah terinstall:
- **Node.js**: versi `v18.17.0` atau lebih baru
- **npm** (atau `yarn` / `pnpm` / `bun`)

### 1. Kloning Repository
```bash
git clone https://github.com/username/wisatabukitpunjabu.git
cd wisatabukitpunjabu
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Konfigurasi Database Supabase
- Jalankan file [`supabase_schema.sql`](file:///c:/SEMESTER%207%20-%20KKN/wisatabukitpunjabu/supabase_schema.sql) di **SQL Editor** Supabase.
- Salin URL & Anon Key dari Supabase ke file [`.env.local`](file:///c:/SEMESTER%207%20-%20KKN/wisatabukitpunjabu/.env.local):
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
  ```

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka browser dan akses alamat: [http://localhost:3000](http://localhost:3000)

### 5. Build untuk Mode Produksi
```bash
npm run build
npm run start
```

---

## 🗝️ Akses Demo & Akun Testing

| Role | Email | Password | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Admin Real (Supabase Auth)** | `admin.punjabu@gmail.com` | `AdminPunjabu2026!` | Akses penuh `/admin`, CRUD berita ke Supabase |
| **Pengunjung Google** | OAuth Google | *(Via Modal Login)* | Sesi pengunjung publik & reservasi |

---

## 🗺️ Panduan Akses Lokasi

- **Lokasi**: Desa Buntu Buangin, Kecamatan Pitu Riase, Kabupaten Sidenreng Rappang (Sidrap), Sulawesi Selatan.
- **Rute Utama**:
  - **Dari Makassar**: ± 210 km (Sekitar 5 - 6 jam via Poros Parepare - Sidrap).
  - **Dari Parepare**: ± 65 km (Sekitar 1.5 - 2 jam via Pangkajene Sidrap).
  - **Dari Pangkajene (Pusat Kota Sidrap)**: ± 35 km ke arah Pegunungan Pitu Riase.

---

## 👨‍💻 Pengembang & Tim KKN

Proyek ini dikembangkan oleh **Tim KKN Semester 7** sebagai wujud pengabdian masyarakat dalam mendukung digitalisasi desa dan pengembangan potensi ekowisata daerah Kabupaten Sidenreng Rappang.

- **Lokasi Pengabdian**: Desa Buntu Buangin, Kec. Pitu Riase, Kab. Sidrap
- **Fokus Program**: Digitalisasi Desa, Promosi Ekowisata Punjabu, & Pemberdayaan UMKM Kopi Aren Lokal.

---

## 📜 Lisensi

Proyek ini dirilis di bawah lisensi [MIT License](LICENSE). Bebas dikembangkan dan dimanfaatkan untuk kemajuan masyarakat dan desa.
