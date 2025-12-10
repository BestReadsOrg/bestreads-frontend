'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { HeaderV2 } from '@/packages/shared/components/headerv2';
import { Container } from '@/packages/shared/components/layout';
import { LoadingSkeleton } from '@/packages/shared/components/loading/loading.component';
import { Notification } from '@/packages/shared/components/notification';
import useAuth from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';
import userBookService, { UserBook, ReadingStatus } from '@/services/userBookService';
import Image from 'next/image';

export default function RecentlyReadPage() {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  const { user: currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const { notification, showError, hideNotification } = useNotification();
  
  const [books, setBooks] = useState<UserBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'title'>('recent');
  const [filterYear, setFilterYear] = useState<string>('all');

  const isOwnProfile = currentUser?.username === username;

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    
    try {
      const data = await userBookService.getUserBooks();
      const completed = data.filter(b => b.status === ReadingStatus.COMPLETED);
      setBooks(completed);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to load books', 'Error');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      fetchBooks();
    }
  }, [isAuthenticated, authLoading, router, fetchBooks]);

  const getFilteredAndSortedBooks = () => {
    let filtered = [...books];
    
    // Filter by year
    if (filterYear !== 'all') {
      filtered = filtered.filter(book => {
        if (!book.completedAt) return false;
        const year = new Date(book.completedAt).getFullYear().toString();
        return year === filterYear;
      });
    }
    
    // Sort
    switch (sortBy) {
      case 'title':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      case 'rating':
        return filtered.sort((a, b) => (b.userRating || 0) - (a.userRating || 0));
      case 'recent':
      default:
        return filtered.sort((a, b) => {
          const dateA = new Date(b.completedAt || b.addedAt).getTime();
          const dateB = new Date(a.completedAt || a.addedAt).getTime();
          return dateA - dateB;
        });
    }
  };

  const getAvailableYears = () => {
    const years = new Set<string>();
    books.forEach(book => {
      if (book.completedAt) {
        years.add(new Date(book.completedAt).getFullYear().toString());
      }
    });
    return Array.from(years).sort().reverse();
  };

  const sortedBooks = getFilteredAndSortedBooks();
  const years = getAvailableYears();
  const currentYear = new Date().getFullYear();
  const booksThisYear = books.filter(b => {
    if (!b.completedAt) return false;
    return new Date(b.completedAt).getFullYear() === currentYear;
  }).length;

  if (authLoading || loading) {
    return <LoadingSkeleton variant="page" message="Loading your reading history..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeaderV2
        title="BestReads"
        userData={{
          userId: currentUser?.id || null,
          username: currentUser?.username || null,
          email: currentUser?.email || null,
          avatar: null,
          role: 'user',
        }}
      />

      <Container className="py-8">
        {/* Header with Stats */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            ✅ Read
          </h1>
          
          {/* Reading Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">Total Read</p>
              <p className="text-3xl font-bold">{books.length}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">{currentYear} Reading Goal</p>
              <p className="text-3xl font-bold">{booksThisYear}/12</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">Average Rating</p>
              <p className="text-3xl font-bold">
                {books.filter(b => b.userRating).length > 0
                  ? (books.reduce((sum, b) => sum + (b.userRating || 0), 0) / 
                     books.filter(b => b.userRating).length).toFixed(1)
                  : '-'}
              </p>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'rating' | 'title')}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Recently Finished</option>
                <option value="rating">Highest Rated</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
            
            {years.length > 0 && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">Year:</label>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            )}
            
            <p className="text-sm text-gray-600 dark:text-gray-400 ml-auto">
              Showing {sortedBooks.length} {sortedBooks.length === 1 ? 'book' : 'books'}
            </p>
          </div>
        </div>

        {/* Books Grid */}
        {sortedBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-4 p-4">
                  {/* Book Cover */}
                  <div
                    onClick={() => router.push(`/search/${book.bookId}`)}
                    className="shrink-0 cursor-pointer"
                  >
                    <div className="w-28 h-40 rounded overflow-hidden relative shadow-sm bg-gray-100 dark:bg-gray-700">
                      {book.coverImage ? (
                        <Image
                          src={book.coverImage}
                          alt={book.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl">📖</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Book Info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      onClick={() => router.push(`/search/${book.bookId}`)}
                      className="font-semibold text-lg text-gray-900 dark:text-white mb-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2"
                    >
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      by {book.author}
                    </p>

                    {/* User Rating */}
                    {book.userRating && (
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${
                              i < book.userRating!
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                        ))}
                      </div>
                    )}

                    {/* Review Preview */}
                    {book.userReview && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 italic mb-2">
                        {book.userReview}
                      </p>
                    )}

                    {/* Completed Date */}
                    {book.completedAt && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Finished {new Date(book.completedAt).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg">
            <span className="text-6xl mb-4 block">✅</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {filterYear !== 'all' ? `No books finished in ${filterYear}` : 'No books finished yet'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Mark books as read to see them here
            </p>
            <button
              onClick={() => router.push('/search')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Find Books
            </button>
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
        actions={notification.actions}
      />
    </div>
  );
}
