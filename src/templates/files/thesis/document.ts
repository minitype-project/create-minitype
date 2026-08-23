import {
  autoref,
  type Body,
  clearpage,
  easytable,
  em,
  type Flow,
  figure,
  float,
  fn,
  footnote,
  type Group,
  H,
  il,
  inlineMath,
  li1,
  li2,
  listOfImages,
  lstlisting,
  math,
  p,
  page,
  physical,
  Q,
  ratio,
  toc,
  vspace,
} from "@minitype/minitype";
import { boldFont, H1, H2, H3 } from "./helper.js";
import { bibliography, cite } from "./refs.js";

// ------
// 論文情報
// ------

/** 論文タイトル（日本語）． */
const title = "論文タイトル";
/** 論文タイトル（英語）． */
const titleEn = "Thesis Title in English";
/** 著者名． */
const authorName = "著者 氏名";
/** 指導教員名． */
const supervisor = "教授 〇〇 〇〇";
/** 年度． */
const fiscalYear = "〇〇〇〇";
/** 提出年月（例：2025 年 3 月）． */
const submissionDate = "YYYY 年 MM 月";

// ------
// タイトルページ
// ------

export const titleGroup: Group = {
  body: [
    {
      type: "flow",
      position: "page",
      inlineOffset: 30,
      blockOffset: 70,
      inlineSize: 150,
      blocks: [
        p(`${fiscalYear}年度 卒業論文`, {
          align: "center",
          firstIndent: 0,
          size: Q(20),
          lineHeight: em(1.5),
        }),
        vspace(20),
        p(title, {
          align: "center",
          firstIndent: 0,
          font: boldFont,
          size: Q(28),
          lineHeight: em(1.5),
        }),
        p(titleEn, {
          align: "center",
          firstIndent: 0,
          size: Q(18),
          lineHeight: em(1.5),
        }),
        vspace(40),
        p(authorName, {
          align: "center",
          firstIndent: 0,
          font: boldFont,
          size: Q(28),
          lineHeight: em(1.5),
        }),
        vspace(5),
        p(`指導教員：${supervisor}`, {
          align: "center",
          firstIndent: 0,
          size: Q(20),
          lineHeight: em(1.5),
        }),
        vspace(10),
        p(submissionDate, {
          align: "center",
          firstIndent: 0,
          size: Q(20),
          lineHeight: em(1.5),
        }),
      ],
    },
  ],
};

// ------
// ノンブル
// ------

const nombre: Flow = {
  type: "flow",
  position: "nombre",
  blockOffset: 6,
  blocks: [
    p([[page]], {
      firstIndent: 0,
      align: "center",
      size: Q(12),
      lineHeight: em(1),
    }),
  ],
};

// ------
// フロントマター
// ------

const frontMatter: Body = [
  H1("概要", "abstract", true),
  p`本論文では，〜について研究した．〜の問題に対して，〜手法を提案した．実験により，〜であることを確認した．`,
  clearpage(),

  H1("目次", "toc-heading", true),
  toc({
    filter: (_, text) => !(text.includes("概要") || text.includes("目次")),
    showIndex: true,
    indexFormat: {
      1: (index) => `第${index[0]}章`,
    },
    levelStyles: {
      1: {
        firstIndent: 0,
        indent: 0,
        font: boldFont,
      },
      2: {
        firstIndent: em(1),
        indent: 0,
      },
      3: {
        firstIndent: em(2),
        indent: 0,
      },
    },
    levelSpaceBefore: {
      1: 4,
    },
    hboxWidth: (level) => em(5 - (level - 1)),
  }),
  clearpage(),

  H1("図目次", "lof-heading", true),
  listOfImages({
    showIndex: true,
    style: {
      firstIndent: em(-4),
      indent: em(4),
    },
    spaceBefore: 4,
    hboxWidth: () => em(4),
  }),
  clearpage(),
];

// ------
// 第1章
// ------

const chapter1: Body = [
  H1("はじめに", "ch1"),
  p`本章では，研究の背景，研究の目的，および本論文の構成を示す．`,

  H2("研究背景", "s1-1"),
  p`〜という問題が存在する${fn("fn-bg")}．`,
  footnote("fn-bg", "詳細は文献 [1] を参照されたい．"),

  H2("研究目的", "s1-2"),
  p`本研究の目的は，〜である．`,
  li1`目的1：〜`,
  li2`詳細：〜`,
  li1`目的2：〜`,
  li1`目的3：〜`,
  vspace(4),

  H2("本論文の構成", "s1-3"),
  p`本論文の構成を示す．`,

  clearpage(),
];

