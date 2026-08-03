-- ====================================================================
-- SKEMA DATABASE SUPABASE UNTUK PORTAL WISATA BUKIT PUNJABU
-- Desa Buntu Buangin, Kec. Pitu Riase, Kab. Sidrap
-- ====================================================================

-- 1. TABEL BERITA (news)
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Wisata & Event', 'Kegiatan Desa', 'Pembangunan', 'Ekonomi & UMKM', 'Pengumuman')),
  author TEXT NOT NULL DEFAULT 'Tim Media Desa',
  author_role TEXT NOT NULL DEFAULT 'Pengelola Wisata',
  date TEXT NOT NULL,
  read_time TEXT NOT NULL DEFAULT '3 min baca',
  views INT DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL CHECK (status IN ('Published', 'Draft')) DEFAULT 'Published',
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  gallery TEXT[] DEFAULT '{}',
  video_url TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL DESTINASI WISATA (tourism_spots)
CREATE TABLE IF NOT EXISTS tourism_spots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  badge TEXT NOT NULL,
  rating NUMERIC(3, 1) DEFAULT 5.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL PRODUK UMKM (umkm_products)
CREATE TABLE IF NOT EXISTS umkm_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price INT NOT NULL,
  price_unit TEXT NOT NULL,
  category TEXT NOT NULL,
  seller TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  badge TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL RESERVASI / BOOKING TIKET & TENT (bookings)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  user_email TEXT,
  booking_date DATE NOT NULL,
  ticket_qty INT DEFAULT 1,
  tent_qty INT DEFAULT 0,
  guide_included BOOLEAN DEFAULT FALSE,
  total_price INT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL ULASAN PENGUNJUNG (visitor_reviews)
CREATE TABLE IF NOT EXISTS visitor_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  origin TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  date TEXT NOT NULL,
  comment TEXT NOT NULL,
  avatar TEXT,
  spot TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) & POLICIES
-- ====================================================================

ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE tourism_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE umkm_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_reviews ENABLE ROW LEVEL SECURITY;

-- Policy untuk Pembaca Publik (SELECT terbuka untuk umum)
CREATE POLICY "Public Read News" ON news FOR SELECT USING (true);
CREATE POLICY "Public Read Tourism Spots" ON tourism_spots FOR SELECT USING (true);
CREATE POLICY "Public Read UMKM Products" ON umkm_products FOR SELECT USING (true);
CREATE POLICY "Public Read Reviews" ON visitor_reviews FOR SELECT USING (true);

-- Policy untuk Pengunjung Melakukan Booking (INSERT terbuka)
CREATE POLICY "Public Insert Bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Own Bookings" ON bookings FOR SELECT USING (true);

-- Policy untuk Admin / Service Role (FULL ACCESS CRUD)
CREATE POLICY "Admin Full Access News" ON news FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Tourism" ON tourism_spots FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access UMKM" ON umkm_products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Bookings" ON bookings FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- SEED DATA AWAL (DATA CONTOH PORTAL PUNJABU)
-- ====================================================================

