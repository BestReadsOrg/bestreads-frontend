'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/packages/shared/components/layout';
import { Button } from '@/packages/shared/components/button';
import { LoadingSkeleton } from '@/packages/shared/components/loading/loading.component';
import { ErrorDisplay } from '@/packages/shared/components/error/error.component';
import { StatCard } from '@/packages/shared/components/stat-card';
import { BookCard } from '@/packages/shared/components/book-card';
import { HeaderV2 } from '@/packages/shared/components/headerv2';
import { Notification } from '@/packages/shared/components/notification';
import useAuth from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';
import bookService, { Book } from '@/services/bookService';
import dashboardConfig from './dashboard.configuration.json';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { notification, showInfo, hideNotification } = useNotification();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get username for routing
  const username = user?.username || 'user';

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

  // Determine if user is new (no books)
  const isNewUser = books.length === 0;
  const welcomeTitle = isNewUser
    ? dashboardConfig.welcome.titleNew.replace('{username}', user?.username || 'Reader')
    : dashboardConfig.welcome.titleTemplate.replace('{username}', user?.username || 'Reader');
  const welcomeSubtitle = isNewUser
    ? dashboardConfig.welcome.subtitleNew
    : dashboardConfig.welcome.subtitle;

  // Calculate stats
  const stats = {
    totalBooks: books.length,
    currentlyReading: 0, // TODO: Calculate from API (can implement later)
    completed: 0, // TODO: Calculate from API (can implement later)
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {welcomeTitle}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{welcomeSubtitle}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {dashboardConfig.stats.map((stat) => (
            <StatCard
              key={stat.id}
              label={stat.label}
              value={stats[stat.dataKey as keyof typeof stats]}
              icon={stat.icon}
              color={stat.color as 'blue' | 'green' | 'purple'}
            />
          ))}
        </div>

        {/* Books Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {dashboardConfig.booksSection.title}
            </h2>
            <Button
              label="Add Book"
              action="add-book"
              variant="primary"
              size="md"
              icon="+"
              onClick={() => router.push(`/${username}/search`)}
            />
          </div>

          {/* Error Display */}
          {error && (
            <ErrorDisplay 
              error={error} 
              variant="inline"
              onRetry={() => window.location.reload()}
            />
          )}

          {books.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">
                {dashboardConfig.booksSection.emptyState.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {dashboardConfig.booksSection.emptyState.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {dashboardConfig.booksSection.emptyState.description}
              </p>
              <Button
                label={dashboardConfig.booksSection.emptyState.actionLabel}
                action="search-books"
                variant="primary"
                size="lg"
                icon={dashboardConfig.booksSection.emptyState.actionIcon}
                onClick={() => router.push(`/${username}/search`)}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  id={book.id}
                  title={book.title}
                  author={book.author}
                  genres={book.genres}
                  variant="compact"
                  onClick={(id) => router.push(`/${username}/books/${id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {dashboardConfig.quickActions.map((action) => (
            <div
              key={action.id}
              className={`bg-linear-to-br ${action.gradient} dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600`}
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {action.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{action.description}</p>
              <Button
                label={action.buttonLabel}
                action={action.action}
                variant="primary"
                size="md"
                onClick={() =>
                  showInfo(
                    action.action === 'view-analytics'
                      ? 'Analytics feature coming soon!'
                      : 'Goals feature coming soon!',
                    'Coming Soon'
                  )
                }
              />
            </div>
          ))}
        </div>
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
