export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category: 'Wisata & Event' | 'Kegiatan Desa' | 'Pembangunan' | 'Ekonomi & UMKM' | 'Pengumuman';
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  views: number;
  featured: boolean;
  status: 'Published' | 'Draft';
  summary: string;
  content: string;
  coverImage: string;
  gallery: string[];
  videoUrl?: string;
  tags: string[];
}

export interface TourismSpot {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  badge: string;
  rating: number;
}

export interface UMKMProduct {
  id: string;
  name: string;
  price: number;
  priceUnit: string;
  category: string;
  seller: string;
  description: string;
  image: string;
  badge?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Fasilitas & Layanan' | 'Akses & Tiket' | 'Camping & Sunrise' | 'Aturan & Keamanan';
}

export interface VisitorReview {
  id: string;
  name: string;
  origin: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string;
  spot: string;
}

export interface TravelRoute {
  from: string;
  distance: string;
  duration: string;
  roadCondition: string;
  vehicleAdvice: string;
}

export interface VillageStats {
  totalVisitors: number;
  totalNews: number;
  activeAttractions: number;
  totalInquiries: number;
}

export const INITIAL_STATS: VillageStats = {
  totalVisitors: 18450,
  totalNews: 12,
  activeAttractions: 8,
  totalInquiries: 310,
};

export const TOURISM_SPOTS: TourismSpot[] = [
  {
    id: '1',
    title: 'Puncak Samudera Awan Punjabu',
    category: 'Pemandangan Alam Sidrap',
    description: 'Menyaksikan fenomena laut awan putih mempesona di ketinggian 850 mdpl Pegunungan Pitu Riase, Kabupaten Sidrap saat terbit matahari.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    badge: 'Terfavorit Sidrap',
    rating: 4.9,
  },
  {
    id: '2',
    title: 'Camping Ground Desa Buntu Buangin',
    category: 'Aktivitas Outdoor',
    description: 'Area perkemahan sejuk berselimut kabut pagi ramah keluarga dengan fasilitas MCK, sumber air bersih, dan pengawasan Pokdarwis Sidrap.',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop',
    badge: 'Populer',
    rating: 4.8,
  },
  {
    id: '3',
    title: 'Gardu Pandang Skywalk Pitu Riase',
    category: 'Spot Foto Ikonik',
    description: 'Panggung panorama kayu melayang di atas tebing dengan sudut pandang 360 derajat memandang lanskap bukit hijau Kabupaten Sidrap.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
    badge: 'Ikonik',
    rating: 4.9,
  },
  {
    id: '4',
    title: 'Kedai Kopi Olahan Desa Buntu Buangin',
    category: 'Kuliner Lokal Sidrap',
    description: 'Nikmati cita rasa khas Kopi Punjabu (Robusta & Arabika) hasil petik merah petani lokal Desa Buntu Buangin Kecamatan Pitu Riase.',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1200&auto=format&fit=crop',
    badge: 'Khas Sidrap',
    rating: 4.8,
  },
  {
    id: '5',
    title: 'Jalur Trekking Pegunungan Sidrap',
    category: 'Petualangan Alam',
    description: 'Rute jalan santai menyusuri pemandangan lereng bukit dan udara segar pegunungan Pitu Riase Sidrap yang menenangkan jiwa.',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop',
    badge: 'Eksplorasi',
    rating: 4.7,
  },
  {
    id: '6',
    title: 'Gazebo & Area Istirahat Wisatawan',
    category: 'Fasilitas Pengunjung',
    description: 'Pondok kayu santai bernuansa tradisional untuk berkumpul bersama keluarga sambil menikmati tiupan angin sejuk perbukitan.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
    badge: 'Keluarga',
    rating: 4.7,
  },
];

export const UMKM_PRODUCTS: UMKMProduct[] = [
  {
    id: 'u1',
    name: 'Kopi Punjabu Petik Merah (Robusta 250g)',
    price: 35000,
    priceUnit: 'pouch 250g',
    category: 'Kopi Organik',
    seller: 'Kelompok Tani Buntu Buangin',
    description: 'Biji kopi robusta pilihan tanah vulkanik Pitu Riase, diolah pasca panen honey process dengan aroma cokelat hangat alami.',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800&auto=format&fit=crop',
    badge: 'Best Seller',
  },
  {
    id: 'u2',
    name: 'Kopi Punjabu Special Arabika (200g)',
    price: 45000,
    priceUnit: 'pouch 200g',
    category: 'Kopi Premium',
    seller: 'Kopdes Punjabu Sidrap',
    description: 'Kopi arabika dataran tinggi 850 mdpl dengan asam buah yang lembut & cita rasa khas pegunungan Pitu Riase.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
    badge: 'Pilihan Petani',
  },
  {
    id: 'u3',
    name: 'Madu Murni Hutan Pitu Riase (350ml)',
    price: 85000,
    priceUnit: 'botol 350ml',
    category: 'Hasil Hutan',
    seller: 'Koperasi Warga Buntu Buangin',
    description: 'Madu hutan liar murni kaya khasiat yang dipanen secara tradisional oleh warga desa dari kawasan perbukitan.',
    image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?q=80&w=800&auto=format&fit=crop',
    badge: '100% Murni',
  },
  {
    id: 'u4',
    name: 'Gula Merah Aren Organik (1 kg)',
    price: 25000,
    priceUnit: 'kemasan 1kg',
    category: 'Olahan Tradisional',
    seller: 'Ibu-Ibu UMKM Desa',
    description: 'Gula aren murni olahan nira pohon aren lokal tanpa bahan pengawet, harum dan sangat manis alami.',
    image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=800&auto=format&fit=crop',
    badge: 'Organik',
  },
];

