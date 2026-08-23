import {
  all,
  type Block,
  bottom,
  box,
  type Command,
  cmyk,
  code as codeInner,
  type Flow,
  fill,
  h2 as h2Inner,
  h3 as h3Inner,
  left,
  p,
  page,
  physical,
  Q,
  solid,
} from "@minitype/minitype";

// ------
// ページレイアウト定数
// ------

/** ページ幅（mm）． */
export const pageWidth = 182;
/** ヘッダー画像の高さ（mm）． */
export const headerImageHeight = 50;

// ------
// 色定義
// ------

/** キーカラー（マゼンタ）． */
export const magenta = cmyk(0, 80, 0, 0);
/** コード背景色（ペール）． */
export const pale = cmyk(0, 5, 0, 0);
/** 白色． */
export const white = cmyk(0, 0, 0, 0);

// ------
// フロー
// ------

/**
 * 柱フロー．
 * 2ページ目以降にタイトルとボーダーラインを描画する．
 */
export const header: Flow = {
  type: "flow",
  position: "pillar",
  blockOffset: -14,
  blocks: [
    box(
      [
        p("{{projectName}}", {
          align: (pageIndex: number) =>
            pageIndex % 2 === 1 ? "right" : "left",
          font: "SourceHanSansJP-Regular",
          firstIndent: 0,
          size: Q(11),
        }),
      ],
      {
        padding: bottom(2),
        border: bottom(solid(0.2, magenta)),
      },
    ),
  ],
  page: (pageIndex: number) => pageIndex >= 1,
};

/**
 * ノンブルフロー．
 * 全ページにページ番号を中央揃えで表示する．
 */
export const footer: Flow = {
  type: "flow",
  position: "nombre",
  blockOffset: 6,
  blocks: [
    p([[page]], {
      align: "center",
      firstIndent: 0,
      size: Q(11),
    }),
  ],
};

// ------
// インラインヘルパ
// ------

/**
 * インラインコードスタイルのコマンドを作成する．
 * commandStyles の `c` スタイル（等幅フォント）が適用される．
 * @param text コードとして表示するテキスト．
 * @returns インラインコマンド要素．
 */
export const c = (text: string): Command => {
  return { type: "command", name: "c", body: [text] };
};

// ------
// ブロックヘルパ
// ------

/**
 * マゼンタ背景の h2 ブロックを生成する．
 * @param title - 見出しテキスト．
 */
export const h2 = (title: string): Block => {
  return box([h2Inner(title)], {
    padding: physical(3, 4),
    background: [fill(magenta)],
    borderRadius: 2,
    gapRole: "h2",
  });
};

/**
 * 左ボーダー付きの h3 ブロックを生成する．
 * @param title - 見出しテキスト．
 */
export const h3 = (title: string): Block => {
  return box([h3Inner(title)], {
    padding: physical(2, 0, 2, 4),
    border: left(solid(1, magenta)),
    gapRole: "h3",
  });
};

/**
 * 枠線付きの概要ボックスを生成する．
 * @param inner - ボックス内に配置するブロックの配列．
 */
export const abstract = (inner: Block[]): Block => {
  return box(inner, {
    margin: bottom(2),
    padding: physical(3, 4),
    border: all(solid(0.2, magenta)),
    borderRadius: 2,
  });
};

/**
 * 背景色付きのコードブロックを生成する．
 * @param lines - コードの内容（改行区切りの文字列）．
 * @param lang - シンタックスハイライトに使用する言語名．
 */
export const code = (lines: string, lang?: string): Block => {
  return box([codeInner(lines, lang)], {
    padding: physical(3, 4),
    borderRadius: 2,
    background: [fill(pale)],
    gapRole: "code",
  });
};
