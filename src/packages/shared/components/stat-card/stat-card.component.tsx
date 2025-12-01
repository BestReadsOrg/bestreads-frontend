'use client';

import React from 'react';
import { StatCardProps } from './stat-card.types';

/**
 * StatCard Component
 * Displays a statistic with optional icon and trend indicator
 * 
 * @example
 * <StatCard
 *   label="Total Books"
 *   value={42}
 *   icon="📚"
 *   color="blue"
 * />
 */
export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  color = 'blue',
  trend,
  className = '',
}) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    green: 'text-green-600 bg-green-50 dark:bg-green-900/20',
    purple: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
    red: 'text-red-600 bg-red-50 dark:bg-red-900/20',
    yellow: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
    indigo: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20',
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all hover:shadow-lg ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            {trend && (
              <span
                className={`text-sm font-medium ${
                  trend.direction === 'up'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div
            className={`text-4xl ${colorClasses[color]} rounded-full w-16 h-16 flex items-center justify-center`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
