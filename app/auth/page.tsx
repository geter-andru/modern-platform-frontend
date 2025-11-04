'use client';

// Supabase Authentication Page for Next.js
import React from 'react';
import { useSearchParams } from 'next/navigation';
import SupabaseAuth from '../../src/shared/components/auth/SupabaseAuth';

const AuthPage: React.FC = () => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--background-primary)' }}
    >
      <div className="w-full max-w-md">
        <SupabaseAuth redirectTo={redirectTo} />
      </div>
    </div>
  );
};

export default AuthPage;