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
 * Want to Read Page
 * Shows all books the user wants to read
 */
export default function WantToReadPage() {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  const { user: currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const { notification, showError, hideNotification } = useNotification();
  
  const [books, setBooks] = useState<UserBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'title' | 'author'>('recent');

  const isOwnProfile = currentUser?.username === username;

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    
    try {
      const data = await userBookService.getUserBooks();
      const wantToRead = data.filter(b => b.status === ReadingStatus.WANT_TO_READ);
      setBooks(wantToRead);
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
      case 'author':
        return sorted.sort((a, b) => a.author.localeCompare(b.author));
      case 'recent':
      default:
        return sorted.sort((a, b) => 
          new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        );
    }
  };

  const sortedBooks = getSortedBooks();

  if (authLoading || loading) {
    return <LoadingSkeleton variant="page" message="Loading your reading list..." />;
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
                📖 Want to Read
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {sortedBooks.length} {sortedBooks.length === 1 ? 'book' : 'books'} on your reading list
              </p>
            </div>
            
            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'title' | 'author')}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                <option value="recent">Recently Added</option>
                <option value="title">Title (A-Z)</option>
                <option value="author">Author (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {sortedBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {sortedBooks.map((book) => (
              <div
                key={book.id}
                className="group cursor-pointer"
                onClick={() => router.push(`/search/${book.bookId}`)}
              >
                {/* Book Cover */}
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow bg-gray-100 dark:bg-gray-700 mb-3">
                  {book.coverImage ? (
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl">📖</span>
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                    {book.author}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Added {new Date(book.addedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg">
            <span className="text-6xl mb-4 block">📖</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No books in your reading list
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Discover great books to add to your list
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