export const FAQS: FAQItem[] = [
  {
    id: 'f1',
    question: 'Kapan waktu terbaik untuk menyaksikan fenomena Samudera Awan di Bukit Punjabu Sidrap?',
    answer: 'Waktu emas (*golden hour*) terbaik adalah antara pukul 05.30 hingga 07.00 WITA. Biasanya samudera awan tebal paling indah terlihat setelah malam harinya cerah atau hujan ringan.',
    category: 'Camping & Sunrise',
  },
  {
    id: 'f2',
    question: 'Berapa tarif tiket masuk harian dan biaya camping night?',
    answer: 'Tiket masuk harian Rp 10.000 / orang. Untuk paket Camping Night Rp 20.000 / orang (sudah termasuk izin area tenda, penggunaan fasilitas MCK malam, dan lampu penerangan umum).',
    category: 'Akses & Tiket',
  },
  {
    id: 'f3',
    question: 'Apakah pengelola menyediakan sewa tenda dan perlengkapan camping?',
    answer: 'Ya! Pokdarwis Punjabu menyediakan persewaan Tenda Dome kapasitas 4 orang (Rp 60.000/malam), Sleeping Bag (Rp 15.000), Matras (Rp 10.000), serta Kompor Portable. Bisa dipesan langsung secara online via website ini.',
    category: 'Fasilitas & Layanan',
  },
  {
    id: 'f4',
    question: 'Bagaimana kondisi jaringan sinyal seluler dan fasilitas listrik di lokasi?',
    answer: 'Di lokasi utama Bukit Punjabu sudah terjangkau sinyal seluler 4G Telkomsel & Indosat. Area gazebo utama juga dilengkapi fasilitas stopkontak (*charging spot*) bagi pengunjung.',
    category: 'Fasilitas & Layanan',
  },
  {
    id: 'f5',
    question: 'Jenis kendaraan apa yang direkomendasikan menuju lokasi Bukit Punjabu?',
    answer: 'Sepeda motor dan mobil pribadi (Sedan, MPV, SUV) dapat menjangkau area parkir utama. Jalanan beraspal dan cor hingga area parkir wisata di Desa Buntu Buangin.',
    category: 'Akses & Tiket',
  },
  {
    id: 'f6',
    question: 'Apakah boleh membawa perlengkapan foto dan menerbangkan Drone?',
    answer: 'Sangat diperbolehkan! Bukit Punjabu adalah tempat favorit fotografi panorama & lanskap. Untuk menerbangkan drone tidak dikenakan biaya tambahan selama tetap memperhatikan keamanan pengunjung.',
    category: 'Aturan & Keamanan',
  },
];

export const VISITOR_REVIEWS: VisitorReview[] = [
  {
    id: 'r1',
    name: 'Rahmat Hidayat',
    origin: 'Makassar',
    rating: 5,
    date: '24 Juli 2026',
    comment: 'Luar biasa indah! Lautan awan jam 6 pagi di Bukit Punjabu Sidrap betul-betul tidak kalah dari tempat wisata pulau Jawa. Udara sejuk dan kopi lokalnya sangat enak!',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    spot: 'Puncak Samudera Awan',
  },
  {
    id: 'r2',
    name: 'Nurlaila Azizah',
    origin: 'Parepare',
    rating: 5,
    date: '18 Juli 2026',
    comment: 'Tempat camping yang sangat direkomendasikan bersama keluarga. Petugas Pokdarwis Sidrap ramah, fasilitas kamar mandi bersih dan aman.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    spot: 'Camping Ground Punjabu',
  },
  {
    id: 'r3',
    name: 'Andi M. Risky',
    origin: 'Sengkang, Wajo',
    rating: 5,
    date: '12 Juli 2026',
    comment: 'Pemandangan dari Gardu Pandang Skywalk 360 derajatnya sangat spektakuler. Spot foto favorit buat dokumentasi akhir pekan.',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop',
    spot: 'Skywalk Pitu Riase',
  },
];

