'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Container } from '@/packages/shared/components/layout';
import { LoadingSkeleton } from '@/packages/shared/components/loading/loading.component';
import { HeaderV2 } from '@/packages/shared/components/headerv2';
import { Notification } from '@/packages/shared/components/notification';
import { BookShelf } from '@/packages/shared/components/book-shelf';
import { ActivityFeed } from '@/packages/shared/components/activity-feed';
import type { Activity } from '@/packages/shared/components/activity-feed';
import useAuth from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';
import userBookService, { UserBook, ReadingStatus } from '@/services/userBookService';

export default function DashboardPage() {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { notification, hideNotification } = useNotification();
  
  const [books, setBooks] = useState<UserBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchBooks = async () => {
      try {
        const data = await userBookService.getUserBooks();
        setBooks(data);
      } catch (err) {
        console.error('Failed to load books:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchBooks();
    }
  }, [isAuthenticated, authLoading, router]);

  // Filter books by status
  const currentlyReading = books.filter(b => b.status === ReadingStatus.CURRENTLY_READING);
  const wantToRead = books.filter(b => b.status === ReadingStatus.WANT_TO_READ);
  const recentlyRead = books
    .filter(b => b.status === ReadingStatus.COMPLETED)
    .sort((a, b) => new Date(b.completedAt || b.addedAt).getTime() - new Date(a.completedAt || a.addedAt).getTime());

  // Mock activity data (replace with real API later)
  const mockActivities: Activity[] = [
    {
      id: '1',
      userId: user?.id || '',
      username: user?.username || 'User',
      type: 'book_completed',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      book: currentlyReading[0] ? {
        id: currentlyReading[0].bookId,
        title: currentlyReading[0].title,
        author: currentlyReading[0].author,
        coverImage: currentlyReading[0].coverImage,
      } : undefined,
    },
  ];

  // Reading stats
  const stats = {
    totalBooks: books.length,
    currentlyReading: currentlyReading.length,
    completed: recentlyRead.length,
    readingGoal: 12,
    completedThisYear: recentlyRead.filter(b => {
      if (!b.completedAt) return false;
      return new Date(b.completedAt).getFullYear() === new Date().getFullYear();
    }).length,
  };

  const goalPercentage = Math.min((stats.completedThisYear / stats.readingGoal) * 100, 100);

  if (authLoading || (loading && isAuthenticated)) {
    return <LoadingSkeleton variant="page" message="Loading your dashboard..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.username || 'Reader'}! 📚
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here&apos;s what&apos;s happening in your reading journey
          </p>
        </div>

        {/* Reading Goal Progress */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {new Date().getFullYear()} Reading Challenge
              </h2>
              <p className="text-blue-100">
                {stats.completedThisYear} of {stats.readingGoal} books completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{Math.round(goalPercentage)}%</div>
              <p className="text-sm text-blue-100">Complete</p>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${goalPercentage}%` }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Currently Reading</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.currentlyReading}
                </p>
              </div>
              <div className="text-4xl">📚</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Want to Read</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {wantToRead.length}
                </p>
              </div>
              <div className="text-4xl">📖</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Books Read</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.completed}
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
        </div>

        {/* Currently Reading Section */}
        {currentlyReading.length > 0 && (
          <div className="mb-8">
            <BookShelf
              title="Currently Reading"
              books={currentlyReading.map(book => ({
                id: book.id,
                bookId: book.bookId,
                title: book.title,
                author: book.author,
                coverImage: book.coverImage,
                userRating: book.userRating,
                progress: book.totalPages ? {
                  current: book.currentPage || 0,
                  total: book.totalPages,
                } : undefined,
              }))}
              viewMoreLink={`/${username}/currently-reading`}
              maxVisible={6}
              onBookClick={(bookId) => router.push(`/search/${bookId}`)}
            />
          </div>
        )}

        {/* Want to Read Section */}
        {wantToRead.length > 0 && (
          <div className="mb-8">
            <BookShelf
              title="Want to Read"
              books={wantToRead.slice(0, 12).map(book => ({
                id: book.id,
                bookId: book.bookId,
                title: book.title,
                author: book.author,
                coverImage: book.coverImage,
                userRating: book.userRating,
              }))}
              viewMoreLink={`/${username}/want-to-read`}
              maxVisible={6}
              onBookClick={(bookId) => router.push(`/search/${bookId}`)}
            />
          </div>
        )}

        {/* Recently Read Section */}
        {recentlyRead.length > 0 && (
          <div className="mb-8">
            <BookShelf
              title="Recently Read"
              books={recentlyRead.slice(0, 12).map(book => ({
                id: book.id,
                bookId: book.bookId,
                title: book.title,
                author: book.author,
                coverImage: book.coverImage,
                userRating: book.userRating,
              }))}
              viewMoreLink={`/${username}/recently-read`}
              maxVisible={6}
              onBookClick={(bookId) => router.push(`/search/${bookId}`)}
            />
          </div>
        )}

        {/* Two Column Layout for Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h2>
            <ActivityFeed
              activities={mockActivities.slice(0, 5)}
              emptyMessage="No recent activity. Start reading to see your progress here!"
            />
          </div>

          {/* Friends Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Friends Activity
            </h2>
            <ActivityFeed
              activities={[]}
              emptyMessage="Connect with friends to see their reading activity!"
            />
          </div>
        </div>

        {/* Empty State if no books */}
        {books.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Start Your Reading Journey
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Discover amazing books, track your reading progress, and connect with fellow readers.
            </p>
            <button
              onClick={() => router.push('/search')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              Find Your First Book
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
