import {
  type BlockStyleRecord,
  type CommandStyleRecord,
  captionTransformer,
  em,
  footnoteTransformer,
  type Gap,
  H,
  headingTransformer,
  mathNumberTransformer,
  minitype,
  physical,
  Q,
} from "@minitype/minitype";

import { mainGroup, titleGroup } from "./document.js";
import { boldFont, regularFont } from "./helper.js";

// ------
// スタイル定義
// ------

const blockStyles: BlockStyleRecord = {
  paragraph: {
    font: regularFont,
    size: Q(14),
    lineHeight: H(23),
    firstIndent: em(1),
  },
  h1: {
    font: boldFont,
    size: Q(24),
    lineHeight: H(28),
    firstIndent: 0,
    headingNumberFormat: (index) => `第${index[0]}章　`,
  },
  h2: {
    font: boldFont,
    size: Q(20),
    lineHeight: H(24),
    firstIndent: 0,
    headingNumberFormat: (index) => `${index[0]}.${index[1]}　`,
    needspace: 10,
  },
  h3: {
    font: boldFont,
    size: Q(16),
    lineHeight: H(23),
    firstIndent: 0,
    headingNumberFormat: (index) => `${index[0]}.${index[1]}.${index[2]}　`,
    needspace: 10,
  },
  li1: {
    indent: em(1),
  },
  li2: {
    indent: em(2),
  },
  code: {
    align: "left",
    font: "SourceCodePro-Regular",
    size: Q(12),
    lineHeight: H(18),
  },
  caption: {
    font: regularFont,
    align: "center",
    firstIndent: 0,
  },
  footnote: {
    size: Q(11),
    lineHeight: H(17),
  },
};

const commandStyles: CommandStyleRecord = {
  b: {
    font: boldFont,
  },
};

const gaps: Gap[] = [
  // 見出し
  ["h1", "fallback", 8],
  ["h2", "fallback", 4],
  ["h3", "fallback", 3],
  ["fallback", "h2", 10],
  ["fallback", "h3", 6],

  // 段落
  ["paragraph", "paragraph", 2],

  // リスト
  ["li1", "li1", 0],
  ["li1", "li2", 0],
  ["li2", "li1", 0],
  ["li2", "li2", 0],
  ["fallback", "li1", 4],
  ["li1", "fallback", 4],
  ["li2", "fallback", 4],

  // 画像
  ["fallback", "figure", 8],
  ["figure", "fallback", 8],
  ["image", "caption", 4],

  // 表
  ["fallback", "easytable", 8],
  ["easytable", "fallback", 8],
  ["caption", "table", 4],

  // 数式
  ["fallback", "math", 8],
  ["math", "fallback", 8],

  // ソースコード
  ["fallback", "lstlisting", 8],
  ["lstlisting", "fallback", 8],
];

// ------
// 組版処理
// ------

await minitype(
  [titleGroup, mainGroup],
  {
    size: "A4",
    writingMode: "horizontal",
    padding: physical(36, 28, 32, 28),
    block: blockStyles,
    command: commandStyles,
    gaps,
  },
  {
    fontDir: "fonts",
    disableDefaultTransformers: true,
    blockTransformers: [
      headingTransformer({ numberedLevels: [1, 2, 3] }),
      captionTransformer,
      footnoteTransformer(),
      mathNumberTransformer(),
    ],
  },
).save("output.pdf");
