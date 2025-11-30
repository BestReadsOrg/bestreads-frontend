'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeaderV2 } from '@/packages/shared/components/headerv2';
import { Container } from '@/packages/shared/components/layout';
import { LoadingSkeleton } from '@/packages/shared/components/loading/loading.component';
import useAuth from '@/hooks/useAuth';
import userBookService, { UserBook, ReadingStatus } from '@/services/userBookService';

export default function MyBooksPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  const [books, setBooks] = useState<UserBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<ReadingStatus | 'ALL'>('ALL');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      fetchBooks();
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchBooks = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await userBookService.getUserBooks();
      setBooks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to remove this book from your collection?')) {
      return;
    }

    try {
      await userBookService.removeBookFromCollection(bookId);
      setBooks(books.filter(b => b.id !== bookId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to remove book');
    }
  };

  const filteredBooks = filterStatus === 'ALL' 
    ? books 
    : books.filter(b => b.status === filterStatus);

  if (authLoading || (loading && isAuthenticated)) {
    return <LoadingSkeleton variant="page" message="Loading your books..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderV2
        title="BestReads"
        userData={{
          userId: user?.id || null,
          username: user?.username || null,
          email: user?.email || null,
          role: 'user',
          avatar: null,
        }}
      />

      <Container className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Books
          </h1>
          <p className="text-gray-600">
            Manage your personal reading collection
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              filterStatus === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All ({books.length})
          </button>
          <button
            onClick={() => setFilterStatus(ReadingStatus.WANT_TO_READ)}
            className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
              filterStatus === ReadingStatus.WANT_TO_READ
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Want to Read ({books.filter(b => b.status === ReadingStatus.WANT_TO_READ).length})
          </button>
          <button
            onClick={() => setFilterStatus(ReadingStatus.CURRENTLY_READING)}
            className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
              filterStatus === ReadingStatus.CURRENTLY_READING
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Reading ({books.filter(b => b.status === ReadingStatus.CURRENTLY_READING).length})
          </button>
          <button
            onClick={() => setFilterStatus(ReadingStatus.COMPLETED)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              filterStatus === ReadingStatus.COMPLETED
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Completed ({books.filter(b => b.status === ReadingStatus.COMPLETED).length})
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48 bg-linear-to-br from-blue-100 to-purple-100">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl">📚</span>
                    </div>
                  )}
                  {book.favorite && (
                    <div className="absolute top-2 right-2 bg-yellow-400 rounded-full p-2">
                      ⭐
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    by {book.author}
                  </p>

                  {book.userRating && (
                    <div className="flex items-center mb-3">
                      <span className="text-sm text-gray-700">
                        Your rating: {'⭐'.repeat(Math.round(book.userRating))}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => handleRemoveBook(book.id)}
                    className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {filterStatus === 'ALL' ? 'No books yet' : `No ${filterStatus.toLowerCase().replace(/_/g, ' ')} books`}
            </h2>
            <p className="text-gray-600 mb-6">
              Start building your library by searching for books
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
    </div>
  );
}