INSERT INTO news (title, slug, category, author, author_role, date, read_time, views, featured, status, summary, content, cover_image, gallery, tags)
VALUES 
(
  'Pesona Lautan Awan Puncak Punjabu 850 mdpl Pitu Riase Sidrap',
  'pesona-lautan-awan-puncak-punjabu-850-mdpl-pitu-riase-sidrap',
  'Wisata & Event',
  'Tim Redaksi Desa',
  'Pengelola Pokdarwis',
  '28 Juli 2026',
  '4 min baca',
  1240,
  TRUE,
  'Published',
  'Nikmati fenomena menakjubkan samudera awan putih tebal yang menyelimuti kawasan pegunungan Desa Buntu Buangin pada pagi hari.',
  'Puncak Bukit Punjabu yang terletak di ketinggian 850 meter di atas permukaan laut (mdpl) di Desa Buntu Buangin, Kecamatan Pitu Riase, Kabupaten Sidenreng Rappang (Sidrap) terus menjadi daya tarik utama wisatawan lokal maupun luar daerah.\n\nPada jam 05.30 hingga 07.30 WITA, pengunjung disuguhkan hamparan lautan awan putih bergulung yang menyelimuti perbukitan hijau di bawahnya. Suasana sejuk pegunungan dipadu dengan aroma Kopi Aren Punjabu menjadikan momen pagi hari di lokasi ini terasa sangat menenangkan.\n\nKetua Pokdarwis Desa Buntu Buangin menyampaikan bahwa penataan fasilitas pendukung seperti toilet bersih, penerangan area camping, serta ketersediaan air bersih kini telah siap melayani wisatawan yang berkunjung di akhir pekan.',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
  ARRAY['https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop'],
  ARRAY['Samudera Awan', 'Bukit Punjabu', 'Wisata Sidrap', 'Camping Ground']
),
(
  'Panen Kopi Organik Petik Merah Petani Buntu Buangin',
  'panen-kopi-organik-petik-merah-petani-buntu-buangin',
  'Ekonomi & UMKM',
  'Koperasi Desa',
  'Ketua Kelompok Tani',
  '20 Juli 2026',
  '3 min baca',
  850,
  FALSE,
  'Published',
  'Petani lokal Desa Buntu Buangin memulai musim panen raya kopi Robusta dan Arabika petik merah berkualitas tinggi.',
  'Komoditas kopi lokal khas Pegunungan Pitu Riase Sidrap kini memasuki masa panen raya. Petani Desa Buntu Buangin secara konsisten menerapkan metode petik merah untuk menjaga mutu aroma dan rasa kopi khas Punjabu.\n\nKopi olahan warga ini dipasarkan secara langsung kepada para wisatawan dalam bentuk biji sangrai (rosted beans) maupun bubuk siap seduh. Melalui platform digital ini, diharapkan pemasaran produk unggulan UMKM desa dapat semakin meluas hingga ke luar Kabupaten Sidrap.',
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1200&auto=format&fit=crop',
  ARRAY['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop'],
  ARRAY['Kopi Punjabu', 'UMKM Sidrap', 'Petik Merah', 'Ekonomi Desa']
)
ON CONFLICT (slug) DO NOTHING;

-- SEED DATA DESTINASI WISATA (tourism_spots)
INSERT INTO tourism_spots (title, category, description, image, badge, rating)
VALUES
(
  'Puncak Samudera Awan Punjabu',
  'Pemandangan Alam Sidrap',
  'Menyaksikan fenomena laut awan putih mempesona di ketinggian 527 mdpl Dusun Jambu-jambu, Desa Buntu Buangin saat terbit matahari dengan panorama 360 derajat.',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
  'Terfavorit Sidrap',
  4.9
),
(
  'Camping Ground & Kebun Cengkih Buntu Buangin',
  'Aktivitas Outdoor',
  'Area perkemahan sejuk di antara lanskap kebun cengkih yang tertata rapi, dilengkapi fasilitas MCK, tempat ibadah, dan pengawasan Pokdarwis Punjabu.',
  'https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop',
  'Populer',
  4.8
),
(
  'Spot Swafoto Siluet Hati (Love Shape)',
  'Spot Foto Ikonik',
  'Spot panggung panoramik di puncak bukit yang membentuk siluet hati unik, menjadi favorit wisatawan untuk fotografi lanskap & pre-wedding.',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
  'Ikonik',
  4.9
),
(
  'Jalur Petualangan Off-Road (2.8 - 3 km)',
  'Wisata Petualangan',
  'Trek menantang sepanjang 3 km dari pusat desa menuju puncak bukit, favorit pecinta motor trail, jeep 4x4, serta penjelajah alam.',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop',
  'Off-Road Trail',
  4.8
),
(
  'Kedai Kopi & Saung Perkebunan Punjabu',
  'Kuliner & Perkebunan',
  'Nikmati Kopi Punjabu (Robusta & Arabika) dan camilan tradisional Gula Tappo langsung di area saung santai tepi lereng bukit.',
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1200&auto=format&fit=crop',
  'Khas Buntu Buangin',
  4.8
),
(
  'Panorama Pegunungan Latimojong & Teluk Bone',
  'Lanskap Alam',
  'Dari ketinggian 527 mdpl, nikmati pemandangan cakrawala luas memandang deretan Pegunungan Latimojong hingga kilau Teluk Bone.',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
  'Lanskap 360°',
  4.7
);

