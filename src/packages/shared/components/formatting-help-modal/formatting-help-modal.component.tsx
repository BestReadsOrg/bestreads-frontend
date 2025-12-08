'use client';

import React from 'react';
import { FormattingHelpModalProps, FormattingExample } from './formatting-help-modal.types';

export const FormattingHelpModal: React.FC<FormattingHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const examples: FormattingExample[] = [
    {
      name: 'Bold Text',
      description: 'Make text bold to emphasize important points',
      syntax: '<b>your text</b> or <strong>your text</strong>',
      preview: '<b>This text is bold</b>',
    },
    {
      name: 'Italic Text',
      description: 'Italicize text for emphasis or titles',
      syntax: '<i>your text</i> or <em>your text</em>',
      preview: '<i>This text is italic</i>',
    },
    {
      name: 'Underline Text',
      description: 'Underline important text',
      syntax: '<u>your text</u>',
      preview: '<u>This text is underlined</u>',
    },
    {
      name: 'Strikethrough Text',
      description: 'Cross out text to show deletion or change',
      syntax: '<s>your text</s> or <del>your text</del>',
      preview: '<s>This text is crossed out</s>',
    },
    {
      name: 'Links',
      description: 'Add hyperlinks to external resources',
      syntax: '<a href="https://example.com">link text</a>',
      preview: '<a href="https://example.com" class="text-blue-600 dark:text-blue-400 underline">Example Link</a>',
    },
    {
      name: 'Spoiler Tags',
      description: 'Hide spoilers with a special tag that can be revealed',
      syntax: '<spoiler>spoiler content</spoiler>',
      preview: '<spoiler class="bg-gray-800 text-gray-800 dark:bg-gray-200 dark:text-gray-200 hover:bg-transparent hover:text-inherit cursor-pointer transition-all px-1">This contains spoilers!</spoiler>',
    },
    {
      name: 'Headings',
      description: 'Use headings to structure your review',
      syntax: '<h3>Heading Text</h3>',
      preview: '<h3 class="text-xl font-bold">Section Heading</h3>',
    },
    {
      name: 'Quotes',
      description: 'Quote passages from the book',
      syntax: '<blockquote>quoted text</blockquote>',
      preview: '<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-700 dark:text-gray-300">"A memorable quote from the book"</blockquote>',
    },
    {
      name: 'Code/Monospace',
      description: 'Display text in monospace font',
      syntax: '<code>your code</code>',
      preview: '<code class="bg-gray-100 dark:bg-gray-800 px-1 rounded font-mono text-sm">monospace text</code>',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Formatting Guide</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Enhance your reviews with rich text formatting. Click any formatting button in the toolbar
            or use these HTML tags directly:
          </p>

          <div className="space-y-6">
            {examples.map((example) => (
              <div
                key={example.name}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
              >
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                  {example.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {example.description}
                </p>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Syntax:
                    </span>
                    <code className="block mt-1 p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded text-sm font-mono text-gray-800 dark:text-gray-200">
                      {example.syntax}
                    </code>
                  </div>
                  
                  <div>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Preview:
                    </span>
                    <div
                      className="mt-1 p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded text-sm"
                      dangerouslySetInnerHTML={{ __html: example.preview }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">💡 Pro Tips</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
              <li>Use Ctrl+B for bold and Ctrl+I for italic</li>
              <li>Select text before clicking formatting buttons to wrap it with tags</li>
              <li>Click &ldquo;Preview&rdquo; to see how your formatted review will look</li>
              <li>Combine multiple formatting tags: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">&lt;b&gt;&lt;i&gt;bold italic&lt;/i&gt;&lt;/b&gt;</code></li>
              <li>Use spoiler tags responsibly to protect readers from unwanted revelations</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            Got it!
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};
