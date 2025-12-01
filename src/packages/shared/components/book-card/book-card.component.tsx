'use client';

import React from 'react';
import { BookCardProps } from './book-card.types';

/**
 * BookCard Component
 * Displays a book with cover, title, author, and optional metadata
 * 
 * @example
 * <BookCard
 *   id="1"
 *   title="The Great Gatsby"
 *   author="F. Scott Fitzgerald"
 *   genres={["Fiction", "Classic"]}
 *   onClick={(id) => router.push(`/books/${id}`)}
 * />
 */
export const BookCard: React.FC<BookCardProps> = ({
  id,
  title,
  author,
  coverImage,
  genres = [],
  rating,
  status,
  progress,
  onClick,
  onEdit,
  onDelete,
  variant = 'default',
  className = '',
}) => {
  const statusColors = {
    reading: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    'want-to-read': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    'did-not-finish': 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
  };

  const statusLabels = {
    reading: 'Reading',
    completed: 'Completed',
    'want-to-read': 'Want to Read',
    'did-not-finish': 'DNF',
  };

  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  if (variant === 'compact') {
    return (
      <div
        onClick={handleClick}
        className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer bg-white dark:bg-gray-800 ${className}`}
      >
        <div className="flex items-start gap-3">
          {/* Book Cover/Initial */}
          <div className="w-16 h-20 bg-linear-to-br from-blue-400 to-purple-500 rounded flex items-center justify-center text-white font-bold text-2xl shrink-0">
            {coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverImage}
                alt={title}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              title.charAt(0).toUpperCase()
            )}
          </div>

          {/* Book Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {author}
            </p>

            {/* Genres */}
            {genres && genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {genres.slice(0, 2).map((genre, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
                  >
                    {genre}
                  </span>
                ))}
                {genres.length > 2 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 px-1">
                    +{genres.length - 2}
                  </span>
                )}
              </div>
            )}

            {/* Status Badge */}
            {status && (
              <span
                className={`inline-block px-2 py-0.5 text-xs rounded-full mt-2 ${statusColors[status]}`}
              >
                {statusLabels[status]}
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {progress !== undefined && progress > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default variant - more detailed card
  return (
    <div
      onClick={handleClick}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {/* Book Cover */}
      <div className="relative h-48 bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            📚
          </div>
        )}
        {status && (
          <div className="absolute top-2 right-2">
            <span
              className={`px-2 py-1 text-xs rounded-full ${statusColors[status]}`}
            >
              {statusLabels[status]}
            </span>
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          by {author}
        </p>

        {/* Rating */}
        {rating && (
          <div className="flex items-center mb-2">
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm text-gray-700 dark:text-gray-300 ml-1">
              {rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Genres */}
        {genres && genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {genres.slice(0, 3).map((genre, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* Progress Bar */}
        {progress !== undefined && progress > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        {(onEdit || onDelete) && (
          <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(id);
                }}
                className="flex-1 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                className="flex-1 px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
