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
import { boldFont, regularFont } from "./utils.js";

const block: BlockStyleRecord = {
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
  caption: {
    align: "center",
    firstIndent: 0,
  },
};

const command: CommandStyleRecord = {
  b: {
    font: boldFont,
  },
};

const gaps: Gap[] = [
  // 見出し
  ["h1", "fallback", 6],
  ["h2", "fallback", 4],
  ["h3", "fallback", 3],
  ["fallback", "h2", 10],
  ["fallback", "h3", 6],

  // 図（box）↔ 周辺ブロック
  ["paragraph", "box", 6],
  ["box", "paragraph", 6],
  ["box", "h2", 8],
  ["box", "h3", 6],

  // 数式
  ["figure", "paragraph", 6],
  ["figure", "caption", 4],
  ["figure", "h2", 8],
  ["figure", "h3", 6],
  ["paragraph", "figure", 4],
  ["figure", "fallback", 6],
  ["fallback", "figure", 4],
];

await minitype(
  [titleGroup, mainGroup],
  {
    size: "A4",
    writingMode: "horizontal",
    padding: physical(36, 28, 32, 28),
    block,
    command,
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
