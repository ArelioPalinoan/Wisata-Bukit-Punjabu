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

export interface BookingRecord {
  id: string;
  userName: string;
  userPhone: string;
  userEmail?: string;
  bookingDate: string;
  ticketQty: number;
  tentQty: number;
  guideIncluded: boolean;
  totalPrice: number;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt?: string;
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
    description: 'Menyaksikan fenomena laut awan putih mempesona di ketinggian 527 mdpl Dusun Jambu-jambu, Desa Buntu Buangin saat terbit matahari dengan panorama 360 derajat.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    badge: 'Terfavorit Sidrap',
    rating: 4.9,
  },
  {
    id: '2',
    title: 'Camping Ground & Kebun Cengkih Buntu Buangin',
    category: 'Aktivitas Outdoor',
    description: 'Area perkemahan sejuk di antara lanskap kebun cengkih yang tertata rapi, dilengkapi fasilitas MCK, tempat ibadah, dan pengawasan Pokdarwis Punjabu.',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop',
    badge: 'Populer',
    rating: 4.8,
  },
  {
    id: '3',
    title: 'Spot Swafoto Siluet Hati (Love Shape)',
    category: 'Spot Foto Ikonik',
    description: 'Spot panggung panoramik di puncak bukit yang membentuk siluet hati unik, menjadi favorit wisatawan untuk fotografi lanskap & pre-wedding.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
    badge: 'Ikonik',
    rating: 4.9,
  },
  {
    id: '4',
    title: 'Jalur Petualangan Off-Road (2.8 - 3 km)',
    category: 'Wisata Petualangan',
    description: 'Trek menantang sepanjang 3 km dari pusat desa menuju puncak bukit, favorit pecinta motor trail, jeep 4x4, serta penjelajah alam.',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop',
    badge: 'Off-Road Trail',
    rating: 4.8,
  },
  {
    id: '5',
    title: 'Kedai Kopi & Saung Perkebunan Punjabu',
    category: 'Kuliner & Perkebunan',
    description: 'Nikmati Kopi Punjabu (Robusta & Arabika) dan camilan tradisional Gula Tappo langsung di area saung santai tepi lereng bukit.',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1200&auto=format&fit=crop',
    badge: 'Khas Buntu Buangin',
    rating: 4.8,
  },
  {
    id: '6',
    title: 'Panorama Pegunungan Latimojong & Teluk Bone',
    category: 'Lanskap Alam',
    description: 'Dari ketinggian 527 mdpl, nikmati pemandangan cakrawala luas memandang deretan Pegunungan Latimojong hingga kilau Teluk Bone.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
    badge: 'Lanskap 360°',
    rating: 4.7,
  },
];

export const UMKM_PRODUCTS: UMKMProduct[] = [
  {
    id: 'u1',
    name: 'Gula Tappo Khas Buntu Buangin (Pack 250g)',
    price: 20000,
    priceUnit: 'kemasan 250g',
    category: 'Camilan Tradisional',
    seller: 'Kelompok UMKM Ibu Desa Buntu Buangin',
    description: 'Camilan manis-gurih otentik Buntu Buangin hasil perpaduan kelapa parut sangrai berkualitas dan nira gula merah aren murni pilihan.',
    image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=800&auto=format&fit=crop',
    badge: 'Khas Ikonik',
  },
  {
    id: 'u2',
    name: 'Gula Merah Aren Murni Organik (1 kg)',
    price: 25000,
    priceUnit: 'kemasan 1kg',
    category: 'Olahan Tradisional',
    seller: 'Petani Aren Dusun Jambu-jambu',
    description: 'Gula aren cetak murni tanpa campuran bahan kimia, diolah secara alami dari sadapan nira pohon aren perbukitan Buntu Buangin.',
    image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?q=80&w=800&auto=format&fit=crop',
    badge: '100% Organik',
  },
  {
    id: 'u3',
    name: 'Kopi Punjabu Petik Merah Robusta (250g)',
    price: 35000,
    priceUnit: 'pouch 250g',
    category: 'Kopi Organik',
    seller: 'Kelompok Tani Kopi Buntu Buangin',
    description: 'Biji kopi robusta pilihan dari lereng Bukit Punjabu ketinggian 527 mdpl, diolah honey process dengan aroma mantap cokelat hangat.',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800&auto=format&fit=crop',
    badge: 'Best Seller',
  },
  {
    id: 'u4',
    name: 'Kopi Punjabu Special Arabika (200g)',
    price: 45000,
    priceUnit: 'pouch 200g',
    category: 'Kopi Premium',
    seller: 'Pokdarwis & Kopdes Punjabu Sidrap',
    description: 'Kopi arabika pegunungan Pitu Riase dengan rasa asam buah yang lembut dan karakter aroma segar khas perkebunan Buntu Buangin.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
    badge: 'Pilihan Petani',
  },
];

