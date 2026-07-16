'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import AuthGuard from '../../components/AuthGuard';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role) {
      router.replace(`/dashboard/${user.role.toLowerCase()}`);
    }
  }, [user, router]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center">
        {/* Background Blurs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-caramel/10 blur-[130px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-coffee/10 blur-[150px]" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          <Loader2 className="animate-spin text-brownie h-10 w-10 mb-4" />
          <p className="text-brownie font-bold text-sm tracking-wide">Loading your dashboard...</p>
        </div>
      </div>
    </AuthGuard>
  );
}
