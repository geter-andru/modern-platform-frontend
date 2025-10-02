/**
 * ModernCard Component Tests
 * 
 * Comprehensive tests for the ModernCard component including
 * rendering, props, variants, and user interactions.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModernCard } from '@/src/shared/components/ui/ModernCard';

describe('ModernCard', () => {
  // Test basic rendering
  describe('Rendering', () => {
    it('renders with children content', () => {
      render(
        <ModernCard>
          <div data-testid="card-content">Test Content</div>
        </ModernCard>
      );
      
      expect(screen.getByTestId('card-content')).toBeInTheDocument();
    });

    it('renders with default props', () => {
      render(
        <ModernCard>
          <div>Test Content</div>
        </ModernCard>
      );
      
      const card = screen.getByRole('article');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('bg-white', 'dark:bg-gray-800');
    });

    it('applies custom className', () => {
      render(
        <ModernCard className="custom-class">
          <div>Test Content</div>
        </ModernCard>
      );
      
      const card = screen.getByRole('article');
      expect(card).toHaveClass('custom-class');
    });
  });

  // Test size variants
  describe('Size Variants', () => {
    it('renders small size', () => {
      render(
        <ModernCard size="small">
          <div>Small Card</div>
        </ModernCard>
      );
      
      const card = screen.getByRole('article');
      expect(card).toHaveClass('p-4');
    });

    it('renders medium size (default)', () => {
      render(
        <ModernCard size="medium">
          <div>Medium Card</div>
        </ModernCard>
      );
      
      const card = screen.getByRole('article');
      expect(card).toHaveClass('p-6');
    });

    it('renders large size', () => {
      render(
        <ModernCard size="large">
          <div>Large Card</div>
        </ModernCard>
      );
      
      const card = screen.getByRole('article');
      expect(card).toHaveClass('p-8');
    });

    it('renders auto size', () => {
      render(
        <ModernCard size="auto">
          <div>Auto Card</div>
        </ModernCard>
      );
      
      const card = screen.getByRole('article');
      expect(card).toHaveClass('p-0');
    });
  });

  // Test variant styles
  describe('Variant Styles', () => {
    it('renders default variant', () => {
      render(
        <ModernCard variant="default">
          <div>Default Card</div>
        </ModernCard>
      );
      
      const card = screen.getByRole('article');
      expect(card).toHaveClass('bg-white', 'dark:bg-gray-800');
    });

    it('renders highlighted variant', () => {
      render(
        <ModernCard variant="highlighted">
          <div>Highlighted Card</div>
        </ModernCard>
      );
      
      const card = screen.getByRole('article');
      expect(card).toHaveClass('bg-gradient-to-br', 'from-purple-50', 'to-blue-50');
    });

    it('renders success variant', () => {
      render(
        <ModernCard variant="success">
          <div>Success Card</div>
        </ModernCard>
      );
      
      const card = screen.getByRole('article');
      expect(card).toHaveClass('bg-green-50', 'dark:bg-green-900/20');
    });

    it('renders warning variant', () => {
      render(
        <ModernCard variant="warning">
          <div>Warning Card</div>
        </ModernCard>
      );
      
      const card = screen.getByRole('article');
      expect(card).toHaveClass('bg-yellow-50', 'dark:bg-yellow-900/20');
    });

    it('renders glass variant', () => {
      render(
        <ModernCard variant="glass">
          <div>Glass Card</div>
        </ModernCard>
      );
      
      const card = screen.getByRole('article');
      expect(card).toHaveClass('bg-white/80', 'backdrop-blur-sm');
    });
  });

  // Test interactive behavior
  describe('Interactive Behavior', () => {
    it('renders as non-interactive by default', () => {
      render(
        <ModernCard>
          <div>Non-interactive Card</div>
        </ModernCard>
      );
      
      const card = screen.getByRole('article');
      expect(card).not.toHaveClass('cursor-pointer', 'hover:shadow-lg');
    });

    it('renders as interactive when interactive prop is true', () => {
      render(
        <ModernCard interactive={true}>
          <div>Interactive Card</div>
        </ModernCard>
      );
      
      const card = screen.getByRole('article');
      expect(card).toHaveClass('cursor-pointer', 'hover:shadow-lg');
    });

    it('calls onClick when interactive and clicked', () => {
      const handleClick = jest.fn();
      render(
        <ModernCard interactive={true} onClick={handleClick}>
          <div>Clickable Card</div>
        </ModernCard>
      );
      
      const card = screen.getByRole('article');
      fireEvent.click(card);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when not interactive', () => {
      const handleClick = jest.fn();
      render(
        <ModernCard interactive={false} onClick={handleClick}>
          <div>Non-clickable Card</div>
        </ModernCard>
      );
      
      const card = screen.getByRole('article');
      fireEvent.click(card);
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // Test padding variants
  describe('Padding Variants', () => {
    it('renders with no padding', () => {
      render(
        <ModernCard padding="none">
          <div>No Padding Card</div>
        </ModernCard>
      );
      
      const card = screen.getByRole('article');
      expect(card).toHaveClass('p-0');
    });

    it('renders with compact padding', () => {
      render(
        <ModernCard padding="compact">
          <div>Compact Card</div>
        </ModernCard>
      );
      
      const card = screen.getByRole('article');
      expect(card).toHaveClass('p-3');
    });

    it('renders with default padding', () => {
      render(
        <ModernCard padding="default">
          <div>Default Card</div>
        </ModernCard>
      );
      
      const card = screen.getByRole('article');
      expect(card).toHaveClass('p-6');
    });

    it('renders with spacious padding', () => {
      render(
        <ModernCard padding="spacious">
          <div>Spacious Card</div>
        </ModernCard>
      );
      
      const card = screen.getByRole('article');
      expect(card).toHaveClass('p-8');
    });
  });

  // Test accessibility
  describe('Accessibility', () => {
    it('has proper ARIA role', () => {
      render(
        <ModernCard>
          <div>Accessible Card</div>
        </ModernCard>
      );
      
      const card = screen.getByRole('article');
      expect(card).toBeInTheDocument();
    });

    it('supports keyboard navigation when interactive', () => {
      render(
        <ModernCard interactive={true}>
          <div>Keyboard Accessible Card</div>
        </ModernCard>
      );
      
      const card = screen.getByRole('article');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('does not have tabIndex when not interactive', () => {
      render(
        <ModernCard interactive={false}>
          <div>Non-keyboard Card</div>
        </ModernCard>
      );
      
      const card = screen.getByRole('article');
      expect(card).not.toHaveAttribute('tabIndex');
    });
  });

  // Test complex content
  describe('Complex Content', () => {
    it('renders with multiple children', () => {
      render(
        <ModernCard>
          <h2>Card Title</h2>
          <p>Card description</p>
          <button>Action Button</button>
        </ModernCard>
      );
      
      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card description')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders with nested components', () => {
      render(
        <ModernCard>
          <div>
            <h3>Nested Title</h3>
            <div>
              <span>Nested content</span>
            </div>
          </div>
        </ModernCard>
      );
      
      expect(screen.getByText('Nested Title')).toBeInTheDocument();
      expect(screen.getByText('Nested content')).toBeInTheDocument();
    });
  });

  // Test edge cases
  describe('Edge Cases', () => {
    it('renders with empty children', () => {
      render(<ModernCard></ModernCard>);
      
      const card = screen.getByRole('article');
      expect(card).toBeInTheDocument();
      expect(card).toBeEmptyDOMElement();
    });

    it('renders with null children', () => {
      render(<ModernCard>{null}</ModernCard>);
      
      const card = screen.getByRole('article');
      expect(card).toBeInTheDocument();
    });

    it('renders with undefined children', () => {
      render(<ModernCard>{undefined}</ModernCard>);
      
      const card = screen.getByRole('article');
      expect(card).toBeInTheDocument();
    });
  });
});
