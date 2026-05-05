import { useState, useMemo } from 'react';
import { parseTextToBookmarks, bookmarksToTSV, bookmarksToJSONL } from './logic/parser';
import './styles/App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [outputFormat, setOutputFormat] = useState<'TSV' | 'JSONL'>('TSV');

  const bookmarks = useMemo(() => parseTextToBookmarks(inputText), [inputText]);

  const outputText = useMemo(() => {
    if (outputFormat === 'TSV') {
      return bookmarksToTSV(bookmarks);
    } else {
      return bookmarksToJSONL(bookmarks);
    }
  }, [bookmarks, outputFormat]);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText).then(() => {
      alert('Copied to clipboard!');
    });
  };

  return (
    <div className="container">
      <header>
        <h1>lnkp web</h1>
        <p>Convert your memos into structured TSV or JSONL format.</p>
      </header>

      <main>
        <div className="editor-grid">
          <div className="pane">
            <label htmlFor="input">Input Text</label>
            <textarea
              id="input"
              placeholder="Paste your text here...
Separate paragraphs with empty lines.
Lines starting with http:// are URLs."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          <div className="pane">
            <label htmlFor="output">Output ({outputFormat})</label>
            <textarea
              id="output"
              readOnly
              value={outputText}
              placeholder="Structured output will appear here..."
            />
            <div className="output-controls">
              <div className="button-group">
                <button
                  className={outputFormat === 'TSV' ? 'active' : ''}
                  onClick={() => setOutputFormat('TSV')}
                >
                  TSV
                </button>
                <button
                  className={outputFormat === 'JSONL' ? 'active' : ''}
                  onClick={() => setOutputFormat('JSONL')}
                >
                  JSONL
                </button>
              </div>
              <button className="copy-btn" onClick={handleCopy} disabled={!outputText}>
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>

        {bookmarks.length > 0 && (
          <section className="preview">
            <h2>Preview</h2>
            {bookmarks.map((bookmark, index) => (
              <div key={index} className="bookmark-item">
                <div className="bookmark-desc">{bookmark.description || '(No description)'}</div>
                {bookmark.urls.length > 0 && (
                  <ul className="bookmark-urls">
                    {bookmark.urls.map((url, uIndex) => (
                      <li key={uIndex}>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
