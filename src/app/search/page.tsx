'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { HeaderV2 } from '@/packages/shared/components/headerv2';
import { Container } from '@/packages/shared/components/layout';
import { LoadingSkeleton } from '@/packages/shared/components/loading/loading.component';
import useAuth from '@/hooks/useAuth';
import searchService, { ExternalBook } from '@/services/searchService';
import userBookService, { ReadingStatus } from '@/services/userBookService';

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  
  const [books, setBooks] = useState<ExternalBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const query = searchParams.get('q') || '';
  const type = (searchParams.get('type') as 'title' | 'isbn') || 'title';

  useEffect(() => {
    if (!query) return;
    
    const performSearch = async () => {
    setLoading(true);
    setError('');
    
    try {
      const results = await searchService.searchBooks(query, type);
      setBooks(results);
      
      if (results.length === 0) {
        setError('No books found. Try a different search term.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search books');
    } finally {
      setLoading(false);
    }
    };
    
    performSearch();
  }, [query, type]);

  const handleAddToCollection = async (book: ExternalBook) => {
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
        status: ReadingStatus.WANT_TO_READ,
        totalPages: book.pages,
        favorite: false,
      });

      alert(`"${book.title}" added to your collection!`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add book');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results
          </h1>
          {query && (
            <p className="text-gray-600">
              Showing results for <span className="font-semibold">&ldquo;{query}&rdquo;</span> by {type}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <LoadingSkeleton variant="section" message="Searching books..." />
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-yellow-700">{error}</p>
          </div>
        )}

        {/* Results Grid */}
        {!loading && !error && books.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Book Cover */}
                <div className="relative h-64 bg-linear-to-br from-blue-100 to-purple-100">
                  {book.coverImage ? (
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
                </div>

                {/* Book Details */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    by {book.author}
                  </p>
                  
                  {book.publishedYear && (
                    <p className="text-xs text-gray-500 mb-3">
                      Published: {book.publishedYear}
                    </p>
                  )}

                  {book.rating && (
                    <div className="flex items-center mb-3">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm text-gray-700 ml-1">
                        {book.rating.toFixed(1)}
                      </span>
                      {book.ratingCount && (
                        <span className="text-xs text-gray-500 ml-1">
                          ({book.ratingCount})
                        </span>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => handleAddToCollection(book)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Add to Collection
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !query && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Start Searching
            </h2>
            <p className="text-gray-600">
              Use the search bar above to find books by title or ISBN
            </p>
          </div>
        )}
      </Container>
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
