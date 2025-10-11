// Shared Resources - Main Barrel Export

// Components
export * from './components/ui';
export * from './contexts/SystematicScalingContext';

// Re-export specific commonly used items
export { ModernCard } from './components/ui';
export { useSystematicScaling, SystematicScalingProvider } from './contexts/SystematicScalingContext';