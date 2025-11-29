/**
 * Error Display Component
 * Reusable error display with retry functionality
 */

import React from 'react';

interface ErrorDisplayProps {
  error: string | Error;
  onRetry?: () => void;
  variant?: 'page' | 'section' | 'inline';
  className?: string;
}

export function ErrorDisplay({ 
  error, 
  onRetry,
  variant = 'page',
  className = ''
}: ErrorDisplayProps): React.ReactElement {
  
  const errorMessage = typeof error === 'string' ? error : error.message;

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-red-600 text-sm">⚠️ {errorMessage}</span>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="text-blue-600 hover:text-blue-700 text-sm underline"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (variant === 'section') {
    return (
      <div className={`py-12 ${className}`}>
        <div className="text-center max-w-md mx-auto">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{errorMessage}</p>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  // Page variant - full screen
  return (
    <div className={`min-h-screen flex items-center justify-center ${className}`}>
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-6xl mb-6">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
        <p className="text-red-600 mb-6">{errorMessage}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorDisplay;
