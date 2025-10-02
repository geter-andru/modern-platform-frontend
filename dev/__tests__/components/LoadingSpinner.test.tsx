import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '@/src/shared/components/ui/LoadingSpinner';

describe('LoadingSpinner', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<LoadingSpinner />);
      
      const spinner = screen.getByRole('status', { hidden: true });
      expect(spinner).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(<LoadingSpinner className="custom-spinner" />);
      
      const container = screen.getByRole('status', { hidden: true }).parentElement;
      expect(container).toHaveClass('custom-spinner');
    });

    it('renders with text', () => {
      render(<LoadingSpinner text="Loading..." />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('does not render text when not provided', () => {
      render(<LoadingSpinner />);
      
      const textElement = screen.queryByText('Loading...');
      expect(textElement).not.toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('renders small size', () => {
      render(<LoadingSpinner size="sm" />);
      
      const spinner = screen.getByRole('status', { hidden: true });
      expect(spinner).toHaveClass('w-4', 'h-4');
    });

    it('renders medium size (default)', () => {
      render(<LoadingSpinner />);
      
      const spinner = screen.getByRole('status', { hidden: true });
      expect(spinner).toHaveClass('w-8', 'h-8');
    });

    it('renders large size', () => {
      render(<LoadingSpinner size="lg" />);
      
      const spinner = screen.getByRole('status', { hidden: true });
      expect(spinner).toHaveClass('w-12', 'h-12');
    });

    it('renders extra large size', () => {
      render(<LoadingSpinner size="xl" />);
      
      const spinner = screen.getByRole('status', { hidden: true });
      expect(spinner).toHaveClass('w-16', 'h-16');
    });
  });

  describe('Color Variants', () => {
    it('renders primary color (default)', () => {
      render(<LoadingSpinner />);
      
      const spinner = screen.getByRole('status', { hidden: true });
      expect(spinner).toHaveClass('border-blue-500');
    });

    it('renders white color', () => {
      render(<LoadingSpinner color="white" />);
      
      const spinner = screen.getByRole('status', { hidden: true });
      expect(spinner).toHaveClass('border-white');
    });

    it('renders muted color', () => {
      render(<LoadingSpinner color="muted" />);
      
      const spinner = screen.getByRole('status', { hidden: true });
      expect(spinner).toHaveClass('border-gray-400');
    });
  });

  describe('Animation Variants', () => {
    it('renders spinner variant (default)', () => {
      render(<LoadingSpinner />);
      
      const spinner = screen.getByRole('status', { hidden: true });
      expect(spinner).toHaveClass('animate-spin', 'border-2', 'border-gray-200', 'border-t-blue-500', 'rounded-full');
    });

    it('renders dots variant', () => {
      render(<LoadingSpinner variant="dots" />);
      
      const dotsContainer = screen.getByRole('status', { hidden: true });
      expect(dotsContainer).toBeInTheDocument();
      
      // Check for dots
      const dots = dotsContainer.querySelectorAll('div');
      expect(dots).toHaveLength(3);
      
      // Check first dot has correct classes
      expect(dots[0]).toHaveClass('w-2', 'h-2', 'rounded-full', 'bg-blue-500', 'animate-pulse');
    });

    it('renders pulse variant', () => {
      render(<LoadingSpinner variant="pulse" />);
      
      const pulse = screen.getByRole('status', { hidden: true });
      expect(pulse).toHaveClass('animate-pulse', 'rounded-full', 'bg-blue-500');
    });
  });

  describe('Text Sizing', () => {
    it('renders small text for small size', () => {
      render(<LoadingSpinner size="sm" text="Loading..." />);
      
      const text = screen.getByText('Loading...');
      expect(text).toHaveClass('text-xs');
    });

    it('renders medium text for medium size', () => {
      render(<LoadingSpinner size="md" text="Loading..." />);
      
      const text = screen.getByText('Loading...');
      expect(text).toHaveClass('text-sm');
    });

    it('renders large text for large size', () => {
      render(<LoadingSpinner size="lg" text="Loading..." />);
      
      const text = screen.getByText('Loading...');
      expect(text).toHaveClass('text-base');
    });

    it('renders extra large text for extra large size', () => {
      render(<LoadingSpinner size="xl" text="Loading..." />);
      
      const text = screen.getByText('Loading...');
      expect(text).toHaveClass('text-lg');
    });
  });

  describe('Animation States', () => {
    it('has proper animation classes for spinner variant', () => {
      render(<LoadingSpinner variant="spinner" />);
      
      const spinner = screen.getByRole('status', { hidden: true });
      expect(spinner).toHaveClass('animate-spin');
    });

    it('has proper animation classes for dots variant', () => {
      render(<LoadingSpinner variant="dots" />);
      
      const dotsContainer = screen.getByRole('status', { hidden: true });
      const dots = dotsContainer.querySelectorAll('div');
      
      dots.forEach((dot, index) => {
        expect(dot).toHaveClass('animate-pulse');
        expect(dot).toHaveStyle({
          animationDelay: `${index * 0.2}s`,
          animationDuration: '0.6s'
        });
      });
    });

    it('has proper animation classes for pulse variant', () => {
      render(<LoadingSpinner variant="pulse" />);
      
      const pulse = screen.getByRole('status', { hidden: true });
      expect(pulse).toHaveClass('animate-pulse');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<LoadingSpinner />);
      
      const spinner = screen.getByRole('status', { hidden: true });
      expect(spinner).toBeInTheDocument();
    });

    it('has proper ARIA attributes with text', () => {
      render(<LoadingSpinner text="Loading data..." />);
      
      const spinner = screen.getByRole('status', { hidden: true });
      expect(spinner).toBeInTheDocument();
      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });

    it('supports custom aria-label', () => {
      render(<LoadingSpinner aria-label="Custom loading message" />);
      
      const spinner = screen.getByLabelText('Custom loading message');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty text string', () => {
      render(<LoadingSpinner text="" />);
      
      // Check that no text span is rendered
      const textSpan = screen.queryByRole('status', { hidden: true }).parentElement?.querySelector('span');
      expect(textSpan).not.toBeInTheDocument();
    });

    it('handles undefined text', () => {
      render(<LoadingSpinner text={undefined} />);
      
      const textElement = screen.queryByText('Loading...');
      expect(textElement).not.toBeInTheDocument();
    });

    it('handles null text', () => {
      render(<LoadingSpinner text={null as any} />);
      
      const textElement = screen.queryByText('Loading...');
      expect(textElement).not.toBeInTheDocument();
    });

    it('handles all props combined', () => {
      render(
        <LoadingSpinner 
          size="lg" 
          color="white" 
          variant="dots" 
          text="Processing..." 
          className="custom-class"
        />
      );
      
      const container = screen.getByRole('status', { hidden: true }).parentElement;
      expect(container).toHaveClass('custom-class');
      
      const dotsContainer = screen.getByRole('status', { hidden: true });
      expect(dotsContainer).toBeInTheDocument();
      
      const text = screen.getByText('Processing...');
      expect(text).toHaveClass('text-base');
    });
  });

  describe('Layout and Styling', () => {
    it('has proper flex layout', () => {
      render(<LoadingSpinner text="Loading..." />);
      
      const container = screen.getByRole('status', { hidden: true }).parentElement;
      expect(container).toHaveClass('flex', 'items-center', 'justify-center');
    });

    it('has proper text spacing', () => {
      render(<LoadingSpinner text="Loading..." />);
      
      const text = screen.getByText('Loading...');
      expect(text).toHaveClass('ml-2', 'text-gray-500');
    });

    it('has proper opacity transition', () => {
      render(<LoadingSpinner />);
      
      const innerContainer = screen.getByRole('status', { hidden: true }).parentElement;
      expect(innerContainer).toHaveClass('opacity-100', 'transition-opacity', 'duration-300');
    });
  });
});
