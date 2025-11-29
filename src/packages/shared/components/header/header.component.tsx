'use client';

import React from 'react';
import { HeaderProps } from './header.types';
import headerConfig from './header.configuration.json';

export function Header({
  title = headerConfig.title,
  actions = headerConfig.actions,
  className = '',
}: HeaderProps): React.ReactElement {
  
  // Filter actions based on visibility
  const visibleActions = actions?.filter(action => action.visible) || [];

  return (
    <header className={`bg-white shadow-sm border-b ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Title */}
          {headerConfig.behavior.displayTitle && (
            <h1 className="text-xl font-bold text-gray-900">
              {title}
            </h1>
          )}

          {/* Actions */}
          {visibleActions.length > 0 && (
            <nav className="flex space-x-4">
              {visibleActions.map((action, index) => (
                <button
                  key={`${action.action}-${index}`}
                  onClick={() => console.log(`Action: ${action.action}`)}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  type="button"
                >
                  {action.label}
                </button>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
