import {
  type BlockStyleRecord,
  type Body,
  bottom,
  box,
  captionTransformer,
  cmyk,
  em,
  type Flow,
  fill,
  footnoteTransformer,
  type Gap,
  h1,
  imageFill,
  minitype,
  p,
  physical,
  Q,
  rect,
  solid,
  vspace,
} from "@minitype/minitype";

import { bookTitle, leadText, sections } from "./document.js";
import {
  footer,
  header,
  headerImageHeight,
  magenta,
  pageWidth,
  white,
} from "./helper.js";

// ------
// スタイル定義
// ------

const blockStyles: BlockStyleRecord = {
  paragraph: {
    font: "SourceHanSerifJP-Regular",
    size: Q(11),
    lineHeight: em(1.7),
    firstIndent: em(1),
    effects: [fill(cmyk(0, 0, 0, 100))],
  },
  h1: {
    align: "left",
    font: "SourceHanSansJP-Bold",
    size: Q(32),
    effects: [fill(white)],
    firstIndent: 0,
    lineHeight: em(1.3),
  },
  h2: {
    align: "left",
    font: "SourceHanSansJP-Bold",
    size: Q(16),
    effects: [fill(white)],
    firstIndent: 0,
    headingNumberFormat: () => "",
  },
  h3: {
    align: "left",
    font: "SourceHanSansJP-Bold",
    size: Q(13),
    effects: [fill(magenta)],
    firstIndent: 0,
    headingNumberFormat: () => "",
  },
  li1: {
    align: "left",
    size: Q(11),
    firstIndent: em(-1),
  },
  li2: {
    align: "left",
    size: Q(11),
    firstIndent: em(-2),
  },
  code: {
    align: "left",
    font: "SourceCodePro-Regular",
    size: Q(10),
    lineHeight: em(1.5),
    firstIndent: 0,
  },
  caption: {
    size: Q(10),
    align: "center",
    firstIndent: 0,
  },
  footnote: {
    align: "left",
    size: Q(9),
  },
};

const commandStyles = {
  b: { font: "SourceHanSerifJP-Bold" },
  c: {
    font: "SourceCodePro-Regular",
    effects: [fill(cmyk(0, 0, 0, 80))],
    padding: physical(0.5, 1, 0.5, 1),
  },
};

const gaps: Gap[] = [
  // 見出し
  ["h1", "fallback", 4],
  ["h2", "fallback", 4],
  ["h3", "fallback", 2],
  ["fallback", "h1", 8],
  ["fallback", "h2", 6],
  ["fallback", "h3", 4],

  // 段落
  ["paragraph", "paragraph", 2],

  // リスト
  ["li1", "li1", 1],
  ["li1", "li2", 1],
  ["li2", "li1", 1],
  ["li2", "li2", 1],
  ["fallback", "li1", 2],
  ["li1", "fallback", 2],
  ["li2", "fallback", 2],

  // 画像
  ["fallback", "figure", 4],
  ["figure", "fallback", 4],
  ["image", "caption", 4],

  // 表
  ["fallback", "easytable", 4],
  ["easytable", "fallback", 4],
  ["caption", "table", 2],

  // 数式
  ["fallback", "math", 4],
  ["math", "fallback", 4],

  // ソースコード
  ["fallback", "code", 4],
  ["fallback", "lstlisting", 4],
  ["code", "fallback", 4],
  ["lstlisting", "fallback", 4],

  // 脚注
  ["footnote", "footnote", 2],
  ["fallback", "footnote", 4],
];

// ------
// テンプレートの独自処理
// ------

const headerImageFlow: Flow = {
  type: "flow",
  position: "page",
  blockOffset: 0,
  blocks: [
    rect(pageWidth, headerImageHeight, {
      background: [
        imageFill("src/assets/header.jpg", "cover", ["middle", "center"]),
      ],
    }),
  ],
  page: (pageIndex: number) => pageIndex === 0,
  zIndex: -10,
};

const titleBlock = box(
  [
    h1([[bookTitle]]),
    ...(leadText
      ? [
          p(leadText, {
            firstIndent: 0,
            size: Q(13),
            lineHeight: em(1.6),
            effects: [fill(white)],
          }),
        ]
      : []),
  ],
  {
    margin: bottom(4),
    padding: bottom(6),
    border: bottom(solid(0.3, white)),
  },
);

// ------
// 組版処理
// ------

const body: Body = [
  header,
  footer,
  headerImageFlow,
  titleBlock,
  vspace(14),
  box(sections, { columns: 2, columnGap: 8, splitable: true }),
];

await minitype(
  [{ body }],
  {
    size: "B5",
    writingMode: "horizontal",
    padding: physical(24, 18, 22, 18),
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
