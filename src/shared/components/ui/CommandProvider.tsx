'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface Command {
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

export interface CommandCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  commands: Command[];
}

interface CommandContextType {
  // State
  isOpen: boolean;
  commands: Command[];
  categories: CommandCategory[];
  recentCommands: Command[];
  
  // Actions
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;
  registerCommand: (command: Command) => void;
  unregisterCommand: (commandId: string) => void;
  executeCommand: (commandId: string) => void;
  addToRecent: (command: Command) => void;
  
  // Getters
  getCommandById: (id: string) => Command | undefined;
  getCommandsByCategory: (categoryId: string) => Command[];
  searchCommands: (query: string) => Command[];
}

const CommandContext = createContext<CommandContextType | undefined>(undefined);

interface CommandProviderProps {
  children: React.ReactNode;
}

export const CommandProvider: React.FC<CommandProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [commands, setCommands] = useState<Command[]>([]);
  const [categories, setCategories] = useState<CommandCategory[]>([]);
  const [recentCommands, setRecentCommands] = useState<Command[]>([]);

  // Load recent commands from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('command-palette-recent');
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecentCommands(parsed);
      }
    } catch (error) {
      console.warn('Failed to load recent commands from localStorage:', error);
    }
  }, []);

  // Save recent commands to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('command-palette-recent', JSON.stringify(recentCommands));
    } catch (error) {
      console.warn('Failed to save recent commands to localStorage:', error);
    }
  }, [recentCommands]);

  // Global keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        togglePalette();
      }
      
      // Close palette on Escape
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        closePalette();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const openPalette = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closePalette = useCallback(() => {
    setIsOpen(false);
  }, []);

  const togglePalette = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const registerCommand = useCallback((command: Command) => {
    setCommands(prev => {
      // Remove existing command with same ID if it exists
      const filtered = prev.filter(cmd => cmd.id !== command.id);
      return [...filtered, command];
    });

    // Update categories
    setCategories(prev => {
      const categoryIndex = prev.findIndex(cat => cat.id === command.category.toLowerCase());
      
      if (categoryIndex >= 0) {
        // Update existing category
        const updated = [...prev];
        const category = updated[categoryIndex];
        const commandIndex = category.commands.findIndex(cmd => cmd.id === command.id);
        
        if (commandIndex >= 0) {
          // Update existing command in category
          category.commands[commandIndex] = command;
        } else {
          // Add new command to category
          category.commands.push(command);
        }
        
        return updated;
      } else {
        // Create new category
        return [...prev, {
          id: command.category.toLowerCase(),
          name: command.category,
          icon: command.icon || (() => null),
          commands: [command]
        }];
      }
    });
  }, []);

  const unregisterCommand = useCallback((commandId: string) => {
    setCommands(prev => prev.filter(cmd => cmd.id !== commandId));
    
    setCategories(prev => 
      prev.map(category => ({
        ...category,
        commands: category.commands.filter(cmd => cmd.id !== commandId)
      })).filter(category => category.commands.length > 0)
    );
  }, []);

  const executeCommand = useCallback((commandId: string) => {
    const command = commands.find(cmd => cmd.id === commandId);
    if (command) {
      command.action();
      addToRecent(command);
      closePalette();
    }
  }, [commands, closePalette]);

  const addToRecent = useCallback((command: Command) => {
    setRecentCommands(prev => {
      // Remove if already exists
      const filtered = prev.filter(cmd => cmd.id !== command.id);
      // Add to beginning and limit to 10 items
      return [command, ...filtered].slice(0, 10);
    });
  }, []);

  const getCommandById = useCallback((id: string) => {
    return commands.find(cmd => cmd.id === id);
  }, [commands]);

  const getCommandsByCategory = useCallback((categoryId: string) => {
    return commands.filter(cmd => cmd.category.toLowerCase() === categoryId.toLowerCase());
  }, [commands]);

  const searchCommands = useCallback((query: string) => {
    if (!query.trim()) return commands;
    
    const lowercaseQuery = query.toLowerCase();
    return commands.filter(command => 
      command.title.toLowerCase().includes(lowercaseQuery) ||
      command.description.toLowerCase().includes(lowercaseQuery) ||
      command.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseQuery))
    );
  }, [commands]);

  const contextValue: CommandContextType = {
    // State
    isOpen,
    commands,
    categories,
    recentCommands,
    
    // Actions
    openPalette,
    closePalette,
    togglePalette,
    registerCommand,
    unregisterCommand,
    executeCommand,
    addToRecent,
    
    // Getters
    getCommandById,
    getCommandsByCategory,
    searchCommands
  };

  return (
    <CommandContext.Provider value={contextValue}>
      {children}
    </CommandContext.Provider>
  );
};

// Custom hook to use the command context
export const useCommandPalette = (): CommandContextType => {
  const context = useContext(CommandContext);
  if (context === undefined) {
    throw new Error('useCommandPalette must be used within a CommandProvider');
  }
  return context;
};

// Hook for registering commands in components
export const useRegisterCommand = (command: Command, deps: React.DependencyList = []) => {
  const { registerCommand, unregisterCommand } = useCommandPalette();

  useEffect(() => {
    registerCommand(command);
    return () => unregisterCommand(command.id);
  }, [command.id, registerCommand, unregisterCommand, ...deps]);
};

export default CommandProvider;
