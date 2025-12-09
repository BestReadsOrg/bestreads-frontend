'use client';

import React, { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { HeaderV2 } from '@/packages/shared/components/headerv2';
import { Container } from '@/packages/shared/components/layout';
import { LoadingSkeleton } from '@/packages/shared/components/loading/loading.component';
import { Notification } from '@/packages/shared/components/notification';
import useAuth from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';
import searchService, { ExternalBook, PaginatedSearchResult } from '@/services/searchService';
import userBookService, { ReadingStatus } from '@/services/userBookService';

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { notification, showSuccess, showError, hideNotification } = useNotification();
  
  const [searchResult, setSearchResult] = useState<PaginatedSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const query = searchParams.get('q') || '';
  const type = (searchParams.get('type') as 'title' | 'isbn') || 'title';
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query) {
      setSearchResult(null);
      return;
    }
    
    const performSearch = async () => {
      setLoading(true);
      setError('');
      
      try {
        const results = await searchService.searchBooks(query, type, currentPage, 20);
        setSearchResult(results);
        
        if (results.books.length === 0) {
          setError('No books found. Try a different search term.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search books');
        setSearchResult(null);
      } finally {
        setLoading(false);
      }
    };
    
    performSearch();
  }, [query, type, currentPage]);

  const handleAddToCollection = async (book: ExternalBook, status: ReadingStatus) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      await userBookService.addBookToCollection({
        bookId: book.id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        coverImage: book.coverImage,
        status,
        totalPages: book.pages,
        favorite: false,
      });

      setOpenDropdown(null);
      
      const statusLabels = {
        [ReadingStatus.WANT_TO_READ]: 'Want to Read',
        [ReadingStatus.CURRENTLY_READING]: 'Currently Reading',
        [ReadingStatus.COMPLETED]: 'Completed',
        [ReadingStatus.DID_NOT_FINISH]: 'Did Not Finish',
      };

      showSuccess(`"${book.title}" added to ${statusLabels[status]}!`, 'Book Added');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to add book', 'Error');
    }
  };

  const toggleDropdown = (bookId: string) => {
    setOpenDropdown(openDropdown === bookId ? null : bookId);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams({
      q: query,
      type,
      page: newPage.toString(),
    });
    router.push(`/search?${params.toString()}`);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = searchResult ? Math.ceil(searchResult.total / searchResult.limit) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeaderV2
        title="BestReads"
        userData={isAuthenticated ? {
          userId: user?.id || null,
          username: user?.username || null,
          email: user?.email || null,
          role: 'user',
          avatar: null,
        } : undefined}
      />

      <Container className="py-8">
        {/* Search Results Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Search Results
          </h1>
          {query && searchResult && (
            <p className="text-gray-600 dark:text-gray-400">
              Found <span className="font-semibold">{searchResult.total}</span> results for{' '}
              <span className="font-semibold">&ldquo;{query}&rdquo;</span> by {type}
              {searchResult.total > 0 && (
                <span className="ml-2 text-sm">
                  (Page {currentPage} of {totalPages})
                </span>
              )}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <LoadingSkeleton variant="section" message="Searching books..." />
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-yellow-700 dark:text-yellow-400">{error}</p>
          </div>
        )}

        {/* Results Grid */}
        {!loading && !error && searchResult && searchResult.books.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResult.books.map((book) => (
                <div
                  key={book.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
                >
                  {/* Book Cover - Clickable */}
                  <button
                    onClick={() => router.push(`/search/${book.id}`)}
                    className="w-full relative h-64 bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 hover:opacity-90 transition-opacity shrink-0"
                  >
                    {book.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl">📚</span>
                      </div>
                    )}
                  </button>

                  {/* Book Details */}
                  <div className="p-4 flex flex-col grow">
                    <button
                      onClick={() => router.push(`/search/${book.id}`)}
                      className="w-full text-left mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 mb-1">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        by {book.author}
                      </p>
                    </button>
                    
                    <div className="grow">
                      {book.publishedYear && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                          Published: {book.publishedYear}
                        </p>
                      )}

                      {book.rating && (
                        <div className="flex items-center mb-2">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-sm text-gray-700 dark:text-gray-300 ml-1">
                            {book.rating.toFixed(1)}
                          </span>
                          {book.ratingCount && (
                            <span className="text-xs text-gray-500 dark:text-gray-500 ml-1">
                              ({book.ratingCount.toLocaleString()})
                            </span>
                          )}
                        </div>
                      )}

                      {book.editionCount && book.editionCount > 1 && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                          {book.editionCount} editions
                        </p>
                      )}
                    </div>

                    {/* Add to Collection Dropdown */}
                    <div className="relative mt-3" ref={openDropdown === book.id ? dropdownRef : null}>
                      <button
                        onClick={() => toggleDropdown(book.id)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <span>Add to Collection</span>
                        <svg
                          className={`w-4 h-4 transition-transform ${openDropdown === book.id ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      {openDropdown === book.id && (
                        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-10 overflow-hidden">
                          <button
                            onClick={() => handleAddToCollection(book, ReadingStatus.WANT_TO_READ)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 text-gray-900 dark:text-white"
                          >
                            <span className="text-lg">📖</span>
                            <span className="font-medium">Want to Read</span>
                          </button>
                          <button
                            onClick={() => handleAddToCollection(book, ReadingStatus.CURRENTLY_READING)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-600"
                          >
                            <span className="text-lg">📚</span>
                            <span className="font-medium">Currently Reading</span>
                          </button>
                          <button
                            onClick={() => handleAddToCollection(book, ReadingStatus.COMPLETED)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-600"
                          >
                            <span className="text-lg">✅</span>
                            <span className="font-medium">Completed</span>
                          </button>
                          <button
                            onClick={() => handleAddToCollection(book, ReadingStatus.DID_NOT_FINISH)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-600"
                          >
                            <span className="text-lg">❌</span>
                            <span className="font-medium">Did Not Finish</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous
                </button>

                {/* Page Numbers */}
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg transition-colors ${
                          pageNum === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!searchResult.hasMore}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !query && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Start Searching
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Use the search bar above to find books by title or ISBN
            </p>
          </div>
        )}
      </Container>
      
      <Notification
        isOpen={notification.isOpen}
        title={notification.title}
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
        duration={notification.duration}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSkeleton variant="page" message="Loading search..." />}>
      <SearchPageContent />
    </Suspense>
  );
}
