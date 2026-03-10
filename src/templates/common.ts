import type { TemplateVars } from "./types.js";

export function packageJson(vars: TemplateVars): string {
  return JSON.stringify(
    {
      name: vars.projectName,
      version: "0.1.0",
      type: "module",
      scripts: {
        build: "tsx index.ts",
        watch: "tsx watch index.ts",
      },
      dependencies: {
        minitype: vars.minitypePath,
      },
      devDependencies: {
        "@types/pdfkit": "^0.17.0",
        tsx: "^4.20.0",
        typescript: "^5.0.0",
      },
    },
    null,
    2,
  );
}

export function tsconfigJson(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        module: "ESNext",
        moduleResolution: "bundler",
        strict: true,
        esModuleInterop: true,
        paths: {
          minitype: ["./node_modules/minitype/src/index.ts"],
          "minitype/*": ["./node_modules/minitype/src/*"],
          "@/*": ["./node_modules/minitype/src/*"],
        },
      },
      include: ["*.ts"],
    },
    null,
    2,
  );
}

export function gitignore(): string {
  return `node_modules/
*.pdf
*.png
font-caches.db
`;
}

export function fontsReadme(): string {
  return `# フォント

このディレクトリに使用するフォントファイル（.otf, .ttf, .ttc）を配置してください．

## 推奨フォント（オープンソース）

### 日本語フォント
- **源ノ明朝（Source Han Serif JP）** – 本文向けセリフ体
  - https://github.com/adobe-fonts/source-han-serif/releases
  - ファイル名例: \`SourceHanSerifJP-Regular.otf\`, \`SourceHanSerifJP-Bold.otf\`

- **源ノ角ゴシック（Source Han Sans JP）** – 見出し向けゴシック体
  - https://github.com/adobe-fonts/source-han-sans/releases
  - ファイル名例: \`SourceHanSansJP-Regular.otf\`, \`SourceHanSansJP-Bold.otf\`

- **Noto Serif JP** – 代替セリフ体
  - https://fonts.google.com/noto/specimen/Noto+Serif+JP
  - ファイル名例: \`NotoSerifJP-Regular.otf\`

### 等幅フォント（コードブロック用）
- **Source Code Pro**
  - https://github.com/adobe-fonts/source-code-pro/releases
  - ファイル名例: \`SourceCodePro-Regular.otf\`

- **Noto Sans Mono**
  - https://fonts.google.com/noto/specimen/Noto+Sans+Mono
  - ファイル名例: \`NotoSansMono-Regular.ttf\`

## フォントの指定方法

index.ts のスタイル定義でフォントを指定します：
\`\`\`ts
{
  font: "SourceHanSerifJP-Regular"  // 拡張子を除いたファイル名
}
\`\`\`
`;
}

export function claudeMd(vars: TemplateVars, templateName: string): string {
  return `# ${vars.projectName}

minitype で作成した${templateDisplayName(templateName)}プロジェクトです．

## セットアップ

\`\`\`bash
npm install
\`\`\`

フォントファイルを \`fonts/\` ディレクトリに配置してください（\`fonts/README.md\` を参照）．

## ビルド

\`\`\`bash
npm run build
\`\`\`

\`output.pdf\` が生成されます．

## ファイル構成

- **\`index.ts\`** – スタイルの定義と \`minitype()\` の呼び出し
- **\`document.ts\`** – 文書の本文（編集はここがメイン）
- **\`fonts/\`** – フォントファイルの格納場所

## 文書を編集する

### document.ts を編集する

\`document.ts\` の \`body\` 配列に以下のブロック要素を追加・編集します：

\`\`\`ts
import { h1, h2, h3, p, li1, li2, code, figure, easytable, math, caption, vspace, newpage } from "minitype";

// 見出し
h1("第1章 はじめに")     // 大見出し
h2("1.1 背景")           // 中見出し
h3("1.1.1 先行研究")     // 小見出し

// 段落
p("本文のテキストです．")

// 箇条書き
li1("最初の項目")
li2("入れ子の項目")

// コードブロック
code("const x = 42;", "typescript")

// 画像
figure("image.png", { width: ratio(0.8), align: "center" })

// 数式
math(["E = mc^2"])

// 改ページ
newpage()

// 縦方向の空白
vspace(10)  // 10mm
\`\`\`

### インライン要素

\`\`\`ts
// コマンド（太字・インラインコード）
p([["通常 ", { type: "command", name: "b", body: ["太字"] }, " 通常"]])

// URL リンク
import { url } from "minitype";
p([[url("https://example.com", "リンクテキスト")]])

// 脚注
import { fn, footnote, footnoteTransformer } from "minitype";
p([["本文", fn("note1"), "の後"]])
footnote("note1", "脚注の内容")
\`\`\`

### スタイルを変更する

\`index.ts\` の \`style\` オブジェクトを編集します：

\`\`\`ts
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
\`\`\`

## エージェント向け情報

このプロジェクトは minitype ${templateName} テンプレートから生成されました．
テンプレート: \`${templateName}\`
minitype パス: \`${vars.minitypePath}\`

文書を修正する際は \`document.ts\` の \`body\` 配列を編集してください．
スタイルを変更する際は \`index.ts\` の \`style\` オブジェクトを編集してください．
`;
}

function templateDisplayName(name: string): string {
  const names: Record<string, string> = {
    report: "レポート",
    "technical-book": "技術書",
    "conference-paper": "学会論文",
    thesis: "卒業論文/修士論文",
    invoice: "請求書",
    cv: "履歴書",
  };
  return names[name] ?? name;
}
