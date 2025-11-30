'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SearchBarProps } from './search-bar.types';

/**
 * Shared SearchBar Component
 * Expandable search input with dual search modes (title/ISBN)
 * 
 * @example
 * <SearchBar
 *   placeholder="Search books..."
 *   onSearch={(query, type) => handleSearch(query, type)}
 * />
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search books...',
  onSearch,
  className = '',
  autoFocus = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'title' | 'isbn'>('title');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isExpanded && !searchQuery) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded, searchQuery]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim(), searchType);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClear = () => {
    setSearchQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative transition-all duration-300 ${className}`}
    >
      <form onSubmit={handleSearch} className="relative">
        <div
          className={`flex items-center bg-gray-100 rounded-full transition-all duration-300 ${
            isExpanded ? 'w-64 md:w-96' : 'w-10'
          }`}
        >
          {/* Search Icon Button */}
          <button
            type={isExpanded ? 'submit' : 'button'}
            onClick={!isExpanded ? handleExpand : undefined}
            className="shrink-0 w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Search"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* Input Field (visible when expanded) */}
          {isExpanded && (
            <>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder={placeholder}
                autoFocus={autoFocus}
                className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500 px-2 py-2"
              />

              {/* Clear Button */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear search"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>

        {/* Search Type Toggle (visible when expanded) */}
        {isExpanded && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-lg shadow-lg p-2 z-10">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">Search by:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSearchType('title')}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    searchType === 'title'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Title
                </button>
                <button
                  type="button"
                  onClick={() => setSearchType('isbn')}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    searchType === 'isbn'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ISBN
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
