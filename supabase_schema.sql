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

-- 6. TABEL ANALITIK KUNJUNGAN WEBSITE (site_visits)
CREATE TABLE IF NOT EXISTS site_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visited_at TIMESTAMPTZ DEFAULT NOW(),
  page_path TEXT DEFAULT '/',
  user_agent TEXT
);

-- 7. TABEL KOMENTAR BERITA DESA (news_comments)
CREATE TABLE IF NOT EXISTS news_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABEL FAQ / PERTANYAAN UMUM (faqs)
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Fasilitas & Layanan', 'Akses & Tiket', 'Camping & Sunrise', 'Aturan & Keamanan')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABEL RUTE PERJALANAN (travel_routes)
CREATE TABLE IF NOT EXISTS travel_routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_location TEXT NOT NULL,
  distance TEXT NOT NULL,
  duration TEXT NOT NULL,
  road_condition TEXT NOT NULL,
  vehicle_advice TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TABEL GALERI FOTO WISATA (gallery_images)
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TABEL PENGATURAN & STATISTIK PORTAL (village_settings)
CREATE TABLE IF NOT EXISTS village_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- INDEKS OPTIMALISASI KINERJA (PERFORMANCE INDEXES)
-- ====================================================================

CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_comments_news_id ON news_comments(news_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date_status ON bookings(booking_date, status);
CREATE INDEX IF NOT EXISTS idx_visits_visited_at ON site_visits(visited_at);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) & POLICIES (SAFE IDEMPOTENT)
-- ====================================================================

ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE tourism_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE umkm_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE village_settings ENABLE ROW LEVEL SECURITY;

-- Drop Policy jika sudah ada sebelumnya agar tidak Error 42710
DROP POLICY IF EXISTS "Public Read News" ON news;
DROP POLICY IF EXISTS "Public Read Tourism Spots" ON tourism_spots;
DROP POLICY IF EXISTS "Public Read UMKM Products" ON umkm_products;
DROP POLICY IF EXISTS "Public Read Reviews" ON visitor_reviews;
DROP POLICY IF EXISTS "Public Insert Bookings" ON bookings;
DROP POLICY IF EXISTS "Public Read Own Bookings" ON bookings;
DROP POLICY IF EXISTS "Public Insert Visits" ON site_visits;
DROP POLICY IF EXISTS "Public Read Visits" ON site_visits;
DROP POLICY IF EXISTS "Public Read News Comments" ON news_comments;
DROP POLICY IF EXISTS "Public Insert News Comments" ON news_comments;
DROP POLICY IF EXISTS "Public Read FAQs" ON faqs;
DROP POLICY IF EXISTS "Public Read Travel Routes" ON travel_routes;
DROP POLICY IF EXISTS "Public Read Gallery Images" ON gallery_images;
DROP POLICY IF EXISTS "Public Read Village Settings" ON village_settings;

DROP POLICY IF EXISTS "Admin Full Access News" ON news;
DROP POLICY IF EXISTS "Admin Full Access Tourism" ON tourism_spots;
DROP POLICY IF EXISTS "Admin Full Access UMKM" ON umkm_products;
DROP POLICY IF EXISTS "Admin Full Access Bookings" ON bookings;
DROP POLICY IF EXISTS "Admin Full Access FAQs" ON faqs;
DROP POLICY IF EXISTS "Admin Full Access Routes" ON travel_routes;
DROP POLICY IF EXISTS "Admin Full Access Gallery" ON gallery_images;
DROP POLICY IF EXISTS "Admin Full Access Settings" ON village_settings;

-- Policy untuk Pembaca Publik (SELECT terbuka untuk umum)
CREATE POLICY "Public Read News" ON news FOR SELECT USING (true);
CREATE POLICY "Public Read Tourism Spots" ON tourism_spots FOR SELECT USING (true);
CREATE POLICY "Public Read UMKM Products" ON umkm_products FOR SELECT USING (true);
CREATE POLICY "Public Read Reviews" ON visitor_reviews FOR SELECT USING (true);
CREATE POLICY "Public Read Visits" ON site_visits FOR SELECT USING (true);
CREATE POLICY "Public Read News Comments" ON news_comments FOR SELECT USING (true);
CREATE POLICY "Public Read FAQs" ON faqs FOR SELECT USING (true);
CREATE POLICY "Public Read Travel Routes" ON travel_routes FOR SELECT USING (true);
CREATE POLICY "Public Read Gallery Images" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Public Read Village Settings" ON village_settings FOR SELECT USING (true);

-- Policy untuk Pengunjung Melakukan Booking, Log Visits, & Komentar (INSERT terbuka)
CREATE POLICY "Public Insert Bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Own Bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Public Insert Visits" ON site_visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert News Comments" ON news_comments FOR INSERT WITH CHECK (true);

-- ====================================================================
-- FUNGSI ATOMIC INCREMENT VIEW BERITA (Mencegah Stale Race Condition)
-- ====================================================================

