/**
 * Login Component
 * A configuration-driven login component that renders based on config
 */

'use client';

import React from 'react';
import { LoginProps } from './login.types';

/**
 * Button variant styles mapping
 */
const buttonVariants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200',
  danger: 'bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200',
  ghost: 'bg-transparent hover:bg-gray-100 text-blue-600 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 border border-blue-600',
};

/**
 * Login Component
 * 
 * Renders a login interface based on configuration
 * Supports dynamic header, body text, and action buttons
 * 
 * @param props - LoginProps including configuration and event handlers
 * @returns Rendered login component
 * 
 * @example
 * <Login 
 *   title="Welcome" 
 *   description="Please sign in"
 *   actions={[...]}
 *   onAction={handleAction}
 * />
 */
export function Login({
  title,
  description,
  actions = [],
  styles = {},
  user,
  onAction,
  className = '',
}: LoginProps): React.ReactElement {
  
  /**
   * Handles button click events
   */
  const handleActionClick = (actionName: string) => {
    if (onAction) {
      onAction(actionName, { user });
    } else {
      console.log(`Action triggered: ${actionName}`, { user });
    }
  };

  // Get display text from config using keys
  const headerText = title;
  const bodyText = description;

  // Filter visible actions
  const visibleActions = actions.filter(action => action.visible);

  return (
    <div 
      className={`${styles.containerClass || 'max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg'} ${className}`}
    >
      {/* Header */}
      {headerText && (
        <h1 className={styles.headerClass || 'text-2xl font-bold text-gray-900 mb-2'}>
          {headerText}
        </h1>
      )}

      {/* Body/Description */}
      {bodyText && (
        <p className={styles.bodyClass || 'text-gray-600 mb-6'}>
          {bodyText}
        </p>
      )}

      {/* User Info (if provided) */}
      {user && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            {user.name && <span className="font-semibold">{user.name}</span>}
            {user.email && <span className="text-blue-600 ml-2">({user.email})</span>}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      {visibleActions.length > 0 && (
        <div className={styles.buttonContainerClass || 'space-y-3'}>
          {visibleActions.map((action, index) => {
            const buttonClass = buttonVariants[action.variant || 'primary'];
            
            return (
              <button
                key={`${action.action}-${index}`}
                onClick={() => handleActionClick(action.action)}
                className={`w-full ${buttonClass}`}
                type="button"
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </button>
            );
          })}
        </div>
      )}

      {/* No actions message */}
      {visibleActions.length === 0 && (
        <p className="text-gray-400 text-sm text-center">
          No actions available
        </p>
      )}
    </div>
  );
}

// Export default for easier imports
export default Login;
