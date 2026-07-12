'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * Reusable layout wrapper to protect client-side routes
 */
export default function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-200">
        <Loader2 className="animate-spin h-10 w-10 text-violet-500 mb-4" />
        <p className="text-sm text-slate-400 font-medium">Securing session...</p>
      </div>
    );
  }

  return isAuthenticated ? children : null;
}
