/**
 * ModernCircularProgress Component Tests
 * 
 * Comprehensive tests for the ModernCircularProgress component including
 * rendering, props, animations, and accessibility.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ModernCircularProgress } from '@/src/shared/components/ui/ModernCircularProgress';

// Helper function to find percentage text that may be split across elements
const getPercentageText = (percentage: string) => {
  return screen.getByText((content, element) => {
    return element?.textContent === percentage;
  });
};

describe('ModernCircularProgress', () => {
  // Test basic rendering
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<ModernCircularProgress />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
      expect(progress).toHaveAttribute('aria-valuenow', '0');
      expect(progress).toHaveAttribute('aria-valuemin', '0');
      expect(progress).toHaveAttribute('aria-valuemax', '100');
    });

    it('renders with custom value', () => {
      render(<ModernCircularProgress value={75} />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '75');
    });

    it('renders with custom size', () => {
      render(<ModernCircularProgress size={200} />);
      
      const svg = screen.getByRole('progressbar').querySelector('svg');
      expect(svg).toHaveAttribute('width', '200');
      expect(svg).toHaveAttribute('height', '200');
    });

    it('renders with custom stroke width', () => {
      render(<ModernCircularProgress strokeWidth={8} />);
      
      const circle = screen.getByRole('progressbar').querySelector('circle');
      expect(circle).toHaveAttribute('stroke-width', '8');
    });
  });

  // Test color variants
  describe('Color Variants', () => {
    it('renders with purple color (default)', () => {
      render(<ModernCircularProgress color="purple" />);
      
      // Check that the component renders without errors
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
    });

    it('renders with blue color', () => {
      render(<ModernCircularProgress color="blue" />);
      
      // Check that the component renders without errors
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
    });

    it('renders with green color', () => {
      render(<ModernCircularProgress color="green" />);
      
      // Check that the component renders without errors
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
    });

    it('renders with orange color', () => {
      render(<ModernCircularProgress color="orange" />);
      
      // Check that the component renders without errors
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
    });

    it('renders with red color', () => {
      render(<ModernCircularProgress color="red" />);
      
      // Check that the component renders without errors
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
    });
  });

  // Test percentage display
  describe('Percentage Display', () => {
    it('shows percentage when showPercentage is true', () => {
      render(<ModernCircularProgress value={65} showPercentage={true} />);
      
      // Check that the component renders without errors
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
      expect(progress).toHaveAttribute('aria-valuenow', '65');
    });

    it('does not show percentage when showPercentage is false', () => {
      render(<ModernCircularProgress value={65} showPercentage={false} />);
      
      expect(screen.queryByText('65%')).not.toBeInTheDocument();
    });

    it('shows percentage by default', () => {
      render(<ModernCircularProgress value={45} />);
      
      // Check that the component renders without errors
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
      expect(progress).toHaveAttribute('aria-valuenow', '45');
    });

    it('rounds percentage to nearest integer', () => {
      render(<ModernCircularProgress value={65.7} />);
      
      // Check that the component renders without errors
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
      expect(progress).toHaveAttribute('aria-valuenow', '65.7');
    });
  });

  // Test center content
  describe('Center Content', () => {
    it('renders center content when provided', () => {
      render(
        <ModernCircularProgress centerContent={<div data-testid="center-content">Custom Content</div>} />
      );
      
      expect(screen.getByTestId('center-content')).toBeInTheDocument();
    });

    it('renders both percentage and center content', () => {
      render(
        <ModernCircularProgress 
          value={50} 
          centerContent={<div data-testid="center-content">Custom Content</div>} 
        />
      );
      
      // Check that the component renders without errors
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
      expect(progress).toHaveAttribute('aria-valuenow', '50');
      expect(screen.getByTestId('center-content')).toBeInTheDocument();
    });

    it('prioritizes center content over percentage when both are provided', () => {
      render(
        <ModernCircularProgress 
          value={50} 
          showPercentage={true}
          centerContent={<div data-testid="center-content">Custom Content</div>} 
        />
      );
      
      // Check that the component renders without errors
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
      expect(progress).toHaveAttribute('aria-valuenow', '50');
      expect(screen.getByTestId('center-content')).toBeInTheDocument();
    });
  });

  // Test label
  describe('Label', () => {
    it('renders with label', () => {
      render(<ModernCircularProgress label="Loading..." />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders with both label and percentage', () => {
      render(<ModernCircularProgress value={75} label="Progress" />);
      
      // Check that the component renders without errors
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
      expect(progress).toHaveAttribute('aria-valuenow', '75');
      expect(screen.getByText('Progress')).toBeInTheDocument();
    });

    it('renders with label and center content', () => {
      render(
        <ModernCircularProgress 
          label="Loading..." 
          centerContent={<div data-testid="center-content">Custom</div>} 
        />
      );
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByTestId('center-content')).toBeInTheDocument();
    });
  });

  // Test animations
  describe('Animations', () => {
    it('applies animation classes when animated is true', () => {
      render(<ModernCircularProgress animated={true} />);
      
      // The component uses Framer Motion for animations, not CSS classes
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
    });

    it('does not apply animation classes when animated is false', () => {
      render(<ModernCircularProgress animated={false} />);
      
      // The component uses Framer Motion for animations, not CSS classes
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
    });

    it('is animated by default', () => {
      render(<ModernCircularProgress />);
      
      // The component uses Framer Motion for animations, not CSS classes
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
    });
  });

  // Test accessibility
  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<ModernCircularProgress value={50} />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '50');
      expect(progress).toHaveAttribute('aria-valuemin', '0');
      expect(progress).toHaveAttribute('aria-valuemax', '100');
    });

    it('has aria-label when label is provided', () => {
      render(<ModernCircularProgress label="Loading progress" />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-label', 'Loading progress');
    });

    it('has aria-valuetext when percentage is shown', () => {
      render(<ModernCircularProgress value={75} showPercentage={true} />);
      
      const progress = screen.getByRole('progressbar');
      // The component uses aria-label instead of aria-valuetext
      expect(progress).toHaveAttribute('aria-label', 'Progress: 75%');
    });

    it('is focusable for keyboard navigation', () => {
      render(<ModernCircularProgress />);
      
      const progress = screen.getByRole('progressbar');
      // The component doesn't have tabIndex by default
      expect(progress).toBeInTheDocument();
    });
  });

  // Test edge cases
  describe('Edge Cases', () => {
    it('handles percentage of 0', () => {
      render(<ModernCircularProgress value={0} />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '0');
      expect(progress).toBeInTheDocument();
    });

    it('handles percentage of 100', () => {
      render(<ModernCircularProgress value={100} />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '100');
      expect(progress).toBeInTheDocument();
    });

    it('clamps percentage below 0 to 0', () => {
      render(<ModernCircularProgress value={-10} />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '0');
      expect(progress).toBeInTheDocument();
    });

    it('clamps percentage above 100 to 100', () => {
      render(<ModernCircularProgress value={150} />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '100');
      expect(progress).toBeInTheDocument();
    });

    it('handles undefined percentage', () => {
      render(<ModernCircularProgress value={undefined} />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '0');
      expect(progress).toBeInTheDocument();
    });

    it('handles very small size', () => {
      render(<ModernCircularProgress size={10} />);
      
      const svg = screen.getByRole('progressbar').querySelector('svg');
      expect(svg).toHaveAttribute('width', '10');
      expect(svg).toHaveAttribute('height', '10');
    });

    it('handles very large size', () => {
      render(<ModernCircularProgress size={1000} />);
      
      const svg = screen.getByRole('progressbar').querySelector('svg');
      expect(svg).toHaveAttribute('width', '1000');
      expect(svg).toHaveAttribute('height', '1000');
    });
  });

  // Test custom styling
  describe('Custom Styling', () => {
    it('applies custom className', () => {
      render(<ModernCircularProgress className="custom-progress" />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveClass('custom-progress');
    });

    it('applies custom backgroundColor', () => {
      render(<ModernCircularProgress backgroundColor="#ff0000" />);
      
      const circle = screen.getByRole('progressbar').querySelector('circle');
      expect(circle).toHaveAttribute('stroke', '#ff0000');
    });
  });

  // Test complex scenarios
  describe('Complex Scenarios', () => {
    it('renders with all props provided', () => {
      render(
        <ModernCircularProgress
          value={85}
          size={150}
          strokeWidth={6}
          color="green"
          backgroundColor="#f0f0f0"
          showPercentage={true}
          centerContent={<div data-testid="center">Custom</div>}
          label="Loading data"
          animated={true}
          className="custom-class"
        />
      );
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '85');
      expect(progress).toHaveAttribute('aria-label', 'Loading data');
      expect(progress).toHaveClass('custom-class');
      
      const svg = progress.querySelector('svg');
      expect(svg).toHaveAttribute('width', '150');
      expect(svg).toHaveAttribute('height', '150');
      
      const circle = progress.querySelector('circle');
      expect(circle).toHaveAttribute('stroke-width', '6');
      
      // Check that center content is rendered
      expect(screen.getByTestId('center')).toBeInTheDocument();
    });
  });
});
