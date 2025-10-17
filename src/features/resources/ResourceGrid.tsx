'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  SortAsc, 
  SortDesc,
  Sparkles
} from 'lucide-react';
import { ResourceCard, ResourceCardSkeleton } from './ResourceCard';

// Types
interface Resource {
  id: string;
  title: string;
  description: string;
  tier: 1 | 2 | 3;
  category: string;
  status: 'available' | 'locked' | 'generating';
  lastUpdated: string;
  accessCount: number;
}

interface ResourceTier {
  id: 1 | 2 | 3;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ResourceGridProps {
  resources: Resource[];
  tiers: ResourceTier[];
  onResourceClick: (resource: Resource) => void;
  onGenerateResource: () => void;
  isLoading?: boolean;
}

type ViewMode = 'grid' | 'list';
type SortField = 'title' | 'tier' | 'lastUpdated' | 'accessCount';
type SortDirection = 'asc' | 'desc';

export function ResourceGrid({ 
  resources, 
  tiers, 
  onResourceClick, 
  onGenerateResource,
  isLoading = false 
}: ResourceGridProps) {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<number | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('lastUpdated');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort resources
  const filteredAndSortedResources = useMemo(() => {
    const filtered = resources.filter(resource => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Tier filter
      const matchesTier = selectedTier === 'all' || resource.tier === selectedTier;

      return matchesSearch && matchesTier;
    });

    // Sort resources
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'tier':
          aValue = a.tier;
          bValue = b.tier;
          break;
        case 'lastUpdated':
          aValue = new Date(a.lastUpdated).getTime();
          bValue = new Date(b.lastUpdated).getTime();
          break;
        case 'accessCount':
          aValue = a.accessCount;
          bValue = b.accessCount;
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [resources, searchQuery, selectedTier, sortField, sortDirection]);

  // Handle sort toggle
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Get tier info
  const getTierInfo = (tierId: number) => {
    return tiers.find(tier => tier.id === tierId) || tiers[0];
  };

  // Grid view component
  const GridView = () => (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
          }
        }
      }}
    >
      <AnimatePresence>
        {filteredAndSortedResources.map((resource, index) => {
          const tierInfo = getTierInfo(resource.tier);
          
          return (
            <ResourceCard
              key={resource.id}
              resource={resource}
              tier={tierInfo}
              viewMode="grid"
              onClick={onResourceClick}
              index={index}
            />
          );
        })}
      </AnimatePresence>
    </motion.div>
  );

  // List view component
  const ListView = () => (
    <motion.div 
      className="space-y-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1
          }
        }
      }}
    >
      <AnimatePresence>
        {filteredAndSortedResources.map((resource, index) => {
          const tierInfo = getTierInfo(resource.tier);
          
          return (
            <ResourceCard
              key={resource.id}
              resource={resource}
              tier={tierInfo}
              viewMode="list"
              onClick={onResourceClick}
              index={index}
            />
          );
        })}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Search and Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Search Bar */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`
              px-4 py-3 border rounded-lg transition-colors
              ${showFilters 
                ? 'bg-blue-50 border-blue-200 text-blue-600' 
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 pt-4"
            >
              <div className="flex flex-wrap items-center gap-4">
                {/* Tier Filter */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Tier:</label>
                  <select
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Tiers</option>
                    {tiers.map(tier => (
                      <option key={tier.id} value={tier.id}>{tier.name}</option>
                    ))}
                  </select>
                </div>

                {/* Sort Options */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Sort by:</label>
                  <div className="flex items-center space-x-1">
                    {(['title', 'tier', 'lastUpdated', 'accessCount'] as SortField[]).map(field => (
                      <button
                        key={field}
                        onClick={() => handleSort(field)}
                        className={`
                          px-3 py-2 text-sm rounded-lg transition-colors
                          ${sortField === field 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'text-gray-600 hover:bg-gray-100'
                          }
                        `}
                      >
                        {field === 'lastUpdated' ? 'Date' : 
                         field === 'accessCount' ? 'Views' : 
                         field.charAt(0).toUpperCase() + field.slice(1)}
                        {sortField === field && (
                          sortDirection === 'asc' ? <SortAsc className="inline h-3 w-3 ml-1" /> : 
                          <SortDesc className="inline h-3 w-3 ml-1" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {filteredAndSortedResources.length} of {resources.length} resources
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`
                p-2 rounded-lg transition-colors
                ${viewMode === 'grid' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-400 hover:text-gray-600'
                }
              `}
            >
              <Grid3X3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`
                p-2 rounded-lg transition-colors
                ${viewMode === 'list' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-400 hover:text-gray-600'
                }
              `}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <ResourceCardSkeleton key={index} viewMode="grid" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <ResourceCardSkeleton key={index} viewMode="list" />
            ))}
          </div>
        )
      ) : filteredAndSortedResources.length === 0 ? (
        <div className="text-center py-12">
          <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || selectedTier !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Generate your first resource to get started'
            }
          </p>
          {(!searchQuery && selectedTier === 'all') && (
            <button
              onClick={onGenerateResource}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate Resource
            </button>
          )}
        </div>
      ) : (
        viewMode === 'grid' ? <GridView /> : <ListView />
      )}
    </div>
  );
}
