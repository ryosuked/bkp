require "json"

buffer = []

# ARGFは、コマンドライン引数があればそれらをファイル名として読み込み、
# 引数がなければ標準入力（STDIN）から読み込みます。
ARGF.set_encoding("UTF-8")
ARGF.each_line do |line|
  if line.strip.empty?
    # 空行に遭遇 → これまでのバッファを1レコードとして出力
    unless buffer.empty?
      text = buffer.join.rstrip
      puts JSON.generate({ text: text })
      buffer.clear
    end
  else
    buffer << line
  end
end

# ファイル末尾に空行が無い場合の残りを出力
unless buffer.empty?
  text = buffer.join.rstrip
  puts JSON.generate({ text: text })
end

