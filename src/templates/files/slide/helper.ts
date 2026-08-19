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

const HUE_START = 190;
const KEY_L = 0.6;
const KEY_C = 0.2;

let _totalPages = 1;
let _hue = HUE_START;
let _i = 0;

// ------
// 色定義
// ------

/** ページごとに更新されるキーカラー． */
export let KEY = oklch(KEY_L, KEY_C, _hue);

/** ページごとに更新される背景ボックスカラー． */
export let BOX_BG = oklch(0.97, 0.03, _hue);

/** ページごとに更新されるコードブロック背景カラー． */
export let CODE_BG = oklch(0.2, 0.04, _hue);

/** 強調表示に使用する赤色． */
export const RED = hsl(340, 80, 50);

/** 本文テキストに使用するダークカラー． */
export const DARK = rgb(34, 34, 34);

/** 白色． */
export const WHITE = rgb(255, 255, 255);

/** 補足テキストに使用するグレーカラー． */
export const GRAY = rgb(180, 180, 180);

// ------
// フォント定義
// ------

/** 源ノ角ゴシック JP Regular のフォント名． */
export const FONT_R = "SourceHanSansJP-Regular";

/** 源ノ角ゴシック JP Bold のフォント名． */
export const FONT_B = "SourceHanSansJP-Bold";

/** Source Code Pro Regular のフォント名． */
export const FONT_CODE = "SourceCodePro-Regular";

/** Source Code Pro Bold のフォント名． */
export const FONT_CODE_B = "SourceCodePro-Bold";

/** スライドの幅（mm）． */
export const WIDTH = 192;

/** スライドの高さ（mm）． */
export const HEIGHT = 108;

// ------
// インラインヘルパ
// ------

/**
 * キーカラーのバッジインラインを作成する．
 * @param text バッジに表示するテキスト．
 * @returns バッジのインライン要素．
 */
export const badge = (text: string) => {
  return command(text, {
    style: {
      font: FONT_B,
      effects: [fill(WHITE)],
      background: [fill(KEY)],
      padding: physical(1, 2.5, 1.1, 2.5),
      borderRadius: 2,
    },
  });
};

/**
 * ラベル用のキーカラーバッジインラインを作成する．
 * {@link badge} より水平パディングが広い．
 * @param text バッジに表示するテキスト．
 * @returns バッジのインライン要素．
 */
export const labelBadge = (text: string) => {
  return command(text, {
    style: {
      font: FONT_B,
      effects: [fill(WHITE)],
      background: [fill(KEY)],
      padding: physical(1, 3, 1.1, 3),
      borderRadius: 2,
    },
  });
};

/**
 * テキストを 80% の大きさに縮小するインラインコマンドを作成する．
 * @param text 縮小するテキストまたはインライン要素の配列．
 * @returns 縮小スタイルを適用したインライン要素．
 */
export const s = (text: string | InlineOrExtender[]) => {
  return command(text, {
    style: {
      scale: em(0.8),
    },
  });
};

/**
 * テキストを 70% の大きさに縮小するインラインコマンドを作成する．
 * @param text 縮小するテキストまたはインライン要素の配列．
 * @returns 縮小スタイルを適用したインライン要素．
 */
export const ss = (text: string | InlineOrExtender[]) => {
  return command(text, {
    style: {
      scale: em(0.7),
    },
  });
};

/**
 * テキストにキーカラーを適用するインラインコマンドを作成する．
 * @param inlines キーカラーを適用するインライン要素の配列．
 * @returns キーカラースタイルを適用したインライン要素．
 */
export const c = (inlines: InlineOrExtender[]) => {
  return command(inlines, {
    style: {
      effects: [fill(KEY)],
    },
  });
};

/**
 * テキストに赤色・ボールドを適用するインラインコマンドを作成する．
 * @param inlines 赤色・ボールドを適用するテキストまたはインライン要素の配列．
 * @returns 赤色・ボールドスタイルを適用したインライン要素．
 */
export const r = (inlines: string | InlineOrExtender[]) => {
  return command(inlines, {
    style: {
      effects: [fill(RED)],
      font: FONT_B,
    },
  });
};

