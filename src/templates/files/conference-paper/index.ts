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
    firstIndent: 0,
    headingNumberFormat: (index) => `${index[0]}. `,
    needspace: 10,
  },
  h2: {
    font: "SourceHanSansJP-Bold",
    size: Q(11),
    lineHeight: H(17),
    firstIndent: 0,
    headingNumberFormat: (index) => `${index[0]}.${index[1]} `,
    needspace: 8,
  },
  li1: {
    firstIndent: em(-2),
  },
  li2: {
    firstIndent: em(-2),
  },
  code: {
    font: "SourceCodePro-Regular",
    size: Q(10),
    lineHeight: H(15),
    firstIndent: 0,
  },
  caption: {
    font: "SourceHanSansJP-Regular",
    size: Q(10),
    lineHeight: H(15),
    align: "center",
    firstIndent: 0,
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
  ["h1", "paragraph", 2],
  ["h1", "h2", 2],
  ["h2", "paragraph", 2],
  ["paragraph", "h1", 8],
  ["paragraph", "h2", 5],

  // リスト
  ["paragraph", "li1", 4],
  ["li1", "paragraph", 4],
  ["li2", "paragraph", 4],
  ["li1", "h1", 8],
  ["li2", "h1", 8],
  ["li1", "li1", 0],
  ["li1", "li2", 0],
  ["li2", "li1", 0],
  ["li2", "li2", 0],

  // 段落
  ["paragraph", "paragraph", 0],
  ["paragraph", "math", 4],
  ["math", "paragraph", 4],
  ["code", "paragraph", 4],
  ["paragraph", "code", 4],

  // 画像
  ["fallback", "figure", 8],
  ["figure", "fallback", 8],
  ["image", "caption", 4],

  // その他
  ["fallback", "fallback", 2],
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
