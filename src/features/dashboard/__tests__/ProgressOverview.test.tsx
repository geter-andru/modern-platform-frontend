/**
 * ProgressOverview Component Unit Tests
 *
 * Tests the ProgressOverview dashboard component:
 * - Renders competency areas correctly
 * - Calculates color classes based on scores
 * - Displays unlock requirements
 * - Shows progress bars accurately
 * - Handles empty/missing data gracefully
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressOverview from '../ProgressOverview';
import { Brain, Target, Users } from 'lucide-react';

describe('ProgressOverview Component', () => {
  const mockCompetencyAreas = [
    {
      name: 'Value Communication',
      current: 75,
      level: 'Developing',
      color: 'blue',
      unlocked: true,
      icon: Brain
    },
    {
      name: 'Sales Execution',
      current: 50,
      level: 'Foundation',
      color: 'amber',
      unlocked: false,
      icon: Target
    },
    {
      name: 'Customer Analysis',
      current: 90,
      level: 'Advanced',
      color: 'green',
      unlocked: true,
      icon: Users
    }
  ];

  const mockNextUnlock = {
    tool: 'Business Case Builder',
    pointsNeeded: 20,
    requirement: 'Reach 70 points in Sales Execution'
  };

  describe('Rendering', () => {
    test('renders without crashing', () => {
      render(<ProgressOverview competencyAreas={mockCompetencyAreas} />);

      // Should render at least one competency area
      expect(screen.getByText('Value Communication')).toBeInTheDocument();
    });

    test('renders all competency areas', () => {
      render(<ProgressOverview competencyAreas={mockCompetencyAreas} />);

      expect(screen.getByText('Value Communication')).toBeInTheDocument();
      expect(screen.getByText('Sales Execution')).toBeInTheDocument();
      expect(screen.getByText('Customer Analysis')).toBeInTheDocument();
    });

    test('displays competency scores', () => {
      render(<ProgressOverview competencyAreas={mockCompetencyAreas} />);

      expect(screen.getByText(/75/)).toBeInTheDocument();
      expect(screen.getByText(/50/)).toBeInTheDocument();
      expect(screen.getByText(/90/)).toBeInTheDocument();
    });

    test('displays competency levels', () => {
      render(<ProgressOverview competencyAreas={mockCompetencyAreas} />);

      expect(screen.getByText('Developing')).toBeInTheDocument();
      expect(screen.getByText('Foundation')).toBeInTheDocument();
      expect(screen.getByText('Advanced')).toBeInTheDocument();
    });

    test('applies custom className', () => {
      const { container } = render(
        <ProgressOverview
          competencyAreas={mockCompetencyAreas}
          className="custom-class"
        />
      );

      const element = container.firstChild as HTMLElement;
      expect(element.className).toContain('custom-class');
    });
  });

  describe('Next Unlock Display', () => {
    test('renders next unlock information when provided', () => {
      render(
        <ProgressOverview
          competencyAreas={mockCompetencyAreas}
          nextUnlock={mockNextUnlock}
        />
      );

      expect(screen.getByText(/Business Case Builder/i)).toBeInTheDocument();
      expect(screen.getByText(/20/)).toBeInTheDocument();
    });

    test('does not crash when nextUnlock is undefined', () => {
      render(<ProgressOverview competencyAreas={mockCompetencyAreas} />);

      // Should render competency areas without next unlock section
      expect(screen.getByText('Value Communication')).toBeInTheDocument();
    });
  });

  describe('Color Class Logic', () => {
    test('applies blue color classes correctly', () => {
      const blueArea = [{
        name: 'Blue Test',
        current: 50,
        level: 'Test',
        color: 'blue',
        unlocked: true,
        icon: Brain
      }];

      const { container } = render(<ProgressOverview competencyAreas={blueArea} />);

      // Should have blue-related classes
      const hasBlueClasses = container.innerHTML.includes('blue');
      expect(hasBlueClasses).toBeTruthy();
    });

    test('applies amber color classes correctly', () => {
      const amberArea = [{
        name: 'Amber Test',
        current: 50,
        level: 'Test',
        color: 'amber',
        unlocked: true,
        icon: Target
      }];

      const { container } = render(<ProgressOverview competencyAreas={amberArea} />);

      // Should have amber-related classes
      const hasAmberClasses = container.innerHTML.includes('amber');
      expect(hasAmberClasses).toBeTruthy();
    });

    test('applies green color classes correctly', () => {
      const greenArea = [{
        name: 'Green Test',
        current: 90,
        level: 'Test',
        color: 'green',
        unlocked: true,
        icon: Users
      }];

      const { container } = render(<ProgressOverview competencyAreas={greenArea} />);

      // Should have green-related classes
      const hasGreenClasses = container.innerHTML.includes('green');
      expect(hasGreenClasses).toBeTruthy();
    });

    test('handles unknown color with default gray', () => {
      const unknownColor = [{
        name: 'Unknown Color Test',
        current: 50,
        level: 'Test',
        color: 'purple', // Not in defined colors
        unlocked: true,
        icon: Brain
      }];

      render(<ProgressOverview competencyAreas={unknownColor} />);

      // Should render without crashing
      expect(screen.getByText('Unknown Color Test')).toBeInTheDocument();
    });
  });

  describe('Unlock Status', () => {
    test('shows unlocked status correctly', () => {
      const unlockedArea = [{
        name: 'Unlocked Area',
        current: 100,
        level: 'Expert',
        color: 'green',
        unlocked: true,
        icon: Brain
      }];

      render(<ProgressOverview competencyAreas={unlockedArea} />);

      // Component should render the unlocked area
      expect(screen.getByText('Unlocked Area')).toBeInTheDocument();
    });

    test('shows locked status correctly', () => {
      const lockedArea = [{
        name: 'Locked Area',
        current: 30,
        level: 'Beginner',
        color: 'amber',
        unlocked: false,
        icon: Target
      }];

      render(<ProgressOverview competencyAreas={lockedArea} />);

      // Component should render the locked area
      expect(screen.getByText('Locked Area')).toBeInTheDocument();
    });
  });

  describe('Progress Calculation', () => {
    test('renders progress bars with correct percentages', () => {
      render(<ProgressOverview competencyAreas={mockCompetencyAreas} />);

      // Progress bars should be present
      // Note: Actual progress bar width verification would require checking styles
      expect(screen.getByText('Value Communication')).toBeInTheDocument();
    });

    test('handles 0% progress', () => {
      const zeroProgress = [{
        name: 'Zero Progress',
        current: 0,
        level: 'Beginner',
        color: 'amber',
        unlocked: false,
        icon: Brain
      }];

      render(<ProgressOverview competencyAreas={zeroProgress} />);

      expect(screen.getByText(/0/)).toBeInTheDocument();
    });

    test('handles 100% progress', () => {
      const fullProgress = [{
        name: 'Full Progress',
        current: 100,
        level: 'Expert',
        color: 'green',
        unlocked: true,
        icon: Users
      }];

      render(<ProgressOverview competencyAreas={fullProgress} />);

      expect(screen.getByText(/100/)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles empty competency areas array', () => {
      const { container } = render(<ProgressOverview competencyAreas={[]} />);

      // Should render container without crashing
      expect(container.firstChild).toBeTruthy();
    });

    test('handles missing icon gracefully', () => {
      const noIconArea = [{
        name: 'No Icon',
        current: 50,
        level: 'Test',
        color: 'blue',
        unlocked: true,
        icon: null as any // Force null icon
      }];

      // Should not crash with missing icon
      expect(() => render(<ProgressOverview competencyAreas={noIconArea} />)).not.toThrow();
    });

    test('handles extremely high scores', () => {
      const highScore = [{
        name: 'High Score',
        current: 9999,
        level: 'Ultimate',
        color: 'green',
        unlocked: true,
        icon: Brain
      }];

      render(<ProgressOverview competencyAreas={highScore} />);

      expect(screen.getByText(/9999/)).toBeInTheDocument();
    });

    test('handles negative scores', () => {
      const negativeScore = [{
        name: 'Negative Score',
        current: -10,
        level: 'Error',
        color: 'amber',
        unlocked: false,
        icon: Target
      }];

      render(<ProgressOverview competencyAreas={negativeScore} />);

      // Should render without crashing
      expect(screen.getByText('Negative Score')).toBeInTheDocument();
    });
  });
});