/**
 * テキストにキーカラーを適用するインラインコマンドを作成する．
 * {@link c} と異なり，文字列も受け付ける．
 * @param text キーカラーを適用するテキストまたはインライン要素の配列．
 * @returns キーカラースタイルを適用したインライン要素．
 */
export const key = (text: string | InlineOrExtender[]) => {
  return command(text, {
    style: {
      effects: [fill(KEY)],
    },
  });
};

// ------
// ブロックヘルパ
// ------

/** スライドページを生成するファクトリ関数の型． */
export type SlideFactory = () => Block[];

/**
 * スライドファクトリ関数の配列を受け取り，総ページ数を確定してからスライドを生成する．
 * @param factories 各スライドのブロック配列を返すファクトリ関数の配列．
 * @returns 全スライドのブロック配列．
 */
export const initSlides = (factories: (() => Block[])[]): Block[] => {
  _totalPages = factories.length;
  _i = 0;
  return factories.flatMap((factory) => factory());
};

/**
 * スライドページを作成する．
 * @param title スライドのタイトル．
 * @param blocks スライドの内容を返す関数．
 * @returns スライドのブロック配列．
 */
export const slidePage = (title: string, blocks: () => Block[]): Block[] => {
  _i++;
  _hue = (HUE_START + ((_i - 1) * 360) / _totalPages) % 360;
  KEY = oklch(KEY_L, KEY_C, _hue);
  BOX_BG = oklch(0.97, 0.03, _hue);
  CODE_BG = oklch(0.2, 0.04, _hue);

  return [
    newpage(),
    box([
      p(title, { font: FONT_B, effects: [fill(KEY)], size: Q(22) }),
      vspace(0.5),
      rect(WIDTH - 12 * 2, 0.5, {
        background: [fill(BOX_BG)],
        align: "left",
      }),
      vspace(-0.5),
      rect(((WIDTH - 12 * 2) / _totalPages) * _i, 0.5, {
        background: [fill(KEY)],
        align: "left",
      }),
    ]),
    vspace(6),
    ...blocks(),
  ];
};

const CODE_FONT: CompositeFont = {
  default: { font: FONT_R },
  latin: { font: FONT_CODE },
  kana: { font: FONT_R },
};

/**
 * シンタックスハイライト付きのコードブロックを作成する．
 * @param lines コードの各行の文字列配列．
 * @param lang ハイライトに使用するプログラミング言語名．
 * @returns コードブロックのブロック要素．
 */
export const codeBox = (lines: string[], lang: string) => {
  return box(
    [
      code(lines, lang, {
        font: CODE_FONT,
        boldFont: FONT_CODE_B,
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

/**
 * テーマカラーの背景を持つボックスを作成する．
 * @param blocks ボックス内に配置するブロック要素の配列．
 * @returns 背景付きボックスのブロック要素．
 */
export const bgBox = (blocks: Block[]) => {
  return box(blocks, {
    inlineSize: fr(1),
    padding: physical(5, 6),
    background: [fill(BOX_BG)],
    borderRadius: 2,
  });
};

/**
 * バッジ付きのリストアイテムを生成する関数を作成する．
 * @param spacing アイテム間の垂直スペース（mm）．
 * @returns アイテムの配列を受け取り，ブロック配列を返す関数．
 */
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

/**
 * ラベルバッジと箇条書きを横並びに配置するサマリー行を作成する．
 * @param label 左側に表示するラベルバッジのテキスト．
 * @param bullets 右側に表示する箇条書き文字列またはブロック要素の配列．
 * @returns サマリー行のブロック要素．
 */
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

/**
 * タイトルページ全面をキーカラーで塗りつぶすフロー定義．
 */
export const titleBgFlow: Flow = {
  type: "flow",
  position: "page",
  blockOffset: 0,
  inlineSize: WIDTH,
  blocks: [
    rect(WIDTH, HEIGHT, {
      background: [fill(KEY)],
      align: "left",
    }),
  ],
  page: (i) => i === 0,
  zIndex: -10,
};

/**
 * タイトルページを除く各ページ右下にノンブルを表示するフロー．
 */
export const pageNumRegular: Flow = {
  type: "flow",
  position: "page",
  inlineSize: 10,
  inlineOffset: WIDTH - 15,
  blockOffset: HEIGHT - 9,
  blocks: [p([[page]], { size: Q(16), align: "right" })],
  page: (i) => i > 0,
};
