'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { HeaderProps, HeaderAction } from './header.types';
import { Button } from '@/packages/shared/components/button';
import headerConfig from './header.configuration.json';

/**
 * Header Component
 * 
 * Configuration-driven header with intelligent action handling.
 * Actions are defined in header.configuration.json with type and target:
 * 
 * - type: 'scroll' -> Smooth scroll to element (target = element ID or 'top')
 * - type: 'route' -> Navigate to internal page (target = route path)
 * - type: 'external' -> Open external URL (target = full URL)
 * 
 * @example
 * // Scroll to features section
 * { type: 'scroll', target: 'features' }
 * 
 * // Navigate to login page
 * { type: 'route', target: '/login' }
 * 
 * // Open external link
 * { type: 'external', target: 'https://example.com' }
 */
export function Header({
  title = headerConfig.title,
  actions = headerConfig.actions as HeaderAction[],
  className = '',
}: HeaderProps): React.ReactElement {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Filter actions based on visibility
  const visibleActions = actions?.filter(action => action.visible) || [];

  const handleAction = (action: HeaderAction) => {
    // Close mobile menu when action is clicked
    setIsMobileMenuOpen(false);
    
    switch (action.type) {
      case 'scroll':
        // Smooth scroll to section or top
        if (action.target === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const element = document.getElementById(action.target);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
        break;
      
      case 'route':
        // Navigate to internal route
        router.push(action.target);
        break;
      
      case 'external':
        // Open external link
        window.open(action.target, '_blank', 'noopener,noreferrer');
        break;
      
      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  };

  return (
    <header className={`bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Title */}
          {headerConfig.behavior.displayTitle && (
            <h1 
              className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer" 
              onClick={() => handleAction({ label: 'Home', action: 'navigateHome', type: 'scroll', target: 'top', visible: true })}
            >
              {title}
            </h1>
          )}

          {/* Desktop Actions */}
          {visibleActions.length > 0 && (
            <>
              <nav className="hidden md:flex space-x-2 items-center">
                {visibleActions.map((action, index) => (
                  <Button
                    key={`${action.action}-${index}`}
                    label={action.label}
                    action={action.action}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAction(action)}
                  />
                ))}
                
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle dark mode"
                  type="button"
                >
                  {isDarkMode ? '🌞' : '🌙'}
                </button>
              </nav>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
                type="button"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && visibleActions.length > 0 && (
          <nav className="md:hidden mt-4 pb-4 space-y-2">
            {visibleActions.map((action, index) => (
              <Button
                key={`mobile-${action.action}-${index}`}
                label={action.label}
                action={action.action}
                variant="ghost"
                size="sm"
                fullWidth
                onClick={() => handleAction(action)}
              />
            ))}
            
            {/* Dark Mode Toggle in Mobile Menu */}
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              type="button"
            >
              <span>{isDarkMode ? '🌞' : '🌙'}</span>
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
