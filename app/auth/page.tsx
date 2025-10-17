'use client';

// Supabase Authentication Page for Next.js
import React from 'react';
import SupabaseAuth from '../../src/shared/components/auth/SupabaseAuth';

const AuthPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      <SupabaseAuth redirectTo="/dashboard" />
    </div>
  );
};

export default AuthPage;