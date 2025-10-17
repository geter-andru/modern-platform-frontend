'use client';

import React, { useState } from 'react';
import ModernBadge, {
  NumberBadge,
  StatusBadge,
  PriorityBadge,
  ProgressBadge,
  TagBadge,
  VersionBadge,
  BadgeGroup,
  InteractiveBadge
} from '@/app/components/ui/ModernBadge';
import { Star, Bell, Mail, Shield, Zap, Heart, CheckCircle, AlertCircle } from 'lucide-react';

export default function TestModernBadgePage() {
  const [tags, setTags] = useState(['React', 'TypeScript', 'Next.js', 'Tailwind']);
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-purple-400 mb-2">
            ModernBadge Test Page
          </h1>
          <p className="text-text-secondary">
            Testing all variants, sizes, and specialized badge types
          </p>
        </div>

        {/* All Variants */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">All Variants (Medium Size)</h2>
          <BadgeGroup spacing="normal">
            <ModernBadge variant="default">Default</ModernBadge>
            <ModernBadge variant="primary">Primary</ModernBadge>
            <ModernBadge variant="success">Success</ModernBadge>
            <ModernBadge variant="warning">Warning</ModernBadge>
            <ModernBadge variant="danger">Danger</ModernBadge>
            <ModernBadge variant="info">Info</ModernBadge>
          </BadgeGroup>
        </section>

        {/* All Sizes */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">All Sizes (Primary Variant)</h2>
          <BadgeGroup spacing="normal">
            <ModernBadge variant="primary" size="sm">Small</ModernBadge>
            <ModernBadge variant="primary" size="md">Medium</ModernBadge>
            <ModernBadge variant="primary" size="lg">Large</ModernBadge>
          </BadgeGroup>
        </section>

        {/* With Icons - Left */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">With Icons (Left Position)</h2>
          <BadgeGroup spacing="normal">
            <ModernBadge variant="success" icon={<CheckCircle className="w-full h-full" />}>
              Verified
            </ModernBadge>
            <ModernBadge variant="warning" icon={<AlertCircle className="w-full h-full" />}>
              Alert
            </ModernBadge>
            <ModernBadge variant="primary" icon={<Star className="w-full h-full" />}>
              Featured
            </ModernBadge>
            <ModernBadge variant="danger" icon={<Shield className="w-full h-full" />}>
              Protected
            </ModernBadge>
            <ModernBadge variant="info" icon={<Zap className="w-full h-full" />}>
              Premium
            </ModernBadge>
          </BadgeGroup>
        </section>

        {/* With Icons - Right */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">With Icons (Right Position)</h2>
          <BadgeGroup spacing="normal">
            <ModernBadge variant="primary" icon={<Star className="w-full h-full" />} iconPosition="right">
              Favorite
            </ModernBadge>
            <ModernBadge variant="danger" icon={<Heart className="w-full h-full" />} iconPosition="right">
              Liked
            </ModernBadge>
            <ModernBadge variant="info" icon={<Mail className="w-full h-full" />} iconPosition="right">
              Message
            </ModernBadge>
          </BadgeGroup>
        </section>

        {/* Status Badges */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Status Badges (With Dot Indicators)</h2>
          <BadgeGroup spacing="normal">
            <StatusBadge status="active" />
            <StatusBadge status="inactive" />
            <StatusBadge status="pending" />
            <StatusBadge status="error" />
            <StatusBadge status="success" />
            <StatusBadge status="warning" />
          </BadgeGroup>
          <p className="text-sm text-gray-500 mt-3">
            ✓ Active and Pending badges pulse by default
          </p>
        </section>

        {/* Status Badges - Custom Labels */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Status Badges (Custom Labels)</h2>
          <BadgeGroup spacing="normal">
            <StatusBadge status="active">Online</StatusBadge>
            <StatusBadge status="inactive">Offline</StatusBadge>
            <StatusBadge status="pending">Processing...</StatusBadge>
            <StatusBadge status="success">Completed</StatusBadge>
            <StatusBadge status="error">Failed</StatusBadge>
            <StatusBadge status="warning">Needs Attention</StatusBadge>
          </BadgeGroup>
        </section>

        {/* Pulsing Animation */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Pulsing Animation (Live Status)</h2>
          <div className="flex items-center gap-6 p-6 bg-background-primary rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-text-secondary">Server Status:</span>
              <StatusBadge status="active" pulse={true}>Live</StatusBadge>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-text-secondary">Build Status:</span>
              <StatusBadge status="pending" pulse={true}>Building</StatusBadge>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-text-secondary">Recording:</span>
              <ModernBadge variant="danger" showDot pulse>Recording</ModernBadge>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            ✓ Framer Motion pulse animation (2s cycle)
          </p>
        </section>

        {/* Number/Count Badges */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Number/Count Badges (Notifications)</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-text-secondary w-32">Small counts:</span>
              <BadgeGroup>
                <NumberBadge count={0} showZero variant="default" />
                <NumberBadge count={1} variant="primary" />
                <NumberBadge count={5} variant="danger" />
                <NumberBadge count={12} variant="warning" />
              </BadgeGroup>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-text-secondary w-32">Large counts:</span>
              <BadgeGroup>
                <NumberBadge count={42} variant="info" />
                <NumberBadge count={99} variant="success" />
                <NumberBadge count={100} max={99} variant="danger" />
                <NumberBadge count={1234} max={999} variant="primary" />
              </BadgeGroup>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-text-secondary w-32">With icons:</span>
              <div className="relative inline-block">
                <Bell className="w-6 h-6 text-text-secondary" />
                <span className="absolute -top-2 -right-2">
                  <NumberBadge count={5} variant="danger" size="sm" />
                </span>
              </div>
              <div className="relative inline-block">
                <Mail className="w-6 h-6 text-text-secondary" />
                <span className="absolute -top-2 -right-2">
                  <NumberBadge count={142} max={99} variant="primary" size="sm" />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Priority Badges */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Priority Badges</h2>
          <BadgeGroup spacing="normal">
            <PriorityBadge priority="low" />
            <PriorityBadge priority="medium" />
            <PriorityBadge priority="high" />
            <PriorityBadge priority="urgent" />
          </BadgeGroup>
        </section>

        {/* Progress Badges */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Progress Badges</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-text-secondary w-32">Percentage:</span>
              <BadgeGroup>
                <ProgressBadge value={10} format="percentage" />
                <ProgressBadge value={35} format="percentage" />
                <ProgressBadge value={55} format="percentage" />
                <ProgressBadge value={75} format="percentage" />
                <ProgressBadge value={100} format="percentage" />
              </BadgeGroup>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-text-secondary w-32">Fraction:</span>
              <BadgeGroup>
                <ProgressBadge value={3} max={10} format="fraction" />
                <ProgressBadge value={5} max={8} format="fraction" />
                <ProgressBadge value={12} max={15} format="fraction" />
                <ProgressBadge value={20} max={20} format="fraction" />
              </BadgeGroup>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            ✓ Colors change automatically based on percentage (red &lt; 20% to green &gt; 80%)
          </p>
        </section>

        {/* Removable Badges */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Removable Badges</h2>
          <BadgeGroup spacing="normal">
            <ModernBadge variant="primary" removable onRemove={() => alert('Badge removed!')}>
              Removable
            </ModernBadge>
            <ModernBadge variant="success" removable onRemove={() => alert('Closed!')}>
              Click X to close
            </ModernBadge>
            <ModernBadge
              variant="danger"
              removable
              onRemove={() => alert('Deleted!')}
              icon={<Star className="w-full h-full" />}
            >
              With Icon
            </ModernBadge>
          </BadgeGroup>
        </section>

        {/* Tag Badges (Deletable) */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Tag Badges (Deletable Tags)</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-text-secondary w-32">Active Tags:</span>
              <BadgeGroup>
                {tags.map(tag => (
                  <TagBadge
                    key={tag}
                    deletable
                    onDelete={() => removeTag(tag)}
                    variant="primary"
                  >
                    {tag}
                  </TagBadge>
                ))}
              </BadgeGroup>
            </div>
            <p className="text-sm text-gray-500">
              ✓ Click X to remove tags
            </p>
          </div>
        </section>

        {/* Pill vs Rounded */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Pill vs Rounded Shapes</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-text-secondary w-32">Rounded:</span>
              <BadgeGroup>
                <ModernBadge variant="primary" pill={false}>Default</ModernBadge>
                <ModernBadge variant="success" pill={false}>Rounded</ModernBadge>
                <ModernBadge variant="danger" pill={false}>Corners</ModernBadge>
              </BadgeGroup>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-text-secondary w-32">Pill:</span>
              <BadgeGroup>
                <ModernBadge variant="primary" pill={true}>Fully</ModernBadge>
                <ModernBadge variant="success" pill={true}>Rounded</ModernBadge>
                <ModernBadge variant="danger" pill={true}>Pill</ModernBadge>
              </BadgeGroup>
            </div>
          </div>
        </section>

        {/* Version Badges */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Version Badges</h2>
          <BadgeGroup spacing="normal">
            <VersionBadge version="1.0.0" />
            <VersionBadge version="2.1.3" />
            <VersionBadge version="3.0.0-beta" prefix="v" />
            <VersionBadge version="4.5.2" prefix="" />
          </BadgeGroup>
        </section>

        {/* Badge Groups - Spacing */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Badge Groups (Spacing Variations)</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-text-secondary mb-2">Tight spacing:</p>
              <BadgeGroup spacing="tight">
                <ModernBadge variant="primary">Tag 1</ModernBadge>
                <ModernBadge variant="success">Tag 2</ModernBadge>
                <ModernBadge variant="info">Tag 3</ModernBadge>
              </BadgeGroup>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-2">Normal spacing:</p>
              <BadgeGroup spacing="normal">
                <ModernBadge variant="primary">Tag 1</ModernBadge>
                <ModernBadge variant="success">Tag 2</ModernBadge>
                <ModernBadge variant="info">Tag 3</ModernBadge>
              </BadgeGroup>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-2">Loose spacing:</p>
              <BadgeGroup spacing="loose">
                <ModernBadge variant="primary">Tag 1</ModernBadge>
                <ModernBadge variant="success">Tag 2</ModernBadge>
                <ModernBadge variant="info">Tag 3</ModernBadge>
              </BadgeGroup>
            </div>
          </div>
        </section>

        {/* Interactive Badges */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Interactive Badges (Clickable)</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-text-secondary w-32">Click handlers:</span>
              <BadgeGroup>
                <InteractiveBadge
                  variant="primary"
                  onClick={() => alert('Badge clicked!')}
                >
                  Click Me
                </InteractiveBadge>
                <InteractiveBadge
                  variant="success"
                  onClick={() => alert('Action executed!')}
                >
                  Execute Action
                </InteractiveBadge>
              </BadgeGroup>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-text-secondary w-32">Selectable:</span>
              <BadgeGroup>
                <InteractiveBadge
                  variant="primary"
                  selected={selectedBadge === 'option1'}
                  onClick={() => setSelectedBadge('option1')}
                >
                  Option 1
                </InteractiveBadge>
                <InteractiveBadge
                  variant="primary"
                  selected={selectedBadge === 'option2'}
                  onClick={() => setSelectedBadge('option2')}
                >
                  Option 2
                </InteractiveBadge>
                <InteractiveBadge
                  variant="primary"
                  selected={selectedBadge === 'option3'}
                  onClick={() => setSelectedBadge('option3')}
                >
                  Option 3
                </InteractiveBadge>
              </BadgeGroup>
            </div>
            <p className="text-sm text-gray-500">
              ✓ Click to select, shows purple ring when selected
            </p>
          </div>
        </section>

        {/* Complex Example */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Complex Example (Product Card)</h2>
          <div className="bg-background-primary rounded-lg p-6 space-y-4 max-w-md">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Premium Widget Pro</h3>
                <p className="text-sm text-text-secondary">Advanced analytics dashboard</p>
              </div>
              <VersionBadge version="2.1.0" />
            </div>

            <BadgeGroup>
              <StatusBadge status="active" />
              <PriorityBadge priority="high" />
              <ModernBadge variant="info" icon={<Zap className="w-full h-full" />}>
                Premium
              </ModernBadge>
            </BadgeGroup>

            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">Progress:</span>
                <ProgressBadge value={85} />
              </div>
              <div className="flex items-center gap-2">
                <NumberBadge count={5} variant="danger" />
                <span className="text-sm text-text-secondary">notifications</span>
              </div>
            </div>
          </div>
        </section>

        {/* Component Summary */}
        <section className="border-t border-gray-700 pt-8">
          <h2 className="text-2xl font-semibold mb-4">Component Summary</h2>
          <div className="bg-background-primary rounded-lg p-6 space-y-2 text-sm">
            <p><strong className="text-purple-400">File:</strong> /app/components/ui/ModernBadge.tsx</p>
            <p><strong className="text-purple-400">Lines:</strong> ~317 lines TypeScript</p>
            <p><strong className="text-purple-400">Variants:</strong> 6 (default, primary, success, warning, danger, info)</p>
            <p><strong className="text-purple-400">Sizes:</strong> 3 (sm, md, lg)</p>
            <p><strong className="text-purple-400">Badge Types:</strong> 9 specialized components</p>
            <p><strong className="text-purple-400">Features:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1 text-text-secondary">
              <li>6 semantic variants with dark theme colors</li>
              <li>3 sizes (sm, md, lg)</li>
              <li>Optional icon support (left or right position)</li>
              <li>Dot indicator with optional pulsing animation</li>
              <li>Removable badges with close button</li>
              <li>Pill vs rounded shape options</li>
              <li>NumberBadge for counts/notifications (handles max display 99+)</li>
              <li>StatusBadge with 6 semantic states and auto-pulse</li>
              <li>PriorityBadge (low, medium, high, urgent)</li>
              <li>ProgressBadge with auto-color based on percentage</li>
              <li>TagBadge for deletable category tags</li>
              <li>VersionBadge for version numbers</li>
              <li>BadgeGroup container with spacing options</li>
              <li>InteractiveBadge for clickable/selectable badges</li>
              <li>Framer Motion pulse animation (2s cycle)</li>
              <li>Dark theme design system</li>
              <li>TypeScript strict mode with full type safety</li>
              <li>Full accessibility (ARIA labels)</li>
            </ul>
            <p className="pt-4">
              <strong className="text-green-400">Status:</strong>
              ✅ All features tested and working
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
