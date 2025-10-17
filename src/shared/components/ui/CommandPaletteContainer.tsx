'use client';

import React from 'react';
import { CommandPalette } from './CommandPalette';
import { useCommandPalette } from './CommandProvider';

interface CommandPaletteContainerProps {
  children?: React.ReactNode;
}

export const CommandPaletteContainer: React.FC<CommandPaletteContainerProps> = ({
  children
}) => {
  const { isOpen, closePalette, commands, categories, recentCommands, searchCommands } = useCommandPalette();

  return (
    <>
      {children}
      <CommandPalette 
        isOpen={isOpen}
        onClose={closePalette}
      />
    </>
  );
};

export default CommandPaletteContainer;
