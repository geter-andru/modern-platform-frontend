'use client';

export function EnhancedActivityStream({ customerId, isLoading }: { customerId?: string; isLoading: boolean }) {
  if (isLoading) return <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 animate-pulse h-48"></div>;
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        <select className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>All time</option>
        </select>
      </div>
      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
          <span className="text-lg">🔴</span>
          <div className="flex-1">
            <div className="text-white font-medium">Generated Business Case - Acme Corp</div>
            <div className="text-white/60 text-xs mt-1">Critical Impact • Value Communication +8%</div>
            <div className="text-white/50 text-xs mt-1">→ Supports $200K deal (+6% to ARR goal)</div>
          </div>
          <span className="text-xs text-white/40">2h ago</span>
        </div>
      </div>
    </div>
  );
}
