import { Suspense } from 'react';
import ModernPlatformDashboard from './ModernPlatformDashboard';

// Generate static params for known customer IDs  
export async function generateStaticParams() {
  return [
    { customerId: 'dru9K2L7M8N4P5Q6' }, // Test user
    { customerId: 'dru78DR9789SDF862' }, // Admin user  
    { customerId: 'dru90BT3821XCP479' }, // Additional user
  ];
}

export default function SimplifiedDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h1 className="text-xl font-semibold text-gray-200 mb-2">Loading H&S Revenue Intelligence Platform</h1>
          <p className="text-gray-400">Initializing your professional dashboard...</p>
        </div>
      </div>
    }>
      <ModernPlatformDashboard />
    </Suspense>
  );
}