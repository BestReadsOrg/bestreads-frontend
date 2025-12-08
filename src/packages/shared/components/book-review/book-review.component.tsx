'use client';

import React, { useState } from 'react';
import { BookReviewProps } from './book-review.types';
import { StarRating } from '../star-rating';

export const BookReview: React.FC<BookReviewProps> = ({
  userName,
  userAvatar,
  rating,
  date,
  reviewText,
  reviewHtml,
  helpful,
  isHelpfulByCurrentUser = false,
  onToggleHelpful,
  onEdit,
  onDelete,
  isCurrentUserReview = false,
  isFriendReview = false,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(helpful || 0);
  const [isHelpful, setIsHelpful] = useState(isHelpfulByCurrentUser);
  const [isTogglingHelpful, setIsTogglingHelpful] = useState(false);

  const contentToDisplay = reviewHtml || reviewText;
  const shouldTruncate = contentToDisplay.length > 300;
  const displayContent = isExpanded || !shouldTruncate 
    ? contentToDisplay 
    : contentToDisplay.substring(0, 300) + '...';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleToggleHelpful = async () => {
    if (!onToggleHelpful || isTogglingHelpful) return;
    
    setIsTogglingHelpful(true);
    try {
      await onToggleHelpful();
      
      // Toggle state
      if (isHelpful) {
        setHelpfulCount((prev: number) => Math.max(0, prev - 1));
        setIsHelpful(false);
      } else {
        setHelpfulCount((prev: number) => prev + 1);
        setIsHelpful(true);
      }
    } catch (error) {
      console.error('Error toggling helpful:', error);
    } finally {
      setIsTogglingHelpful(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="shrink-0">
          {userAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={userAvatar}
              alt={userName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* User Info & Rating */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {userName}
            </h4>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(date)}
            </span>
          </div>

          {/* Star Rating */}
          {rating !== undefined && (
            <StarRating rating={rating} size="md" showNumber={true} />
          )}
        </div>
      </div>

      {/* Review Text */}
      {reviewHtml ? (
        <div 
          className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed mb-4 review-content"
          dangerouslySetInnerHTML={{ __html: displayContent }}
        />
      ) : (
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 whitespace-pre-wrap">
          {displayContent}
        </p>
      )}

      {/* Friend Badge */}
      {isFriendReview && (
        <div className="inline-flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full mb-4">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
          Friend
        </div>
      )}

      {/* Show More/Less Button */}
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mb-4"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        {/* Helpful Button */}
        <button
          onClick={handleToggleHelpful}
          disabled={isTogglingHelpful || !onToggleHelpful}
          className={`flex items-center gap-2 text-sm transition-colors ${
            isHelpful
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
          } ${!onToggleHelpful ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <svg
            className="w-5 h-5"
            fill={isHelpful ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
          <span>{isHelpful ? 'Helpful' : 'Mark as helpful'} {helpfulCount > 0 && `(${helpfulCount})`}</span>
        </button>

        {/* Edit/Delete Buttons for Current User's Review */}
        {isCurrentUserReview && (
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .review-content :global(spoiler) {
          background-color: currentColor;
          color: transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 0 2px;
          border-radius: 2px;
        }
        .review-content :global(spoiler:hover) {
          background-color: transparent;
          color: inherit;
        }
        .review-content :global(a) {
          color: #2563eb;
          text-decoration: underline;
        }
        .dark .review-content :global(a) {
          color: #60a5fa;
        }
      `}</style>
    </div>
  );
};

export default BookReview;
