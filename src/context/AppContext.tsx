'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { NewsArticle, INITIAL_NEWS, VillageStats, INITIAL_STATS } from '@/data/initialData';

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
  addNews: (newsItem: Omit<NewsArticle, 'id' | 'views' | 'date'>) => void;
  updateNews: (id: string, updatedFields: Partial<NewsArticle>) => void;
  deleteNews: (id: string) => void;
  stats: VillageStats;
  mounted: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always start with SSR-safe defaults — NO window/localStorage access here
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [newsList, setNewsList] = useState<NewsArticle[]>(INITIAL_NEWS);
  const [stats, setStats] = useState<VillageStats>({ ...INITIAL_STATS, totalNews: INITIAL_NEWS.length });
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage ONLY after mount (client-side)
  useEffect(() => {
    const savedTheme = localStorage.getItem('punjabu_theme') as 'dark' | 'light' | null;
    const savedUser = localStorage.getItem('punjabu_user');
    const savedNews = localStorage.getItem('punjabu_news');

    queueMicrotask(() => {
      if (savedTheme) setTheme(savedTheme);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error('Error loading user from storage:', e);
        }
      }
      if (savedNews) {
        try {
          const parsed = JSON.parse(savedNews);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setNewsList(parsed);
            setStats((prev) => ({ ...prev, totalNews: parsed.length }));
          }
        } catch (e) {
          console.error('Error loading news from storage:', e);
        }
      }
      setMounted(true);
    });
  }, []);

  // Sync theme class on document element whenever theme changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('punjabu_theme', nextTheme);
  };

  const login = (email: string, role: 'admin' | 'visitor' = 'visitor', name?: string) => {
    const userName = name || email.split('@')[0];
    const newUser: User = {
      name: userName,
      email,
      role,
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

  const addNews = (newsItem: Omit<NewsArticle, 'id' | 'views' | 'date'>) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const newArticle: NewsArticle = {
      ...newsItem,
      id: Date.now().toString(),
      views: 0,
      date: formattedDate,
    };
    const updatedList = [newArticle, ...newsList];
    saveNewsToStorage(updatedList);
  };

  const updateNews = (id: string, updatedFields: Partial<NewsArticle>) => {
    const updatedList = newsList.map((item) => (item.id === id ? { ...item, ...updatedFields } : item));
    saveNewsToStorage(updatedList);
  };

  const deleteNews = (id: string) => {
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
