import type { Bookmark } from './types';

export const parseTextToBookmarks = (text: string, joinWithSpace = false): Bookmark[] => {
  const paragraphs = text.split(/\n\s*\n/);
  
  return paragraphs
    .map((paragraph) => {
      const lines = paragraph.split('\n');
      const urls: string[] = [];
      const descriptionLines: string[] = [];

      lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
          if (!trimmed.includes(' ')) {
            urls.push(trimmed);
            return;
          }
        }
        descriptionLines.push(line);
      });

      return {
        description: descriptionLines.join(joinWithSpace ? ' ' : '\n').trim(),
        urls,
      };
    })
    .filter((bookmark) => bookmark.description !== '' || bookmark.urls.length > 0);
};

export const bookmarksToTSV = (bookmarks: Bookmark[]): string => {
  return bookmarks
    .map((b) => {
      let displayDescription = b.description;
      if (/[\n\t"]/.test(displayDescription)) {
        displayDescription = `"${displayDescription.replace(/"/g, '""')}"`;
      }
      return [displayDescription, ...b.urls].join('\t');
    })
    .join('\n');
};

export const bookmarksToJSONL = (bookmarks: Bookmark[]): string => {
  return bookmarks.map((b) => JSON.stringify(b)).join('\n');
};
