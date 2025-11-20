'use client';

import Link from 'next/link';

export function QuickActionsCard({ customerId }: { customerId: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      <div className="space-y-2">
        <Link href="/tools/icp" className="block px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
          Generate ICP Analysis
        </Link>
        <Link href="/tools/business-case" className="block px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
          Create Business Case
        </Link>
        <Link href="/resources" className="block px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
          Access Resource Library →
        </Link>
      </div>
    </div>
  );
}
