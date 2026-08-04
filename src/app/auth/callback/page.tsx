'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Loader2, AlertCircle } from 'lucide-react';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const handleCallback = async () => {
      if (!isSupabaseConfigured() || !supabase) {
        if (isMounted) router.replace('/');
        return;
      }

      try {
        const code = searchParams.get('code');
        const errorDesc = searchParams.get('error_description');
        const next = searchParams.get('next') ?? '/';

        if (errorDesc) {
          if (isMounted) setError(errorDesc);
          setTimeout(() => {
            if (isMounted) router.replace('/');
          }, 3500);
          return;
        }

        if (code) {
          // Exchange authorization code for session in browser environment (where PKCE code verifier is stored)
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error('Error exchanging OAuth code for session:', exchangeError.message);
            // Fallback check: see if session is already established
            const { data: sessionData } = await supabase.auth.getSession();
            if (!sessionData.session) {
              if (isMounted) setError(exchangeError.message);
              setTimeout(() => {
                if (isMounted) router.replace('/');
              }, 3500);
              return;
            }
          }
        } else {
          // Check session if code parameter is not present
          await supabase.auth.getSession();
        }

        if (isMounted) {
          router.replace(next);
        }
      } catch (err: unknown) {
        console.error('Unexpected Auth Callback error:', err);
        if (isMounted) {
          router.replace('/');
        }
      }
    };

    handleCallback();

    return () => {
      isMounted = false;
    };
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center gap-4 text-center max-w-sm p-6 bg-zinc-900/90 border border-emerald-500/30 rounded-3xl backdrop-blur-xl shadow-2xl">
      {error ? (
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-base font-bold text-white">Autentikasi Google Gagal</p>
            <p className="text-xs text-red-400 mt-1 leading-relaxed">{error}</p>
          </div>
          <p className="text-[11px] text-zinc-500 pt-2">Mengalihkan kembali ke halaman utama...</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <p className="text-base font-bold text-white">Memproses Masuk dengan Google...</p>
            <p className="text-xs text-zinc-400 mt-1">Mengambil profil nama & foto Anda dari Google.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-4">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-3 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
            <p className="text-sm font-medium text-zinc-400">Memuat halaman autentikasi...</p>
          </div>
        }
      >
        <CallbackContent />
      </Suspense>
    </div>
  );
}
