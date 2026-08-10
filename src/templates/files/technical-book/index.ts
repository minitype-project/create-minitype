import {
  calculatePhysicalPadding,
  cmyk,
  type DocumentStyle,
  em,
  fill,
  H,
  minitype,
  physical,
  Q,
} from "@minitype/minitype";
import { body } from "./document.js";
import { keyColor } from "./utils.js";

const size = "B5";
const fontSize = Q(13);
const lineHeight = H(22);

const style: Partial<DocumentStyle> = {
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
  block: {
    paragraph: {
      font: "SourceHanSerifJP-Regular",
      size: Q(13),
      lineHeight: H(22),
      firstIndent: em(1),
      effects: [{ type: "fill", color: cmyk(0, 0, 0, 100) }],
    },
    h1: {
      font: "SourceHanSansJP-Bold",
      size: Q(28),
      lineHeight: H(42),
      firstIndent: 0,
      effects: [{ type: "fill", color: keyColor }],
    },
    h2: {
      font: "SourceHanSansJP-Bold",
      size: Q(18),
      lineHeight: H(28),
      firstIndent: 0,
      effects: [{ type: "fill", color: keyColor }],
    },
    h3: {
      font: "SourceHanSansJP-Bold",
      size: Q(14),
      lineHeight: H(22),
      firstIndent: 0,
      effects: [{ type: "fill", color: keyColor }],
      headingNumberFormat: () => "",
    },
    li1: {
      font: "SourceHanSerifJP-Regular",
      size: Q(13),
      lineHeight: H(22),
      firstIndent: em(-1),
    },
    code: {
      font: "SourceCodePro-Regular",
      size: Q(10),
      lineHeight: H(17),
      firstIndent: 0,
    },
    caption: {
      font: "SourceHanSansJP-Regular",
      size: Q(10),
      lineHeight: H(17),
      align: "center",
      firstIndent: 0,
    },
    footnote: {
      font: "SourceHanSerifJP-Regular",
      size: Q(10),
      lineHeight: H(16),
      firstIndent: 0,
    },
  },
  command: {
    b: { font: "SourceHanSerifJP-Bold" },
    c: {
      font: "SourceCodePro-Regular",
      effects: [fill(cmyk(0, 0, 0, 8))],
      padding: physical(0.5, 1, 0.5, 1),
    },
    kw: { font: "SourceHanSansJP-Bold" },
  },
  gaps: [
    ["h1", "h2", 10],
    ["h1", "paragraph", 8],
    ["h2", "paragraph", 6],
    ["h2", "h3", 4],
    ["h3", "paragraph", 3],
    ["paragraph", "h1", 20],
    ["paragraph", "h2", 14],
    ["paragraph", "h3", 8],
    ["paragraph", "h4", 6],
    ["paragraph", "paragraph", 0],
    ["paragraph", "code", 4],
    ["code", "paragraph", 6],
    ["figure", "caption", 2],
    ["caption", "paragraph", 8],
    ["fallback", "fallback", 4],
  ],
};

await minitype([{ body }], style, {
  fontDir: "fonts",
}).save("output.pdf");
