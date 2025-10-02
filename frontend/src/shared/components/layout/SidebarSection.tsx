/**
 * SidebarSection Component - Reusable sidebar section with icon and title
 * 
 * Provides consistent styling for contextual sidebar content across all tools.
 */

import React from 'react';

// TypeScript interfaces
interface SidebarSectionProps {
  icon: string;
  title: string;
  children: React.ReactNode;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ icon, title, children }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-lg">{icon}</span>
        <h4 className="text-sm font-semibold text-white">{title}</h4>
      </div>
      <div className="text-gray-300">
        {children}
      </div>
    </div>
  );
};

export default SidebarSection;