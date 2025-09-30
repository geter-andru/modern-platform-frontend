'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Basic dropdown component
interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right' | 'center';
  offset?: number;
  className?: string;
  disabled?: boolean;
}

export function Dropdown({
  trigger,
  children,
  align = 'left',
  offset = 8,
  className = '',
  disabled = false
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 transform -translate-x-1/2'
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <div
        ref={triggerRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
      >
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className={`
              absolute z-50 mt-${offset/4}
              min-w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl
              ${alignmentClasses[align]}
            `}
            style={{ top: `calc(100% + ${offset}px)` }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Dropdown menu component
interface DropdownMenuProps {
  children: ReactNode;
  className?: string;
}

export function DropdownMenu({ children, className = '' }: DropdownMenuProps) {
  return (
    <div className={`py-2 ${className}`}>
      {children}
    </div>
  );
}

// Dropdown item component
interface DropdownItemProps {
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
}

export function DropdownItem({
  onClick,
  disabled = false,
  destructive = false,
  children,
  leftIcon,
  rightIcon,
  className = ''
}: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full px-4 py-2 text-left flex items-center justify-between
        transition-colors duration-150
        ${disabled 
          ? 'text-slate-500 cursor-not-allowed' 
          : destructive
          ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300'
          : 'text-slate-200 hover:bg-slate-700 hover:text-white'
        }
        ${className}
      `}
    >
      <div className="flex items-center space-x-3">
        {leftIcon && (
          <span className="flex-shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
      </div>
      {rightIcon && (
        <span className="flex-shrink-0 ml-2">{rightIcon}</span>
      )}
    </button>
  );
}

// Dropdown separator
export function DropdownSeparator() {
  return <div className="my-1 h-px bg-slate-700" />;
}

// Dropdown label/header
interface DropdownLabelProps {
  children: ReactNode;
  className?: string;
}

export function DropdownLabel({ children, className = '' }: DropdownLabelProps) {
  return (
    <div className={`px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider ${className}`}>
      {children}
    </div>
  );
}

// Select dropdown component
interface SelectDropdownProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function SelectDropdown({
  value,
  onValueChange,
  placeholder = 'Select an option',
  children,
  disabled = false,
  className = ''
}: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string>('');

  const handleSelect = (newValue: string, label: string) => {
    setSelectedLabel(label);
    onValueChange?.(newValue);
    setIsOpen(false);
  };

  const trigger = (
    <div className={`
      w-full px-4 py-3 rounded-lg border border-slate-600
      bg-slate-700 text-white
      focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
      transition-all duration-200
      flex items-center justify-between
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-slate-500'}
      ${className}
    `}>
      <span className={selectedLabel ? 'text-white' : 'text-slate-400'}>
        {selectedLabel || placeholder}
      </span>
      <svg 
        className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );

  return (
    <Dropdown
      trigger={trigger}
      disabled={disabled}
      className="w-full"
    >
      <DropdownMenu>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === SelectOption) {
            return React.cloneElement(child as React.ReactElement<SelectOptionProps>, {
              onSelect: handleSelect,
              isSelected: child.props.value === value
            });
          }
          return child;
        })}
      </DropdownMenu>
    </Dropdown>
  );
}

// Select option component
interface SelectOptionProps {
  value: string;
  children: ReactNode;
  onSelect?: (value: string, label: string) => void;
  isSelected?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
}

export function SelectOption({
  value,
  children,
  onSelect,
  isSelected = false,
  disabled = false,
  leftIcon
}: SelectOptionProps) {
  const label = typeof children === 'string' ? children : '';

  return (
    <button
      onClick={() => !disabled && onSelect?.(value, label)}
      disabled={disabled}
      className={`
        w-full px-4 py-2 text-left flex items-center space-x-3
        transition-colors duration-150
        ${disabled 
          ? 'text-slate-500 cursor-not-allowed' 
          : isSelected
          ? 'text-white bg-blue-600'
          : 'text-slate-200 hover:bg-slate-700 hover:text-white'
        }
      `}
    >
      {leftIcon && (
        <span className="flex-shrink-0">{leftIcon}</span>
      )}
      <span className="flex-1">{children}</span>
      {isSelected && (
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  );
}

// Multi-select dropdown
interface MultiSelectDropdownProps {
  values?: string[];
  onValuesChange?: (values: string[]) => void;
  placeholder?: string;
  children: ReactNode;
  disabled?: boolean;
  maxSelections?: number;
  className?: string;
}

export function MultiSelectDropdown({
  values = [],
  onValuesChange,
  placeholder = 'Select options',
  children,
  disabled = false,
  maxSelections,
  className = ''
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (value: string, label: string) => {
    const newValues = values.includes(value)
      ? values.filter(v => v !== value)
      : maxSelections && values.length >= maxSelections
      ? values
      : [...values, value];
    
    onValuesChange?.(newValues);
  };

  const selectedCount = values.length;
  const displayText = selectedCount === 0 
    ? placeholder 
    : `${selectedCount} selected`;

  const trigger = (
    <div className={`
      w-full px-4 py-3 rounded-lg border border-slate-600
      bg-slate-700 text-white
      focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
      transition-all duration-200
      flex items-center justify-between
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-slate-500'}
      ${className}
    `}>
      <span className={selectedCount > 0 ? 'text-white' : 'text-slate-400'}>
        {displayText}
      </span>
      <div className="flex items-center space-x-2">
        {selectedCount > 0 && (
          <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
            {selectedCount}
          </span>
        )}
        <svg 
          className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );

  return (
    <Dropdown
      trigger={trigger}
      disabled={disabled}
      className="w-full"
    >
      <DropdownMenu>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === MultiSelectOption) {
            return React.cloneElement(child as React.ReactElement<MultiSelectOptionProps>, {
              onToggle: handleToggle,
              isSelected: values.includes(child.props.value),
              disabled: child.props.disabled || (maxSelections && values.length >= maxSelections && !values.includes(child.props.value))
            });
          }
          return child;
        })}
      </DropdownMenu>
    </Dropdown>
  );
}

// Multi-select option component
interface MultiSelectOptionProps {
  value: string;
  children: ReactNode;
  onToggle?: (value: string, label: string) => void;
  isSelected?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
}

export function MultiSelectOption({
  value,
  children,
  onToggle,
  isSelected = false,
  disabled = false,
  leftIcon
}: MultiSelectOptionProps) {
  const label = typeof children === 'string' ? children : '';

  return (
    <button
      onClick={() => !disabled && onToggle?.(value, label)}
      disabled={disabled}
      className={`
        w-full px-4 py-2 text-left flex items-center space-x-3
        transition-colors duration-150
        ${disabled 
          ? 'text-slate-500 cursor-not-allowed' 
          : 'text-slate-200 hover:bg-slate-700 hover:text-white'
        }
      `}
    >
      <div className={`
        w-4 h-4 rounded border-2 flex items-center justify-center
        ${isSelected 
          ? 'bg-blue-600 border-blue-600' 
          : 'border-slate-500'
        }
      `}>
        {isSelected && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      {leftIcon && (
        <span className="flex-shrink-0">{leftIcon}</span>
      )}
      <span className="flex-1">{children}</span>
    </button>
  );
}

export default {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
  SelectDropdown,
  SelectOption,
  MultiSelectDropdown,
  MultiSelectOption
};