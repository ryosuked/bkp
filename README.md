# bkp

テキストデータを構造化された JSONL 形式に変換・加工、およびブックマーク（リンク付きメモ）を TSV 形式でエクスポートするためのスクリプト群です。
Ruby による柔軟な処理と、Go による高速・大規模データ向けの処理の両方を提供しています。

## ツール一覧

### Ruby版 (柔軟な加工・パイプライン)
1.  **`paragraphs_to_jsonl.rb`**: プレーンテキストを段落ごとに JSONL 化します。
2.  **`extract_urls.rb`**: JSONL 内のテキストから URL 行を抽出し、説明文と URL リストに分離します。
3.  **`bookmarks_to_tsv.rb`**: 抽出されたブックマークデータを TSV 形式に変換します。

### Go版 (高速・大規模データ向け一括処理)
-   **`main.go`**: 上記 Ruby 版の全工程を 1 ステップで実行します。

### TypeScript/Web版 (ブラウザ完結型 Web UI)
-   **`bkp-web/`**: SolidJS + TypeScript によるブラウザ完結型の実装です。サーバー不要で、テキストのリアルタイム変換とプレビューが可能です。

---

## 高速一括処理 (Go版)

10万行を超えるような大規模なテキストデータを、低メモリ消費かつ高速に処理したい場合に使用します。
デフォルトでは TSV を出力しますが、オプションで JSONL 形式の出力も可能です。

### 使用方法
```bash
# TSV形式で出力 (デフォルト)
cat input.txt | go run main.go > output.tsv

# JSONL形式で出力 (-json オプション)
cat input.txt | go run main.go -json > output.jsonl

# バイナリをビルドして実行
go build -o bkp main.go
./bkp -json < input.txt > output.jsonl
```

---

## 各ステップの個別処理 (Ruby版)

### 1. paragraphs_to_jsonl.rb
...

空行で区切られたテキストブロックを、`{"text": "..."}` 形式の JSONL に変換します。

### 使用方法
```bash
ruby paragraphs_to_jsonl.rb input.txt > result.jsonl
```

### 入出力例
**入力 (`input.txt`):**
```text
商品名 A
https://example.com/itemA

商品名 B
詳細説明
https://example.com/itemB
```

**出力 (`result.jsonl`):**
```jsonl
{"text":"商品名 A\nhttps://example.com/itemA"}
{"text":"商品名 B\n詳細説明\nhttps://example.com/itemB"}
```

---

## 2. extract_urls.rb

`paragraphs_to_jsonl.rb` などで生成された JSONL を入力として受け取り、行全体が URL であるものを抽出して `{"description": "...", "urls": ["..."]}` 形式に変換します。

### 使用方法
```bash
ruby extract_urls.rb result.jsonl > extracted.jsonl
```

### 出力例
```jsonl
{"description":"商品名 A","urls":["https://example.com/itemA"]}
{"description":"商品名 B\n詳細説明","urls":["https://example.com/itemB"]}
```

---

## 3. bookmarks_to_tsv.rb

構造化されたブックマークデータを、スプレッドシート等で扱いやすい TSV 形式に変換します。
`description` 内の改行はスペースに置換されます。

### 使用方法
```bash
ruby bookmarks_to_tsv.rb extracted.jsonl > output.tsv
```

### 出力形式
```text
説明文 [TAB] URL1 [TAB] URL2 ...
```

---

## 連携した使用例（一括処理）

パイプを利用して、プレーンテキストから直接ブックマーク TSV を生成できます。

```bash
cat input.txt | ruby paragraphs_to_jsonl.rb | ruby extract_urls.rb | ruby bookmarks_to_tsv.rb > output.tsv
```

## ライセンス

MIT
