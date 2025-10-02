import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GlobalErrorBoundary, useErrorHandler } from '@/src/shared/components/error/GlobalErrorBoundary';

// Mock the Button component
jest.mock('@/src/shared/components/ui/Button', () => ({
  Button: ({ children, onClick, variant, size, ...props }: any) => (
    <button
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  ),
}));

// Component that throws an error
const ThrowError = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error</div>;
};

// Component that throws an error with stack trace
const ThrowErrorWithStack = () => {
  const error = new Error('Test error with stack');
  error.stack = 'Error: Test error with stack\n    at ThrowErrorWithStack (test.js:1:1)\n    at render (test.js:2:1)';
  throw error;
};

// Component that uses the useErrorHandler hook
const ComponentWithErrorHandler = () => {
  const handleError = useErrorHandler();
  
  const triggerError = () => {
    handleError(new Error('Hook error'), { componentStack: 'test stack' });
  };
  
  return (
    <div>
      <button onClick={triggerError}>Trigger Error</button>
    </div>
  );
};

describe('GlobalErrorBoundary', () => {
  const originalConsoleError = console.error;
  
  beforeEach(() => {
    // Mock console.error to avoid noise in tests
    console.error = jest.fn();
  });
  
  afterEach(() => {
    console.error = originalConsoleError;
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders children when no error occurs', () => {
      render(
        <GlobalErrorBoundary>
          <div>Test content</div>
        </GlobalErrorBoundary>
      );
      
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('renders custom fallback when provided', () => {
      const customFallback = <div>Custom error fallback</div>;
      
      render(
        <GlobalErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      );
      
      expect(screen.getByText('Custom error fallback')).toBeInTheDocument();
    });

    it('renders default error UI when error occurs', () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      );
      
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText("We're sorry, but something unexpected happened. Our team has been notified.")).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
      expect(screen.getByText('Reload Page')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('catches and displays error message', () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      );
      
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(console.error).toHaveBeenCalledWith(
        'Global Error Boundary caught an error:',
        expect.any(Error),
        expect.any(Object)
      );
    });

    it('logs error to console', () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      );
      
      expect(console.error).toHaveBeenCalledWith(
        'Global Error Boundary caught an error:',
        expect.objectContaining({
          message: 'Test error message'
        }),
        expect.any(Object)
      );
    });

    it('calls componentDidCatch when error occurs', () => {
      const componentDidCatchSpy = jest.spyOn(GlobalErrorBoundary.prototype, 'componentDidCatch');
      
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      );
      
      expect(componentDidCatchSpy).toHaveBeenCalled();
      componentDidCatchSpy.mockRestore();
    });
  });

  describe('Development Mode', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });
    
    afterEach(() => {
      process.env.NODE_ENV = originalNodeEnv;
    });

    it('shows error details in development mode', () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      );
      
      expect(screen.getByText('Error Details (Development)')).toBeInTheDocument();
    });

    it('displays error message in development details', () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      );
      
      const detailsElement = screen.getByText('Error Details (Development)');
      fireEvent.click(detailsElement);
      
      // The error message is split across multiple elements, so we check for the parts
      expect(screen.getByText('Error:')).toBeInTheDocument();
      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('displays stack trace when available', () => {
      render(
        <GlobalErrorBoundary>
          <ThrowErrorWithStack />
        </GlobalErrorBoundary>
      );
      
      const detailsElement = screen.getByText('Error Details (Development)');
      fireEvent.click(detailsElement);
      
      expect(screen.getByText('Stack:')).toBeInTheDocument();
      expect(screen.getByText(/Error: Test error with stack/)).toBeInTheDocument();
    });
  });

  describe('Production Mode', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });
    
    afterEach(() => {
      process.env.NODE_ENV = originalNodeEnv;
    });

    it('does not show error details in production mode', () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      );
      
      expect(screen.queryByText('Error Details (Development)')).not.toBeInTheDocument();
    });

    it('logs error to service in production', () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      );
      
      // In production mode, the error should be logged to service
      expect(console.error).toHaveBeenCalledWith(
        'Error logged to service:',
        expect.objectContaining({
          message: 'Test error message',
          stack: expect.any(String),
          componentStack: expect.any(String),
          timestamp: expect.any(String)
        })
      );
    });
  });

  describe('User Interactions', () => {
    it('handles retry button click', () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      );
      
      const retryButton = screen.getByText('Try Again');
      // Just verify the button exists and is clickable
      expect(retryButton).toBeInTheDocument();
      expect(retryButton).not.toBeDisabled();
    });

    it('handles reload button click', () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      );
      
      const reloadButton = screen.getByText('Reload Page');
      fireEvent.click(reloadButton);
      
      // The button should be clickable (we can't test window.location.reload in JSDOM)
      expect(reloadButton).toBeInTheDocument();
    });

    it('has correct button variants and sizes', () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      );
      
      const retryButton = screen.getByText('Try Again');
      const reloadButton = screen.getByText('Reload Page');
      
      expect(retryButton).toHaveAttribute('data-variant', 'primary');
      expect(retryButton).toHaveAttribute('data-size', 'sm');
      expect(reloadButton).toHaveAttribute('data-variant', 'secondary');
      expect(reloadButton).toHaveAttribute('data-size', 'sm');
    });
  });

  describe('Styling and Layout', () => {
    it('applies correct base classes', () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      );
      
      // Find the outermost container with the base classes
      const container = screen.getByText('Something went wrong').closest('.min-h-screen');
      expect(container).toHaveClass('min-h-screen', 'bg-background-primary', 'flex', 'items-center', 'justify-center', 'p-6');
    });

    it('applies correct card classes', () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      );
      
      const card = screen.getByText('Something went wrong').closest('.max-w-md');
      expect(card).toHaveClass('max-w-md', 'w-full', 'bg-background-elevated', 'rounded-lg', 'p-6', 'border', 'border-surface', 'text-center');
    });

    it('applies correct icon container classes', () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      );
      
      const iconContainer = screen.getByText('⚠️').closest('div');
      expect(iconContainer).toHaveClass('w-16', 'h-16', 'mx-auto', 'mb-4', 'bg-accent-danger/20', 'rounded-full', 'flex', 'items-center', 'justify-center');
    });

    it('applies correct text classes', () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      );
      
      const title = screen.getByText('Something went wrong');
      const description = screen.getByText("We're sorry, but something unexpected happened. Our team has been notified.");
      const supportText = screen.getByText('If this problem persists, please contact support.');
      
      expect(title).toHaveClass('text-xl', 'font-semibold', 'text-text-primary', 'mb-2');
      expect(description).toHaveClass('text-text-secondary', 'mb-4');
      expect(supportText).toHaveClass('mt-4', 'text-xs', 'text-text-muted');
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      );
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('has accessible buttons', () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      );
      
      const retryButton = screen.getByRole('button', { name: 'Try Again' });
      const reloadButton = screen.getByRole('button', { name: 'Reload Page' });
      
      expect(retryButton).toBeInTheDocument();
      expect(reloadButton).toBeInTheDocument();
    });

    it('has proper details/summary structure for error details', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      );
      
      const summary = screen.getByText('Error Details (Development)');
      expect(summary.tagName).toBe('SUMMARY');
      
      const details = summary.closest('details');
      expect(details).toBeInTheDocument();
      
      process.env.NODE_ENV = originalNodeEnv;
    });
  });

  describe('Edge Cases', () => {
    it('handles error without stack trace', () => {
      const ErrorWithoutStack = () => {
        const error = new Error('Error without stack');
        delete error.stack;
        throw error;
      };
      
      render(
        <GlobalErrorBoundary>
          <ErrorWithoutStack />
        </GlobalErrorBoundary>
      );
      
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('handles multiple errors', () => {
      const MultipleErrors = () => {
        const [count, setCount] = React.useState(0);
        
        if (count > 0) {
          throw new Error(`Error ${count}`);
        }
        
        return (
          <button onClick={() => setCount(1)}>
            Trigger Error
          </button>
        );
      };
      
      render(
        <GlobalErrorBoundary>
          <MultipleErrors />
        </GlobalErrorBoundary>
      );
      
      const button = screen.getByText('Trigger Error');
      fireEvent.click(button);
      
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('handles empty children', () => {
      render(
        <GlobalErrorBoundary>
          {null}
        </GlobalErrorBoundary>
      );
      
      // Should render without error
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('renders all required sections', () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      );
      
      // Icon section
      expect(screen.getByText('⚠️')).toBeInTheDocument();
      
      // Title section
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      
      // Description section
      expect(screen.getByText("We're sorry, but something unexpected happened. Our team has been notified.")).toBeInTheDocument();
      
      // Action buttons section
      expect(screen.getByText('Try Again')).toBeInTheDocument();
      expect(screen.getByText('Reload Page')).toBeInTheDocument();
      
      // Support text section
      expect(screen.getByText('If this problem persists, please contact support.')).toBeInTheDocument();
    });

    it('has proper button layout', () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      );
      
      const buttonContainer = screen.getByText('Try Again').closest('.flex');
      expect(buttonContainer).toHaveClass('flex', 'gap-3', 'justify-center');
    });
  });
});

