# bkp-web

A lightweight, browser-based version of `bkp`, built with SolidJS and TypeScript. This tool allows you to convert plain text memos into structured TSV or JSONL formats directly in your browser.

## Features

- **Client-Side Only**: All processing happens in your browser. No data is sent to any server.
- **Real-time Conversion**: See your structured data update instantly as you type.
- **Preview Mode**: View extracted URLs as clickable links.
- **Format Support**: Export to both TSV (default) and JSONL.
- **One-click Copy**: Quickly copy the result to your clipboard.
- **Extremely Lightweight**: Built with SolidJS for minimal bundle size and high performance.

## Core Logic (Ported from Go)

- **Paragraph Splitting**: Text is split by empty lines.
- **URL Extraction**: Lines starting with `http://` or `https://` (with no spaces) are treated as URLs.
- **Description Handling**: All other lines within a paragraph form the description, preserving line breaks.

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

To generate static files (HTML, JS, CSS) for deployment:

```bash
npm run build
```

The output will be in the `dist/` directory. You can host these files on any static web server (GitHub Pages, Vercel, Netlify, etc.).

## Technologies

- [SolidJS](https://www.solidjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- Vanilla CSS
