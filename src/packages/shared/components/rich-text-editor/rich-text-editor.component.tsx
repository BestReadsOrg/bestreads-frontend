'use client';

import React, { useRef, useState, useCallback } from 'react';
import { RichTextEditorProps, FormattingButton } from './rich-text-editor.types';

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your review...',
  maxLength = 5000,
  minRows = 4,
  maxRows = 20,
  error,
  onShowHelp,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);

  const formattingButtons: FormattingButton[] = [
    { name: 'bold', icon: 'B', title: 'Bold (Ctrl+B)', action: 'bold', tag: 'b' },
    { name: 'italic', icon: 'I', title: 'Italic (Ctrl+I)', action: 'italic', tag: 'i' },
    { name: 'underline', icon: 'U', title: 'Underline', action: 'underline', tag: 'u' },
    { name: 'strikethrough', icon: 'S', title: 'Strikethrough', action: 'strikethrough', tag: 's' },
    { name: 'link', icon: '🔗', title: 'Insert Link', action: 'link', requiresInput: true },
    { name: 'spoiler', icon: '⚠️', title: 'Spoiler Tag', action: 'spoiler', tag: 'spoiler' },
    { name: 'heading', icon: 'H', title: 'Heading', action: 'heading', tag: 'h3' },
    { name: 'quote', icon: '"', title: 'Quote', action: 'quote', tag: 'blockquote' },
    { name: 'code', icon: '</>', title: 'Code', action: 'code', tag: 'code' },
  ];

  const insertFormatting = useCallback((button: FormattingButton) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    let newText = value;
    let newCursorPos = end;

    if (button.action === 'link') {
      const url = prompt('Enter URL:');
      if (!url) return;
      
      const linkText = selectedText || 'link text';
      const linkHtml = `<a href="${url}" target="_blank">${linkText}</a>`;
      newText = value.substring(0, start) + linkHtml + value.substring(end);
      newCursorPos = start + linkHtml.length;
    } else if (button.tag) {
      const openTag = `<${button.tag}>`;
      const closeTag = `</${button.tag}>`;
      
      if (selectedText) {
        // Wrap selected text
        const formatted = `${openTag}${selectedText}${closeTag}`;
        newText = value.substring(0, start) + formatted + value.substring(end);
        newCursorPos = start + formatted.length;
      } else {
        // Insert tags with placeholder
        const placeholder = button.tag === 'spoiler' ? 'spoiler content' : 'text';
        const formatted = `${openTag}${placeholder}${closeTag}`;
        newText = value.substring(0, start) + formatted + value.substring(end);
        newCursorPos = start + openTag.length + placeholder.length;
      }
    }

    // Convert to HTML and plain text
    const htmlContent = newText;
    onChange(newText, htmlContent);

    // Restore cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  }, [value, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b') {
        e.preventDefault();
        const boldBtn = formattingButtons.find(btn => btn.action === 'bold');
        if (boldBtn) insertFormatting(boldBtn);
      } else if (e.key === 'i') {
        e.preventDefault();
        const italicBtn = formattingButtons.find(btn => btn.action === 'italic');
        if (italicBtn) insertFormatting(italicBtn);
      }
    }
  };

  const renderPreview = () => {
    // Simple preview rendering (in production, this should use DOMPurify)
    return (
      <div
        className="prose dark:prose-invert max-w-none p-4 border border-gray-300 dark:border-gray-600 rounded-md min-h-[120px] bg-white dark:bg-gray-800"
        dangerouslySetInnerHTML={{ __html: value || '<p class="text-gray-400">Nothing to preview yet...</p>' }}
      />
    );
  };

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-t-md p-2">
        <div className="flex items-center gap-1 flex-wrap">
          {formattingButtons.map((button) => (
            <button
              key={button.name}
              type="button"
              onClick={() => insertFormatting(button)}
              title={button.title}
              className={`
                px-2 py-1 rounded text-sm font-semibold transition-colors
                ${button.name === 'bold' ? 'font-bold' : ''}
                ${button.name === 'italic' ? 'italic' : ''}
                ${button.name === 'underline' ? 'underline' : ''}
                ${button.name === 'strikethrough' ? 'line-through' : ''}
                hover:bg-gray-200 dark:hover:bg-gray-700
                active:bg-gray-300 dark:active:bg-gray-600
                text-gray-700 dark:text-gray-300
              `}
            >
              {button.icon}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Preview Toggle */}
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="px-3 py-1 text-sm rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            {preview ? 'Edit' : 'Preview'}
          </button>

          {/* Help Button (Info Icon) */}
          {onShowHelp && (
            <button
              type="button"
              onClick={onShowHelp}
              title="Formatting Help"
              className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-300"
            >
              i
            </button>
          )}
        </div>
      </div>

      {/* Editor or Preview */}
      {preview ? (
        renderPreview()
      ) : (
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value, e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxLength={maxLength}
            rows={minRows}
            className={`
              w-full px-4 py-3 border rounded-b-md resize-y transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500
              dark:bg-gray-800 dark:text-white dark:border-gray-600
              ${error ? 'border-red-500' : 'border-gray-300'}
            `}
            style={{
              minHeight: `${minRows * 24}px`,
              maxHeight: `${maxRows * 24}px`,
            }}
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400 pointer-events-none">
            {value.length} / {maxLength}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};