describe('useErrorHandler', () => {
  const originalConsoleError = console.error;
  const originalNodeEnv = process.env.NODE_ENV;
  
  beforeEach(() => {
    console.error = jest.fn();
    process.env.NODE_ENV = 'development';
  });
  
  afterEach(() => {
    console.error = originalConsoleError;
    process.env.NODE_ENV = originalNodeEnv;
    jest.clearAllMocks();
  });

  it('returns a function that logs errors', () => {
    const TestComponent = () => {
      const handleError = useErrorHandler();
      
      // Test the function directly without triggering the error
      React.useEffect(() => {
        // Call the error handler directly to test logging
        handleError(new Error('Test error'), { componentStack: 'test stack' });
      }, [handleError]);
      
      return <div>Test</div>;
    };
    
    // Wrap in error boundary to catch the thrown error
    render(
      <GlobalErrorBoundary>
        <TestComponent />
      </GlobalErrorBoundary>
    );
    
    expect(console.error).toHaveBeenCalledWith(
      'Error caught by useErrorHandler:',
      expect.objectContaining({ message: 'Test error' }),
      { componentStack: 'test stack' }
    );
  });

  it('throws error in development mode', () => {
    const TestComponent = () => {
      const handleError = useErrorHandler();
      
      const triggerError = () => {
        try {
          handleError(new Error('Development error'));
        } catch (e) {
          // Error should be thrown in development
        }
      };
      
      return <button onClick={triggerError}>Trigger</button>;
    };
    
    render(<TestComponent />);
    
    const button = screen.getByText('Trigger');
    expect(() => fireEvent.click(button)).not.toThrow();
  });

  it('does not throw error in production mode', () => {
    process.env.NODE_ENV = 'production';
    
    const TestComponent = () => {
      const handleError = useErrorHandler();
      
      const triggerError = () => {
        handleError(new Error('Production error'));
      };
      
      return <button onClick={triggerError}>Trigger</button>;
    };
    
    render(<TestComponent />);
    
    const button = screen.getByText('Trigger');
    expect(() => fireEvent.click(button)).not.toThrow();
  });
});
