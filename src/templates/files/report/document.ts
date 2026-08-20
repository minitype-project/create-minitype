import {
  autoref,
  type Block,
  easytable,
  figure,
  fn,
  footnote,
  H,
  h2,
  h3,
  li1,
  li2,
  lstlisting,
  math,
  p,
  physical,
  ratio,
} from "@minitype/minitype";

import { h2Unnumbered } from "./helper.js";
import { bibliography, cite } from "./refs.js";

// ------
// タイトル，著者，日付
// ------

/**
 * レポートのタイトル．
 */
export const title = "レポートタイトル";
/**
 * レポートの著者．
 */
export const author = "〇〇 〇〇";
/**
 * レポートの日付．
 * - true の場合は今日の日付を表示する．
 * - false の場合は日付を表示しない．
 * - string の場合はその文字列を表示する．
 */
export const date: boolean | string = true;

// ------
// 本文
// ------

export const mainContent: Block[] = [
  h2`はじめに`,
  p`ここに序論を書きます．
  本レポートでは，〜について述べます${fn("footnote")}．`,
  footnote("footnote", "脚注を挿入することもできます．"),

  h2`本論`,
  h3`背景`,
  p`ここに背景を書きます．`,

  h3`方法`,
  p`実験の方法を説明します．`,
  li1`手順 1：〜を行う`,
  li1`手順 2：〜を行う`,
  li2`詳細：〜`,
  li1`手順 3：〜を行う`,

  h3`実装`,
  p`実装のコード例を示します．`,
  lstlisting(
    ["function hello(): void {", '  console.log("Hello, minitype!");', "}"],
    { lang: "typescript", title: "hello.ts" },
  ),
  p`以下に図を示します．`,
  figure("src/sample.png", "サンプル画像", {
    width: ratio(0.6),
    align: "center",
  }),

  h3`数式`,
  p`数式の例を示します．`,
  math(["E = mc^2"]),

  h3`実験結果`,

  p`${autoref("figure:result")} に実験結果を示します ${cite("reference2023")}．
  〜の結果，〜であることが確認されました．


  float("top", [
    figure("src/sample.png", "〜の実験結果", {
      width: ratio(0.8),
      align: "center",
      label: "figure:result",
    }),
  ]),

  ${autoref("table:results")} に各手法の定量的な比較を示します．`,

  easytable(
    [
      ["手法", "精度（%）", "再現率（%）", "F1 スコア"],
      ["手法 A", "85.2", "83.7", "84.4"],
      ["手法 B", "87.5", "86.1", "86.8"],
      ["提案手法", "91.3", "90.8", "91.0"],
    ],
    {
      caption: "各手法の定量的比較",
      label: "table:results",
      style: {
        cellPadding: physical(2, 2),
        textStyle: (rowIndex) => ({
          lineHeight: H(15),
          font: rowIndex === 0 ? "SourceHanSansJP-Regular" : undefined,
        }),
      },
    },
  ),

  h2`まとめ`,
  p`本レポートでは，〜について述べました．
  今後の課題として，〜が挙げられます．`,

  h2Unnumbered`参考文献`,
  ...bibliography(),
];
