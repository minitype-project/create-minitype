import {
  type BlockStyleRecord,
  calculatePhysicalPadding,
  cmyk,
  type DocumentStyle,
  em,
  fill,
  type Gap,
  H,
  minitype,
  physical,
  Q,
} from "@minitype/minitype";

import { body } from "./document.js";
import { keyColor } from "./helper.js";

// ------
// スタイル定義
// ------

const size = "B5";
const fontSize = Q(14);
const lineHeight = H(22);

const gaps: Gap[] = [
  // 見出し
  ["h1", "fallback", 2],
  ["h2", "fallback", 2],
  ["h3", "fallback", 2],

  // 段落
  ["paragraph", "h2", 8],
  ["paragraph", "h3", 4],
  ["paragraph", "paragraph", 0],
  ["paragraph", "code", 4],
  ["fallback", "li1", 0],

  ["li1", "li1", 0],

  ["code", "paragraph", 6],
  ["figure", "caption", 4],
  ["caption", "paragraph", 8],
  ["fallback", "fallback", 4],
];

const blockStyles: BlockStyleRecord = {
  paragraph: {
    font: "SourceHanSansJP-Regular",
    size: Q(13),
    lineHeight: H(22),
    firstIndent: em(1),
    effects: [{ type: "fill", color: cmyk(0, 0, 0, 100) }],
  },
  h1: {
    font: "SourceHanSansJP-Bold",
    size: Q(28),
    lineHeight: H(36),
    firstIndent: 0,
    effects: [{ type: "fill", color: keyColor }],
  },
  h2: {
    font: "SourceHanSansJP-Bold",
    size: Q(20),
    lineHeight: H(25),
    firstIndent: 0,
    effects: [{ type: "fill", color: keyColor }],
  },
  h3: {
    font: "SourceHanSansJP-Bold",
    size: Q(16),
    lineHeight: H(22),
    firstIndent: 0,
    effects: [{ type: "fill", color: keyColor }],
    headingNumberFormat: () => "",
  },
  li1: {
    size: Q(13),
    lineHeight: H(22),
  },
  code: {
    size: Q(10),
    lineHeight: H(17),
  },
  caption: {
    size: Q(10),
    lineHeight: H(17),
    align: "center",
  },
  footnote: {
    size: Q(10),
    lineHeight: H(16),
  },
};

const commandStyles = {
  b: { font: "SourceHanSansJP-Bold" },
  c: {
    font: "SourceCodePro-Regular",
    effects: [fill(cmyk(0, 0, 0, 8))],
    padding: physical(0.5, 1, 0.5, 1),
  },
  kw: { font: "SourceHanSansJP-Bold" },
};

const style: Partial<DocumentStyle> = {
  size,
  writingMode: "horizontal",
  padding: calculatePhysicalPadding(
    size,
    38,
    36,
    fontSize,
    lineHeight,
    "horizontal",
  ),
  block: blockStyles,
  command: commandStyles,
  gaps,
};

// ------
// 組版処理
// ------
await minitype([{ body }], style, {
  fontDir: "fonts",
}).save("output.pdf");
