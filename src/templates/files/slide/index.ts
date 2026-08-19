import {
  em,
  type Flow,
  fill,
  minitype,
  p,
  physical,
  Q,
  vspace,
} from "@minitype/minitype";
import { author, date, slidePages, subtitle, title } from "./document.js";
import {
  DARK,
  FONT_B,
  FONT_CODE,
  FONT_R,
  HEIGHT,
  initSlides,
  pageNumRegular,
  titleBgFlow,
  WHITE,
  WIDTH,
} from "./helper.js";

const slides = initSlides(slidePages);

// ------
// タイトルページ
// ------

const titleTextFlow: Flow = {
  type: "flow",
  position: "page",
  inlineOffset: 12,
  blockOffset: HEIGHT * 0.3,
  inlineSize: WIDTH - 24,
  blocks: [
    p(title, {
      font: FONT_B,
      size: Q(36),
      lineHeight: em(1.3),
      firstIndent: 0,
      effects: [fill(WHITE)],
    }),
    p(subtitle, {
      size: Q(20),
      firstIndent: 0,
      effects: [fill(WHITE)],
    }),
    vspace(8),
    p(author, {
      size: Q(18),
      firstIndent: 0,
      effects: [fill(WHITE)],
    }),
    p(date, {
      size: Q(18),
      firstIndent: 0,
      effects: [fill(WHITE)],
    }),
  ],
  page: (i) => i === 0,
};

// ------
// ボディ
// ------

const body = [titleBgFlow, titleTextFlow, pageNumRegular, ...slides];

// ------
// 組版処理
// ------

await minitype(
  [{ body }],
  {
    size: { width: WIDTH, height: HEIGHT },
    writingMode: "horizontal",
    padding: physical(7.5, 12, 4, 12),
    block: {
      paragraph: {
        font: FONT_R,
        size: Q(20),
        lineHeight: em(1.5),
        kerning: true,
        firstIndent: 0,
        align: "left",
        effects: [fill(DARK)],
      },
      h1: {
        font: FONT_B,
        size: Q(24),
        lineHeight: em(1.4),
        firstIndent: 0,
        headingNumberFormat: () => "",
        effects: [fill(DARK)],
      },
      h2: {
        font: FONT_B,
        size: Q(22),
        lineHeight: em(1.4),
        firstIndent: 0,
        headingNumberFormat: () => "",
        effects: [fill(DARK)],
      },
      li1: {
        font: FONT_R,
        indent: em(0.6),
        firstIndent: em(-1),
        marker: (listType, indices) =>
          listType === "ordered" ? `${indices[0]}.` : `・`,
      },
      li2: {
        font: FONT_R,
        indent: em(2),
        firstIndent: em(-1),
        marker: () => `・`,
      },
      code: {
        font: FONT_CODE,
        size: Q(13),
        firstIndent: 0,
      },
    },
    command: {
      b: { font: FONT_B },
    },
    gaps: [["fallback", "fallback", 1]],
  },
  { fontDir: "fonts" },
).save("output.pdf");
