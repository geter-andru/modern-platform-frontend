'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Command } from 'lucide-react';
import { MICRO_INTERACTIONS, GLASS_EFFECTS } from '@/app/lib/constants/brand';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

interface Command {
  id: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
  action: () => void;
  shortcut?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface CommandCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  commands: Command[];
}

// Mock data for initial implementation
const mockCommands: Command[] = [
  {
    id: 'nav-dashboard',
    title: 'Dashboard',
    description: 'Go to main dashboard',
    category: 'Navigation',
    keywords: ['dashboard', 'home', 'main'],
    action: () => console.log('Navigate to dashboard'),
    shortcut: '⌘1',
    icon: Search
  },
  {
    id: 'nav-icp',
    title: 'ICP Analysis',
    description: 'Open Ideal Customer Profile tool',
    category: 'Navigation',
    keywords: ['icp', 'analysis', 'customer', 'profile'],
    action: () => console.log('Navigate to ICP'),
    shortcut: '⌘2',
    icon: Search
  },
  {
    id: 'search-customers',
    title: 'Search Customers',
    description: 'Find and view customer records',
    category: 'Data',
    keywords: ['customers', 'search', 'find', 'records'],
    action: () => console.log('Search customers'),
    shortcut: '⌘⇧C',
    icon: Search
  }
];

const mockCategories: CommandCategory[] = [
  {
    id: 'navigation',
    name: 'Navigation',
    icon: Search,
    commands: mockCommands.filter(cmd => cmd.category === 'Navigation')
  },
  {
    id: 'data',
    name: 'Data',
    icon: Search,
    commands: mockCommands.filter(cmd => cmd.category === 'Data')
  }
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  children
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredCommands, setFilteredCommands] = useState<Command[]>(mockCommands);
  const [filteredCategories, setFilteredCategories] = useState<CommandCategory[]>(mockCategories);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Focus input when palette opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filter commands based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCommands(mockCommands);
      setFilteredCategories(mockCategories);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = mockCommands.filter(command => 
      command.title.toLowerCase().includes(query) ||
      command.description.toLowerCase().includes(query) ||
      command.keywords.some(keyword => keyword.toLowerCase().includes(query))
    );

    setFilteredCommands(filtered);
    
    // Group filtered commands by category
    const categoriesMap = new Map<string, Command[]>();
    filtered.forEach(command => {
      if (!categoriesMap.has(command.category)) {
        categoriesMap.set(command.category, []);
      }
      categoriesMap.get(command.category)!.push(command);
    });

    const categories: CommandCategory[] = Array.from(categoriesMap.entries()).map(([categoryName, commands]) => ({
      id: categoryName.toLowerCase(),
      name: categoryName,
      icon: Search,
      commands
    }));

    setFilteredCategories(categories);
    setSelectedIndex(0);
  }, [searchQuery]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  // Global keyboard listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && selectedIndex >= 0) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
        onClick={onClose}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-lg"
        />
        
        {/* Command Palette Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`
            relative w-full max-w-2xl mx-4
            bg-black/90 backdrop-blur-xl border border-white/10 
            rounded-xl shadow-2xl shadow-black/50
            ${GLASS_EFFECTS.dark}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10">
            <Search className="w-5 h-5 text-text-muted" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a command or search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                flex-1 bg-transparent text-text-primary placeholder-text-muted
                text-lg font-medium outline-none
                focus:ring-0 focus:outline-none
              "
            />
            <button
              onClick={onClose}
              className={`
                p-1 rounded-md text-text-muted hover:text-text-primary
                hover:bg-surface/30 transition-colors duration-200
                ${MICRO_INTERACTIONS.hover}
              `}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results */}
          <div 
            ref={resultsRef}
            className="max-h-96 overflow-y-auto p-2"
          >
            {filteredCommands.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="w-8 h-8 text-text-muted mb-3" />
                <p className="text-text-muted text-sm">
                  No commands found for "{searchQuery}"
                </p>
                <p className="text-text-subtle text-xs mt-1">
                  Try a different search term
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredCategories.map((category) => (
                  <div key={category.id} className="space-y-1">
                    {/* Category Header */}
                    <div className="px-3 py-2">
                      <div className="flex items-center gap-2 text-xs font-medium text-text-muted uppercase tracking-wider">
                        <category.icon className="w-3 h-3" />
                        {category.name}
                      </div>
                    </div>
                    
                    {/* Category Commands */}
                    {category.commands.map((command, index) => {
                      const globalIndex = filteredCommands.indexOf(command);
                      const isSelected = globalIndex === selectedIndex;
                      
                      return (
                        <motion.button
                          key={command.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => {
                            command.action();
                            onClose();
                          }}
                          className={`
                            w-full flex items-center gap-3 px-3 py-3 rounded-lg
                            transition-all duration-200 ease-elegant
                            ${isSelected 
                              ? 'bg-brand-primary/20 text-text-primary border border-brand-primary/30' 
                              : 'text-text-secondary hover:text-text-primary hover:bg-surface/30'
                            }
                            ${MICRO_INTERACTIONS.hover}
                          `}
                        >
                          {/* Icon */}
                          <div className={`
                            flex items-center justify-center w-8 h-8 rounded-md
                            transition-all duration-200
                            ${isSelected 
                              ? 'bg-brand-primary/20 text-brand-primary' 
                              : 'text-text-muted group-hover:text-text-primary'
                            }
                          `}>
                            {command.icon && <command.icon className="w-4 h-4" />}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 text-left">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{command.title}</span>
                              {command.shortcut && (
                                <span className="text-xs text-text-muted font-mono bg-surface/50 px-2 py-1 rounded">
                                  {command.shortcut}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-text-muted mt-0.5">
                              {command.description}
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 text-xs text-text-muted">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-surface/50 rounded text-xs">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-surface/50 rounded text-xs">↵</kbd>
                Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-surface/50 rounded text-xs">esc</kbd>
                Close
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Command className="w-3 h-3" />
              <span>Command Palette</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommandPalette;
