/**
 * Button Component Tests
 * 
 * Comprehensive tests for the Button component including
 * rendering, variants, states, and user interactions.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import Button from '@/src/shared/components/ui/Button';

describe('Button', () => {
  // Test basic rendering
  describe('Rendering', () => {
    it('renders with children text', () => {
      render(<Button>Click me</Button>);
      
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('renders as button element by default', () => {
      render(<Button>Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
    });

    it('renders with custom className', () => {
      render(<Button className="custom-class">Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('applies default props', () => {
      render(<Button>Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-4', 'py-2', 'rounded-lg');
      expect(button).not.toBeDisabled();
    });
  });

  // Test variants
  describe('Variants', () => {
    it('renders primary variant (default)', () => {
      render(<Button variant="primary">Primary</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-purple-600', 'text-white');
    });

    it('renders secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-200', 'text-gray-900');
    });

    it('renders outline variant', () => {
      render(<Button variant="outline">Outline</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border', 'border-gray-300', 'bg-transparent');
    });

    it('renders ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-transparent', 'text-gray-700');
    });

    it('renders link variant', () => {
      render(<Button variant="link">Link</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-transparent', 'text-purple-600');
    });

    it('renders danger variant', () => {
      render(<Button variant="danger">Danger</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-red-600', 'text-white');
    });

    it('renders success variant', () => {
      render(<Button variant="success">Success</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-green-600', 'text-white');
    });
  });

  // Test sizes
  describe('Sizes', () => {
    it('renders small size', () => {
      render(<Button size="sm">Small</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
    });

    it('renders medium size (default)', () => {
      render(<Button size="md">Medium</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-4', 'py-2', 'text-base');
    });

    it('renders large size', () => {
      render(<Button size="lg">Large</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
    });

    it('renders extra large size', () => {
      render(<Button size="xl">Extra Large</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-8', 'py-4', 'text-xl');
    });
  });

  // Test states
  describe('States', () => {
    it('renders in normal state', () => {
      render(<Button>Normal</Button>);
      
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
      expect(button).not.toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('renders in disabled state', () => {
      render(<Button disabled>Disabled</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('renders in loading state', () => {
      render(<Button loading>Loading</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('shows loading text when loading', () => {
      render(<Button loading loadingText="Please wait...">Button</Button>);
      
      expect(screen.getByText('Please wait...')).toBeInTheDocument();
      expect(screen.queryByText('Button')).not.toBeInTheDocument();
    });
  });

  // Test icon buttons
  describe('Icon Buttons', () => {
    it('renders with left icon', () => {
      const LeftIcon = () => <span data-testid="left-icon">←</span>;
      render(<Button leftIcon={<LeftIcon />}>With Left Icon</Button>);
      
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByText('With Left Icon')).toBeInTheDocument();
    });

    it('renders with right icon', () => {
      const RightIcon = () => <span data-testid="right-icon">→</span>;
      render(<Button rightIcon={<RightIcon />}>With Right Icon</Button>);
      
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
      expect(screen.getByText('With Right Icon')).toBeInTheDocument();
    });

    it('renders with both icons', () => {
      const LeftIcon = () => <span data-testid="left-icon">←</span>;
      const RightIcon = () => <span data-testid="right-icon">→</span>;
      render(
        <Button leftIcon={<LeftIcon />} rightIcon={<RightIcon />}>
          With Both Icons
        </Button>
      );
      
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
      expect(screen.getByText('With Both Icons')).toBeInTheDocument();
    });

    it('renders as icon-only button', () => {
      const Icon = () => <span data-testid="icon">★</span>;
      render(<Button icon={<Icon />} aria-label="Star" />);
      
      const button = screen.getByRole('button', { name: 'Star' });
      expect(button).toBeInTheDocument();
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
  });

  // Test user interactions
  describe('User Interactions', () => {
    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<Button onClick={handleClick}>Click me</Button>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<Button disabled onClick={handleClick}>Disabled</Button>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when loading', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<Button loading onClick={handleClick}>Loading</Button>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('handles keyboard navigation', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<Button onClick={handleClick}>Keyboard</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles space key activation', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<Button onClick={handleClick}>Space</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard(' ');
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // Test accessibility
  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Button aria-label="Custom label">Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Custom label' });
      expect(button).toBeInTheDocument();
    });

    it('has aria-disabled when disabled', () => {
      render(<Button disabled>Disabled</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('has aria-busy when loading', () => {
      render(<Button loading>Loading</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('is focusable by default', () => {
      render(<Button>Focusable</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabIndex', '0');
    });

    it('is not focusable when disabled', () => {
      render(<Button disabled>Not Focusable</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabIndex', '-1');
    });
  });

  // Test full width
  describe('Full Width', () => {
    it('renders full width when specified', () => {
      render(<Button fullWidth>Full Width</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full');
    });

    it('does not render full width by default', () => {
      render(<Button>Normal Width</Button>);
      
      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('w-full');
    });
  });

  // Test edge cases
  describe('Edge Cases', () => {
    it('renders with empty children', () => {
      render(<Button></Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toBeEmptyDOMElement();
    });

    it('renders with null children', () => {
      render(<Button>{null}</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('renders with undefined children', () => {
      render(<Button>{undefined}</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('handles multiple clicks', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<Button onClick={handleClick}>Multiple Clicks</Button>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      await user.click(button);
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  // Test complex scenarios
  describe('Complex Scenarios', () => {
    it('renders with all props provided', () => {
      const LeftIcon = () => <span data-testid="left-icon">←</span>;
      const RightIcon = () => <span data-testid="right-icon">→</span>;
      
      render(
        <Button
          variant="primary"
          size="lg"
          leftIcon={<LeftIcon />}
          rightIcon={<RightIcon />}
          fullWidth
          className="custom-class"
          aria-label="Complex button"
        >
          Complex Button
        </Button>
      );
      
      const button = screen.getByRole('button', { name: 'Complex button' });
      expect(button).toHaveClass('bg-purple-600', 'text-white', 'px-6', 'py-3', 'text-lg', 'w-full', 'custom-class');
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
      expect(screen.getByText('Complex Button')).toBeInTheDocument();
    });

    it('handles loading state with icons', () => {
      const LeftIcon = () => <span data-testid="left-icon">←</span>;
      
      render(
        <Button
          loading
          loadingText="Loading..."
          leftIcon={<LeftIcon />}
        >
          Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
      expect(screen.queryByText('Button')).not.toBeInTheDocument();
    });
  });
});
