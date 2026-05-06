import { createSignal, createMemo, For, Show } from 'solid-js';
import { parseTextToBookmarks, bookmarksToTSV, bookmarksToJSONL } from './logic/parser';
import './styles/App.css';

function App() {
  const [inputText, setInputText] = createSignal('');
  const [outputFormat, setOutputFormat] = createSignal<'TSV' | 'JSONL'>('TSV');
  const [joinWithSpace, setJoinWithSpace] = createSignal(false);

  const bookmarks = createMemo(() => parseTextToBookmarks(inputText(), joinWithSpace()));

  const outputText = createMemo(() => {
    const data = bookmarks();
    if (outputFormat() === 'TSV') {
      return bookmarksToTSV(data);
    } else {
      return bookmarksToJSONL(data);
    }
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText()).then(() => {
      alert('Copied to clipboard!');
    });
  };

  return (
    <div class="container">
      <header>
        <h1>bkp web (Solid)</h1>
        <p>Convert your memos into structured TSV or JSONL format.</p>
      </header>

      <main>
        <div class="editor-grid">
          <div class="pane">
            <label for="input">Input Text</label>
            <textarea
              id="input"
              placeholder="Paste your text here...
Separate paragraphs with empty lines.
Lines starting with http:// are URLs."
              value={inputText()}
              onInput={(e) => setInputText(e.currentTarget.value)}
            />
            <div class="input-controls">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  checked={joinWithSpace()}
                  onChange={(e) => setJoinWithSpace(e.currentTarget.checked)}
                />
                Join description lines with space
              </label>
            </div>
          </div>

          <div class="pane">
            <label for="output">Output ({outputFormat()})</label>
            <textarea
              id="output"
              readOnly
              value={outputText()}
              placeholder="Structured output will appear here..."
            />
            <div class="output-controls">
              <div class="button-group">
                <button
                  class={outputFormat() === 'TSV' ? 'active' : ''}
                  onClick={() => setOutputFormat('TSV')}
                >
                  TSV
                </button>
                <button
                  class={outputFormat() === 'JSONL' ? 'active' : ''}
                  onClick={() => setOutputFormat('JSONL')}
                >
                  JSONL
                </button>
              </div>
              <button class="copy-btn" onClick={handleCopy} disabled={!outputText()}>
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>

        <Show when={bookmarks().length > 0}>
          <section class="preview">
            <h2>Preview</h2>
            <For each={bookmarks()}>
              {(bookmark) => (
                <div class="bookmark-item">
                  <div class="bookmark-desc">{bookmark.description || '(No description)'}</div>
                  <Show when={bookmark.urls.length > 0}>
                    <ul class="bookmark-urls">
                      <For each={bookmark.urls}>
                        {(url) => (
                          <li>
                            <a href={url} target="_blank" rel="noopener noreferrer">
                              {url}
                            </a>
                          </li>
                        )}
                      </For>
                    </ul>
                  </Show>
                </div>
              )}
            </For>
          </section>
        </Show>
      </main>
    </div>
  );
}

export default App;
