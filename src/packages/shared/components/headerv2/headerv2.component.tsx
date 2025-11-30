'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { HeaderProps } from './headerv2.types';
import { SearchBar } from '@/packages/shared/components/search-bar';
import { ProfileDropdown } from '@/app/components/profile-dropdown';
import headerV2Config from './headerv2.configuration.json';

export function HeaderV2({
  title = headerV2Config.title,
  actions = headerV2Config.actions,
  userData,
  className = '',
}: HeaderProps): React.ReactElement {
  const router = useRouter();

  const handleSearch = (query: string, searchType: 'title' | 'isbn') => {
    // Navigate to search results page with query params
    const params = new URLSearchParams({
      q: query,
      type: searchType,
    });
    router.push(`/search?${params.toString()}`);
  };

  const handleProfileNavigate = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    // Clear auth and redirect to landing
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/landing');
  };

  const handleMyBooks = () => {
    router.push('/my-books');
  };

  return (
    <header className={`bg-white shadow-sm border-b ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <h1
              className="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => router.push('/dashboard')}
            >
              {title}
            </h1>
          </div>

          {/* Center - Search Bar and My Books */}
          <div className="flex items-center space-x-4">
            {/* My Books Button */}
            <button
              onClick={handleMyBooks}
              className="hidden md:flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
            >
              <span className="text-lg">📚</span>
              <span>My Books</span>
            </button>

            {/* Search Bar */}
            <SearchBar
              placeholder="Search by title or ISBN..."
              onSearch={handleSearch}
              className="hidden md:block"
            />
          </div>

          {/* Right - Profile Dropdown */}
          <div className="flex items-center">
            {userData && userData.username ? (
              <ProfileDropdown
                user={{
                  username: userData.username,
                  email: userData.email || undefined,
                  avatar: userData.avatar || undefined,
                }}
                onNavigate={handleProfileNavigate}
                onLogout={handleLogout}
              />
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden py-3 border-t border-gray-100">
          <SearchBar
            placeholder="Search books..."
            onSearch={handleSearch}
          />
        </div>
      </div>
    </header>
  );
}

export default HeaderV2;
