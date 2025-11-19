'use client';

export function ActiveMilestonesCard({ milestones, isLoading, customerId }: any) {
  if (isLoading) return <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 animate-pulse h-64"></div>;
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Active Milestones</h3>
      <div className="space-y-3 text-sm text-white/60">
        <div>✓ First $50K Deal Closed</div>
        <div>⏳ 3 Business Cases (2/3 - 67%)</div>
        <div>🔒 First $100K Deal (1/2 deals)</div>
      </div>
    </div>
  );
}
