'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { NewsArticle, INITIAL_NEWS, VillageStats, INITIAL_STATS } from '@/data/initialData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface User {
  name: string;
  email: string;
  role: 'admin' | 'visitor';
  avatar?: string;
}

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  user: User | null;
  login: (email: string, role?: 'admin' | 'visitor', name?: string) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isBookingModalOpen: boolean;
  openBookingModal: () => void;
  closeBookingModal: () => void;
  newsList: NewsArticle[];
  addNews: (newsItem: Omit<NewsArticle, 'id' | 'views' | 'date'>) => Promise<void>;
  updateNews: (id: string, updatedFields: Partial<NewsArticle>) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  stats: VillageStats;
  mounted: boolean;
  supabaseActive: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [newsList, setNewsList] = useState<NewsArticle[]>(INITIAL_NEWS);
  const [stats, setStats] = useState<VillageStats>({ ...INITIAL_STATS, totalNews: INITIAL_NEWS.length });
  const [mounted, setMounted] = useState(false);
  const [supabaseActive, setSupabaseActive] = useState(false);

  // Helper to map DB record to NewsArticle interface
  const mapDbNews = (item: any): NewsArticle => ({
    id: String(item.id),
    title: item.title,
    slug: item.slug || item.id,
    category: item.category,
    author: item.author || 'Tim Redaksi Desa',
    authorRole: item.author_role || item.authorRole || 'Pengelola Wisata',
    date: item.date,
    readTime: item.read_time || item.readTime || '3 min baca',
    views: item.views || 0,
    featured: item.featured || false,
    status: item.status || 'Published',
    summary: item.summary,
    content: item.content,
    coverImage: item.cover_image || item.coverImage,
    gallery: item.gallery || [],
    videoUrl: item.video_url || item.videoUrl,
    tags: item.tags || [],
  });

  // Fetch news from Supabase or fallback to LocalStorage
  const fetchNews = async () => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map(mapDbNews);
          setNewsList(mapped);
          setStats((prev) => ({ ...prev, totalNews: mapped.length }));
          setSupabaseActive(true);
          return;
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local storage:', err);
      }
    }

    // Fallback to localStorage
    const savedNews = localStorage.getItem('punjabu_news');
    if (savedNews) {
      try {
        const parsed = JSON.parse(savedNews);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNewsList(parsed);
          setStats((prev) => ({ ...prev, totalNews: parsed.length }));
          return;
        }
      } catch (e) {
        console.error('Error loading news from storage:', e);
      }
    }

    // If nothing found in Supabase or localStorage, fallback to INITIAL_NEWS
    setNewsList(INITIAL_NEWS);
    setStats((prev) => ({ ...prev, totalNews: INITIAL_NEWS.length }));
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('punjabu_theme') as 'dark' | 'light' | null;
    const savedUser = localStorage.getItem('punjabu_user');

    queueMicrotask(() => {
      if (savedTheme) setTheme(savedTheme);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error('Error loading user from storage:', e);
        }
      }
      fetchNews();
      setMounted(true);
    });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('punjabu_theme', nextTheme);
  };

  const login = async (email: string, role: 'admin' | 'visitor' = 'visitor', name?: string) => {
    const isEmailAdmin = email.toLowerCase().includes('admin') || role === 'admin';
    const finalRole: 'admin' | 'visitor' = isEmailAdmin ? 'admin' : 'visitor';
    const userName = name || (isEmailAdmin ? 'Admin Pengelola Punjabu' : email.split('@')[0]);

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data } = await supabase.auth.signInWithPassword({
          email: email,
          password: 'AdminPunjabu2026!',
        });
        if (data?.user) {
          console.log('Session active Supabase Auth user:', data.user.email);
        }
      } catch (err) {
        console.warn('Supabase Auth attempt:', err);
      }
    }

    const newUser: User = {
      name: userName,
      email,
      role: finalRole,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=059669&color=fff`,
    };
    setUser(newUser);
    localStorage.setItem('punjabu_user', JSON.stringify(newUser));
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('punjabu_user');
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const openBookingModal = () => setIsBookingModalOpen(true);
  const closeBookingModal = () => setIsBookingModalOpen(false);

  const saveNewsToStorage = (updatedList: NewsArticle[]) => {
    setNewsList(updatedList);
    localStorage.setItem('punjabu_news', JSON.stringify(updatedList));
    setStats((prev) => ({ ...prev, totalNews: updatedList.length }));
  };

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
          const updatedList = [newArticle, ...newsList];
          setNewsList(updatedList);
          setStats((prev) => ({ ...prev, totalNews: updatedList.length }));
          return;
        }
      } catch (err) {
        console.warn('Supabase addNews failed, falling back to localStorage:', err);
      }
    }

    // Fallback to localStorage
    const newArticle: NewsArticle = {
      ...newsItem,
      id: Date.now().toString(),
      slug: slug,
      views: 0,
      date: formattedDate,
    };
    const updatedList = [newArticle, ...newsList];
    saveNewsToStorage(updatedList);
  };

  const updateNews = async (id: string, updatedFields: Partial<NewsArticle>) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const payload: any = {};
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

        const { error } = await supabase.from('news').update(payload).eq('id', id);
        if (!error) {
          const updatedList = newsList.map((item) => (item.id === id ? { ...item, ...updatedFields } : item));
          setNewsList(updatedList);
          return;
        }
      } catch (err) {
        console.warn('Supabase updateNews failed, falling back to localStorage:', err);
      }
    }

    // Fallback to localStorage
    const updatedList = newsList.map((item) => (item.id === id ? { ...item, ...updatedFields } : item));
    saveNewsToStorage(updatedList);
  };

  const deleteNews = async (id: string) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('news').delete().eq('id', id);
        if (!error) {
          const updatedList = newsList.filter((item) => item.id !== id);
          setNewsList(updatedList);
          setStats((prev) => ({ ...prev, totalNews: updatedList.length }));
          return;
        }
      } catch (err) {
        console.warn('Supabase deleteNews failed, falling back to localStorage:', err);
      }
    }

    // Fallback to localStorage
    const updatedList = newsList.filter((item) => item.id !== id);
    saveNewsToStorage(updatedList);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        user,
        login,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        isBookingModalOpen,
        openBookingModal,
        closeBookingModal,
        newsList,
        addNews,
        updateNews,
        deleteNews,
        stats,
        mounted,
        supabaseActive,
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
