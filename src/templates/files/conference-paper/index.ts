import {
  type BlockStyleRecord,
  box,
  captionTransformer,
  cmyk,
  em,
  type Flow,
  fill,
  footnoteTransformer,
  type Gap,
  type Group,
  H,
  headingTransformer,
  minitype,
  p,
  page,
  physical,
  Q,
} from "@minitype/minitype";

import { abstractBody, mainContent, titleBlock } from "./document.js";

// ------
// スタイル定義
// ------

const blockStyles: BlockStyleRecord = {
  paragraph: {
    font: "SourceHanSerifJP-Regular",
    size: Q(11),
    lineHeight: H(17),
    firstIndent: em(1),
  },
  h1: {
    font: "SourceHanSansJP-Bold",
    size: Q(13),
    lineHeight: H(18),
    headingNumberFormat: (index) => `${index[0]}　`,
    needspace: 10,
  },
  h2: {
    font: "SourceHanSansJP-Bold",
    size: Q(11),
    lineHeight: H(17),
    headingNumberFormat: (index) => `${index[0]}.${index[1]}　`,
    needspace: 8,
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
    size: Q(10),
    lineHeight: H(15),
  },
  caption: {
    font: "SourceHanSansJP-Regular",
    size: Q(10),
    lineHeight: H(15),
    align: "center",
  },
  footnote: {
    size: Q(9),
    lineHeight: H(13),
  },
};

const commandStyles = {
  b: { font: "SourceHanSerifJP-Bold" },
  c: { font: "SourceCodePro-Regular", background: [fill(cmyk(0, 0, 0, 8))] },
};

const gaps: Gap[] = [
  // 見出し
  ["h1", "fallback", 2],
  ["h2", "fallback", 2],
  ["fallback", "h1", 4],
  ["fallback", "h2", 4],

  // 段落
  ["paragraph", "paragraph", 0],

  // リスト
  ["li1", "li1", 0],
  ["li1", "li2", 0],
  ["li2", "li1", 0],
  ["li2", "li2", 0],
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
  ["fallback", "lstlisting", 4],
  ["lstlisting", "fallback", 4],
];

// フッタ（ノンブル）
const footer: Flow = {
  type: "flow",
  position: "nombre",
  blockOffset: 8,
  blocks: [
    p([[page]], {
      align: "center",
      firstIndent: 0,
    }),
  ],
};

// 2 段組
const twoColumnBody = box(mainContent, {
  columns: 2,
  columnGap: 8,
  splitable: true,
  footnoteSpan: "column",
});

const documentGroup: Group = {
  body: [footer, ...titleBlock, ...abstractBody, twoColumnBody],
};

// ------
// 組版処理
// ------
await minitype(
  [documentGroup],
  {
    size: "B5",
    writingMode: "horizontal",
    padding: physical(20, 18, 22, 18),
    block: blockStyles,
    command: commandStyles,
    gaps,
  },
  {
    fontDir: "fonts",
    disableDefaultTransformers: true,
    blockTransformers: [
      headingTransformer({ numberedLevels: [1, 2] }),
      captionTransformer,
      footnoteTransformer(),
    ],
  },
).save("output.pdf");
