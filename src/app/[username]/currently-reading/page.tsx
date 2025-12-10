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

/**
 * Currently Reading Page
 * Shows all books the user is currently reading with progress tracking
 */
export default function CurrentlyReadingPage() {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  const { user: currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const { notification, showError, showSuccess, hideNotification } = useNotification();
  
  const [books, setBooks] = useState<UserBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'title' | 'progress'>('recent');

  const isOwnProfile = currentUser?.username === username;

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    
    try {
      const data = await userBookService.getUserBooks();
      const currentlyReading = data.filter(b => b.status === ReadingStatus.CURRENTLY_READING);
      setBooks(currentlyReading);
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

  const getSortedBooks = () => {
    const sorted = [...books];
    switch (sortBy) {
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'progress':
        return sorted.sort((a, b) => {
          const progressA = (a.currentPage || 0) / (a.totalPages || 1);
          const progressB = (b.currentPage || 0) / (b.totalPages || 1);
          return progressB - progressA;
        });
      case 'recent':
      default:
        return sorted.sort((a, b) => 
          new Date(b.startedAt || b.addedAt).getTime() - new Date(a.startedAt || a.addedAt).getTime()
        );
    }
  };

  const sortedBooks = getSortedBooks();

  if (authLoading || loading) {
    return <LoadingSkeleton variant="page" message="Loading currently reading books..." />;
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                📚 Currently Reading
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {sortedBooks.length} {sortedBooks.length === 1 ? 'book' : 'books'} in progress
              </p>
            </div>
            
            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                <option value="recent">Most Recent</option>
                <option value="title">Title (A-Z)</option>
                <option value="progress">Progress</option>
              </select>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {sortedBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedBooks.map((book) => {
              const progress = book.totalPages 
                ? Math.round(((book.currentPage || 0) / book.totalPages) * 100)
                : 0;

              return (
                <div
                  key={book.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4 p-4">
                    {/* Book Cover */}
                    <div
                      onClick={() => router.push(`/search/${book.bookId}`)}
                      className="flex-shrink-0 cursor-pointer"
                    >
                      <div className="w-24 h-36 rounded overflow-hidden relative shadow-sm bg-gray-100 dark:bg-gray-700">
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
                        className="font-semibold text-gray-900 dark:text-white mb-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2"
                      >
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        by {book.author}
                      </p>

                      {/* Progress Bar */}
                      {book.totalPages && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {book.currentPage || 0} of {book.totalPages} pages
                            </span>
                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                              {progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Started Date */}
                      {book.startedAt && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Started {new Date(book.startedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isOwnProfile && (
                    <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex gap-2">
                      <button
                        onClick={() => router.push(`/search/${book.bookId}`)}
                        className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Update Progress
                      </button>
                      <button
                        onClick={() => router.push(`/${username}/lists`)}
                        className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                      >
                        Manage
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg">
            <span className="text-6xl mb-4 block">📚</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No books currently reading
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start reading a book to see it here
            </p>
            <button
              onClick={() => router.push('/search')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Find Books to Read
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