export const FAQS: FAQItem[] = [
  {
    id: 'f1',
    question: 'Mengapa dinamakan Wisata Bukit Punjabu dan apa keistimewaannya?',
    answer: 'Nama "Punjabu" merupakan akronim resmi dari "Puncak Jambu-Jambu" yang terletak di Dusun Jambu-jambu, Desa Buntu Buangin. Berada pada ketinggian 527 mdpl, tempat ini terkenal dengan fenomena Samudera Awan 360°, kebun cengkih yang asri, serta spot foto berbentuk siluet hati (love shape).',
    category: 'Camping & Sunrise',
  },
  {
    id: 'f2',
    question: 'Berapa tarif tiket masuk harian dan biaya paket camping?',
    answer: 'Tiket masuk harian Rp 10.000 / orang. Untuk paket Camping Night Rp 20.000 / orang (sudah termasuk izin area perkemahan, MCK, dan penerangan umum).',
    category: 'Akses & Tiket',
  },
  {
    id: 'f3',
    question: 'Apa prestasi nasional yang pernah diraih Desa Wisata Buntu Buangin & Bukit Punjabu?',
    answer: 'Wisata Bukit Punjabu berhasil masuk dalam 300 Besar Anugerah Desa Wisata Indonesia (ADWI) 2021 oleh Kemenparekraf RI serta meraih Juara 2 Nasional Lomba Promosi Desa Wisata Nusantara (LPDWN) 2022 oleh Kemendes PDTT RI.',
    category: 'Aturan & Keamanan',
  },
  {
    id: 'f4',
    question: 'Bagaimana akses rute dari pusat desa menuju puncak bukit?',
    answer: 'Dari pusat Desa Buntu Buangin menuju puncak Bukit Punjabu berjarak sekitar 2,8 hingga 3 km. Jalur ini dapat ditempuh dengan kendaraan off-road, motor trail, maupun berjalan kaki (trekking) sekitar 15 menit.',
    category: 'Akses & Tiket',
  },
  {
    id: 'f5',
    question: 'Oleh-oleh khas apa yang wajib dicoba saat berkunjung ke Buntu Buangin?',
    answer: 'Sangat direkomendasikan mencoba "Gula Tappo", camilan tradisional olahan kelapa sangrai dan gula merah aren murni, serta Kopi Punjabu petik merah dan Gula Merah Aren cetak khas Dusun Jambu-jambu.',
    category: 'Fasilitas & Layanan',
  },
  {
    id: 'f6',
    question: 'Apakah tersedia fasilitas homestay di Desa Buntu Buangin?',
    answer: 'Ya, selain camping ground di puncak bukit, pengunjung yang ingin menginap dengan suasana hangat khas pedesaan dapat memanfaatkan homestay yang dikelola warga lokal Desa Buntu Buangin.',
    category: 'Fasilitas & Layanan',
  },
];

export const VISITOR_REVIEWS: VisitorReview[] = [
  {
    id: 'r1',
    name: 'Rahmat Hidayat',
    origin: 'Makassar',
    rating: 5,
    date: '24 Juli 2026',
    comment: 'Luar biasa indah! Lautan awan jam 6 pagi di Bukit Punjabu Sidrap betul-betul mempesona. Udara sejuk di 527 mdpl dan rasa Gula Tappo serta Kopi Punjabu-nya sangat nikmat!',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    spot: 'Puncak Samudera Awan',
  },
  {
    id: 'r2',
    name: 'Nurlaila Azizah',
    origin: 'Parepare',
    rating: 5,
    date: '18 Juli 2026',
    comment: 'Tempat camping yang sangat recommended bersama keluarga. Hamparan kebun cengkihnya tertata rapi, warga Dusun Jambu-jambu ramah, dan MCK-nya bersih.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    spot: 'Camping Ground Punjabu',
  },
  {
    id: 'r3',
    name: 'Andi M. Risky',
    origin: 'Sengkang, Wajo',
    rating: 5,
    date: '12 Juli 2026',
    comment: 'Panorama 360 derajatnya mantap! Dari puncak kelihatan siluet Pegunungan Latimojong dan spot foto bentuk hati-nya sangat estetik buat dokumentasi.',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop',
    spot: 'Spot Siluet Hati Punjabu',
  },
];

