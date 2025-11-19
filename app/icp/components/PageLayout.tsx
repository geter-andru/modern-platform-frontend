'use client';

import React from 'react';

interface PageLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

/**
 * PageLayout - Simple flex layout with sidebar + content
 *
 * Pattern:
 * - Flex container with min-h-screen
 * - Sidebar on left (fixed width handled by sidebar component)
 * - Main content area (flex-1)
 * - No animations, no CSS variables
 */
export default function PageLayout({ sidebar, children }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#1a2332]">
      {/* Sidebar */}
      {sidebar}

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden">
        <div className="max-w-5xl mx-auto px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
