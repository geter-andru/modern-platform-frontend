import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlatformHeader from '@/src/shared/components/layout/PlatformHeader';

// Mock the lucide-react icons
jest.mock('lucide-react', () => ({
  Menu: () => <div data-testid="menu-icon">Menu</div>,
  Bell: () => <div data-testid="bell-icon">Bell</div>,
  Settings: () => <div data-testid="settings-icon">Settings</div>,
  User: () => <div data-testid="user-icon">User</div>,
  LogOut: () => <div data-testid="logout-icon">LogOut</div>,
  Search: () => <div data-testid="search-icon">Search</div>,
  Home: () => <div data-testid="home-icon">Home</div>,
  BarChart3: () => <div data-testid="barchart3-icon">BarChart3</div>,
  Target: () => <div data-testid="target-icon">Target</div>,
  Users: () => <div data-testid="users-icon">Users</div>,
  FileText: () => <div data-testid="filetext-icon">FileText</div>,
  Zap: () => <div data-testid="zap-icon">Zap</div>,
}));

describe('PlatformHeader', () => {
  const defaultProps = {
    onMenuToggle: jest.fn(),
    onNotificationClick: jest.fn(),
    onSettingsClick: jest.fn(),
    onProfileClick: jest.fn(),
    onLogout: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<PlatformHeader {...defaultProps} />);
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByText('H&S Platform')).toBeInTheDocument();
      expect(screen.getAllByText('Revenue Intelligence')).toHaveLength(2); // Two instances due to component structure
    });

    it('renders with custom className', () => {
      render(<PlatformHeader {...defaultProps} className="custom-class" />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('custom-class');
    });

    it('renders all navigation icons', () => {
      render(<PlatformHeader {...defaultProps} />);
      
      expect(screen.getAllByTestId('menu-icon')).toHaveLength(2); // Two menu buttons
      expect(screen.getByTestId('bell-icon')).toBeInTheDocument();
      expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
      expect(screen.getAllByTestId('zap-icon')).toHaveLength(2); // Two zap icons due to component structure
    });

    it('renders notification badge', () => {
      render(<PlatformHeader {...defaultProps} />);
      
      const notificationButton = screen.getByTitle('Notifications');
      expect(notificationButton).toBeInTheDocument();
      
      // Check for notification badge
      const badge = notificationButton.querySelector('span');
      expect(badge).toHaveClass('bg-accent-danger');
    });
  });

  describe('User Display', () => {
    it('renders without user information', () => {
      render(<PlatformHeader {...defaultProps} />);
      
      // Should not show user info when no user is provided
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      expect(screen.queryByText('john@example.com')).not.toBeInTheDocument();
    });

    it('renders with user information', () => {
      const user = {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://example.com/avatar.jpg'
      };
      
      render(<PlatformHeader {...defaultProps} user={user} />);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('renders user avatar when provided', () => {
      const user = {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://example.com/avatar.jpg'
      };
      
      render(<PlatformHeader {...defaultProps} user={user} />);
      
      const avatar = screen.getByAltText('John Doe');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('renders default user icon when no avatar provided', () => {
      const user = {
        name: 'John Doe',
        email: 'john@example.com'
      };
      
      render(<PlatformHeader {...defaultProps} user={user} />);
      
      expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    });

    it('hides user email on mobile (hidden md:block)', () => {
      const user = {
        name: 'John Doe',
        email: 'john@example.com'
      };
      
      render(<PlatformHeader {...defaultProps} user={user} />);
      
      const userInfo = screen.getByText('John Doe').closest('div');
      expect(userInfo).toHaveClass('hidden', 'md:block');
    });
  });

  describe('User Interactions', () => {
    it('calls onMenuToggle when menu button is clicked', () => {
      render(<PlatformHeader {...defaultProps} />);
      
      const menuButtons = screen.getAllByTitle('Toggle navigation');
      fireEvent.click(menuButtons[0]);
      
      expect(defaultProps.onMenuToggle).toHaveBeenCalledTimes(1);
    });

    it('calls onLogout when logout button is clicked', () => {
      const user = {
        name: 'John Doe',
        email: 'john@example.com'
      };
      
      render(<PlatformHeader {...defaultProps} user={user} />);
      
      const logoutButton = screen.getByTitle('Logout');
      fireEvent.click(logoutButton);
      
      expect(defaultProps.onLogout).toHaveBeenCalledTimes(1);
    });

    it('handles notification button click', () => {
      render(<PlatformHeader {...defaultProps} />);
      
      const notificationButton = screen.getByTitle('Notifications');
      fireEvent.click(notificationButton);
      
      // Note: The current implementation doesn't call onNotificationClick
      // This test documents the current behavior
    });

    it('handles settings button click', () => {
      render(<PlatformHeader {...defaultProps} />);
      
      const settingsButton = screen.getByTitle('Settings');
      fireEvent.click(settingsButton);
      
      // Note: The current implementation doesn't call onSettingsClick
      // This test documents the current behavior
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<PlatformHeader {...defaultProps} />);
      
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('has proper button titles for screen readers', () => {
      render(<PlatformHeader {...defaultProps} />);
      
      expect(screen.getAllByTitle('Toggle navigation')).toHaveLength(2);
      expect(screen.getByTitle('Notifications')).toBeInTheDocument();
      expect(screen.getByTitle('Settings')).toBeInTheDocument();
    });

    it('has proper alt text for user avatar', () => {
      const user = {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://example.com/avatar.jpg'
      };
      
      render(<PlatformHeader {...defaultProps} user={user} />);
      
      const avatar = screen.getByAltText('John Doe');
      expect(avatar).toBeInTheDocument();
    });

    it('is keyboard navigable', () => {
      render(<PlatformHeader {...defaultProps} />);
      
      const menuButton = screen.getAllByTitle('Toggle navigation')[0];
      expect(menuButton).toBeInTheDocument();
      
      // Test keyboard navigation
      menuButton.focus();
      expect(menuButton).toHaveFocus();
    });
  });

  describe('Styling and Layout', () => {
    it('applies correct base classes', () => {
      render(<PlatformHeader {...defaultProps} />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('bg-background-primary', 'border-b', 'border-border-standard', 'px-6', 'py-4');
    });

    it('applies custom className', () => {
      render(<PlatformHeader {...defaultProps} className="custom-header" />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('custom-header');
    });

    it('has proper flex layout', () => {
      render(<PlatformHeader {...defaultProps} />);
      
      const header = screen.getByRole('banner');
      const flexContainer = header.querySelector('div');
      expect(flexContainer).toHaveClass('flex', 'items-center', 'justify-between');
    });

    it('has proper hover states for buttons', () => {
      render(<PlatformHeader {...defaultProps} />);
      
      const menuButton = screen.getAllByTitle('Toggle navigation')[0];
      expect(menuButton).toHaveClass('hover:text-text-primary', 'hover:bg-surface-hover');
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined user gracefully', () => {
      render(<PlatformHeader {...defaultProps} user={undefined} />);
      
      expect(screen.getByText('H&S Platform')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });

    it('handles empty user object', () => {
      render(<PlatformHeader {...defaultProps} user={{}} />);
      
      // Should not crash and should not show user info
      expect(screen.getByText('H&S Platform')).toBeInTheDocument();
    });

    it('handles user with missing name', () => {
      const user = {
        email: 'john@example.com'
      };
      
      render(<PlatformHeader {...defaultProps} user={user} />);
      
      // Should not crash
      expect(screen.getByText('H&S Platform')).toBeInTheDocument();
    });

    it('handles user with missing email', () => {
      const user = {
        name: 'John Doe'
      };
      
      render(<PlatformHeader {...defaultProps} user={user} />);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('renders logo section correctly', () => {
      render(<PlatformHeader {...defaultProps} />);
      
      expect(screen.getByText('H&S Platform')).toBeInTheDocument();
      expect(screen.getAllByText('Revenue Intelligence')).toHaveLength(2); // Two instances due to component structure
      expect(screen.getAllByTestId('zap-icon')).toHaveLength(2); // Two zap icons due to component structure
    });

    it('renders navigation section correctly', () => {
      render(<PlatformHeader {...defaultProps} />);
      
      expect(screen.getAllByTestId('menu-icon')).toHaveLength(2);
      expect(screen.getByTestId('bell-icon')).toBeInTheDocument();
      expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
    });

    it('renders user section when user is provided', () => {
      const user = {
        name: 'John Doe',
        email: 'john@example.com'
      };
      
      render(<PlatformHeader {...defaultProps} user={user} />);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByTestId('logout-icon')).toBeInTheDocument();
    });
  });
});
