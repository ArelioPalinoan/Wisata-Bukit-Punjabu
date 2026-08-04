'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  NewsArticle,
  INITIAL_NEWS,
  TourismSpot,
  TOURISM_SPOTS,
  UMKMProduct,
  UMKM_PRODUCTS,
  VisitorReview,
  VISITOR_REVIEWS,
  VillageStats,
  BookingRecord,
  FAQItem,
  FAQS,
  TravelRoute,
  TRAVEL_ROUTES,
  GalleryItem,
  INITIAL_GALLERY,
} from '@/data/initialData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface User {
  name: string;
  email: string;
  role: 'admin' | 'visitor';
  avatar?: string;
}

export interface SupabaseNewsRecord {
  id: string | number;
  title?: string;
  slug?: string;
  category?: string;
  author?: string;
  author_role?: string;
  authorRole?: string;
  date?: string;
  read_time?: string;
  readTime?: string;
  views?: number;
  featured?: boolean;
  status?: string;
  summary?: string;
  content?: string;
  cover_image?: string;
  coverImage?: string;
  gallery?: string[];
  video_url?: string;
  videoUrl?: string;
  tags?: string[];
}

export interface SupabaseNewsUpdatePayload {
  title?: string;
  category?: string;
  author?: string;
  author_role?: string;
  read_time?: string;
  featured?: boolean;
  status?: string;
  summary?: string;
  content?: string;
  cover_image?: string;
  gallery?: string[];
  video_url?: string;
  tags?: string[];
}

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  user: User | null;
  login: (email: string, passwordOrRole?: string | 'admin' | 'visitor', roleOrName?: 'admin' | 'visitor' | string, name?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isBookingModalOpen: boolean;
  openBookingModal: () => void;
  closeBookingModal: () => void;
  isCalculatorOpen: boolean;
  openCalculator: () => void;
  closeCalculator: () => void;

  // News CMS
  newsList: NewsArticle[];
  addNews: (newsItem: Omit<NewsArticle, 'id' | 'views' | 'date'>) => Promise<void>;
  updateNews: (id: string, updatedFields: Partial<NewsArticle>) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  incrementNewsViews: (id: string) => Promise<void>;
  fetchNewsComments: (newsId: string) => Promise<Array<{ id: string; author: string; avatar?: string; text: string; date: string }>>;
  addNewsComment: (newsId: string, authorName: string, commentText: string, authorAvatar?: string) => Promise<{ id: string; author: string; avatar?: string; text: string; date: string } | null>;

  // Tourism Spots CMS
  tourismSpots: TourismSpot[];
  addTourismSpot: (spot: Omit<TourismSpot, 'id'>) => Promise<void>;
  updateTourismSpot: (id: string, spot: Partial<TourismSpot>) => Promise<void>;
  deleteTourismSpot: (id: string) => Promise<void>;

  // UMKM Products CMS
  umkmProducts: UMKMProduct[];
  addUmkmProduct: (product: Omit<UMKMProduct, 'id'>) => Promise<void>;
  updateUmkmProduct: (id: string, product: Partial<UMKMProduct>) => Promise<void>;
  deleteUmkmProduct: (id: string) => Promise<void>;

  // Reviews
  reviews: VisitorReview[];
  addReview: (review: Omit<VisitorReview, 'id' | 'date'>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;

  // Bookings
  bookings: BookingRecord[];
  createBooking: (bookingData: Omit<BookingRecord, 'id' | 'status' | 'createdAt'>) => Promise<BookingRecord | null>;
  updateBookingStatus: (id: string, status: 'Pending' | 'Confirmed' | 'Cancelled') => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;

  // FAQs, Routes & Gallery
  faqs: FAQItem[];
  addFaq: (faq: Omit<FAQItem, 'id'>) => Promise<void>;
  deleteFaq: (id: string) => Promise<void>;
  travelRoutes: TravelRoute[];
  galleryItems: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;

  // System State
  stats: VillageStats;
  mounted: boolean;
  supabaseActive: boolean;
  refreshAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // Dynamic States
  const [newsList, setNewsList] = useState<NewsArticle[]>(INITIAL_NEWS);
  const [tourismSpots, setTourismSpots] = useState<TourismSpot[]>(TOURISM_SPOTS);
  const [umkmProducts, setUmkmProducts] = useState<UMKMProduct[]>(UMKM_PRODUCTS);
  const [reviews, setReviews] = useState<VisitorReview[]>(VISITOR_REVIEWS);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>(FAQS);
  const [travelRoutes, setTravelRoutes] = useState<TravelRoute[]>(TRAVEL_ROUTES);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [totalWebVisits, setTotalWebVisits] = useState<number>(0);
  const [monthlyWebVisits, setMonthlyWebVisits] = useState<number>(0);

  const stats: VillageStats = React.useMemo(() => {
    const realVisitorsCount = bookings.reduce((sum, b) => sum + (b.ticketQty || 1), 0);
    return {
      totalVisitors: realVisitorsCount,
      totalWebVisits: totalWebVisits,
      monthlyWebVisits: monthlyWebVisits,
      totalNews: newsList.length,
      activeAttractions: tourismSpots.length,
      totalInquiries: bookings.length,
    };
  }, [bookings, totalWebVisits, monthlyWebVisits, newsList.length, tourismSpots.length]);
  const [mounted, setMounted] = useState(false);
  const [supabaseActive, setSupabaseActive] = useState(false);

  // Mapping from Database record to NewsArticle
  const mapDbNews = useCallback((item: SupabaseNewsRecord): NewsArticle => ({
    id: String(item.id),
    title: item.title || 'Tanpa Judul',
    slug: item.slug || String(item.id),
    category: (item.category as NewsArticle['category']) || 'Wisata & Event',
    author: item.author || 'Tim Redaksi Desa',
    authorRole: item.author_role || item.authorRole || 'Pengelola Wisata',
    date: item.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    readTime: item.read_time || item.readTime || '3 min baca',
    views: item.views || 0,
    featured: Boolean(item.featured),
    status: (item.status as NewsArticle['status']) || 'Published',
    summary: item.summary || '',
    content: item.content || '',
    coverImage: item.cover_image || item.coverImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    gallery: Array.isArray(item.gallery) ? item.gallery : [],
    videoUrl: item.video_url || item.videoUrl || undefined,
    tags: Array.isArray(item.tags) ? item.tags : [],
  }), []);

  // Fetch all data from Supabase
  const refreshAllData = useCallback(async () => {
    if (isSupabaseConfigured() && supabase) {
      setSupabaseActive(true);
      try {
        // Fetch News
        const { data: newsData } = await supabase.from('news').select('*').order('created_at', { ascending: false });
        if (newsData && newsData.length > 0) {
          setNewsList((newsData as SupabaseNewsRecord[]).map(mapDbNews));
        }

        // Fetch Tourism Spots
        const { data: spotsData } = await supabase.from('tourism_spots').select('*').order('created_at', { ascending: true });
        if (spotsData && spotsData.length > 0) {
          setTourismSpots(
            spotsData.map((s: { id: string; title: string; category: string; description: string; image: string; badge: string; rating?: number }) => ({
              id: String(s.id),
              title: s.title,
              category: s.category,
              description: s.description,
              image: s.image,
              badge: s.badge,
              rating: Number(s.rating) || 4.9,
            }))
          );
        }

        // Fetch UMKM Products
        const { data: umkmData } = await supabase.from('umkm_products').select('*').order('created_at', { ascending: true });
        if (umkmData && umkmData.length > 0) {
          setUmkmProducts(
            umkmData.map((u: { id: string; name: string; price: number; price_unit: string; category: string; seller: string; description: string; image: string; badge?: string }) => ({
              id: String(u.id),
              name: u.name,
              price: Number(u.price),
              priceUnit: u.price_unit,
              category: u.category,
              seller: u.seller,
              description: u.description,
              image: u.image,
              badge: u.badge || undefined,
            }))
          );
        }

        // Fetch Visitor Reviews
        const { data: reviewsData } = await supabase.from('visitor_reviews').select('*').order('created_at', { ascending: false });
        if (reviewsData && reviewsData.length > 0) {
          setReviews(
            reviewsData.map((r: { id: string; name: string; origin: string; rating: number; date: string; comment: string; avatar?: string; spot: string }) => ({
              id: String(r.id),
              name: r.name,
              origin: r.origin,
              rating: Number(r.rating) || 5,
              date: r.date,
              comment: r.comment,
              avatar: r.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=059669&color=fff`,
              spot: r.spot,
            }))
          );
        }

        // Fetch Bookings
        const { data: bookingsData } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
        if (bookingsData) {
          setBookings(
            bookingsData.map((b: { id: string; user_name: string; user_phone: string; user_email?: string; booking_date: string; ticket_qty: number; tent_qty: number; guide_included: boolean; total_price: number; notes?: string; status: string; created_at?: string }) => ({
              id: String(b.id),
              userName: b.user_name,
              userPhone: b.user_phone,
              userEmail: b.user_email || undefined,
              bookingDate: b.booking_date,
              ticketQty: Number(b.ticket_qty) || 1,
              tentQty: Number(b.tent_qty) || 0,
              guideIncluded: Boolean(b.guide_included),
              totalPrice: Number(b.total_price),
              notes: b.notes || undefined,
              status: (b.status as BookingRecord['status']) || 'Pending',
              createdAt: b.created_at,
            }))
          );
        }

        // Fetch FAQs
        const { data: faqsData } = await supabase.from('faqs').select('*').order('created_at', { ascending: true });
        if (faqsData && faqsData.length > 0) {
          setFaqs(
            faqsData.map((f: { id: string; question: string; answer: string; category: string }) => ({
              id: String(f.id),
              question: f.question,
              answer: f.answer,
              category: f.category as FAQItem['category'],
            }))
          );
        }

        // Fetch Travel Routes
        const { data: routesData } = await supabase.from('travel_routes').select('*').order('created_at', { ascending: true });
        if (routesData && routesData.length > 0) {
          setTravelRoutes(
            routesData.map((r: { id: string; from_location: string; distance: string; duration: string; road_condition: string; vehicle_advice: string }) => ({
              id: String(r.id),
              from: r.from_location,
              distance: r.distance,
              duration: r.duration,
              roadCondition: r.road_condition,
              vehicleAdvice: r.vehicle_advice,
            }))
          );
        }

        // Fetch Gallery Images
        const { data: galleryData } = await supabase.from('gallery_images').select('*').order('created_at', { ascending: true });
        if (galleryData && galleryData.length > 0) {
          setGalleryItems(
            galleryData.map((g: { id: string; title: string; category: string; image_url: string; description?: string }) => ({
              id: String(g.id),
              title: g.title,
              category: g.category,
              imageUrl: g.image_url,
              description: g.description || undefined,
            }))
          );
        }

        // Record & Fetch Real-Time Web Visits (All-Time & Monthly Auto-Reset)
        try {
          if (typeof window !== 'undefined' && !sessionStorage.getItem('punjabu_visit_logged')) {
            await supabase.from('site_visits').insert([
              {
                page_path: window.location.pathname,
                user_agent: navigator.userAgent,
              },
            ]);
            sessionStorage.setItem('punjabu_visit_logged', 'true');
          }

          // All-Time Visits Count
          const { count: visitsCount } = await supabase.from('site_visits').select('*', { count: 'exact', head: true });
          if (visitsCount !== null && visitsCount !== undefined) {
            setTotalWebVisits(visitsCount);
          }

          // Current Month Visits Count (Auto-Reset every 1st of month)
          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
          const { count: monthlyCount } = await supabase
            .from('site_visits')
            .select('*', { count: 'exact', head: true })
            .gte('visited_at', startOfMonth);

          if (monthlyCount !== null && monthlyCount !== undefined) {
            setMonthlyWebVisits(monthlyCount);
          }
        } catch (vErr) {
          console.warn('Site visit tracking notice:', vErr);
        }
      } catch (err) {
        console.warn('Error fetching Supabase data, utilizing active state fallbacks:', err);
      }
    }
  }, [mapDbNews]);



  useEffect(() => {
    queueMicrotask(() => {
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('punjabu_theme') as 'dark' | 'light' | null;
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setTheme(savedTheme);
        }
        const savedUser = localStorage.getItem('punjabu_user');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (e) {
            console.error('Error loading user from storage:', e);
          }
        }
      }
      setMounted(true);
      refreshAllData();
    });

    if (isSupabaseConfigured() && supabase) {
      // Hydrate session from Supabase on mount
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const email = session.user.email || '';
          const name =
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            session.user.user_metadata?.preferred_username ||
            email.split('@')[0];
          const isAdmin = email.toLowerCase().includes('admin') || session.user.user_metadata?.role === 'admin';
          const avatar =
            session.user.user_metadata?.avatar_url ||
            session.user.user_metadata?.picture ||
            session.user.user_metadata?.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=059669&color=fff`;

          const loggedUser: User = {
            name,
            email,
            role: isAdmin ? 'admin' : 'visitor',
            avatar,
          };
          setUser(loggedUser);
          if (typeof window !== 'undefined') {
            localStorage.setItem('punjabu_user', JSON.stringify(loggedUser));
          }
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          const email = session.user.email || '';
          const name =
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            session.user.user_metadata?.preferred_username ||
            email.split('@')[0];
          const isAdmin = email.toLowerCase().includes('admin') || session.user.user_metadata?.role === 'admin';
          const avatar =
            session.user.user_metadata?.avatar_url ||
            session.user.user_metadata?.picture ||
            session.user.user_metadata?.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=059669&color=fff`;

          const loggedUser: User = {
            name,
            email,
            role: isAdmin ? 'admin' : 'visitor',
            avatar,
          };
          setUser(loggedUser);
          if (typeof window !== 'undefined') {
            localStorage.setItem('punjabu_user', JSON.stringify(loggedUser));
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('punjabu_user');
          }
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [refreshAllData]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('punjabu_theme', nextTheme);
    }
  };

  const login = async (
    email: string,
    passwordOrRole?: string | 'admin' | 'visitor',
    roleOrName?: 'admin' | 'visitor' | string,
    name?: string
  ): Promise<{ success: boolean; error?: string }> => {
    let password = '';
    let role: 'admin' | 'visitor' = 'visitor';
    let userName = name;

    if (passwordOrRole === 'admin' || passwordOrRole === 'visitor') {
      role = passwordOrRole;
      userName = typeof roleOrName === 'string' ? roleOrName : name;
    } else {
      password = passwordOrRole || '';
      if (roleOrName === 'admin' || roleOrName === 'visitor') {
        role = roleOrName;
      }
    }

    const isEmailAdmin = email.toLowerCase().includes('admin') || role === 'admin';
    const finalRole: 'admin' | 'visitor' = isEmailAdmin ? 'admin' : 'visitor';
    const finalUserName = userName || (isEmailAdmin ? 'Admin Pengelola Punjabu' : email.split('@')[0]);

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: password || 'AdminPunjabu2026!',
      });

      if (error) {
        console.warn('Supabase Auth attempt error:', error.message);
        if (password) {
          let errorMsg = 'Email atau kata sandi salah.';
          if (error.message.includes('Invalid login credentials')) {
            errorMsg = 'Email atau kata sandi yang Anda masukkan salah.';
          } else if (error.message.includes('Email not confirmed')) {
            errorMsg = 'Email Anda belum dikonfirmasi. Silakan periksa inbox/spam email Anda.';
          } else {
            errorMsg = error.message;
          }
          return { success: false, error: errorMsg };
        }
      }
    }

    const newUser: User = {
      name: finalUserName,
      email,
      role: finalRole,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(finalUserName)}&background=059669&color=fff`,
    };
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('punjabu_user', JSON.stringify(newUser));
    }
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const signUp = async (
    email: string,
    password: string,
    name: string
  ): Promise<{ success: boolean; error?: string; message?: string }> => {
    if (!email || !password) {
      return { success: false, error: 'Email dan kata sandi wajib diisi.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Kata sandi minimal 6 karakter.' };
    }

    const isEmailAdmin = email.toLowerCase().includes('admin');
    const role: 'admin' | 'visitor' = isEmailAdmin ? 'admin' : 'visitor';
    const userName = name.trim() || email.split('@')[0];

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userName,
            name: userName,
            role,
          },
        },
      });

      if (error) {
        console.warn('Supabase SignUp error:', error.message);
        let errorMsg = error.message;
        if (error.message.includes('User already registered')) {
          errorMsg = 'Email ini sudah terdaftar. Silakan masuk menggunakan email Anda.';
        } else if (error.message.includes('Password should be at least')) {
          errorMsg = 'Kata sandi minimal 6 karakter.';
        }
        return { success: false, error: errorMsg };
      }

      if (data?.user && !data.session) {
        return {
          success: true,
          message: 'Registrasi berhasil! Silakan periksa email Anda untuk konfirmasi akun.',
        };
      }
    }

    const newUser: User = {
      name: userName,
      email,
      role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=059669&color=fff`,
    };
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('punjabu_user', JSON.stringify(newUser));
    }
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
          },
        });
        if (error) {
          console.warn('Google OAuth error:', error.message);
          let errorMsg = error.message;
          if (error.message.includes('provider is not enabled') || error.message.includes('Unsupported provider')) {
            errorMsg = 'Provider Google Auth belum diaktifkan di Supabase Dashboard (Authentication -> Providers -> Google).';
          }
          return { success: false, error: errorMsg };
        }
        return { success: true };
      } catch (err: unknown) {
        console.warn('Google OAuth notice:', err);
        const rawMsg = err instanceof Error ? err.message : String(err || '');
        let errorMsg = rawMsg || 'Gagal menghubungkan ke Google OAuth';
        if (errorMsg.includes('provider is not enabled') || errorMsg.includes('Unsupported provider')) {
          errorMsg = 'Provider Google Auth belum diaktifkan di Supabase Dashboard (Authentication -> Providers -> Google).';
        }
        return { success: false, error: errorMsg };
      }
    }

    const demoUser: User = {
      name: 'Pengunjung Google',
      email: 'user.google@gmail.com',
      role: 'visitor',
      avatar: 'https://ui-avatars.com/api/?name=Pengunjung+Google&background=059669&color=fff',
    };
    setUser(demoUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('punjabu_user', JSON.stringify(demoUser));
    }
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut notice:', err);
      }
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('punjabu_user');
    }
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const openBookingModal = () => setIsBookingModalOpen(true);
  const closeBookingModal = () => setIsBookingModalOpen(false);

  const openCalculator = () => setIsCalculatorOpen(true);
  const closeCalculator = () => setIsCalculatorOpen(false);

  // ========================
  // NEWS CRUD
  // ========================
  const addNews = async (newsItem: Omit<NewsArticle, 'id' | 'views' | 'date'>) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const slug = newsItem.slug || newsItem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('news').insert([
          {
            title: newsItem.title,
            slug: slug,
            category: newsItem.category,
            author: newsItem.author,
            author_role: newsItem.authorRole,
            date: formattedDate,
            read_time: newsItem.readTime,
            views: 0,
            featured: newsItem.featured,
            status: newsItem.status,
            summary: newsItem.summary,
            content: newsItem.content,
            cover_image: newsItem.coverImage,
            gallery: newsItem.gallery,
            video_url: newsItem.videoUrl,
            tags: newsItem.tags,
          },
        ]).select('*');

        if (!error && data && data.length > 0) {
          const newArticle = mapDbNews(data[0]);
          setNewsList((prev) => [newArticle, ...prev]);
          return;
        }
      } catch (err) {
        console.warn('Supabase addNews error:', err);
      }
    }

    const newArticle: NewsArticle = {
      ...newsItem,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      slug: slug,
      views: 0,
      date: formattedDate,
    };
    setNewsList((prev) => [newArticle, ...prev]);
  };

  const updateNews = async (id: string, updatedFields: Partial<NewsArticle>) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const payload: SupabaseNewsUpdatePayload = {};
        if (updatedFields.title !== undefined) payload.title = updatedFields.title;
        if (updatedFields.category !== undefined) payload.category = updatedFields.category;
        if (updatedFields.author !== undefined) payload.author = updatedFields.author;
        if (updatedFields.authorRole !== undefined) payload.author_role = updatedFields.authorRole;
        if (updatedFields.readTime !== undefined) payload.read_time = updatedFields.readTime;
        if (updatedFields.featured !== undefined) payload.featured = updatedFields.featured;
        if (updatedFields.status !== undefined) payload.status = updatedFields.status;
        if (updatedFields.summary !== undefined) payload.summary = updatedFields.summary;
        if (updatedFields.content !== undefined) payload.content = updatedFields.content;
        if (updatedFields.coverImage !== undefined) payload.cover_image = updatedFields.coverImage;
        if (updatedFields.gallery !== undefined) payload.gallery = updatedFields.gallery;
        if (updatedFields.videoUrl !== undefined) payload.video_url = updatedFields.videoUrl;
        if (updatedFields.tags !== undefined) payload.tags = updatedFields.tags;

        await supabase.from('news').update(payload).eq('id', id);
      } catch (err) {
        console.warn('Supabase updateNews error:', err);
      }
    }
    setNewsList((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item)));
  };

  const deleteNews = async (id: string) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('news').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteNews error:', err);
      }
    }
    setNewsList((prev) => prev.filter((item) => item.id !== id));
  };

  const incrementNewsViews = async (id: string) => {
    if (!id) return;

    // Session check: ensure a single tab session only increments once per article view
    if (typeof window !== 'undefined') {
      const sessionKey = `punjabu_news_viewed_${id}`;
      if (sessionStorage.getItem(sessionKey)) {
        return; // Already counted in this session
      }
      sessionStorage.setItem(sessionKey, 'true');
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        // Call atomic SQL function in Supabase (prevents stale overwrites)
        const { error: rpcError } = await supabase.rpc('increment_news_views', { target_id: id });

        if (rpcError) {
          // Fallback: Fetch current latest views directly from DB before incrementing
          const { data: dbNews } = await supabase.from('news').select('views').eq('id', id).single();
          const currentViews = dbNews?.views ?? 0;
          const nextViews = currentViews + 1;
          await supabase.from('news').update({ views: nextViews }).eq('id', id);

          setNewsList((prev) =>
            prev.map((item) => (item.id === id ? { ...item, views: nextViews } : item))
          );
          return;
        }

        // Fetch exact updated view count from database
        const { data: updatedNews } = await supabase.from('news').select('views').eq('id', id).single();
        if (updatedNews && updatedNews.views !== undefined) {
          setNewsList((prev) =>
            prev.map((item) => (item.id === id ? { ...item, views: updatedNews.views } : item))
          );
          return;
        }
      } catch (err) {
        console.warn('Supabase incrementNewsViews notice:', err);
      }
    }

    // Local fallback if offline
    setNewsList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, views: item.views + 1 } : item))
    );
  };

  const fetchNewsComments = async (newsId: string): Promise<Array<{ id: string; author: string; avatar?: string; text: string; date: string }>> => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('news_comments')
          .select('*')
          .eq('news_id', newsId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((c: { id: string; author_name: string; author_avatar?: string; comment_text: string; created_at: string }) => ({
            id: String(c.id),
            author: c.author_name,
            avatar: c.author_avatar || undefined,
            text: c.comment_text,
            date: new Date(c.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          }));
        }
      } catch (err) {
        console.warn('Supabase fetchNewsComments notice:', err);
      }
    }
    return [];
  };

  const addNewsComment = async (
    newsId: string,
    authorName: string,
    commentText: string,
    authorAvatar?: string
  ): Promise<{ id: string; author: string; avatar?: string; text: string; date: string } | null> => {
    const formattedDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('news_comments')
          .insert([
            {
              news_id: newsId,
              author_name: authorName,
              author_avatar: authorAvatar || null,
              comment_text: commentText,
            },
          ])
          .select('*');

        if (!error && data && data.length > 0) {
          return {
            id: String(data[0].id),
            author: data[0].author_name,
            avatar: data[0].author_avatar || undefined,
            text: data[0].comment_text,
            date: new Date(data[0].created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          };
        }
      } catch (err) {
        console.warn('Supabase addNewsComment notice:', err);
      }
    }

    return {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      author: authorName,
      avatar: authorAvatar,
      text: commentText,
      date: formattedDate,
    };
  };

  // ========================
  // TOURISM SPOTS CRUD
  // ========================
  const addTourismSpot = async (spot: Omit<TourismSpot, 'id'>) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('tourism_spots').insert([{
          title: spot.title,
          category: spot.category,
          description: spot.description,
          image: spot.image,
          badge: spot.badge,
          rating: spot.rating,
        }]).select('*');
        if (!error && data && data.length > 0) {
          const newSpot: TourismSpot = {
            id: String(data[0].id),
            title: data[0].title,
            category: data[0].category,
            description: data[0].description,
            image: data[0].image,
            badge: data[0].badge,
            rating: Number(data[0].rating) || 4.9,
          };
          setTourismSpots((prev) => [newSpot, ...prev]);
          return;
        }
      } catch (err) {
        console.warn('Supabase addTourismSpot error:', err);
      }
    }
    const newSpot: TourismSpot = { ...spot, id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}` };
    setTourismSpots((prev) => [newSpot, ...prev]);
  };

  const updateTourismSpot = async (id: string, spotFields: Partial<TourismSpot>) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('tourism_spots').update(spotFields).eq('id', id);
      } catch (err) {
        console.warn('Supabase updateTourismSpot error:', err);
      }
    }
    setTourismSpots((prev) => prev.map((s) => (s.id === id ? { ...s, ...spotFields } : s)));
  };

  const deleteTourismSpot = async (id: string) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('tourism_spots').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteTourismSpot error:', err);
      }
    }
    setTourismSpots((prev) => prev.filter((s) => s.id !== id));
  };

  // ========================
  // UMKM PRODUCTS CRUD
  // ========================
  const addUmkmProduct = async (product: Omit<UMKMProduct, 'id'>) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('umkm_products').insert([{
          name: product.name,
          price: product.price,
          price_unit: product.priceUnit,
          category: product.category,
          seller: product.seller,
          description: product.description,
          image: product.image,
          badge: product.badge,
        }]).select('*');
        if (!error && data && data.length > 0) {
          const newProduct: UMKMProduct = {
            id: String(data[0].id),
            name: data[0].name,
            price: Number(data[0].price),
            priceUnit: data[0].price_unit,
            category: data[0].category,
            seller: data[0].seller,
            description: data[0].description,
            image: data[0].image,
            badge: data[0].badge || undefined,
          };
          setUmkmProducts((prev) => [newProduct, ...prev]);
          return;
        }
      } catch (err) {
        console.warn('Supabase addUmkmProduct error:', err);
      }
    }
    const newProduct: UMKMProduct = { ...product, id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}` };
    setUmkmProducts((prev) => [newProduct, ...prev]);
  };

  const updateUmkmProduct = async (id: string, productFields: Partial<UMKMProduct>) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const payload: Record<string, unknown> = {};
        if (productFields.name !== undefined) payload.name = productFields.name;
        if (productFields.price !== undefined) payload.price = productFields.price;
        if (productFields.priceUnit !== undefined) payload.price_unit = productFields.priceUnit;
        if (productFields.category !== undefined) payload.category = productFields.category;
        if (productFields.seller !== undefined) payload.seller = productFields.seller;
        if (productFields.description !== undefined) payload.description = productFields.description;
        if (productFields.image !== undefined) payload.image = productFields.image;
        if (productFields.badge !== undefined) payload.badge = productFields.badge;

        await supabase.from('umkm_products').update(payload).eq('id', id);
      } catch (err) {
        console.warn('Supabase updateUmkmProduct error:', err);
      }
    }
    setUmkmProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...productFields } : p)));
  };

  const deleteUmkmProduct = async (id: string) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('umkm_products').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteUmkmProduct error:', err);
      }
    }
    setUmkmProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // ========================
  // REVIEWS & BOOKINGS
  // ========================
  const addReview = async (reviewData: Omit<VisitorReview, 'id' | 'date'>) => {
    const formattedDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('visitor_reviews').insert([{
          name: reviewData.name,
          origin: reviewData.origin,
          rating: reviewData.rating,
          date: formattedDate,
          comment: reviewData.comment,
          avatar: reviewData.avatar,
          spot: reviewData.spot,
        }]).select('*');
        if (!error && data && data.length > 0) {
          const newRev: VisitorReview = {
            id: String(data[0].id),
            name: data[0].name,
            origin: data[0].origin,
            rating: Number(data[0].rating),
            date: data[0].date,
            comment: data[0].comment,
            avatar: data[0].avatar,
            spot: data[0].spot,
          };
          setReviews((prev) => [newRev, ...prev]);
          return;
        }
      } catch (err) {
        console.warn('Supabase addReview error:', err);
      }
    }
    const newRev: VisitorReview = { ...reviewData, id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, date: formattedDate };
    setReviews((prev) => [newRev, ...prev]);
  };

  const deleteReview = async (id: string) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('visitor_reviews').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteReview error:', err);
      }
    }
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const createBooking = async (bookingData: Omit<BookingRecord, 'id' | 'status' | 'createdAt'>): Promise<BookingRecord | null> => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('bookings').insert([{
          user_name: bookingData.userName,
          user_phone: bookingData.userPhone,
          user_email: bookingData.userEmail,
          booking_date: bookingData.bookingDate,
          ticket_qty: bookingData.ticketQty,
          tent_qty: bookingData.tentQty,
          guide_included: bookingData.guideIncluded,
          total_price: bookingData.totalPrice,
          notes: bookingData.notes,
          status: 'Pending',
        }]).select('*');

        if (!error && data && data.length > 0) {
          const created: BookingRecord = {
            id: String(data[0].id),
            userName: data[0].user_name,
            userPhone: data[0].user_phone,
            userEmail: data[0].user_email,
            bookingDate: data[0].booking_date,
            ticketQty: data[0].ticket_qty,
            tentQty: data[0].tent_qty,
            guideIncluded: data[0].guide_included,
            totalPrice: data[0].total_price,
            notes: data[0].notes,
            status: data[0].status as BookingRecord['status'],
            createdAt: data[0].created_at,
          };
          setBookings((prev) => [created, ...prev]);
          return created;
        }
      } catch (err) {
        console.warn('Supabase createBooking error:', err);
      }
    }

    const created: BookingRecord = {
      ...bookingData,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [created, ...prev]);
    return created;
  };

  const updateBookingStatus = async (id: string, status: 'Pending' | 'Confirmed' | 'Cancelled') => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('bookings').update({ status }).eq('id', id);
      } catch (err) {
        console.warn('Supabase updateBookingStatus error:', err);
      }
    }
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const deleteBooking = async (id: string) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('bookings').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteBooking error:', err);
      }
    }
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const addFaq = async (faq: Omit<FAQItem, 'id'>) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('faqs').insert([faq]).select('*');
        if (!error && data && data.length > 0) {
          const newFaq: FAQItem = {
            id: String(data[0].id),
            question: data[0].question,
            answer: data[0].answer,
            category: data[0].category as FAQItem['category'],
          };
          setFaqs((prev) => [...prev, newFaq]);
          return;
        }
      } catch (err) {
        console.warn('Supabase addFaq error:', err);
      }
    }
    setFaqs((prev) => [...prev, { ...faq, id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}` }]);
  };

  const deleteFaq = async (id: string) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('faqs').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteFaq error:', err);
      }
    }
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  const addGalleryItem = async (item: Omit<GalleryItem, 'id'>) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('gallery_images').insert([{
          title: item.title,
          category: item.category,
          image_url: item.imageUrl,
          description: item.description,
        }]).select('*');

        if (!error && data && data.length > 0) {
          const newItem: GalleryItem = {
            id: String(data[0].id),
            title: data[0].title,
            category: data[0].category,
            imageUrl: data[0].image_url,
            description: data[0].description || undefined,
          };
          setGalleryItems((prev) => [newItem, ...prev]);
          return;
        }
      } catch (err) {
        console.warn('Supabase addGalleryItem error:', err);
      }
    }
    setGalleryItems((prev) => [{ ...item, id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}` }, ...prev]);
  };

  const deleteGalleryItem = async (id: string) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('gallery_images').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteGalleryItem error:', err);
      }
    }
    setGalleryItems((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        user,
        login,
        signUp,
        loginWithGoogle,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        isBookingModalOpen,
        openBookingModal,
        closeBookingModal,
        isCalculatorOpen,
        openCalculator,
        closeCalculator,

        // News
        newsList,
        addNews,
        updateNews,
        deleteNews,
        incrementNewsViews,
        fetchNewsComments,
        addNewsComment,

        // Tourism Spots
        tourismSpots,
        addTourismSpot,
        updateTourismSpot,
        deleteTourismSpot,

        // UMKM Products
        umkmProducts,
        addUmkmProduct,
        updateUmkmProduct,
        deleteUmkmProduct,

        // Reviews
        reviews,
        addReview,
        deleteReview,

        // Bookings
        bookings,
        createBooking,
        updateBookingStatus,
        deleteBooking,

        // FAQs, Routes, Gallery
        faqs,
        addFaq,
        deleteFaq,
        travelRoutes,
        galleryItems,
        addGalleryItem,
        deleteGalleryItem,

        // System
        stats,
        mounted,
        supabaseActive,
        refreshAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