export const TRAVEL_ROUTES: TravelRoute[] = [
  {
    from: 'Pangkajene (Pusat Kota Sidrap)',
    distance: '38 km',
    duration: '± 50 menit',
    roadCondition: 'Aspal mulus & betonisasi desa',
    vehicleAdvice: 'Motor, Mobil MPV/SUV/Sedan',
  },
  {
    from: 'Kota Parepare',
    distance: '65 km',
    duration: '± 1 jam 20 menit',
    roadCondition: 'Jalur Poros Sidrap - Pitu Riase',
    vehicleAdvice: 'Semua jenis kendaraan darat',
  },
  {
    from: 'Kota Makassar',
    distance: '215 km',
    duration: '± 4.5 jam',
    roadCondition: 'Jalan Trans-Sulawesi mulus',
    vehicleAdvice: 'Mobil pribadi / Rombongan bus mikro',
  },
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: '1',
    title: 'Pokdarwis Desa Buntu Buangin Siapkan Festival Akustik & Camping Ceria Bukit Punjabu Sidrap 2026',
    slug: 'pokdarwis-desa-buntu-buangin-siapkan-festival-akustik-camping-ceria-bukit-punjabu-sidrap-2026',
    category: 'Wisata & Event',
    author: 'Ahmad Ridwan',
    authorRole: 'Ketua Pokdarwis Punjabu Sidrap',
    date: '28 Juli 2026',
    readTime: '4 menit baca',
    views: 1840,
    featured: true,
    status: 'Published',
    summary: 'Pokdarwis Desa Buntu Buangin Kecamatan Pitu Riase Kabupaten Sidrap siap menggelar agenda musik akustik senja dan camping ceria berlatarkan pemandangan samudera awan.',
    content: `
Objek Wisata **Bukit Punjabu** yang terletak di **Desa Buntu Buangin, Kecamatan Pitu Riase, Kabupaten Sidenreng Rappang (Sidrap), Sulawesi Selatan** kembali bersiap menyambut wisatawan. Pemerintah Desa Buntu Buangin bersama Kelompok Sadar Wisata (Pokdarwis) Punjabu mengumumkan penyelenggaraan kegiatan **Festival Akustik Senja & Camping Ceria 2026**.

Acara tahunan yang menjadi kebanggaan warga Pitu Riase Sidrap ini dirancang untuk memperkenalkan potensi ekowisata alam perbukitan Sidrap kepada masyarakat luas. Berada pada ketinggian sekitar 850 mdpl, Bukit Punjabu menawarkan panorama matahari terbit (*sunrise*) lengkap dengan kabut awan putih menyerupai lautan di pagi hari.

### Rangkaian Kegiatan Festival di Bukit Punjabu Sidrap

Ketua Pokdarwis Bukit Punjabu Desa Buntu Buangin, Bapak Ahmad Ridwan, menjelaskan bahwa festival tahun ini menekankan pada apresiasi seni lokal dan pelestarian lingkungan alam Pitu Riase:

1. **Panggung Akustik Senja**: Penampilan musik akustik dari pemuda kreatif Kabupaten Sidrap mengiringi momen *sunset* Pitu Riase.
2. **Cicip Kopi Punjabu Gratis**: Pembagian cangkir Kopi Robusta & Arabika khas racikan petani Desa Buntu Buangin Sidrap secara gratis untuk seluruh peserta camping.
3. **Camping Malam di Negeri di Atas Awan**: Berkemah bersama di area camping ground yang telah ditata rapi dan dilengkapi pencahayaan serta fasilitas sanitasi bersih.
4. **Senam Sehat & Sunrise Samudera Awan**: Menyambut terbitnya matahari pagi bersama pemandangan hamparan awan spektakuler.

> "Bukit Punjabu di Desa Buntu Buangin Kecamatan Pitu Riase kini menjadi salah satu destinasi ekowisata andalan Kabupaten Sidrap. Kami mengundang seluruh masyarakat Sidrap dan sekitarnya untuk merasakan pengalaman berkemah yang aman, sejuk, dan berkesan," ujar Ahmad Ridwan.

### Pembatasan Sampah & Ekowisata

Panitia pelaksana mewajibkan setiap pengunjung dan peserta camping untuk menjaga kebersihan lokasi wisata dengan membawa pulang sampah masing-masing (*Leave No Trace*). Langkah ini berkomitmen menjaga keasrian kawasan lereng bukit Pitu Riase Sidrap tetap bersih dan lestari.
    `,
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1200&auto=format&fit=crop'
    ],
    tags: ['Bukit Punjabu', 'Sidrap', 'Desa Buntu Buangin', 'Pitu Riase', 'Camping', 'Ekowisata'],
  },
  {
    id: '2',
    title: 'Pemkab Sidrap & Pemdes Buntu Buangin Resmikan Penataan Gardu Pandang Skywalk Bukit Punjabu',
    slug: 'pemkab-sidrap-pemdes-buntu-buangin-resmikan-penataan-gardu-pandang-skywalk-bukit-punjabu',
    category: 'Pembangunan',
    author: 'Siti Rahmawati',
    authorRole: 'Humas Desa Buntu Buangin',
    date: '22 Juli 2026',
    readTime: '3 menit baca',
    views: 1210,
    featured: false,
    status: 'Published',
    summary: 'Fasilitas gardu pandang kayu panoramic di Bukit Punjabu Desa Buntu Buangin Pitu Riase Sidrap resmi dipercantik untuk kenyamanan dan keamanan pengunjung.',
    content: `
Pemerintah Desa Buntu Buangin Kecamatan Pitu Riase meresmikan selesainya tahap penataan dan peningkatan keamanan fasilitas **Gardu Pandang Skywalk Bukit Punjabu Sidrap**. Peresmian dihadiri oleh perwakilan Pemerintah Kabupaten Sidenreng Rappang (Sidrap), perangkat desa, serta tokoh masyarakat Pitu Riase.

Fasilitas gardu pandang kayu ini berada di pinggir tebing utama Bukit Punjabu, memungkinkan wisatawan melihat lanskap panorama pegunungan Pitu Riase dan hamparan lembah hijau Kabupaten Sidrap secara leluasa.

### Peningkatan Keamanan & Fasilitas

Penataan yang dilakukan meliputi:
- **Penguatan Struktur Kayu Jati & Pagar Baja**: Memastikan standar keselamatan pengunjung terjaga secara optimal.
- **Pencahayaan Lampu Hias Malam**: Memberikan kenyamanan estetis bagi pengunjung yang berkemah saat malam hari.
- **Papan Informasi Geografis Sidrap**: Menampilkan informasi ketinggian lokasi (850 mdpl) dan gambaran wilayah Kecamatan Pitu Riase Kabupaten Sidrap.

Kepala Desa Buntu Buangin mengungkapkan bahwa pengembangan fasilitas wisata desa ini menggunakan alokasi dana pemberdayaan masyarakat untuk memperkuat posisi Bukit Punjabu sebagai kebanggaan pariwisata Kabupaten Sidrap.
    `,
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop'
    ],
    tags: ['Sidrap', 'Pitu Riase', 'Skywalk Punjabu', 'Pemdes Buntu Buangin', 'Ekowisata'],
  },
  {
    id: '3',
    title: 'Pengembangan Potensi Kopi Punjabu Khas Desa Buntu Buangin Pitu Riase Sidrap',
    slug: 'pengembangan-potensi-kopi-punjabu-khas-desa-buntu-buangin-pitu-riase-sidrap',
    category: 'Ekonomi & UMKM',
    author: 'Pak Sutrisno',
    authorRole: 'Ketua Kelompok Tani Kopi Buntu Buangin',
    date: '15 Juli 2026',
    readTime: '3 menit baca',
    views: 950,
    featured: false,
    status: 'Published',
    summary: 'Komoditas kopi lokal khas lereng Bukit Punjabu Desa Buntu Buangin Sidrap terus didorong menjadi oleh-oleh unggulan wisatawan.',
    content: `
Selain keindahan fenomena lautan awan, lereng kawasan **Bukit Punjabu di Desa Buntu Buangin Kecamatan Pitu Riase Kabupaten Sidrap** juga memiliki potensi komoditas kopi perkebunan yang khas. Udara sejuk pegunungan Pitu Riase membuat tanaman kopi Robusta dan Arabika tumbuh subur dengan kualitas cita rasa otentik.

Kelompok Tani Kopi Desa Buntu Buangin kini aktif memproduksi kemasan **Kopi Punjabu Sidrap** yang diproses secara tradisional dan petik merah super. Kopi ini menjadi pilihan utama buah tangan para wisatawan yang berkunjung ke kawasan wisata Bukit Punjabu.

Pemerintah Desa Buntu Buangin bersama Pokdarwis terus mendukung promosi kopi lokal ini di area kedai dan warung wisata agar berdampak positif pada kesejahteraan ekonomi petani tempatan di Kabupaten Sidrap.
    `,
    coverImage: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop'
    ],
    tags: ['Kopi Punjabu', 'Sidrap', 'Desa Buntu Buangin', 'UMKM Sidrap', 'Pitu Riase'],
  }
];
