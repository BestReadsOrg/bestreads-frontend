'use client';

import React, { useState, useEffect } from 'react';

interface ScrollToTopProps {
  /**
   * Scroll threshold in pixels to show the button
   * @default 300
   */
  showAfter?: number;
  /**
   * Position of the button
   * @default 'bottom-right'
   */
  position?: 'bottom-right' | 'bottom-left';
  /**
   * Custom className for styling
   */
  className?: string;
}

/**
 * Scroll to Top Button Component
 * 
 * A reusable button that appears when user scrolls down and smoothly scrolls back to top when clicked.
 * Features fade in/out animations.
 * Can be used anywhere in the app.
 * 
 * @example
 * <ScrollToTop />
 * 
 * @example
 * <ScrollToTop showAfter={500} position="bottom-left" />
 */
export const ScrollToTop: React.FC<ScrollToTopProps> = ({
  showAfter = 300,
  position = 'bottom-right',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > showAfter) {
        if (!isVisible) {
          setIsVisible(true);
          // Trigger animation after a brief delay
          setTimeout(() => setIsAnimating(true), 10);
        }
      } else {
        if (isVisible) {
          setIsAnimating(false);
          // Wait for fade-out animation to complete before hiding
          setTimeout(() => setIsVisible(false), 300);
        }
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, [showAfter, isVisible]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const positionClasses = {
    'bottom-right': 'bottom-8 right-8',
    'bottom-left': 'bottom-8 left-8'
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed ${positionClasses[position]} z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${
        isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${className}`}
      aria-label="Scroll to top"
      type="button"
      style={{ transition: 'opacity 300ms ease-in-out, transform 300ms ease-in-out' }}
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
};

export default ScrollToTop;
