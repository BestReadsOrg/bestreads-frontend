'use client';

import React from 'react';
import { RatingDistributionProps } from './rating-distribution.types';

export const RatingDistribution: React.FC<RatingDistributionProps> = ({
  ratings,
  totalReviews,
  averageRating,
  onRatingFilter,
  selectedRating,
}) => {
  // Calculate rating distribution (0.5 to 5.0 in 0.5 increments)
  const ratingBuckets = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5];
  
  const getRatingCount = (rating: number): number => {
    return ratings.filter((r: number) => {
      // Round to nearest 0.5
      const rounded = Math.round(r * 2) / 2;
      return rounded === rating;
    }).length;
  };

  const getPercentage = (count: number): number => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  const handleRatingClick = (rating: number) => {
    if (selectedRating === rating) {
      // Deselect if clicking the same rating
      onRatingFilter(null);
    } else {
      onRatingFilter(rating);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      {/* Header with Average Rating */}
      <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center mb-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const filled = star <= Math.floor(averageRating);
              const half = star === Math.ceil(averageRating) && averageRating % 1 >= 0.25 && averageRating % 1 < 0.75;
              
              return (
                <svg
                  key={star}
                  className={`w-6 h-6 ${
                    filled || half ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                  }`}
                  fill={filled ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {half ? (
                    <defs>
                      <linearGradient id={`half-${star}`}>
                        <stop offset="50%" stopColor="currentColor" />
                        <stop offset="50%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                  ) : null}
                  <path
                    fill={half ? `url(#half-${star})` : filled ? 'currentColor' : 'none'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              );
            })}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Rating Distribution
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {selectedRating ? (
              <span className="inline-flex items-center gap-1">
                Showing {getRatingCount(selectedRating)} reviews with {selectedRating} stars
                <button
                  onClick={() => onRatingFilter(null)}
                  className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear filter
                </button>
              </span>
            ) : (
              'Click on a rating to filter reviews'
            )}
          </div>
        </div>
      </div>

      {/* Rating Bars */}
      <div className="space-y-2">
        {ratingBuckets.map((rating) => {
          const count = getRatingCount(rating);
          const percentage = getPercentage(count);
          const isSelected = selectedRating === rating;

          return (
            <button
              key={rating}
              onClick={() => handleRatingClick(rating)}
              className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${
                isSelected
                  ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
              } ${count > 0 ? 'cursor-pointer' : 'cursor-default opacity-50'}`}
              disabled={count === 0}
              title={count > 0 ? `${count} ${count === 1 ? 'review' : 'reviews'} with ${rating} stars` : 'No reviews'}
            >
              {/* Rating Label */}
              <div className="flex items-center gap-1 w-16 shrink-0">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {rating}
                </span>
                <svg
                  className="w-4 h-4 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>

              {/* Progress Bar */}
              <div className="flex-1 relative h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 transition-all duration-300 ${
                    isSelected
                      ? 'bg-blue-500'
                      : 'bg-linear-to-r from-yellow-400 to-yellow-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
                {/* Hover tooltip inside bar */}
                {count > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-200 mix-blend-difference">
                      {percentage > 5 && `${percentage.toFixed(0)}%`}
                    </span>
                  </div>
                )}
              </div>

              {/* Count */}
              <div className="w-12 text-right shrink-0">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {count}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-6 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-linear-to-r from-yellow-400 to-yellow-500" />
            <span>Rating bar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Selected filter</span>
          </div>
        </div>
      </div>
    </div>
  );
};
