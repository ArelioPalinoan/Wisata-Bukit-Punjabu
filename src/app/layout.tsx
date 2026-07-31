import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthModal } from "@/components/AuthModal";
import { BookingModal } from "@/components/BookingModal";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wisata Bukit Punjabu Sidrap — Portal Resmi Desa Buntu Buangin",
  description:
    "Website resmi Wisata Bukit Punjabu, Desa Buntu Buangin, Kecamatan Pitu Riase, Kabupaten Sidenreng Rappang (Sidrap), Sulawesi Selatan. Temukan keindahan Samudera Awan, Camping Ground, Gardu Pandang Skywalk, reservasi tiket, dan berita desa terkini.",
  keywords: [
    "Wisata Bukit Punjabu",
    "Sidrap",
    "Desa Buntu Buangin",
    "Pitu Riase",
    "Samudera Awan",
    "Camping Ground Sidrap",
    "Sidenreng Rappang",
    "Ekowisata Sulawesi Selatan",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning is REQUIRED here because the inline <script>
    // modifies the className of <html> before React hydrates (dark/light theme),
    // which intentionally produces a mismatch between server-rendered HTML and
    // the client DOM. Without this, React throws a hydration warning every load.
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${jakartaSans.variable} dark scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Blocking script: reads localStorage BEFORE first paint to apply
          the correct theme class — eliminates the dark/light flash on load.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('punjabu_theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      {/* suppressHydrationWarning on body because theme-class-driven bg/text
          color classes can differ between server and client after the script runs */}
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
        </AppProvider>
      </body>
    </html>
  );
}
