require "json"

# このスクリプトは、JSONL形式の入力（{"text": "..."}）を読み込み、
# 各エントリのテキストからURLのみの行を抽出して、
# {"description": "...", "urls": ["..."]} の形式に変換します。

ARGF.set_encoding("UTF-8")

ARGF.each_line do |line|
  next if line.strip.empty?

  begin
    data = JSON.parse(line)
    text = data["text"] || ""
    
    lines = text.split("\n")
    
    description_lines = []
    urls = []
    
    lines.each do |l|
      trimmed = l.strip
      # 行全体がURL（http/httpsで始まる空白を含まない文字列）かチェック
      if trimmed =~ %r{\Ahttps?://\S+\z}
        urls << trimmed
      else
        description_lines << l
      end
    end
    
    result = {
      description: description_lines.join("\n").rstrip,
      urls: urls
    }
    
    puts JSON.generate(result)
  rescue JSON::ParserError
    # JSONとしてパースできない行は無視するか、あるいは生テキストとして扱う
    # ここでは、元の要望が「result.jsonlのようなファイル」とのことなので
    # エラー時はスキップします
    warn "Warning: Could not parse line as JSON: #{line.inspect}"
  end
end
