'use client';

import React from 'react';
import { HeaderProps } from './headerv2.types';
import headerV2Config from './headerv2.configuration.json';

export function HeaderV2({
  title = headerV2Config.title,
  actions = headerV2Config.actions,
  userData,
  className = '',
}: HeaderProps): React.ReactElement {
  
  // Filter actions based on user role and visibility
  const userRole = userData?.role || 'guest';
  const visibleActions = actions?.filter(action => {
    if (!action.visible) return false;
    if (!action.roles || action.roles.length === 0) return true;
    return action.roles.includes(userRole);
  }) || [];

  return (
    <header className={`bg-white shadow-sm border-b ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {headerV2Config.behavior.displayTitle && (
            <h1 className="text-xl font-bold text-gray-900">
              {title}
            </h1>
          )}

          {visibleActions.length > 0 && (
            <nav className="flex space-x-4">
              {visibleActions.map((action, index) => (
                <button
                  key={`${action.action}-${index}`}
                  onClick={() => console.log(`Action: ${action.action}`, userData)}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  type="button"
                >
                  {action.label}
                </button>
              ))}
            </nav>
          )}

          {/* User Info (if logged in) */}
          {userData && userData.username && (
            <div className="flex items-center ml-4">
              <span className="text-sm text-gray-600">
                {userData.username}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default HeaderV2;
