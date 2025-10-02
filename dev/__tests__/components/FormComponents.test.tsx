/**
 * FormComponents Test Suite
 * 
 * Comprehensive tests for the FormComponents library including:
 * - FormField component (input, textarea, select)
 * - Input component
 * - ProductInputForm component
 * - UserInfoForm component
 * - Validation and error handling
 * - Accessibility features
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { 
  ProductInputForm, 
  UserInfoForm,
  FormField,
  Input
} from '@/src/shared/components/ui/FormComponents';

// Mock the Button component since it's imported
jest.mock('@/src/shared/components/ui/Button', () => ({
  Button: ({ children, onClick, type, ...props }: any) => (
    <button 
      onClick={onClick} 
      type={type} 
      {...props}
      data-testid="button"
    >
      {children}
    </button>
  )
}));

describe('FormComponents', () => {
  // Test FormField component
  describe('FormField Component', () => {
    const mockOnChange = jest.fn();
    const defaultProps = {
      label: 'Test Field',
      name: 'testField',
      value: '',
      onChange: mockOnChange,
    };

    beforeEach(() => {
      mockOnChange.mockClear();
    });

    describe('Rendering', () => {
      it('renders with required props', () => {
        render(
          <FormField {...defaultProps} />
        );
        
        expect(screen.getByLabelText('Test Field')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });

      it('renders with custom className', () => {
        render(
          <FormField 
            {...defaultProps} 
            className="custom-class"
          />
        );
        
        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('custom-class');
      });

      it('renders with placeholder', () => {
        render(
          <FormField 
            {...defaultProps} 
            placeholder="Enter text here"
          />
        );
        
        expect(screen.getByPlaceholderText('Enter text here')).toBeInTheDocument();
      });

      it('shows required indicator when required', () => {
        render(
          <FormField 
            {...defaultProps} 
            required
          />
        );
        
        expect(screen.getByText('*')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeRequired();
      });

      it('does not show required indicator when not required', () => {
        render(
          <FormField 
            {...defaultProps} 
            required={false}
          />
        );
        
        expect(screen.queryByText('*')).not.toBeInTheDocument();
        expect(screen.getByRole('textbox')).not.toBeRequired();
      });
    });

    describe('Input Types', () => {
      it('renders text input by default', () => {
        render(
          <FormField {...defaultProps} />
        );
        
        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('type', 'text');
      });

      it('renders email input when type is email', () => {
        render(
          <FormField 
            {...defaultProps} 
            type="email"
          />
        );
        
        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('type', 'email');
      });

      it('renders password input when type is password', () => {
        render(
          <FormField 
            {...defaultProps} 
            type="password"
          />
        );
        
        const input = screen.getByDisplayValue('');
        expect(input).toHaveAttribute('type', 'password');
      });

      it('renders textarea when type is textarea', () => {
        render(
          <FormField 
            {...defaultProps} 
            type="textarea"
          />
        );
        
        const textarea = screen.getByRole('textbox');
        expect(textarea.tagName).toBe('TEXTAREA');
        expect(textarea).toHaveClass('resize-vertical', 'min-h-[100px]');
      });

      it('renders select when type is select', () => {
        const options = [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' }
        ];
        
        render(
          <FormField 
            {...defaultProps} 
            type="select"
            options={options}
          />
        );
        
        const select = screen.getByRole('combobox');
        expect(select.tagName).toBe('SELECT');
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
      });
    });

    describe('User Interactions', () => {
      it('calls onChange when input value changes', async () => {
        const user = userEvent.setup();
        
        render(
          <FormField {...defaultProps} />
        );
        
        const input = screen.getByRole('textbox');
        await user.type(input, 'test value');
        
        expect(mockOnChange).toHaveBeenCalledWith('test value');
      });

      it('calls onChange when textarea value changes', async () => {
        const user = userEvent.setup();
        
        render(
          <FormField 
            {...defaultProps} 
            type="textarea"
          />
        );
        
        const textarea = screen.getByRole('textbox');
        await user.type(textarea, 'textarea content');
        
        expect(mockOnChange).toHaveBeenCalledWith('textarea content');
      });

      it('calls onChange when select value changes', async () => {
        const user = userEvent.setup();
        const options = [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' }
        ];
        
        render(
          <FormField 
            {...defaultProps} 
            type="select"
            options={options}
          />
        );
        
        const select = screen.getByRole('combobox');
        await user.selectOptions(select, 'option2');
        
        expect(mockOnChange).toHaveBeenCalledWith('option2');
      });
    });

    describe('Error Handling', () => {
      it('displays error message when error prop is provided', () => {
        render(
          <FormField 
            {...defaultProps} 
            error="This field is required"
          />
        );
        
        expect(screen.getByText('This field is required')).toBeInTheDocument();
        expect(screen.getByText('This field is required')).toHaveClass('text-accent-danger');
      });

      it('applies error styling to input when error is present', () => {
        render(
          <FormField 
            {...defaultProps} 
            error="Error message"
          />
        );
        
        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('border-accent-danger');
      });

      it('does not display error message when error prop is not provided', () => {
        render(
          <FormField {...defaultProps} />
        );
        
        expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
      });

      it('shows error icon with error message', () => {
        render(
          <FormField 
            {...defaultProps} 
            error="Error message"
          />
        );
        
        const errorIcon = screen.getByRole('textbox').parentElement?.querySelector('svg');
        expect(errorIcon).toBeInTheDocument();
      });
    });

    describe('Accessibility', () => {
      it('associates label with input using htmlFor and id', () => {
        render(
          <FormField {...defaultProps} />
        );
        
        const label = screen.getByText('Test Field');
        const input = screen.getByRole('textbox');
        
        expect(label).toHaveAttribute('for', 'testField');
        expect(input).toHaveAttribute('id', 'testField');
      });

      it('has proper ARIA attributes', () => {
        render(
          <FormField 
            {...defaultProps} 
            required
            error="Error message"
          />
        );
        
        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('required');
        expect(input).toHaveAttribute('aria-invalid', 'true');
      });
    });

    describe('Edge Cases', () => {
      it('handles empty options array for select', () => {
        render(
          <FormField 
            {...defaultProps} 
            type="select"
            options={[]}
          />
        );
        
        const select = screen.getByRole('combobox');
        expect(select).toBeInTheDocument();
        expect(screen.getByText('Select an option...')).toBeInTheDocument();
      });

      it('handles custom placeholder for select', () => {
        render(
          <FormField 
            {...defaultProps} 
            type="select"
            options={[]}
            placeholder="Choose an option"
          />
        );
        
        expect(screen.getByText('Choose an option')).toBeInTheDocument();
      });

      it('handles custom rows for textarea', () => {
        render(
          <FormField 
            {...defaultProps} 
            type="textarea"
            rows={5}
          />
        );
        
        const textarea = screen.getByRole('textbox');
        expect(textarea).toHaveAttribute('rows', '5');
      });
    });
  });

  // Test Input component
  describe('Input Component', () => {
    const mockOnChange = jest.fn();
    const defaultProps = {
      value: '',
      onChange: mockOnChange,
    };

    beforeEach(() => {
      mockOnChange.mockClear();
    });

    describe('Rendering', () => {
      it('renders with default props', () => {
        render(
          <Input {...defaultProps} />
        );
        
        const input = screen.getByDisplayValue('');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('type', 'text');
      });

      it('renders with custom type', () => {
        render(
          <Input 
            {...defaultProps} 
            type="email"
          />
        );
        
        const input = screen.getByDisplayValue('');
        expect(input).toHaveAttribute('type', 'email');
      });

      it('renders with placeholder', () => {
        render(
          <Input 
            {...defaultProps} 
            placeholder="Enter email"
          />
        );
        
        expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
      });

      it('renders with custom className', () => {
        render(
          <Input 
            {...defaultProps} 
            className="custom-input"
          />
        );
        
        const input = screen.getByDisplayValue('');
        expect(input).toHaveClass('custom-input');
      });
    });

    describe('User Interactions', () => {
      it('calls onChange when value changes', async () => {
        const user = userEvent.setup();
        
        render(
          <Input {...defaultProps} />
        );
        
        const input = screen.getByDisplayValue('');
        await user.type(input, 'test');
        
        expect(mockOnChange).toHaveBeenCalled();
      });

      it('handles disabled state', () => {
        render(
          <Input 
            {...defaultProps} 
            disabled
          />
        );
        
        const input = screen.getByDisplayValue('');
        expect(input).toBeDisabled();
        expect(input).toHaveClass('disabled:bg-gray-100', 'disabled:cursor-not-allowed');
      });
    });

    describe('Accessibility', () => {
      it('supports aria-label', () => {
        render(
          <Input 
            {...defaultProps} 
            aria-label="Email input"
          />
        );
        
        const input = screen.getByLabelText('Email input');
        expect(input).toBeInTheDocument();
      });

      it('supports name and id attributes', () => {
        render(
          <Input 
            {...defaultProps} 
            name="email"
            id="email-input"
          />
        );
        
        const input = screen.getByDisplayValue('');
        expect(input).toHaveAttribute('name', 'email');
        expect(input).toHaveAttribute('id', 'email-input');
      });
    });
  });

  // Test ProductInputForm component
  describe('ProductInputForm Component', () => {
    const mockOnSubmit = jest.fn();
    const defaultProps = {
      onSubmit: mockOnSubmit,
    };

    beforeEach(() => {
      mockOnSubmit.mockClear();
    });

    describe('Rendering', () => {
      it('renders form with all required fields', () => {
        render(<ProductInputForm {...defaultProps} />);
        
        expect(screen.getByText('Tell Us About Your Product')).toBeInTheDocument();
        expect(screen.getByLabelText(/Product Name/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Business Model/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Product Description/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Describe Your Ideal Customer/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Next: Begin Assessment/ })).toBeInTheDocument();
      });

      it('renders with custom className', () => {
        render(
          <ProductInputForm 
            {...defaultProps} 
            className="custom-form"
          />
        );
        
        const formContainer = screen.getByText('Tell Us About Your Product').closest('div');
        expect(formContainer).toHaveClass('custom-form');
      });

      it('shows business model options', () => {
        render(<ProductInputForm {...defaultProps} />);
        
        const select = screen.getByLabelText(/Business Model/);
        fireEvent.click(select);
        
        expect(screen.getByText('B2B (Subscription)')).toBeInTheDocument();
        expect(screen.getByText('B2B (One-time Purchase)')).toBeInTheDocument();
        expect(screen.getByText('B2C (Subscription)')).toBeInTheDocument();
        expect(screen.getByText('B2C (One-time Purchase)')).toBeInTheDocument();
        expect(screen.getByText('Marketplace')).toBeInTheDocument();
        expect(screen.getByText('Freemium')).toBeInTheDocument();
      });
    });

    describe('Form Validation', () => {
      it('shows validation errors for required fields', async () => {
        const user = userEvent.setup();
        
        render(<ProductInputForm {...defaultProps} />);
        
        // Find the form element by looking for the product name input specifically
        const productNameInput = screen.getByLabelText(/Product Name/);
        const form = productNameInput.closest('form');
        expect(form).toBeInTheDocument();
        
        // Submit the form directly to trigger validation
        fireEvent.submit(form!);
        
        await waitFor(() => {
          expect(screen.getByText('Product name is required')).toBeInTheDocument();
        });
        
        await waitFor(() => {
          expect(screen.getByText('Business model is required')).toBeInTheDocument();
        });
        
        await waitFor(() => {
          expect(screen.getByText('Product description is required')).toBeInTheDocument();
        });
        
        await waitFor(() => {
          expect(screen.getByText('Please describe your ideal customer')).toBeInTheDocument();
        });
      });

      it('clears validation errors when user starts typing', async () => {
        const user = userEvent.setup();
        
        render(<ProductInputForm {...defaultProps} />);
        
        // Find the form element by looking for the product name input specifically
        const productNameInput = screen.getByLabelText(/Product Name/);
        const form = productNameInput.closest('form');
        expect(form).toBeInTheDocument();
        
        // Submit the form directly to trigger validation
        fireEvent.submit(form!);
        
        await waitFor(() => {
          expect(screen.getByText('Product name is required')).toBeInTheDocument();
        });
        
        // Start typing in the product name field
        await user.type(productNameInput, 'Test Product');
        
        await waitFor(() => {
          expect(screen.queryByText('Product name is required')).not.toBeInTheDocument();
        });
      });

      it('validates email format in user info form', async () => {
        const user = userEvent.setup();
        
        render(<UserInfoForm onSubmit={jest.fn()} />);
        
        const emailInput = screen.getByLabelText(/Email Address/);
        await user.type(emailInput, 'invalid-email');
        
        // Find the form element by looking for the email input specifically
        const form = emailInput.closest('form');
        expect(form).toBeInTheDocument();
        
        // Submit the form directly to trigger validation
        fireEvent.submit(form!);
        
        await waitFor(() => {
          expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
        });
      });
    });

    describe('Form Submission', () => {
      it('submits form with valid data', async () => {
        const user = userEvent.setup();
        
        render(<ProductInputForm {...defaultProps} />);
        
        // Fill in required fields
        const productNameInput = screen.getByLabelText(/Product Name/);
        await user.type(productNameInput, 'Test Product');
        
        const businessModelSelect = screen.getByLabelText(/Business Model/);
        await user.selectOptions(businessModelSelect, 'B2B Subscription');
        
        const productDescriptionInput = screen.getByLabelText(/Product Description/);
        await user.type(productDescriptionInput, 'A test product description');
        
        const idealCustomerInput = screen.getByLabelText(/Describe Your Ideal Customer/);
        await user.type(idealCustomerInput, 'Small business owners');
        
        // Verify the form state is correct before submission
        expect(productNameInput).toHaveValue('Test Product');
        expect(businessModelSelect).toHaveValue('B2B Subscription');
        expect(productDescriptionInput).toHaveValue('A test product description');
        expect(idealCustomerInput).toHaveValue('Small business owners');
        
        // Try submitting the form directly
        const form = screen.getByDisplayValue('Test Product').closest('form');
        fireEvent.submit(form!);
        
        await waitFor(() => {
          expect(mockOnSubmit).toHaveBeenCalledWith({
            productName: 'Test Product',
            productDescription: 'A test product description',
            keyFeatures: '',
            idealCustomerDescription: 'Small business owners',
            businessModel: 'B2B Subscription',
            customerCount: '',
            distinguishingFeature: ''
          });
        });
      });

      it('does not submit form with invalid data', async () => {
        const user = userEvent.setup();
        
        render(<ProductInputForm {...defaultProps} />);
        
        // Submit empty form
        const submitButton = screen.getByRole('button', { name: /Next: Begin Assessment/ });
        await user.click(submitButton);
        
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    describe('User Interactions', () => {
      it('updates form state when user types', async () => {
        const user = userEvent.setup();
        
        render(<ProductInputForm {...defaultProps} />);
        
        const productNameInput = screen.getByLabelText(/Product Name/);
        await user.type(productNameInput, 'My Product');
        
        expect(productNameInput).toHaveValue('My Product');
      });

      it('handles optional fields', async () => {
        const user = userEvent.setup();
        
        render(<ProductInputForm {...defaultProps} />);
        
        const keyFeaturesInput = screen.getByLabelText(/Key Features/);
        await user.type(keyFeaturesInput, 'Feature 1, Feature 2');
        
        expect(keyFeaturesInput).toHaveValue('Feature 1, Feature 2');
      });
    });

    describe('Accessibility', () => {
      it('has proper form structure', () => {
        render(<ProductInputForm {...defaultProps} />);
        
        // Find the form element by looking for the product name input specifically
        const productNameInput = screen.getByLabelText(/Product Name/);
        const form = productNameInput.closest('form');
        expect(form).toBeInTheDocument();
        
        // Check that all inputs have associated labels
        const inputs = screen.getAllByRole('textbox');
        inputs.forEach(input => {
          const label = screen.getByLabelText(input.getAttribute('aria-label') || '');
          expect(label).toBeInTheDocument();
        });
      });

      it('has proper heading structure', () => {
        render(<ProductInputForm {...defaultProps} />);
        
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveTextContent('Tell Us About Your Product');
      });
    });
  });

  // Test UserInfoForm component
  describe('UserInfoForm Component', () => {
    const mockOnSubmit = jest.fn();
    const mockOnSkip = jest.fn();
    const defaultProps = {
      onSubmit: mockOnSubmit,
      onSkip: mockOnSkip,
    };

    beforeEach(() => {
      mockOnSubmit.mockClear();
      mockOnSkip.mockClear();
    });

    describe('Rendering', () => {
      it('renders form with all fields', () => {
        render(<UserInfoForm {...defaultProps} />);
        
        expect(screen.getByText('Almost Done!')).toBeInTheDocument();
        expect(screen.getByLabelText(/Full Name/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email Address/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Company/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Role/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Get My Results/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Skip for Now/ })).toBeInTheDocument();
      });

      it('renders without skip button when onSkip is not provided', () => {
        render(<UserInfoForm onSubmit={mockOnSubmit} />);
        
        expect(screen.getByRole('button', { name: /Get My Results/ })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Skip for Now/ })).not.toBeInTheDocument();
      });
    });

    describe('Form Validation', () => {
      it('validates required fields', async () => {
        const user = userEvent.setup();
        
        render(<UserInfoForm {...defaultProps} />);
        
        const submitButton = screen.getByRole('button', { name: /Get My Results/ });
        await user.click(submitButton);
        
        await waitFor(() => {
          expect(screen.getByText('Name is required')).toBeInTheDocument();
          expect(screen.getByText('Email is required')).toBeInTheDocument();
          expect(screen.getByText('Company is required')).toBeInTheDocument();
        });
      });

      it('validates email format', async () => {
        const user = userEvent.setup();
        
        render(<UserInfoForm {...defaultProps} />);
        
        const emailInput = screen.getByLabelText(/Email Address/);
        await user.type(emailInput, 'invalid-email');
        
        const submitButton = screen.getByRole('button', { name: /Get My Results/ });
        await user.click(submitButton);
        
        await waitFor(() => {
          expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
        });
      });
    });

    describe('Form Submission', () => {
      it('submits form with valid data', async () => {
        const user = userEvent.setup();
        
        render(<UserInfoForm {...defaultProps} />);
        
        // Fill in required fields
        await user.type(screen.getByLabelText(/Full Name/), 'John Doe');
        await user.type(screen.getByLabelText(/Email Address/), 'john@example.com');
        await user.type(screen.getByLabelText(/Company/), 'Test Company');
        await user.type(screen.getByLabelText(/Role/), 'CEO');
        
        // Submit the form directly
        const form = screen.getByDisplayValue('John Doe').closest('form');
        fireEvent.submit(form!);
        
        await waitFor(() => {
          expect(mockOnSubmit).toHaveBeenCalledWith({
            name: 'John Doe',
            email: 'john@example.com',
            company: 'Test Company',
            role: 'CEO'
          });
        });
      });

      it('calls onSkip when skip button is clicked', async () => {
        const user = userEvent.setup();
        
        render(<UserInfoForm {...defaultProps} />);
        
        const skipButton = screen.getByRole('button', { name: /Skip for Now/ });
        await user.click(skipButton);
        
        expect(mockOnSkip).toHaveBeenCalled();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles form submission with preventDefault', async () => {
      const user = userEvent.setup();
      
      render(<ProductInputForm {...defaultProps} />);
      
      // Fill in required fields
      await user.type(screen.getByLabelText(/Product Name/), 'Test Product');
      await user.selectOptions(screen.getByLabelText(/Business Model/), 'B2B Subscription');
      await user.type(screen.getByLabelText(/Product Description/), 'A test product description');
      await user.type(screen.getByLabelText(/Describe Your Ideal Customer/), 'Small business owners');
      
      const form = screen.getByRole('form');
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      Object.defineProperty(submitEvent, 'preventDefault', {
        value: jest.fn(),
        writable: true
      });
      
      fireEvent(form, submitEvent);
      
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    it('handles empty string values in form state', async () => {
      const user = userEvent.setup();
      
      render(<ProductInputForm {...defaultProps} />);
      
      const productNameInput = screen.getByLabelText(/Product Name/);
      await user.type(productNameInput, 'Test');
      await user.clear(productNameInput);
      
      expect(productNameInput).toHaveValue('');
    });
  });
});
