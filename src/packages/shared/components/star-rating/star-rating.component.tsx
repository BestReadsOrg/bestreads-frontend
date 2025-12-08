'use client';

import React, { useState } from 'react';
import { StarRatingProps } from './star-rating.types';

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 'md',
  showNumber = true,
  interactive = false,
  onRatingChange,
  className = '',
}) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  const displayRating = interactive && hoveredRating > 0 ? hoveredRating : rating;

  const getStarFill = (starIndex: number) => {
    const value = displayRating - starIndex;
    if (value >= 1) return 'full';
    if (value >= 0.5) return 'half';
    return 'empty';
  };

  const handleStarClick = (starIndex: number, isHalf: boolean) => {
    if (interactive && onRatingChange) {
      const newRating = starIndex + (isHalf ? 0.5 : 1);
      onRatingChange(newRating);
    }
  };

  const handleStarHover = (starIndex: number, isHalf: boolean) => {
    if (interactive) {
      const newRating = starIndex + (isHalf ? 0.5 : 1);
      setHoveredRating(newRating);
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {[0, 1, 2, 3, 4].map((starIndex) => {
          const fillType = getStarFill(starIndex);
          
          return (
            <div
              key={starIndex}
              className={`relative ${interactive ? 'cursor-pointer' : ''}`}
              onMouseLeave={() => interactive && setHoveredRating(0)}
            >
              {/* Full star background (gray) */}
              <svg
                className={`${sizeClasses[size]} text-gray-300 dark:text-gray-600`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>

              {/* Yellow star overlay */}
              {fillType !== 'empty' && (
                <div
                  className="absolute top-0 left-0 overflow-hidden"
                  style={{ width: fillType === 'half' ? '50%' : '100%' }}
                >
                  <svg
                    className={`${sizeClasses[size]} text-yellow-400 fill-current`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              )}

              {/* Interactive overlay for clicking/hovering */}
              {interactive && (
                <>
                  {/* Left half */}
                  <div
                    className="absolute top-0 left-0 w-1/2 h-full"
                    onClick={() => handleStarClick(starIndex, true)}
                    onMouseEnter={() => handleStarHover(starIndex, true)}
                  />
                  {/* Right half */}
                  <div
                    className="absolute top-0 right-0 w-1/2 h-full"
                    onClick={() => handleStarClick(starIndex, false)}
                    onMouseEnter={() => handleStarHover(starIndex, false)}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>

      {showNumber && (
        <span className={`${textSizeClasses[size]} font-medium text-gray-700 dark:text-gray-300 ml-1`}>
          {displayRating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