-- SEED DATA PRODUK UMKM (umkm_products)
INSERT INTO umkm_products (name, price, price_unit, category, seller, description, image, badge)
VALUES
(
  'Gula Tappo Khas Buntu Buangin (Pack 250g)',
  20000,
  'kemasan 250g',
  'Camilan Tradisional',
  'Kelompok UMKM Ibu Desa Buntu Buangin',
  'Camilan manis-gurih otentik Buntu Buangin hasil perpaduan kelapa parut sangrai berkualitas dan nira gula merah aren murni pilihan.',
  'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=800&auto=format&fit=crop',
  'Khas Ikonik'
),
(
  'Gula Merah Aren Murni Organik (1 kg)',
  25000,
  'kemasan 1kg',
  'Olahan Tradisional',
  'Petani Aren Dusun Jambu-jambu',
  'Gula aren cetak murni tanpa campuran bahan kimia, diolah secara alami dari sadapan nira pohon aren perbukitan Buntu Buangin.',
  'https://images.unsplash.com/photo-1587049352847-4a222e784d38?q=80&w=800&auto=format&fit=crop',
  '100% Organik'
),
(
  'Kopi Punjabu Petik Merah Robusta (250g)',
  35000,
  'pouch 250g',
  'Kopi Organik',
  'Kelompok Tani Kopi Buntu Buangin',
  'Biji kopi robusta pilihan dari lereng Bukit Punjabu ketinggian 527 mdpl, diolah honey process dengan aroma mantap cokelat hangat.',
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800&auto=format&fit=crop',
  'Best Seller'
),
(
  'Kopi Punjabu Special Arabika (200g)',
  45000,
  'pouch 200g',
  'Kopi Premium',
  'Pokdarwis & Kopdes Punjabu Sidrap',
  'Kopi arabika pegunungan Pitu Riase dengan rasa asam buah yang lembut dan karakter aroma segar khas perkebunan Buntu Buangin.',
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
  'Pilihan Petani'
);

-- SEED DATA ULASAN VISITOR (visitor_reviews)
INSERT INTO visitor_reviews (name, origin, rating, date, comment, avatar, spot)
VALUES
(
  'Rahmat Hidayat',
  'Makassar',
  5,
  '24 Juli 2026',
  'Luar biasa indah! Lautan awan jam 6 pagi di Bukit Punjabu Sidrap betul-betul mempesona. Udara sejuk di 527 mdpl dan rasa Gula Tappo serta Kopi Punjabu-nya sangat nikmat!',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
  'Puncak Samudera Awan'
),
(
  'Nurlaila Azizah',
  'Parepare',
  5,
  '18 Juli 2026',
  'Tempat camping yang sangat recommended bersama keluarga. Hamparan kebun cengkihnya tertata rapi, warga Dusun Jambu-jambu ramah, dan MCK-nya bersih.',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
  'Camping Ground Punjabu'
),
(
  'Andi M. Risky',
  'Sengkang, Wajo',
  5,
  '12 Juli 2026',
  'Panorama 360 derajatnya mantap! Dari puncak kelihatan siluet Pegunungan Latimojong dan spot foto bentuk hati-nya sangat estetik buat dokumentasi.',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop',
  'Spot Siluet Hati Punjabu'
);


