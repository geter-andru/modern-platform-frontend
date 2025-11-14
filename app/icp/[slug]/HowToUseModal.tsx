'use client';

import React from 'react';

interface HowToUseModalProps {
  isOpen: boolean;
  onClose: () => void;
  personaRole: string;
  triggeringMoment: string;
}

export default function HowToUseModal({
  isOpen,
  onClose,
  personaRole,
  triggeringMoment,
}: HowToUseModalProps) {
  if (!isOpen) return null;

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="relative max-w-2xl w-full rounded-2xl p-8"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg transition-colors"
          style={{
            color: '#a3a3a3',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.color = '#a3a3a3';
          }}
          aria-label="Close modal"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Modal content */}
        <h2
          className="text-2xl md:text-3xl font-bold mb-6 pr-8"
          style={{ color: '#ffffff' }}
        >
          How To Use This Scenario
        </h2>

        <div className="space-y-4" style={{ color: '#e5e5e5', lineHeight: '1.7' }}>
          <div className="flex gap-3">
            <span style={{ color: '#a3a3a3', flexShrink: 0 }}>→</span>
            <p>
              <strong style={{ color: '#ffffff' }}>Compare yourself:</strong> Most{' '}
              {personaRole} tell us they're facing {triggeringMoment}. If this sounds
              familiar, the example shows what clarity looks like.
            </p>
          </div>

          <div className="flex gap-3">
            <span style={{ color: '#a3a3a3', flexShrink: 0 }}>→</span>
            <p>
              <strong style={{ color: '#ffffff' }}>See the structure:</strong> Notice how
              the company understands their buyer's triggering moment, worst-case outcome,
              and the exact value prop that addresses it. This is what Andru extracts for
              you automatically.
            </p>
          </div>

          <div className="flex gap-3">
            <span style={{ color: '#a3a3a3', flexShrink: 0 }}>→</span>
            <p>
              <strong style={{ color: '#ffffff' }}>Borrow the language:</strong> The exact
              phrases in this scenario came from real conversations with their ICP. You can
              use similar phrasing when talking about your solution.
            </p>
          </div>

          <div className="flex gap-3">
            <span style={{ color: '#a3a3a3', flexShrink: 0 }}>→</span>
            <p>
              <strong style={{ color: '#ffffff' }}>Apply to your situation:</strong> After
              reviewing, get your own Intelligence Score to see how your positioning
              compares to companies that have achieved this level of market clarity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
