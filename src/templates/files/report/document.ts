import {
  type Block,
  code,
  figure,
  float,
  fn,
  footnote,
  h1,
  h2,
  h3,
  li1,
  li2,
  math,
  p,
  ratio,
  vspace,
} from "@minitype/minitype";

import { h2Unnumbered } from "./helper.js";
import { bibliography, cite } from "./refs.js";

// ------
// タイトル
// ------

const today = new Date().toLocaleDateString("ja-JP", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const titleBlock: Block[] = [
  h1`レポートタイトル`,
  p({ align: "center" })`著者名：〇〇 〇〇`,
  p([[today]], { align: "center" }),
  vspace(6),
];

// ------
// 本文
// ------

export const mainContent: Block[] = [
  h2`はじめに`,
  p`ここに序論を書きます．本レポートでは，〜について述べます．`,

  h2`本論`,
  h3`背景`,
  p`ここに背景を書きます．先行研究 ${cite("example2024")} では，〜が示されています．脚注の例${fn("note1")}も示します．`,
  footnote("note1", "これは脚注の例です．"),

  h3`方法`,
  p`実験の方法を説明します．`,
  li1`手順 1：〜を行う`,
  li1`手順 2：〜を行う`,
  li2`詳細：〜`,
  li1`手順 3：〜を行う`,

  h3`実装`,
  p`実装のコード例を示します．`,
  code(
    ["function hello(): void {", '  console.log("Hello, minitype!");', "}"],
    "typescript",
  ),

  h3`数式`,
  p`数式の例を示します．`,
  math(["E = mc^2"]),

  h3`実験結果`,
  float("top", [
    figure("src/result.png", "〜の実験結果", {
      width: ratio(0.8),
      align: "center",
    }),
  ]),
  p`図 1 に実験結果を示します ${cite("reference2023")}．〜の結果，〜であることが確認された．`,

  h2`まとめ`,
  p`本レポートでは，〜について述べました．今後の課題として，〜が挙げられます．`,

  h2Unnumbered`参考文献`,
  ...bibliography(),
];
