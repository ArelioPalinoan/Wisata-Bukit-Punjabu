import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthModal } from "@/components/AuthModal";
import { BookingModal } from "@/components/BookingModal";
import { ToastContainer } from "@/components/Toast";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wisata Bukit Punjabu (Puncak Jambu-Jambu) Sidrap — Portal Resmi Desa Buntu Buangin",
  description:
    "Website resmi Wisata Bukit Punjabu (Puncak Jambu-Jambu) 527 mdpl, Desa Buntu Buangin, Kecamatan Pitu Riase, Kabupaten Sidenreng Rappang (Sidrap), Sulawesi Selatan. Temukan keindahan Samudera Awan 360°, kebun cengkih, Gula Tappo khas, camping ground, dan berita desa terkini.",
  keywords: [
    "Wisata Bukit Punjabu",
    "Puncak Jambu-Jambu",
    "Desa Buntu Buangin",
    "Pitu Riase",
    "Sidrap",
    "Samudera Awan 527 mdpl",
    "Gula Tappo Buntu Buangin",
    "ADWI 2021",
    "Camping Ground Sidrap",
    "Sidenreng Rappang",
    "Ekowisata Sulawesi Selatan",
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  "name": "Wisata Bukit Punjabu (Puncak Jambu-Jambu)",
  "description": "Destinasi wisata alam 527 mdpl dengan pemandangan Samudera Awan 360 derajat di Desa Buntu Buangin, Pitu Riase, Sidrap, Sulawesi Selatan.",
  "location": {
    "@type": "Place",
    "name": "Desa Buntu Buangin",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Pitu Riase",
      "addressRegion": "Kabupaten Sidenreng Rappang (Sidrap)",
      "addressCountry": "ID"
    }
  },
  "touristType": ["Nature", "Camping", "EcoTourism"],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "128"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${jakartaSans.variable} dark scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('punjabu_theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col font-sans bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased selection:bg-emerald-500 selection:text-white"
      >
        <AppProvider>
          <Navbar />
          <main className="flex-1 w-full page-enter">{children}</main>
          <Footer />
          <AuthModal />
          <BookingModal />
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}


