import SupabaseAuth from '../../src/shared/components/auth/SupabaseAuth';

export default function LoginPage() {
  return <SupabaseAuth redirectTo="/dashboard" />;
}