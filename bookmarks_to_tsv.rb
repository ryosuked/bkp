require "json"

# このスクリプトは、{"description": "...", "urls": ["..."]} 形式の JSONL を読み込み、
# TSV（タブ区切り）形式に変換します。
# フォーマット: description [TAB] url1 [TAB] url2 ...

ARGF.set_encoding("UTF-8")

ARGF.each_line do |line|
  next if line.strip.empty?

  begin
    data = JSON.parse(line)
    description = data["description"] || ""
    urls = data["urls"] || []

    # TSVのフィールドに改行、タブ、ダブルクォートが含まれる場合は
    # フィールド全体をダブルクォートで囲み、内部のダブルクォートをエスケープします
    def escape_tsv_field(text)
      if text.include?("\n") || text.include?("\t") || text.include?("\"")
        "\"#{text.gsub("\"", "\"\"")}\""
      else
        text
      end
    end

    clean_description = escape_tsv_field(description)

    # 出力行の構築: description [TAB] url1 [TAB] url2 ...
    row = [clean_description] + urls
    puts row.join("\t")
  rescue JSON::ParserError
    warn "Warning: Could not parse line as JSON: #{line.inspect}"
  end
end