export const TRAVEL_ROUTES: TravelRoute[] = [
  {
    from: 'Pangkajene (Ibukota Kab. Sidrap)',
    distance: '± 50 km',
    duration: '± 1,5 - 2 jam',
    roadCondition: 'Jalan poros Pitu Riase beraspal & cor desa',
    vehicleAdvice: 'Sepeda motor, Mobil MPV/SUV',
  },
  {
    from: 'Kota Parepare',
    distance: '± 75 km',
    duration: '± 2 jam',
    roadCondition: 'Jalan Poros Trans-Sulawesi & Pitu Riase',
    vehicleAdvice: 'Semua jenis kendaraan darat',
  },
  {
    from: 'Kota Makassar',
    distance: '± 200 km',
    duration: '± 4 jam (ke Sidrap) + 1.5 jam (ke Desa)',
    roadCondition: 'Jalan Utama Trans-Sulawesi & Poros Perbukitan',
    vehicleAdvice: 'Mobil pribadi / Rombongan bus mikro',
  },
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: '1',
    title: 'Desa Wisata Buntu Buangin Siapkan Agenda Camping Ceria & Pesta Panen Kopi Punjabu Sidrap 2026',
    slug: 'desa-wisata-buntu-buangin-siapkan-agenda-camping-ceria-pesta-panen-kopi-punjabu-sidrap-2026',
    category: 'Wisata & Event',
    author: 'Ahmad Ridwan',
    authorRole: 'Ketua Pokdarwis Punjabu Sidrap',
    date: '28 Juli 2026',
    readTime: '4 menit baca',
    views: 1840,
    featured: true,
    status: 'Published',
    summary: 'Pokdarwis Desa Buntu Buangin Kecamatan Pitu Riase Kabupaten Sidrap siap mengundang wisatawan berkemah menikmati samudera awan 527 mdpl dan mencicipi camilan khas Gula Tappo.',
    content: `
Taman Wisata **Bukit Punjabu** (Puncak Jambu-Jambu) yang terletak di **Desa Buntu Buangin, Kecamatan Pitu Riase, Kabupaten Sidenreng Rappang (Sidrap), Sulawesi Selatan** kembali menyambut wisatawan dengan ragam agenda menarik. Pemerintah Desa Buntu Buangin bersama Kelompok Sadar Wisata (Pokdarwis) Punjabu mengumumkan agenda **Camping Ceria & Pesta Panen Kopi Punjabu 2026**.

Sebagai objek wisata yang pernah meraih prestasi **300 Besar Anugerah Desa Wisata Indonesia (ADWI) 2021** Kemenparekraf serta **Juara 2 Nasional Lomba Promosi Desa Wisata Nusantara (LPDWN) 2022** Kemendes PDTT, Desa Buntu Buangin terus memperkuat daya tarik ekowisata perbukitannya.

### Daya Tarik Puncak Jambu-Jambu 527 mdpl

Berada pada ketinggian **527 mdpl**, Bukit Punjabu menawarkan keunikan berupa:
1. **Lautan Awan 360 Derajat**: Pemandangan matahari terbit berlatarkan kabut putih tebal yang menyelimuti perbukitan Pitu Riase.
2. **Lanskap Kebun Cengkih & Pegunungan**: Hamparan kebun cengkih warga Dusun Jambu-jambu yang asri serta pemandangan jauh ke arah Pegunungan Latimojong dan Teluk Bone.
3. **Spot Siluet Hati (*Love Shape*)**: Spot foto ikonik panggung panorama bukit berbentuk hati.
4. **Jalur Off-Road 3 km**: Trek petualangan sepanjang 2,8 – 3 km bagi penggemar motor trail dan kendaraan jeep 4x4.

### Rangkaian Kegiatan & Kuliner Khas

Pengunjung yang hadir tidak hanya disuguhkan keindahan alam, namun juga diajak menikmati kuliner khas ikonik Buntu Buangin seperti **Gula Tappo** (olahan kelapa sangrai dan gula merah aren murni) serta seduhan **Kopi Punjabu** petik merah gratis di area perkemahan.

> "Kami mengundang seluruh masyarakat Sidrap dan sekitarnya untuk berkemah dan merasakan keramahan warga Desa Buntu Buangin," ujar Ahmad Ridwan, Ketua Pokdarwis Punjabu.
    `,
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1200&auto=format&fit=crop'
    ],
    tags: ['Bukit Punjabu', 'Puncak Jambu-Jambu', 'Desa Buntu Buangin', 'Sidrap', 'Gula Tappo', 'ADWI 2021'],
  },
  {
    id: '2',
    title: 'Pemdes Buntu Buangin & Pokdarwis Tingkatkan Fasilitas Spot Swafoto & Jalur Off-Road Bukit Punjabu',
    slug: 'pemdes-buntu-buangin-pokdarwis-tingkatkan-fasilitas-spot-swafoto-jalur-offroad-bukit-punjabu',
    category: 'Pembangunan',
    author: 'Siti Rahmawati',
    authorRole: 'Humas Desa Buntu Buangin',
    date: '22 Juli 2026',
    readTime: '3 menit baca',
    views: 1210,
    featured: false,
    status: 'Published',
    summary: 'Penataan area spot swafoto siluet hati dan pembenahan akses jalur off-road 3 km menuju puncak Bukit Punjabu selesai dilaksanakan.',
    content: `
Pemerintah Desa Buntu Buangin Kecamatan Pitu Riase meresmikan penataan lanjutan pada fasilitas **Taman Wisata Bukit Punjabu Sidrap**. Langkah ini diambil untuk memastikan keamanan dan kenyamanan pengunjung yang terus meningkat pasca diraihnya prestasi nasional desa wisata.

### Pembenahan & Fasilitas Terkini

Penataan mencakup:
- **Perbaikan Spot Swafoto Siluet Hati**: Penguatan konstruksi panggung kayu panoramic dan pagar pengaman di puncak bukit 527 mdpl.
- **Perataan Akses Off-Road 2,8 – 3 km**: Memudahkan perlintasan kendaraan pengangkut perlengkapan camp maupun pengendara motor trail.
- **Papan Informasi Geografis & Sejarah**: Mengedukasi wisatawan mengenai asal-usul Puncak Jambu-jambu serta potensi komoditas cengkih dan aren lokal.

Kepala Desa Buntu Buangin menyampaikan bahwa keberlanjutan pengembangan wisata ini menjadi komitmen desa untuk mendorong perekonomian masyarakat secara mandiri.
    `,
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop'
    ],
    tags: ['Bukit Punjabu', 'Pitu Riase', 'Buntu Buangin', 'Sidrap', 'Off-Road', 'Pembangunan Desa'],
  },
  {
    id: '3',
    title: 'Gula Tappo & Kopi Punjabu: Kombinasi Oleh-Oleh Khas Kebanggaan Warga Buntu Buangin Sidrap',
    slug: 'gula-tappo-kopi-punjabu-kombinasi-oleh-oleh-khas-kebanggaan-warga-buntu-buangin-sidrap',
    category: 'Ekonomi & UMKM',
    author: 'Pak Sutrisno',
    authorRole: 'Ketua Kelompok Tani Buntu Buangin',
    date: '15 Juli 2026',
    readTime: '3 menit baca',
    views: 950,
    featured: false,
    status: 'Published',
    summary: 'Camilan tradisional Gula Tappo dan olahan biji kopi perkebunan Punjabu diminati para wisatawan sebagai oleh-oleh favorit dari Sidrap.',
    content: `
Selain keindahan fenomena lautan awan di ketinggian 527 mdpl, lereng kawasan **Bukit Punjabu di Desa Buntu Buangin Kecamatan Pitu Riase Kabupaten Sidrap** menyimpan kekayaan olahan kuliner tradisional yang khas.

Salah satu yang paling diminati adalah **Gula Tappo**, makanan ringan tradisional khas Buntu Buangin yang diolah dari racikan kelapa parut sangrai dan gula merah aren murni. Teksturnya yang gurih-renyah bersatu dengan manisnya gula aren membuat camilan ini menjadi teman sempurna saat menikmati cangkir hangat **Kopi Punjabu**.

Kelompok UMKM Desa Buntu Buangin kini aktif memproduksi kemasan hygienis untuk Gula Tappo dan Kopi Punjabu petik merah agar siap dibawa sebagai buah tangan wisatawan.
    `,
    coverImage: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop'
    ],
    tags: ['Gula Tappo', 'Kopi Punjabu', 'UMKM Buntu Buangin', 'Sidrap', 'Kuliner Khas'],
  }
];
