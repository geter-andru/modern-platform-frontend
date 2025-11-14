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
          Use This Scenario Today
        </h2>

        <div className="space-y-4" style={{ color: '#e5e5e5', lineHeight: '1.7' }}>
          <div className="flex gap-3">
            <span style={{ color: '#a3a3a3', flexShrink: 0 }}>→</span>
            <p>
              <strong style={{ color: '#ffffff' }}>Use it in your next sales call:</strong> Walk prospects through this exact sequence—"Most{' '}
              {personaRole} tell us they're facing {triggeringMoment}. Does that match your experience?"—
              then show how your product changes each moment. You're demonstrating understanding, not pitching features.
            </p>
          </div>

          <div className="flex gap-3">
            <span style={{ color: '#a3a3a3', flexShrink: 0 }}>→</span>
            <p>
              <strong style={{ color: '#ffffff' }}>Turn this into discovery questions:</strong> Each 
              "what they're thinking/feeling" moment becomes a qualification question. 
              If prospects confirm these pain points, they're likely qualified. If they don't recognize 
              them, they're probably not your ideal customer—move on.
            </p>
          </div>

          <div className="flex gap-3">
            <span style={{ color: '#a3a3a3', flexShrink: 0 }}>→</span>
            <p>
              <strong style={{ color: '#ffffff' }}>Test it as outbound copy:</strong> Send this scenario to 
              10 prospects who match the persona with the subject line: 
              "Does this workflow challenge sound familiar?" Track responses. If it resonates, you're 
              validating your ICP. If it doesn't, your ICP likelyneeds refinement.
            </p>
          </div>

          <div className="flex gap-3">
            <span style={{ color: '#a3a3a3', flexShrink: 0 }}>→</span>
            <p>
              <strong style={{ color: '#ffffff' }}>Apply to your situation:</strong> After
              reviewing, take the assessment and find out how your positioning
              compares to this level of buyer clarity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
