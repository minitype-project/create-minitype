import {
  all,
  type BlockStyleRecord,
  type Body,
  bottom,
  box,
  calculatePhysicalPadding,
  cmyk,
  type DocumentStyle,
  em,
  fill,
  type Gap,
  H,
  h1,
  minitype,
  p,
  physical,
  Q,
  solid,
  vspace,
} from "@minitype/minitype";

import {
  coverDate,
  coverDisclaimer,
  coverLabel,
  coverNote,
  coverSubtitle,
  coverTitle,
  sections,
} from "./document.js";
import {
  background,
  coverBackground,
  cyan,
  footer,
  header,
  keyColor,
  white,
} from "./helper.js";

// ------
// スタイル定義
// ------

const size = "B5";
const fontSize = Q(14);
const lineHeight = H(22);

const blockStyles: BlockStyleRecord = {
  paragraph: {
    font: "SourceHanSansJP-Regular",
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
    size: Q(20),
    effects: [{ type: "fill", color: keyColor }],
  },
  h3: {
    font: "SourceHanSansJP-Bold",
    size: Q(16),
    effects: [{ type: "fill", color: keyColor }],
    headingNumberFormat: () => "",
  },
  code: {
    size: Q(12),
  },
  caption: {
    size: Q(12),
    align: "center",
  },
  footnote: {
    size: Q(11),
  },
};

const gaps: Gap[] = [
  // 見出し
  ["h1", "fallback", 4],
  ["h2", "fallback", 4],
  ["h3", "fallback", 4],

  // 段落
  ["paragraph", "paragraph", 2],

  // リスト
  ["li1", "li1", 2],
  ["li1", "li2", 2],
  ["li2", "li1", 2],
  ["li2", "li2", 2],
  ["fallback", "li1", 4],
  ["li1", "fallback", 4],
  ["li2", "fallback", 4],

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

  // カスタムブロック
  ["fallback", "callout", 4],
  ["fallback", "metric", 4],
  ["fallback", "panel", 4],
  ["fallback", "disclaimer", 4],
  ["callout", "fallback", 4],
  ["metric", "fallback", 4],
  ["panel", "fallback", 4],
  ["disclaimer", "fallback", 4],

  // 脚注
  ["footnote", "footnote", 2],
  ["fallback", "footnote", 4],
];

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
// 表紙
// ------

const cover = [
  box(
    [
      p(coverLabel, {
        firstIndent: 0,
        size: 4,
        lineHeight: 6,
        effects: [fill(cyan)],
      }),
      vspace(4),
      h1(
        coverTitle.map((line) => [line]),
        {
          effects: [fill(white)],
          size: Q(44),
          lineHeight: em(1.4),
        },
      ),
      p(coverSubtitle, {
        firstIndent: 0,
        size: Q(22),
        lineHeight: em(1.5),
        effects: [fill(white)],
      }),
      vspace(8),
      p(coverDate, {
        firstIndent: 0,
        size: Q(20),
        lineHeight: 6,
        effects: [fill(cyan)],
      }),
    ],
    { padding: physical(24, 0, 10, 0), margin: bottom(32) },
  ),
  box(
    [
      p(coverDisclaimer, {
        firstIndent: 0,
        effects: [fill(white)],
      }),
    ],
    {
      padding: physical(4, 5),
      margin: bottom(5),
      background: [fill(cmyk(100, 100, 100, 100, 0.2))],
      border: all(solid(0.35, cyan)),
      borderRadius: 2,
    },
  ),
  ...(coverNote
    ? [p(coverNote, { firstIndent: 0, effects: [fill(white)] })]
    : []),
];

// ------
// 組版処理
// ------

const body: Body = [
  background,
  coverBackground,
  header,
  footer,
  ...cover,
  ...sections,
];

await minitype([{ body }], style, {
  fontDir: "fonts",
}).save("output.pdf");
