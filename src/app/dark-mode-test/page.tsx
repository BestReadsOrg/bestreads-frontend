'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/packages/shared/components/header';

export default function DarkModeTestPage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="BestReads" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Dark Mode Test Page
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Test dark mode functionality across different UI components
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Current Theme
            </h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {isDarkMode ? '🌙 Dark' : '🌞 Light'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Authentication Status
            </h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {isAuthenticated ? '✓ Logged In' : '✗ Not Logged In'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {isAuthenticated 
                ? 'Theme preference will be saved to database' 
                : 'Theme preference stored in session only'}
            </p>
          </div>
        </div>

        {/* Toggle Button */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Theme Controls
          </h3>
          <button
            onClick={toggleDarkMode}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-xl">{isDarkMode ? '🌞' : '🌙'}</span>
            <span>Toggle to {isDarkMode ? 'Light' : 'Dark'} Mode</span>
          </button>
        </div>

        {/* UI Components Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            UI Components
          </h3>
          
          <div className="space-y-4">
            {/* Input Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Text Input
              </label>
              <input
                type="text"
                placeholder="Type something..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              />
            </div>

            {/* Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Textarea
              </label>
              <textarea
                rows={3}
                placeholder="Write a message..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              />
            </div>

            {/* Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Buttons
              </label>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                  Primary
                </button>
                <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-md transition-colors">
                  Secondary
                </button>
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors">
                  Success
                </button>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors">
                  Danger
                </button>
              </div>
            </div>

            {/* Alert Messages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Alert Messages
              </label>
              <div className="space-y-2">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-400 rounded-md">
                  ℹ️ This is an informational message
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-400 rounded-md">
                  ✓ Success! Your changes were saved
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-400 rounded-md">
                  ⚠️ Warning: Please review this carefully
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 rounded-md">
                  ✗ Error: Something went wrong
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Color Palette
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-full h-20 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2"></div>
              <p className="text-sm text-gray-700 dark:text-gray-300">Background</p>
            </div>
            <div className="text-center">
              <div className="w-full h-20 bg-blue-600 rounded-lg mb-2"></div>
              <p className="text-sm text-gray-700 dark:text-gray-300">Primary</p>
            </div>
            <div className="text-center">
              <div className="w-full h-20 bg-green-600 rounded-lg mb-2"></div>
              <p className="text-sm text-gray-700 dark:text-gray-300">Success</p>
            </div>
            <div className="text-center">
              <div className="w-full h-20 bg-red-600 rounded-lg mb-2"></div>
              <p className="text-sm text-gray-700 dark:text-gray-300">Danger</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
