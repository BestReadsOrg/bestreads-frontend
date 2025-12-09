'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { HeaderV2 } from '@/packages/shared/components/headerv2';
import { Container } from '@/packages/shared/components/layout';
import { LoadingSkeleton } from '@/packages/shared/components/loading/loading.component';
import { Notification } from '@/packages/shared/components/notification';
import useAuth from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';
import userService, { UserResponse } from '@/services/userService';
import userBookService, { UserBook, ReadingStatus } from '@/services/userBookService';

interface ReadingStats {
  total: number;
  wantToRead: number;
  currentlyReading: number;
  completed: number;
  didNotFinish: number;
}

interface ReadingGoal {
  year: number;
  target: number;
  completed: number;
  percentage: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  const { user: currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const { notification, showError, hideNotification } = useNotification();

  const [profileUser, setProfileUser] = useState<UserResponse | null>(null);
  const [books, setBooks] = useState<UserBook[]>([]);
  const [stats, setStats] = useState<ReadingStats>({
    total: 0,
    wantToRead: 0,
    currentlyReading: 0,
    completed: 0,
    didNotFinish: 0,
  });
  const [readingGoal, setReadingGoal] = useState<ReadingGoal>({
    year: new Date().getFullYear(),
    target: 12,
    completed: 0,
    percentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'books' | 'stats'>('overview');

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    if (!authLoading) {
      fetchProfileData();
    }
  }, [username, authLoading]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      // Fetch user profile
      const userData = await userService.getUserByUsername(username);
      setProfileUser(userData);

      // Fetch user's books if viewing own profile or public
      if (isOwnProfile) {
        const userBooks = await userBookService.getUserBooks();
        setBooks(userBooks);
        calculateStats(userBooks);
        calculateReadingGoal(userBooks);
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to load profile', 'Error');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (userBooks: UserBook[]) => {
    const newStats: ReadingStats = {
      total: userBooks.length,
      wantToRead: userBooks.filter(b => b.status === ReadingStatus.WANT_TO_READ).length,
      currentlyReading: userBooks.filter(b => b.status === ReadingStatus.CURRENTLY_READING).length,
      completed: userBooks.filter(b => b.status === ReadingStatus.COMPLETED).length,
      didNotFinish: userBooks.filter(b => b.status === ReadingStatus.DID_NOT_FINISH).length,
    };
    setStats(newStats);
  };

  const calculateReadingGoal = (userBooks: UserBook[]) => {
    const currentYear = new Date().getFullYear();
    const completedThisYear = userBooks.filter(b => {
      if (b.status !== ReadingStatus.COMPLETED || !b.completedAt) return false;
      const completedYear = new Date(b.completedAt).getFullYear();
      return completedYear === currentYear;
    }).length;

    const target = 12; // Default goal, should be fetched from user settings
    const percentage = Math.min((completedThisYear / target) * 100, 100);

    setReadingGoal({
      year: currentYear,
      target,
      completed: completedThisYear,
      percentage,
    });
  };

  const getAverageRating = () => {
    const ratedBooks = books.filter(b => b.userRating && b.userRating > 0);
    if (ratedBooks.length === 0) return 0;
    const sum = ratedBooks.reduce((acc, b) => acc + (b.userRating || 0), 0);
    return (sum / ratedBooks.length).toFixed(1);
  };

  const getFavoriteGenres = () => {
    // This would ideally come from book metadata
    return ['Fiction', 'Mystery', 'Science Fiction'];
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <HeaderV2
          title="BestReads"
          userData={isAuthenticated ? {
            userId: currentUser?.id || null,
            username: currentUser?.username || null,
            email: currentUser?.email || null,
            role: 'user',
            avatar: null,
          } : undefined}
        />
        <Container className="py-8">
          <LoadingSkeleton variant="page" message="Loading profile..." />
        </Container>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <HeaderV2
          title="BestReads"
          userData={isAuthenticated ? {
            userId: currentUser?.id || null,
            username: currentUser?.username || null,
            email: currentUser?.email || null,
            role: 'user',
            avatar: null,
          } : undefined}
        />
        <Container className="py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">👤</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              User Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The profile you're looking for doesn't exist
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go Home
            </button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeaderV2
        title="BestReads"
        userData={isAuthenticated ? {
          userId: currentUser?.id || null,
          username: currentUser?.username || null,
          email: currentUser?.email || null,
          role: 'user',
          avatar: null,
        } : undefined}
      />

      <Container className="py-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-4">
              {/* Avatar */}
              <div className="flex items-end space-x-4">
                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {profileUser.profileImage ? (
                    <img
                      src={profileUser.profileImage}
                      alt={profileUser.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span>{profileUser.username.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                <div className="pb-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {profileUser.firstName && profileUser.lastName
                      ? `${profileUser.firstName} ${profileUser.lastName}`
                      : profileUser.username}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">@{profileUser.username}</p>
                </div>
              </div>

              {/* Edit Profile Button */}
              {isOwnProfile && (
                <button
                  onClick={() => router.push(`/${username}/settings`)}
                  className="mt-4 md:mt-0 px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {/* Bio */}
            {profileUser.bio && (
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {profileUser.bio}
              </p>
            )}

            {/* Member Since */}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              📅 Member since {new Date(profileUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        {isOwnProfile && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Books</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Reading</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.currentlyReading}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Want to Read</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.wantToRead}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Rating</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{getAverageRating()}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        {isOwnProfile && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === 'overview'
                      ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('books')}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === 'books'
                      ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  Books ({stats.total})
                </button>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === 'stats'
                      ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  Statistics
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Reading Goal */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        🎯 {readingGoal.year} Reading Goal
                      </h2>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {readingGoal.completed} / {readingGoal.target} books
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${readingGoal.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {readingGoal.percentage.toFixed(0)}% complete • {readingGoal.target - readingGoal.completed} books to go
                    </p>
                  </div>

                  {/* Currently Reading */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      📖 Currently Reading
                    </h2>
                    {books.filter(b => b.status === ReadingStatus.CURRENTLY_READING).length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {books
                          .filter(b => b.status === ReadingStatus.CURRENTLY_READING)
                          .slice(0, 4)
                          .map((book) => (
                            <div
                              key={book.id}
                              onClick={() => router.push(`/search/${book.bookId}`)}
                              className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            >
                              <div className="w-16 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded flex-shrink-0 overflow-hidden">
                                {book.coverImage ? (
                                  <img
                                    src={book.coverImage}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-2xl">📚</div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                                  {book.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                  {book.author}
                                </p>
                                {book.currentPage && book.totalPages && (
                                  <div className="mt-2">
                                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                                      <span>{book.currentPage} pages</span>
                                      <span>{Math.round((book.currentPage / book.totalPages) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                                      <div
                                        className="bg-blue-600 dark:bg-blue-400 h-1.5 rounded-full"
                                        style={{ width: `${Math.min((book.currentPage / book.totalPages) * 100, 100)}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                        No books currently being read
                      </p>
                    )}
                  </div>

                  {/* Favorite Genres */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      ⭐ Favorite Genres
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {getFavoriteGenres().map((genre) => (
                        <span
                          key={genre}
                          className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Books Tab */}
              {activeTab === 'books' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">All Books</h2>
                  {books.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {books.map((book) => (
                        <div
                          key={book.id}
                          onClick={() => router.push(`/search/${book.bookId}`)}
                          className="cursor-pointer group"
                        >
                          <div className="aspect-[2/3] bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow mb-2">
                            {book.coverImage ? (
                              <img
                                src={book.coverImage}
                                alt={book.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-4xl">📚</div>
                            )}
                          </div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                            {book.title}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {book.author}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                      No books in your library yet
                    </p>
                  )}
                </div>
              )}

              {/* Statistics Tab */}
              {activeTab === 'stats' && (
                <div className="space-y-6">
                  {/* Reading Activity */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      📊 Reading Activity
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700 dark:text-gray-300">Completed</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{stats.completed}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className="bg-green-500 h-3 rounded-full"
                            style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700 dark:text-gray-300">Currently Reading</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{stats.currentlyReading}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className="bg-blue-500 h-3 rounded-full"
                            style={{ width: `${stats.total > 0 ? (stats.currentlyReading / stats.total) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700 dark:text-gray-300">Want to Read</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{stats.wantToRead}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className="bg-purple-500 h-3 rounded-full"
                            style={{ width: `${stats.total > 0 ? (stats.wantToRead / stats.total) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700 dark:text-gray-300">Did Not Finish</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{stats.didNotFinish}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className="bg-red-500 h-3 rounded-full"
                            style={{ width: `${stats.total > 0 ? (stats.didNotFinish / stats.total) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      📈 Quick Stats
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Books</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{getAverageRating()}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {books.filter(b => b.favorite).length}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Favorites</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Public View for Other Users */}
        {!isOwnProfile && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Private Profile
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              This user's reading activity is private
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
