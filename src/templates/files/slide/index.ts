import {
  box,
  cmyk,
  type DocumentStyle,
  em,
  type Flow,
  type Gap,
  type Group,
  H,
  minitype,
  newpage,
  p,
  page,
  physical,
  Q,
  vspace,
} from "@minitype/minitype";
import {
  accentColor,
  author,
  date,
  main,
  subtitle,
  title,
  whiteColor,
  whiteDimColor,
} from "./document.js";

export const width = 192;
export const height = 108;

const block: DocumentStyle["block"] = {
  paragraph: {
    font: "SourceHanSansJP-Regular",
    size: Q(16),
    lineHeight: em(1.8),
    firstIndent: 0,
  },
  h1: {
    font: "SourceHanSansJP-Bold",
    size: Q(18),
    lineHeight: H(28),
    firstIndent: 0,
  },
  h2: {
    font: "SourceHanSansJP-Regular",
    size: Q(15),
    lineHeight: H(24),
    firstIndent: 0,
  },
  list: {
    font: "SourceHanSansJP-Regular",
    firstIndent: em(-1),
  },
  code: {
    font: "SourceCodePro-Regular",
    size: Q(14),
    lineHeight: H(17),
    firstIndent: 0,
  },
  caption: {
    font: "SourceHanSansJP-Regular",
    size: Q(12),
    lineHeight: H(17),
    align: "center",
    firstIndent: 0,
  },
};

const gaps: Gap[] = [
  ["paragraph", "paragraph", 4],
  ["paragraph", "list1", 2],
  ["list1", "paragraph", 4],
  ["list1", "list1", 2],
  ["list1", "list2", 1],
  ["list2", "list1", 2],
  ["h1", "paragraph", 4],
  ["h2", "paragraph", 2],
  ["paragraph", "h1", 8],
  ["paragraph", "h2", 5],
  ["figure", "caption", 2],
  ["caption", "paragraph", 6],
  ["fallback", "fallback", 4],
];

const titleGroup: Group = {
  body: [
    // 背景
    {
      type: "flow",
      position: "page",
      inlineOffset: 0,
      blockOffset: 0,
      inlineSize: width,
      zIndex: -1,
      blocks: [box([vspace(143)], { background: accentColor })],
    },
    {
      type: "flow",
      position: "page",
      inlineOffset: 0,
      blockOffset: 34,
      inlineSize: width,
      blocks: [
        // タイトル，サブタイトル
        p(title, {
          align: "center",
          firstIndent: 0,
          font: "SourceHanSansJP-Bold",
          size: Q(36),
          lineHeight: em(1.2),
          effects: [{ type: "fill", color: whiteColor }],
        }),
        p(subtitle, {
          align: "center",
          firstIndent: 0,
          font: "SourceHanSansJP-Regular",
          size: Q(18),
          effects: [{ type: "fill", color: whiteDimColor }],
        }),
        vspace(8),

        // 発表者情報
        p(author, {
          align: "center",
          firstIndent: 0,
          font: "SourceHanSansJP-Regular",
          size: Q(18),
          lineHeight: H(21),
          effects: [{ type: "fill", color: whiteColor }],
        }),
        p(date, {
          align: "center",
          firstIndent: 0,
          size: Q(18),
          lineHeight: H(18),
          effects: [{ type: "fill", color: whiteDimColor }],
        }),
      ],
    },
  ],
};

/**
 * スライドタイトルを作成する．
 * @param title タイトル文字列．
 * @returns タイトルボックスブロック．
 */
const headline = (text: string, pageIndex: number): Flow => {
  return {
    type: "flow",
    position: "page",
    inlineOffset: 0,
    blockOffset: 0,
    inlineSize: width,
    blocks: [
      box(
        [
          p(text, {
            font: "SourceHanSansJP-Bold",
            size: Q(24),
            lineHeight: H(34),
            firstIndent: 0,
            effects: [{ type: "fill", color: whiteColor }],
          }),
        ],
        {
          background: accentColor,
          padding: physical(5, 10, 4, 10),
        },
      ),
    ],
    page: (inPageIndex: number) => inPageIndex === pageIndex,
  };
};

// フッタ（ページ番号）
const footer: Flow = {
  type: "flow",
  position: "nombre",
  inlineOffset: 2,
  blockOffset: -10,
  blocks: [
    p([[page]], {
      align: "right",
      firstIndent: 0,
      size: Q(16),
      lineHeight: H(15),
    }),
  ],
};

// 本文スライド
const body = [
  ...main.flatMap((pageMain, i) => [
    headline(pageMain[0], i + 1),
    ...pageMain[1],
    newpage(),
  ]),
  footer,
];

const mainGroup: Group = {
  body,
  pageIndex: 1,
};

await minitype(
  [titleGroup, mainGroup],
  {
    size: { width: 192, height: 108 },
    writingMode: "horizontal",
    padding: physical(22, 10, 0, 10),
    block,
    command: {
      b: { font: "SourceHanSansJP-Bold" },
      c: { font: "SourceCodePro-Regular", background: cmyk(0, 0, 0, 8) },
    },
    gaps,
  },
  {
    fontDir: "fonts",
  },
).save("output.pdf");
