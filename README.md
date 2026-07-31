# 🏔️ Wisata Bukit Punjabu - Portal Ekowisata & Informasi Desa Buntu Buangin

[![Next.js](https://img.shields.io/badge/Next.js-16.2.12-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![KKN Project](https://img.shields.io/badge/KKN-Semester_7-emerald?style=for-the-badge)](https://github.com)

**Wisata Bukit Punjabu** adalah platform web resmi ekowisata dan portal informasi digital untuk **Desa Buntu Buangin**, Kecamatan Pitu Riase, Kabupaten Sidenreng Rappang (Sidrap), Sulawesi Selatan. Portal ini dikembangkan sebagai bagian dari Program Kerja Kuliah Kerja Nyata (KKN) Semester 7 untuk mempromosikan keindahan alam "Samudera Awan Punjabu" (850 mdpl), memperluas pasar UMKM lokal, memfasilitasi reservasi tiket/camping, serta menyediakan sistem manajemen berita desa terpadu.

---

## 🌟 Fitur Utama

### 🏕️ 1. Landing Page Ekowisata & Destinasi Unggulan
- **Samudera Awan & Sunrise**: Informasi lengkap mengenai puncak Bukit Punjabu di ketinggian 850 mdpl.
- **Spot Foto & Aktivitas Outdoor**: Menampilkan spot foto alam, camping ground, kebun kopi & aren, hingga wisata air terjun.
- **Ulasan Pengunjung & Rating**: Testimoni riil dari pengunjung yang dikemas secara modern.
- **FAQ Interaktif**: Pertanyaan umum seputar aksesibilitas, fasilitas camping, tiket, dan aturan keamanan area wisata.

### 🎟️ 2. Sistem Booking Tiket & Sewa Alat Camping (WhatsApp Integrated)
- **Reservasi Online**: Form pemesanan tiket masuk, sewa tenda dome, alat camping, hingga jasa guide lokal.
- **Kalkulator Biaya Otomatis**: Estimasi harga diperbarui secara *real-time* sesuai kuantitas dan pilihan paket.
- **Integrasi Direct WhatsApp**: Pemesanan langsung terhubung ke WhatsApp pengelola (Pokdarwis / Pengelola Wisata Desa) dengan format pesan rapi.

### 🛒 3. Marketplace & Showcase Produk UMKM Desa
- Promosi produk khas Desa Buntu Buangin seperti **Kopi Arabika/Robusta Punjabu**, **Gula Merah Aren Murni**, **Madu Hutan**, dan **Kerajinan Tangan**.
- Penjualan langsung melalui kontak WhatsApp petani/pengrajin lokal.

### 📰 4. Portal Berita & Publikasi Informasi Desa
- **Daftar Berita Dinamis**: Kategori berita (*Wisata & Event*, *Kegiatan Desa*, *Pembangunan*, *Ekonomi & UMKM*, *Pengumuman*).
- **Fitur Pencarian & Filter**: Pencarian berita interaktif berdasarkan judul, isi, maupun tag.
- **Detail Artikel Lengkap**: Menampilkan waktu baca, jumlah pembaca (*views*), galeri foto pendukung, embed video YouTube, serta rekomendasi artikel terkait.

### 🛠️ 5. Dashboard Admin CMS (Content Management System)
- **Manajemen Artikel Berita**: Fitur CRUD (Create, Read, Update, Delete) berita desa.
- **Status Publikasi**: Pengaturan status artikel (*Published* / *Draft*).
- **Ringkasan Statistik Portal**: Pemantauan jumlah pengunjung, total berita publikasi, atraksi aktif, dan permintaan informasi.

### 🔐 6. Sistem Autentikasi & Persistent State
- **Modal Login / Register**: Membedakan role akun sebagai `admin` atau `visitor`.
- **Persistensi Data**: Menggunakan LocalStorage via Custom React Context Provider sehingga data berita dan sesi user tetap tersimpan secara aman di browser local.

### 🌓 7. Dual Theme Mode (Dark Mode & Light Mode)
- Navigasi dan antarmuka mendukung mode gelap (*Dark Mode*) dan terang (*Light Mode*) dengan animasi transisi yang mulus.

---

## 🛠️ Stack Teknologi

| Kategori | Teknologi / Library | Deskripsi |
| :--- | :--- | :--- |
| **Core Framework** | [Next.js 16](https://nextjs.org/) (App Router) | Framework React modern dengan Server Component & SSR |
| **UI Library** | [React 19](https://react.dev/) | Library antarmuka berbasis komponen |
| **Bahasa Pemrograman** | [TypeScript 5](https://www.typescriptlang.org/) | Type-safety untuk kode Javascript yang stabil |
| **Styling & Theme** | [Tailwind CSS v4](https://tailwindcss.com/) & PostCSS | Utility-first CSS framework dengan dark mode support |
| **Icon Set** | [Lucide React](https://lucide.dev/) | Koleksi ikon SVG modern dan ringan |
| **State Management** | React Context API | Pengelolaan state global theme, auth, news, & stats |

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
│   │   ├── AuthModal.tsx    # Modal Login & Registrasi
│   │   ├── BookingModal.tsx # Modal Reservasi Tiket & Sewa Alat
│   │   ├── Footer.tsx       # Komponen Footer Portal
│   │   ├── Navbar.tsx       # Navigasi Atas & Theme Switcher
│   │   └── NewsCard.tsx     # Kartu Tampilan Berita
│   ├── context/
│   │   └── AppContext.tsx   # Global Context (Auth, Theme, LocalStorage)
│   └── data/
│       └── initialData.ts   # Mock Master Data (Wisata, UMKM, Berita, FAQ, Rute)
├── next.config.ts           # Konfigurasi Next.js
├── package.json             # Dependensi & script proyek
├── postcss.config.mjs       # Konfigurasi PostCSS
├── tsconfig.json            # Konfigurasi TypeScript compiler
└── README.md                # Dokumentasi proyek ini
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

### 3. Jalankan Development Server
```bash
npm run dev
```
Buka browser dan akses alamat: [http://localhost:3000](http://localhost:3000)

### 4. Build untuk Mode Produksi
Untuk menguji performa & build produksi:
```bash
npm run build
npm run start
```

---

## 🗝️ Akses Demo & Akun Testing

Untuk mencoba fitur **Dashboard Admin CMS**, Anda dapat melakukan login menggunakan kredensial demo berikut di modal login (`Navbar` -> `Masuk`):

| Role | Email | Password | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Admin Desa** | `admin@punjabu.desa.id` | *(Password bebas / Sembarang)* | Mengakses `/admin`, Tambah/Edit/Hapus Berita |
| **Pengunjung** | `user@gmail.com` | *(Password bebas / Sembarang)* | Login akun visitor, simulasi booking |

> **Catatan**: Data artikel berita baru yang ditambahkan di Dashboard Admin akan tersimpan di `localStorage` browser Anda.

---

## 🗺️ Panduan Akses Lokasi

- **Lokasi**: Desa Buntu Buangin, Kecamatan Pitu Riase, Kabupaten Sidenreng Rappang (Sidrap), Sulawesi Selatan.
- **Rute Utama**:
  - **Dari Makassar**: ± 210 km (Sekitar 5 - 6 jam via Poros Parepare - Sidrap).
  - **Dari Parepare**: ± 65 km (Sekitar 1.5 - 2 jam via Pangkajene Sidrap).
  - **Dari Pangkajene (Pusat Kota Sidrap)**: ± 35 km ke arah Pegunungan Pitu Riase.
- **Saran Kendaraan**: Sepeda Motor / Mobil SUV (Diimbau kondisi kendaraan prima untuk medan tanjakan pegunungan).

---

## 👨‍💻 Pengembang & Tim KKN

Proyek ini dikembangkan oleh **Tim KKN Semester 7** sebagai wujud pengabdian masyarakat dalam mendukung digitalisasi desa dan pengembangan potensi ekowisata daerah Kabupaten Sidenreng Rappang.

- **Lokasi Pengabdian**: Desa Buntu Buangin, Kec. Pitu Riase, Kab. Sidrap
- **Fokus Program**: Digitalisasi Desa, Promosi Ekowisata Punjabu, & Pemberdayaan UMKM Kopi Aren Lokal.

---

## 📜 Lisensi

Proyek ini dirilis di bawah lisensi [MIT License](LICENSE). Bebas dikembangkan dan dimanfaatkan untuk kemajuan masyarakat dan desa.
