import type { Bookmark } from './types';

/**
 * Parses input text into an array of Bookmark objects.
 * Logic ported from Go implementation:
 * - Paragraphs are separated by empty lines.
 * - Lines starting with http:// or https:// and containing no spaces are URLs.
 * - Other lines form the description.
 */
export const parseTextToBookmarks = (text: string): Bookmark[] => {
  // Normalize line endings and split by one or more empty lines
  const paragraphs = text.split(/\n\s*\n/);
  
  return paragraphs
    .map((paragraph) => {
      const lines = paragraph.split('\n');
      const urls: string[] = [];
      const descriptionLines: string[] = [];

      lines.forEach((line) => {
        const trimmed = line.trim();
        if (
          trimmed.startsWith('http://') ||
          trimmed.startsWith('https://')
        ) {
          if (!trimmed.includes(' ')) {
            urls.push(trimmed);
            return;
          }
        }
        descriptionLines.push(line);
      });

      const fullDescription = descriptionLines.join('\n').trim();

      return {
        description: fullDescription,
        urls,
      };
    })
    .filter((bookmark) => bookmark.description !== '' || bookmark.urls.length > 0);
};

/**
 * Converts Bookmark array to TSV string.
 */
export const bookmarksToTSV = (bookmarks: Bookmark[]): string => {
  return bookmarks
    .map((b) => {
      let displayDescription = b.description;
      // Escape for TSV: if contains newline, tab or double quote, wrap in quotes and escape double quotes
      if (/[\n\t"]/.test(displayDescription)) {
        displayDescription = `"${displayDescription.replace(/"/g, '""')}"`;
      }
      return [displayDescription, ...b.urls].join('\t');
    })
    .join('\n');
};

/**
 * Converts Bookmark array to JSONL string.
 */
export const bookmarksToJSONL = (bookmarks: Bookmark[]): string => {
  return bookmarks.map((b) => JSON.stringify(b)).join('\n');
};
