import {
  type BlockStyleRecord,
  bottom,
  box,
  calculatePhysicalPadding,
  captionTransformer,
  cmyk,
  em,
  fill,
  footnoteTransformer,
  type Gap,
  H,
  minitype,
  p,
  page,
  physical,
  Q,
  solid,
} from "@minitype/minitype";

import { body, bookTitle } from "./document.js";
import { keyColor } from "./helper.js";

// ------
// スタイル定義
// ------

const size = "B5";
const fontSize = Q(13);
const lineHeight = H(22);

const blockStyles: BlockStyleRecord = {
  paragraph: {
    font: "SourceHanSerifJP-Regular",
    size: Q(13),
    lineHeight: em(1.7),
    firstIndent: em(1),
    effects: [{ type: "fill", color: cmyk(0, 0, 0, 100) }],
  },
  h1: {
    font: "SourceHanSansJP-Bold",
    size: Q(28),
    effects: [{ type: "fill", color: keyColor }],
  },
  h2: {
    font: "SourceHanSansJP-Bold",
    size: Q(18),
    effects: [{ type: "fill", color: keyColor }],
  },
  h3: {
    font: "SourceHanSansJP-Bold",
    size: Q(14),
    effects: [{ type: "fill", color: keyColor }],
    headingNumberFormat: () => "",
  },
  li1: {
    font: "SourceHanSerifJP-Regular",
    size: Q(13),
    indent: em(2),
  },
  li2: {
    font: "SourceHanSerifJP-Regular",
    size: Q(13),
    indent: em(4),
  },
  code: {
    font: "SourceCodePro-Regular",
    size: Q(12),
  },
  caption: {
    font: "SourceHanSansJP-Regular",
    size: Q(12),
    align: "center",
  },
  footnote: {
    font: "SourceHanSerifJP-Regular",
    size: Q(11),
  },
};

const commandStyles = {
  b: { font: "SourceHanSerifJP-Bold" },
  c: {
    font: "SourceCodePro-Regular",
    effects: [fill(cmyk(0, 0, 0, 80))],
    padding: physical(0.5, 1, 0.5, 1),
  },
  kw: { font: "SourceHanSansJP-Bold" },
};

const gaps: Gap[] = [
  // 見出し
  ["h1", "h2", 10],
  ["h1", "fallback", 8],
  ["h2", "fallback", 6],
  ["h3", "fallback", 3],
  ["fallback", "h1", 20],
  ["fallback", "h2", 14],
  ["fallback", "h3", 8],

  // 段落
  ["paragraph", "paragraph", 0],

  // リスト
  ["li1", "li1", 1],
  ["li1", "li2", 1],
  ["li2", "li1", 1],
  ["li2", "li2", 1],
  ["paragraph", "li1", 4],
  ["li1", "paragraph", 4],
  ["li2", "paragraph", 4],

  // コードブロック
  ["paragraph", "code", 4],
  ["code", "paragraph", 6],
  ["fallback", "lstlisting", 4],
  ["lstlisting", "fallback", 4],

  // 図版
  ["fallback", "figure", 6],
  ["figure", "fallback", 6],
  ["image", "caption", 3],
  ["figure", "caption", 2],
  ["caption", "paragraph", 6],

  // 表
  ["fallback", "easytable", 6],
  ["easytable", "fallback", 6],
  ["caption", "table", 2],

  // 数式
  ["fallback", "math", 4],
  ["math", "fallback", 4],

  // 脚注
  ["footnote", "fallback", 4],
];

// ------
// 柱，ノンブル
// ------

const header = {
  type: "flow" as const,
  position: "pillar" as const,
  blockOffset: -14,
  blocks: [
    box(
      [
        p(bookTitle, {
          align: (pageIndex: number) =>
            pageIndex % 2 === 1 ? "right" : "left",
          font: "SourceHanSansJP-Regular",
          firstIndent: 0,
          size: Q(12),
        }),
      ],
      {
        padding: bottom(3),
        border: bottom(solid(0.2, keyColor)),
      },
    ),
  ],
  page: (pageIndex: number) => pageIndex >= 0,
};

const footer = {
  type: "flow" as const,
  position: "nombre" as const,
  blockOffset: 8,
  blocks: [
    p([[page]], {
      align: "center",
      firstIndent: 0,
      size: Q(12),
    }),
  ],
};

// ------
// 組版処理
// ------

await minitype(
  [{ body: [header, footer, ...body] }],
  {
    size,
    writingMode: "horizontal",
    padding: calculatePhysicalPadding(
      size,
      40,
      37,
      fontSize,
      lineHeight,
      "horizontal",
    ),
    block: blockStyles,
    command: commandStyles,
    gaps,
  },
  {
    fontDir: "fonts",
    disableDefaultTransformers: true,
    blockTransformers: [captionTransformer, footnoteTransformer()],
  },
).save("output.pdf");
