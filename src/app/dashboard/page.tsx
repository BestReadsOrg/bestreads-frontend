'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/packages/shared/components/layout';
import { Button } from '@/packages/shared/components/button';
import { LoadingSkeleton } from '@/packages/shared/components/loading/loading.component';
import { HeaderV2 } from '@/packages/shared/components/headerv2';
import useAuth from '@/hooks/useAuth';
import bookService, { Book } from '@/services/bookService';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // Fetch user's books
    const fetchBooks = async () => {
      try {
        const data = await bookService.getAllBooks(0, 10);
        setBooks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load books');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchBooks();
    }
  }, [isAuthenticated, authLoading, router]);

  // Show loading state
  if (authLoading || (loading && isAuthenticated)) {
    return <LoadingSkeleton variant="page" message="Loading your dashboard..." />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Search and Profile */}
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

      {/* Main Content */}
      <Container className="py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username || 'Reader'}! 📚
          </h1>
          <p className="text-gray-600">
            Here's your reading dashboard and progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Books</p>
                <p className="text-3xl font-bold text-gray-900">{books.length}</p>
              </div>
              <div className="text-4xl">📚</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Currently Reading</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="text-4xl">📖</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Books Completed</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
        </div>

        {/* Books Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Your Books</h2>
            <Button
              label="Add Book"
              action="add-book"
              variant="primary"
              size="md"
              icon="+"
              onClick={() => router.push('/search')}
            />
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {books.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No books yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start building your reading library by adding your first book!
              </p>
              <Button
                label="Search for Books"
                action="search-books"
                variant="primary"
                size="lg"
                icon="🔍"
                onClick={() => router.push('/search')}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-20 bg-linear-to-br from-blue-400 to-purple-500 rounded flex items-center justify-center text-white font-bold text-2xl shrink-0">
                      {book.title.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {book.author}
                      </p>
                      {book.genres && book.genres.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {book.genres.slice(0, 2).map((genre, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              📊 Reading Analytics
            </h3>
            <p className="text-gray-700 mb-4">
              Track your reading habits and progress over time
            </p>
            <Button
              label="View Analytics"
              action="view-analytics"
              variant="primary"
              size="md"
              onClick={() => alert('Analytics feature coming soon!')}
            />
          </div>

          <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              🎯 Set Reading Goals
            </h3>
            <p className="text-gray-700 mb-4">
              Challenge yourself with personalized reading goals
            </p>
            <Button
              label="Create Goal"
              action="create-goal"
              variant="primary"
              size="md"
              onClick={() => alert('Goals feature coming soon!')}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
