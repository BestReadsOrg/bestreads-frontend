'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ActivityFeedProps, Activity } from './activity-feed.types';

/**
 * Activity Feed Component
 * Displays user or friends' recent activities
 */
export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  loading = false,
  showViewMore = false,
  viewMoreLink,
  emptyMessage = 'No recent activity',
  className = '',
}) => {
  const router = useRouter();

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'book_added':
        return '➕';
      case 'book_started':
        return '📖';
      case 'book_completed':
        return '✅';
      case 'review_posted':
        return '✍️';
      case 'rating_updated':
        return '⭐';
      case 'goal_completed':
        return '🎯';
      case 'friend_added':
        return '👥';
      default:
        return '📚';
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'book_added':
        return (
          <>
            added <span className="font-semibold">{activity.book?.title}</span> to their list
          </>
        );
      case 'book_started':
        return (
          <>
            started reading <span className="font-semibold">{activity.book?.title}</span>
          </>
        );
      case 'book_completed':
        return (
          <>
            finished reading <span className="font-semibold">{activity.book?.title}</span>
          </>
        );
      case 'review_posted':
        return (
          <>
            reviewed <span className="font-semibold">{activity.book?.title}</span>
          </>
        );
      case 'rating_updated':
        return (
          <>
            rated <span className="font-semibold">{activity.book?.title}</span> {activity.review?.rating} stars
          </>
        );
      case 'goal_completed':
        return <>completed their reading goal!</>;
      case 'friend_added':
        return <>made a new friend</>;
      default:
        return <>had an activity</>;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = now.getTime() - activityTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return activityTime.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className={className}>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className={className}>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
          >
            {/* User Avatar */}
            <div className="flex-shrink-0">
              {activity.userAvatar ? (
                <div className="w-10 h-10 rounded-full overflow-hidden relative">
                  <Image
                    src={activity.userAvatar}
                    alt={activity.username}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                  {activity.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Activity Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2">
                <span className="text-xl flex-shrink-0">{getActivityIcon(activity.type)}</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    <span className="font-semibold hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                      {activity.username}
                    </span>{' '}
                    {getActivityText(activity)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {getTimeAgo(activity.timestamp)}
                  </p>

                  {/* Review Excerpt */}
                  {activity.type === 'review_posted' && activity.review?.text && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2 italic">
                      &ldquo;{activity.review.text}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Book Cover (if applicable) */}
            {activity.book?.coverImage && (
              <div
                className="flex-shrink-0 cursor-pointer"
                onClick={() => router.push(`/search/${activity.book!.id}`)}
              >
                <div className="w-12 h-16 rounded overflow-hidden relative shadow-sm hover:shadow-md transition-shadow">
                  <Image
                    src={activity.book.coverImage}
                    alt={activity.book.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* View More */}
      {showViewMore && viewMoreLink && (
        <button
          onClick={() => router.push(viewMoreLink)}
          className="w-full mt-4 py-3 text-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium transition-colors"
        >
          View all activity
        </button>
      )}
    </div>
  );
};

export default ActivityFeed;
