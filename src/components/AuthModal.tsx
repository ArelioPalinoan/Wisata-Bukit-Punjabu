'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '@/context/AppContext';
import { X, Mail, Lock, User as UserIcon, ShieldAlert, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, signUp, loginWithGoogle } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email) {
      setErrorMsg('Alamat email wajib diisi.');
      return;
    }
    if (!password) {
      setErrorMsg('Kata sandi wajib diisi.');
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        const res = await signUp(email, password, name);
        if (!res.success) {
          setErrorMsg(res.error || 'Gagal mendaftar akun.');
        } else if (res.message) {
          setSuccessMsg(res.message);
        }
      } else {
        const isAdmin = email.toLowerCase().includes('admin');
        const res = await login(email, password, isAdmin ? 'admin' : 'visitor', name);
        if (!res.success) {
          setErrorMsg(res.error || 'Gagal masuk. Periksa kembali email & kata sandi.');
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err || '');
      setErrorMsg(msg || 'Terjadi kesalahan saat autentikasi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res && !res.success) {
        setErrorMsg(res.error || 'Gagal masuk dengan akun Google.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err || '');
      setErrorMsg(msg || 'Terjadi kesalahan saat koneksi Google OAuth.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAdminLogin = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);
    try {
      await login('admin.punjabu@gmail.com', 'admin', 'Admin Pengelola Punjabu');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  React.useEffect(() => {
    if (!isAuthModalOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAuthModal();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen || !mounted) return null;

  return createPortal(
    <div
      onClick={closeAuthModal}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 overflow-hidden cursor-default"
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          disabled={isLoading}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3">
            <UserIcon className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {isSignUp ? 'Buat Akun Baru' : 'Selamat Datang Kembali'}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {isSignUp
              ? 'Daftar untuk mengakses fitur lengkap Wisata Bukit Punjabu'
              : 'Masuk untuk mengakses portal berita dan layanan desa'}
          </p>
        </div>

        {/* Alert Notifications */}
        {errorMsg && (
          <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-2.5 text-xs text-emerald-700 dark:text-emerald-300 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  disabled={isLoading}
                  placeholder="Nama Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition disabled:opacity-60"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
              <input
                type="email"
                required
                disabled={isLoading}
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
              <input
                type="password"
                required
                disabled={isLoading}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition disabled:opacity-60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/30 transition duration-200 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : isSignUp ? (
              'Daftar Akun'
            ) : (
              'Masuk Sekarang'
            )}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
          </div>
          <span className="relative bg-white dark:bg-zinc-900 px-3 text-xs text-zinc-400">
            atau lanjutkan dengan
          </span>
        </div>

        {/* Social Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-800 dark:text-zinc-200 font-medium rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center gap-2 text-sm transition disabled:opacity-60"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.25 21.32 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.68 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          Masuk dengan Google
        </button>

        {/* Quick Demo Admin Login */}
        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 text-center">
          <button
            onClick={handleQuickAdminLogin}
            type="button"
            disabled={isLoading}
            className="w-full py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-60"
          >
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            Mode Demo: Masuk Langsung Sebagai Admin
          </button>
        </div>

        {/* Toggle Login/Signup Switcher */}
        <div className="mt-5 text-center text-xs text-zinc-500 dark:text-zinc-400">
          {isSignUp ? 'Sudah memiliki akun?' : 'Belum punya akun?'}{' '}
          <button
            type="button"
            onClick={toggleMode}
            disabled={isLoading}
            className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline ml-1 disabled:opacity-50"
          >
            {isSignUp ? 'Masuk di sini' : 'Daftar sekarang'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
