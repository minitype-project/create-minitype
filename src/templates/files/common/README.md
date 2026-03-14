# {{projectName}}

create-minitype を用いて作成された {{templateDisplayName}} プロジェクトです．

## 実行方法

```bash
# 依存関係をインストール
npm install

# 文書をコンパイルして output.pdf を生成
npm run build
```

## ファイル構成

- **`index.ts`** – スタイルの定義と `minitype()` の呼び出し
- **`document.ts`** – 文書の本文
- **`fonts/`** – フォントファイルの格納場所

## 文書の編集

### document.ts を編集する

`document.ts` の `body` 配列を編集します．以下のブロック要素を使用することができます．

```ts
import { h1, h2, h3, p, li1, li2, code, figure, easytable, math, caption, newpage } from "minitype";

// 見出し
h1("大見出し")
h2("中見出し")
h3("小見出し")

// 段落
p("本文のテキストです．")

// 箇条書き
li1("レベル1の項目")
li2("レベル2の項目")

// コードブロック
code("const x = 42;", "typescript")

// 画像，キャプション
figure("image.png", { width: ratio(0.8), align: "center" })
caption("画像のキャプション")

// 表，キャプション
caption("表のキャプション")
easytable([
  ["ヘッダ1", "ヘッダ2", "ヘッダ3"],
  ["中身1-1", "中身1-2", "中身1-3"],
  ["中身2-1", "中身2-2", "中身2-3"],
]),

// 数式
math(["E = mc^2"])

// 改ページ
newpage()
```

### インライン要素

```ts
// コマンド（太字・インラインコード）
p([["通常 ", { type: "command", name: "b", body: ["太字"] }, " 通常"]])

// URL リンク
import { url } from "minitype";
p([[url("https://example.com", "リンクテキスト")]])

// 脚注
import { fn, footnote, footnoteTransformer } from "minitype";
p([["本文中に脚注をこのように", fn("note1"), "挿入することもできます．"]])
footnote("note1", "脚注の内容")
```

### スタイルを変更する

`index.ts` の `style` オブジェクトを編集します：

```ts
const style = {
  size: "A4",          // 用紙サイズ: "A4", "A5", "B5", "B4" など
  padding: physical(25, 25, 25, 25),  // 上右下左の余白（mm）
  block: {
    paragraph: {
      font: "フォント名",
      size: Q(13),       // 13級 = 3.25mm
      lineHeight: H(22), // 22歯 = 5.5mm
      firstIndent: em(1),// 字下げ
    },
    headings: [
      { size: Q(18), font: "フォント名-Bold" },  // h1
      { size: Q(15), font: "フォント名-Bold" },  // h2
    ],
  },
};
```
