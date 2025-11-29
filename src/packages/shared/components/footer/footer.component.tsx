/**
 * Footer Component
 * A configuration-driven footer component
 */

'use client';

import React from 'react';
import { FooterConfig } from './footer.types';

interface FooterProps extends FooterConfig {
  className?: string;
}

/**
 * Footer Component
 * 
 * Renders a footer based on configuration
 * Supports copyright text and action links
 */
export function Footer({
  copyrightText,
  actions = [],
  className = '',
}: FooterProps): React.ReactElement {
  
  const visibleActions = actions.filter(action => action.visible);

  return (
    <footer className={`bg-gray-50 border-t ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Copyright */}
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            {copyrightText}
          </p>

          {/* Actions/Links */}
          {visibleActions.length > 0 && (
            <nav className="flex flex-wrap justify-center gap-4">
              {visibleActions.map((action, index) => (
                <button
                  key={`${action.action}-${index}`}
                  onClick={() => console.log(`Action: ${action.action}`)}
                  className="text-gray-600 hover:text-gray-900 text-sm"
                  type="button"
                >
                  {action.label}
                </button>
              ))}
            </nav>
          )}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
