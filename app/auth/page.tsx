'use client';

// Supabase Authentication Page for Next.js
import React from 'react';
import { useSearchParams } from 'next/navigation';
import SupabaseAuth from '../../src/shared/components/auth/SupabaseAuth';

const AuthPage: React.FC = () => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  return (
    <div className="min-h-screen bg-gray-950">
      <SupabaseAuth redirectTo={redirectTo} />
    </div>
  );
};

export default AuthPage;