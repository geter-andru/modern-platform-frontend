'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Slider - Enterprise-grade slider/range component system
 * 
 * Features:
 * - Single and range (dual) slider support
 * - Controlled and uncontrolled modes
 * - Custom styling and variants
 * - Step increments and custom markers
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Keyboard navigation
 * - Touch support for mobile
 * - Custom thumb and track styling
 * - Value formatting and display
 * - Vertical orientation support
 * - Multiple thumbs for complex ranges
 */

export type SliderSize = 'small' | 'medium' | 'large';
export type SliderVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type SliderOrientation = 'horizontal' | 'vertical';

export interface SliderProps {
  value?: number | number[];
  defaultValue?: number | number[];
  onChange?: (value: number | number[]) => void;
  onValueChange?: (value: number | number[]) => void;
  onValueCommit?: (value: number | number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  readOnly?: boolean;
  orientation?: SliderOrientation;
  size?: SliderSize;
  variant?: SliderVariant;
  className?: string;
  trackClassName?: string;
  thumbClassName?: string;
  markClassName?: string;
  showValue?: boolean;
  showMarks?: boolean;
  marks?: Array<{
    value: number;
    label?: React.ReactNode;
  }>;
  formatValue?: (value: number) => string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
  name?: string;
  id?: string;
  tabIndex?: number;
  inverted?: boolean;
}

const Slider: React.FC<SliderProps> = ({
  value: controlledValue,
  defaultValue = 50,
  onChange,
  onValueChange,
  onValueCommit,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  readOnly = false,
  orientation = 'horizontal',
  size = 'medium',
  variant = 'default',
  className = '',
  trackClassName = '',
  thumbClassName = '',
  markClassName = '',
  showValue = false,
  showMarks = false,
  marks = [],
  formatValue = (value: number) => value.toString(),
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-labelledby': ariaLabelledBy,
  name,
  id,
  tabIndex,
  inverted = false
}) => {
  const [internalValue, setInternalValue] = useState<number | number[]>(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const [activeThumb, setActiveThumb] = useState<number>(-1);
  const [isFocused, setIsFocused] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;
  const values = Array.isArray(currentValue) ? currentValue : [currentValue];
  const isRange = Array.isArray(currentValue) || Array.isArray(defaultValue);

  // Size configurations
  const sizeClasses = {
    small: {
      track: orientation === 'horizontal' ? 'h-1' : 'w-1',
      thumb: 'w-3 h-3',
      container: orientation === 'horizontal' ? 'h-6' : 'w-6'
    },
    medium: {
      track: orientation === 'horizontal' ? 'h-2' : 'w-2', 
      thumb: 'w-4 h-4',
      container: orientation === 'horizontal' ? 'h-8' : 'w-8'
    },
    large: {
      track: orientation === 'horizontal' ? 'h-3' : 'w-3',
      thumb: 'w-5 h-5', 
      container: orientation === 'horizontal' ? 'h-10' : 'w-10'
    }
  };

  // Variant configurations
  const variantClasses = {
    default: {
      track: 'bg-gray-700',
      activeTrack: 'bg-blue-500',
      thumb: 'bg-blue-500 border-2 border-white shadow-lg',
      focus: 'ring-2 ring-blue-500/30'
    },
    primary: {
      track: 'bg-gray-700',
      activeTrack: 'bg-purple-500',
      thumb: 'bg-purple-500 border-2 border-white shadow-lg',
      focus: 'ring-2 ring-purple-500/30'
    },
    secondary: {
      track: 'bg-gray-700',
      activeTrack: 'bg-gray-500',
      thumb: 'bg-gray-500 border-2 border-white shadow-lg',
      focus: 'ring-2 ring-gray-500/30'
    },
    success: {
      track: 'bg-gray-700',
      activeTrack: 'bg-green-500',
      thumb: 'bg-green-500 border-2 border-white shadow-lg',
      focus: 'ring-2 ring-green-500/30'
    },
    warning: {
      track: 'bg-gray-700',
      activeTrack: 'bg-orange-500',
      thumb: 'bg-orange-500 border-2 border-white shadow-lg',
      focus: 'ring-2 ring-orange-500/30'
    },
    danger: {
      track: 'bg-gray-700',
      activeTrack: 'bg-red-500',
      thumb: 'bg-red-500 border-2 border-white shadow-lg',
      focus: 'ring-2 ring-red-500/30'
    }
  };

  // Utility functions
  const valueToPercentage = useCallback((value: number) => {
    return ((value - min) / (max - min)) * 100;
  }, [min, max]);

  const percentageToValue = useCallback((percentage: number) => {
    const rawValue = (percentage / 100) * (max - min) + min;
    return Math.round(rawValue / step) * step;
  }, [min, max, step]);

  const getValueFromPosition = useCallback((clientX: number, clientY: number) => {
    if (!trackRef.current) return min;

    const rect = trackRef.current.getBoundingClientRect();
    let percentage: number;

    if (orientation === 'horizontal') {
      percentage = ((clientX - rect.left) / rect.width) * 100;
    } else {
      percentage = ((rect.bottom - clientY) / rect.height) * 100;
    }

    if (inverted) {
      percentage = 100 - percentage;
    }

    percentage = Math.max(0, Math.min(100, percentage));
    return percentageToValue(percentage);
  }, [orientation, inverted, percentageToValue, min]);

  // Handle value change
  const handleValueChange = useCallback((newValue: number | number[]) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
    onValueChange?.(newValue);
  }, [isControlled, onChange, onValueChange]);

  // Handle mouse/touch events
  const handlePointerDown = useCallback((event: React.PointerEvent, thumbIndex?: number) => {
    if (disabled || readOnly) return;

    event.preventDefault();
    setIsDragging(true);
    
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (thumbIndex !== undefined) {
      setActiveThumb(thumbIndex);
    } else {
      // Find closest thumb or create new value
      const newValue = getValueFromPosition(event.clientX, event.clientY);
      
      if (isRange) {
        const distances = values.map(v => Math.abs(v - newValue));
        const closestIndex = distances.indexOf(Math.min(...distances));
        setActiveThumb(closestIndex);
        
        const newValues = [...values];
        newValues[closestIndex] = newValue;
        handleValueChange(newValues);
      } else {
        handleValueChange(newValue);
        setActiveThumb(0);
      }
    }

    // Capture pointer for drag tracking
    (event.target as Element).setPointerCapture(event.pointerId);
  }, [disabled, readOnly, getValueFromPosition, isRange, values, handleValueChange]);

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    if (!isDragging || activeThumb === -1 || disabled || readOnly) return;

    const newValue = getValueFromPosition(event.clientX, event.clientY);
    
    if (isRange) {
      const newValues = [...values];
      newValues[activeThumb] = newValue;
      
      // Ensure values don't cross over
      if (activeThumb === 0 && newValues[1] !== undefined && newValue > newValues[1]) {
        newValues[0] = newValues[1];
      } else if (activeThumb === 1 && newValues[0] !== undefined && newValue < newValues[0]) {
        newValues[1] = newValues[0];
      }
      
      handleValueChange(newValues);
    } else {
      handleValueChange(newValue);
    }
  }, [isDragging, activeThumb, disabled, readOnly, getValueFromPosition, isRange, values, handleValueChange]);

  const handlePointerUp = useCallback((event: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      setActiveThumb(-1);
      onValueCommit?.(currentValue);
      
      // Release pointer capture
      (event.target as Element).releasePointerCapture(event.pointerId);
    }
  }, [isDragging, currentValue, onValueCommit]);

  // Keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent, thumbIndex: number = 0) => {
    if (disabled || readOnly) return;

    let newValue: number;
    const currentVal = values[thumbIndex] || min;
    const stepSize = event.shiftKey ? step * 10 : step;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault();
        newValue = Math.max(min, currentVal - stepSize);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault();
        newValue = Math.min(max, currentVal + stepSize);
        break;
      case 'Home':
        event.preventDefault();
        newValue = min;
        break;
      case 'End':
        event.preventDefault();
        newValue = max;
        break;
      case 'PageDown':
        event.preventDefault();
        newValue = Math.max(min, currentVal - step * 10);
        break;
      case 'PageUp':
        event.preventDefault();
        newValue = Math.min(max, currentVal + step * 10);
        break;
      default:
        return;
    }

    if (isRange) {
      const newValues = [...values];
      newValues[thumbIndex] = newValue;
      handleValueChange(newValues);
    } else {
      handleValueChange(newValue);
    }
  }, [disabled, readOnly, values, min, max, step, isRange, handleValueChange]);

  const currentSize = sizeClasses[size];
  const currentVariant = variantClasses[variant];

  // Build container classes
  const containerClasses = `
    relative flex items-center
    ${orientation === 'horizontal' ? `w-full ${currentSize.container}` : `h-64 ${currentSize.container} flex-col`}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim();

  // Build track classes  
  const trackClasses = `
    relative rounded-full
    ${orientation === 'horizontal' ? `w-full ${currentSize.track}` : `h-full ${currentSize.track}`}
    ${currentVariant.track}
    ${trackClassName}
  `.trim();

  // Calculate active track styling
  const getActiveTrackStyle = () => {
    if (isRange && values.length >= 2) {
      const startPercent = valueToPercentage(Math.min(values[0], values[1]));
      const endPercent = valueToPercentage(Math.max(values[0], values[1]));
      
      if (orientation === 'horizontal') {
        return {
          left: `${startPercent}%`,
          width: `${endPercent - startPercent}%`
        };
      } else {
        return {
          bottom: `${startPercent}%`, 
          height: `${endPercent - startPercent}%`
        };
      }
    } else {
      const percent = valueToPercentage(values[0] || min);
      
      if (orientation === 'horizontal') {
        return inverted
          ? { right: 0, width: `${100 - percent}%` }
          : { left: 0, width: `${percent}%` };
      } else {
        return inverted
          ? { top: 0, height: `${100 - percent}%` }
          : { bottom: 0, height: `${percent}%` };
      }
    }
  };

  // Build thumb classes
  const getThumbClasses = (thumbIndex: number) => `
    absolute rounded-full cursor-grab active:cursor-grabbing
    ${currentSize.thumb}
    ${currentVariant.thumb}
    ${isFocused && activeThumb === thumbIndex ? currentVariant.focus : ''}
    ${disabled ? 'cursor-not-allowed' : ''}
    transform -translate-x-1/2 -translate-y-1/2
    transition-all duration-200 hover:scale-110
    ${thumbClassName}
  `.trim();

  // Calculate thumb position
  const getThumbStyle = (value: number) => {
    const percent = valueToPercentage(value);
    
    if (orientation === 'horizontal') {
      return {
        left: `${inverted ? 100 - percent : percent}%`,
        top: '50%'
      };
    } else {
      return {
        bottom: `${inverted ? 100 - percent : percent}%`,
        left: '50%'
      };
    }
  };

  return (
    <div className={containerClasses}>
      {/* Value display */}
      {showValue && (
        <div className={`mb-2 text-sm text-gray-400 ${orientation === 'vertical' ? 'mb-0 mr-2' : ''}`}>
          {isRange 
            ? `${formatValue(values[0] || min)} - ${formatValue(values[1] || max)}`
            : formatValue(values[0] || min)
          }
        </div>
      )}

      {/* Slider track container */}
      <div
        ref={sliderRef}
        className={`relative ${orientation === 'horizontal' ? 'w-full flex items-center' : 'h-full flex justify-center'}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={values[0]}
        aria-valuetext={isRange ? `${formatValue(values[0] || min)} to ${formatValue(values[1] || max)}` : formatValue(values[0] || min)}
        aria-orientation={orientation}
        aria-disabled={disabled}
        aria-readonly={readOnly}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-labelledby={ariaLabelledBy}
        tabIndex={disabled ? -1 : (tabIndex ?? 0)}
        onKeyDown={(e) => handleKeyDown(e, 0)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        {/* Track */}
        <div ref={trackRef} className={trackClasses}>
          {/* Active track */}
          <motion.div
            className={`absolute rounded-full ${currentVariant.activeTrack} ${currentSize.track}`}
            style={getActiveTrackStyle()}
            initial={false}
            animate={getActiveTrackStyle()}
            transition={{ duration: 0.1 }}
          />

          {/* Marks */}
          {showMarks && marks.map((mark, index) => {
            const percent = valueToPercentage(mark.value);
            const markStyle = orientation === 'horizontal'
              ? { left: `${percent}%` }
              : { bottom: `${percent}%` };

            return (
              <div
                key={index}
                className={`absolute w-1 h-1 bg-gray-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${markClassName}`}
                style={{
                  ...markStyle,
                  [orientation === 'horizontal' ? 'top' : 'left']: '50%'
                }}
              >
                {mark.label && (
                  <div
                    className={`absolute text-xs text-gray-400 whitespace-nowrap ${
                      orientation === 'horizontal' 
                        ? 'top-full mt-1 left-1/2 transform -translate-x-1/2' 
                        : 'left-full ml-2 top-1/2 transform -translate-y-1/2'
                    }`}
                  >
                    {mark.label}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Thumbs */}
        {values.map((value, index) => (
          <motion.div
            key={index}
            className={getThumbClasses(index)}
            style={getThumbStyle(value)}
            onPointerDown={(e) => handlePointerDown(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            tabIndex={disabled ? -1 : 0}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-valuetext={formatValue(value)}
            aria-orientation={orientation}
            whileHover={{ scale: disabled ? 1 : 1.1 }}
            whileFocus={{ scale: 1.1 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
          />
        ))}
      </div>

      {/* Hidden inputs for form submission */}
      {name && (
        <>
          {isRange ? (
            values.map((value, index) => (
              <input
                key={index}
                type="hidden"
                name={`${name}[${index}]`}
                value={value}
              />
            ))
          ) : (
            <input
              type="hidden"
              name={name}
              value={values[0] || min}
            />
          )}
        </>
      )}
    </div>
  );
};

// Range Slider Component (convenience wrapper)
export interface RangeSliderProps extends Omit<SliderProps, 'value' | 'defaultValue'> {
  value?: [number, number];
  defaultValue?: [number, number];
  onChange?: (value: [number, number]) => void;
  onValueChange?: (value: [number, number]) => void;
  onValueCommit?: (value: [number, number]) => void;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  value,
  defaultValue = [25, 75],
  onChange,
  onValueChange,
  onValueCommit,
  ...props
}) => {
  return (
    <Slider
      {...props}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange as any}
      onValueChange={onValueChange as any}
      onValueCommit={onValueCommit as any}
    />
  );
};

// Hook for slider state management
export const useSlider = (defaultValue: number | number[] = 50) => {
  const [value, setValue] = useState<number | number[]>(defaultValue);

  const reset = useCallback(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const increment = useCallback((step: number = 1) => {
    setValue(prev => {
      if (Array.isArray(prev)) {
        return prev.map(v => v + step);
      }
      return (prev as number) + step;
    });
  }, []);

  const decrement = useCallback((step: number = 1) => {
    setValue(prev => {
      if (Array.isArray(prev)) {
        return prev.map(v => v - step);
      }
      return (prev as number) - step;
    });
  }, []);

  return {
    value,
    setValue,
    reset,
    increment,
    decrement
  };
};

export default Slider;