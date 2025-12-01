'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SearchBarProps } from './search-bar.types';
import searchService, { ExternalBook } from '@/services/searchService';

/**
 * Shared SearchBar Component
 * Expandable search input with dual search modes (title/ISBN)
 * Now includes dropdown preview of search results
 * 
 * @example
 * <SearchBar
 *   placeholder="Search books..."
 *   onSearch={(query, type) => handleSearch(query, type)}
 *   showDropdown={true}
 * />
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search books...',
  onSearch,
  className = '',
  autoFocus = false,
  showDropdown = true,
  onViewAllResults,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'title' | 'isbn'>('title');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ExternalBook[]>([]);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isExpanded && !searchQuery) {
          setIsExpanded(false);
        }
        setShowResults(false);
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

  // Cleanup search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Perform search with debounce
  useEffect(() => {
    if (!showDropdown || !searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchService.quickSearch(searchQuery.trim(), searchType);
        setSearchResults(results);
        setShowResults(results.length > 0);
      } catch (error) {
        console.error('Quick search error:', error);
        setSearchResults([]);
        setShowResults(false);
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, searchType, showDropdown]);

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(false);
      onSearch(searchQuery.trim(), searchType);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleBookClick = (book: ExternalBook) => {
    setSearchQuery(book.title);
    setShowResults(false);
    onSearch(book.title, 'title');
  };

  const handleViewAll = () => {
    setShowResults(false);
    if (onViewAllResults) {
      onViewAllResults();
    } else {
      onSearch(searchQuery.trim(), searchType);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative transition-all duration-300 ${className}`}
    >
      <form onSubmit={handleSearch} className="relative">
        <div
          className={`flex items-center bg-gray-100 dark:bg-gray-700 rounded-full transition-all duration-300 ${
            isExpanded ? 'w-64 md:w-96' : 'w-10'
          }`}
        >
          {/* Search Icon Button */}
          <button
            type={isExpanded ? 'submit' : 'button'}
            onClick={!isExpanded ? handleExpand : undefined}
            className="shrink-0 w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Search"
          >
            {isSearching ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
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
            )}
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
                className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 px-2 py-2"
              />

              {/* Clear Button */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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
        {isExpanded && !showResults && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 z-10 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Search by:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSearchType('title')}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    searchType === 'title'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
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
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  ISBN
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Results Dropdown */}
        {isExpanded && showDropdown && showResults && searchResults.length > 0 && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 max-h-96 overflow-y-auto">
            {/* Results List */}
            <div className="py-2">
              {searchResults.map((book) => (
                <button
                  key={book.id}
                  type="button"
                  onClick={() => handleBookClick(book)}
                  className="w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-start gap-3 text-left"
                >
                  {/* Book Cover */}
                  <div className="shrink-0 w-12 h-16 bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded overflow-hidden">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        📚
                      </div>
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white truncate">
                      {book.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {book.author}
                    </p>
                    {book.publishedYear && (
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {book.publishedYear}
                      </p>
                    )}
                  </div>

                  {/* Arrow Icon */}
                  <svg
                    className="shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ))}
            </div>

            {/* View All Results Button */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-2">
              <button
                type="button"
                onClick={handleViewAll}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
              >
                View All Results →
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
