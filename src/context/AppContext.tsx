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
  INITIAL_STATS,
  BookingRecord,
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
  login: (email: string, role?: 'admin' | 'visitor', name?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
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

  // Bookings
  bookings: BookingRecord[];
  createBooking: (bookingData: Omit<BookingRecord, 'id' | 'status' | 'createdAt'>) => Promise<BookingRecord | null>;
  updateBookingStatus: (id: string, status: 'Pending' | 'Confirmed' | 'Cancelled') => Promise<void>;

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

  const [stats, setStats] = useState<VillageStats>({ ...INITIAL_STATS, totalNews: INITIAL_NEWS.length });
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
        const { data: spotsData } = await supabase.from('tourism_spots').select('*').order('created_at', { ascending: false });
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
        const { data: umkmData } = await supabase.from('umkm_products').select('*').order('created_at', { ascending: false });
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
      } catch (err) {
        console.warn('Error fetching Supabase data, utilizing active state fallbacks:', err);
      }
    }
  }, [mapDbNews]);

  // Update Stats based on dynamic state
  useEffect(() => {
    setStats({
      totalVisitors: 18450 + bookings.length * 3,
      totalNews: newsList.length,
      activeAttractions: tourismSpots.length,
      totalInquiries: 310 + bookings.length,
    });
  }, [newsList.length, tourismSpots.length, bookings.length]);

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
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const email = session.user.email || '';
          const name = session.user.user_metadata?.name || session.user.user_metadata?.full_name || email.split('@')[0];
          const isAdmin = email.toLowerCase().includes('admin') || session.user.user_metadata?.role === 'admin';
          const loggedUser: User = {
            name,
            email,
            role: isAdmin ? 'admin' : 'visitor',
            avatar: session.user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=059669&color=fff`,
          };
          setUser(loggedUser);
          localStorage.setItem('punjabu_user', JSON.stringify(loggedUser));
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

  const login = async (email: string, role: 'admin' | 'visitor' = 'visitor', name?: string) => {
    const isEmailAdmin = email.toLowerCase().includes('admin') || role === 'admin';
    const finalRole: 'admin' | 'visitor' = isEmailAdmin ? 'admin' : 'visitor';
    const userName = name || (isEmailAdmin ? 'Admin Pengelola Punjabu' : email.split('@')[0]);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signInWithPassword({
          email: email,
          password: 'AdminPunjabu2026!',
        });
      } catch (err) {
        console.warn('Supabase Auth attempt notice:', err);
      }
    }

    const newUser: User = {
      name: userName,
      email,
      role: finalRole,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=059669&color=fff`,
    };
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('punjabu_user', JSON.stringify(newUser));
    }
    setIsAuthModalOpen(false);
  };

  const loginWithGoogle = async () => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
          },
        });
        if (!error) {
          setIsAuthModalOpen(false);
          return;
        }
      } catch (err) {
        console.warn('Google OAuth notice:', err);
      }
    }
    await login('user.google@gmail.com', 'visitor', 'Pengunjung Google');
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
      id: Date.now().toString(),
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
    const newSpot: TourismSpot = { ...spot, id: Date.now().toString() };
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
    const newProduct: UMKMProduct = { ...product, id: Date.now().toString() };
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
    const newRev: VisitorReview = { ...reviewData, id: Date.now().toString(), date: formattedDate };
    setReviews((prev) => [newRev, ...prev]);
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
      id: Date.now().toString(),
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

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        user,
        login,
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

        // Bookings
        bookings,
        createBooking,
        updateBookingStatus,

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
