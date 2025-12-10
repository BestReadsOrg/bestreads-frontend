'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { HeaderV2 } from '@/packages/shared/components/headerv2';
import { Container } from '@/packages/shared/components/layout';
import { LoadingSkeleton } from '@/packages/shared/components/loading/loading.component';
import { Notification } from '@/packages/shared/components/notification';
import useAuth from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';
import userBookService, { UserBook, ReadingStatus } from '@/services/userBookService';

/**
 * My Lists Page
 * 
 * Displays user's book lists with the following structure:
 * - Default mutually exclusive lists: Want to Read, Currently Reading, Read, Did Not Finish
 * - Custom user-created lists (can be mutually exclusive or not)
 * 
 * Books can only be in one mutually exclusive list at a time.
 */
export default function MyListsPage() {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  const { user: currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const { notification, showError, showSuccess, hideNotification } = useNotification();
  
  const [books, setBooks] = useState<UserBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeList, setActiveList] = useState<'want-to-read' | 'currently-reading' | 'read' | 'dnf'>('want-to-read');

  // Check if viewing own profile
  const isOwnProfile = currentUser?.username === username;

  const fetchBooks = React.useCallback(async () => {
    setLoading(true);
    
    try {
      const data = await userBookService.getUserBooks();
      setBooks(data);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to load lists', 'Error');
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
      
      if (isOwnProfile) {
        fetchBooks();
      } else {
        // TODO: Fetch other user's public lists
        fetchBooks();
      }
    }
  }, [isAuthenticated, authLoading, isOwnProfile, router, fetchBooks]);

  const handleRemoveBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to remove this book from your list?')) {
      return;
    }

    try {
      await userBookService.removeBookFromCollection(bookId);
      // Refetch from database instead of updating local state
      await fetchBooks();
      showSuccess('Book removed from your list', 'Success');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to remove book', 'Error');
    }
  };

  const handleChangeStatus = async (bookId: string, newStatus: ReadingStatus) => {
    try {
      const book = books.find(b => b.id === bookId);
      if (!book) return;

      await userBookService.updateUserBook(bookId, {
        ...book,
        status: newStatus,
      });

      // Refetch from database instead of updating local state
      await fetchBooks();
      showSuccess('Book moved to new list', 'Success');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to move book', 'Error');
    }
  };

  const getListBooks = () => {
    switch (activeList) {
      case 'want-to-read':
        return books.filter(b => b.status === ReadingStatus.WANT_TO_READ);
      case 'currently-reading':
        return books.filter(b => b.status === ReadingStatus.CURRENTLY_READING);
      case 'read':
        return books.filter(b => b.status === ReadingStatus.COMPLETED);
      case 'dnf':
        return books.filter(b => b.status === ReadingStatus.DID_NOT_FINISH);
      default:
        return [];
    }
  };

  const getListCount = (listType: 'want-to-read' | 'currently-reading' | 'read' | 'dnf') => {
    switch (listType) {
      case 'want-to-read':
        return books.filter(b => b.status === ReadingStatus.WANT_TO_READ).length;
      case 'currently-reading':
        return books.filter(b => b.status === ReadingStatus.CURRENTLY_READING).length;
      case 'read':
        return books.filter(b => b.status === ReadingStatus.COMPLETED).length;
      case 'dnf':
        return books.filter(b => b.status === ReadingStatus.DID_NOT_FINISH).length;
    }
  };

  const listBooks = getListBooks();

  if (authLoading || loading) {
    return <LoadingSkeleton variant="page" message="Loading your lists..." />;
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isOwnProfile ? 'My Lists' : `${username}'s Lists`}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organize and track your reading journey
          </p>
        </div>

        {/* List Tabs - Default Mutually Exclusive Lists */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex overflow-x-auto gap-4">
            <button
              onClick={() => setActiveList('want-to-read')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeList === 'want-to-read'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className="text-xl">📖</span>
              <span>Want to Read</span>
              <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-sm">
                {getListCount('want-to-read')}
              </span>
            </button>

            <button
              onClick={() => setActiveList('currently-reading')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeList === 'currently-reading'
                  ? 'border-green-600 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className="text-xl">📚</span>
              <span>Currently Reading</span>
              <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-sm">
                {getListCount('currently-reading')}
              </span>
            </button>

            <button
              onClick={() => setActiveList('read')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeList === 'read'
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className="text-xl">✅</span>
              <span>Read</span>
              <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-sm">
                {getListCount('read')}
              </span>
            </button>

            <button
              onClick={() => setActiveList('dnf')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeList === 'dnf'
                  ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className="text-xl">⏸️</span>
              <span>Did Not Finish</span>
              <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-sm">
                {getListCount('dnf')}
              </span>
            </button>
          </div>
        </div>

        {/* Books Grid */}
        {listBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Book Cover */}
                <div
                  onClick={() => router.push(`/search/${book.bookId}`)}
                  className="cursor-pointer relative h-64 bg-gray-100 dark:bg-gray-700"
                >
                  {book.coverImage ? (
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl">📖</span>
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div className="p-4">
                  <h3
                    onClick={() => router.push(`/search/${book.bookId}`)}
                    className="font-semibold text-gray-900 dark:text-white mb-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2"
                  >
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {book.author}
                  </p>

                  {/* User Rating */}
                  {book.userRating && (
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${
                            star <= book.userRating!
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

                  {/* Actions */}
                  {isOwnProfile && (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <select
                          value={book.status}
                          onChange={(e) => handleChangeStatus(book.id, e.target.value as ReadingStatus)}
                          className="w-full px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        >
                          <option value={ReadingStatus.WANT_TO_READ}>Want to Read</option>
                          <option value={ReadingStatus.CURRENTLY_READING}>Currently Reading</option>
                          <option value={ReadingStatus.COMPLETED}>Read</option>
                          <option value={ReadingStatus.DID_NOT_FINISH}>Did Not Finish</option>
                        </select>
                      </div>
                      <button
                        onClick={() => handleRemoveBook(book.id)}
                        className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                        title="Remove from list"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg">
            <span className="text-6xl mb-4 block">📚</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No books in this list yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start adding books to build your reading collection
            </p>
            <button
              onClick={() => router.push('/search')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Search Books
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
