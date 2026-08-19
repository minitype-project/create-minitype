import {
  type Block,
  b,
  box,
  type CompositeFont,
  code,
  command,
  em,
  type Flow,
  fill,
  flexbox,
  fr,
  hsl,
  type InlineOrExtender,
  li1,
  newpage,
  oklch,
  p,
  page,
  physical,
  Q,
  rect,
  rgb,
  vspace,
} from "@minitype/minitype";

// スライドの枚数（進捗バーの計算に使用）．
// slidePage を追加・削除したときに更新すること．
export const TOTAL_PAGES = 7;

const HUE_START = 190;
const TEAL_L = 0.6;
const TEAL_C = 0.2;

let _hue = HUE_START;
let _i = 0;

export let TEAL = oklch(TEAL_L, TEAL_C, _hue);
export let BOX_BG = oklch(0.97, 0.03, _hue);
export let CODE_BG = oklch(0.2, 0.04, _hue);
export const RED = hsl(340, 80, 50);
export const DARK = rgb(34, 34, 34);
export const WHITE = rgb(255, 255, 255);
export const GRAY = rgb(180, 180, 180);

export const FR = "SourceHanSansJP-Regular";
export const FB = "SourceHanSansJP-Bold";
export const FM = "SourceCodePro-Regular";
export const FMB = "SourceCodePro-Bold";

export const WIDTH = 192;
export const HEIGHT = 108;

// ------
// インラインヘルパ
// ------

export const badge = (text: string) => {
  return command(text, {
    style: {
      font: FB,
      effects: [fill(WHITE)],
      background: [fill(TEAL)],
      padding: physical(1, 2.5, 1.1, 2.5),
      borderRadius: 2,
    },
  });
};

export const labelBadge = (text: string) => {
  return command(text, {
    style: {
      font: FB,
      effects: [fill(WHITE)],
      background: [fill(TEAL)],
      padding: physical(1, 3, 1.1, 3),
      borderRadius: 2,
    },
  });
};

export const s = (text: string | InlineOrExtender[]) => {
  return command(text, {
    style: {
      scale: em(0.8),
    },
  });
};

export const ss = (text: string | InlineOrExtender[]) => {
  return command(text, {
    style: {
      scale: em(0.7),
    },
  });
};

export const c = (inlines: InlineOrExtender[]) => {
  return command(inlines, {
    style: {
      effects: [fill(TEAL)],
    },
  });
};

export const r = (inlines: string | InlineOrExtender[]) => {
  return command(inlines, {
    style: {
      effects: [fill(RED)],
      font: FB,
    },
  });
};

export const teal = (text: string | InlineOrExtender[]) => {
  return command(text, {
    style: {
      effects: [fill(TEAL)],
    },
  });
};

// ------
// ブロックヘルパ
// ------
/**
 * スライドページを作成する．
 * @param title スライドのタイトル．
 * @param blocks スライドの内容を返す関数．
 * @returns スライドのブロック配列．
 */
export const slidePage = (title: string, blocks: () => Block[]): Block[] => {
  _i++;
  _hue = (HUE_START + ((_i - 1) * 360) / TOTAL_PAGES) % 360;
  TEAL = oklch(TEAL_L, TEAL_C, _hue);
  BOX_BG = oklch(0.97, 0.03, _hue);
  CODE_BG = oklch(0.2, 0.04, _hue);

  return [
    newpage(),
    box([
      p(title, { font: FB, effects: [fill(TEAL)], size: Q(22) }),
      vspace(0.5),
      rect(WIDTH - 12 * 2, 0.5, {
        background: [fill(BOX_BG)],
        align: "left",
      }),
      vspace(-0.5),
      rect(((WIDTH - 12 * 2) / TOTAL_PAGES) * _i, 0.5, {
        background: [fill(TEAL)],
        align: "left",
      }),
    ]),
    vspace(6),
    ...blocks(),
  ];
};

const CODE_FONT: CompositeFont = {
  default: { font: FR },
  latin: { font: FM },
  kana: { font: FR },
};

export const codeBox = (lines: string[], lang: string) => {
  return box(
    [
      code(lines, lang, {
        font: CODE_FONT,
        boldFont: FMB,
        highlight: "atom-one-dark",
        effects: [fill(WHITE)],
      }),
    ],
    {
      padding: physical(4, 5),
      background: [fill(CODE_BG)],
      borderRadius: 2,
    },
  );
};

export const bgBox = (blocks: Block[]) => {
  return box(blocks, {
    inlineSize: fr(1),
    padding: physical(5, 6),
    background: [fill(BOX_BG)],
    borderRadius: 2,
  });
};

export const badgeItems = (spacing: number) => {
  return (
    items: [
      num: string,
      titleText: string,
      desc?: string | InlineOrExtender[] | InlineOrExtender[][],
    ][],
  ): Block[] =>
    items.flatMap(([num, titleText, desc], i) => [
      ...(i > 0 ? [vspace(spacing)] : []),
      box(
        [
          p(
            [
              [badge(num), `  `, b(titleText)] as (
                | string
                | ReturnType<typeof b>
                | ReturnType<typeof badge>
              )[],
            ],
            { indent: 12, firstIndent: -12 },
          ),
          vspace(0.5),
          ...(desc
            ? [
                p(
                  typeof desc === "string"
                    ? desc
                    : desc.length > 0 && Array.isArray(desc[0])
                      ? (desc as InlineOrExtender[][])
                      : [desc as InlineOrExtender[]],
                  { indent: 12 },
                ),
              ]
            : []),
        ],
        { gapRole: "list1" },
      ),
    ]);
};

export const summaryRow = (label: string, bullets: (string | Block)[]) => {
  return flexbox(
    [
      box([p([[labelBadge(label)]])], { inlineSize: 22 }),
      box(
        bullets.map((b_) => (typeof b_ === "string" ? li1(`${b_}`) : b_)),
        { inlineSize: fr(1) },
      ),
    ],
    { gap: 0, alignItems: "start" },
  );
};

// ------
// フロー
// ------

export const titleBgFlow: Flow = {
  type: "flow",
  position: "page",
  blockOffset: 0,
  inlineSize: WIDTH,
  blocks: [
    rect(WIDTH, HEIGHT, {
      background: [fill(TEAL)],
      align: "left",
    }),
  ],
  page: (i) => i === 0,
  zIndex: -10,
};

export const pageNumRegular: Flow = {
  type: "flow",
  position: "page",
  inlineSize: 10,
  inlineOffset: WIDTH - 15,
  blockOffset: HEIGHT - 9,
  blocks: [p([[page]], { size: Q(16), align: "right" })],
  page: (i) => i > 0,
};
