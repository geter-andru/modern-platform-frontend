'use client';

export function RevenueTrendChart({ customerId, isLoading }: { customerId?: string; isLoading: boolean }) {
  if (isLoading) return <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 animate-pulse h-64"></div>;
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-1">Revenue Trajectory</h3>
      <p className="text-sm text-white/60 mb-6">Business performance over time</p>
      <div className="h-48 flex items-center justify-center text-white/40">
        Chart component - TODO: Implement with real data
      </div>
    </div>
  );
}
