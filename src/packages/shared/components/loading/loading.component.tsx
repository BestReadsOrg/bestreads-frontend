import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'page' | 'section' | 'inline';
  message?: string;
  className?: string;
}

export function LoadingSkeleton({ 
  variant = 'page', 
  message = 'Loading...',
  className = ''
}: LoadingSkeletonProps): React.ReactElement {
  
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
        <span className="text-sm text-gray-600">{message}</span>
      </div>
    );
  }

  if (variant === 'section') {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    );
  }

  // Page variant - full screen
  return (
    <div className={`min-h-screen flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  );
}

export default LoadingSkeleton;
