import React from 'react';

interface AssessmentProviderProps {
  children: React.ReactNode;
}

const AssessmentProvider: React.FC<AssessmentProviderProps> = ({ children }) => {
  return <>{children}</>;
};

export default AssessmentProvider;
