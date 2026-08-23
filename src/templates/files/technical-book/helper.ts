import {
  all,
  type Block,
  bottom,
  box,
  type Command,
  cmyk,
  code as codeInner,
  fill,
  h2 as h2Inner,
  left,
  physical,
  solid,
} from "@minitype/minitype";

// ------
// 色定義
// ------

/** キーカラー（ダークブルー）． */
export const keyColor = cmyk(85, 55, 0, 20);

/** コードブロック背景色（ペールブルー）． */
export const subColor = cmyk(5, 0, 0, 0);

// ------
// インラインヘルパ
// ------

/**
 * インラインコードスタイルのコマンドを作成する．
 * commandStyles の `c` スタイル（等幅フォント，グレー背景）が適用される．
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
 * 左ボーダー付きの h2 ブロックを生成する．
 * @param title 見出しテキスト．
 * @returns h2 を内包するボックスブロック．
 */
export const h2 = (title: string) => {
  return box([h2Inner(title)], {
    padding: physical(2, 4),
    border: left(solid(1, keyColor)),
    gapRole: "h2",
  });
};

/**
 * 背景色付きのコードブロックを生成する．
 * @param lines コードの内容（改行区切りの文字列）．
 * @param lang シンタックスハイライトに使用する言語名．
 * @returns コードブロックを内包するボックスブロック．
 */
export const code = (lines: string, lang: string) => {
  return box([codeInner(lines, lang)], {
    padding: physical(3.5, 4),
    borderRadius: 2,
    background: [fill(subColor)],
  });
};

/**
 * 枠線付きの概要ボックスを生成する．
 * 章の冒頭に配置する要約文のスタイルに使用する．
 * @param inner ボックス内に配置するブロックの配列．
 * @returns 枠線・角丸付きのボックスブロック．
 */
export const abstract = (inner: Block[]) => {
  return box(inner, {
    margin: bottom(2),
    padding: physical(3, 4),
    border: all(solid(0.2, keyColor)),
    borderRadius: 2,
  });
};
