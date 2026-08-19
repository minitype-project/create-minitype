import {
  type TaggedFn,
  type TextStyle,
  text,
  withTemplate,
} from "@minitype/minitype";

/**
 * 通し番号が付与されない見出し（レベル 1）を作成する．
 * @param lines テキストの内容．文字列の場合は改行で分割される．
 * 文字列の一次元配列，または InlineOrExtender の二次元配列の場合はそのまま使用される．
 * タグ付きテンプレートリテラルとしても呼び出せる．
 * @param style テキストのスタイル．
 * @returns 見出しを表すブロック．
 */
export const h1Unnumbered: TaggedFn<
  Partial<TextStyle>,
  ReturnType<typeof text>
> = withTemplate((lines, style) => {
  return { ...text("h1", lines, style), unnumbered: true };
});

/**
 * 通し番号が付与されない小見出しを作成する．
 * @param lines テキストの内容．文字列の場合は改行で分割される．
 * 文字列の一次元配列，または InlineOrExtender の二次元配列の場合はそのまま使用される．
 * タグ付きテンプレートリテラルとしても呼び出せる．
 * @param style テキストのスタイル．
 * @returns 小見出しを表すブロック．
 */
export const h2Unnumbered: TaggedFn<
  Partial<TextStyle>,
  ReturnType<typeof text>
> = withTemplate((lines, style) => {
  return { ...text("h2", lines, style), unnumbered: true };
});