// ------
// 第2章
// ------

const chapter2: Body = [
  H1("関連研究", "ch2"),
  p`関連研究を概観する ${cite("r01", "r02")}．`,

  H2("先行研究A", "s2-1"),
  p`先行研究Aについての説明 ${cite("r01")}．`,

  H2("先行研究B", "s2-2"),
  p`先行研究Bについての説明と本研究との差別化．`,

  clearpage(),
];

// ------
// 第3章
// ------

const chapter3: Body = [
  H1("提案手法", "ch3"),
  p`提案手法の詳細を説明する．`,

  H2("概要", "s3-1"),
  p`提案手法の全体的な流れを説明する．`,
  li1`ステップ1：入力データの前処理`,
  li2`詳細：〜の形式に変換する`,
  li1`ステップ2：特徴抽出`,
  li1`ステップ3：推論と後処理`,
  vspace(4),

  H2("詳細", "s3-2"),
  H3("定式化", "s3-2-1"),
  p`入力 ${inlineMath("x \\in \\mathbb{R}^d")} に対して，変換 ${inlineMath("f")} を適用し出力 ${inlineMath("y")} を得る．`,
  math(["y = \\hat{y} = \\text{argmax}_{y \\in Y} P(y | x)"]),

  H3("実装", "s3-2-2"),
  p`提案手法の実装例を示す．`,
  lstlisting(["def propose(x):", "    # 提案手法の実装", "    return result"], {
    lang: "python",
    title: "propose.py",
  }),

  clearpage(),
];

// ------
// 第4章
// ------

const chapter4: Body = [
  H1("実験と評価", "ch4"),
  p`実験設定と結果について述べる．`,

  H2("実験設定", "s4-1"),
  p`実験の設定を説明する．`,
  li1`実験環境`,
  li2`CPU：〜，GPU：〜，メモリ：〜`,
  li1`データセット：〜データセット（学習：〜件，評価：〜件）`,
  li1`評価指標：精度（Accuracy），F1 スコア（マクロ平均）`,
  vspace(4),

  H2("実験結果", "s4-2"),
  float("top", [
    figure("src/sample.png", "実験結果のグラフ", {
      width: ratio(0.9),
      align: "center",
      label: "fig-result",
    }),
  ]),
  p`${autoref("fig-result")}に実験結果を示す．${autoref("table:results")}に各手法の定量的比較を示す．`,
  easytable(
    [
      ["手法", "精度（%）", "再現率（%）", "F1 スコア"],
      [il`ベースライン A ${cite("r01")}`, "XX.X", "XX.X", "XX.X"],
      [il`ベースライン B ${cite("r02")}`, "XX.X", "XX.X", "XX.X"],
      ["提案手法", "XX.X", "XX.X", "XX.X"],
    ],
    {
      caption: "各手法の定量的比較",
      label: "table:results",
      style: {
        cellPadding: physical(2, 4),
        textStyle: (rowIndex) => ({
          lineHeight: H(18),
          font: rowIndex === 0 ? boldFont : undefined,
        }),
      },
    },
  ),

  clearpage(),
];

// ------
// 第5章
// ------

const chapter5: Body = [
  H1("考察", "ch5"),
  p`実験結果の考察を述べる．`,

  clearpage(),
];

// ------
// 第6章
// ------

const chapter6: Body = [
  H1("おわりに", "ch6"),
  p`本研究のまとめと今後の課題を述べる．`,

  H2("まとめ", "s6-1"),
  p`本論文では，〜を提案した．`,

  H2("今後の課題", "s6-2"),
  p`今後は〜を検討する予定である．`,

  clearpage(),
];

// ------
// 参考文献
// ------

const references: Body = [
  H1("参考文献", "references", true),
  ...bibliography({ indent: em(3) }),
  clearpage(),
];

// ------
// 本文
// ------

const mainBody: Body = [
  nombre,
  ...frontMatter,
  ...chapter1,
  ...chapter2,
  ...chapter3,
  ...chapter4,
  ...chapter5,
  ...chapter6,
  ...references,
];

export const mainGroup: Group = {
  body: mainBody,
  pageIndex: 1,
  labelOptions: {
    counterResetAt: 1,
  },
};
