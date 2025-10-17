'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/app/lib/auth';
import { EnterpriseNavigationV2 } from '../../src/shared/components/layout/EnterpriseNavigationV2';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Sparkles,
  CheckCircle,
  Lock,
  Unlock
} from 'lucide-react';
import { ResourceTierTabs } from '../../src/features/resources-library/widgets/ResourceTierTabs';
import { ResourceGrid } from '../../src/features/resources-library/widgets/ResourceGrid';
import { ResourceModal } from '../../src/features/resources-library/widgets/ResourceModal';

// Types for Resources Library
interface Resource {
  id: string;
  title: string;
  description: string;
  tier: 1 | 2 | 3;
  category: 'content_templates' | 'guides' | 'frameworks' | 'ai_prompts' | 'one_pagers' | 'slide_decks';
  status: 'available' | 'locked' | 'generating';
  lastUpdated: string;
  accessCount: number;
  dependencies?: string[];
  exportFormats: string[];
}

interface ResourceTier {
  id: 1 | 2 | 3;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
  isUnlocked: boolean;
  unlockRequirement?: string;
}

const RESOURCE_TIERS: ResourceTier[] = [
  {
    id: 1,
    name: 'Core',
    description: 'Essential buyer intelligence and foundational frameworks',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: FileText,
    isUnlocked: true,
    unlockRequirement: 'Available immediately'
  },
  {
    id: 2,
    name: 'Advanced',
    description: 'Advanced methodologies and systematic implementation',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    icon: Sparkles,
    isUnlocked: false,
    unlockRequirement: 'Complete Core tier + Competency Level 2'
  },
  {
    id: 3,
    name: 'Strategic',
    description: 'Sophisticated strategic frameworks for market leadership',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    icon: CheckCircle,
    isUnlocked: false,
    unlockRequirement: 'Complete Advanced tier + Competency Level 3'
  }
];

// Default resources - will be replaced with API data
const DEFAULT_RESOURCES: Resource[] = [];

export default function ResourcesPage() {
  const { user, loading } = useRequireAuth(); // Auto-redirects if not authenticated
  const [resources, setResources] = useState<Resource[]>(DEFAULT_RESOURCES);
  const [selectedTier, setSelectedTier] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showResourceModal, setShowResourceModal] = useState(false);

  // Fetch resources from API
  useEffect(() => {
    const fetchResources = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/resources');
        // const data = await response.json();
        // setResources(data);
        
        // For now, use empty array - resources will be loaded via API
        setResources([]);
      } catch (error) {
        console.error('Failed to fetch resources:', error);
        setResources([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, [user]);

  // Handle resource click
  const handleResourceClick = (resource: Resource) => {
    setSelectedResource(resource);
    setShowResourceModal(true);
  };

  // Handle tier selection
  const handleTierSelect = (tier: 1 | 2 | 3) => {
    setSelectedTier(tier);
  };

  // Get resources for selected tier
  const getTierResources = (tier: 1 | 2 | 3) => {
    return resources.filter(resource => resource.tier === tier);
  };

  // Handle resource export
  const handleResourceExport = async (resource: Resource, format: string) => {
    try {
      // Export is handled by the ResourceExport component using the export service
      console.log('Resource export initiated:', resource.id, 'format:', format);
      
      // Update access count (this would typically be done via API)
      setResources(prevResources => 
        prevResources.map(r => 
          r.id === resource.id 
            ? { ...r, accessCount: r.accessCount + 1 }
            : r
        )
      );
      
    } catch (error) {
      console.error('Failed to export resource:', error);
    }
  };

  // Handle resource share
  const handleResourceShare = async (resource: Resource) => {
    try {
      // TODO: Implement share functionality
      console.log('Sharing resource:', resource.id);
      if (navigator.share) {
        await navigator.share({
          title: resource.title,
          text: resource.description,
          url: window.location.href
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        console.log('Link copied to clipboard');
      }
    } catch (error) {
      console.error('Failed to share resource:', error);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <EnterpriseNavigationV2>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Resources Library
              </h1>
              <p className="text-text-muted">
                AI-powered resources to accelerate your revenue growth
              </p>
            </div>
          </div>
        </motion.div>

        {/* Resource Tier Tabs */}
        <ResourceTierTabs
          tiers={RESOURCE_TIERS}
          selectedTier={selectedTier}
          onTierSelect={handleTierSelect}
        />

        {/* Resources Grid for Selected Tier */}
        <ResourceGrid
          resources={getTierResources(selectedTier)}
          tier={RESOURCE_TIERS.find(t => t.id === selectedTier) || RESOURCE_TIERS[0]}
          onResourceClick={handleResourceClick}
          isLoading={isLoading}
        />

        {/* Resource Modal */}
        <ResourceModal
          resource={selectedResource}
          isOpen={showResourceModal}
          onClose={() => {
            setShowResourceModal(false);
            setSelectedResource(null);
          }}
          onExport={handleResourceExport}
          onShare={handleResourceShare}
          isLoading={isGenerating}
        />
        </div>
      </div>
    </EnterpriseNavigationV2>
  );
}