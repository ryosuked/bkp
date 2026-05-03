package main

import (
	"bufio"
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"strings"
)

// Bookmark represents a structured memo with a description and associated URLs.
type Bookmark struct {
	Description string   `json:"description"`
	URLs        []string `json:"urls"`
}

var useJSON = flag.Bool("json", false, "JSONL形式で出力します (デフォルトはTSV)")

func main() {
	flag.Parse()

	// 標準入力から1行ずつ効率的に読み込むためのスキャナ
	scanner := bufio.NewScanner(os.Stdin)

	var currentParagraph []string

	for scanner.Scan() {
		line := scanner.Text()
		trimmed := strings.TrimSpace(line)

		if trimmed == "" {
			// 空行に遭遇 = 段落の区切り
			processParagraph(currentParagraph)
			currentParagraph = nil
		} else {
			// 段落の一部として蓄積
			currentParagraph = append(currentParagraph, line)
		}
	}

	// 最終行の処理
	processParagraph(currentParagraph)

	if err := scanner.Err(); err != nil {
		fmt.Fprintln(os.Stderr, "読み込みエラー:", err)
		os.Exit(1)
	}
}

// processParagraph は一段落分のテキストを受け取り、
// 指定された形式（TSV または JSONL）で出力します。
func processParagraph(lines []string) {
	if len(lines) == 0 {
		return
	}

	var descriptionLines []string
	var urls []string

	// --- 1. URL抽出ロジック ---
	for _, l := range lines {
		trimmed := strings.TrimSpace(l)
		if strings.HasPrefix(trimmed, "http://") || strings.HasPrefix(trimmed, "https://") {
			if !strings.Contains(trimmed, " ") {
				urls = append(urls, trimmed)
				continue
			}
		}
		descriptionLines = append(descriptionLines, l)
	}

	// --- 2. データの構造化 ---
	// 説明文の改行を保持
	fullDescription := strings.Join(descriptionLines, "\n")
	fullDescription = strings.TrimSpace(fullDescription)

	if fullDescription == "" && len(urls) == 0 {
		return
	}

	// --- 3. 出力 ---
	if *useJSON {
		// JSONL形式での出力
		b := Bookmark{
			Description: fullDescription,
			URLs:        urls,
		}
		data, _ := json.Marshal(b)
		fmt.Println(string(data))
	} else {
		// TSV形式での出力
		// 改行、タブ、ダブルクォートを含む場合はダブルクォートで囲み、内部のダブルクォートをエスケープ
		displayDescription := fullDescription
		if strings.ContainsAny(displayDescription, "\n\t\"") {
			displayDescription = "\"" + strings.ReplaceAll(displayDescription, "\"", "\"\"") + "\""
		}

		// フォーマット: 説明文 [TAB] URL1 [TAB] URL2 ...
		output := []string{displayDescription}
		output = append(output, urls...)
		fmt.Println(strings.Join(output, "\t"))
	}
}
