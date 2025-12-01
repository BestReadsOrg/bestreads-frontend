'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { HeaderProps } from './headerv2.types';
import { SearchBar } from '@/packages/shared/components/search-bar';
import { ProfileDropdown } from '@/app/components/profile-dropdown';
import headerV2Config from './headerv2.configuration.json';

/**
 * HeaderV2 Component
 * 
 * Enhanced header with search, profile dropdown, and My Books link.
 * Similar to Header component but with additional authenticated user features.
 * Supports username-based routing (/:username/dashboard, /:username/profile, etc.)
 */
export function HeaderV2({
  title = headerV2Config.title,
  userData,
  className = '',
}: HeaderProps): React.ReactElement {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Get username for routing
  const username = userData?.username || 'user';

  const handleSearch = (query: string, searchType: 'title' | 'isbn') => {
    // Navigate to search results page with query params
    const params = new URLSearchParams({
      q: query,
      type: searchType,
    });
    router.push(`/${username}/search?${params.toString()}`);
  };

  const handleProfileNavigate = (path: string) => {
    // Convert relative paths to username-based paths
    const usernamePath = path.startsWith('/') 
      ? `/${username}${path}` 
      : `/${username}/${path}`;
    router.push(usernamePath);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    // Clear auth and redirect to landing
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    router.push('/landing');
  };

  const handleMyBooks = () => {
    router.push(`/${username}/my-books`);
    setIsMobileMenuOpen(false);
  };
  
  const handleDashboardClick = () => {
    router.push(`/${username}/dashboard`);
  };

  return (
    <header className={`bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo/Title */}
          <div className="flex items-center">
            <h1
              className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={handleDashboardClick}
            >
              {title}
            </h1>
          </div>

          {/* Desktop - Center Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* My Books Button */}
            <button
              onClick={handleMyBooks}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
            >
              <span className="text-lg">📚</span>
              <span>My Books</span>
            </button>

            {/* Search Bar */}
            <SearchBar
              placeholder="Search by title or ISBN..."
              onSearch={handleSearch}
              showDropdown={true}
            />
          </div>

          {/* Right - Dark Mode Toggle, Profile Dropdown and Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle - Desktop */}
            <button
              onClick={toggleDarkMode}
              className="hidden md:block p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
              type="button"
            >
              {isDarkMode ? '🌞' : '🌙'}
            </button>

            {userData && userData.username ? (
              <>
                <ProfileDropdown
                  user={{
                    username: userData.username,
                    email: userData.email || undefined,
                    avatar: userData.avatar || undefined,
                  }}
                  onNavigate={handleProfileNavigate}
                  onLogout={handleLogout}
                />
                
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
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <button
              onClick={handleMyBooks}
              className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span className="text-lg">📚</span>
              <span>My Books</span>
            </button>
            
            <div className="px-2">
              <SearchBar
                placeholder="Search books..."
                onSearch={handleSearch}
                showDropdown={true}
              />
            </div>

            {/* Dark Mode Toggle - Mobile */}
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              type="button"
            >
              <span>{isDarkMode ? '🌞' : '🌙'}</span>
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default HeaderV2;
