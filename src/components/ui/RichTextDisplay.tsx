import React, { useEffect } from 'react';

interface RichTextDisplayProps {
  content: string;
  className?: string;
}

export const RichTextDisplay: React.FC<RichTextDisplayProps> = ({ content, className = '' }) => {
  useEffect(() => {
    // Inject styles untuk rich text content jika belum ada
    if (typeof document !== 'undefined' && !document.getElementById('rich-text-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'rich-text-styles';
      styleSheet.innerHTML = `
        .rich-text-display {
          word-wrap: break-word;
        }

        .rich-text-display strong,
        .rich-text-display b {
          font-weight: 600 !important;
        }

        .rich-text-display em,
        .rich-text-display i {
          font-style: italic !important;
        }

        .rich-text-display u {
          text-decoration: underline !important;
        }

        .rich-text-display h1 {
          font-size: 1.875rem !important;
          font-weight: 700 !important;
          margin: 1rem 0 0.5rem 0 !important;
          line-height: 1.2 !important;
        }

        .rich-text-display h2 {
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          margin: 1rem 0 0.5rem 0 !important;
          line-height: 1.3 !important;
        }

        .rich-text-display h3 {
          font-size: 1.25rem !important;
          font-weight: 600 !important;
          margin: 0.75rem 0 0.5rem 0 !important;
          line-height: 1.4 !important;
        }

        .rich-text-display ul {
          list-style: disc !important;
          margin: 0.5rem 0 !important;
          padding-left: 1.5rem !important;
        }

        .rich-text-display ol {
          list-style: decimal !important;
          margin: 0.5rem 0 !important;
          padding-left: 1.5rem !important;
        }

        .rich-text-display li {
          margin: 0.25rem 0 !important;
        }

        .rich-text-display p {
          margin: 0.5rem 0 !important;
        }

        .rich-text-display div {
          margin: 0.25rem 0 !important;
        }

        .rich-text-display br {
          content: "";
          display: block;
          margin: 0.25rem 0;
        }

        .rich-text-display blockquote {
          border-left: 4px solid #e5e7eb !important;
          padding-left: 1rem !important;
          margin: 1rem 0 !important;
          font-style: italic !important;
        }

        .rich-text-display a {
          color: #3b82f6 !important;
          text-decoration: underline !important;
        }

        .rich-text-display a:hover {
          color: #1d4ed8 !important;
        }

        /* Dark mode support */
        .dark .rich-text-display blockquote {
          border-left-color: #4b5563 !important;
        }

        .dark .rich-text-display a {
          color: #60a5fa !important;
        }

        .dark .rich-text-display a:hover {
          color: #93c5fd !important;
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }, []);

  return (
    <div 
      className={`rich-text-display ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
      style={{
        lineHeight: '1.7',
      }}
    />
  );
};

export default RichTextDisplay;