CREATE OR REPLACE FUNCTION increment_news_views(target_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE news
  SET views = COALESCE(views, 0) + 1
  WHERE id::text = target_id OR slug = target_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy untuk Admin / Service Role (FULL ACCESS CRUD)
CREATE POLICY "Admin Full Access News" ON news FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Tourism" ON tourism_spots FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access UMKM" ON umkm_products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Bookings" ON bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access FAQs" ON faqs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Routes" ON travel_routes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Gallery" ON gallery_images FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Settings" ON village_settings FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- SEED DATA AWAL (DATA CONTOH PORTAL PUNJABU)
-- ====================================================================

INSERT INTO news (title, slug, category, author, author_role, date, read_time, views, featured, status, summary, content, cover_image, gallery, tags)
VALUES 
(
  'Tim KKN Tematik Gelombang 116 Unhas Jalankan Program Kerja Promosi Desa Melalui Pengambilan Foto & Video Drone di Bukit Punjabu',
  'tim-kkn-tematik-gelombang-116-unhas-jalankan-program-kerja-promosi-desa-foto-video-drone-bukit-punjabu',
  'Kegiatan Desa',
  'Tim KKN Tematik Gel. 116 Unhas',
  'Mahasiswa KKN Unhas Desa Buntu Buangin',
  '2 Agustus 2026',
  '3 menit baca',
  420,
  TRUE,
  'Published',
  'Mahasiswa KKN Tematik Gelombang 116 Universitas Hasanuddin melaksanakan program kerja kelompok Promosi Desa dengan mengabadikan pesona keindahan alam Bukit Punjabu melalui udara menggunakan drone pada Minggu, 2 Agustus 2026.',
  'Mahasiswa KKN Tematik Gelombang 116 Universitas Hasanuddin (Unhas) yang bertugas di Desa Buntu Buangin, Kecamatan Pitu Riase, Kabupaten Sidenreng Rappang (Sidrap) sukses melaksanakan salah satu program kerja kelompok utamanya, yaitu Promosi Desa Wisata.\n\nKegiatan ini dilaksanakan pada Minggu pagi, 2 Agustus 2026, bertempat di kawasan objek wisata unggulan Bukit Punjabu (Puncak Jambu-Jambu).\n\nDalam pelaksanaannya, tim mahasiswa KKN Unhas memanfaatkan teknologi drone udara untuk mengabadikan keindahan lanskap alam perbukitan dari ketinggian 527 mdpl. Pengambilan foto dan video dilakukan secara intensif dengan memotret hamparan perbukitan hijau, kebun cengkih warga, hingga panorama cakrawala Pitu Riase.\n\nSetelah seluruh footage video drone dan foto dokumentasi lanskap perbukitan dirasa cukup dan memadai, seluruh anggota tim KKN Tematik Gelombang 116 Unhas menggelar sesi foto dokumentasi bersama di puncak Bukit Punjabu sebelum akhirnya kembali turun menuju posko KKN.\n\nHasil pengambilan foto dan video udara ini akan diolah menjadi materi media promosi digital desa untuk memperkuat branding Desa Wisata Buntu Buangin di tingkat kabupaten hingga nasional.',
  '/images/topview.jpg',
  ARRAY['/images/topview.jpg', '/images/farview.png', '/images/kebunview.png', '/images/heroimage.jpg'],
  ARRAY['KKN Unhas 116', 'Bukit Punjabu', 'Promosi Desa', 'Buntu Buangin', 'Sidrap', 'Dokumentasi Drone']
),
(
  'Pesona Lautan Awan Puncak Punjabu 850 mdpl Pitu Riase Sidrap',
  'pesona-lautan-awan-puncak-punjabu-850-mdpl-pitu-riase-sidrap',
  'Wisata & Event',
  'Tim Redaksi Desa',
  'Pengelola Pokdarwis',
  '28 Juli 2026',
  '4 min baca',
  1240,
  FALSE,
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
  'Agrowisata & Edukasi Gula Tappo Aren',
  'Wisata Edukasi & Agrowisata',
  'Pengalaman edukasi budaya & agrowisata melihat langsung proses pembuatan Gula Tappo khas Buntu Buangin serta penyadapan nira aren murni di Dusun Jambu-jambu.',
  '/images/kebunview.png',
  'Wisata Edukasi',
  4.8
),
(
  'Gardu Pandang & Gazebo Rest Area Punjabu',
  'Fasilitas & Rekreasi',
  'Anjungan kayu & gazebo santai di lereng bukit untuk berteduh, beristirahat, dan menikmati pemandangan alam perbukitan yang sejuk bersama keluarga.',
  '/images/gazeboview.png',
  'Gardu Pandang',
  4.8
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

-- SEED DATA FAQ (faqs)
INSERT INTO faqs (question, answer, category)
VALUES
(
  'Mengapa dinamakan Wisata Bukit Punjabu dan apa keistimewaannya?',
  'Nama "Punjabu" merupakan akronim resmi dari "Puncak Jambu-Jambu" yang terletak di Dusun Jambu-jambu, Desa Buntu Buangin. Berada pada ketinggian 527 mdpl, tempat ini terkenal dengan fenomena Samudera Awan 360°, kebun cengkih yang asri, serta spot foto berbentuk siluet hati (love shape).',
  'Camping & Sunrise'
),
(
  'Berapa tarif tiket masuk harian dan biaya paket camping?',
  'Tiket masuk harian Rp 10.000 / orang. Untuk paket Camping Night Rp 20.000 / orang (sudah termasuk izin area perkemahan, MCK, dan penerangan umum).',
  'Akses & Tiket'
),
(
  'Apa prestasi nasional yang pernah diraih Desa Wisata Buntu Buangin & Bukit Punjabu?',
  'Wisata Bukit Punjabu berhasil masuk dalam 300 Besar Anugerah Desa Wisata Indonesia (ADWI) 2021 oleh Kemenparekraf RI serta meraih Juara 2 Nasional Lomba Promosi Desa Wisata Nusantara (LPDWN) 2022 oleh Kemendes PDTT RI.',
  'Aturan & Keamanan'
),
(
  'Bagaimana akses rute dari pusat desa menuju puncak bukit?',
  'Dari pusat Desa Buntu Buangin menuju puncak Bukit Punjabu berjarak sekitar 2,8 hingga 3 km. Jalur ini dapat ditempuh dengan kendaraan off-road, motor trail, maupun berjalan kaki (trekking) sekitar 15 menit.',
  'Akses & Tiket'
),
(
  'Oleh-oleh khas apa yang wajib dicoba saat berkunjung ke Buntu Buangin?',
  'Sangat direkomendasikan mencoba "Gula Tappo", camilan tradisional olahan kelapa sangrai dan gula merah aren murni, serta Kopi Punjabu petik merah dan Gula Merah Aren cetak khas Dusun Jambu-jambu.',
  'Fasilitas & Layanan'
),
(
  'Apakah tersedia fasilitas homestay di Desa Buntu Buangin?',
  'Ya, selain camping ground di puncak bukit, pengunjung yang ingin menginap dengan suasana hangat khas pedesaan dapat memanfaatkan homestay yang dikelola warga lokal Desa Buntu Buangin.',
  'Fasilitas & Layanan'
);

-- SEED DATA RUTE PERJALANAN (travel_routes)
INSERT INTO travel_routes (from_location, distance, duration, road_condition, vehicle_advice)
VALUES
(
  'Pangkajene (Ibukota Kab. Sidrap)',
  '± 50 km',
  '± 1,5 - 2 jam',
  'Jalan poros Pitu Riase beraspal & cor desa',
  'Sepeda motor, Mobil MPV/SUV'
),
(
  'Kota Parepare',
  '± 75 km',
  '± 2 jam',
  'Jalan Poros Trans-Sulawesi & Pitu Riase',
  'Semua jenis kendaraan darat'
),
(
  'Kota Makassar',
  '± 200 km',
  '± 4 jam (ke Sidrap) + 1.5 jam (ke Desa)',
  'Jalan Utama Trans-Sulawesi & Poros Perbukitan',
  'Mobil pribadi / Rombongan bus mikro'
);

-- SEED DATA GALERI FOTO (gallery_images)
INSERT INTO gallery_images (title, category, image_url, description)
VALUES
(
  'Puncak Utama & Lautan Awan 527 mdpl',
  'Samudera Awan',
  '/images/heroimage.jpg',
  'Pesona fajar menyingsing di atas hamparan samudera awan putih perbukitan Pitu Riase.'
),
(
  'Panorama Udara Bentang Alam Punjabu',
  'Gardu Pandang',
  '/images/topview.jpg',
  'Pemandangan dari udara menyajikan lanskap perbukitan hijau Dusun Jambu-jambu Desa Buntu Buangin.'
),
(
  'Suasana Camping Ground & Kebun Cengkih',
  'Camping',
  '/images/sideview.jpg',
  'Pengalaman berkemah sejuk ramah keluarga di tengah hamparan perkebunan cengkih warga.'
),
(
  'Gazebo & Saung Pandang Panoramik',
  'Gardu Pandang',
  '/images/gazeboview.png',
  'Fasilitas saung gazebo tempat bersantai bagi pengunjung menikmati pemandangan alam Sidrap.'
),
(
  'Panorama Latimojong & Teluk Bone',
  'Samudera Awan',
  '/images/boneview.png',
  'Cakrawala luas memandang deretan Pegunungan Latimojong hingga kilau pesona laut Teluk Bone.'
),
(
  'Jalur Petualangan Off-Road 3 km',
  'Petualangan',
  '/images/trailview.png',
  'Trek menantang melintasi perbukitan favorit pecinta motor trail, jeep 4x4, dan penjelajah alam.'
),
(
  'Agrowisata Kebun Cengkih & Aren',
  'Agrowisata',
  '/images/kebunview.png',
  'Lanskap perkebunan cengkih dan nira aren organik yang asri di Dusun Jambu-jambu Desa Buntu Buangin.'
),
(
  'Lanskap Cakrawala Jauh Perbukitan',
  'Gardu Pandang',
  '/images/farview.png',
  'Pemandangan spektakuler sudut pandang jauh membentang sepanjang pegunungan Pitu Riase Sidrap.'
);



