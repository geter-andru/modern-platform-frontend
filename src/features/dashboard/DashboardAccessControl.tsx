import React from 'react';

interface DashboardAccessControlProps {
  children: React.ReactNode;
  customerId: string;
}

const DashboardAccessControl: React.FC<DashboardAccessControlProps> = ({ children, customerId }) => {
  return <>{children}</>;
};

export default DashboardAccessControl;
