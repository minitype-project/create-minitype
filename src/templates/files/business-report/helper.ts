import {
  all,
  type Block,
  type Body,
  b,
  bottom,
  box,
  cmyk,
  type Flow,
  fill,
  h1,
  h2 as h2Inner,
  imageFill,
  left,
  p,
  page,
  physical,
  Q,
  rect,
  solid,
} from "@minitype/minitype";

// ------
// サイズ
// ------

/** ページ幅（mm）． */
export const pageWidth = 182;

/** ページ高さ（mm）． */
export const pageHeight = 257;

// ------
// 色定義
// ------

/** キーカラー（ダークネイビー）． */
export const keyColor = cmyk(100, 70, 20, 45);
/** 薄い背景色（ペールブルー）． */
export const pale = cmyk(10, 5, 0, 0);
/** ネイビー． */
export const navy = cmyk(100, 70, 15, 45);
/** シアン． */
export const cyan = cmyk(65, 5, 0, 0);
/** 白色． */
export const white = cmyk(0, 0, 0, 0);
/** グレーがかった青． */
export const muted = cmyk(60, 35, 25, 20);

const blue = cmyk(88, 48, 0, 12);
const line = cmyk(42, 12, 0, 0);

// ------
// ブロック定数
// ------

/**
 * ヘッダーフロー．
 * 2ページ目以降に表示され，プロジェクト名とボーダーラインを描画する．
 */
export const header: Flow = {
  type: "flow",
  position: "pillar",
  blockOffset: -16,
  blocks: [
    box(
      [
        p("{{projectName}}", {
          align: (pageIndex: number) =>
            pageIndex % 2 === 1 ? "right" : "left",
          font: "SourceHanSansJP-Regular",
          firstIndent: 0,
          size: 3,
          lineHeight: 4.5,
          effects: [fill(cyan)],
        }),
      ],
      {
        padding: bottom(3),
        border: bottom(solid(0.2, cyan)),
      },
    ),
  ],
  page: (pageIndex: number) => pageIndex > 0,
};

/**
 * フッターフロー．
 * 2ページ目以降にページ番号を中央揃えで表示する．
 */
export const footer: Flow = {
  type: "flow",
  position: "nombre",
  blockOffset: 8,
  blocks: [
    p([[page]], {
      align: "center",
      firstIndent: 0,
      size: 3,
      lineHeight: 4.5,
      effects: [fill(muted)],
    }),
  ],
  page: (pageIndex: number) => pageIndex > 0,
};

/**
 * 背景フロー．
 * 全ページに適用され，ネイビーのヘッダー帯，シアンのアクセントライン，左端のペール帯を描画する．
 */
export const background: Flow = {
  type: "flow",
  position: "page",
  blockOffset: 0,
  blocks: [
    rect(pageWidth, pageHeight, { background: [fill(white)] }),
    rect(pageWidth, 22, { background: [fill(navy)] }),
    rect(pageWidth, 5, { background: [fill(cyan)] }),
    rect(9, pageHeight, { background: [fill(pale)] }),
  ],
  page: () => true,
  zIndex: -30,
};

/**
 * 表紙背景フロー．
 * 1ページ目のみに適用され，カバー画像をページ全体に表示する．
 */
export const coverBackground: Flow = {
  type: "flow",
  position: "page",
  blockOffset: 0,
  blocks: [
    rect(pageWidth, pageHeight, {
      background: [
        imageFill("src/assets/cover.jpg", "cover", ["middle", "center"]),
      ],
    }),
  ],
  page: (pageIndex: number) => pageIndex === 0,
  zIndex: -20,
};

// ------
// ブロックヘルパ関数
// ------

/**
 * 左ボーダー付きの h2 ブロックを生成する．
 * @param title - 見出しテキスト．
 */
export const h2 = (title: string) => {
  return box([h2Inner(title)], {
    padding: physical(2, 4),
    border: left(solid(1, keyColor)),
  });
};

/**
 * タイトルとブロック群からセクションのボディを生成する．
 * @param title - セクションタイトル．
 * @param blocks - セクション内に配置するブロックの配列．
 */
export const section = (title: string, blocks: Block[]): Body => {
  return [h1(title), ...blocks];
};

/**
 * 指定した画像ファイルをページ幅に合わせて表示するビジュアルブロックを生成する．
 * @param src - 画像ファイルのパス．
 */
export const visual = (src: string): Block => {
  return box(
    [
      rect(Q(14) * 38, 24, {
        background: [imageFill(src, "cover", ["middle", "center"])],
      }),
    ],
    {
      margin: bottom(4),
    },
  );
};

/**
 * 枠線と背景色を持つパネルブロックを生成する．
 * @param blocks - パネル内に配置するブロックの配列．
 * @param _accent - アクセントカラー（現在未使用）．
 * @default _accent blue
 */
export const panel = (blocks: Block[], _accent = blue): Block => {
  return box(blocks, {
    padding: physical(4, 5),
    margin: bottom(5),
    border: all(solid(0.25, line)),
    background: [fill(cmyk(4, 1, 0, 0))],
    borderRadius: 2,
    gapRole: "panel",
  });
};

/**
 * タイトルと本文を持つコールアウトブロックを生成する．
 * @param title - コールアウトのタイトル（太字で表示）．
 * @param text - コールアウトの本文テキスト．
 */
export const callout = (title: string, text: string): Block => {
  return box(
    [
      p([[b(title)]], { firstIndent: 0, effects: [fill(navy)] }),
      p(text, { firstIndent: 0 }),
    ],
    {
      padding: physical(3, 4),
      margin: bottom(5),
      border: all(solid(0.35, cyan)),
      background: [fill(cmyk(12, 2, 0, 0))],
      borderRadius: 2,
      gapRole: "callout",
    },
  );
};

/**
 * ラベル，値，補足テキストを縦に並べたメトリクスブロックを生成する．
 * @param label - メトリクスのラベル（小さいテキストで表示）．
 * @param value - メトリクスの値（大きい太字で表示）．
 * @param note - メトリクスの補足テキスト（小さいテキストで表示）．
 */
export const metric = (label: string, value: string, note: string): Block => {
  return box(
    [
      p(label, {
        firstIndent: 0,
        size: 3,
        lineHeight: 5,
        effects: [fill(muted)],
      }),
      p([[b(value)]], {
        firstIndent: 0,
        size: 6,
        lineHeight: 8,
        effects: [fill(navy)],
      }),
      p(note, {
        firstIndent: 0,
        size: 3,
        lineHeight: 5,
        effects: [fill(muted)],
      }),
    ],
    {
      padding: physical(3, 4),
      margin: bottom(3),
      border: all(solid(0.25, line)),
      background: [fill(white)],
      borderRadius: 2,
      gapRole: "metric",
    },
  );
};

/**
 * グレーの枠線と背景色を持つ免責事項ブロックを生成する．
 * @param blocks - 免責事項内に配置するブロックの配列．
 */
export const disclaimer = (blocks: Block[]): Block => {
  return box(blocks, {
    padding: physical(4, 5),
    margin: bottom(5),
    border: all(solid(0.25, cmyk(0, 0, 0, 50))),
    background: [fill(cmyk(0, 0, 0, 5))],
    borderRadius: 2,
    gapRole: "disclaimer",
  });
};
