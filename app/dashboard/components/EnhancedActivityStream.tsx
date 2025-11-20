'use client';

export function EnhancedActivityStream({ customerId, isLoading }: { customerId?: string; isLoading: boolean }) {
  // TODO: Fetch from API
  const activities = [
    {
      type: 'capability-building',
      capability: 'Value Communication',
      action: 'Created Acme Corp business case',
      capabilityChange: { from: 52, to: 60, gain: 8 },
      predictedImpact: '+4% win rate Q2 → +$280K ARR',
      immediateImpact: 'Acme deal +35% close probability',
      timestamp: '2h ago',
      icon: '🔴'
    },
    {
      type: 'capability-building',
      capability: 'Customer Intelligence',
      action: 'Refined ICP for enterprise segment',
      capabilityChange: { from: 59, to: 67, gain: 8 },
      predictedImpact: 'Targeting accuracy +12% → 3 qualified leads/week',
      immediateImpact: 'Enterprise qualification framework built',
      timestamp: '1 day ago',
      icon: '🎯'
    },
    {
      type: 'behavioral-pattern',
      pattern: '3 business cases in 30 days',
      capability: 'Value Communication',
      insight: 'Systematic value communication established (not one-off)',
      trajectory: '60% → 68% capability predicted next month',
      timestamp: '2 days ago',
      icon: '📊'
    }
  ];

  if (isLoading) return <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 animate-pulse h-48"></div>;

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">What I've been building</h3>
          <p className="text-xs text-white/50 mt-1">Actions that improve my capability scores</p>
        </div>
        <select className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>All time</option>
        </select>
      </div>
      <div className="space-y-3 text-sm">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all">
            <span className="text-lg">{activity.icon}</span>
            <div className="flex-1">
              {activity.type === 'capability-building' ? (
                <>
                  <div className="text-white font-medium">Built {activity.capability} Capability</div>
                  <div className="text-white/70 text-xs mt-1">{activity.action}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-300">
                      Capability: {activity.capabilityChange?.from}% → {activity.capabilityChange?.to}% (+{activity.capabilityChange?.gain}%)
                    </span>
                  </div>
                  <div className="text-purple-300 text-xs mt-2">
                    ↗ Predicted Impact: {activity.predictedImpact}
                  </div>
                  <div className="text-green-300 text-xs mt-1">
                    ✓ Immediate Impact: {activity.immediateImpact}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-white font-medium">Pattern Detected: {activity.pattern}</div>
                  <div className="text-white/70 text-xs mt-1">{activity.insight}</div>
                  <div className="text-blue-300 text-xs mt-2">
                    ↗ Capability Trajectory: {activity.trajectory}
                  </div>
                </>
              )}
            </div>
            <span className="text-xs text-white/40 whitespace-nowrap">{activity.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
