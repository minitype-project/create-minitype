import {
  all,
  type Body,
  b,
  bottom,
  box,
  cmyk,
  em,
  fill,
  h1,
  h3,
  li1,
  newpage,
  p,
  physical,
  Q,
  solid,
  vspace,
} from "@minitype/minitype";

import {
  background,
  callout,
  coverBackground,
  cyan,
  disclaimer,
  footer,
  header,
  metric,
  panel,
  section,
  visual,
  white,
} from "./utils.js";

const reportDate = "2026年度版";

export const body: Body = [
  background,
  coverBackground,
  header,
  footer,

  // ------
  // 表紙
  // ------

  box(
    [
      p("BUSINESS REPORT", {
        firstIndent: 0,
        size: 4,
        lineHeight: 6,
        effects: [fill(cyan)],
      }),
      vspace(4),
      h1([["{{projectName}}"]], {
        effects: [fill(white)],
        size: Q(44),
        lineHeight: em(1.4),
      }),
      p("事業の現状と今後の展望", {
        firstIndent: 0,
        size: Q(22),
        lineHeight: em(1.5),
        effects: [fill(white)],
      }),
      vspace(8),
      p(reportDate, {
        firstIndent: 0,
        size: Q(20),
        lineHeight: 6,
        effects: [fill(cyan)],
      }),
    ],
    { padding: physical(24, 0, 10, 0), margin: bottom(32) },
  ),
  box(
    [
      p(
        "本資料は情報提供を目的としたものであり，特定の商品・サービスの推奨を目的とするものではありません．",
        {
          firstIndent: 0,
          effects: [fill(white)],
        },
      ),
    ],
    {
      padding: physical(4, 5),
      margin: bottom(5),
      background: [fill(cmyk(100, 100, 100, 100, 0.2))],
      border: all(solid(0.35, cyan)),
      borderRadius: 2,
    },
  ),

  // ------
  // エグゼクティブサマリー
  // ------

  newpage(),
  ...section("エグゼクティブサマリー", [
    callout(
      "要点",
      "ここに報告書の要点を記載します．本報告書では〜について分析・報告します．",
    ),
    metric("指標 A", "〇〇〇", "補足説明"),
    metric("指標 B", "〇〇〇", "補足説明"),
    metric("指標 C", "〇〇〇", "補足説明"),
  ]),

  // ------
  // 概要
  // ------

  newpage(),
  ...section("概要", [
    p`ここに概要を記述します．`,
    visual("src/assets/sample.png"),
    panel([
      h3`項目 A`,
      p("ここに項目 A の説明を記述します．", { firstIndent: 0 }),
      li1`詳細 1`,
      li1`詳細 2`,
      h3`項目 B`,
      p("ここに項目 B の説明を記述します．", { firstIndent: 0 }),
      li1`詳細 1`,
      li1`詳細 2`,
    ]),
  ]),

  // ------
  // 詳細分析
  // ------

  newpage(),
  ...section("詳細分析", [
    p`ここに詳細な分析内容を記述します．`,
    callout("ポイント", "重要な観点や注意点をここに記載します．"),
    visual("src/assets/sample.png"),
    panel([
      h3`分析結果 A`,
      p([[b("重要な発見：")], ["ここに分析結果を記述します．"]], {
        firstIndent: 0,
      }),
      h3`分析結果 B`,
      p([[b("重要な発見：")], ["ここに分析結果を記述します．"]], {
        firstIndent: 0,
      }),
    ]),
  ]),

  // ------
  // まとめ
  // ------

  newpage(),
  ...section("まとめと今後の展望", [
    p`本報告書では，〜について分析・報告しました．`,
    p`今後の課題として，〜が挙げられます．`,
    li1`課題 1：ここに課題を記述します．`,
    li1`課題 2：ここに課題を記述します．`,
    li1`課題 3：ここに課題を記述します．`,
    disclaimer([
      p(
        "本資料は情報提供を目的としたものです．最終的な判断はご自身の責任で行ってください．",
        { firstIndent: 0 },
      ),
    ]),
  ]),
];
