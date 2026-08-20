import {
  type Block,
  type BlockStyleRecord,
  captionTransformer,
  em,
  type Flow,
  footnoteTransformer,
  type Gap,
  h1,
  headingTransformer,
  minitype,
  p,
  page,
  physical,
  Q,
  vspace,
} from "@minitype/minitype";

import { author, date, mainContent, title } from "./document.js";

// ------
// スタイル定義
// ------

const blockStyles: BlockStyleRecord = {
  paragraph: {
    font: "SourceHanSerifJP-Regular",
    size: Q(14),
    lineHeight: em(1.5),
    firstIndent: em(1),
  },
  h1: {
    font: "SourceHanSansJP-Regular",
    size: Q(28),
    firstIndent: 0,
    align: "center",
  },
  h2: {
    font: "SourceHanSansJP-Regular",
    size: Q(20),
    firstIndent: 0,
    headingNumberFormat: (index) => `${index[0]}　`,
    needspace: 10,
  },
  h3: {
    font: "SourceHanSansJP-Regular",
    size: Q(16),
    firstIndent: 0,
    headingNumberFormat: (index) => `${index[0]}.${index[1]}　`,
    needspace: 8,
  },
  li1: {
    firstIndent: em(-1),
  },
  li2: {
    firstIndent: em(-2),
  },
  code: {
    font: "SourceCodePro-Regular",
    firstIndent: 0,
  },
  caption: {
    align: "center",
    firstIndent: 0,
  },
  footnote: {
    size: Q(10),
    firstIndent: 0,
  },
};

const commandStyles = {
  b: { font: "SourceHanSerifJP-Bold" },
  c: { font: "SourceCodePro-Regular" },
};

const gaps: Gap[] = [
  // 見出し
  ["h1", "fallback", 6],
  ["h2", "fallback", 4],
  ["h3", "fallback", 2],
  ["fallback", "h1", 8],
  ["fallback", "h2", 8],
  ["fallback", "h3", 6],

  // リスト
  ["li1", "li1", 2],
  ["li1", "li2", 2],
  ["li2", "li1", 2],
  ["li2", "li2", 2],
  ["fallback", "li1", 2],
  ["li1", "fallback", 2],
  ["li2", "fallback", 2],

  // 段落
  ["paragraph", "paragraph", 2],

  // 画像
  ["fallback", "figure", 4],
  ["figure", "fallback", 4],
  ["image", "caption", 4],

  // 表
  ["fallback", "easytable", 4],
  ["easytable", "fallback", 4],
  ["caption", "table", 2],
  ["paragraph", "table", 4],
  ["math", "table", 4],
  ["math", "table", 4],
  ["li1", "table", 4],
  ["li2", "table", 4],
  ["lstlisting", "table", 4],

  // 数式
  ["fallback", "math", 4],
  ["math", "fallback", 4],

  // ソースコード
  ["fallback", "lstlisting", 4],
  ["lstlisting", "fallback", 4],
];

// ------
// タイトル，著者，日付
// ------

const now = new Date();
const today = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
const dateText =
  date === false ? false : typeof date === "string" ? date : today;

const titleBlock: Block[] = [
  h1([[title]]),
  p([[author]], { align: "center" }),
  ...(dateText !== false ? [p([[dateText]], { align: "center" })] : []),
  vspace(6),
];

// ------
// 柱，ノンブル
// ------

const header: Flow = {
  type: "flow",
  position: "pillar",
  blockOffset: -10,
  blocks: [
    p(title, {
      align: "right",
      firstIndent: 0,
      size: 3,
      lineHeight: 4.5,
    }),
  ],
  page: (pageIndex: number) => pageIndex >= 1,
};

const footer: Flow = {
  type: "flow",
  position: "nombre",
  blockOffset: 8,
  blocks: [
    p([[page]], {
      align: "center",
      firstIndent: 0,
      size: 3,
      lineHeight: 4.5,
    }),
  ],
};

// ------
// 組版処理
// ------

await minitype(
  [{ body: [header, footer, ...titleBlock, ...mainContent] }],
  {
    size: "A4",
    writingMode: "horizontal",
    padding: physical(32, 25),
    block: blockStyles,
    command: commandStyles,
    gaps,
  },
  {
    fontDir: "fonts",
    disableDefaultTransformers: true,
    blockTransformers: [
      headingTransformer({ numberedLevels: [2, 3] }),
      captionTransformer,
      footnoteTransformer(),
    ],
  },
).save("output.pdf");
